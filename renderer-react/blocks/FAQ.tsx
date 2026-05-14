import React from 'react';
import type { FaqBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: FaqBlock; }

export function FAQ({ block }: Props) {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const { data, variant } = block;
  const items = data.items ?? [];

  const sectionCls = cn('relative py-24 lg:py-32',
    dark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900',
    bg === 'surface' ? '!bg-gray-50' : '',
  );

  const AccordionItem = ({ item, i }: { item: { question: string; answer: string }; i: number }) => (
    <details className="group" data-reveal>
      <summary className={cn(
        'flex items-center justify-between gap-4 py-5 cursor-pointer select-none',
        i > 0 ? (dark ? 'border-t border-white/[0.07]' : 'border-t border-gray-100') : '',
      )}>
        <span className={cn('font-semibold text-base leading-snug', dark ? 'text-white' : 'text-gray-900')}>
          {item.question}
        </span>
        <span className={cn('faq-icon w-6 h-6 rounded-full shrink-0 flex items-center justify-center',
          dark ? 'bg-white/[0.08] text-white/60' : 'bg-gray-100 text-gray-500')}>
          <i data-lucide="plus" className="w-3.5 h-3.5" />
        </span>
      </summary>
      <div className="faq-body pb-5">
        <p className={cn('text-sm leading-relaxed', dark ? 'text-white/60' : 'text-gray-500')}>{item.answer}</p>
      </div>
    </details>
  );

  if (variant === 'two_column') {
    const half = Math.ceil(items.length / 2);
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {data.heading && (
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className={cn('font-extrabold mb-3', dark ? 'text-white' : 'text-gray-900')}
                style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
                {data.heading}
              </h2>
              {data.subtext && <p className={cn('text-base leading-relaxed', dark ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>}
            </div>
          )}
          <div className="grid lg:grid-cols-2 gap-x-14">
            <div>{items.slice(0,half).map((item,i) => <AccordionItem key={i} item={item} i={i} />)}</div>
            <div>{items.slice(half).map((item,i) => <AccordionItem key={i} item={item} i={i} />)}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionCls}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {data.heading && (
          <div className="text-center mb-14">
            {data.heading && (
              <h2 className={cn('font-extrabold mb-3', dark ? 'text-white' : 'text-gray-900')}
                style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
                {data.heading}
              </h2>
            )}
            {data.subtext && <p className={cn('text-base leading-relaxed', dark ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>}
          </div>
        )}
        <div className={cn('rounded-2xl overflow-hidden', dark ? 'card-dark p-2' : 'border border-gray-100 shadow-sm')}>
          <div className={cn(dark ? 'px-5' : 'px-6')}>
            {items.map((item, i) => <AccordionItem key={i} item={item} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
