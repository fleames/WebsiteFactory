import type { CoreValuesBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderCoreValues(block: CoreValuesBlock): string {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec  = sectionClasses(bg, block.settings?.paddingY);
  const { data, variant } = block;

  const mutedTx = dark ? 'text-white/70'  : 'text-gray-500';
  const headTx  = dark ? 'text-white'     : 'text-gray-900';
  const iconBg  = dark ? 'bg-white/10'    : 'bg-brand/10';
  const iconTx  = dark ? 'text-white'     : 'text-brand';
  const cardBg  = dark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm';

  const header = (data.heading || data.subtext) ? `
    <div class="text-center mb-14">
      ${data.heading ? `<h2 class="text-3xl md:text-4xl font-extrabold font-heading mb-3">${esc(data.heading)}</h2>` : ''}
      ${data.subtext ? `<p class="text-lg ${mutedTx} max-w-2xl mx-auto">${esc(data.subtext)}</p>` : ''}
    </div>` : '';

  // icon_grid variant — card per value
  if (variant === 'icon_grid') {
    const cols = data.items.length <= 3
      ? `grid md:grid-cols-${data.items.length} gap-8`
      : data.items.length === 4 ? 'grid sm:grid-cols-2 lg:grid-cols-4 gap-8'
      : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-8';

    const items = data.items.map(item => `
      <div class="rounded-2xl border ${cardBg} p-7 flex flex-col gap-4 transition-shadow hover:shadow-md">
        ${item.icon ? `
        <div class="w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center">
          <i data-lucide="${esc(item.icon)}" class="w-6 h-6 ${iconTx}"></i>
        </div>` : ''}
        <div>
          <h3 class="font-bold text-lg ${headTx} mb-1.5">${esc(item.title)}</h3>
          <p class="text-sm leading-relaxed ${mutedTx}">${esc(item.description)}</p>
        </div>
      </div>`).join('');

    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${header}
    <div class="${cols}">${items}</div>
  </div>
</section>`.trim();
  }

  // horizontal_list variant — icon + text in a row, no cards
  if (variant === 'horizontal_list') {
    const divider = dark ? 'divide-white/10' : 'divide-gray-100';
    const items = data.items.map(item => `
      <div class="flex items-start gap-4 py-6">
        ${item.icon ? `
        <div class="w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0 mt-0.5">
          <i data-lucide="${esc(item.icon)}" class="w-5 h-5 ${iconTx}"></i>
        </div>` : `<div class="w-2 h-2 rounded-full bg-brand mt-2.5 shrink-0"></div>`}
        <div>
          <div class="font-bold ${headTx} mb-1">${esc(item.title)}</div>
          <p class="text-sm ${mutedTx} leading-relaxed">${esc(item.description)}</p>
        </div>
      </div>`).join('');

    return `
<section class="${sec}">
  <div class="max-w-3xl mx-auto px-6 lg:px-8">
    ${header}
    <div class="divide-y ${divider}">${items}</div>
  </div>
</section>`.trim();
  }

  // numbered variant — large number + content
  const gridCols = data.items.length <= 3 ? `grid md:grid-cols-${data.items.length} gap-10`
    : data.items.length === 4 ? 'grid sm:grid-cols-2 lg:grid-cols-4 gap-10'
    : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-10';

  const numColor = dark ? 'text-white/10' : 'text-brand/10';

  const items = data.items.map((item, i) => `
    <div class="relative">
      <div class="font-black text-7xl leading-none ${numColor} select-none mb-3">${String(i + 1).padStart(2, '0')}</div>
      ${item.icon ? `<i data-lucide="${esc(item.icon)}" class="w-6 h-6 ${iconTx} mb-3"></i>` : ''}
      <h3 class="font-bold text-xl ${headTx} mb-2">${esc(item.title)}</h3>
      <p class="text-sm leading-relaxed ${mutedTx}">${esc(item.description)}</p>
    </div>`).join('');

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${header}
    <div class="${gridCols}">${items}</div>
  </div>
</section>`.trim();
}
