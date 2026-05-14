import React from 'react';
import type { GalleryBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: GalleryBlock; }

export function Gallery({ block }: Props) {
  const bg      = block.settings?.background ?? 'white';
  const dark    = isDark(bg);
  const { data, variant } = block;
  const items   = data.items ?? [];
  const groupId = block.id;

  const sectionCls = cn('relative py-20 lg:py-28',
    dark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900',
    bg === 'surface' ? '!bg-gray-50' : '',
  );

  const Header = () => data.heading ? (
    <div className="text-center mb-12">
      <h2 className={cn('font-extrabold', dark ? 'text-white' : 'text-gray-900')}
        style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
        {data.heading}
      </h2>
    </div>
  ) : null;

  /* ── Carousel (Splide) ── */
  if (variant === 'carousel') {
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Header />
        </div>
        <div className="splide px-6 lg:px-8" data-per-page="3" aria-label={data.heading ?? 'Galleri'}>
          <div className="splide__track">
            <ul className="splide__list">
              {items.map((item, i) => (
                <li key={i} className="splide__slide">
                  <a href={item.src} data-glightbox={item.caption ?? item.alt}
                    data-gallery={groupId} className="block rounded-2xl overflow-hidden shadow-lg relative group">
                    <img src={item.src} alt={item.alt} loading="lazy"
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                    {item.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-medium">{item.caption}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <i data-lucide="zoom-in" className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
.splide__arrow{background:rgba(0,0,0,.5);border:none}
.splide__arrow:hover{background:var(--brand)}
.splide__arrow svg{fill:#fff}
.splide__pagination__page{background:rgba(255,255,255,.4)}
.splide__pagination__page.is-active{background:var(--brand);transform:scale(1.3)}
        `.trim() }} />
      </section>
    );
  }

  /* ── Masonry — with GLightbox ── */
  if (variant === 'masonry') {
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Header />
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
            {items.map((item, i) => (
              <a key={i} href={item.src}
                data-glightbox={item.caption ?? item.alt} data-gallery={groupId}
                className="mb-3 break-inside-avoid overflow-hidden rounded-xl block group relative" data-reveal>
                <img src={item.src} alt={item.alt} loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 rounded-xl flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <i data-lucide="zoom-in" className="w-5 h-5 text-white" />
                  </div>
                </div>
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl">
                    <p className="text-white text-xs font-medium">{item.caption}</p>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Grid (default) — with GLightbox ── */
  const cols = items.length <= 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
               items.length <= 6 ? 'md:grid-cols-2 lg:grid-cols-3' :
               'md:grid-cols-3 lg:grid-cols-4';

  return (
    <section className={sectionCls}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Header />
        <div className={cn('grid grid-cols-2 gap-3', cols)}>
          {items.map((item, i) => (
            <a key={i} href={item.src}
              data-glightbox={item.caption ?? item.alt} data-gallery={groupId}
              className={cn('overflow-hidden rounded-2xl relative group block',
                i === 0 && items.length > 4 ? 'col-span-2 md:col-span-1 lg:col-span-2 row-span-2' : ''
              )}
              data-reveal>
              <div className={cn('w-full overflow-hidden bg-gray-100',
                i === 0 && items.length > 4 ? 'aspect-[4/3]' : 'aspect-square')}>
                <img src={item.src} alt={item.alt} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl">
                  <p className="text-white text-xs font-medium">{item.caption}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <i data-lucide="zoom-in" className="w-5 h-5 text-white" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
