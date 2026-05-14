import type { MapBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderMap(block: MapBlock): string {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec  = sectionClasses(bg, block.settings?.paddingY);
  const { data, variant } = block;

  const iframeHtml = `
    <div class="relative w-full rounded-2xl overflow-hidden shadow-lg" style="height:420px">
      <iframe
        src="${esc(data.embedUrl)}"
        width="100%"
        height="100%"
        style="border:0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Kort over ${esc(data.address ?? 'lokation')}"
      ></iframe>
    </div>`;

  const infoHtml = (data.address || data.phone || data.hours || data.directionsUrl)
    ? `<div class="space-y-4 ${variant === 'split' ? '' : 'mt-8'}">
        ${data.heading ? `<h2 class="text-2xl font-extrabold font-heading mb-2">${esc(data.heading)}</h2>` : ''}
        ${data.address ? `<div class="flex items-start gap-3">
          <div class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand/10 text-brand mt-0.5"><i data-lucide="map-pin" class="w-4 h-4"></i></div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-400' : 'text-gray-400'} mb-0.5">Adresse</div>
            <span class="font-medium text-sm">${esc(data.address)}</span>
          </div>
        </div>` : ''}
        ${data.phone ? `<div class="flex items-start gap-3">
          <div class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand/10 text-brand"><i data-lucide="phone" class="w-4 h-4"></i></div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-400' : 'text-gray-400'} mb-0.5">Telefon</div>
            <a href="tel:${esc(data.phone.replace(/\s/g, ''))}" class="font-medium text-sm hover:text-brand transition-colors">${esc(data.phone)}</a>
          </div>
        </div>` : ''}
        ${data.hours ? `<div class="flex items-start gap-3">
          <div class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-brand/10 text-brand"><i data-lucide="clock" class="w-4 h-4"></i></div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-400' : 'text-gray-400'} mb-0.5">Åbningstider</div>
            <span class="font-medium text-sm">${esc(data.hours)}</span>
          </div>
        </div>` : ''}
        ${data.directionsUrl ? `<a href="${esc(data.directionsUrl)}" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm mt-2">
            <i data-lucide="navigation" class="w-4 h-4"></i> Vejledning
          </a>` : ''}
      </div>`
    : '';

  if (variant === 'full_width') {
    return `
<section class="${sec}">
  ${data.heading ? `<div class="max-w-7xl mx-auto px-6 lg:px-8 mb-8 text-center">
    <h2 class="text-3xl font-extrabold font-heading">${esc(data.heading)}</h2>
  </div>` : ''}
  <div class="relative w-full overflow-hidden shadow-lg" style="height:480px">
    <iframe
      src="${esc(data.embedUrl)}"
      width="100%" height="100%"
      style="border:0" allowfullscreen loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title="Kort"
    ></iframe>
  </div>
</section>`.trim();
  }

  if (variant === 'split') {
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-start">
      ${iframeHtml}
      ${infoHtml}
    </div>
  </div>
</section>`.trim();
  }

  // with_info (default)
  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${iframeHtml}
    ${infoHtml}
  </div>
</section>`.trim();
}
