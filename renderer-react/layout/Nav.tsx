import React from 'react';
import type { Globals, NavLink } from '../../schema/types.js';
import { cn } from '../utils.js';

interface Props { nav: Globals['nav']; dark?: boolean; brandColor: string; }

export function Nav({ nav, dark = false, brandColor }: Props) {
  const logo    = nav.logo.type === 'text' ? nav.logo.value : '';
  const links   = nav.links ?? [];
  const variant = nav.variant ?? 'sticky_top';

  const linkCls = dark
    ? 'text-white/65 hover:text-white hover:bg-white/[0.07]'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70';

  const logoEl = (
    <a href="/" className="flex items-center gap-2.5 shrink-0">
      <div className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0"
        style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}bb 100%)` }}>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <span className={cn('font-bold text-[15px] tracking-tight', dark ? 'text-white' : 'text-gray-900')}>
        {logo}
      </span>
    </a>
  );

  const ctaEl = (
    <div className="flex items-center gap-3 shrink-0">
      {nav.phone && (
        <a href={`tel:${nav.phone.replace(/\s/g,'')}`}
          className={cn('hidden lg:flex items-center gap-1.5 text-sm font-medium transition-colors',
            dark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900')}>
          <i data-lucide="phone" className="w-3.5 h-3.5" />
          {nav.phone}
        </a>
      )}
      {nav.bookingUrl && (
        <a href={nav.bookingUrl}
          className="btn btn-sm btn-primary"
          style={{ padding: '.45rem 1.1rem', fontSize: '.875rem' }}>
          {nav.bookingLabel ?? 'Book tid'}
        </a>
      )}
      {nav.cta && !nav.bookingUrl && (
        <a href={nav.cta.href}
          className="btn btn-sm btn-primary"
          style={{ padding: '.45rem 1.1rem', fontSize: '.875rem' }}>
          {nav.cta.label}
        </a>
      )}
      <button id="mob-toggle" className={cn('md:hidden p-2 rounded-lg transition-colors',
        dark ? 'text-white/70 hover:bg-white/[0.08]' : 'text-gray-600 hover:bg-gray-100')}>
        <i data-lucide="menu" className="w-5 h-5" />
      </button>
    </div>
  );

  const mobileMenu = links.length > 0 ? (
    <div id="mob-menu" className={cn('hidden md:hidden px-4 pb-4 border-t',
      dark ? 'border-white/[0.06]' : 'border-gray-100')}>
      {links.map((l: NavLink) => (
        <a key={l.href} href={l.href}
          className={cn('flex items-center py-3 text-sm font-medium border-b last:border-0 transition-colors',
            dark ? 'border-white/[0.06] text-white/70 hover:text-white' : 'border-gray-100 text-gray-700 hover:text-gray-900')}>
          {l.label}
        </a>
      ))}
    </div>
  ) : null;

  /* ── floating_glass — fixed pill, centred, heavy glassmorphism ── */
  if (variant === 'floating_glass') {
    return (
      <>
        <header
          style={{
            position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
            width: 'min(calc(100% - 2rem), 72rem)', zIndex: 100,
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            background: dark ? 'rgba(3,3,18,0.76)' : 'rgba(255,255,255,0.88)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '1rem',
            boxShadow: dark
              ? '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 1px rgba(255,255,255,0.04)'
              : '0 4px 24px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,1) inset',
          }}>
          <nav className="px-5 lg:px-7 h-14 flex items-center justify-between gap-8">
            {logoEl}
            {links.length > 0 && (
              <div className="hidden md:flex items-center gap-0.5">
                {links.map((l: NavLink) => (
                  <a key={l.href} href={l.href}
                    className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all', linkCls)}>
                    {l.label}
                  </a>
                ))}
              </div>
            )}
            {ctaEl}
          </nav>
          {mobileMenu}
        </header>
        {/* Spacer pushes content below fixed nav */}
        <div style={{ height: '5rem' }} aria-hidden="true" />
      </>
    );
  }

  /* ── transparent_overlay — no background, sits over hero ── */
  if (variant === 'transparent_overlay') {
    return (
      <header className="absolute top-0 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-8"
          style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
          {logoEl}
          {links.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((l: NavLink) => (
                <a key={l.href} href={l.href}
                  className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all', linkCls)}>
                  {l.label}
                </a>
              ))}
            </div>
          )}
          {ctaEl}
        </nav>
        {mobileMenu}
      </header>
    );
  }

  /* ── minimal — no background, thin border only ── */
  if (variant === 'minimal') {
    return (
      <header className={cn('sticky top-0 z-50 w-full border-b',
        dark ? 'border-white/[0.05]' : 'border-gray-100/80')}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {logoEl}
          {links.length > 0 && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((l: NavLink) => (
                <a key={l.href} href={l.href}
                  className={cn('px-3 py-1.5 text-sm font-medium transition-colors', linkCls)}>
                  {l.label}
                </a>
              ))}
            </div>
          )}
          {ctaEl}
        </nav>
        {mobileMenu}
      </header>
    );
  }

  /* ── sticky_top (default) ── */
  return (
    <header
      className={cn('sticky top-0 z-50 w-full',
        dark ? 'bg-[#030712]/90 border-b border-white/[0.06]' : 'bg-white/90 border-b border-black/[0.06]'
      )}
      style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {logoEl}
        {links.length > 0 && (
          <div className="hidden md:flex items-center gap-1">
            {links.map((l: NavLink) => (
              <a key={l.href} href={l.href}
                className={cn('nav-link px-3 py-1.5 rounded-lg text-sm font-medium transition-all', linkCls)}>
                {l.label}
              </a>
            ))}
          </div>
        )}
        {ctaEl}
      </nav>
      {mobileMenu}
    </header>
  );
}
