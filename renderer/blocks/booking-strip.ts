import type { BookingStripBlock } from '../../schema/types.js';
import { esc, isDark } from '../utils/html.js';

export function renderBookingStrip(block: BookingStripBlock): string {
  const { data, variant } = block;
  const bg   = block.settings?.background ?? 'brand';
  const dark = isDark(bg);

  const bgClass = {
    brand:       'bg-brand',
    brand_dark:  'bg-brand-dark',
    brand_tint:  'bg-brand/[0.05]',
    dark:        'bg-gray-900',
    black:       'bg-black',
    white:       'bg-white',
    surface:     'bg-gray-50',
    transparent: '',
  }[bg] ?? 'bg-brand';

  const textColor   = (dark || bg === 'brand' || bg === 'brand_dark') ? 'text-white' : 'text-gray-900';
  const mutedColor  = (dark || bg === 'brand' || bg === 'brand_dark') ? 'text-white/70' : 'text-gray-500';
  const btnLight    = (dark || bg === 'brand' || bg === 'brand_dark');

  const py = { none: '', sm: 'py-6', md: 'py-8', lg: 'py-10', xl: 'py-12' }[block.settings?.paddingY ?? 'md'] ?? 'py-8';

  const bookingBtn = `
    <a href="${esc(data.bookingUrl)}" target="_blank" rel="noopener"
       class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
         btnLight
           ? 'bg-white text-brand hover:bg-gray-50 shadow-brand/20'
           : 'bg-brand text-white hover:bg-brand-dark shadow-brand/30'
       }">
      <i data-lucide="calendar-check" class="w-4 h-4"></i>
      ${esc(data.bookingLabel ?? 'Book en tid')}
    </a>`;

  const phoneBtn = data.phone
    ? `<a href="tel:${esc(data.phone.replace(/\s/g,''))}"
         class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
           btnLight
             ? 'border-white/40 text-white hover:bg-white/10'
             : 'border-brand/30 text-brand hover:bg-brand/5'
         }">
         <i data-lucide="phone" class="w-4 h-4"></i>
         ${esc(data.phone)}
       </a>`
    : '';

  // centered variant
  if (variant === 'centered') {
    return `
<div class="${bgClass} ${textColor} ${py}">
  <div class="max-w-3xl mx-auto px-6 text-center">
    <h2 class="text-2xl md:text-3xl font-extrabold font-heading mb-2">${esc(data.heading)}</h2>
    ${data.subtext ? `<p class="${mutedColor} mb-6 text-base">${esc(data.subtext)}</p>` : '<div class="mb-5"></div>'}
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      ${bookingBtn}
      ${phoneBtn}
    </div>
  </div>
</div>`.trim();
  }

  // split variant
  if (variant === 'split') {
    return `
<div class="${bgClass} ${textColor} ${py}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
    <div>
      <h2 class="text-2xl md:text-3xl font-extrabold font-heading">${esc(data.heading)}</h2>
      ${data.subtext ? `<p class="${mutedColor} mt-1 text-base">${esc(data.subtext)}</p>` : ''}
    </div>
    <div class="flex items-center gap-3 shrink-0">
      ${bookingBtn}
      ${phoneBtn}
    </div>
  </div>
</div>`.trim();
  }

  // with_phone variant — big phone + booking side by side
  return `
<div class="${bgClass} ${textColor} ${py}">
  <div class="max-w-5xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="text-2xl md:text-3xl font-extrabold font-heading mb-6">${esc(data.heading)}</h2>
    <div class="flex flex-col sm:flex-row items-stretch justify-center gap-4">
      ${bookingBtn}
      ${data.phone ? `
      <div class="flex items-center gap-4 px-6 py-3 rounded-xl border-2 ${btnLight ? 'border-white/30 bg-white/10' : 'border-brand/20 bg-brand/5'}">
        <i data-lucide="phone" class="w-5 h-5 ${btnLight ? 'text-white' : 'text-brand'}"></i>
        <div class="text-left">
          ${data.phoneLabel ? `<div class="text-[11px] font-medium ${mutedColor} uppercase tracking-wide">${esc(data.phoneLabel)}</div>` : ''}
          <a href="tel:${esc(data.phone.replace(/\s/g,''))}" class="font-bold text-lg hover:opacity-80 transition-opacity">${esc(data.phone)}</a>
        </div>
      </div>` : ''}
    </div>
  </div>
</div>`.trim();
}
