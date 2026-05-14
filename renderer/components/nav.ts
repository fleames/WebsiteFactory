import type { Nav } from '../../schema/types.js';
import { esc } from '../utils/html.js';

function renderLogo(nav: Nav): string {
  const logo = nav.logo;
  const text = logo.type === 'text'
    ? `<span class="text-xl font-bold font-heading tracking-tight">${esc(logo.value)}</span>`
    : `<img src="${esc(logo.src)}" alt="${esc(logo.alt)}" class="h-8 w-auto">`;
  return `<a href="/" class="flex items-center">${text}</a>`;
}

export function renderNav(nav: Nav): string {
  const ctaHtml = nav.cta
    ? `<a href="${esc(nav.cta.href)}" class="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap">${esc(nav.cta.label)} <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></a>`
    : '';

  const bookingHtml = nav.bookingUrl
    ? `<a href="${esc(nav.bookingUrl)}" target="_blank" rel="noopener"
         class="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-sm font-bold px-4 py-2 rounded-full transition-colors shadow-sm whitespace-nowrap">
         <i data-lucide="calendar-check" class="w-3.5 h-3.5"></i>
         ${esc(nav.bookingLabel ?? 'Book tid')}
       </a>`
    : '';

  const phoneHtml = nav.phone
    ? `<a href="tel:${esc(nav.phone.replace(/\s/g, ''))}" class="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-brand transition-colors">
        <i data-lucide="phone" class="w-4 h-4"></i>${esc(nav.phone)}
       </a>`
    : '';

  // ── Floating glass pill nav (riftproxy-style) ──────────────────────────────
  if (nav.variant === 'floating_glass') {
    const links = nav.links.map(link =>
      `<a href="${esc(link.href)}" class="text-sm font-medium text-white/60 hover:text-white transition-colors whitespace-nowrap">${esc(link.label)}</a>`
    ).join('');

    const mobileLinks = nav.links.map(l =>
      `<a href="${esc(l.href)}" class="text-sm font-medium text-white/70 py-2 border-b border-white/10">${esc(l.label)}</a>`
    ).join('');

    return `
<div class="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
  <nav class="pointer-events-auto w-full max-w-4xl flex items-center justify-between gap-4 px-4 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
    <div class="flex items-center gap-3 flex-shrink-0">
      ${renderLogo(nav)}
    </div>
    <div class="hidden md:flex items-center gap-6">
      ${links}
    </div>
    <div class="flex items-center gap-3 flex-shrink-0">
      ${nav.phone ? `<a href="tel:${esc(nav.phone.replace(/\s/g,''))}" class="hidden lg:inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors"><i data-lucide="phone" class="w-3.5 h-3.5"></i>${esc(nav.phone)}</a>` : ''}
      ${bookingHtml || ctaHtml}
      <button
        class="md:hidden p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/70"
        aria-label="Open menu"
        onclick="document.getElementById('float-mobile-menu').classList.toggle('hidden')"
      >
        <i data-lucide="menu" class="w-4 h-4"></i>
      </button>
    </div>
  </nav>
  <div id="float-mobile-menu" class="hidden pointer-events-auto absolute top-full mt-2 left-4 right-4 max-w-4xl mx-auto rounded-2xl bg-black/80 backdrop-blur-xl border border-white/[0.08] px-5 py-4 flex-col gap-1">
    <div class="flex flex-col gap-1">
      ${mobileLinks}
      ${nav.phone ? `<a href="tel:${esc(nav.phone.replace(/\s/g,''))}" class="text-sm font-semibold text-brand py-2">${esc(nav.phone)}</a>` : ''}
      ${nav.bookingUrl ? `<a href="${esc(nav.bookingUrl)}" target="_blank" rel="noopener" class="mt-1 text-center py-2.5 px-4 rounded-full bg-brand text-white text-sm font-bold">${esc(nav.bookingLabel ?? 'Book tid')}</a>` : ''}
    </div>
  </div>
</div>
<div class="h-20"></div>`.trim();
  }

  // ── Standard navs ──────────────────────────────────────────────────────────
  const isOverlay = nav.variant === 'transparent_overlay';
  const isMinimal = nav.variant === 'minimal';

  const headerBg = isOverlay
    ? 'absolute top-0 left-0 right-0 bg-transparent'
    : 'sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm';

  const linkCls = isOverlay
    ? 'text-sm font-medium text-white/80 hover:text-white transition-colors'
    : 'text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors';

  const links = nav.links.map(link =>
    `<a href="${esc(link.href)}" class="${linkCls}">${esc(link.label)}</a>`
  ).join('');

  return `
<header class="${headerBg} z-50">
  <nav class="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
    ${renderLogo(nav)}
    ${!isMinimal ? `<div class="hidden md:flex items-center gap-8">${links}</div>` : ''}
    <div class="flex items-center gap-3">
      ${phoneHtml}
      ${bookingHtml || ctaHtml}
      <button
        class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
        onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"
      >
        <i data-lucide="menu" class="w-5 h-5"></i>
      </button>
    </div>
  </nav>
  <div id="mobile-menu" class="hidden md:hidden border-t border-gray-100 bg-white px-6 py-4">
    <div class="flex flex-col gap-3">
      ${nav.links.map(l => `<a href="${esc(l.href)}" class="text-sm font-medium text-gray-700 py-1 border-b border-gray-50">${esc(l.label)}</a>`).join('')}
      ${nav.phone ? `<a href="tel:${esc(nav.phone.replace(/\s/g,''))}" class="text-sm font-semibold text-brand py-1">${esc(nav.phone)}</a>` : ''}
      ${nav.bookingUrl ? `<a href="${esc(nav.bookingUrl)}" target="_blank" rel="noopener" class="text-center mt-1 py-2.5 px-4 rounded-full bg-brand text-white text-sm font-bold">${esc(nav.bookingLabel ?? 'Book tid')}</a>` : ''}
    </div>
  </div>
</header>`.trim();
}
