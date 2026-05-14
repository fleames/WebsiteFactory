import React from 'react';
import type { PricingBlock } from '../../schema/types.js';
import { cn, isDark, bgCls } from '../utils.js';

interface Props { block: PricingBlock; }

export function Pricing({ block }: Props) {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const { data } = block;
  const plans = data.items ?? [];

  return (
    <section className={cn('relative py-24 lg:py-32', bgCls(bg))}>
      {dark && <div className="absolute inset-0 dot-grid-dark opacity-30 pointer-events-none" />}
      {!dark && <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />}

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {data.heading && (
          <div className="text-center max-w-2xl mx-auto mb-14">
            {data.heading && (
              <h2 className={cn('font-extrabold mb-3', dark ? 'text-white' : 'text-gray-900')}
                style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
                {data.heading}
              </h2>
            )}
            {data.subtext && <p className={cn('text-lg', dark ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>}
          </div>
        )}

        <div className={cn('grid gap-6', plans.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3')}>
          {plans.map((plan, i: number) => {
            const featured = plan.highlighted ?? plan.badge?.toLowerCase().includes('popular');
            return (
              <div key={i}
                className={cn('relative p-8 rounded-2xl flex flex-col',
                  featured
                    ? (dark ? 'pricing-featured' : 'bg-white ring-2 shadow-2xl')
                    : (dark ? 'card-dark' : 'bg-white border border-gray-200 shadow-sm'),
                  'transition-all duration-300 hover:-translate-y-1'
                )}
                style={featured ? (dark
                  ? {}
                  : { borderColor: 'rgba(var(--brand-rgb),.4)', boxShadow: '0 0 0 1px rgba(var(--brand-rgb),.15), 0 24px 60px rgba(0,0,0,.12)' }
                ) : {}}
                data-reveal>

                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                      {plan.badge ?? 'Mest populær'}
                    </span>
                  </div>
                )}

                {plan.badge && !featured && (
                  <div className={cn('badge mb-4 w-fit', dark ? 'badge-dark' : 'badge-brand')}>{plan.badge}</div>
                )}

                <div className="mb-6">
                  <h3 className={cn('font-bold text-lg mb-1', dark ? 'text-white' : 'text-gray-900')}>{plan.name}</h3>
                  {plan.description && (
                    <p className={cn('text-sm', dark ? 'text-white/55' : 'text-gray-500')}>{plan.description}</p>
                  )}
                </div>

                <div className="mb-7">
                  <div className="flex items-baseline gap-1">
                    <span className={cn('text-4xl font-extrabold', dark ? 'text-white' : 'text-gray-900')}
                      style={{ letterSpacing: '-0.04em' }}>
                      {plan.price}
                    </span>
                    {plan.period && <span className={cn('text-sm', dark ? 'text-white/50' : 'text-gray-400')}>{plan.period}</span>}
                  </div>
                </div>

                {plan.features?.length ? (
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f: string, fi: number) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-brand/10">
                          <i data-lucide="check" className="w-2.5 h-2.5 text-brand" />
                        </div>
                        <span className={cn('text-sm', dark ? 'text-white/75' : 'text-gray-600')}>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : <div className="flex-1" />}

                {plan.cta && (
                  <a href={plan.cta.href}
                    className={cn('btn text-center justify-center w-full',
                      featured ? 'btn-primary btn-lg' : (dark ? 'btn-ghost-dark' : 'btn-secondary'))}>
                    {plan.cta.label}
                    {featured && <i data-lucide="arrow-right" className="w-4 h-4" />}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
