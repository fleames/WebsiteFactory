import React from 'react';
import type { LogoCloudBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: LogoCloudBlock; }

export function LogoCloud({ block }: Props) {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const { data, variant } = block;
  const items = data.items ?? [];

  const sectionCls = cn('relative',
    dark ? 'bg-gray-950' : bg === 'white' ? 'bg-white' : 'bg-gray-50',
  );

  const LogoItem = ({ item, cls }: { item: typeof items[0]; cls?: string }) => {
    const inner = item.image ? (
      <img src={item.image} alt={item.name} loading="lazy"
        className={cn('h-8 w-auto object-contain max-w-[120px] transition-all duration-300',
          dark ? 'opacity-35 hover:opacity-70 brightness-0 invert' : 'opacity-50 hover:opacity-90 grayscale hover:grayscale-0',
          cls)} />
    ) : (
      <span className={cn('font-bold text-sm tracking-wide whitespace-nowrap transition-colors',
        dark ? 'text-white/25 hover:text-white/60' : 'text-gray-400 hover:text-gray-700')}>
        {item.name}
      </span>
    );
    return item.url ? (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
        {inner}
      </a>
    ) : <div className="flex items-center justify-center">{inner}</div>;
  };

  /* Marquee — auto-scroll logo strip */
  if (variant === 'marquee') {
    const doubled = [...items, ...items];
    return (
      <section className={cn(sectionCls, 'py-10 border-y', dark ? 'border-white/[0.06]' : 'border-gray-100')}>
        {data.heading && (
          <p className={cn('text-center text-[11px] font-bold tracking-[.15em] uppercase mb-7 px-6',
            dark ? 'text-white/25' : 'text-gray-400')}>
            {data.heading}
          </p>
        )}
        <div className="marquee-wrap">
          <div className="marquee-track gap-14">
            {doubled.map((item, i) => (
              <div key={i} className="shrink-0 flex items-center px-2">
                <LogoItem item={item} />
              </div>
            ))}
          </div>
        </div>
        {data.subtext && (
          <p className={cn('text-center text-xs mt-5 px-6', dark ? 'text-white/30' : 'text-gray-400')}>{data.subtext}</p>
        )}
      </section>
    );
  }

  /* Card grid */
  if (variant === 'card_grid') {
    return (
      <section className={cn(sectionCls, 'py-16 lg:py-20')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {(data.heading || data.subtext) && (
            <div className="text-center mb-10">
              {data.heading && (
                <h3 className={cn('font-bold text-xl mb-2', dark ? 'text-white' : 'text-gray-800')}>{data.heading}</h3>
              )}
              {data.subtext && (
                <p className={cn('text-sm', dark ? 'text-white/45' : 'text-gray-500')}>{data.subtext}</p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
              <div key={i}
                className={cn('flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300',
                  dark ? 'bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08]'
                       : 'bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5')}
                data-reveal>
                <LogoItem item={item} cls="h-9 opacity-100 grayscale-0" />
                <span className={cn('text-xs font-medium text-center', dark ? 'text-white/40' : 'text-gray-500')}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* With heading */
  if (variant === 'with_heading') {
    return (
      <section className={cn(sectionCls, 'py-16 lg:py-20')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {data.heading && (
            <h3 className={cn('text-center font-extrabold mb-10', dark ? 'text-white' : 'text-gray-900')}
              style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', letterSpacing: '-0.025em' }}>
              {data.heading}
            </h3>
          )}
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
            {items.map((item, i) => <LogoItem key={i} item={item} />)}
          </div>
          {data.subtext && (
            <p className={cn('text-center text-sm mt-8', dark ? 'text-white/35' : 'text-gray-400')}>{data.subtext}</p>
          )}
        </div>
      </section>
    );
  }

  /* Simple (default) */
  return (
    <section className={cn(sectionCls, 'py-12 border-y', dark ? 'border-white/[0.06]' : 'border-gray-100')}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {data.heading && (
          <p className={cn('text-center text-[11px] font-bold tracking-[.15em] uppercase mb-7',
            dark ? 'text-white/25' : 'text-gray-400')}>
            {data.heading}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-14">
          {items.map((item, i) => <LogoItem key={i} item={item} />)}
        </div>
      </div>
    </section>
  );
}
