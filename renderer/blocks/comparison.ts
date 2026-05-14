import type { ComparisonBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderComparison(block: ComparisonBlock): string {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec  = sectionClasses(bg, block.settings?.paddingY);
  const { data, variant } = block;

  const headerHtml = (data.heading || data.subtext)
    ? `<div class="text-center mb-10">
        ${data.heading ? `<h2 class="text-3xl md:text-4xl font-extrabold font-heading mb-3">${esc(data.heading)}</h2>` : ''}
        ${data.subtext ? `<p class="text-lg ${dark ? 'text-gray-300' : 'text-gray-500'} max-w-2xl mx-auto">${esc(data.subtext)}</p>` : ''}
       </div>`
    : '';

  const ctaHtml = data.cta
    ? `<div class="text-center mt-10">
        <a href="${esc(data.cta.href)}" class="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3.5 rounded-lg transition-colors">
          ${esc(data.cta.label)}
        </a>
       </div>`
    : '';

  if (variant === 'cards') {
    const colCount = data.columns.length;
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${headerHtml}
    <div class="grid md:grid-cols-${Math.min(colCount, 4)} gap-6">
      ${data.columns.map((col, ci) => {
        const highlighted = col.highlighted;
        const cardCls = highlighted
          ? 'rounded-2xl border-2 border-brand bg-brand text-white shadow-2xl shadow-brand/20 scale-105'
          : `rounded-2xl border ${dark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow-sm`;
        const featureRows = data.rows.map(row => {
          const val = row.values[ci] ?? '–';
          const isCheck = val === 'true' || val === '✓';
          const isCross = val === 'false' || val === '✗' || val === '–';
          const display = isCheck ? `<svg class="w-5 h-5 ${highlighted ? 'text-white' : 'text-brand'} mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`
            : isCross ? `<svg class="w-5 h-5 ${highlighted ? 'text-white/40' : 'text-gray-300'} mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
            : `<span class="text-sm font-medium">${esc(val)}</span>`;
          return `<div class="py-3 border-t ${highlighted ? 'border-white/20' : dark ? 'border-white/10' : 'border-gray-100'} text-center">${display}</div>`;
        }).join('');
        return `
        <div class="${cardCls} overflow-hidden">
          <div class="p-6">
            ${col.badge ? `<span class="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${highlighted ? 'bg-white/20 text-white' : 'bg-brand/10 text-brand'}">${esc(col.badge)}</span>` : ''}
            <h3 class="text-xl font-bold font-heading">${esc(col.name)}</h3>
          </div>
          <div class="px-6 pb-6">${featureRows}</div>
        </div>`;
      }).join('')}
    </div>
    ${ctaHtml}
  </div>
</section>`.trim();
  }

  // table variant
  const colCount = data.columns.length;
  return `
<section class="${sec}">
  <div class="max-w-5xl mx-auto px-6 lg:px-8">
    ${headerHtml}
    <div class="overflow-x-auto rounded-2xl ${dark ? 'border border-white/10' : 'border border-gray-200 shadow-sm'}">
      <table class="w-full text-sm">
        <thead>
          <tr class="${dark ? 'bg-white/5' : 'bg-gray-50'}">
            <th class="py-4 px-5 text-left font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'} w-2/5">Funktion</th>
            ${data.columns.map(col => `
              <th class="py-4 px-4 text-center font-bold ${col.highlighted ? 'text-brand' : dark ? 'text-white' : 'text-gray-900'} relative">
                ${col.badge ? `<span class="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold bg-brand text-white px-2 py-0.5 rounded-full uppercase tracking-wide">${esc(col.badge)}</span>` : ''}
                ${esc(col.name)}
              </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.rows.map((row, ri) => `
            <tr class="${ri % 2 === 0 ? '' : dark ? 'bg-white/[0.02]' : 'bg-gray-50/50'}">
              <td class="py-3.5 px-5 font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}">${esc(row.feature)}</td>
              ${row.values.map((val, ci) => {
                const highlighted = data.columns[ci]?.highlighted;
                const isCheck = val === 'true' || val === '✓';
                const isCross = val === 'false' || val === '✗' || val === '–';
                const display = isCheck
                  ? `<svg class="w-5 h-5 ${highlighted ? 'text-brand' : dark ? 'text-emerald-400' : 'text-emerald-500'} mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`
                  : isCross
                  ? `<svg class="w-5 h-5 ${dark ? 'text-gray-600' : 'text-gray-300'} mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
                  : `<span class="font-medium ${highlighted ? (dark ? 'text-white' : 'text-gray-900') : dark ? 'text-gray-300' : 'text-gray-600'}">${esc(val)}</span>`;
                return `<td class="py-3.5 px-4 text-center ${highlighted ? dark ? 'bg-brand/10' : 'bg-brand/5' : ''}">${display}</td>`;
              }).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${ctaHtml}
  </div>
</section>`.trim();
}
