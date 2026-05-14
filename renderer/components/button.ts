import type { CTA } from '../../schema/types.js';
import { esc } from '../utils/html.js';

const arrowSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>`;

export function renderButton(cta: CTA, onDark = false, arrow = false, extraClass = ''): string {
  const base = `inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg transition-all text-sm${arrow ? ' btn-arrow' : ''}${extraClass ? ' ' + extraClass : ''}`;

  const styles: Record<string, string> = {
    filled: 'bg-brand hover:bg-brand-dark text-white shadow-sm hover:shadow-md',
    outline: onDark
      ? 'border-2 border-white/50 hover:border-white text-white hover:bg-white/10'
      : 'border-2 border-brand text-brand hover:bg-brand hover:text-white',
    ghost: onDark
      ? 'text-white/80 hover:text-white hover:bg-white/10'
      : 'text-brand hover:text-brand-dark hover:bg-brand/5',
  };

  const styleClass = styles[cta.style] ?? styles.filled;
  const suffix = arrow ? arrowSvg : '';

  return `<a href="${esc(cta.href)}" class="${base} ${styleClass}">${esc(cta.label)}${suffix}</a>`;
}

export function renderButtons(ctas: CTA[] | undefined, onDark = false): string {
  if (!ctas?.length) return '';
  return `<div class="flex flex-wrap gap-4">${ctas.map((c, i) => renderButton(c, onDark, i === 0 && c.style === 'filled')).join('')}</div>`;
}
