import React from 'react';
import type { BookingStripBlock } from '../../schema/types.js';
import { cn } from '../utils.js';

interface Props { block: BookingStripBlock; }

export function BookingStrip({ block }: Props) {
  const bg  = block.settings?.background ?? 'brand';
  const { data, variant } = block;

  const isBrand = bg === 'brand' || bg === 'brand_dark';
  const isDarkBg = isBrand || bg === 'dark' || bg === 'black';

  const bgStyle: React.CSSProperties = isBrand
    ? { background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)' }
    : bg === 'dark' || bg === 'black'
    ? { background: '#030712' }
    : bg === 'surface'
    ? { background: '#f9fafb' }
    : bg === 'brand_tint'
    ? { background: 'rgba(var(--brand-rgb),.07)' }
    : {};

  const BookingBtn = () => (
    <a href={data.bookingUrl} target="_blank" rel="noopener"
      className={cn('inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg',
        isDarkBg
          ? 'bg-white text-gray-900 hover:bg-white/90 shadow-black/20'
          : 'btn btn-primary')}>
      <i data-lucide="calendar-check" className="w-4 h-4" />
      {data.bookingLabel ?? 'Book en tid'}
    </a>
  );

  const PhoneBtn = () => data.phone ? (
    <div className={cn('flex items-center gap-3.5 px-5 py-3 rounded-xl border-2',
      isDarkBg ? 'border-white/25 bg-white/[0.06]' : 'border-brand/25 bg-brand/5')}>
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
        isDarkBg ? 'bg-white/10' : 'bg-brand/10')}>
        <i data-lucide="phone" className={cn('w-4 h-4', isDarkBg ? 'text-white/80' : 'text-brand')} />
      </div>
      <div>
        {data.phoneLabel && (
          <div className={cn('text-[10px] font-bold uppercase tracking-wider mb-0.5',
            isDarkBg ? 'text-white/40' : 'text-gray-400')}>
            {data.phoneLabel}
          </div>
        )}
        <a href={`tel:${(data.phone ?? '').replace(/\s/g,'')}`}
          className={cn('font-bold text-base leading-none transition-opacity hover:opacity-75',
            isDarkBg ? 'text-white' : 'text-gray-900')}>
          {data.phone}
        </a>
      </div>
    </div>
  ) : null;

  /* Centered */
  if (variant === 'centered') {
    return (
      <div className="relative overflow-hidden" style={bgStyle}>
        {isBrand && <div className="noise absolute inset-0 pointer-events-none opacity-50" />}
        {isBrand && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,.14), transparent 65%)', filter: 'blur(40px)' }} />
          </div>
        )}
        <div className="relative z-10 py-14 lg:py-16 max-w-3xl mx-auto px-6 text-center">
          <h2 className={cn('font-extrabold mb-3', isDarkBg ? 'text-white' : 'text-gray-900')}
            style={{ fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', letterSpacing: '-0.025em' }}>
            {data.heading}
          </h2>
          {data.subtext && (
            <p className={cn('text-base mb-7', isDarkBg ? 'text-white/65' : 'text-gray-500')}>{data.subtext}</p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <BookingBtn />
            <PhoneBtn />
          </div>
        </div>
      </div>
    );
  }

  /* With phone — prominent phone display */
  if (variant === 'with_phone') {
    return (
      <div className="relative overflow-hidden" style={bgStyle}>
        {isBrand && <div className="noise absolute inset-0 pointer-events-none opacity-50" />}
        <div className="relative z-10 py-12 max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className={cn('font-extrabold text-center mb-8', isDarkBg ? 'text-white' : 'text-gray-900')}
            style={{ fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', letterSpacing: '-0.025em' }}>
            {data.heading}
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4">
            <BookingBtn />
            {data.phone && (
              <div className={cn('flex items-center gap-4 px-6 py-4 rounded-xl border-2',
                isDarkBg ? 'border-white/25 bg-white/[0.07]' : 'border-brand/20 bg-brand/5')}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  isDarkBg ? 'bg-white/10' : 'bg-brand/10')}>
                  <i data-lucide="phone-call" className={cn('w-5 h-5', isDarkBg ? 'text-white/70' : 'text-brand')} />
                </div>
                <div>
                  {data.phoneLabel && (
                    <div className={cn('text-[10px] font-bold uppercase tracking-wider',
                      isDarkBg ? 'text-white/40' : 'text-gray-400')}>
                      {data.phoneLabel}
                    </div>
                  )}
                  <a href={`tel:${data.phone.replace(/\s/g,'')}`}
                    className={cn('font-extrabold text-xl leading-tight hover:opacity-75 transition-opacity',
                      isDarkBg ? 'text-white' : 'text-gray-900')}>
                    {data.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* Split (default) */
  return (
    <div className="relative overflow-hidden" style={bgStyle}>
      {isBrand && <div className="noise absolute inset-0 pointer-events-none opacity-50" />}
      <div className="relative z-10 py-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className={cn('font-extrabold', isDarkBg ? 'text-white' : 'text-gray-900')}
            style={{ fontSize: 'clamp(1.25rem,3vw,2rem)', letterSpacing: '-0.025em' }}>
            {data.heading}
          </h2>
          {data.subtext && (
            <p className={cn('text-sm mt-1', isDarkBg ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <BookingBtn />
          <PhoneBtn />
        </div>
      </div>
    </div>
  );
}
