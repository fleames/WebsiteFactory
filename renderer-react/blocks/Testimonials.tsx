import React from 'react';
import type { TestimonialsBlock } from '../../schema/types.js';
import { cn, isDark, bgCls } from '../utils.js';

interface Props { block: TestimonialsBlock; }

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length:5},(_,i)=>(
        <i key={i} data-lucide="star" className={cn('w-4 h-4', i<n ? 'fill-brand text-brand' : 'text-gray-300')} />
      ))}
    </div>
  );
}

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  if (avatar) return (
    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
  );
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)' }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

const SOURCE_BADGE: Record<string, { label: string; cls: string }> = {
  google: { label: 'G', cls: 'bg-white text-[#4285F4] border border-gray-200 font-black' },
  trustpilot: { label: '★', cls: 'bg-[#00B67A] text-white font-bold' },
  facebook: { label: 'f', cls: 'bg-[#1877F2] text-white font-bold' },
};

export function Testimonials({ block }: Props) {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const { data } = block;

  const items = Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : [
        { name: 'Kunde A', rating: 5, text: 'Fantastisk service og hurtig udrykning. Kan varmt anbefales!' },
        { name: 'Kunde B', rating: 5, text: 'Professionelt og venligt team. Løste problemet hurtigt og effektivt.' },
        { name: 'Kunde C', rating: 5, text: 'Meget tilfreds med resultatet. Kom til tiden og prisen var fair.' },
      ];

  const sectionCls = cn('relative py-24 lg:py-32', bgCls(bg));

  const header = (data.heading || data.aggregate) && (
    <div className="text-center max-w-2xl mx-auto mb-14">
      {data.heading && (
        <h2 className={cn('font-extrabold mb-4', dark ? 'text-white' : 'text-gray-900')}
          style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
          {data.heading}
        </h2>
      )}
      {data.aggregate && (
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-0.5">
            {Array.from({length:5},(_,i)=>(
              <i key={i} data-lucide="star" className={cn('w-5 h-5', i < Math.round(data.aggregate!.rating) ? 'fill-brand text-brand' : 'text-gray-300')} />
            ))}
          </div>
          <span className="font-bold text-xl text-brand">{data.aggregate.rating}</span>
          <span className={cn('text-sm', dark ? 'text-white/50' : 'text-gray-400')}>
            {data.aggregate.count} anmeldelser · {data.aggregate.source}
          </span>
        </div>
      )}
    </div>
  );

  function TestimonialCard({ item, big }: { item: typeof items[0]; big?: boolean }) {
    const r = item as Record<string,unknown>;
    const source = r.source as string | undefined;
    const role = r.role as string | undefined;
    const location = r.location as string | undefined;
    const avatar = r.avatar as string | undefined;
    const subtitle = role ?? location;
    const sb = source ? SOURCE_BADGE[source.toLowerCase()] : null;
    return (
      <div className={cn('relative flex flex-col', big ? 'p-10 lg:p-14 rounded-3xl' : 'p-8 rounded-2xl', dark ? 'card-dark' : 'card-light')} data-reveal>
        <span className="testimonial-quote select-none pointer-events-none">"</span>
        <Stars n={item.rating ?? 5} />
        <p className={cn('leading-relaxed my-5 flex-1 relative z-10', big ? 'text-lg' : 'text-sm', dark ? 'text-white/70' : 'text-gray-600')}>
          "{item.text ?? ''}"
        </p>
        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)' }}>
          <Avatar name={item.name ?? 'K'} avatar={avatar} />
          <div className="flex-1 min-w-0">
            <div className={cn('font-semibold text-sm', dark ? 'text-white' : 'text-gray-900')}>{item.name}</div>
            {subtitle && <div className={cn('text-xs truncate', dark ? 'text-white/45' : 'text-gray-400')}>{subtitle}</div>}
          </div>
          {sb && (
            <span className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0', sb.cls)}
              style={{ fontSize: source?.toLowerCase() === 'google' ? '.9rem' : undefined }}>
              {sb.label}
            </span>
          )}
        </div>
      </div>
    );
  }

  /* ── featured_one ── */
  if (block.variant === 'featured_one') {
    const [featured, ...rest] = items;
    return (
      <section className={sectionCls}>
        {dark && <div className="absolute inset-0 dot-grid-dark opacity-40 pointer-events-none" />}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {header}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <TestimonialCard item={featured} big />
            <div className="grid gap-6">
              {rest.slice(0, 3).map((item, i) => (
                <TestimonialCard key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── masonry ── */
  if (block.variant === 'masonry') {
    const col1 = items.filter((_,i) => i % 2 === 0);
    const col2 = items.filter((_,i) => i % 2 === 1);
    return (
      <section className={sectionCls}>
        {dark && <div className="absolute inset-0 dot-grid-dark opacity-40 pointer-events-none" />}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {header}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">{col1.map((item, i) => <TestimonialCard key={i} item={item} />)}</div>
            <div className="flex flex-col gap-6 md:mt-10">{col2.map((item, i) => <TestimonialCard key={i} item={item} />)}</div>
          </div>
        </div>
      </section>
    );
  }

  /* ── carousel (Splide) ── */
  if (block.variant === 'carousel') {
    return (
      <section className={sectionCls}>
        {dark && <div className="absolute inset-0 dot-grid-dark opacity-40 pointer-events-none" />}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {header}
          {/* Splide carousel — JS activates after CDN loads */}
          <div className="splide" data-per-page="1" data-autoplay="1"
            aria-label={data.heading ?? 'Anmeldelser'}>
            <div className="splide__track">
              <ul className="splide__list">
                {items.map((item, i) => (
                  <li key={i} className="splide__slide px-2 py-4">
                    <TestimonialCard item={item} big />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Splide theme overrides */}
        <style dangerouslySetInnerHTML={{ __html: `
.splide__arrow{background:${dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)'};border:1px solid ${dark?'rgba(255,255,255,.12)':'rgba(0,0,0,.08)'}}
.splide__arrow:hover{background:var(--brand);border-color:var(--brand)}
.splide__arrow svg{fill:${dark?'rgba(255,255,255,.8)':'rgba(0,0,0,.6)'}}
.splide__arrow:hover svg{fill:#fff}
.splide__pagination__page{background:${dark?'rgba(255,255,255,.25)':'rgba(0,0,0,.15)'}}
.splide__pagination__page.is-active{background:var(--brand);transform:scale(1.3)}
        `.trim() }} />
      </section>
    );
  }

  /* ── grid (default) ── */
  return (
    <section className={sectionCls}>
      {dark && <div className="absolute inset-0 dot-grid-dark opacity-40 pointer-events-none" />}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {header}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => <TestimonialCard key={i} item={item} />)}
        </div>
      </div>
    </section>
  );
}
