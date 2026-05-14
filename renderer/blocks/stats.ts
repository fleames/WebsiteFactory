import type { StatsBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark, blobBg } from '../utils/html.js';

export function renderStats(block: StatsBlock): string {
  const bg       = block.settings?.background ?? 'white';
  const dark     = isDark(bg);
  const sec      = sectionClasses(bg, block.settings?.paddingY ?? 'md');
  const useBlobs = (block.settings as Record<string,unknown>)?.blobs as boolean | undefined;
  const gradHead = (block.settings as Record<string,unknown>)?.gradientHeading as boolean | undefined;
  const { data, variant } = block;

  const cols = data.items.length <= 4 ? data.items.length : 4;
  const colClass = {2:'grid-cols-2',3:'grid-cols-3',4:'grid-cols-2 md:grid-cols-4'}[cols] ?? 'grid-cols-2 md:grid-cols-4';

  const headHtml = data.heading
    ? `<h2 class="text-3xl font-extrabold font-heading text-center mb-10${gradHead ? ' gradient-text' : ''}">${esc(data.heading)}</h2>`
    : '';

  // neon_counter — glowing neon numbers in glass cards, futurism/cyberpunk style
  if (variant === 'neon_counter') {
    return `
<section class="${sec}${useBlobs ? ' relative overflow-hidden' : ' relative overflow-hidden'}">
  ${useBlobs ? blobBg(dark) : ''}
  <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
    ${headHtml}
    <div class="grid ${colClass} gap-6">
      ${data.items.map(item => `
        <div class="glass-card cyber-pulse group p-8 rounded-2xl text-center transition-all duration-300">
          ${item.icon ? `<div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/15 border border-brand/30 text-brand mb-4 group-hover:bg-brand group-hover:text-white transition-all"><i data-lucide="${esc(item.icon)}" class="w-6 h-6"></i></div>` : ''}
          <div class="text-5xl md:text-6xl font-extrabold font-heading text-brand neon-text neon-flicker leading-none">${esc(item.stat)}</div>
          <div class="text-xs font-bold mt-3 uppercase tracking-widest text-gray-300">${esc(item.label)}</div>
          ${item.description ? `<div class="text-xs text-gray-500 mt-2">${esc(item.description)}</div>` : ''}
        </div>`).join('')}
    </div>
  </div>
</section>`.trim();
  }

  // "with_icon" variant — big numbers, TIMOCOM/Pangea style
  if (variant === 'with_icon') {
    const divider = dark ? 'border-white/10' : 'border-gray-100';
    return `
<section class="${sec}${useBlobs ? ' relative overflow-hidden' : ''}">
  ${useBlobs ? blobBg(dark) : ''}
  <div class="${useBlobs ? 'relative z-10 ' : ''}max-w-7xl mx-auto px-6 lg:px-8">
    ${headHtml}
    <div class="grid ${colClass} gap-0 divide-x ${divider} text-center">
      ${data.items.map(item => `
        <div class="px-8 py-4">
          ${item.icon ? `<div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand/10 text-brand mb-3"><i data-lucide="${esc(item.icon)}" class="w-5 h-5"></i></div>` : ''}
          <div class="text-5xl md:text-6xl font-extrabold font-heading text-brand leading-none">${esc(item.stat)}</div>
          <div class="text-sm font-bold mt-2 uppercase tracking-wide">${esc(item.label)}</div>
          ${item.description ? `<div class="text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mt-1">${esc(item.description)}</div>` : ''}
        </div>`).join('')}
    </div>
  </div>
</section>`.trim();
  }

  // grid variant — icon + stat cards
  if (variant === 'grid') {
    return `
<section class="${sec}${useBlobs ? ' relative overflow-hidden' : ''}">
  ${useBlobs ? blobBg(dark) : ''}
  <div class="${useBlobs ? 'relative z-10 ' : ''}max-w-7xl mx-auto px-6 lg:px-8">
    ${headHtml}
    <div class="grid ${colClass} gap-6">
      ${data.items.map(item => `
        <div class="p-7 rounded-2xl text-center ${dark ? 'bg-white/10 border border-white/10' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'} transition-shadow">
          ${item.icon ? `<div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand mb-4"><i data-lucide="${esc(item.icon)}" class="w-6 h-6"></i></div>` : ''}
          <div class="text-4xl font-extrabold font-heading text-brand">${esc(item.stat)}</div>
          <div class="text-sm font-semibold mt-1">${esc(item.label)}</div>
          ${item.description ? `<div class="text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} mt-1.5">${esc(item.description)}</div>` : ''}
        </div>`).join('')}
    </div>
  </div>
</section>`.trim();
  }

  // row (default) — numbered prefix style (riftproxy 01/02/03)
  return `
<section class="${sec}${useBlobs ? ' relative overflow-hidden' : ''}">
  ${useBlobs ? blobBg(dark) : ''}
  <div class="${useBlobs ? 'relative z-10 ' : ''}max-w-7xl mx-auto px-6 lg:px-8">
    ${headHtml}
    <div class="grid ${colClass} gap-0 divide-x ${dark ? 'divide-white/[0.06]' : 'divide-gray-100'} text-center">
      ${data.items.map((item, i) => `
        <div class="px-6 py-4">
          <div class="text-[10px] font-mono font-bold ${dark ? 'text-white/25' : 'text-gray-300'} mb-2 tracking-widest">${String(i + 1).padStart(2, '0')}</div>
          ${item.icon ? `<div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand/10 text-brand mb-3 mx-auto"><i data-lucide="${esc(item.icon)}" class="w-5 h-5"></i></div>` : ''}
          <div class="text-4xl md:text-5xl font-extrabold font-heading ${dark ? 'text-white' : 'text-brand'} leading-none">${esc(item.stat)}</div>
          <div class="text-xs font-bold mt-2 uppercase tracking-wider ${dark ? 'text-white/50' : 'text-gray-500'}">${esc(item.label)}</div>
          ${item.description ? `<div class="text-xs ${dark ? 'text-gray-500' : 'text-gray-400'} mt-1">${esc(item.description)}</div>` : ''}
        </div>`).join('')}
    </div>
  </div>
</section>`.trim();
}
