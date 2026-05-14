import type { LogoCloudBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderLogoCloud(block: LogoCloudBlock): string {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const sec  = sectionClasses(bg, block.settings?.paddingY ?? 'md');
  const { data, variant } = block;

  const logoHtml = (item: { name: string; image?: string; url?: string }, cls: string) => {
    const inner = item.image
      ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" class="${cls}" loading="lazy">`
      : `<span class="font-bold text-base ${dark ? 'text-gray-300' : 'text-gray-500'} tracking-wide">${esc(item.name)}</span>`;
    return item.url
      ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center">${inner}</a>`
      : `<div class="flex items-center justify-center">${inner}</div>`;
  };

  // marquee — infinite scrolling logo strip
  if (variant === 'marquee') {
    const doubled = [...data.items, ...data.items];
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 mb-6">
    ${data.heading ? `<p class="text-center text-sm font-semibold uppercase tracking-widest ${dark ? 'text-gray-500' : 'text-gray-400'} mb-6">${esc(data.heading)}</p>` : ''}
  </div>
  <div class="marquee-wrap">
    <div class="marquee-track">
      ${doubled.map(item => `
        <div class="flex items-center justify-center px-10 py-2">
          ${item.image
            ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" class="h-8 w-auto object-contain max-w-[120px] ${dark ? 'opacity-40 hover:opacity-70' : 'opacity-50 hover:opacity-80'} grayscale hover:grayscale-0 transition-all" loading="lazy">`
            : `<span class="font-bold text-base ${dark ? 'text-gray-500' : 'text-gray-400'} tracking-wide whitespace-nowrap">${esc(item.name)}</span>`
          }
        </div>`).join('')}
    </div>
  </div>
  ${data.subtext ? `<p class="text-center text-xs ${dark ? 'text-gray-500' : 'text-gray-400'} mt-4 px-6">${esc(data.subtext)}</p>` : ''}
</section>`.trim();
  }

  if (variant === 'card_grid') {
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading ? `<div class="text-center mb-8">
      <h3 class="text-xl font-bold font-heading ${dark ? '' : 'text-gray-700'}">${esc(data.heading)}</h3>
      ${data.subtext ? `<p class="text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mt-1">${esc(data.subtext)}</p>` : ''}
    </div>` : ''}
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      ${data.items.map(item => `
        <div class="flex flex-col items-center gap-3 p-5 rounded-xl ${dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-sm'} hover:shadow-md transition-shadow">
          ${logoHtml(item, 'h-10 w-auto object-contain max-w-[120px] opacity-70 hover:opacity-100 transition-opacity')}
          <span class="text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}">${esc(item.name)}</span>
        </div>`).join('')}
    </div>
  </div>
</section>`.trim();
  }

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading ? `<p class="text-center text-sm font-semibold uppercase tracking-widest ${dark ? 'text-gray-500' : 'text-gray-400'} mb-8">${esc(data.heading)}</p>` : ''}
    <div class="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
      ${data.items.map(item => logoHtml(item, 'h-8 w-auto object-contain max-w-[120px] opacity-50 hover:opacity-80 transition-opacity grayscale hover:grayscale-0')).join('')}
    </div>
    ${data.subtext ? `<p class="text-center text-xs ${dark ? 'text-gray-500' : 'text-gray-400'} mt-6">${esc(data.subtext)}</p>` : ''}
  </div>
</section>`.trim();
}
