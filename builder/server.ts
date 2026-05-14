import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';
import archiver from 'archiver';
import multer from 'multer';
import type { Site } from '../schema/types.js';
import { renderPageReact as renderPage } from '../renderer-react/render-page.js';
import { renderSite } from '../renderer/render-site.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, _file, cb) => {
      const projectDir = req.query.projectDir as string;
      const assetsDir = path.join(path.dirname(projectDir), 'assets');
      fs.mkdirSync(assetsDir, { recursive: true });
      cb(null, assetsDir);
    },
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Serve built React app
const uiDist = path.join(__dirname, 'dist');
if (fs.existsSync(uiDist)) {
  app.use(express.static(uiDist));
}

// ── API ──────────────────────────────────────────────────────────────────────

// Scan dist/ for all site.json files and return project summaries
app.get('/api/projects', (_req, res) => {
  const distDir = path.join(ROOT, 'dist');
  const projects: Array<{
    filePath: string;
    name: string;
    city: string;
    industry: string;
    pages: number;
    slug: string;
    modifiedAt: string;
    estimatedCostUsd?: number;
    usage?: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number };
    brandColor?: string;
    totalBlocks?: number;
    hasContact?: boolean;
  }> = [];

  if (!fs.existsSync(distDir)) { res.json([]); return; }

  for (const dir of fs.readdirSync(distDir)) {
    const jsonPath = path.join(distDir, dir, 'site.json');
    if (!fs.existsSync(jsonPath)) continue;
    try {
      const site: Site = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const stat = fs.statSync(jsonPath);
      const metaPath = path.join(distDir, dir, 'meta.json');
      let estimatedCostUsd: number | undefined;
      let usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number } | undefined;
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as { estimatedCostUsd?: number; usage?: typeof usage };
          estimatedCostUsd = meta.estimatedCostUsd;
          usage = meta.usage;
        } catch { /* skip */ }
      }
      projects.push({
        filePath: jsonPath,
        name:       site.business.name,
        city:       site.business.city,
        industry:   site.business.industry,
        pages:      site.pages.length,
        slug:       dir,
        modifiedAt:  stat.mtime.toISOString(),
        estimatedCostUsd,
        usage,
        brandColor:  site.theme?.colors?.brand,
        totalBlocks: site.pages.reduce((s, p) => s + p.blocks.length, 0),
        hasContact:  site.pages.some(p => p.blocks.some((b: { type: string }) => b.type === 'contact')),
      });
    } catch { /* skip corrupt files */ }
  }

  // Sort newest first
  projects.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
  res.json(projects);
});

app.get('/api/site', (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath || !fs.existsSync(filePath)) {
    res.status(404).json({ error: `File not found: ${filePath}` });
    return;
  }
  try {
    const site: Site = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json({ site, filePath: path.resolve(filePath) });
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
  }
});

app.post('/api/preview', (req, res) => {
  try {
    const { site, pageSlug } = req.body as { site: Site; pageSlug: string };
    const page = site.pages.find(p => p.slug === pageSlug) ?? site.pages[0];
    if (!page) { res.status(400).json({ error: 'Page not found' }); return; }
    const html = renderPage(site, page);
    res.type('html').send(html);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

app.post('/api/save', (req, res) => {
  try {
    const { site, filePath } = req.body as { site: Site; filePath: string };
    fs.writeFileSync(filePath, JSON.stringify(site, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

app.delete('/api/project', (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath) { res.status(400).json({ error: 'path required' }); return; }
  const resolved = path.resolve(filePath);
  const distDir  = path.join(ROOT, 'dist');
  if (!resolved.startsWith(distDir)) {
    res.status(403).json({ error: 'Path outside dist directory' }); return;
  }
  const projectDir = path.dirname(resolved);
  if (!fs.existsSync(projectDir)) { res.status(404).json({ error: 'Project not found' }); return; }
  try {
    fs.rmSync(projectDir, { recursive: true, force: true });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

app.patch('/api/project/rename', (req, res) => {
  const { filePath, name } = req.body as { filePath: string; name: string };
  if (!filePath || !name?.trim()) { res.status(400).json({ error: 'filePath and name required' }); return; }
  const resolved = path.resolve(filePath);
  const distDir  = path.join(ROOT, 'dist');
  if (!resolved.startsWith(distDir)) { res.status(403).json({ error: 'Path outside dist directory' }); return; }
  if (!fs.existsSync(resolved)) { res.status(404).json({ error: 'Project not found' }); return; }
  try {
    const site: Site = JSON.parse(fs.readFileSync(resolved, 'utf-8'));
    site.business.name = name.trim();
    fs.writeFileSync(resolved, JSON.stringify(site, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

app.post('/api/project/duplicate', (req, res) => {
  const { filePath } = req.body as { filePath: string };
  if (!filePath) { res.status(400).json({ error: 'filePath required' }); return; }
  const resolved   = path.resolve(filePath);
  const distDir    = path.join(ROOT, 'dist');
  if (!resolved.startsWith(distDir)) { res.status(403).json({ error: 'Path outside dist directory' }); return; }
  const projectDir = path.dirname(resolved);
  if (!fs.existsSync(projectDir)) { res.status(404).json({ error: 'Project not found' }); return; }
  try {
    const baseName = path.basename(projectDir);
    let newName    = `${baseName}-copy`;
    let counter    = 1;
    while (fs.existsSync(path.join(distDir, newName))) newName = `${baseName}-copy-${counter++}`;
    const newDir = path.join(distDir, newName);
    fs.cpSync(projectDir, newDir, { recursive: true });
    res.json({ ok: true, filePath: path.join(newDir, 'site.json'), slug: newName });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── AI site generation (SSE streaming) ───────────────────────────────────────

app.post('/api/ai', async (req, res) => {
  const { brief, provider, enrichBriefAI } = req.body as {
    brief: string;
    provider?: string;
    enrichBriefAI?: boolean;
  };
  if (!brief?.trim()) { res.status(400).json({ error: 'Brief mangler' }); return; }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (event: string, data: unknown) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    const { generateSiteStream } = await import('../ai/generate.js');
    const { PROVIDERS } = await import('../ai/providers.js');
    const validProvider = (provider && provider in PROVIDERS) ? provider as import('../ai/providers.js').Provider : 'deepseek';

    for await (const evt of generateSiteStream(brief, { provider: validProvider, enrichBriefAI: enrichBriefAI !== false })) {
      send(evt.type, evt);

      if (evt.type === 'done') {
        const baseSlug = brief.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
        let slug = baseSlug;
        let counter = 1;
        while (fs.existsSync(path.join(ROOT, 'dist', slug))) slug = `${baseSlug}-${counter++}`;
        const outDir = path.join(ROOT, 'dist', slug);
        fs.mkdirSync(outDir, { recursive: true });
        const jsonPath = path.join(outDir, 'site.json');
        fs.writeFileSync(jsonPath, JSON.stringify(evt.site, null, 2), 'utf-8');
        const meta = {
          generatedAt:    new Date().toISOString(),
          brief,
          provider:       evt.provider,
          briefEnriched:  evt.briefEnriched,
          usage:          evt.usage,
          estimatedCostUsd: evt.estimatedCostUsd,
        };
        fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf-8');
        send('saved', { filePath: jsonPath });
        break;
      }
      if (evt.type === 'error') break;
    }
  } catch (e) {
    send('error', { message: (e as Error).message });
  }

  res.end();
});

// ── DALL-E 3 hero image generation ───────────────────────────────────────────

app.post('/api/ai-image', async (req, res) => {
  const { businessName, businessType, city, style, slug } = req.body as {
    businessName: string;
    businessType: string;
    city?: string;
    style?: string;
    slug: string;
  };

  const OpenAI = (await import('openai')).default;
  const key = process.env.OPENAI_API_KEY;
  if (!key) { res.status(400).json({ error: 'OPENAI_API_KEY not set' }); return; }

  try {
    const client = new OpenAI({ apiKey: key });

    // Build a photorealistic prompt based on business context
    const styleHint = style === 'premium' ? 'luxury, high-end interior' : style === 'warm' ? 'warm, inviting atmosphere' : 'modern, professional';
    const locationHint = city ? `, ${city}` : '';
    const prompt = `Professional commercial photography for a ${businessType} business${locationHint}. ${styleHint} setting. Clean, bright, high-quality. No text, no logos, no people's faces visible. Shot on professional camera, shallow depth of field, color graded.`;

    const response = await client.images.generate({
      model:           'dall-e-3',
      prompt,
      n:               1,
      size:            '1792x1024',
      quality:         'standard',
      response_format: 'url',
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) throw new Error('No image URL returned');

    // Download the image and save it to the project assets folder
    const https = await import('https');
    const outDir = path.join(ROOT, 'dist', slug, 'assets');
    fs.mkdirSync(outDir, { recursive: true });
    const localPath = path.join(outDir, 'hero.jpg');

    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(localPath);
      https.get(imageUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', reject);
    });

    res.json({
      ok: true,
      localPath: `/dist/${slug}/assets/hero.jpg`,
      costUsd: 0.04,
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── AI block regeneration (tool-call based) ───────────────────────────────────

app.post('/api/ai-block', async (req, res) => {
  try {
    const { site, pageSlug, blockId, prompt } = req.body as {
      site: Site; pageSlug: string; blockId: string; prompt: string;
    };
    const page  = site.pages.find((p: { slug: string }) => p.slug === pageSlug);
    const block = page?.blocks.find((b: { id: string }) => b.id === blockId);
    if (!block) { res.status(404).json({ error: 'Blok ikke fundet' }); return; }

    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com',
      maxRetries: 2,
    });

    const language = (site.business as { language?: string }).language ?? 'da';
    const siteCtx  = `Business: ${site.business.name}, ${site.business.city}. Language: ${language}. Brand colour: ${site.theme.colors.brand}.`;

    const response = await client.chat.completions.create({
      model:       'deepseek-chat',
      max_tokens:  3000,
      temperature: 0.7,
      tools: [{
        type: 'function',
        function: {
          name:        'update_block_data',
          description: 'Return the updated block data object',
          parameters: {
            type: 'object',
            properties: { data: { type: 'object', description: 'Updated data fields for the block' } },
            required: ['data'],
          },
        },
      }],
      tool_choice: { type: 'function', function: { name: 'update_block_data' } },
      messages: [
        {
          role: 'system',
          content: `You are a website content editor. Given a block's current data and an edit instruction, call update_block_data with the improved data. Keep all existing keys — only update values. Write content in the site's language (${language}). Make copy conversion-focused and specific.`,
        },
        {
          role: 'user',
          content: `${siteCtx}\n\nBlock type: ${block.type}\nCurrent data:\n${JSON.stringify((block as Record<string, unknown>).data, null, 2)}\n\nEdit instruction: ${prompt}`,
        },
      ],
    });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error('AI returnerede ingen data');

    const parsed = JSON.parse(toolCall.function.arguments) as { data: Record<string, unknown> };
    res.json({ data: parsed.data });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── AI single-field generation ───────────────────────────────────────────────

app.post('/api/ai-field', async (req, res) => {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) { res.status(400).json({ error: 'DEEPSEEK_API_KEY not set' }); return; }

  const { site, blockType, fieldName, fieldLabel, blockData } = req.body as {
    site: Site; blockType: string; fieldName: string; fieldLabel?: string;
    blockData: Record<string, unknown>;
  };

  const FIELD_HINTS: Record<string, string> = {
    headline: 'Catchy headline, max 80 chars.',
    tagline: 'Very short tagline, max 50 chars.',
    badge: 'Short badge label, max 25 chars.',
    subtext: 'Supporting subtext, 1 sentence.',
    body: 'Compelling paragraph, 100-200 chars.',
    description: 'Concise description, 1-2 sentences.',
    answer: 'Clear answer to the FAQ question, 2-3 sentences.',
    cta: 'Call-to-action button text, max 30 chars.',
    label: 'Short label, max 30 chars.',
    caption: 'Image caption, 1 sentence.',
    bio: 'Short professional bio, 2 sentences.',
    quote: 'Authentic-sounding customer quote, 1-2 sentences.',
    name: 'A realistic person name for this business context.',
    role: 'A job title relevant to this business.',
    stat: 'A specific impressive statistic number (digits only, e.g. 98).',
    suffix: 'A short suffix like % or + or K.',
  };

  const isArray = Array.isArray(blockData[fieldName]);
  const language = (site.business as { language?: string }).language ?? 'da';
  const langName = language.startsWith('de') ? 'German' : language.startsWith('en') ? 'English' : 'Danish';
  const hint = FIELD_HINTS[fieldName] ?? (isArray ? 'A list of relevant short items.' : 'A short, relevant text value.');

  try {
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({ apiKey: key, baseURL: 'https://api.deepseek.com', maxRetries: 2 });

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: isArray ? 400 : 200,
      temperature: 0.85,
      messages: [
        {
          role: 'system',
          content: `You generate website copy in ${langName}. Be specific to the business — use real names, places, services. Return ONLY the value, no explanation, no quotes, no JSON keys.${isArray ? ' Return a JSON array of strings.' : ''}`,
        },
        {
          role: 'user',
          content: `Business: ${site.business.name}, ${site.business.city}. Industry: ${site.business.industry}.\nBlock type: ${blockType}\nField: "${fieldLabel ?? fieldName}"\nGuidance: ${hint}\nOther fields for context: ${JSON.stringify(blockData)}\n\nGenerate the "${fieldLabel ?? fieldName}" field.`,
        },
      ],
    });

    const text = (response.choices[0]?.message?.content ?? '').trim();

    if (isArray) {
      try {
        const parsed = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? text);
        res.json({ value: Array.isArray(parsed) ? parsed : [text] });
      } catch {
        res.json({ value: text.split('\n').map(s => s.replace(/^[-•*]\s*/, '')).filter(Boolean) });
      }
    } else {
      res.json({ value: text.replace(/^["']|["']$/g, '') });
    }
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── Client preview share ──────────────────────────────────────────────────────

const TOKENS_FILE = path.join(ROOT, '.wf-share-tokens.json');
type TokenEntry = { filePath: string; expiresAt: string };
const shareTokens = new Map<string, TokenEntry>();

// Load persisted tokens on startup, pruning expired ones
(function loadTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8')) as Record<string, TokenEntry>;
    const now = Date.now();
    for (const [token, entry] of Object.entries(raw)) {
      if (new Date(entry.expiresAt).getTime() > now) shareTokens.set(token, entry);
    }
  } catch { /* corrupt file — start fresh */ }
})();

function persistTokens() {
  const obj: Record<string, TokenEntry> = {};
  for (const [k, v] of shareTokens) obj[k] = v;
  try { fs.writeFileSync(TOKENS_FILE, JSON.stringify(obj, null, 2)); } catch { /* non-fatal */ }
}

app.post('/api/preview-share', (req, res) => {
  const { filePath } = req.body as { filePath: string };
  if (!filePath || !fs.existsSync(filePath)) { res.status(404).json({ error: 'Not found' }); return; }
  const token     = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64url').slice(0, 16);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  shareTokens.set(token, { filePath, expiresAt });
  persistTokens();
  const url = `http://localhost:${process.env.PORT ?? 3001}/share/${token}`;
  res.json({ url, token, expiresAt });
});

app.get('/share/:token', (req, res) => {
  const entry = shareTokens.get(req.params.token);
  if (!entry) { res.status(404).send('Link not found or expired'); return; }
  if (new Date(entry.expiresAt).getTime() < Date.now()) {
    shareTokens.delete(req.params.token);
    persistTokens();
    res.status(410).send('This preview link has expired');
    return;
  }
  if (!fs.existsSync(entry.filePath)) { res.status(404).send('Project file not found'); return; }
  try {
    const site: Site = JSON.parse(fs.readFileSync(entry.filePath, 'utf-8'));
    const slug = (req.query.page as string | undefined) ?? site.pages[0]?.slug;
    const page = site.pages.find(p => p.slug === slug) ?? site.pages[0];
    if (!page) { res.status(404).send('No pages'); return; }
    const html = renderPage(site, page);
    res.type('html').send(html);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

// ── Form submission (email) ───────────────────────────────────────────────────

app.post('/api/form-submit', async (req, res) => {
  const { fields, formId, toEmail, subject } = req.body as {
    fields: Record<string, string>; formId: string; toEmail?: string; subject?: string;
  };
  const to = toEmail ?? process.env.FORM_EMAIL;
  if (!to) { res.status(400).json({ error: 'No recipient. Set FORM_EMAIL in .env or pass toEmail.' }); return; }

  try {
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.default.createTransport({
      host:   process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port:   Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const body = Object.entries(fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    await transport.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: subject ?? `New form submission (${formId})`,
      text: body,
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── Version snapshots ─────────────────────────────────────────────────────────

app.get('/api/snapshots', (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath) { res.json([]); return; }
  const snapshotDir = path.join(path.dirname(filePath), 'snapshots');
  if (!fs.existsSync(snapshotDir)) { res.json([]); return; }
  const snapshots = fs.readdirSync(snapshotDir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const p = path.join(snapshotDir, f);
      const stat = fs.statSync(p);
      let name = f.replace(/^\d+-/, '').replace('.json', '').replace(/-/g, ' ');
      try { name = (JSON.parse(fs.readFileSync(p, 'utf-8')) as { _name?: string })._name ?? name; } catch {}
      return { name, path: p, date: stat.mtime.toISOString() };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  res.json(snapshots);
});

app.post('/api/snapshot', (req, res) => {
  const { filePath, site, name } = req.body as { filePath: string; site: Site; name: string };
  if (!filePath) { res.status(400).json({ error: 'filePath required' }); return; }
  const snapshotDir = path.join(path.dirname(filePath), 'snapshots');
  fs.mkdirSync(snapshotDir, { recursive: true });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const filename = `${Date.now()}-${slug}.json`;
  fs.writeFileSync(path.join(snapshotDir, filename), JSON.stringify({ ...site, _name: name }, null, 2));
  res.json({ ok: true });
});

app.get('/api/snapshot/download', (req, res) => {
  const snapshotPath = req.query.path as string;
  if (!snapshotPath || !fs.existsSync(snapshotPath)) { res.status(404).json({ error: 'Not found' }); return; }
  res.setHeader('Content-Disposition', `attachment; filename="snapshot.json"`);
  res.sendFile(snapshotPath);
});

// ── Image upload ─────────────────────────────────────────────────────────────

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  const filename = req.file.filename;
  res.json({ url: `/assets/${filename}`, filename });
});

// Serve uploaded assets from project dirs
app.get('/assets/:filename', (req, res, next) => {
  const distDir = path.join(ROOT, 'dist');
  if (!fs.existsSync(distDir)) { next(); return; }
  for (const dir of fs.readdirSync(distDir)) {
    const f = path.join(distDir, dir, 'assets', req.params.filename);
    if (fs.existsSync(f)) { res.sendFile(f); return; }
  }
  next();
});

// ── Render all pages to a temp dir using the React renderer ──────────────────

function renderSiteToDir(site: Site, tmpDir: string) {
  for (const page of site.pages) {
    const pageSlug = page.slug === '/' ? '' : page.slug.replace(/^\//, '');
    const pageDir  = path.join(tmpDir, pageSlug);
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(path.join(pageDir, 'index.html'), renderPage(site, page));
  }
}

// ── ZIP export (with bundled assets + relative paths) ────────────────────────

app.get('/api/export-zip', (req, res) => {
  const filePath = req.query.path as string;
  if (!filePath || !fs.existsSync(filePath)) {
    res.status(404).json({ error: 'site.json not found' }); return;
  }
  try {
    const site: Site = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const tmpDir = path.join(os.tmpdir(), `wf-export-${Date.now()}`);
    renderSiteToDir(site, tmpDir);

    // Copy uploaded assets directory into the export
    const projectDir = path.dirname(filePath);
    const assetsDir  = path.join(projectDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      fs.cpSync(assetsDir, path.join(tmpDir, 'assets'), { recursive: true });
    }

    // Rewrite /assets/ → relative path in each HTML file so it works when opened locally
    for (const page of site.pages) {
      const slug    = page.slug === '/' ? '' : page.slug.replace(/^\//, '');
      const depth   = slug ? slug.split('/').length : 0;
      const prefix  = depth > 0 ? '../'.repeat(depth) : '';
      const htmlFile = path.join(tmpDir, slug, 'index.html');
      if (!fs.existsSync(htmlFile)) continue;
      const html = fs.readFileSync(htmlFile, 'utf-8').replaceAll('/assets/', `${prefix}assets/`);
      fs.writeFileSync(htmlFile, html);
    }

    const slugName = path.basename(projectDir);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${slugName}.zip"`);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', e => { throw e; });
    archive.pipe(res);
    archive.directory(tmpDir, false);
    archive.finalize().then(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── Unsplash image search (proxy to keep API key server-side) ─────────────────

app.get('/api/unsplash', async (req, res) => {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    res.status(400).json({ error: 'UNSPLASH_ACCESS_KEY mangler i .env — tilføj den for at søge billeder' });
    return;
  }
  const q    = (req.query.q as string) || 'business';
  const page = (req.query.page as string) || '1';
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=20&page=${page}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    if (!r.ok) throw new Error(`Unsplash ${r.status}: ${await r.text()}`);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── Netlify deploy ───────────────────────────────────────────────────────────

app.post('/api/netlify-deploy', async (req, res) => {
  const token = process.env.NETLIFY_TOKEN;
  if (!token) { res.status(400).json({ error: 'NETLIFY_TOKEN not set in .env' }); return; }

  const { filePath } = req.body as { filePath: string };
  if (!filePath || !fs.existsSync(filePath)) {
    res.status(404).json({ error: 'site.json not found' }); return;
  }

  try {
    const site: Site = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const tmpDir = path.join(os.tmpdir(), `wf-netlify-${Date.now()}`);
    renderSiteToDir(site, tmpDir);

    // Build zip buffer in memory
    const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const arc = archiver('zip', { zlib: { level: 6 } });
      arc.on('data', (c: Buffer) => chunks.push(c));
      arc.on('end', () => resolve(Buffer.concat(chunks)));
      arc.on('error', reject);
      arc.directory(tmpDir, false);
      arc.finalize();
    });
    fs.rmSync(tmpDir, { recursive: true, force: true });

    // Create a new Netlify site
    const createRes = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: path.basename(path.dirname(filePath)).slice(0, 63) }),
    });
    if (!createRes.ok) throw new Error(`Netlify create site: ${await createRes.text()}`);
    const netlifysite = await createRes.json() as { id: string; deploy_url: string };

    // Deploy zip
    const deployRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${netlifysite.id}/deploys`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/zip' },
        body: zipBuffer,
      }
    );
    if (!deployRes.ok) throw new Error(`Netlify deploy: ${await deployRes.text()}`);
    const deploy = await deployRes.json() as { deploy_ssl_url?: string; ssl_url?: string; url: string };
    const url = deploy.deploy_ssl_url ?? deploy.ssl_url ?? deploy.url;
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── Vercel deploy ─────────────────────────────────────────────────────────────

app.post('/api/vercel-deploy', async (req, res) => {
  const token = process.env.VERCEL_TOKEN;
  if (!token) { res.status(400).json({ error: 'VERCEL_TOKEN er ikke sat i .env' }); return; }

  const { filePath } = req.body as { filePath: string };
  if (!filePath || !fs.existsSync(filePath)) {
    res.status(404).json({ error: 'site.json ikke fundet' }); return;
  }

  try {
    const { createHash } = await import('crypto');
    const site: Site = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const tmpDir = path.join(os.tmpdir(), `wf-vercel-${Date.now()}`);
    renderSiteToDir(site, tmpDir);

    // Collect all files recursively
    type FileEntry = { filePath: string; content: Buffer; sha: string };
    const collectFiles = (dir: string, base = ''): FileEntry[] => {
      const result: FileEntry[] = [];
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const rel  = base ? `${base}/${entry}` : entry;
        if (fs.statSync(full).isDirectory()) result.push(...collectFiles(full, rel));
        else {
          const content = fs.readFileSync(full);
          const sha     = createHash('sha1').update(content).digest('hex');
          result.push({ filePath: rel, content, sha });
        }
      }
      return result;
    };

    const files = collectFiles(tmpDir);
    fs.rmSync(tmpDir, { recursive: true, force: true });

    // Upload files (best-effort — 200 means already exists, also fine)
    for (const file of files) {
      await fetch('https://api.vercel.com/v2/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/octet-stream',
          'x-vercel-digest': file.sha,
          'Content-Length': String(file.content.length),
        },
        body: file.content,
      });
    }

    const name = path.basename(path.dirname(filePath)).slice(0, 50).toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        files: files.map(f => ({ file: f.filePath, sha: f.sha, size: f.content.length })),
        target: 'production',
        projectSettings: { framework: null, outputDirectory: '.' },
      }),
    });

    if (!deployRes.ok) throw new Error(`Vercel deploy: ${await deployRes.text()}`);
    const deploy = await deployRes.json() as { url: string; alias?: string[] };
    const url = `https://${deploy.alias?.[0] ?? deploy.url}`;
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// ── Website scraper ───────────────────────────────────────────────────────────

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url?.trim()) { res.status(400).json({ error: 'url required' }); return; }
  try {
    const { scrapeWebsite } = await import('../ai/scrape.js');
    const result = await scrapeWebsite(url.trim());
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// SPA fallback
app.get(/(.*)/, (_req, res) => {
  const indexHtml = path.join(uiDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.status(503).send('Run: npm run builder:build');
  }
});

// ── Start ────────────────────────────────────────────────────────────────────

const port = Number(process.env.PORT ?? 3001);
const fileArg = process.argv[2];

const server = app.listen(port, async () => {
  let url = `http://localhost:${port}`;

  if (fileArg) {
    const abs = path.resolve(fileArg);
    url += `?file=${encodeURIComponent(abs)}`;
    console.log(`\n  Website Factory Builder`);
    console.log(`  ─────────────────────────`);
    console.log(`  Project: ${abs}`);
  } else {
    console.log(`\n  Website Factory Builder`);
    console.log(`  ─────────────────────────`);
  }

  console.log(`  URL: ${url}\n`);
  await open(url);
});
