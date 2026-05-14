import React from 'react';
import type { CtaBannerBlock } from '../../schema/types.js';
import { cn } from '../utils.js';

interface Props { block: CtaBannerBlock; }

function bgStyle(bg: string): React.CSSProperties {
  if (bg === 'brand' || bg === 'brand_dark')
    return { background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)' };
  if (bg === 'dark')   return { background: '#030712' };
  if (bg === 'black')  return { background: '#000000' };
  if (bg === 'white')  return { background: '#ffffff' };
  if (bg === 'surface') return { background: '#f9fafb' };
  if (bg === 'brand_tint') return { background: 'rgba(var(--brand-rgb),.07)' };
  return { background: '#f9fafb' };
}

export function CTABanner({ block }: Props) {
  const bg      = block.settings?.background ?? 'brand';
  const s       = (block.settings ?? {}) as Record<string, unknown>;
  const animBg  = s.animatedBg as string | undefined;
  const { data, variant } = block;
  const ctas    = data.ctas ?? [];
  const isBrand = bg === 'brand' || bg === 'brand_dark';
  const isDarkBg = bg === 'dark' || bg === 'black' || isBrand;

  /* Canvas injected when an animated bg effect is selected.
     animatedBgScript() picks up canvas[data-animated-bg] on DOMContentLoaded. */
  const AnimCanvas = animBg ? (
    <canvas
      data-animated-bg={animBg}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  ) : null;

  function CtaButtons({ dark: d }: { dark: boolean }) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {ctas.map((c, i) => (
          <a key={i} href={c.href} data-magnetic
            className={cn('btn btn-lg',
              c.style === 'filled' && d  ? 'bg-white text-gray-900 hover:bg-white/90 font-bold shadow-lg' : '',
              c.style === 'filled' && !d ? 'btn-primary' : '',
              c.style === 'outline' ? (d ? 'btn-ghost-dark' : 'btn-secondary') : '',
              c.style === 'ghost'   ? (d ? 'text-white/70 hover:text-white underline-offset-4 hover:underline'
                                        : 'text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline') : '',
            )}>
            {c.label}
            {c.style === 'filled' && <i data-lucide="arrow-right" className="w-4 h-4" />}
          </a>
        ))}
      </div>
    );
  }

  /* ── Split ── */
  if (variant === 'split') {
    return (
      <section className="relative overflow-hidden py-20 lg:py-24" style={bgStyle(bg)}>
        {AnimCanvas}
        {isBrand && <div className="noise absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />}
        {isBrand && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
            <div className="absolute right-0 top-0 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,.12) 0%, transparent 65%)', filter: 'blur(40px)' }} />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8" style={{ zIndex: 10 }}>
          <div className="max-w-2xl">
            <h2 className={cn('font-extrabold mb-3', isDarkBg ? 'text-white' : 'text-gray-900')}
              style={{ fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', letterSpacing: '-0.025em' }}>
              {data.heading}
            </h2>
            {data.subtext && (
              <p className={cn('text-base leading-relaxed', isDarkBg ? 'text-white/70' : 'text-gray-500')}>{data.subtext}</p>
            )}
          </div>
          <div className="shrink-0"><CtaButtons dark={isDarkBg} /></div>
        </div>
      </section>
    );
  }

  /* ── Card ── */
  if (variant === 'card') {
    const outerBg = bg === 'surface' ? 'bg-gray-50' : bg === 'dark' || bg === 'black' ? 'bg-gray-950' : 'bg-white';
    return (
      <section className={cn('py-16 lg:py-20', outerBg)}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className={cn('relative overflow-hidden rounded-3xl p-10 lg:p-14 text-center',
            isBrand ? 'text-white' : isDarkBg ? 'bg-gray-900 text-white' : 'bg-white border border-gray-100 shadow-xl')}
            style={isBrand ? { background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)' }
              : isDarkBg ? bgStyle(bg) : {}}>
            {AnimCanvas}
            {isBrand && <div className="noise absolute inset-0 pointer-events-none rounded-3xl" style={{ zIndex: 1 }} />}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl" style={{ zIndex: 1 }}>
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
                style={{ background: isBrand ? 'radial-gradient(circle, rgba(255,255,255,.15) 0%, transparent 65%)' : `radial-gradient(circle, rgba(var(--brand-rgb),.08) 0%, transparent 65%)`, filter: 'blur(40px)' }} />
            </div>
            <div className="relative" style={{ zIndex: 10 }}>
              <h2 className={cn('font-extrabold mb-4', isDarkBg || isBrand ? 'text-white' : 'text-gray-900')}
                style={{ fontSize: 'clamp(1.75rem,4vw,3rem)', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                {data.heading}
              </h2>
              {data.subtext && (
                <p className={cn('text-base leading-relaxed mb-8 max-w-xl mx-auto', isDarkBg || isBrand ? 'text-white/70' : 'text-gray-500')}>
                  {data.subtext}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-3"><CtaButtons dark={isDarkBg || isBrand} /></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Pattern ── */
  if (variant === 'pattern') {
    return (
      <section className="relative overflow-hidden py-24 lg:py-32 bg-gray-950 text-white" data-spotlight>
        {AnimCanvas}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div className="absolute inset-0 dot-grid-dark opacity-50" />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(var(--brand-rgb),.12) 0%, transparent 60%)' }} />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: `radial-gradient(ellipse, rgba(var(--brand-rgb),.18) 0%, transparent 70%)`, filter: 'blur(40px)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center" style={{ zIndex: 10 }}>
          <h2 className="font-extrabold text-white mb-5"
            style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.035em', lineHeight: '1.08' }}>
            {data.heading}
          </h2>
          {data.subtext && (
            <p className="text-xl leading-relaxed mb-10 text-white/65 max-w-2xl mx-auto">{data.subtext}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3"><CtaButtons dark={true} /></div>
        </div>
      </section>
    );
  }

  /* ── Centered (default) ── */
  return (
    <section className="relative overflow-hidden py-24 lg:py-32" style={bgStyle(bg)}>
      {AnimCanvas}
      {isBrand && <div className="noise absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {isBrand ? (
          <>
            <div className="absolute -top-32 right-[10%] w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,.15) 0%, transparent 65%)', filter: 'blur(60px)' }} />
            <div className="absolute -bottom-32 left-[5%] w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,0,0,.15) 0%, transparent 65%)', filter: 'blur(60px)' }} />
          </>
        ) : (
          !animBg && <div className="absolute inset-0 dot-grid opacity-30" />
        )}
      </div>
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center" style={{ zIndex: 10 }}>
        <h2 className={cn('font-extrabold mb-5', isDarkBg ? 'text-white' : 'text-gray-900')}
          style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.035em', lineHeight: '1.08' }}>
          {data.heading}
        </h2>
        {data.subtext && (
          <p className={cn('text-xl leading-relaxed mb-10 max-w-2xl mx-auto', isDarkBg ? 'text-white/70' : 'text-gray-500')}>
            {data.subtext}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3"><CtaButtons dark={isDarkBg} /></div>
      </div>
    </section>
  );
}
