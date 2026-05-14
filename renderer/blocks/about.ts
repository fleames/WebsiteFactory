import type { AboutBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';
import { renderButton } from '../components/button.js';

export function renderAbout(block: AboutBlock): string {
  const bg = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY);
  const { data, variant } = block;

  const highlightsHtml = data.highlights?.length
    ? `<div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-8 border-t ${dark ? 'border-white/10' : 'border-gray-100'}">
        ${data.highlights.map(h => `
          <div>
            <div class="text-3xl font-extrabold text-brand">${esc(h.stat)}</div>
            <div class="text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mt-1">${esc(h.label)}</div>
          </div>`).join('')}
       </div>`
    : '';

  const bodyParas = (data.body ?? '').split(/\n\n+/).filter(Boolean);
  const bodyHtml = (cls: string) => bodyParas.length
    ? bodyParas.map((p, i) => `<p class="${i === 0 ? 'mt-5 ' : 'mt-3 '}${cls}">${esc(p)}</p>`).join('')
    : '';

  const paraClass = `text-base ${dark ? 'text-gray-300' : 'text-gray-500'} leading-relaxed`;

  const textContent = `
    <div>
      <h2 class="text-3xl md:text-4xl font-extrabold font-heading leading-tight">${esc(data.heading)}</h2>
      ${bodyHtml(paraClass)}
      ${highlightsHtml}
      ${data.cta ? `<div class="mt-8">${renderButton(data.cta, dark)}</div>` : ''}
    </div>`;

  const imageHtml = data.image
    ? `<div class="relative">
        <img
          src="${esc(data.image)}"
          alt="${esc(data.imageAlt ?? '')}"
          class="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
          loading="lazy"
        >
       </div>`
    : '';

  const reverse = variant === 'split_image_reverse';

  if (variant === 'centered_story') {
    return `
<section class="${sec}">
  <div class="max-w-3xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="text-3xl md:text-4xl font-extrabold font-heading">${esc(data.heading)}</h2>
    ${bodyHtml(paraClass)}
    ${highlightsHtml}
    ${data.cta ? `<div class="mt-8 flex justify-center">${renderButton(data.cta, dark)}</div>` : ''}
  </div>
</section>`.trim();
  }

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
      ${reverse ? `${imageHtml}${textContent}` : `${textContent}${imageHtml}`}
    </div>
  </div>
</section>`.trim();
}
