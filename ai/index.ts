import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { generateSite } from './generate.js';
import { renderSite } from '../renderer/render-site.js';

if (!process.env.DEEPSEEK_API_KEY) {
  console.error('Error: DEEPSEEK_API_KEY not set. Add it to .env or export it.');
  console.error('  echo "DEEPSEEK_API_KEY=sk-..." >> .env');
  process.exit(1);
}

const [,, ...args] = process.argv;

// Usage:
//   tsx ai/index.ts "Plumber in Hamburg, premium feel"
//   tsx ai/index.ts "Plumber in Hamburg" --out dist/plumber-hamburg
//   tsx ai/index.ts "Plumber in Hamburg" --json-only   (skip render, just save site.json)

const briefParts: string[] = [];
let outputDir: string | null = null;
let jsonOnly = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out' && args[i + 1]) {
    outputDir = args[++i];
  } else if (args[i] === '--json-only') {
    jsonOnly = false;
  } else {
    briefParts.push(args[i]);
  }
}

const brief = briefParts.join(' ').trim();

if (!brief) {
  console.error('Usage: tsx ai/index.ts "<brief>" [--out <dir>] [--json-only]');
  console.error('Example: tsx ai/index.ts "Plumber in Hamburg, modern, premium"');
  process.exit(1);
}

// Derive output dir from brief if not supplied
if (!outputDir) {
  const slug = brief
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
  outputDir = path.join('dist', slug);
}

const absOutputDir = path.resolve(outputDir);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  Website Factory — AI Generator`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  Brief:   ${brief}`);
console.log(`  Output:  ${absOutputDir}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('⟳  Generating site with Claude...');
const startTime = Date.now();

let result;
try {
  result = await generateSite(brief);
} catch (err) {
  console.error('\n✗  Generation failed:\n', (err as Error).message);
  process.exit(1);
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
const { site, usage } = result;

console.log(`✓  Generated in ${elapsed}s`);
console.log(`   Tokens: ${usage.inputTokens} in / ${usage.outputTokens} out` +
  (usage.cacheReadTokens    ? ` / ${usage.cacheReadTokens} cache-read`    : '') +
  (usage.cacheCreationTokens ? ` / ${usage.cacheCreationTokens} cache-write` : ''));
console.log(`   Business: ${site.business.name} (${site.business.city})`);
console.log(`   Pages: ${site.pages.map(p => p.slug).join(', ')}\n`);

// Write site.json
fs.mkdirSync(absOutputDir, { recursive: true });
const jsonPath = path.join(absOutputDir, 'site.json');
fs.writeFileSync(jsonPath, JSON.stringify(site, null, 2), 'utf-8');
console.log(`⟳  Saved site.json → ${jsonPath}`);

if (!jsonOnly) {
  console.log('\n⟳  Rendering HTML...\n');
  try {
    renderSite(site, absOutputDir);
  } catch (err) {
    console.error('\n✗  Render failed:\n', (err as Error).message);
    console.log('   (site.json was saved — fix the issue and re-render with:)');
    console.log(`   npm run generate ${jsonPath} ${absOutputDir}`);
    process.exit(1);
  }
}

console.log(`\n✓  Done — ${site.pages.length} page(s) in ${absOutputDir}/`);
console.log(`\n   Open in browser:\n   ${path.join(absOutputDir, 'index.html')}\n`);
