import React from 'react';
import type { ProcessBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: ProcessBlock; }

export function Process({ block }: Props) {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const { data, variant } = block;
  const steps = data.steps ?? [];

  const sectionCls = cn('relative py-24 lg:py-32',
    dark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900',
    bg === 'surface' ? '!bg-gray-50' : '',
  );

  const SectionHeader = () => data.heading ? (
    <div className="text-center max-w-2xl mx-auto mb-14">
      <h2 className={cn('font-extrabold mb-3', dark ? 'text-white' : 'text-gray-900')}
        style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>{data.heading}</h2>
      {data.subtext && <p className={cn('text-lg', dark ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>}
    </div>
  ) : null;

  /* ── Timeline ── */
  if (variant === 'timeline') {
    return (
      <section className={sectionCls}>
        {!dark && <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />}
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
          <SectionHeader />
          <div className="relative">
            {/* Vertical spine */}
            <div className="absolute left-6 top-0 bottom-0 w-px"
              style={{ background: `linear-gradient(to bottom, transparent, rgba(var(--brand-rgb),.4) 10%, rgba(var(--brand-rgb),.4) 90%, transparent)` }} />
            <div data-stagger className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="relative flex gap-8 pl-16" data-reveal>
                  {/* Node */}
                  <div className="absolute left-0 top-2 w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))', boxShadow: `0 0 0 4px ${dark ? '#030712' : '#fff'}, 0 0 0 6px rgba(var(--brand-rgb),.25)` }}>
                    {step.icon ? <i data-lucide={step.icon} className="w-5 h-5" /> : String(i + 1).padStart(2, '0')}
                  </div>
                  {/* Content */}
                  <div className={cn('flex-1 p-7 rounded-2xl', dark ? 'card-dark' : 'card-light')}>
                    <div className={cn('text-xs font-bold uppercase tracking-widest mb-2', 'text-brand')}>
                      {`Trin ${i + 1}`}
                    </div>
                    <h3 className={cn('font-bold text-base mb-2', dark ? 'text-white' : 'text-gray-900')}>{step.title}</h3>
                    <p className={cn('text-sm leading-relaxed', dark ? 'text-white/60' : 'text-gray-500')}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {data.cta && (
            <div className="mt-12 text-center">
              <a href={data.cta.href} className="btn btn-primary btn-lg">
                {data.cta.label} <i data-lucide="arrow-right" className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'icon_flow') {
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader />
          <div data-stagger className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative" data-reveal>
                <div className="relative mx-auto w-16 h-16 mb-5">
                  <div className="w-16 h-16 rounded-2xl icon-box icon-box-gradient flex items-center justify-center mx-auto">
                    <i data-lucide={step.icon ?? 'circle'} className="w-7 h-7" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-px"
                      style={{ background: 'linear-gradient(90deg, rgba(var(--brand-rgb),.3), transparent)' }} />
                  )}
                </div>
                <h3 className={cn('font-bold mb-2', dark ? 'text-white' : 'text-gray-900')}>{step.title}</h3>
                <p className={cn('text-sm leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* Default: numbered steps */
  return (
    <section className={sectionCls}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <SectionHeader />
        <div data-stagger className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="relative flex gap-6 pb-10 last:pb-0" data-reveal>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="step-connector" />
              )}
              {/* Number */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl font-black text-sm flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))', color: '#fff', boxShadow: '0 4px 12px rgba(var(--brand-rgb),.35)' }}>
                  {String(i + 1).padStart(2,'0')}
                </div>
              </div>
              {/* Content */}
              <div className="pt-2.5">
                <h3 className={cn('font-bold text-base mb-2', dark ? 'text-white' : 'text-gray-900')}>{step.title}</h3>
                <p className={cn('text-sm leading-relaxed', dark ? 'text-white/60' : 'text-gray-500')}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
