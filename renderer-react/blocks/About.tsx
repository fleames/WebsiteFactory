import React from 'react';
import type { AboutBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: AboutBlock; }

export function About({ block }: Props) {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const { data, variant } = block;
  const paras = (data.body ?? '').split(/\n\n+/).filter(Boolean);

  const Highlights = () => data.highlights?.length ? (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8',
      dark ? 'border-t border-white/[0.08]' : 'border-t border-gray-100')}>
      {data.highlights.map((h, i) => (
        <div key={i}>
          <div className="text-3xl font-extrabold text-brand" style={{ letterSpacing: '-0.04em' }}>{h.stat}</div>
          <div className={cn('text-xs mt-1', dark ? 'text-white/50' : 'text-gray-500')}>{h.label}</div>
        </div>
      ))}
    </div>
  ) : null;

  if (variant === 'centered_story') {
    return (
      <section className={cn('relative py-24 lg:py-32 text-center',
        dark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900')}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className={cn('font-extrabold mb-6', dark ? 'text-white' : 'text-gray-900')}
            style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
            {data.heading}
          </h2>
          {paras.map((p, i) => (
            <p key={i} className={cn('text-lg leading-relaxed', i > 0 ? 'mt-4' : '', dark ? 'text-white/65' : 'text-gray-500')}>{p}</p>
          ))}
          <Highlights />
          {data.cta && (
            <div className="mt-8 flex justify-center">
              <a href={data.cta.href} className="btn btn-lg btn-primary">
                {data.cta.label} <i data-lucide="arrow-right" className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  const reverse = variant === 'split_image_reverse';

  return (
    <section className={cn('relative py-24 lg:py-32',
      dark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900')}>
      {!dark && <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(var(--brand-rgb),.04) 0%, transparent 70%)' }} />}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className={cn('grid lg:grid-cols-2 gap-14 lg:gap-20 items-center', reverse && 'direction-reverse')}>

          {/* Text */}
          <div className={reverse ? 'lg:order-2' : ''}>
            <h2 className={cn('font-extrabold mb-6', dark ? 'text-white' : 'text-gray-900')}
              style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
              {data.heading}
            </h2>
            {paras.map((p, i) => (
              <p key={i} className={cn('text-base leading-relaxed', i > 0 ? 'mt-3' : '', dark ? 'text-white/65' : 'text-gray-500')}>{p}</p>
            ))}
            <Highlights />
            {data.cta && (
              <div className="mt-8">
                <a href={data.cta.href} className="btn btn-lg btn-primary">
                  {data.cta.label} <i data-lucide="arrow-right" className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Image */}
          {data.image ? (
            <div className={cn('relative', reverse ? 'lg:order-1' : '')} data-reveal="scale">
              <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${dark ? 'rgba(255,255,255,.1)' : 'var(--brand)' }, transparent)` }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/[0.08]">
                <img src={data.image} alt={data.imageAlt ?? ''} className="w-full object-cover aspect-[4/3]" loading="lazy" />
              </div>
            </div>
          ) : (
            <div className={cn('relative hidden lg:flex items-center justify-center', reverse ? 'lg:order-1' : '')}>
              <div className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(var(--brand-rgb),.06)', border: '1px solid rgba(var(--brand-rgb),.12)' }}>
                <i data-lucide="users" className="w-20 h-20 text-brand opacity-20" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
