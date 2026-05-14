import 'dotenv/config';
import OpenAI from 'openai';
import type { Site, Page, Block } from '../schema/types.js';
import {
  SHELL_SYSTEM_PROMPT, buildShellUserPrompt,
  PAGE_SYSTEM_PROMPT, buildPageUserPrompt,
  pickSeedForBrief,
  type SiteShell, type PagePlan, type StyleSeed,
} from './prompts.js';
import { getClient as getProviderClient, estimateCost, type Provider } from './providers.js';
import { enrichBrief } from './enrich.js';
import { enrichSiteImages } from './images.js';

const SUBMIT_SHELL_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'submit_shell',
    description: 'Submit the site shell: business, theme, globals, and block plan per page',
    parameters: {
      type: 'object',
      properties: { shell: { type: 'object', additionalProperties: true, description: 'Site shell without block content' } },
      required: ['shell'],
    },
  },
};

const SUBMIT_PAGE_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'submit_page',
    description: 'Submit the full blocks array for a single page',
    parameters: {
      type: 'object',
      properties: { blocks: { type: 'array', items: {}, description: 'Array of blocks for this page' } },
      required: ['blocks'],
    },
  },
};

export interface GenerateResult {
  site: Site;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number };
  estimatedCostUsd: number;
  provider: Provider;
  briefEnriched: boolean;
}

export type StreamEvent =
  | { type: 'status'; message: string }
  | { type: 'page'; slug: string }
  | { type: 'block'; blockType: string }
  | { type: 'done'; site: Site; usage: GenerateResult['usage']; estimatedCostUsd: number; provider: Provider; briefEnriched: boolean }
  | { type: 'error'; message: string };

const BLOCK_TYPES = new Set([
  'hero', 'trust_bar', 'services', 'about', 'process', 'testimonials',
  'pricing', 'faq', 'cta_banner', 'contact', 'stats', 'gallery', 'team', 'blog_grid',
  'logo_cloud', 'comparison', 'promo_banner', 'location_finder', 'booking_strip', 'core_values',
  'map', 'video',
]);

type UsageTotals = GenerateResult['usage'];

function accUsage(totals: UsageTotals, chunk: Record<string, unknown>) {
  totals.inputTokens         += (chunk.prompt_tokens          as number) ?? 0;
  totals.outputTokens        += (chunk.completion_tokens       as number) ?? 0;
  totals.cacheReadTokens     += (chunk.prompt_cache_hit_tokens  as number) ?? 0;
  totals.cacheCreationTokens += (chunk.prompt_cache_miss_tokens as number) ?? 0;
}

async function streamToolArgs(
  stream: AsyncIterable<OpenAI.Chat.ChatCompletionChunk>,
  onArgs?: (partial: string) => void,
  totals?: UsageTotals,
): Promise<string> {
  let fullArgs = '';
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.tool_calls?.[0]?.function?.arguments;
    if (delta) {
      fullArgs += delta;
      onArgs?.(fullArgs);
    }
    if (chunk.usage && totals) accUsage(totals, chunk.usage as unknown as Record<string, unknown>);
  }
  return fullArgs;
}

// ── Phase 1: generate shell ───────────────────────────────────────────────────

// DeepSeek shell fits in 3 k; GPT-4o is more verbose — give it 6 k
function shellMaxTokens(model: string): number {
  return model.startsWith('deepseek') ? 3000 : 6000;
}

async function generateShell(
  client: OpenAI,
  model: string,
  brief: string,
  totals: UsageTotals,
  seed?: StyleSeed,
): Promise<SiteShell> {
  const stream = await client.chat.completions.create({
    model,
    max_tokens: shellMaxTokens(model),
    temperature: 0.7,
    stream: true,
    messages: [
      { role: 'system', content: SHELL_SYSTEM_PROMPT },
      { role: 'user',   content: buildShellUserPrompt(brief, seed) },
    ],
    tools:       [SUBMIT_SHELL_TOOL],
    tool_choice: { type: 'function', function: { name: 'submit_shell' } },
  });

  const args = await streamToolArgs(stream, undefined, totals);

  let shell: SiteShell | undefined;
  try {
    const parsed = JSON.parse(repairJson(args)) as { shell?: SiteShell } & Partial<SiteShell>;
    // GPT-4o sometimes omits the {shell:…} wrapper and returns the object directly
    shell = parsed.shell ?? (parsed.business ? (parsed as unknown as SiteShell) : undefined);
  } catch {
    throw new Error(`AI returnerede ugyldigt JSON: ${args.slice(0, 500)}…`);
  }

  if (!shell?.business || !shell.pages?.length) {
    throw new Error(`AI returnerede ufuldstændig shell-data (business=${!!shell?.business}, pages=${shell?.pages?.length ?? 0})`);
  }
  return shell;
}

// ── JSON repair ───────────────────────────────────────────────────────────────

function repairJson(raw: string): string {
  return raw
    .replace(/,(\s*[}\]])/g, '$1')          // trailing commas
    .replace(/:\s*undefined\b/g, ': null')  // JS undefined → null
    .replace(/^[ \t]*\/\/[^\n\r]*/gm, '')   // // comments at start of line only (never strips https:// URLs)
    .replace(/\/\*[\s\S]*?\*\//g, '');      // /* */ block comments
}

const VALID_BLOCK_TYPES = new Set([
  'hero','trust_bar','services','about','process','testimonials','pricing','faq',
  'cta_banner','contact','stats','gallery','team','blog_grid','logo_cloud',
  'comparison','promo_banner','location_finder','booking_strip','core_values',
]);

function sanitiseBlocks(blocks: Block[]): Block[] {
  return blocks
    .filter(b => VALID_BLOCK_TYPES.has(b.type))
    .map(b => ({
      ...b,
      data:     b.data     ?? {},
      settings: b.settings ?? { background: 'white', paddingY: 'xl' },
    })) as Block[];
}

// Walk raw JSON and close it at the last complete top-level block if truncated.
// Returns null when the JSON is already complete or has no salvageable blocks.
function closeTruncatedJson(raw: string): string | null {
  const m = raw.match(/"blocks"\s*:\s*\[/);
  if (!m || m.index === undefined) return null;

  const arrPos = m.index + m[0].length - 1; // index of '['
  let depth = 0;
  let inStr  = false;
  let esc    = false;
  let lastBlockEnd = -1;

  for (let i = arrPos; i < raw.length; i++) {
    const c = raw[i];
    if (esc)               { esc = false; continue; }
    if (c === '\\' && inStr) { esc = true; continue; }
    if (c === '"')           { inStr = !inStr; continue; }
    if (inStr)               continue;

    if (c === '[' || c === '{') depth++;
    else if (c === '}' || c === ']') {
      depth--;
      // depth 1 means we just closed a block object inside the array
      if (depth === 1 && c === '}') lastBlockEnd = i;
      // depth 0 means the array (and outer object) is already closed — no repair needed
      if (depth === 0) return null;
    }
  }

  if (lastBlockEnd === -1) return null;
  // Salvage everything up to and including the last complete block, then close
  return raw.slice(0, lastBlockEnd + 1) + ']}';
}

function parseBlocks(raw: string): Block[] {
  if (raw.length > 65536) throw new Error('AI-svar for stort');

  // 1. Try as-is
  try {
    const p = JSON.parse(raw) as { blocks: Block[] };
    if (Array.isArray(p.blocks) && p.blocks.length > 0) return sanitiseBlocks(p.blocks);
  } catch { /* fall through */ }

  // 2. Try with basic repairs (trailing commas, undefined → null, comments)
  try {
    const p = JSON.parse(repairJson(raw)) as { blocks: Block[] };
    if (Array.isArray(p.blocks) && p.blocks.length > 0) return sanitiseBlocks(p.blocks);
  } catch { /* fall through */ }

  // 3. Truncation recovery — salvage all complete blocks before the cutoff point
  const closed = closeTruncatedJson(repairJson(raw));
  if (closed) {
    try {
      const p = JSON.parse(closed) as { blocks: Block[] };
      if (Array.isArray(p.blocks) && p.blocks.length > 0) return sanitiseBlocks(p.blocks);
    } catch { /* fall through */ }
  }

  // 4. Extract the blocks array by depth-counting from the '[' (handles extra wrapper text)
  const arrMatch = raw.match(/"blocks"\s*:\s*(\[[\s\S]*)/);
  if (arrMatch) {
    let depth = 0, end = 0;
    for (let i = 0; i < arrMatch[1].length; i++) {
      const c = arrMatch[1][i];
      if (c === '[' || c === '{') depth++;
      else if (c === ']' || c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
    }
    if (end > 0) {
      try {
        const arr = JSON.parse(repairJson(arrMatch[1].slice(0, end))) as Block[];
        if (Array.isArray(arr) && arr.length > 0) return sanitiseBlocks(arr);
      } catch { /* fall through */ }
    }
  }

  throw new Error(`Kunne ikke parse JSON-svar: ${raw.slice(0, 120)}…`);
}

// ── Phase 2: generate blocks for one page ────────────────────────────────────

// DeepSeek caps output at 8 192; OpenAI models allow up to 16 384
function pageMaxTokens(model: string): number {
  return model.startsWith('deepseek') ? 8192 : 16384;
}

async function callPageBlocks(
  client: OpenAI,
  model: string,
  shell: SiteShell,
  page: PagePlan,
  totals: UsageTotals,
  temperature: number,
): Promise<{ fullArgs: string }> {
  const stream = await client.chat.completions.create({
    model,
    max_tokens: pageMaxTokens(model),
    temperature,
    stream: true,
    messages: [
      { role: 'system', content: PAGE_SYSTEM_PROMPT },
      { role: 'user',   content: buildPageUserPrompt(shell, page) },
    ],
    tools:       [SUBMIT_PAGE_TOOL],
    tool_choice: { type: 'function', function: { name: 'submit_page' } },
  });

  let fullArgs = '';
  let finishReason = '';
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.tool_calls?.[0]?.function?.arguments;
    if (delta) fullArgs += delta;
    if (chunk.choices[0]?.finish_reason) finishReason = chunk.choices[0].finish_reason;
    if (chunk.usage) accUsage(totals, chunk.usage as Record<string, unknown>);
  }
  if (fullArgs.length < 50) {
    throw new Error(`AI returnerede intet svar (finish_reason: ${finishReason || 'unknown'}) — prøv igen`);
  }
  return { fullArgs };
}

// Keep only the most essential blocks when retrying after a token-limit failure
function trimPagePlan(page: PagePlan): PagePlan {
  const ESSENTIAL = new Set(['hero', 'trust_bar', 'services', 'about', 'cta_banner', 'contact', 'booking_strip']);
  const trimmed = page.blockPlan
    .filter(b => ESSENTIAL.has(b.type))
    .slice(0, 4);
  return { ...page, blockPlan: trimmed.length >= 2 ? trimmed : page.blockPlan.slice(0, 3) };
}

async function* generatePageBlocks(
  client: OpenAI,
  model: string,
  shell: SiteShell,
  page: PagePlan,
  totals: UsageTotals,
): AsyncGenerator<{ event: 'block'; blockType: string } | { event: 'done'; blocks: Block[] }> {
  let fullArgs = '';
  let lastError: Error | null = null;

  // 3 attempts: normal → lower temp → trimmed block plan (fewer blocks)
  const attempts: Array<[number, PagePlan]> = [
    [0.7, page],
    [0.3, page],
    [0.2, trimPagePlan(page)],
  ];

  for (const [attemptIdx, [temp, pagePlan]] of attempts.entries()) {
    try {
      const result = await callPageBlocks(client, model, shell, pagePlan, totals, temp);
      fullArgs = result.fullArgs;

      // Stream block-type events (first attempt only)
      if (attemptIdx === 0) {
        const blockCounts = new Map<string, number>();
        for (const bt of BLOCK_TYPES) {
          const count = (fullArgs.match(new RegExp(`"type"\\s*:\\s*"${bt}"`, 'g')) ?? []).length;
          const prev  = blockCounts.get(bt) ?? 0;
          for (let i = prev; i < count; i++) yield { event: 'block', blockType: bt };
          blockCounts.set(bt, count);
        }
      }

      const blocks = parseBlocks(fullArgs);
      yield { event: 'done', blocks };
      return;
    } catch (e) {
      lastError = e as Error;
      if (attemptIdx < attempts.length - 1) continue;
    }
  }

  throw lastError ?? new Error(`Ukendt fejl for side ${page.slug}`);
}

// ── Public streaming generator ────────────────────────────────────────────────

export interface GenerateOptions {
  provider?:     Provider;
  enrichBriefAI?: boolean;
}

export async function* generateSiteStream(brief: string, opts: GenerateOptions = {}): AsyncGenerator<StreamEvent> {
  const provider = opts.provider ?? 'deepseek';
  const { model } = await import('./providers.js').then(m => ({ model: m.PROVIDERS[provider].model }));
  const client  = getProviderClient(provider);
  const totals: UsageTotals = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };

  // Extract scope note from original brief so enrichment can't strip it
  const briefLc = brief.toLowerCase();
  const isLandingPage = briefLc.includes('landing page kun') || briefLc.includes('landing page only')
    || briefLc.includes('single page') || briefLc.includes('nur landing page') || briefLc.includes('einzelne seite');
  const isSmallSite = briefLc.includes('2-3 siders') || briefLc.includes('3 siders hjemmeside')
    || briefLc.includes('2-3 pages') || briefLc.includes('3-page') || briefLc.includes('2-3 seiten') || briefLc.includes('kleine seite');
  const scopeSuffix = isLandingPage ? '. landing page kun'
    : isSmallSite ? '. 2-3 siders hjemmeside'
    : '';

  // Phase 0: brief enrichment (optional, uses GPT-4o-mini regardless of main provider)
  let finalBrief = brief;
  let briefEnriched = false;
  if (opts.enrichBriefAI !== false) {
    yield { type: 'status', message: 'Beriger brief med AI…' };
    const result = await enrichBrief(brief);
    finalBrief = result.enriched;
    briefEnriched = result.used;
  }

  // Re-inject scope note if enrichment dropped it
  if (scopeSuffix && !finalBrief.toLowerCase().includes(scopeSuffix.trim())) {
    finalBrief = finalBrief.trimEnd() + scopeSuffix;
  }

  // Pick seed based on brief keywords
  const seed = pickSeedForBrief(finalBrief);

  // Phase 1 — with one retry on failure
  yield { type: 'status', message: `Genererer sitestruktur (stil: ${seed.id})…` };
  let shell: SiteShell | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      shell = await generateShell(client, model, finalBrief, totals, seed);
      break;
    } catch (e) {
      if (attempt === 1) { yield { type: 'error', message: (e as Error).message }; return; }
    }
  }
  if (!shell) { yield { type: 'error', message: 'Shell generation fejlede' }; return; }

  for (const p of shell.pages) yield { type: 'page', slug: p.slug };

  // Phase 2 — one call per page
  const fullPages: Page[] = [];

  for (const pagePlan of shell.pages) {
    yield { type: 'status', message: `Genererer side: ${pagePlan.title}…` };
    try {
      let blocks: Block[] = [];
      for await (const ev of generatePageBlocks(client, model, shell, pagePlan, totals)) {
        if (ev.event === 'block') yield { type: 'block', blockType: ev.blockType };
        else blocks = ev.blocks;
      }
      fullPages.push({ id: pagePlan.id, slug: pagePlan.slug, title: pagePlan.title, seo: pagePlan.seo as Page['seo'], blocks });
    } catch (e) {
      yield { type: 'error', message: `Fejl på ${pagePlan.slug}: ${(e as Error).message}` };
      return;
    }
  }

  let site: Site = { ...(shell as unknown as Site), pages: fullPages };

  // Phase 3 — enrich with contextual images
  yield { type: 'status', message: 'Henter billeder til siden…' };
  try {
    site = await enrichSiteImages(site);
  } catch { /* images are optional — silently skip on failure */ }

  const estimatedCostUsd = estimateCost(provider, totals);
  yield { type: 'done', site, usage: totals, estimatedCostUsd, provider, briefEnriched };
}

// ── Non-streaming convenience wrapper (CLI / tests) ──────────────────────────

export async function generateSite(brief: string, provider: Provider = 'deepseek'): Promise<GenerateResult> {
  const cfg    = (await import('./providers.js')).PROVIDERS[provider];
  const client = getProviderClient(provider);
  const totals: UsageTotals = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0 };
  const seed   = pickSeedForBrief(brief);
  const shell  = await generateShell(client, cfg.model, brief, totals, seed);

  const fullPages: Page[] = [];
  for (const pagePlan of shell.pages) {
    let blocks: Block[] = [];
    for await (const ev of generatePageBlocks(client, cfg.model, shell, pagePlan, totals)) {
      if (ev.event === 'done') blocks = ev.blocks;
    }
    fullPages.push({ id: pagePlan.id, slug: pagePlan.slug, title: pagePlan.title, seo: pagePlan.seo as Page['seo'], blocks });
  }

  let site: Site = { ...(shell as unknown as Site), pages: fullPages };
  if (!site.version || !site.business || !site.pages?.length) {
    throw new Error('Generated site is missing required fields');
  }

  try { site = await enrichSiteImages(site); } catch { /* optional */ }

  return { site, usage: totals, estimatedCostUsd: estimateCost(provider, totals), provider, briefEnriched: false };
}
