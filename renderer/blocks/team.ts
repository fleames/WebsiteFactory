import type { TeamBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderTeam(block: TeamBlock): string {
  const bg = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY ?? 'xl');
  const { data } = block;

  const cards = data.members.map(m => `
    <div class="flex flex-col items-center text-center p-6 rounded-2xl ${dark ? 'bg-white/10' : 'bg-white'} shadow-sm">
      <div class="w-24 h-24 rounded-full overflow-hidden bg-slate-200 mb-4 shrink-0">
        ${m.image
          ? `<img src="${esc(m.image)}" alt="${esc(m.name)}" class="w-full h-full object-cover" onerror="this.style.display='none'" />`
          : `<div class="w-full h-full flex items-center justify-center text-3xl">👤</div>`
        }
      </div>
      <div class="font-bold text-base ${dark ? 'text-white' : 'text-slate-800'}">${esc(m.name)}</div>
      <div class="text-sm font-medium text-brand mt-0.5">${esc(m.role)}</div>
      ${m.bio ? `<p class="text-sm ${dark ? 'text-gray-300' : 'text-gray-500'} mt-2 leading-relaxed">${esc(m.bio)}</p>` : ''}
      ${m.social?.length ? `
        <div class="flex items-center gap-2 mt-3">
          ${m.social.map(s => `<a href="${esc(s.url)}" class="text-xs ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-brand'} capitalize transition-colors">${esc(s.platform)}</a>`).join('')}
        </div>` : ''}
    </div>`).join('');

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading ? `<h2 class="text-3xl font-extrabold font-heading text-center mb-2">${esc(data.heading)}</h2>` : ''}
    ${data.subtext ? `<p class="text-center ${dark ? 'text-gray-300' : 'text-gray-500'} mb-10">${esc(data.subtext)}</p>` : ''}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${cards}
    </div>
  </div>
</section>`.trim();
}
