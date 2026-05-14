import fs from 'fs';
import path from 'path';
import type { Site } from '../schema/types.js';
import { renderPageReact as renderPage } from '../renderer-react/render-page.js';
import { generateSitemap } from './components/sitemap.js';
import { generateRobots } from './components/robots.js';

export function renderSite(site: Site, outputDir: string): void {
  for (const page of site.pages) {
    const html = renderPage(site, page);
    const slug = page.slug === '/' ? '' : page.slug.replace(/^\//, '');
    const dir  = path.join(outputDir, slug);
    const filePath = path.join(dir, 'index.html');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`  ✓  ${page.slug}  →  ${path.relative(outputDir, filePath)}`);
  }

  fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), generateSitemap(site), 'utf-8');
  fs.writeFileSync(path.join(outputDir, 'robots.txt'),  generateRobots(site),   'utf-8');
  console.log(`  ✓  sitemap.xml + robots.txt`);
}
