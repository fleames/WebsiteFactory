import React from 'react';
import type { StatsBlock } from '../../schema/types.js';
import { cn, isDark, bgCls as bgClsFn } from '../utils.js';

interface Props { block: StatsBlock; }

export function Stats({ block }: Props) {
  const bg      = block.settings?.background ?? 'dark';
  const dark    = isDark(bg);
  const variant = block.variant ?? 'row';
  const { data } = block;
  const items   = data.items ?? [];

  const bgCls = bgClsFn(bg);

  const heading = data.heading && (
    <div className="text-center mb-14">
      <h2 className={cn('font-extrabold', dark ? 'text-white' : 'text-gray-900')}
        style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
        {data.heading}
      </h2>
    </div>
  );

  /* ── neon_counter ── */
  if (variant === 'neon_counter') {
    return (
      <section className="relative py-20 lg:py-28 overflow-hidden bg-[#030712] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 dot-grid-dark opacity-30" />
          {items.map((_, i) => (
            <div key={i} className="absolute rounded-full pointer-events-none"
              style={{
                width: '500px', height: '500px',
                left: `${10 + i * (80 / Math.max(items.length - 1, 1))}%`,
                top: '50%', transform: 'translate(-50%,-50%)',
                background: `radial-gradient(circle, rgba(var(--brand-rgb),.12) 0%, transparent 65%)`,
                filter: 'blur(60px)',
              }} />
          ))}
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          {heading}
          <div data-stagger className={cn('grid gap-6', items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4')}>
            {items.map((item, i) => (
              <div key={i} className="relative text-center p-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden" data-reveal>
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(var(--brand-rgb),.15) 0%, transparent 60%)' }} />
                <div className="relative z-10">
                  {item.icon && (
                    <div className="mb-4 mx-auto w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(var(--brand-rgb),.12)', border: '1px solid rgba(var(--brand-rgb),.25)', boxShadow: '0 0 20px rgba(var(--brand-rgb),.2)' }}>
                      <i data-lucide={item.icon} className="w-5 h-5 text-brand" />
                    </div>
                  )}
                  <div className="font-extrabold leading-none mb-2"
                    style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', color: 'var(--brand)', textShadow: '0 0 40px rgba(var(--brand-rgb),.6), 0 0 80px rgba(var(--brand-rgb),.3)', letterSpacing: '-0.04em' }}
                    data-count-to={parseFloat(String(item.stat).replace(/[^0-9.]/g, '')) || undefined}
                    data-count-suffix={String(item.stat).replace(/^[\d.,]+/, '')}
                    data-count-dec={(() => { const n = String(item.stat).replace(/[^0-9.]/g,''); const d = n.indexOf('.'); return d >= 0 ? String(n.length - d - 1) : undefined; })()}>
                    {item.stat}
                  </div>
                  <div className="text-sm font-semibold text-white/70 uppercase tracking-widest">{item.label}</div>
                  {item.description && <div className="text-xs mt-2 text-white/40 leading-relaxed">{item.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── with_icon ── */
  if (variant === 'with_icon') {
    return (
      <section className={cn('relative py-20 lg:py-28 overflow-hidden', bgCls)}>
        {dark && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 dot-grid-dark opacity-40" />
          </div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {heading}
          <div data-stagger className={cn('grid gap-6', items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4')}>
            {items.map((item, i) => (
              <div key={i} className={cn('flex flex-col p-7 rounded-2xl', dark ? 'card-dark' : 'card-light')} data-reveal>
                <div className="icon-box w-14 h-14 mb-5 shrink-0">
                  <i data-lucide={item.icon ?? 'trending-up'} className="w-7 h-7" />
                </div>
                <div className="stat-number text-brand mb-1"
                  style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '-0.04em' }}
                  data-count-to={parseFloat(String(item.stat).replace(/[^0-9.]/g, '')) || undefined}
                  data-count-suffix={String(item.stat).replace(/^[\d.,]+/, '')}
                  data-count-dec={(() => { const n = String(item.stat).replace(/[^0-9.]/g,''); const d = n.indexOf('.'); return d >= 0 ? String(n.length - d - 1) : undefined; })()}>
                  {item.stat}
                </div>
                <div className={cn('text-sm font-semibold', dark ? 'text-white/70' : 'text-gray-700')}>{item.label}</div>
                {item.description && (
                  <div className={cn('text-xs mt-2 leading-relaxed', dark ? 'text-white/40' : 'text-gray-400')}>{item.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── row ── */
  if (variant === 'row') {
    return (
      <section className={cn('relative py-16 lg:py-20 overflow-hidden', bgCls)}>
        {dark && <div className="absolute inset-0 dot-grid-dark opacity-40 pointer-events-none" />}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {heading}
          <div data-stagger className={cn('grid divide-y md:divide-y-0 md:divide-x',
            dark ? 'divide-white/[0.07]' : 'divide-gray-100',
            items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4')}>
            {items.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center py-8 md:py-4 md:px-8" data-reveal>
                {item.icon && (
                  <div className="icon-box w-10 h-10 mx-auto mb-3">
                    <i data-lucide={item.icon} className="w-5 h-5" />
                  </div>
                )}
                <div className="stat-number text-brand"
                  data-count-to={parseFloat(String(item.stat).replace(/[^0-9.]/g, '')) || undefined}
                  data-count-suffix={String(item.stat).replace(/^[\d.,]+/, '')}
                  data-count-dec={(() => { const n = String(item.stat).replace(/[^0-9.]/g,''); const d = n.indexOf('.'); return d >= 0 ? String(n.length - d - 1) : undefined; })()}>
                  {item.stat}
                </div>
                <div className={cn('text-sm font-medium mt-1', dark ? 'text-white/60' : 'text-gray-500')}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── grid (default) ── */
  return (
    <section className={cn('relative py-20 lg:py-28 overflow-hidden', bgCls)}>
      {dark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 dot-grid-dark opacity-40" />
          <div className="orb orb-1" />
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {heading}
        <div data-stagger className={cn('grid gap-8', items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4')}>
          {items.map((item, i) => (
            <div key={i} className={cn('text-center p-6 rounded-2xl', dark ? 'card-dark' : 'bg-gray-50 border border-gray-100')}
              data-reveal>
              {item.icon && (
                <div className="icon-box w-11 h-11 mx-auto mb-4">
                  <i data-lucide={item.icon} className="w-5 h-5" />
                </div>
              )}
              <div className="stat-number text-brand"
                data-count-to={parseFloat(String(item.stat).replace(/[^0-9.]/g, '')) || undefined}
                data-count-suffix={String(item.stat).replace(/^[\d.,]+/, '')}
                data-count-dec="0">
                {item.stat}
              </div>
              <div className={cn('text-sm font-medium mt-2', dark ? 'text-white/60' : 'text-gray-500')}>{item.label}</div>
              {item.description && (
                <div className={cn('text-xs mt-1', dark ? 'text-white/40' : 'text-gray-400')}>{item.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
