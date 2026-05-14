import type { Site } from '../../schema/types.js';

export function generateRobots(site: Site): string {
  const base = (site.globals.siteUrl ?? '').replace(/\/$/, '');
  const sitemapLine = base ? `\nSitemap: ${base}/sitemap.xml` : '';
  return `User-agent: *\nAllow: /${sitemapLine}\n`;
}
