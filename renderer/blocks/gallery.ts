import type { GalleryBlock } from '../../schema/types.js';
import { esc, sectionClasses } from '../utils/html.js';

export function renderGallery(block: GalleryBlock): string {
  const bg = block.settings?.background ?? 'white';
  const sec = sectionClasses(bg, block.settings?.paddingY ?? 'xl');
  const { data } = block;

  const items = data.items.map(item => `
    <div class="overflow-hidden rounded-xl bg-slate-100 aspect-square group">
      <img
        src="${esc(item.src)}"
        alt="${esc(item.alt)}"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onerror="this.style.display='none'"
      />
      ${item.caption ? `<p class="text-xs text-center text-gray-500 mt-1 px-1">${esc(item.caption)}</p>` : ''}
    </div>`).join('');

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading ? `<h2 class="text-3xl font-extrabold font-heading text-center mb-10">${esc(data.heading)}</h2>` : ''}
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      ${items}
    </div>
  </div>
</section>`.trim();
}
