import type { TestimonialsBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

function stars(rating: number): string {
  return Array.from({ length: 5 }, (_, i) =>
    `<i data-lucide="star" class="w-4 h-4 ${i < rating ? 'fill-brand text-brand' : 'text-gray-300'}"></i>`
  ).join('');
}

export function renderTestimonials(block: TestimonialsBlock): string {
  const bg = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY);
  const { data } = block;

  const aggregateHtml = data.aggregate
    ? `<div class="flex items-center justify-center gap-2 mt-3">
        <div class="flex">${stars(Math.round(data.aggregate.rating))}</div>
        <span class="font-bold text-brand">${data.aggregate.rating}</span>
        <span class="text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}">${data.aggregate.count} anmeldelser på ${esc(data.aggregate.source)}</span>
       </div>`
    : '';

  const sourceIcon: Record<string, string> = {
    google: 'G',
    trustpilot: 'T',
    facebook: 'f',
  };

  const avatarHtml = (item: { name: string; avatar?: string }) => item.avatar
    ? `<img src="${esc(item.avatar)}" alt="${esc(item.name)}" class="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm">`
    : `<div class="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-sm flex-shrink-0">${esc(item.name.charAt(0))}</div>`;

  const items = Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : [
        { name: 'Kunde A', rating: 5, text: 'Fantastisk service og hurtig udrykning. Kan varmt anbefales!' },
        { name: 'Kunde B', rating: 5, text: 'Professionelt og venligt team. Løste problemet hurtigt.' },
        { name: 'Kunde C', rating: 5, text: 'Meget tilfreds. Kom til tiden og prisen var fair.' },
      ];

  const cards = items.map(item => `
    <div class="p-7 rounded-2xl ${dark ? 'bg-white/10' : 'bg-white border border-gray-100 shadow-sm'}">
      <div class="flex mb-4">${stars(item.rating ?? 5)}</div>
      <p class="text-sm ${dark ? 'text-gray-200' : 'text-gray-700'} leading-relaxed mb-5">"${esc(item.text ?? '')}"</p>
      <div class="flex items-center gap-3">
        ${avatarHtml({ name: item.name ?? 'K', avatar: (item as Record<string, unknown>).avatar as string | undefined })}
        <div class="min-w-0">
          <div class="font-semibold text-sm">${esc(item.name ?? '')}</div>
          ${(item as Record<string, unknown>).location ? `<div class="text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} truncate">${esc(String((item as Record<string, unknown>).location))}</div>` : ''}
        </div>
        ${(item as Record<string, unknown>).source && sourceIcon[String((item as Record<string, unknown>).source)]
          ? `<div class="ml-auto text-xs font-bold text-gray-400 shrink-0">${sourceIcon[String((item as Record<string, unknown>).source)]}</div>`
          : ''}
      </div>
    </div>`).join('');

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading || data.aggregate ? `
      <div class="text-center mb-12">
        ${data.heading ? `<h2 class="text-3xl md:text-4xl font-extrabold font-heading">${esc(data.heading)}</h2>` : ''}
        ${aggregateHtml}
      </div>` : ''}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${cards}
    </div>
  </div>
</section>`.trim();
}
