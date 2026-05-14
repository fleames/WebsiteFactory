import type { Site, Page } from '../schema/types.js';
import { esc } from './utils/html.js';
import { tailwindConfigScript, googleFontsLink } from './utils/theme.js';
import { renderNav } from './components/nav.js';
import { renderFooter } from './components/footer.js';
import { renderBlock } from './blocks/index.js';

function headingPersonalityCss(font: string): string {
  const f = font.toLowerCase();
  if (f.includes('bebas') || f.includes('oswald')) return `
    h1,h2,h3,h4,h5,h6,.font-heading { text-transform:uppercase; letter-spacing:0.06em; }
    h1 { font-weight:400; line-height:1.0; }
    h2 { font-weight:400; letter-spacing:0.08em; }`;
  if (f.includes('cormorant') || f.includes('dm serif')) return `
    h1 { font-style:italic; font-weight:500; letter-spacing:-0.01em; line-height:1.1; }
    h2 { font-weight:600; letter-spacing:-0.005em; }
    h3 { font-style:italic; font-weight:400; }`;
  if (f.includes('playfair')) return `
    h1 { font-style:italic; font-weight:700; letter-spacing:-0.01em; line-height:1.1; }
    h2 { font-weight:700; }
    h3 { font-style:italic; font-weight:500; }`;
  if (f.includes('syne')) return `
    h1,h2 { font-weight:800; letter-spacing:-0.03em; text-transform:uppercase; }
    h3,h4  { font-weight:700; letter-spacing:-0.01em; }`;
  if (f.includes('space grotesk')) return `
    h1 { font-weight:700; letter-spacing:-0.045em; line-height:1.05; }
    h2 { font-weight:600; letter-spacing:-0.03em; }
    h3 { font-weight:600; letter-spacing:-0.015em; }`;
  if (f.includes('raleway')) return `
    h1 { font-weight:800; letter-spacing:0.04em; text-transform:uppercase; }
    h2 { font-weight:700; letter-spacing:0.02em; }
    h3 { font-weight:600; letter-spacing:0.01em; }`;
  if (f.includes('lora')) return `
    h1 { font-weight:600; font-style:italic; letter-spacing:-0.01em; line-height:1.15; }
    h2 { font-weight:500; font-style:italic; }
    h3 { font-weight:600; }`;
  if (f.includes('montserrat')) return `
    h1 { font-weight:800; letter-spacing:-0.02em; }
    h2 { font-weight:700; letter-spacing:-0.01em; }
    h3 { font-weight:700; text-transform:uppercase; letter-spacing:0.04em; font-size:0.85em; }`;
  if (f.includes('dm sans')) return `
    h1 { font-weight:700; letter-spacing:-0.03em; line-height:1.1; }
    h2 { font-weight:600; letter-spacing:-0.02em; }`;
  if (f.includes('nunito')) return `
    h1 { font-weight:900; letter-spacing:-0.02em; line-height:1.15; }
    h2 { font-weight:800; letter-spacing:-0.01em; }`;
  return `
    h1 { font-weight:800; letter-spacing:-0.025em; line-height:1.1; }
    h2 { font-weight:700; letter-spacing:-0.02em; }`;
}

export function renderPage(site: Site, page: Page): string {
  const { theme, globals, business } = site;

  const blocksHtml = page.blocks.map(b => renderBlock(b, theme.colors.brand)).join('\n');

  const schemaJson = page.seo.schema === 'LocalBusiness'
    ? `<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: business.name,
  telephone: business.phone,
  email: business.email,
  address: business.address
    ? { '@type': 'PostalAddress', streetAddress: business.address }
    : undefined,
  openingHours: business.hours,
  url: globals.nav.logo.type === 'text' ? undefined : undefined,
}, null, 2)}
</script>`
    : '';

  const siteUrl  = (site.globals.siteUrl ?? '').replace(/\/$/, '');
  const pageUrl  = siteUrl ? `${siteUrl}${page.slug === '/' ? '' : page.slug}` : '';
  const ogImageMeta = page.seo.ogImage
    ? `<meta property="og:image" content="${esc(page.seo.ogImage)}">`
    : '';
  const canonicalMeta = pageUrl
    ? `<link rel="canonical" href="${esc(pageUrl)}">`
    : '';
  const ogUrlMeta = pageUrl
    ? `<meta property="og:url" content="${esc(pageUrl)}">`
    : '';

  return `<!DOCTYPE html>
<html lang="${esc(site.business.language ?? (site.business.country === 'DE' ? 'de' : 'en'))}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.seo.title)}</title>
  <meta name="description" content="${esc(page.seo.description)}">
  <meta name="theme-color" content="${esc(theme.colors.brand)}">
  ${page.seo.noIndex ? '<meta name="robots" content="noindex">' : ''}
  ${canonicalMeta}
  <meta property="og:title" content="${esc(page.seo.title)}">
  <meta property="og:description" content="${esc(page.seo.description)}">
  <meta property="og:type" content="website">
  ${ogUrlMeta}
  ${ogImageMeta}
  ${schemaJson}
  ${googleFontsLink(theme)}
  <script src="https://cdn.tailwindcss.com"></script>
  ${tailwindConfigScript(theme)}
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  <style>
    body { font-family: '${esc(theme.typography.fontBody)}', sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: '${esc(theme.typography.fontHeading)}', sans-serif; }
    .font-heading { font-family: '${esc(theme.typography.fontHeading)}', sans-serif; }
    ${headingPersonalityCss(theme.typography.fontHeading)}

    /* Gradient text utility — apply brand→brand-dark gradient to any heading */
    .gradient-text {
      background: linear-gradient(135deg, ${esc(theme.colors.brand)} 0%, ${esc(theme.colors.brandDark)} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Blob colour channels for decorative background circles */
    :root {
      ${(hex => {
        const r = parseInt(hex.slice(1,3),16);
        const g = parseInt(hex.slice(3,5),16);
        const b = parseInt(hex.slice(5,7),16);
        return `--blob-r:${r};--blob-g:${g};--blob-b:${b};`;
      })(theme.colors.brand)}
    }

    /* Animated logo marquee */
    @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
    .marquee-track { display: flex; width: max-content; animation: marquee 28s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }
    .marquee-wrap { overflow: hidden; }

    /* Arrow CTA hover nudge */
    .btn-arrow svg { transition: transform .2s; }
    .btn-arrow:hover svg { transform: translateX(3px); }

    /* ── Glassmorphism utilities ── */
    .glass-card {
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08);
    }
    .glass-card:hover {
      background: rgba(255,255,255,0.10);
      border-color: rgba(${(hex => {
        const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
        return `${r},${g},${b}`;
      })(theme.colors.brand)},0.45);
      box-shadow: 0 12px 48px rgba(0,0,0,0.4), 0 0 20px rgba(${(hex => {
        const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
        return `${r},${g},${b}`;
      })(theme.colors.brand)},0.12), inset 0 1px 0 rgba(255,255,255,0.12);
    }
    .glass-card-light {
      background: rgba(255,255,255,0.55);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.75);
      box-shadow: 0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
    }

    /* ── Neon / futurism utilities ── */
    .neon-text {
      text-shadow:
        0 0 12px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.9),
        0 0 30px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.55),
        0 0 60px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.25);
    }
    .neon-border {
      border: 1px solid rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.5);
      box-shadow:
        0 0 10px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.2),
        inset 0 0 10px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.06);
    }
    @keyframes cyber-pulse {
      0%,100% { border-color: rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.35); box-shadow: 0 0 8px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.15); }
      50%      { border-color: rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.8);  box-shadow: 0 0 20px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.35); }
    }
    .cyber-pulse { animation: cyber-pulse 2.5s ease-in-out infinite; }
    @keyframes neon-flicker {
      0%,90%,100% { opacity:1; }
      92%         { opacity:.85; }
      96%         { opacity:.95; }
    }
    .neon-flicker { animation: neon-flicker 6s ease-in-out infinite; }
    /* Subtle CRT scanline overlay — add class to any section */
    .scanline-overlay { position:relative; }
    .scanline-overlay::after {
      content:'';position:absolute;inset:0;pointer-events:none;z-index:3;
      background: repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px);
    }

    /* ── Shimmer text animation ── */
    @keyframes shimmer-sweep {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    .shimmer-text {
      background: linear-gradient(90deg, ${esc(theme.colors.brand)} 0%, ${esc(theme.colors.brandDark)} 25%, #fff 50%, ${esc(theme.colors.brand)} 75%, ${esc(theme.colors.brandDark)} 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer-sweep 4s linear infinite;
    }

    /* ── Noise texture overlay ── */
    .noise-overlay { position:relative; isolation:isolate; }
    .noise-overlay::before {
      content:'';position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.035;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 200px 200px;
    }
    .noise-overlay > * { position:relative; z-index:1; }

    /* ── Animated gradient border (glow ring) ── */
    @property --border-angle {
      syntax: '<angle>';
      inherits: false;
      initial-value: 0deg;
    }
    @keyframes border-rotate { to { --border-angle: 360deg; } }
    .glow-ring {
      border: 2px solid transparent;
      background: linear-gradient(var(--bg-color, #111), var(--bg-color, #111)) padding-box,
                  conic-gradient(from var(--border-angle), ${esc(theme.colors.brand)}, ${esc(theme.colors.brandDark)}, #fff, ${esc(theme.colors.brand)}) border-box;
      animation: border-rotate 4s linear infinite;
    }

    /* ── Float card — depth shadow with hover lift ── */
    .float-card {
      box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 4px 8px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.05);
      transition: box-shadow .25s ease, transform .25s ease;
    }
    .float-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 12px 28px rgba(0,0,0,.1), 0 24px 48px rgba(0,0,0,.08);
      transform: translateY(-3px);
    }

    /* ── CTA button shimmer ── */
    .btn-glow { position:relative; overflow:hidden; }
    .btn-glow::after {
      content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
      transform: skewX(-20deg);
      transition: none;
    }
    .btn-glow:hover::after { left:150%; transition: left .6s ease; }

    /* ── Light beam / plasma streak — vertical glowing overlay ── */
    .light-beam {
      position: relative;
      overflow: hidden;
    }
    .light-beam::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      width: 3px;
      height: 100%;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.9) 15%,
        rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.5) 40%,
        rgba(255,180,0,0.6) 75%,
        rgba(255,220,80,0.3) 90%,
        transparent 100%
      );
      filter: blur(3px);
      box-shadow:
        0 0 40px 18px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.18),
        0 0 80px 36px rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.08);
      pointer-events: none;
      z-index: 1;
    }

    /* ── Background patterns ── */
    .dot-pattern {
      background-image: radial-gradient(circle, rgba(var(--blob-r),var(--blob-g),var(--blob-b),.15) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .grid-pattern {
      background-image:
        linear-gradient(rgba(var(--blob-r),var(--blob-g),var(--blob-b),.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--blob-r),var(--blob-g),var(--blob-b),.07) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* ── Cursor spotlight (applied via data-spotlight attr) ── */
    [data-spotlight] {
      --x: 50%; --y: 50%;
      background: radial-gradient(600px circle at var(--x) var(--y),
        rgba(var(--blob-r),var(--blob-g),var(--blob-b),.07) 0%, transparent 60%);
    }

    /* ── Scroll reveal ── */
    [data-reveal] {
      opacity: 0;
      transform: translateY(22px);
      transition: opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1);
    }
    [data-reveal].revealed {
      opacity: 1;
      transform: none;
    }
    [data-reveal="left"]  { transform: translateX(-28px); }
    [data-reveal="right"] { transform: translateX(28px); }
    [data-reveal="scale"] { transform: scale(0.94); }
    [data-reveal="left"].revealed,
    [data-reveal="right"].revealed,
    [data-reveal="scale"].revealed { transform: none; }
  </style>
</head>
<body class="bg-white text-gray-900 antialiased">

${renderNav(globals.nav)}

<main>
${blocksHtml}
</main>

${renderFooter(globals.footer, business.name)}

<script>
  document.addEventListener('DOMContentLoaded', () => lucide.createIcons());
  // Scroll reveal
  (function() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function(el) { io.observe(el); });
  })();
  window.addEventListener('message', (e) => {
    if (e.data?.scrollTo) {
      const el = document.getElementById(e.data.scrollTo);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  // Cursor spotlight for [data-spotlight] sections
  document.querySelectorAll('[data-spotlight]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      el.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });
  });
  // Scroll-triggered stat counters
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.countTo);
        const suffix = el.dataset.countSuffix ?? '';
        const dec = el.dataset.countDec ?? '0';
        const decimals = parseInt(dec);
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * ease).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => io.observe(el));
  }
</script>
${globals.analyticsGa4 ? `<!-- Google Analytics (GDPR-gated) -->
<script>
  window._ga4Id = '${esc(globals.analyticsGa4)}';
  function _initGA4() {
    if (window._ga4loaded) return; window._ga4loaded = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window._ga4Id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} window.gtag = gtag;
    gtag('js', new Date()); gtag('config', window._ga4Id);
  }
  if (localStorage.getItem('cookie_consent') === 'accepted') _initGA4();
</script>` : ''}
${globals.cookieBanner?.enabled ? `<!-- Cookie Consent Banner -->
<div id="cookie-banner" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:9999;padding:16px 24px;background:#1e293b;color:#e2e8f0;font-family:Inter,sans-serif;font-size:13px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;box-shadow:0 -4px 24px rgba(0,0,0,.4)">
  <p style="margin:0;max-width:640px;line-height:1.5">
    ${esc(globals.cookieBanner.text ?? 'Vi bruger cookies til at forbedre din oplevelse og analysere trafikken på vores hjemmeside.')}
    ${globals.cookieBanner.privacyUrl ? ` <a href="${esc(globals.cookieBanner.privacyUrl)}" style="color:#93c5fd;text-decoration:underline">Læs mere</a>` : ''}
  </p>
  <div style="display:flex;gap:8px;flex-shrink:0">
    <button onclick="_cookieDecline()" style="padding:8px 18px;border-radius:8px;border:1px solid #475569;background:transparent;color:#94a3b8;font-size:13px;cursor:pointer">Afvis</button>
    <button onclick="_cookieAccept()" style="padding:8px 18px;border-radius:8px;border:none;background:#3b82f6;color:#fff;font-size:13px;font-weight:600;cursor:pointer">Acceptér alle</button>
  </div>
</div>
<script>
  (function(){
    var b = document.getElementById('cookie-banner');
    if (!localStorage.getItem('cookie_consent') && b) b.style.display = 'flex';
  })();
  function _cookieAccept() {
    localStorage.setItem('cookie_consent','accepted');
    document.getElementById('cookie-banner').style.display='none';
    if (typeof _initGA4 === 'function') _initGA4();
  }
  function _cookieDecline() {
    localStorage.setItem('cookie_consent','declined');
    document.getElementById('cookie-banner').style.display='none';
  }
</script>` : ''}
</body>
</html>`;
}
