import type { LocationFinderBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderLocationFinder(block: LocationFinderBlock): string {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const sec  = sectionClasses(bg, block.settings?.paddingY);
  const { data, variant } = block;

  const cardBg  = dark ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-white border-gray-100 hover:shadow-md hover:border-brand/20';
  const mutedTx = dark ? 'text-white/60' : 'text-gray-500';
  const headTx  = dark ? 'text-white' : 'text-gray-900';

  const locationCards = data.locations.map(loc => {
    const imageHtml = loc.image
      ? `<div class="h-40 overflow-hidden rounded-t-xl -mx-px -mt-px">
           <img src="${esc(loc.image)}" alt="${esc(loc.name)}" class="w-full h-full object-cover">
         </div>`
      : '';

    const rows = [
      loc.address && `<div class="flex items-start gap-2.5">
        <i data-lucide="map-pin" class="w-4 h-4 ${dark ? 'text-white/50' : 'text-brand'} mt-0.5 shrink-0"></i>
        <span class="text-sm">${esc(loc.address)}${loc.city ? `, ${esc(loc.city)}` : ''}</span>
      </div>`,
      loc.phone && `<div class="flex items-center gap-2.5">
        <i data-lucide="phone" class="w-4 h-4 ${dark ? 'text-white/50' : 'text-brand'} shrink-0"></i>
        <a href="tel:${esc(loc.phone.replace(/\s/g,''))}" class="text-sm hover:text-brand transition-colors">${esc(loc.phone)}</a>
      </div>`,
      loc.hours && `<div class="flex items-center gap-2.5">
        <i data-lucide="clock" class="w-4 h-4 ${dark ? 'text-white/50' : 'text-brand'} shrink-0"></i>
        <span class="text-sm">${esc(loc.hours)}</span>
      </div>`,
      loc.email && `<div class="flex items-center gap-2.5">
        <i data-lucide="mail" class="w-4 h-4 ${dark ? 'text-white/50' : 'text-brand'} shrink-0"></i>
        <a href="mailto:${esc(loc.email)}" class="text-sm hover:text-brand transition-colors">${esc(loc.email)}</a>
      </div>`,
    ].filter(Boolean).join('');

    const actions = [
      loc.bookingUrl && `<a href="${esc(loc.bookingUrl)}" target="_blank" rel="noopener"
        class="flex-1 text-center text-sm font-semibold py-2 rounded-lg bg-brand hover:bg-brand-dark text-white transition-colors">
        Book tid</a>`,
      loc.mapUrl && `<a href="${esc(loc.mapUrl)}" target="_blank" rel="noopener"
        class="flex-1 text-center text-sm font-medium py-2 rounded-lg border ${dark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:bg-gray-50'} transition-colors">
        Rutevejledning</a>`,
    ].filter(Boolean).join('');

    return `
    <div class="rounded-xl border ${cardBg} overflow-hidden transition-all flex flex-col">
      ${imageHtml}
      <div class="p-5 flex-1 flex flex-col gap-3">
        <h3 class="font-bold text-base ${headTx}">${esc(loc.name)}</h3>
        <div class="space-y-2 ${mutedTx} flex-1">${rows}</div>
        ${actions ? `<div class="flex gap-2 mt-2">${actions}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  const cols = data.locations.length === 1 ? 'max-w-sm mx-auto'
    : data.locations.length === 2 ? 'grid md:grid-cols-2 gap-6'
    : data.locations.length <= 4 ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

  const listVariant = variant === 'list'
    ? data.locations.map(loc => `
      <div class="flex items-start gap-5 p-5 rounded-xl border ${cardBg} transition-all">
        ${loc.image ? `<img src="${esc(loc.image)}" alt="${esc(loc.name)}" class="w-16 h-16 rounded-lg object-cover shrink-0">` : `<div class="w-16 h-16 rounded-lg bg-brand/10 flex items-center justify-center shrink-0"><i data-lucide="map-pin" class="w-6 h-6 text-brand"></i></div>`}
        <div class="flex-1 min-w-0">
          <div class="font-bold ${headTx} mb-1">${esc(loc.name)}</div>
          <div class="${mutedTx} text-sm space-y-0.5">
            ${loc.address ? `<div>${esc(loc.address)}${loc.city ? `, ${esc(loc.city)}` : ''}</div>` : ''}
            ${loc.phone ? `<a href="tel:${esc(loc.phone.replace(/\s/g,''))}" class="block hover:text-brand transition-colors">${esc(loc.phone)}</a>` : ''}
            ${loc.hours ? `<div>${esc(loc.hours)}</div>` : ''}
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          ${loc.bookingUrl ? `<a href="${esc(loc.bookingUrl)}" target="_blank" rel="noopener" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors">Book</a>` : ''}
          ${loc.mapUrl ? `<a href="${esc(loc.mapUrl)}" target="_blank" rel="noopener" class="text-xs font-medium px-3 py-1.5 rounded-lg border ${dark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} transition-colors">Kort</a>` : ''}
        </div>
      </div>`).join('')
    : null;

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading || data.subtext ? `
    <div class="text-center mb-12">
      ${data.heading ? `<h2 class="text-3xl md:text-4xl font-extrabold font-heading mb-3">${esc(data.heading)}</h2>` : ''}
      ${data.subtext ? `<p class="text-lg ${mutedTx} max-w-2xl mx-auto">${esc(data.subtext)}</p>` : ''}
    </div>` : ''}
    <div class="${variant === 'list' ? 'space-y-4' : cols}">
      ${variant === 'list' ? listVariant : locationCards}
    </div>
  </div>
</section>`.trim();
}
