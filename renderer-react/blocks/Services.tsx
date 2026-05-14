import React from 'react';
import type { ServicesBlock } from '../../schema/types.js';
import { cn, isDark, bgCls } from '../utils.js';

interface Props { block: ServicesBlock; }

export function Services({ block }: Props) {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const { data, variant } = block;
  const items = data.items ?? [];

  const sectionCls = cn('relative py-24 lg:py-32', bgCls(bg));

  const SectionHeader = () => (
    <div className={cn('text-center max-w-2xl mx-auto mb-16')}>
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

  /* ── Split highlight ── */
  if (variant === 'split_highlight') {
    const [featured, ...rest] = items;
    return (
      <section className={sectionCls}>
        {!dark && <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader />
          <div className="grid lg:grid-cols-5 gap-8 items-stretch">
            {/* Featured card — left 3/5 */}
            {featured && (
              <div className={cn('lg:col-span-3 relative p-10 lg:p-14 rounded-3xl flex flex-col overflow-hidden',
                dark ? 'card-dark' : 'card-light')} data-reveal>
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--brand-rgb),.5), transparent)' }} />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, rgba(var(--brand-rgb),.12) 0%, transparent 65%)`, filter: 'blur(40px)' }} />
                <div className="icon-box icon-box-gradient w-16 h-16 mb-8">
                  <i data-lucide={featured.icon ?? 'star'} className="w-8 h-8" />
                </div>
                <h3 className={cn('font-bold text-2xl mb-4', dark ? 'text-white' : 'text-gray-900')}>{featured.title}</h3>
                <p className={cn('text-base leading-relaxed flex-1', dark ? 'text-white/60' : 'text-gray-500')}>{featured.description}</p>
                {featured.link && (
                  <a href={featured.link} className="btn btn-primary btn-lg mt-8 w-fit">
                    Læs mere <i data-lucide="arrow-right" className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
            {/* Stacked cards — right 2/5 */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {rest.slice(0, 4).map((item, i) => (
                <div key={i} className={cn('flex gap-4 p-6 rounded-2xl flex-1', dark ? 'card-dark' : 'card-light')} data-reveal>
                  <div className="icon-box w-10 h-10 shrink-0 mt-0.5">
                    <i data-lucide={item.icon ?? 'check'} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={cn('font-bold text-sm mb-1', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
                    <p className={cn('text-xs leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Circular icons ── */
  if (variant === 'circular_icons') {
    return (
      <section className={sectionCls}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <SectionHeader />
          <div data-stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
            {items.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group" data-reveal>
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: dark ? 'rgba(var(--brand-rgb),.12)' : 'rgba(var(--brand-rgb),.08)',
                      border: `2px solid rgba(var(--brand-rgb),.25)`,
                      boxShadow: '0 0 0 8px rgba(var(--brand-rgb),.04)',
                    }}>
                    <i data-lucide={item.icon ?? 'star'} className="w-8 h-8 text-brand" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'var(--brand)' }}>
                    {i + 1}
                  </div>
                </div>
                <h3 className={cn('font-bold text-sm mb-1.5', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
                <p className={cn('text-xs leading-relaxed', dark ? 'text-white/50' : 'text-gray-500')}>{item.description}</p>
              </div>
            ))}
          </div>
          {data.cta && (
            <div className="mt-14 text-center">
              <a href={data.cta.href} className="btn btn-primary btn-lg">
                {data.cta.label} <i data-lucide="arrow-right" className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ── Feature tabs ── */
  if (variant === 'feature_tabs') {
    return (
      <section className={sectionCls}>
        {!dark && <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <SectionHeader />
          <div data-stagger className="flex flex-col gap-3">
            {items.map((item, i) => (
              <div key={i} className={cn('flex items-start gap-6 p-7 rounded-2xl group cursor-default transition-all duration-300',
                dark ? 'card-dark hover:bg-white/[0.07]' : 'card-light')} data-reveal>
                <div className="icon-box icon-box-gradient w-12 h-12 shrink-0">
                  <i data-lucide={item.icon ?? 'check'} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className={cn('font-bold text-base mb-1.5', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
                  <p className={cn('text-sm leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{item.description}</p>
                </div>
                {item.link && (
                  <a href={item.link} className={cn('btn btn-sm shrink-0', dark ? 'btn-ghost-dark' : 'btn-secondary')}>
                    Mere <i data-lucide="arrow-right" className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Bento grid ── */
  if (variant === 'bento_grid') {
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader />
          <div data-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <div key={i} className={cn(
                'relative p-7 rounded-2xl overflow-hidden group transition-all duration-300',
                dark ? 'card-dark' : 'card-light',
                i === 0 && items.length >= 3 ? 'md:col-span-2 lg:col-span-1' : '',
              )} data-reveal>
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--brand-rgb),.4), transparent)' }} />
                <div className="icon-box icon-box-gradient w-12 h-12 mb-5">
                  <i data-lucide={item.icon ?? 'zap'} className="w-6 h-6" />
                </div>
                <h3 className={cn('font-bold text-lg mb-2', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
                <p className={cn('text-sm leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{item.description}</p>
                {item.link && (
                  <a href={item.link} className={cn('inline-flex items-center gap-1.5 text-sm font-semibold mt-4 transition-colors',
                    dark ? 'text-white/60 hover:text-white' : 'text-brand hover:opacity-80')}>
                    Læs mere <i data-lucide="arrow-right" className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── List icons ── */
  if (variant === 'list_icons') {
    return (
      <section className={sectionCls}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <SectionHeader />
          <div data-stagger className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className={cn('flex gap-5 p-6 rounded-2xl transition-all duration-300', dark ? 'card-dark' : 'card-light')} data-reveal>
                <div className="icon-box w-12 h-12 shrink-0 mt-0.5">
                  <i data-lucide={item.icon ?? 'check-circle'} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={cn('font-bold text-base mb-1', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
                  <p className={cn('text-sm leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Glass cards ── */
  if (variant === 'glass_cards') {
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader />
          <div data-stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, i) => (
              <div key={i} className="glass-hi shimmer p-7 rounded-2xl group transition-all duration-300 hover:-translate-y-1" data-reveal
                style={{'--delay': `${i * 80}ms`} as React.CSSProperties}>
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0 overflow-hidden">
                  <div className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, rgba(var(--brand-rgb),.28) 0%, rgba(var(--brand-rgb),.08) 100%)', border: '1px solid rgba(var(--brand-rgb),.3)', boxShadow: '0 0 20px rgba(var(--brand-rgb),.18)' }} />
                  <i data-lucide={item.icon ?? 'star'} className="w-5 h-5 text-brand relative z-10" />
                </div>
                <h3 className={cn('font-bold text-lg mb-2', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
                <p className={cn('text-sm leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{item.description}</p>
                {item.link && (
                  <a href={item.link} className={cn('inline-flex items-center gap-1.5 text-sm font-semibold mt-4 transition-colors',
                    dark ? 'text-white/55 hover:text-white' : 'text-brand hover:opacity-80')}>
                    Learn more <i data-lucide="arrow-right" className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Default: grid cards ── */
  return (
    <section className={sectionCls}>
      {!dark && <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader />
        <div data-stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i}
              className={cn('relative p-8 rounded-2xl flex flex-col overflow-hidden group card-glow transition-all duration-300',
                dark ? 'card-dark' : 'card-light')}
              data-reveal>
              {/* Top accent */}
              <div className="absolute top-0 left-8 right-8 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--brand-rgb),.45), transparent)' }} />
              <div className="icon-box icon-box-gradient w-12 h-12 mb-6">
                <i data-lucide={item.icon ?? 'star'} className="w-6 h-6" />
              </div>
              <h3 className={cn('font-bold text-lg mb-3', dark ? 'text-white' : 'text-gray-900')}>{item.title}</h3>
              <p className={cn('text-sm leading-relaxed flex-1', dark ? 'text-white/55' : 'text-gray-500')}>{item.description}</p>
              {item.link && (
                <a href={item.link} className={cn('btn btn-sm mt-6 w-fit',
                  dark ? 'btn-ghost-dark' : 'btn-secondary')}>
                  Læs mere <i data-lucide="arrow-right" className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
