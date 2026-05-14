import React from 'react';
import type { BlogGridBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: BlogGridBlock; }

export function BlogGrid({ block }: Props) {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const { data, variant } = block;
  const posts = data.posts ?? [];

  const sectionCls = cn('relative py-24 lg:py-32',
    dark ? 'bg-gray-950 text-white' : bg === 'surface' ? 'bg-gray-50 text-gray-900' : 'bg-white text-gray-900',
  );

  const PostCard = ({ post, featured = false }: { post: typeof posts[0]; featured?: boolean }) => (
    <a href={post.slug}
      className={cn('group flex flex-col overflow-hidden rounded-2xl transition-all duration-300',
        dark ? 'card-dark hover:-translate-y-1' : 'card-light hover:-translate-y-1',
        featured ? 'lg:flex-row' : '',
      )}
      data-reveal>
      {/* Image */}
      <div className={cn('overflow-hidden shrink-0', featured ? 'lg:w-1/2 aspect-[16/9] lg:aspect-auto' : 'aspect-video')}>
        {post.image ? (
          <img src={post.image} alt={post.title} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(var(--brand-rgb),.12), rgba(var(--brand-rgb),.04))' }}>
            <i data-lucide="file-text" className="w-12 h-12 text-brand opacity-30" />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3">
          {post.category && (
            <span className="badge badge-brand text-[10px]">{post.category}</span>
          )}
          <span className={cn('text-xs', dark ? 'text-white/35' : 'text-gray-400')}>{post.date}</span>
        </div>
        <h3 className={cn('font-bold leading-snug mb-2 group-hover:text-brand transition-colors',
          featured ? 'text-xl' : 'text-base',
          dark ? 'text-white' : 'text-gray-900')}>
          {post.title}
        </h3>
        <p className={cn('text-sm leading-relaxed flex-1', dark ? 'text-white/55' : 'text-gray-500')}>
          {post.excerpt}
        </p>
        <div className={cn('flex items-center gap-1.5 mt-4 text-sm font-semibold transition-colors',
          dark ? 'text-white/50 group-hover:text-white' : 'text-gray-400 group-hover:text-brand')}>
          Læs mere <i data-lucide="arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </a>
  );

  const Header = () => (
    <div className="flex items-end justify-between mb-12">
      {data.heading && (
        <h2 className={cn('font-extrabold', dark ? 'text-white' : 'text-gray-900')}
          style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
          {data.heading}
        </h2>
      )}
      {data.cta && (
        <a href={data.cta.href} className={cn('hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors',
          dark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-brand')}>
          {data.cta.label} <i data-lucide="arrow-right" className="w-4 h-4" />
        </a>
      )}
    </div>
  );

  if (posts.length === 0) {
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Header />
          <p className={cn('text-center py-16', dark ? 'text-white/40' : 'text-gray-400')}>Ingen indlæg endnu.</p>
        </div>
      </section>
    );
  }

  /* Featured first — large first post + 2-col grid */
  if (variant === 'featured_first') {
    const [first, ...rest] = posts;
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Header />
          <div className="space-y-6">
            <PostCard post={first} featured={true} />
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((p, i) => <PostCard key={i} post={p} />)}
              </div>
            )}
          </div>
          {data.cta && (
            <div className="mt-10 text-center sm:hidden">
              <a href={data.cta.href} className="btn btn-secondary">{data.cta.label}</a>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* List variant */
  if (variant === 'list') {
    return (
      <section className={sectionCls}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Header />
          <div className="space-y-4">
            {posts.map((p, i) => (
              <a key={i} href={p.slug}
                className={cn('group flex gap-5 p-5 rounded-2xl transition-all',
                  dark ? 'card-dark' : 'card-light')}
                data-reveal>
                {p.image && (
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {p.category && <span className="badge badge-brand text-[10px] mb-1.5 inline-block">{p.category}</span>}
                  <h3 className={cn('font-bold text-sm leading-snug mb-1 group-hover:text-brand transition-colors', dark ? 'text-white' : 'text-gray-900')}>
                    {p.title}
                  </h3>
                  <p className={cn('text-xs leading-relaxed line-clamp-2', dark ? 'text-white/50' : 'text-gray-500')}>{p.excerpt}</p>
                  <div className={cn('text-xs mt-2', dark ? 'text-white/30' : 'text-gray-400')}>{p.date}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* Default: grid */
  return (
    <section className={sectionCls}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Header />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => <PostCard key={i} post={p} />)}
        </div>
        {data.cta && (
          <div className="mt-10 text-center sm:hidden">
            <a href={data.cta.href} className="btn btn-secondary">{data.cta.label}</a>
          </div>
        )}
      </div>
    </section>
  );
}
