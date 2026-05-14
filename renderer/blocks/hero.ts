import type { HeroBlock } from '../../schema/types.js';
import { esc, isDark, sectionClasses, blobBg } from '../utils/html.js';
import { renderButtons } from '../components/button.js';
import { renderAnimatedBg, type AnimatedBg } from '../animations.js';

export function renderHero(block: HeroBlock, brandColor = '#3B82F6'): string {
  const bg       = block.settings?.background ?? 'dark';
  const dark     = isDark(bg);
  const sec      = sectionClasses(bg, block.settings?.paddingY);
  const animType = (block.settings as Record<string, unknown>)?.animatedBg as AnimatedBg | undefined;
  const useBlobs = !animType && ((block.settings as Record<string, unknown>)?.blobs as boolean | undefined);
  const gradHead = (block.settings as Record<string, unknown>)?.gradientHeading as boolean | undefined;
  const { data, variant } = block;

  const h1Class   = 'text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading leading-tight tracking-tight';
  const subtextCls = `text-lg ${dark ? 'text-gray-300' : 'text-gray-600'} mt-4 mb-8 max-w-lg`;

  // Badge — with optional "NEW" chip prefix
  const badgeHtml = data.badge
    ? `<div class="inline-flex items-center gap-2 ${dark ? 'bg-white/[0.08] text-white/80 border border-white/[0.12]' : 'bg-brand/10 text-brand border border-brand/20'} text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
        ${data.badgeIsNew ? `<span class="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">NEW</span>` : `<i data-lucide="sparkles" class="w-3 h-3 opacity-70"></i>`}
        <span>${esc(data.badge)}</span>
       </div>`
    : '';

  // Headline — with optional italic accent word appended
  function buildHeadline(cls: string, centered = false): string {
    const maxW = centered ? ' max-w-3xl mx-auto' : '';
    const txt = gradHead
      ? `<span class="gradient-text">${esc(data.headline)}</span>`
      : esc(data.headline);
    const accent = data.accentLine
      ? ` <em class="not-italic font-heading" style="background:linear-gradient(135deg,${brandColor},${brandColor}cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${esc(data.accentLine)}</em>`
      : '';
    return `<h1 class="${cls}${maxW}">${txt}${accent}</h1>`;
  }

  // Chips strip — use-case pills below CTAs
  const chipsHtml = data.chips?.length
    ? `<div class="flex flex-wrap gap-2 mt-6 ${variant === 'centered' || variant === 'with_badge' ? 'justify-center' : ''}">
        ${data.chips.map(c => `<span class="text-xs px-3 py-1 rounded-full border ${dark ? 'border-white/[0.12] text-white/40 hover:text-white/70 hover:border-white/25' : 'border-gray-200 text-gray-400 hover:text-gray-600'} transition-colors cursor-default">${esc(c)}</span>`).join('')}
       </div>`
    : '';

  const imageHtml = data.image
    ? `<div class="relative">
        <img src="${esc(data.image)}" alt="${esc(data.imageAlt ?? '')}"
          class="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]" loading="eager">
        <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none"></div>
       </div>`
    : '';

  const fallbackCtas = data.ctas?.length ? data.ctas : [{ label: 'Kontakt os', href: '#contact', style: 'filled' as const }];

  const textContent = `
    <div>
      ${badgeHtml}
      ${buildHeadline(h1Class)}
      ${data.subtext ? `<p class="${subtextCls}">${esc(data.subtext)}</p>` : ''}
      ${renderButtons(fallbackCtas, dark)}
      ${chipsHtml}
    </div>`;

  let inner: string;

  if (variant === 'centered') {
    inner = `
      <div class="text-center max-w-3xl mx-auto">
        ${badgeHtml}
        ${buildHeadline(h1Class, true)}
        ${data.subtext ? `<p class="text-lg ${dark ? 'text-gray-300' : 'text-gray-600'} mt-4 mb-8 max-w-xl mx-auto">${esc(data.subtext)}</p>` : ''}
        <div class="flex flex-wrap gap-4 justify-center">${renderButtons(fallbackCtas, dark)}</div>
        ${chipsHtml}
      </div>`;
  } else if (variant === 'split_image_reverse') {
    inner = `
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        ${imageHtml}${textContent}
      </div>`;
  } else if (variant === 'minimal') {
    inner = `
      <div class="max-w-2xl">
        ${badgeHtml}
        ${buildHeadline(h1Class)}
        ${data.subtext ? `<p class="${subtextCls}">${esc(data.subtext)}</p>` : ''}
        ${renderButtons(data.ctas, dark)}
        ${chipsHtml}
      </div>`;
  } else if (variant === 'with_badge') {
    inner = `
      <div class="text-center max-w-4xl mx-auto">
        ${badgeHtml}
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading leading-tight tracking-tight mb-6">
          ${gradHead ? `<span class="gradient-text">${esc(data.headline)}</span>` : esc(data.headline)}
          ${data.accentLine ? `<em class="not-italic font-heading block mt-1" style="background:linear-gradient(135deg,${brandColor},${brandColor}cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${esc(data.accentLine)}</em>` : ''}
        </h1>
        ${data.subtext ? `<p class="text-xl ${dark ? 'text-gray-300' : 'text-gray-500'} mb-8 max-w-2xl mx-auto">${esc(data.subtext)}</p>` : ''}
        <div class="flex flex-wrap gap-4 justify-center mb-6">${renderButtons(data.ctas, dark)}</div>
        ${chipsHtml}
        ${data.image ? `<div class="mt-10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10"><img src="${esc(data.image)}" alt="${esc(data.imageAlt ?? '')}" class="w-full object-cover" loading="eager"></div>` : ''}
      </div>`;
  } else {
    // split_image (default)
    inner = `
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        ${textContent}${imageHtml}
      </div>`;
  }

  const animHtml = animType ? renderAnimatedBg(animType, block.id, brandColor) : '';
  const blobHtml = useBlobs ? blobBg(dark) : '';
  const needsRelative = !!(animType || useBlobs);

  // Decorative GPS coordinate overlays for starfield / dark cosmic heroes
  const isStarfield = animType === 'starfield';
  const coordOverlay = isStarfield ? `
  <span class="absolute top-6 left-6 text-[10px] font-mono text-white/20 tracking-widest pointer-events-none select-none hidden lg:block" aria-hidden="true">N 55°40'58"</span>
  <span class="absolute top-6 right-6 text-[10px] font-mono text-white/20 tracking-widest pointer-events-none select-none hidden lg:block" aria-hidden="true">E 12°34'22"</span>` : '';

  return `
<section class="${sec}${needsRelative || isStarfield ? ' relative overflow-hidden' : ''}">
  ${animHtml}${blobHtml}
  ${coordOverlay}
  <div class="${needsRelative || isStarfield ? 'relative' : ''}" style="${needsRelative || isStarfield ? 'z-index:10;' : ''}">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      ${inner}
    </div>
  </div>
</section>`.trim();
}
