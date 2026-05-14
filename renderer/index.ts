import fs from 'fs';
import path from 'path';
import { renderSite } from './render-site.js';
import type { Site } from '../schema/types.js';

const [,, inputArg, outputArg] = process.argv;

if (!inputArg || !outputArg) {
  console.error('Usage: tsx renderer/index.ts <site.json> <output-dir>');
  process.exit(1);
}

const inputPath  = path.resolve(inputArg);
const outputPath = path.resolve(outputArg);

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const site: Site = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

console.log(`\nBuilding: ${site.business.name}`);
console.log(`Output:   ${outputPath}\n`);

renderSite(site, outputPath);

console.log(`\nDone. ${site.pages.length} page(s) generated.`);
