import React from 'react';
import type { TrustBarBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: TrustBarBlock; }

export function TrustBar({ block }: Props) {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const { data, variant } = block;
  const items = data.items ?? [];

  if (variant === 'logos' || variant === 'badges') {
    const logos = [...items, ...items]; // double for marquee scroll
    return (
      <section className={cn('py-12 border-y',
        dark ? 'bg-gray-950 border-white/[0.06]' : 'bg-gray-50 border-gray-100')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {data.heading && (
            <p className={cn('text-center text-xs font-bold uppercase tracking-[.15em] mb-7',
              dark ? 'text-white/30' : 'text-gray-400')}>
              {data.heading}
            </p>
          )}
          <div className="marquee-wrap">
            <div className="marquee-track gap-10">
              {logos.map((item, i) => (
                <div key={i} className={cn('shrink-0 flex items-center gap-2 px-2',
                  dark ? 'text-white/35' : 'text-gray-400')}>
                  {item.type === 'badge' && <i data-lucide={item.icon} className="w-5 h-5" />}
                  <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* Icon row (default) */
  return (
    <section className={cn('py-12 border-y',
      dark ? 'bg-gray-950 border-white/[0.06]' : 'bg-gray-50 border-gray-100')}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {data.heading && (
          <p className={cn('text-center text-xs font-bold uppercase tracking-[.15em] mb-7',
            dark ? 'text-white/30' : 'text-gray-400')}>
            {data.heading}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {items.map((item, i) => (
            <div key={i} className={cn('flex items-center gap-2.5 transition-colors',
              dark ? 'text-white/45 hover:text-white/70' : 'text-gray-400 hover:text-gray-600')}>
              {item.type === 'badge'
                ? <i data-lucide={item.icon} className="w-5 h-5 shrink-0" />
                : <span className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold">{item.label.charAt(0)}</span>
              }
              <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
