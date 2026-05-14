import type { ServicesBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';
import { renderButton } from '../components/button.js';

export function renderServices(block: ServicesBlock): string {
  const bg = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY);
  const { data, variant } = block;

  const cols = data.columns ?? 3;
  const colClass = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[cols] ?? 'md:grid-cols-3';

  const header = `
    <div class="text-center mb-12 max-w-2xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-extrabold font-heading">${esc(data.heading)}</h2>
      ${data.subtext ? `<p class="mt-4 text-lg ${dark ? 'text-gray-300' : 'text-gray-500'}">${esc(data.subtext)}</p>` : ''}
    </div>`;

  const ctaHtml = data.cta
    ? `<div class="text-center mt-10">${renderButton(data.cta, dark)}</div>`
    : '';

  // glass_cards — translucent frosted-glass cards for dark/glassmorphism backgrounds
  if (variant === 'glass_cards') {
    return `
<section class="${sec} relative overflow-hidden">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
    <div class="text-center mb-12 max-w-2xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-extrabold font-heading text-white">${esc(data.heading)}</h2>
      ${data.subtext ? `<p class="mt-4 text-lg text-gray-300">${esc(data.subtext)}</p>` : ''}
    </div>
    <div class="grid ${colClass} gap-6">
      ${data.items.map(item => `
        <div class="glass-card group p-7 rounded-2xl transition-all duration-300">
          <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-brand/20 border border-brand/30 text-brand mb-5 group-hover:bg-brand group-hover:text-white group-hover:shadow-lg transition-all duration-300">
            <i data-lucide="${esc(item.icon ?? 'star')}" class="w-6 h-6"></i>
          </div>
          <h3 class="font-bold text-lg font-heading mb-2 text-white">
            ${item.link ? `<a href="${esc(item.link)}" class="hover:text-brand transition-colors">${esc(item.title)}</a>` : esc(item.title)}
          </h3>
          <p class="text-sm text-gray-300 leading-relaxed">${esc(item.description)}</p>
          ${item.link ? `<a href="${esc(item.link)}" class="inline-flex items-center gap-1 mt-4 text-sm font-medium text-brand hover:text-brand-dark transition-colors">Læs mere <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></a>` : ''}
        </div>`).join('')}
    </div>
    ${ctaHtml}
  </div>
</section>`.trim();
  }

  // bento_grid — Apple/Linear-style bento layout, first item spans 2 cols
  if (variant === 'bento_grid') {
    const items = data.items;
    const hasFeatured = items.length >= 3;
    return `
<section class="${sec} noise-overlay" data-spotlight>
  <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
    ${header}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-5">
      ${items.map((item, i) => {
        const featured = hasFeatured && i === 0;
        const span = featured ? 'sm:col-span-2' : '';
        const iconSize = featured ? 'w-14 h-14' : 'w-11 h-11';
        const iconInner = featured ? 'w-7 h-7' : 'w-5 h-5';
        const padClass = featured ? 'p-8' : 'p-6';
        return `
        <div class="float-card group ${padClass} rounded-2xl ${dark ? 'bg-white/[0.04] border border-white/[0.08] hover:border-brand/30' : 'bg-white border border-gray-100 hover:border-brand/20'} ${span} transition-all duration-300 flex flex-col">
          <div class="${iconSize} flex items-center justify-center rounded-2xl bg-brand/10 text-brand mb-5 group-hover:bg-brand group-hover:text-white transition-all duration-300">
            <i data-lucide="${esc(item.icon ?? 'zap')}" class="${iconInner}"></i>
          </div>
          <h3 class="font-bold ${featured ? 'text-xl' : 'text-lg'} font-heading mb-2">
            ${item.link ? `<a href="${esc(item.link)}" class="hover:text-brand transition-colors">${esc(item.title)}</a>` : esc(item.title)}
          </h3>
          <p class="text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} leading-relaxed flex-1">${esc(item.description)}</p>
          ${item.link ? `<a href="${esc(item.link)}" class="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-brand hover:gap-2 transition-all">Læs mere <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></a>` : ''}
        </div>`;
      }).join('')}
    </div>
    ${ctaHtml}
  </div>
</section>`.trim();
  }

  // circular_icons — numbered items with large circular icon badges (Enterpret style)
  if (variant === 'circular_icons') {
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${header}
    <div class="grid ${colClass} gap-10">
      ${data.items.map((item, i) => `
        <div class="flex flex-col items-center text-center group">
          <div class="relative mb-5">
            <div class="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg">
              <i data-lucide="${esc(item.icon ?? 'star')}" class="w-9 h-9"></i>
            </div>
            <div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand text-white text-[10px] font-black flex items-center justify-center shadow">
              ${String(i + 1).padStart(2, '0')}
            </div>
          </div>
          <h3 class="font-bold text-lg font-heading mb-2">
            ${item.link ? `<a href="${esc(item.link)}" class="hover:text-brand transition-colors">${esc(item.title)}</a>` : esc(item.title)}
          </h3>
          <p class="text-sm ${dark ? 'text-gray-300' : 'text-gray-500'} leading-relaxed">${esc(item.description)}</p>
        </div>`).join('')}
    </div>
    ${ctaHtml}
  </div>
</section>`.trim();
  }

  if (variant === 'list_icons') {
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${header}
    <div class="max-w-3xl mx-auto space-y-6">
      ${data.items.map(item => `
        <div class="flex gap-5 items-start">
          <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-brand/10 text-brand">
            <i data-lucide="${esc(item.icon ?? 'check')}" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-semibold text-lg mb-1">${esc(item.title)}</h3>
            <p class="${dark ? 'text-gray-300' : 'text-gray-500'} text-sm leading-relaxed">${esc(item.description)}</p>
          </div>
        </div>`).join('')}
    </div>
    ${ctaHtml}
  </div>
</section>`.trim();
  }

  if (variant === 'split_highlight') {
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${header}
    <div class="grid ${colClass} gap-8">
      ${data.items.map(item => `
        <div class="group flex gap-4 p-6 rounded-2xl border ${dark ? 'border-white/10 hover:border-brand/40' : 'border-gray-100 hover:border-brand/30'} hover:shadow-md transition-all">
          <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-brand/10 text-brand">
            <i data-lucide="${esc(item.icon ?? 'arrow-right')}" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-semibold text-base mb-1">
              ${item.link ? `<a href="${esc(item.link)}" class="hover:text-brand transition-colors">${esc(item.title)}</a>` : esc(item.title)}
            </h3>
            <p class="text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} leading-relaxed">${esc(item.description)}</p>
          </div>
        </div>`).join('')}
    </div>
    ${ctaHtml}
  </div>
</section>`.trim();
  }

  // grid_cards (default)
  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${header}
    <div class="grid ${colClass} gap-8">
      ${data.items.map(item => `
        <div class="group p-7 rounded-2xl border ${dark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-100 bg-white hover:shadow-lg'} transition-all">
          <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-brand/10 text-brand mb-5">
            <i data-lucide="${esc(item.icon ?? 'star')}" class="w-6 h-6"></i>
          </div>
          <h3 class="font-bold text-lg font-heading mb-2">
            ${item.link ? `<a href="${esc(item.link)}" class="hover:text-brand transition-colors">${esc(item.title)}</a>` : esc(item.title)}
          </h3>
          <p class="text-sm ${dark ? 'text-gray-300' : 'text-gray-500'} leading-relaxed">${esc(item.description)}</p>
          ${item.link ? `<a href="${esc(item.link)}" class="inline-flex items-center gap-1 mt-4 text-sm font-medium text-brand hover:text-brand-dark transition-colors">Læs mere <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></a>` : ''}
        </div>`).join('')}
    </div>
    ${ctaHtml}
  </div>
</section>`.trim();
}
