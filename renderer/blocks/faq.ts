import type { FaqBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderFaq(block: FaqBlock): string {
  const bg = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY);
  const { data } = block;

  const items = data.items.map((item, i) => `
    <div class="border-b ${dark ? 'border-white/10' : 'border-gray-200'} last:border-0">
      <button
        class="w-full text-left py-5 flex items-center justify-between gap-4 font-semibold text-base hover:text-brand transition-colors"
        onclick="toggleFaq(this)"
        aria-expanded="false"
      >
        <span>${esc(item.question)}</span>
        <i data-lucide="chevron-down" class="w-5 h-5 flex-shrink-0 transition-transform duration-200"></i>
      </button>
      <div class="faq-answer hidden pb-5 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed max-w-2xl">
        ${esc(item.answer)}
      </div>
    </div>`).join('');

  const script = `
<script>
  function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector('[data-lucide="chevron-down"]');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    answer.classList.toggle('hidden');
    icon.style.transform = expanded ? '' : 'rotate(180deg)';
  }
</script>`.trim();

  if (data.items.length > 6) {
    // Two-column layout for long FAQ lists
    const mid = Math.ceil(data.items.length / 2);
    const col1 = data.items.slice(0, mid);
    const col2 = data.items.slice(mid);

    const renderCol = (items: typeof data.items) => items.map(item => `
      <div class="border-b ${dark ? 'border-white/10' : 'border-gray-200'} last:border-0">
        <button class="w-full text-left py-5 flex items-center justify-between gap-4 font-semibold text-base hover:text-brand transition-colors" onclick="toggleFaq(this)" aria-expanded="false">
          <span>${esc(item.question)}</span>
          <i data-lucide="chevron-down" class="w-5 h-5 flex-shrink-0 transition-transform duration-200"></i>
        </button>
        <div class="faq-answer hidden pb-5 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed">
          ${esc(item.answer)}
        </div>
      </div>`).join('');

    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="text-center mb-12 max-w-xl mx-auto">
      ${data.heading ? `<h2 class="text-3xl md:text-4xl font-extrabold font-heading">${esc(data.heading)}</h2>` : ''}
    </div>
    <div class="grid lg:grid-cols-2 gap-x-16">
      <div>${renderCol(col1)}</div>
      <div>${renderCol(col2)}</div>
    </div>
  </div>
  ${script}
</section>`.trim();
  }

  return `
<section class="${sec}">
  <div class="max-w-3xl mx-auto px-6 lg:px-8">
    <div class="text-center mb-12">
      ${data.heading ? `<h2 class="text-3xl md:text-4xl font-extrabold font-heading">${esc(data.heading)}</h2>` : ''}
      ${data.subtext ? `<p class="mt-4 text-lg ${dark ? 'text-gray-300' : 'text-gray-500'}">${esc(data.subtext)}</p>` : ''}
    </div>
    <div>
      ${items}
    </div>
  </div>
  ${script}
</section>`.trim();
}
