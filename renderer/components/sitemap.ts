import type { Site } from '../../schema/types.js';

export function generateSitemap(site: Site): string {
  const base = (site.globals.siteUrl ?? '').replace(/\/$/, '');
  const urls = site.pages.map(page => {
    const loc = `${base}${page.slug === '/' ? '' : page.slug}`;
    const priority = page.slug === '/' ? '1.0' : '0.8';
    return `  <url>
    <loc>${loc || '/'}</loc>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
