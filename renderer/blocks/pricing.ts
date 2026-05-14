import type { PricingBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';
import { renderButton } from '../components/button.js';

export function renderPricing(block: PricingBlock): string {
  const bg = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY);
  const { data } = block;

  const tierCards = data.items.map(tier => {
    const highlighted = tier.highlighted;
    const cardClass = highlighted
      ? 'bg-brand text-white shadow-xl shadow-brand/20 scale-105 z-10'
      : dark
        ? 'bg-white/10 border border-white/10'
        : 'bg-white border border-gray-100 shadow-sm';

    return `
      <div class="relative p-8 rounded-2xl ${cardClass} flex flex-col">
        ${tier.badge ? `<div class="absolute -top-3 left-1/2 -translate-x-1/2 inline-block bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">${esc(tier.badge)}</div>` : ''}
        <div class="mb-6">
          <h3 class="font-bold text-lg font-heading">${esc(tier.name)}</h3>
          ${tier.description ? `<p class="text-sm ${highlighted ? 'text-white/70' : dark ? 'text-gray-400' : 'text-gray-500'} mt-1">${esc(tier.description)}</p>` : ''}
        </div>
        <div class="mb-6">
          <span class="text-4xl font-extrabold font-heading">${esc(tier.price)}</span>
          ${tier.period ? `<span class="text-sm ${highlighted ? 'text-white/70' : dark ? 'text-gray-400' : 'text-gray-500'} ml-1">${esc(tier.period)}</span>` : ''}
        </div>
        <ul class="space-y-3 mb-8 flex-1">
          ${tier.features.map(f => `
            <li class="flex items-center gap-3 text-sm">
              <i data-lucide="check" class="w-4 h-4 flex-shrink-0 ${highlighted ? 'text-white/80' : 'text-brand'}"></i>
              <span>${esc(f)}</span>
            </li>`).join('')}
        </ul>
        ${highlighted
          ? `<a href="${esc(tier.cta.href)}" class="block text-center font-semibold px-6 py-3 rounded-lg transition-colors bg-white text-brand hover:bg-gray-50">${esc(tier.cta.label)}</a>`
          : renderButton(tier.cta, dark)}
      </div>`;
  }).join('');

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="text-center mb-14 max-w-xl mx-auto">
      <h2 class="text-3xl md:text-4xl font-extrabold font-heading">${esc(data.heading)}</h2>
      ${data.subtext ? `<p class="mt-4 text-lg ${dark ? 'text-gray-300' : 'text-gray-500'}">${esc(data.subtext)}</p>` : ''}
    </div>

    <div class="grid md:grid-cols-${data.items.length <= 2 ? data.items.length : 3} gap-8 items-center max-w-5xl mx-auto">
      ${tierCards}
    </div>

    ${data.disclaimer ? `<p class="text-center text-xs ${dark ? 'text-gray-500' : 'text-gray-400'} mt-8">${esc(data.disclaimer)}</p>` : ''}
  </div>
</section>`.trim();
}
