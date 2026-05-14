import type { TrustBarBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderTrustBar(block: TrustBarBlock): string {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const sec  = sectionClasses(bg, block.settings?.paddingY ?? 'sm');
  const { data, variant } = block;

  const muted   = dark ? 'text-white/60' : 'text-gray-400';
  const divider = dark ? 'divide-white/15' : 'divide-gray-200';

  // ── logos variant — grayscale logo strip (Professionel Ren / Concat style) ─
  if (variant === 'logos') {
    const logos = data.items.map(item => {
      if (item.type === 'logo' && item.image) {
        return `
          <div class="flex items-center justify-center px-4">
            <img src="${esc(item.image)}" alt="${esc(item.label)}"
              class="h-8 w-auto object-contain ${dark ? 'brightness-200 opacity-60 hover:opacity-100' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'} transition-all duration-300"
              title="${esc(item.label)}">
          </div>`;
      }
      return `
        <div class="flex items-center justify-center px-4">
          <span class="text-sm font-semibold ${muted} hover:text-gray-700 transition-colors">${esc(item.label)}</span>
        </div>`;
    }).join('');

    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading ? `<p class="text-center text-xs font-semibold uppercase tracking-widest ${muted} mb-6">${esc(data.heading)}</p>` : ''}
    <div class="flex flex-wrap items-center justify-center gap-2 divide-x ${divider}">
      ${logos}
    </div>
  </div>
</section>`.trim();
  }

  // ── badges / icon_row variants ────────────────────────────────────────────
  const items = data.items.map((item, i) => {
    const pad = i > 0 ? 'pl-6 md:pl-10' : '';
    if (item.type === 'badge') {
      return `<div class="flex items-center gap-2 ${pad}">
        <i data-lucide="${esc(item.icon)}" class="w-5 h-5 ${dark ? 'text-white/80' : 'text-brand'} flex-shrink-0"></i>
        <span class="text-sm font-semibold">${esc(item.label)}</span>
      </div>`;
    }
    if (item.type === 'stat') {
      return `<div class="flex items-center gap-1.5 ${pad}">
        <span class="font-extrabold text-lg text-brand">${esc(item.value)}</span>
        <span class="text-sm ${muted}">${esc(item.label)}</span>
      </div>`;
    }
    // logo in non-logos variant
    return `<div class="flex items-center gap-2 ${pad}">
      ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.label)}" class="h-5 w-auto object-contain">` : ''}
      ${item.value ? `<span class="font-bold text-brand">${esc(item.value)}</span>` : ''}
      <span class="text-sm ${muted}">${esc(item.label)}</span>
    </div>`;
  }).join('');

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading ? `<p class="text-center text-xs font-semibold uppercase tracking-widest ${muted} mb-4">${esc(data.heading)}</p>` : ''}
    <div class="flex flex-wrap items-center justify-center gap-6 md:gap-10 divide-x ${divider}">
      ${items}
    </div>
  </div>
</section>`.trim();
}
