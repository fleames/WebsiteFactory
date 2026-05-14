export function premiumCss(brand: string, brandDark: string, fontHeading: string, fontBody: string): string {
  const rgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '59,130,246';
  };
  const brandRgb = rgb(brand);
  const brandDarkRgb = rgb(brandDark);

  return `
/* ── Design system ──────────────────────────────── */
:root {
  --brand:       ${brand};
  --brand-dark:  ${brandDark};
  --brand-rgb:   ${brandRgb};
  --bd-rgb:      ${brandDarkRgb};
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-2xl:  32px;
  --shadow-sm:   0 1px 2px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.04);
  --shadow-md:   0 4px 8px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --shadow-lg:   0 8px 16px rgba(0,0,0,.08), 0 24px 48px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04);
  --shadow-xl:   0 16px 32px rgba(0,0,0,.1),  0 40px 80px rgba(0,0,0,.1);
  --shadow-brand:0 0 0 1px rgba(var(--brand-rgb),.25), 0 8px 24px rgba(var(--brand-rgb),.18), 0 2px 4px rgba(var(--brand-rgb),.1);
}

/* ── Colour tokens ── */
.text-brand           { color: var(--brand); }
.bg-brand             { background-color: var(--brand); }
.bg-brand-dark        { background-color: var(--brand-dark); }
.border-brand         { border-color: var(--brand); }
.ring-brand           { --tw-ring-color: var(--brand); }
.shadow-brand         { box-shadow: var(--shadow-brand); }
.from-brand           { --tw-gradient-from: var(--brand); --tw-gradient-from-position: 0%; }
.via-brand            { --tw-gradient-via: var(--brand); }
.to-brand-dark        { --tw-gradient-to: var(--brand-dark); --tw-gradient-to-position: 100%; }
.bg-brand-subtle      { background-color: rgba(var(--brand-rgb),.08); }
.bg-brand-muted       { background-color: rgba(var(--brand-rgb),.12); }
.text-brand-muted     { color: rgba(var(--brand-rgb),.7); }
.border-brand-subtle  { border-color: rgba(var(--brand-rgb),.2); }

/* ── Typography ── */
body {
  font-family: '${fontBody}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'kern' 1, 'liga' 1;
}
h1,h2,h3,h4,h5,h6,.font-heading {
  font-family: '${fontHeading}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: -0.025em;
  line-height: 1.1;
}
h1 { letter-spacing: -0.035em; }
h2 { letter-spacing: -0.028em; }

/* ── gradientHeading setting — targets first heading inside the block ── */
[data-gradient-heading] h1:first-of-type,
[data-gradient-heading] h2:first-of-type {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; display: inline-block;
}

/* ── Gradient text ── */
.gradient-text {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gradient-text-light {
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,.7) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.shimmer-text {
  background: linear-gradient(90deg, var(--brand) 0%, var(--brand-dark) 25%, #fff 50%, var(--brand) 75%, var(--brand-dark) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: shimmer 4s linear infinite;
}

/* ── Premium card styles ── */
.card-light {
  background: #fff;
  border: 1px solid rgba(0,0,0,.07);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-xl);
  transition: box-shadow .25s ease, transform .25s ease, border-color .25s ease;
}
.card-light:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
  border-color: rgba(var(--brand-rgb),.2);
}
.card-dark {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(12px);
  transition: background .25s ease, border-color .25s ease, transform .25s ease;
}
.card-dark:hover {
  background: rgba(255,255,255,.07);
  border-color: rgba(var(--brand-rgb),.35);
  transform: translateY(-3px);
}
.card-glass {
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.14);
  backdrop-filter: blur(24px) saturate(160%); -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0,0,0,.3), 0 1px 0 rgba(255,255,255,.12) inset, 0 0 0 1px rgba(255,255,255,.04) inset;
  transition: background .25s ease, border-color .25s ease, transform .25s ease, box-shadow .25s ease;
}
.card-glass:hover {
  background: rgba(255,255,255,.1);
  border-color: rgba(255,255,255,.2);
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(0,0,0,.4), 0 0 32px rgba(var(--brand-rgb),.1), 0 1px 0 rgba(255,255,255,.15) inset;
}
.card-glow {
  position: relative;
}
.card-glow::before {
  content: '';
  position: absolute; inset: -1px; border-radius: calc(var(--radius-xl) + 1px); z-index: -1;
  background: linear-gradient(135deg, rgba(var(--brand-rgb),.3) 0%, rgba(var(--brand-rgb),.05) 50%, rgba(var(--brand-rgb),.15) 100%);
  opacity: 0; transition: opacity .3s ease;
}
.card-glow:hover::before { opacity: 1; }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: .5rem;
  font-weight: 600; border-radius: var(--radius-md);
  transition: all .2s ease; cursor: pointer; white-space: nowrap;
  position: relative; overflow: hidden;
}
.btn::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,.12) 0%, transparent 60%);
  pointer-events: none;
}
.btn-primary {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
  color: #fff; border: none;
  box-shadow: 0 2px 4px rgba(var(--brand-rgb),.3), 0 0 0 0 rgba(var(--brand-rgb),.4);
  padding: .75rem 1.75rem; font-size: .9375rem;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--brand-rgb),.4), 0 2px 4px rgba(var(--brand-rgb),.3);
}
.btn-primary:active { transform: translateY(0); }
.btn-secondary {
  background: transparent;
  color: var(--brand);
  border: 1.5px solid rgba(var(--brand-rgb),.35);
  padding: .75rem 1.75rem; font-size: .9375rem;
}
.btn-secondary:hover {
  background: rgba(var(--brand-rgb),.06);
  border-color: var(--brand);
}
.btn-ghost-dark {
  background: rgba(255,255,255,.08);
  color: rgba(255,255,255,.85);
  border: 1px solid rgba(255,255,255,.12);
  padding: .75rem 1.75rem; font-size: .9375rem;
}
.btn-ghost-dark:hover {
  background: rgba(255,255,255,.13);
  border-color: rgba(255,255,255,.22);
  color: #fff;
}
.btn-lg { padding: .9rem 2.25rem; font-size: 1.0625rem; border-radius: var(--radius-lg); }
.btn-sm { padding: .5rem 1.25rem; font-size: .8125rem; }
.btn-icon { gap: .375rem; }
.btn-icon svg { transition: transform .2s ease; }
.btn-icon:hover svg { transform: translateX(3px); }

/* ── Section backgrounds ── */
.section-white   { background: #fff; color: #111827; }
.section-surface { background: #f9fafb; color: #111827; }
.section-dark    { background: #030712; color: #f1f5f9; }
.section-darker  { background: #060610; color: #f1f5f9; }
.section-brand   { background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%); color: #fff; }
.section-brand-subtle { background: rgba(var(--brand-rgb),.05); color: #111827; }

/* ── Gradient orbs / mesh ── */
.orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  animation: orb-float 12s ease-in-out infinite;
}
.orb-1 {
  top: -20%; right: -10%; width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(var(--brand-rgb),.18) 0%, transparent 65%);
  filter: blur(60px);
}
.orb-2 {
  bottom: -20%; left: -10%; width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(var(--brand-rgb),.12) 0%, transparent 65%);
  filter: blur(60px); animation-delay: -4s;
}
.orb-3 {
  top: 30%; left: 40%; width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(var(--bd-rgb),.1) 0%, transparent 65%);
  filter: blur(60px); animation-delay: -8s;
}
@keyframes orb-float {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(20px,-15px) scale(1.05); }
  66%      { transform: translate(-15px,10px) scale(.97); }
}

/* ── Noise texture ── */
.noise::before {
  content:''; position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.028;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat; background-size: 256px;
}
.noise > * { position: relative; z-index: 1; }

/* ── Dot grid background ── */
.dot-grid {
  background-image: radial-gradient(circle, rgba(var(--brand-rgb),.12) 1px, transparent 1px);
  background-size: 28px 28px;
}
.dot-grid-dark {
  background-image: radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 28px 28px;
}
.line-grid {
  background-image:
    linear-gradient(rgba(var(--brand-rgb),.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--brand-rgb),.06) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* ── Icon containers ── */
.icon-box {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--radius-md); flex-shrink: 0;
  background: rgba(var(--brand-rgb),.1);
  color: var(--brand);
  border: 1px solid rgba(var(--brand-rgb),.18);
}
.icon-box-dark {
  background: rgba(var(--brand-rgb),.15);
  border-color: rgba(var(--brand-rgb),.25);
}
.icon-box-gradient {
  background: linear-gradient(135deg, rgba(var(--brand-rgb),.2) 0%, rgba(var(--brand-rgb),.08) 100%);
  border-color: rgba(var(--brand-rgb),.22);
}

/* ── Badge / pill ── */
.badge {
  display: inline-flex; align-items: center; gap: .375rem;
  font-size: .75rem; font-weight: 600; letter-spacing: .04em;
  padding: .3rem .85rem; border-radius: 999px;
}
.badge-brand {
  background: rgba(var(--brand-rgb),.1);
  color: var(--brand);
  border: 1px solid rgba(var(--brand-rgb),.2);
}
.badge-dark {
  background: rgba(255,255,255,.07);
  color: rgba(255,255,255,.75);
  border: 1px solid rgba(255,255,255,.12);
}
.badge-dot::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  background: currentColor; display: inline-block; opacity: .7;
}

/* ── Divider ── */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--brand-rgb),.2), rgba(var(--brand-rgb),.2), transparent);
}

/* ── Scroll reveal (keeps existing system working) ── */
[data-reveal] {
  opacity: 0; transform: translateY(24px);
  transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1);
}
[data-reveal].revealed  { opacity: 1; transform: none; }
[data-reveal="left"]    { transform: translateX(-32px); }
[data-reveal="right"]   { transform: translateX(32px);  }
[data-reveal="scale"]   { transform: scale(.93);        }
[data-reveal="left"].revealed,
[data-reveal="right"].revealed,
[data-reveal="scale"].revealed { transform: none; }

/* ── Marquee ── */
@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
.marquee-track { display: flex; width: max-content; animation: marquee 32s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
.marquee-wrap { overflow: hidden; mask-image: linear-gradient(90deg,transparent,black 10%,black 90%,transparent); }

/* ── Stat counter ── */
@keyframes count-up { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: none; } }

/* ── Animations ── */
@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes scale-in { from { opacity: 0; transform: scale(.93); } to { opacity: 1; transform: scale(1); } }

.animate-fade-up   { animation: fade-up  .6s cubic-bezier(.22,1,.36,1) both; }
.animate-fade-in   { animation: fade-in  .5s ease both; }
.animate-scale-in  { animation: scale-in .5s cubic-bezier(.22,1,.36,1) both; }
.delay-100 { animation-delay: .1s; }
.delay-200 { animation-delay: .2s; }
.delay-300 { animation-delay: .3s; }
.delay-400 { animation-delay: .4s; }
.delay-500 { animation-delay: .5s; }

/* ── FAQ accordion ── */
details summary { cursor: pointer; list-style: none; user-select: none; }
details summary::-webkit-details-marker { display: none; }
details .faq-icon { transition: transform .3s ease; }
details[open] .faq-icon { transform: rotate(45deg); }
details .faq-body {
  overflow: hidden;
  animation: faq-open .3s cubic-bezier(.22,1,.36,1) both;
}
@keyframes faq-open {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: none; }
}

/* ── Pricing ── */
.pricing-featured {
  position: relative;
  background: linear-gradient(160deg, rgba(var(--brand-rgb),.14) 0%, rgba(var(--brand-rgb),.04) 100%);
  border: 1px solid rgba(var(--brand-rgb),.45) !important;
  box-shadow:
    0 0 0 1px rgba(var(--brand-rgb),.2) inset,
    0 0 40px rgba(var(--brand-rgb),.18),
    0 0 80px rgba(var(--brand-rgb),.08),
    var(--shadow-xl) !important;
}
.pricing-featured::before {
  content: '';
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 0;
  background: radial-gradient(80% 60% at 50% 0%, rgba(var(--brand-rgb),.18) 0%, transparent 70%);
}
.pricing-featured > * { position: relative; z-index: 1; }

/* ── Form inputs ── */
.form-input {
  width: 100%; padding: .75rem 1rem;
  border: 1.5px solid rgba(0,0,0,.1);
  border-radius: var(--radius-md);
  font-size: .9375rem; background: #fff; color: #111827;
  transition: border-color .2s ease, box-shadow .2s ease;
  outline: none;
}
.form-input:focus {
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(var(--brand-rgb),.12);
}
.form-input-dark {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.1);
  color: #f1f5f9;
}
.form-input-dark::placeholder { color: rgba(255,255,255,.35); }
.form-input-dark:focus {
  border-color: rgba(var(--brand-rgb),.6);
  box-shadow: 0 0 0 3px rgba(var(--brand-rgb),.15);
}
.form-label { font-size: .8125rem; font-weight: 600; color: #374151; margin-bottom: .4rem; display: block; }
.form-label-dark { color: rgba(255,255,255,.7); }

/* ── Pristine validation feedback ── */
.has-error .form-input, .has-error select, .has-error textarea {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,.12);
}
.has-success .form-input, .has-success select, .has-success textarea {
  border-color: #10B981;
}
.form-error-text {
  font-size: .75rem; font-weight: 500; color: #EF4444;
  margin-top: .35rem; display: block;
}

/* ── Notyf brand overrides ── */
.notyf__toast--success { border-radius: 14px !important; }
.notyf__toast--error   { border-radius: 14px !important; }
.notyf__ripple         { border-radius: 14px; }

/* ── GLightbox theme ── */
.glightbox-custom .gslide-description { background: rgba(0,0,0,.85); color: #fff; }
.glightbox-custom .gprev, .glightbox-custom .gnext {
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
  border-radius: 50%; width: 44px; height: 44px;
}
.glightbox-custom .gprev:hover, .glightbox-custom .gnext:hover {
  background: var(--brand); border-color: var(--brand);
}

/* ── Spin animation for submit button loader ── */
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }

/* ── Stat numbers ── */
.stat-number {
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 800; line-height: 1; letter-spacing: -.04em;
  font-variant-numeric: tabular-nums;
}

/* ── Process step connectors ── */
.step-connector {
  position: absolute; left: 1.75rem; top: 4.5rem; bottom: -1.5rem; width: 2px;
  background: linear-gradient(to bottom, rgba(var(--brand-rgb),.25), transparent);
}

/* ── Testimonial ── */
.testimonial-quote {
  font-size: 4rem; line-height: 1; font-family: Georgia, serif;
  color: var(--brand); opacity: .25; position: absolute; top: 1rem; left: 1.5rem;
  pointer-events: none; user-select: none;
}

/* ── Nav ── */
.nav-link {
  font-size: .875rem; font-weight: 500; color: #374151;
  transition: color .15s ease; padding: .25rem 0;
  position: relative;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
  height: 2px; background: var(--brand); border-radius: 1px;
  transform: scaleX(0); transition: transform .2s ease;
}
.nav-link:hover { color: var(--brand); }
.nav-link:hover::after { transform: scaleX(1); }
.nav-link-dark { color: rgba(255,255,255,.65); }
.nav-link-dark:hover { color: #fff; }

/* ── Hero extras ── */
.hero-mesh {
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(var(--brand-rgb),.25) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(var(--bd-rgb),.15) 0%, transparent 60%),
    #030712;
}
.hero-split-gradient {
  background:
    radial-gradient(ellipse 50% 60% at 90% 50%, rgba(var(--brand-rgb),.07) 0%, transparent 65%),
    radial-gradient(ellipse 30% 40% at 10% 20%, rgba(var(--brand-rgb),.04) 0%, transparent 60%),
    linear-gradient(160deg, #f0f4ff 0%, #fff 50%, #f9fafb 100%);
}

/* ══════════════════════════════════════════════════
   ADVANCED DESIGN SYSTEM — glass, holo, effects
   ══════════════════════════════════════════════════ */

/* ── Glass cards ── */
.glass {
  background: linear-gradient(135deg,rgba(255,255,255,.06) 0%,rgba(255,255,255,.015) 100%);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255,255,255,.09);
  box-shadow: 0 1px 0 0 rgba(255,255,255,.08) inset,0 -1px 0 0 rgba(0,0,0,.3) inset,0 24px 48px -16px rgba(0,0,0,.5);
}
.glass-hi {
  position: relative;
  background:
    radial-gradient(120% 80% at 0% 0%,rgba(255,255,255,.10) 0%,transparent 55%),
    radial-gradient(100% 80% at 100% 100%,rgba(var(--brand-rgb),.05) 0%,transparent 60%),
    linear-gradient(135deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.02) 100%);
  backdrop-filter: blur(40px) saturate(220%) brightness(1.08);
  -webkit-backdrop-filter: blur(40px) saturate(220%) brightness(1.08);
  border: 1px solid rgba(255,255,255,.13);
  box-shadow:
    0 1px 0 0 rgba(255,255,255,.18) inset,
    0 -1px 0 0 rgba(0,0,0,.4) inset,
    1px 0 0 0 rgba(255,255,255,.04) inset,
    0 32px 64px -24px rgba(0,0,0,.6),
    0 0 64px -24px rgba(var(--brand-rgb),.18);
}
.glass-hi::after {
  content:"";position:absolute;inset:0;border-radius:inherit;
  background:linear-gradient(180deg,rgba(255,255,255,.08) 0%,transparent 22%,transparent 78%,rgba(0,0,0,.12) 100%);
  pointer-events:none;mix-blend-mode:overlay;opacity:.6;z-index:0;
}

/* ── Hairline grid (dashboard backgrounds) ── */
.hairline {
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size: 32px 32px;
}

/* ── Holographic border ── */
.holo { position:relative;isolation:isolate; }
.holo::before {
  content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;
  background:linear-gradient(135deg,rgba(var(--brand-rgb),.6),rgba(var(--bd-rgb),.2) 30%,transparent 50%,rgba(var(--brand-rgb),.2) 70%,rgba(var(--brand-rgb),.6));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;
  pointer-events:none;transition:opacity .6s;
}
.holo:hover::before {
  background:linear-gradient(135deg,var(--brand),var(--brand-dark) 50%,var(--brand));
}

/* ── Text display styles ── */
.text-display { font-weight:600;letter-spacing:-.04em;line-height:.92; }
.text-serif-italic { font-style:italic;font-weight:400;letter-spacing:-.02em; }
.text-cosmic {
  background:linear-gradient(120deg,rgba(255,255,255,.96) 0%,var(--brand) 30%,var(--brand-dark) 55%,var(--brand) 80%,rgba(255,255,255,.96) 100%);
  background-size:200% 100%;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
  animation:cosmic-shift 12s ease-in-out infinite;
}
@keyframes cosmic-shift { 0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;} }

/* ── Eyebrow / section tag ── */
.eyebrow {
  font-family:monospace;font-size:11px;font-weight:500;
  text-transform:uppercase;letter-spacing:.24em;color:rgba(255,255,255,.5);
}
.eyebrow::before { content:"◐";margin-right:.5em;color:var(--brand); }

/* ── Noise texture overlay ── */
.noise { position:relative; }
.noise::after {
  content:"";position:absolute;inset:0;pointer-events:none;opacity:.04;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

/* ── Glow divider ── */
.divider-glow {
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(var(--brand-rgb),.4) 30%,rgba(var(--brand-rgb),.4) 50%,rgba(var(--bd-rgb),.4) 70%,transparent);
}

/* ── Aurora blobs ── */
.aurora { position:absolute;inset:0;pointer-events:none;overflow:hidden; }
.aurora::before,.aurora::after {
  content:"";position:absolute;width:80%;height:80%;border-radius:50%;
  filter:blur(80px);opacity:.5;animation:aurora-drift 20s ease-in-out infinite;
}
.aurora::before { background:radial-gradient(circle,rgba(var(--brand-rgb),.6),transparent 70%);top:-20%;left:-10%; }
.aurora::after  { background:radial-gradient(circle,rgba(var(--bd-rgb),.6),transparent 70%);bottom:-20%;right:-10%;animation-delay:-10s; }
@keyframes aurora-drift {
  0%,100%{transform:translate(0,0) scale(1);}
  33%{transform:translate(10%,5%) scale(1.1);}
  66%{transform:translate(-5%,10%) scale(.95);}
}

/* ── Orbital ring ── */
.orbital { position:absolute;border:1px solid rgba(255,255,255,.06);border-radius:50%;transform:translate(-50%,-50%); }

/* ── Veil primary button ── */
.btn-veil {
  position:relative;
  background:linear-gradient(180deg,var(--brand) 0%,var(--brand-dark) 100%);
  color:#fff;
  box-shadow:0 0 0 1px rgba(var(--brand-rgb),.85) inset,0 1px 0 0 rgba(255,255,255,.3) inset,0 0 24px -2px rgba(var(--brand-rgb),.6),0 8px 24px -8px rgba(var(--brand-rgb),.5);
  transition:all .4s cubic-bezier(.4,0,.2,1);
}
.btn-veil:hover {
  box-shadow:0 0 0 1px rgba(var(--brand-rgb),.9) inset,0 1px 0 0 rgba(255,255,255,.4) inset,0 0 40px 0 rgba(var(--brand-rgb),.8),0 12px 32px -8px rgba(var(--brand-rgb),.7);
  transform:translateY(-1px);
}
.btn-ghost-veil {
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);
  backdrop-filter:blur(12px);transition:all .3s ease;
}
.btn-ghost-veil:hover {
  background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);
  box-shadow:0 0 24px -4px rgba(var(--brand-rgb),.3);
}

/* ── Film grain overlay (CSS static, animated by JS when animated-bg canvas present) ── */
.grain-overlay {
  position:fixed;inset:0;z-index:50;pointer-events:none;opacity:.06;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' seed='5'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size:240px 240px;animation:grain-shift 1.4s steps(6) infinite;
}
@keyframes grain-shift {
  0%{transform:translate(0,0);}20%{transform:translate(-3%,2%);}40%{transform:translate(2%,-3%);}
  60%{transform:translate(-2%,-2%);}80%{transform:translate(3%,1%);}100%{transform:translate(0,0);}
}

/* ── Chromatic aberration text ── */
.chromatic { position:relative;display:inline-block; }
.chromatic::before,.chromatic::after {
  content:attr(data-text);position:absolute;inset:0;pointer-events:none;
  -webkit-text-fill-color:currentColor;color:inherit;mix-blend-mode:screen;opacity:.55;
}
.chromatic::before { color:var(--brand);transform:translate(-1.2px,0);animation:chrom-x 4s ease-in-out infinite alternate; }
.chromatic::after  { color:var(--brand-dark);transform:translate(1.2px,0);animation:chrom-x 4s ease-in-out infinite alternate-reverse; }
@keyframes chrom-x { from{transform:translate(-1.2px,0);}to{transform:translate(-2.4px,.6px);} }

/* ── Hairline draw (animated reveal on .in-view) ── */
.hairline-draw {
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(var(--brand-rgb),.5) 30%,rgba(var(--brand-rgb),.5) 50%,rgba(var(--bd-rgb),.5) 70%,transparent);
  -webkit-mask:linear-gradient(90deg,#000,#000) left/0% 100% no-repeat;
          mask:linear-gradient(90deg,#000,#000) left/0% 100% no-repeat;
  transition:-webkit-mask-size 1.4s cubic-bezier(.22,1,.36,1),mask-size 1.4s cubic-bezier(.22,1,.36,1);
}
.hairline-draw.in-view { -webkit-mask-size:100% 100%;mask-size:100% 100%; }

/* ── 3D tilt card (set --tx/--ty via JS) ── */
.tilt-3d {
  transform:perspective(1000px) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg)) translateZ(0);
  transition:transform .4s cubic-bezier(.22,1,.36,1);
  transform-style:preserve-3d;
}

/* ── Shimmer sweep on hover ── */
.shimmer { position:relative;overflow:hidden; }
.shimmer::after {
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.08) 48%,rgba(255,255,255,.18) 50%,rgba(255,255,255,.08) 52%,transparent 70%);
  transform:translateX(-100%);transition:transform .9s cubic-bezier(.22,1,.36,1);mix-blend-mode:screen;
}
.shimmer:hover::after { transform:translateX(100%); }

/* ── Glitch text on hover ── */
.glitch { display:inline-block; }
.glitch:hover { animation:glitch-x .4s steps(2,end) 1; }
@keyframes glitch-x {
  0%{transform:translate(0,0);text-shadow:none;}
  20%{transform:translate(-1px,0);text-shadow:1px 0 var(--brand),-1px 0 var(--brand-dark);}
  40%{transform:translate(1px,0);text-shadow:-1px 0 var(--brand),1px 0 var(--brand-dark);}
  60%{transform:translate(-1px,0);text-shadow:1px 0 var(--brand);}
  100%{transform:translate(0,0);text-shadow:none;}
}
/* Periodic glitch for block headings — calm 87% of the time, then bursts */
@keyframes glitch-fx{
  0%,87%,100%{transform:translate(0);text-shadow:none;}
  88%{transform:translate(-2px,0);text-shadow:2px 0 var(--brand);}
  89%{transform:translate(2px,0);text-shadow:-2px 0 var(--brand-dark,var(--brand));}
  90%{transform:translate(-1px,.5px);text-shadow:1.5px 0 var(--brand),-1px 0 var(--brand-dark,var(--brand));}
  91%,93%{transform:translate(0);text-shadow:none;}
  92%{transform:translate(1px,-.5px);text-shadow:-1px 0 var(--brand);}
}
/* Chromatic aberration via animated text-shadow (no data-text needed) */
@keyframes chrom-text{
  0%{text-shadow:-1.5px 0 var(--brand),1.5px 0 var(--brand-dark,var(--brand));}
  100%{text-shadow:-3px .5px var(--brand),3px -.5px var(--brand-dark,var(--brand));}
}

/* ── Vertical light beams ── */
.beam {
  position:absolute;width:1px;
  background:linear-gradient(to bottom,transparent,rgba(var(--brand-rgb),.8),transparent);
  filter:blur(1px);animation:beam-fall 6s linear infinite;opacity:0;
}
@keyframes beam-fall { 0%{transform:translateY(-30%);opacity:0;}20%,80%{opacity:1;}100%{transform:translateY(130%);opacity:0;} }

/* ── Conic gradient spin ── */
.conic-spin {
  background:conic-gradient(from 0deg,rgba(var(--brand-rgb),.6),rgba(var(--bd-rgb),.6),rgba(var(--brand-rgb),.4),rgba(var(--brand-rgb),.6));
  animation:spin-slow 12s linear infinite;
}
.conic-glow {
  position:absolute;border-radius:9999px;filter:blur(40px);opacity:.45;
  background:conic-gradient(from 90deg,rgba(var(--brand-rgb),.55),rgba(var(--bd-rgb),.45),rgba(var(--brand-rgb),.4),rgba(var(--brand-rgb),.55));
  animation:spin-slow 28s linear infinite;pointer-events:none;
}

/* ── Card lift with sheen ── */
.card-lift {
  transition:transform 600ms cubic-bezier(.2,.8,.2,1),box-shadow 600ms cubic-bezier(.2,.8,.2,1),border-color 600ms ease;
  will-change:transform;
}
.card-lift:hover {
  transform:translateY(-3px);
  box-shadow:0 24px 60px -24px rgba(var(--brand-rgb),.35),0 0 0 1px rgba(var(--brand-rgb),.18);
}
.sheen { position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit; }
.sheen::after {
  content:"";position:absolute;top:-120%;left:-60%;width:60%;height:340%;
  background:linear-gradient(115deg,transparent 0%,rgba(255,255,255,.06) 45%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.06) 55%,transparent 100%);
  transform:translateX(-30%) rotate(8deg);
  transition:transform 1100ms cubic-bezier(.2,.8,.2,1);
}
.card-lift:hover .sheen::after { transform:translateX(420%) rotate(8deg); }

/* ── Live dot indicator ── */
.live-dot { position:relative;display:inline-flex;align-items:center;justify-content:center;height:.5rem;width:.5rem; }
.live-dot::before {
  content:"";position:absolute;inset:0;border-radius:9999px;background:#22c55e;
  animation:ping-ripple 2.6s cubic-bezier(0,0,.2,1) infinite;opacity:.7;
}
.live-dot::after {
  content:"";position:relative;height:100%;width:100%;border-radius:9999px;
  background:#4ade80;box-shadow:0 0 8px rgba(74,222,128,.9);
}

/* ── Tape scroll (marquee with pause on hover) ── */
@keyframes tape-scroll { from{transform:translateX(0);}to{transform:translateX(-50%);} }
.tape-scroll {
  display:inline-flex;align-items:center;gap:2.25rem;
  animation:tape-scroll 60s linear infinite;will-change:transform;
}
.tape-scroll:hover { animation-play-state:paused; }

/* ── Tabular number flip glow ── */
.tabular-nums-flip { font-variant-numeric:tabular-nums;transition:text-shadow 600ms ease; }
.tabular-nums-flip:hover { text-shadow:0 0 14px rgba(var(--brand-rgb),.6),0 0 32px rgba(var(--brand-rgb),.35); }

/* ── Animation helpers ── */
@keyframes float-y  { 0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);} }
@keyframes pulse-soft { 0%,100%{opacity:.4;}50%{opacity:1;} }
@keyframes spin-slow { to{transform:rotate(360deg);} }
@keyframes marquee   { from{transform:translateX(0);}to{transform:translateX(-50%);} }
.animate-float-y    { animation:float-y 6s ease-in-out infinite; }
.animate-pulse-soft { animation:pulse-soft 3s ease-in-out infinite; }
.animate-spin-slow  { animation:spin-slow 30s linear infinite; }
.animate-marquee    { animation:marquee 40s linear infinite; }

/* ── Custom cursor hide (cursor elements injected by JS) ── */
@media (hover:hover) and (pointer:fine) {
  html,a,button,[role="button"],input,textarea,select { cursor:none; }
}

/* ── Accessibility: reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
  canvas[data-animated-bg] { display: none; }
  .orb, .orb-1, .orb-2, .orb-3 { animation: none; }
}
`.trim();
}
