import type { ProcessBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';
import { renderButton } from '../components/button.js';

export function renderProcess(block: ProcessBlock): string {
  const bg = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY);
  const { data } = block;

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="text-center mb-12 max-w-xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-extrabold font-heading">${esc(data.heading)}</h2>
      ${data.subtext ? `<p class="mt-4 text-lg ${dark ? 'text-gray-300' : 'text-gray-500'}">${esc(data.subtext)}</p>` : ''}
    </div>

    <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      ${data.steps.map((step, i) => `
        <div class="relative text-center">
          ${i < data.steps.length - 1 ? `<div class="hidden md:block absolute top-6 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px ${dark ? 'bg-white/20' : 'bg-gray-200'}"></div>` : ''}
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand text-white font-extrabold text-lg mb-5 relative z-10">
            ${step.number ?? i + 1}
          </div>
          <h3 class="font-bold text-lg font-heading mb-2">${esc(step.title)}</h3>
          <p class="text-sm ${dark ? 'text-gray-300' : 'text-gray-500'} leading-relaxed">${esc(step.description)}</p>
        </div>`).join('')}
    </div>

    ${data.cta ? `<div class="text-center mt-12">${renderButton(data.cta, dark)}</div>` : ''}
  </div>
</section>`.trim();
}
