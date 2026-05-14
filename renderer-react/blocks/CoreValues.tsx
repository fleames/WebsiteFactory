import React from 'react';
import type { CoreValuesBlock } from '../../schema/types.js';
import { cn, isDark, bgCls } from '../utils.js';

interface Props { block: CoreValuesBlock; }

export function CoreValues({ block }: Props) {
  const bg      = block.settings?.background ?? 'surface';
  const dark    = isDark(bg);
  const variant = block.variant ?? 'icon_grid';
  const { data } = block;
  const items   = data.items ?? [];

  const sectionCls = cn('relative py-24 lg:py-32', bgCls(bg));

  const header = (data.heading || data.subtext) && (
    <div className="text-center max-w-2xl mx-auto mb-14">
      {data.heading && (
        <h2 className={cn('font-extrabold mb-4', dark ? 'text-white' : 'text-gray-900')}
          style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
          {data.heading}
        </h2>
      )}
      {data.subtext && (
        <p className={cn('text-lg leading-relaxed', dark ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>
      )}
    </div>
  );

  /* ── horizontal_list ── */
  if (variant === 'horizontal_list') {
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {header}
          <div className={cn('grid gap-6', items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4')}>
            {items.map((item, i) => (
              <div key={i} className={cn('flex items-start gap-4 p-6 rounded-2xl', dark ? 'card-dark' : 'card-light')} data-reveal>
                {item.icon && (
                  <div className="icon-box w-10 h-10 shrink-0">
                    <i data-lucide={item.icon} className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className={cn('font-bold text-sm mb-1', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
                  <p className={cn('text-xs leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── numbered ── */
  if (variant === 'numbered') {
    return (
      <section className={sectionCls}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {header}
          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className={cn('flex gap-6 p-7 rounded-2xl', dark ? 'card-dark' : 'card-light')} data-reveal>
                <div className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-black text-white text-lg"
                  style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))', boxShadow: '0 4px 12px rgba(var(--brand-rgb),.3)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="pt-2">
                  <h3 className={cn('font-bold text-base mb-2', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
                  <p className={cn('text-sm leading-relaxed', dark ? 'text-white/60' : 'text-gray-500')}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── icon_grid (default) ── */
  return (
    <section className={sectionCls}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {header}
        <div className={cn('grid gap-8', items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4')}>
          {items.map((item, i) => (
            <div key={i} className={cn('flex flex-col items-center text-center p-8 rounded-2xl', dark ? 'card-dark' : 'card-light')} data-reveal>
              {item.icon && (
                <div className="icon-box icon-box-gradient w-14 h-14 mb-5">
                  <i data-lucide={item.icon} className="w-7 h-7" />
                </div>
              )}
              <h3 className={cn('font-bold text-base mb-2', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
              <p className={cn('text-sm leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
