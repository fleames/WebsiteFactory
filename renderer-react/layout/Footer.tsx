import React from 'react';
import type { Globals, BusinessInfo, NavLink } from '../../schema/types.js';

interface Props { footer: Globals['footer']; business: BusinessInfo; brandColor: string; }

const SOCIAL_ICONS: Record<string, string> = {
  facebook: 'facebook', instagram: 'instagram', linkedin: 'linkedin',
  twitter: 'twitter', x: 'twitter', youtube: 'youtube', tiktok: 'music-2',
};

export function Footer({ footer, business, brandColor }: Props) {
  const socials = footer.social ?? [];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#030712] border-t border-white/[0.06] text-white/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-8 mb-12 ${(footer.columns?.length ?? 0) > 2 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}99 100%)` }}>
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:'18px',height:'18px'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-base tracking-tight">{business.name}</span>
            </div>
            {footer.tagline && (
              <p className="text-sm text-white/45 leading-relaxed max-w-xs mb-5">{footer.tagline}</p>
            )}
            {/* Contact info */}
            <div className="space-y-2.5">
              {footer.contact?.phone && (
                <a href={`tel:${footer.contact.phone.replace(/\s/g,'')}`}
                  className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors group">
                  <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                    <i data-lucide="phone" className="w-3.5 h-3.5" />
                  </span>
                  {footer.contact.phone}
                </a>
              )}
              {footer.contact?.email && (
                <a href={`mailto:${footer.contact.email}`}
                  className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white transition-colors group">
                  <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                    <i data-lucide="mail" className="w-3.5 h-3.5" />
                  </span>
                  {footer.contact.email}
                </a>
              )}
              {footer.contact?.address && (
                <div className="flex items-center gap-2.5 text-sm text-white/55">
                  <span className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                    <i data-lucide="map-pin" className="w-3.5 h-3.5" />
                  </span>
                  {footer.contact.address}
                </div>
              )}
            </div>
          </div>

          {/* Link columns — one per footer.columns entry, or fallback flat list */}
          {footer.columns && footer.columns.length > 0 ? (
            footer.columns.map((col, ci) => (
              <div key={ci}>
                <div className="text-[10px] font-bold tracking-[.12em] uppercase text-white/30 mb-4">{col.heading}</div>
                <ul className="space-y-2.5">
                  {col.links.map((l: NavLink) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : null}

          {/* Social / trust */}
          <div>
            {socials.length > 0 && (
              <>
                <div className="text-[10px] font-bold tracking-[.12em] uppercase text-white/30 mb-4">{business.language?.startsWith('de') ? 'Folgen Sie uns' : business.language?.startsWith('en') ? 'Follow us' : 'Følg os'}</div>
                <div className="flex flex-wrap gap-2">
                  {socials.map((s: { platform: string; url: string }) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.07] hover:border-white/[0.14] flex items-center justify-center transition-all group">
                      <i data-lucide={SOCIAL_ICONS[s.platform.toLowerCase()] ?? 'link'} className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            {(footer.copyright ?? `© ${year} ${business.name}. Alle rettigheder forbeholdes.`).replace(/\b20\d{2}\b/, String(year))}
          </p>
          {footer.columns && footer.columns.flatMap(c => c.links).some(l => l.href.includes('privat') || l.href.includes('policy') || l.href.includes('vilk') || l.href.includes('terms')) && (
            <div className="flex items-center gap-4">
              {footer.columns.flatMap(c => c.links).filter(l => l.href.includes('privat') || l.href.includes('policy') || l.href.includes('vilk') || l.href.includes('terms')).map(l => (
                <a key={l.href} href={l.href} className="text-xs text-white/30 hover:text-white/60 transition-colors">{l.label}</a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
