import type { PromoBannerBlock } from '../../schema/types.js';
import { esc } from '../utils/html.js';

export function renderPromoBanner(block: PromoBannerBlock): string {
  const { data, variant } = block;
  const bg = block.settings?.background ?? (variant === 'urgent' ? 'brand_dark' : 'brand');

  const bgStyle = {
    brand:       'bg-brand',
    brand_dark:  'bg-brand-dark',
    brand_tint:  'bg-brand/[0.05] text-gray-900',
    dark:        'bg-gray-900',
    black:       'bg-black',
    white:       'bg-white text-gray-900',
    surface:     'bg-gray-100 text-gray-900',
    transparent: '',
  }[bg] ?? 'bg-brand';

  const textColor = ['white', 'surface'].includes(bg) ? 'text-gray-900' : 'text-white';

  const urgentDot = variant === 'urgent'
    ? `<span class="relative flex h-2 w-2 mr-2 shrink-0">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
       </span>`
    : '';

  const emojiHtml = data.emoji
    ? `<span class="mr-2 text-base leading-none">${esc(data.emoji)}</span>`
    : '';

  const ctaHtml = data.cta
    ? `<a href="${esc(data.cta.href)}"
         class="ml-4 shrink-0 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold ${
           ['white','surface'].includes(bg)
             ? 'bg-brand text-white hover:bg-brand-dark'
             : 'bg-white/20 hover:bg-white/30 text-white'
         } transition-colors">
         ${esc(data.cta.label)} →
       </a>`
    : '';

  const dismissBtn = data.dismissable !== false
    ? `<button
         onclick="this.closest('[data-promo]').style.display='none'"
         class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity ${textColor}"
         aria-label="Luk">
         <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
         </svg>
       </button>`
    : '';

  return `
<div data-promo class="relative ${bgStyle} ${textColor} text-sm py-2.5 px-4">
  <div class="max-w-7xl mx-auto flex items-center justify-center text-center gap-0 pr-6">
    ${urgentDot}${emojiHtml}
    <span class="font-medium leading-snug">${esc(data.text)}</span>
    ${ctaHtml}
  </div>
  ${dismissBtn}
</div>`.trim();
}
