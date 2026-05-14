import type { CtaBannerBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';
import { renderButton } from '../components/button.js';

export function renderCtaBanner(block: CtaBannerBlock): string {
  const bg = block.settings?.background ?? 'brand';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY ?? 'lg');
  const { data, variant } = block;

  if (variant === 'split') {
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
      <div>
        <h2 class="text-2xl md:text-3xl font-extrabold font-heading">${esc(data.heading)}</h2>
        ${data.subtext ? `<p class="${dark ? 'text-white/75' : 'text-gray-500'} mt-2">${esc(data.subtext)}</p>` : ''}
      </div>
      <div class="flex flex-wrap gap-4 flex-shrink-0">
        ${data.ctas.map(c => renderButton(c, dark)).join('')}
      </div>
    </div>
  </div>
</section>`.trim();
  }

  // pattern — dot/grid pattern overlay with spotlight effect, ideal for dark sections
  if (variant === 'pattern') {
    return `
<section class="${sec} relative overflow-hidden noise-overlay" data-spotlight>
  <div class="dot-pattern absolute inset-0 opacity-40 pointer-events-none"></div>
  <div class="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 ${dark ? 'bg-white/10 text-white/70 border border-white/20' : 'bg-brand/10 text-brand border border-brand/20'}">
      <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
      <span>${dark ? 'Klar til at komme i gang?' : 'Næste skridt'}</span>
    </div>
    <h2 class="text-3xl md:text-5xl font-extrabold font-heading leading-tight">${esc(data.heading)}</h2>
    ${data.subtext ? `<p class="${dark ? 'text-white/70' : 'text-gray-500'} mt-5 text-lg max-w-xl mx-auto leading-relaxed">${esc(data.subtext)}</p>` : ''}
    <div class="mt-10 flex flex-wrap gap-4 justify-center">
      ${data.ctas.map(c => renderButton(c, dark, false, 'btn-glow')).join('')}
    </div>
  </div>
</section>`.trim();
  }

  return `
<section class="${sec}">
  <div class="max-w-3xl mx-auto px-6 lg:px-8 text-center">
    <h2 class="text-3xl md:text-4xl font-extrabold font-heading">${esc(data.heading)}</h2>
    ${data.subtext ? `<p class="${dark ? 'text-white/75' : 'text-gray-500'} mt-4 text-lg">${esc(data.subtext)}</p>` : ''}
    <div class="mt-8 flex flex-wrap gap-4 justify-center">
      ${data.ctas.map(c => renderButton(c, dark)).join('')}
    </div>
  </div>
</section>`.trim();
}
