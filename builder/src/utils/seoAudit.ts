import type { Site } from '@schema/types';

export interface SeoCheck {
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
  fix?: string;
}

export interface AuditResult {
  score: number;
  checks: SeoCheck[];
}

export function runSeoAudit(site: Site, pageSlug: string): AuditResult {
  const page = site.pages.find(p => p.slug === pageSlug);
  if (!page) return { score: 0, checks: [] };

  const checks: SeoCheck[] = [];
  let score = 0;

  // ── Title ──────────────────────────────────────────────────────────────────
  const tLen = (page.seo?.title ?? '').length;
  if (tLen >= 50 && tLen <= 60) {
    checks.push({ label: 'Titel-tag', status: 'pass', detail: `${tLen} tegn — perfekt` });
    score += 20;
  } else if (tLen > 30 && tLen < 70) {
    checks.push({ label: 'Titel-tag', status: 'warn', detail: `${tLen} tegn (ideal: 50–60)`, fix: 'Tilpas titlen til 50–60 tegn med by + vigtigste søgeord' });
    score += 10;
  } else {
    checks.push({ label: 'Titel-tag', status: 'fail', detail: tLen === 0 ? 'Mangler titel' : `${tLen} tegn — for ${tLen > 70 ? 'lang' : 'kort'}`, fix: 'Skriv en titel på 50–60 tegn med bynavn og primært søgeord' });
  }

  // ── Description ───────────────────────────────────────────────────────────
  const dLen = (page.seo?.description ?? '').length;
  if (dLen >= 140 && dLen <= 160) {
    checks.push({ label: 'Meta-beskrivelse', status: 'pass', detail: `${dLen} tegn — perfekt` });
    score += 20;
  } else if (dLen > 80 && dLen < 180) {
    checks.push({ label: 'Meta-beskrivelse', status: 'warn', detail: `${dLen} tegn (ideal: 140–160)`, fix: 'Tilpas til 140–160 tegn med en opfordring til handling' });
    score += 10;
  } else {
    checks.push({ label: 'Meta-beskrivelse', status: 'fail', detail: dLen === 0 ? 'Mangler beskrivelse' : `${dLen} tegn`, fix: 'Skriv 140–160 tegn med USP + CTA, f.eks. "Ring nu"' });
  }

  // ── H1 (hero block) ───────────────────────────────────────────────────────
  const hasHero = page.blocks.some(b => b.type === 'hero');
  if (hasHero) {
    checks.push({ label: 'H1 overskrift', status: 'pass', detail: 'Hero-blok med H1 fundet' });
    score += 20;
  } else {
    checks.push({ label: 'H1 overskrift', status: 'fail', detail: 'Ingen H1 på siden', fix: 'Tilføj en hero-blok som første sektion på siden' });
  }

  // ── Schema markup ─────────────────────────────────────────────────────────
  if (page.seo?.schema) {
    checks.push({ label: 'Schema-markup', status: 'pass', detail: `${page.seo.schema} aktiv` });
    score += 20;
  } else {
    checks.push({ label: 'Schema-markup', status: 'fail', detail: 'Ingen schema-type valgt', fix: 'Vælg "LocalBusiness" for at hjælpe Google med at forstå siden' });
  }

  // ── Contact page ──────────────────────────────────────────────────────────
  const hasContact = site.pages.some(p => p.slug.includes('contact') || p.slug.includes('kontakt'));
  if (hasContact) {
    checks.push({ label: 'Kontaktside', status: 'pass', detail: 'Kontaktside fundet' });
    score += 10;
  } else if (page.blocks.some(b => b.type === 'contact')) {
    checks.push({ label: 'Kontaktside', status: 'warn', detail: 'Kontaktformular på forsiden — dedikeret side anbefales', fix: 'Tilføj en separat kontaktside for bedre lokal SEO' });
    score += 6;
  } else {
    checks.push({ label: 'Kontaktside', status: 'fail', detail: 'Ingen kontaktmulighed fundet', fix: 'Tilføj kontaktblok eller opret en dedikeret kontaktside' });
  }

  // ── Site depth ────────────────────────────────────────────────────────────
  if (site.pages.length >= 4) {
    checks.push({ label: 'Sidestruktur', status: 'pass', detail: `${site.pages.length} sider — god autoritet` });
    score += 10;
  } else if (site.pages.length >= 2) {
    checks.push({ label: 'Sidestruktur', status: 'warn', detail: `${site.pages.length} side${site.pages.length === 1 ? '' : 'r'} — anbefal min. 4`, fix: 'Tilføj ydelser-, om os- og kontaktside for bedre SEO-autoritet' });
    score += 5;
  } else {
    checks.push({ label: 'Sidestruktur', status: 'fail', detail: 'Kun 1 side', fix: 'Tilføj underliggende sider for at øge domæneautoriteten' });
  }

  return { score: Math.min(100, score), checks };
}
