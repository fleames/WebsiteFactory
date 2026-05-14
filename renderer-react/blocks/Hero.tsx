import React from 'react';
import type { HeroBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: HeroBlock; brandColor: string; }

function Cta({ cta, dark }: { cta: { label: string; href: string; style?: string }; dark: boolean }) {
  const s = cta.style ?? 'filled';
  return (
    <a href={cta.href}
      className={cn('btn btn-lg btn-icon',
        s === 'filled'  ? 'btn-primary' : '',
        s === 'outline' && dark  ? 'btn-ghost-dark' : '',
        s === 'outline' && !dark ? 'btn-secondary' : '',
        s === 'ghost'   ? (dark ? 'text-white/70 hover:text-white underline-offset-4 hover:underline' : 'text-gray-700 hover:text-gray-900 underline-offset-4 hover:underline') : '',
      )}>
      {cta.label}
      {s === 'filled' && <i data-lucide="arrow-right" className="w-4 h-4" />}
    </a>
  );
}

function AnimatedCanvas({ effect }: { effect: string }) {
  return (
    <canvas
      data-animated-bg={effect}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '115%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

export function Hero({ block, brandColor }: Props) {
  const bg    = block.settings?.background ?? 'dark';
  const dark  = isDark(bg);
  const { data, variant } = block;
  const animatedBg = block.settings?.animatedBg;
  const ctas  = data.ctas?.length ? data.ctas : [{ label: 'Kontakt os', href: '#contact', style: 'filled' as const }];

  const transparent = bg === 'transparent';
  // animatedBg forces bg-black — always use dark-mode text/colours in that case
  const isDarkMode = dark || transparent || !!animatedBg;

  /* ── Centered variant ── */
  if (variant === 'centered' || variant === 'with_badge') {
    return (
      <section className={cn('relative overflow-hidden',
        animatedBg ? 'bg-black' : transparent ? '' : dark ? 'hero-mesh' : 'bg-white',
        isDarkMode ? 'text-white' : 'text-gray-900')}
        style={{ paddingTop: 'clamp(5rem,10vw,9rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}>
        {animatedBg
          ? <AnimatedCanvas effect={animatedBg} />
          : isDarkMode ? (
            <>
              <div className="noise absolute inset-0 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />
          )
        }
        {animatedBg && <div className="noise absolute inset-0 pointer-events-none" style={{ opacity: 0.25, zIndex: 1 }} />}

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          {data.badge && (
            <div className={cn('badge mb-6 mx-auto', isDarkMode ? 'badge-dark' : 'badge-brand')}>
              {data.badgeIsNew
                ? <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">NEW</span>
                : <i data-lucide="sparkles" className="w-3 h-3 opacity-70" />
              }
              {data.badge}
            </div>
          )}

          <h1 className={cn('font-extrabold mb-6', isDarkMode ? 'text-white' : 'text-gray-900')}
            style={{ fontSize: 'clamp(2.5rem,6vw,5.5rem)', letterSpacing: '-0.04em', lineHeight: '1.05' }}>
            {data.headline}
            {data.accentLine && (
              <><br /><span className="gradient-text">{data.accentLine}</span></>
            )}
          </h1>

          {data.subtext && (
            <p className={cn('text-xl leading-relaxed max-w-2xl mx-auto mb-10',
              isDarkMode ? 'text-white/65' : 'text-gray-500')}>
              {data.subtext}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {ctas.map((c,i) => <Cta key={i} cta={c} dark={isDarkMode} />)}
          </div>

          {data.chips?.length ? (
            <>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {data.chips.map(c => (
                  <span key={c} className={cn('text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                    isDarkMode
                      ? 'border-white/12 text-white/50 hover:text-white/75 hover:border-white/25'
                      : 'border-gray-200 text-gray-400 hover:text-gray-600')}>
                    {c}
                  </span>
                ))}
              </div>
              <script dangerouslySetInnerHTML={{ __html:
                `window._typeItStrings=${JSON.stringify(data.chips)};`
              }} />
            </>
          ) : null}

          {data.image && variant === 'with_badge' && (
            <div className="mt-14 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 max-w-4xl mx-auto">
              <img src={data.image} alt={data.imageAlt ?? ''} className="w-full object-cover" loading="eager" fetchPriority="high" />
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ── Minimal variant ── */
  if (variant === 'minimal') {
    return (
      <section className={cn('relative', isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900')}
        style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        {animatedBg && <AnimatedCanvas effect={animatedBg} />}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            {data.badge && (
              <div className={cn('badge mb-5', isDarkMode ? 'badge-dark' : 'badge-brand')}>
                <i data-lucide="sparkles" className="w-3 h-3" />{data.badge}
              </div>
            )}
            <h1 className="font-extrabold mb-5" style={{ fontSize: 'clamp(2.25rem,5vw,4rem)', letterSpacing: '-0.035em', lineHeight: '1.08' }}>
              {data.headline}
              {data.accentLine && <span className="gradient-text block">{data.accentLine}</span>}
            </h1>
            {data.subtext && (
              <p className={cn('text-lg leading-relaxed mb-8 max-w-lg', isDarkMode ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {ctas.map((c,i) => <Cta key={i} cta={c} dark={isDarkMode} />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Split image variants (default + reverse) ── */
  const reverse = variant === 'split_image_reverse';
  return (
    <section className={cn('relative overflow-hidden',
      animatedBg ? 'bg-black' : transparent ? '' : dark ? 'bg-gray-950' : 'hero-split-gradient',
      isDarkMode ? 'text-white' : 'text-gray-900')}
      style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
      {animatedBg
        ? <AnimatedCanvas effect={animatedBg} />
        : isDarkMode ? (
          <>
            <div className="noise absolute inset-0 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="orb orb-1" />
              <div className="orb orb-3" />
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(var(--brand-rgb),.06) 0%, transparent 60%)`, filter: 'blur(60px)' }} />
            <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
          </>
        )
      }
      {animatedBg && <div className="noise absolute inset-0 pointer-events-none" style={{ opacity: 0.2, zIndex: 1 }} />}

      <div className={cn('relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center',
        reverse && 'direction-reverse')}>

        {/* Text */}
        <div className={cn(reverse && 'lg:order-2')}>
          {data.badge && (
            <div className={cn('badge mb-5', isDarkMode ? 'badge-dark' : 'badge-brand')}>
              <i data-lucide="sparkles" className="w-3 h-3" />{data.badge}
            </div>
          )}
          <h1 className="font-extrabold mb-5" style={{ fontSize: 'clamp(2.25rem,4.5vw,4rem)', letterSpacing: '-0.035em', lineHeight: '1.08' }}>
            {data.headline}
            {data.accentLine && <span className="gradient-text block mt-1">{data.accentLine}</span>}
          </h1>
          {data.subtext && (
            <p className={cn('text-lg leading-relaxed mb-8 max-w-lg', isDarkMode ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>
          )}
          <div className="flex flex-wrap gap-3 mb-7">
            {ctas.map((c,i) => <Cta key={i} cta={c} dark={isDarkMode} />)}
          </div>
          {data.chips?.length ? (
            <div className="flex flex-wrap gap-2">
              {data.chips.map(c => (
                <span key={c} className={cn('text-xs px-3 py-1.5 rounded-full border',
                  isDarkMode ? 'border-white/10 text-white/40' : 'border-gray-200 text-gray-400')}>
                  {c}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Image */}
        {data.image ? (
          <div className={cn('relative', reverse && 'lg:order-1')}>
            <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-30 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${brandColor}, transparent)` }} />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
              <img src={data.image} alt={data.imageAlt ?? ''} className="w-full object-cover aspect-[4/3]" loading="eager" fetchPriority="high" />
            </div>
          </div>
        ) : (
          <div className={cn('relative hidden lg:block', reverse && 'lg:order-1')}>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, rgba(var(--brand-rgb),.12) 0%, rgba(var(--brand-rgb),.04) 100%)`, border: '1px solid rgba(var(--brand-rgb),.15)' }}>
              <i data-lucide="image" className="w-16 h-16 text-brand opacity-30" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
