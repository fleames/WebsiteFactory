import React from 'react';
import type { PromoBannerBlock } from '../../schema/types.js';
import { cn } from '../utils.js';

interface Props { block: PromoBannerBlock; }

export function PromoBanner({ block }: Props) {
  const { data, variant } = block;

  const urgentCls = 'bg-red-600 text-white';
  const offerCls  = 'bg-[#1a1a2e] text-white border-b border-white/10';
  const announceCls = 'bg-brand text-white';

  const cls = variant === 'urgent' ? urgentCls : variant === 'offer' ? offerCls : announceCls;

  const inner = (
    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center gap-3 flex-wrap text-sm font-medium">
      {data.emoji && <span className="text-lg leading-none">{data.emoji}</span>}
      <span>{data.text}</span>
      {data.cta && (
        <a href={data.cta.href}
          className={cn('font-bold underline underline-offset-2 hover:no-underline transition-all',
            variant === 'urgent' ? 'text-white' : 'text-white')}>
          {data.cta.label} →
        </a>
      )}
      {data.dismissable && (
        <button type="button"
          className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
          onClick={`this.closest('[data-promo-banner]').remove()` as unknown as React.MouseEventHandler}>
          <i data-lucide="x" className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div data-promo-banner className={cn('relative', cls)}>
      {variant === 'urgent' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,.5) 0, rgba(255,255,255,.5) 1px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }} />
        </div>
      )}
      <div className="relative z-10">{inner}</div>
    </div>
  );
}
