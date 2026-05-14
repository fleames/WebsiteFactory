import type { Site } from '@schema/types';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  message: string;
}

export function validateBeforeDeploy(site: Site): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!site.business.name) {
    issues.push({ severity: 'error', message: 'Virksomhedsnavn mangler i business-opsætningen' });
  }

  for (const page of site.pages) {
    const label = page.title || page.slug;
    if (!page.seo?.title) {
      issues.push({ severity: 'error', message: `Side "${label}" mangler SEO-titel` });
    } else if (page.seo.title.length < 10) {
      issues.push({ severity: 'warning', message: `Side "${label}": SEO-titel er meget kort` });
    }
    if (!page.seo?.description) {
      issues.push({ severity: 'warning', message: `Side "${label}" mangler meta-beskrivelse` });
    }
  }

  if (!site.globals.siteUrl) {
    issues.push({ severity: 'warning', message: 'Websteds-URL mangler — sitemap og canonical links virker ikke' });
  }

  const hasContact = site.pages.some(p =>
    p.slug.includes('kontakt') || p.blocks.some(b => b.type === 'contact'),
  );
  if (!hasContact) {
    issues.push({ severity: 'warning', message: 'Ingen kontaktside eller kontaktformular fundet' });
  }

  const hasGa4 = !!site.globals.analyticsGa4;
  const hasCookieBanner = site.globals.cookieBanner?.enabled;
  if (hasGa4 && !hasCookieBanner) {
    issues.push({ severity: 'warning', message: 'GA4 er aktiveret uden cookie-banner — tjek GDPR-overholdelse' });
  }

  return issues;
}
