import React from 'react';
import type { TeamBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: TeamBlock; }

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: 'linkedin', twitter: 'twitter', x: 'twitter',
  instagram: 'instagram', facebook: 'facebook', github: 'github',
  youtube: 'youtube', website: 'globe',
};

export function Team({ block }: Props) {
  const bg   = block.settings?.background ?? 'surface';
  const dark = isDark(bg);
  const { data, variant } = block;
  const members = data.members ?? [];

  const sectionCls = cn('relative py-24 lg:py-32',
    dark ? 'bg-gray-950 text-white' : '',
    bg === 'surface' ? 'bg-gray-50 text-gray-900' : '',
    bg === 'white' ? 'bg-white text-gray-900' : '',
  );

  const Header = () => (
    <div className="text-center max-w-2xl mx-auto mb-14">
      {data.heading && (
        <h2 className={cn('font-extrabold mb-3', dark ? 'text-white' : 'text-gray-900')}
          style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
          {data.heading}
        </h2>
      )}
      {data.subtext && (
        <p className={cn('text-lg leading-relaxed', dark ? 'text-white/60' : 'text-gray-500')}>
          {data.subtext}
        </p>
      )}
    </div>
  );

  const Avatar = ({ member, size = 'md' }: { member: typeof members[0]; size?: 'sm' | 'md' | 'lg' }) => {
    const dim = size === 'lg' ? 'w-32 h-32' : size === 'sm' ? 'w-16 h-16' : 'w-24 h-24';
    const txt = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl';
    return (
      <div className={cn(dim, 'rounded-full overflow-hidden ring-2 ring-brand/20 shrink-0 relative')}>
        {member.image ? (
          <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className={cn('w-full h-full flex items-center justify-center font-bold', txt)}
            style={{ background: 'linear-gradient(135deg, rgba(var(--brand-rgb),.15), rgba(var(--brand-rgb),.05))', color: 'var(--brand)' }}>
            {member.name.charAt(0)}
          </div>
        )}
      </div>
    );
  };

  /* Featured — first member large, rest in row */
  if (variant === 'featured' && members.length > 0) {
    const [lead, ...rest] = members;
    return (
      <section className={sectionCls}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Header />
          {/* Lead */}
          <div className={cn('flex flex-col md:flex-row gap-10 items-center p-8 rounded-3xl mb-10',
            dark ? 'card-dark' : 'card-light')} data-reveal>
            <Avatar member={lead} size="lg" />
            <div>
              <h3 className={cn('font-extrabold text-2xl mb-1', dark ? 'text-white' : 'text-gray-900')}>
                {lead.name}
              </h3>
              <div className="text-brand font-semibold text-sm mb-3">{lead.role}</div>
              {lead.bio && (
                <p className={cn('text-base leading-relaxed max-w-2xl', dark ? 'text-white/65' : 'text-gray-500')}>
                  {lead.bio}
                </p>
              )}
              {lead.social?.length ? (
                <div className="flex items-center gap-2 mt-5">
                  {lead.social.map((s, si) => (
                    <a key={si} href={s.url} target="_blank" rel="noopener noreferrer"
                      className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        dark ? 'bg-white/[0.07] text-white/50 hover:bg-white/[0.14] hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-brand/10 hover:text-brand')}>
                      <i data-lucide={PLATFORM_ICONS[s.platform.toLowerCase()] ?? 'link'} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {/* Rest */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {rest.map((m, i) => (
                <div key={i} className={cn('p-5 rounded-2xl flex flex-col items-center text-center', dark ? 'card-dark' : 'card-light')} data-reveal>
                  <Avatar member={m} size="sm" />
                  <h4 className={cn('font-bold text-sm mt-3', dark ? 'text-white' : 'text-gray-900')}>{m.name}</h4>
                  <div className="text-brand text-xs font-medium mt-0.5">{m.role}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  /* List variant — horizontal rows */
  if (variant === 'list') {
    return (
      <section className={sectionCls}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Header />
          <div className="space-y-4">
            {members.map((m, i) => (
              <div key={i} className={cn('flex items-center gap-5 p-5 rounded-2xl', dark ? 'card-dark' : 'card-light')} data-reveal>
                <Avatar member={m} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className={cn('font-bold', dark ? 'text-white' : 'text-gray-900')}>{m.name}</div>
                  <div className="text-brand text-sm font-medium">{m.role}</div>
                  {m.bio && (
                    <p className={cn('text-sm mt-1 leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>
                      {m.bio}
                    </p>
                  )}
                </div>
                {m.social?.length ? (
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    {m.social.slice(0,3).map((s, si) => (
                      <a key={si} href={s.url} target="_blank" rel="noopener noreferrer"
                        className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                          dark ? 'bg-white/[0.07] text-white/50 hover:text-white' : 'bg-gray-100 text-gray-400 hover:text-brand')}>
                        <i data-lucide={PLATFORM_ICONS[s.platform.toLowerCase()] ?? 'link'} className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* Default: grid cards */
  return (
    <section className={sectionCls}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Header />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m, i) => (
            <div key={i} className={cn('p-7 rounded-2xl flex flex-col items-center text-center group', dark ? 'card-dark' : 'card-light')} data-reveal>
              <div className="relative mb-5">
                <Avatar member={m} size="md" />
                <div className="absolute -inset-1 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity"
                  style={{ background: 'var(--brand)' }} />
              </div>
              <h3 className={cn('font-bold text-base mb-0.5', dark ? 'text-white' : 'text-gray-900')}>{m.name}</h3>
              <div className="text-brand text-sm font-semibold mb-3">{m.role}</div>
              {m.bio && (
                <p className={cn('text-sm leading-relaxed', dark ? 'text-white/55' : 'text-gray-500')}>{m.bio}</p>
              )}
              {m.social?.length ? (
                <div className="flex items-center gap-2 mt-4">
                  {m.social.map((s, si) => (
                    <a key={si} href={s.url} target="_blank" rel="noopener noreferrer"
                      className={cn('w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                        dark ? 'bg-white/[0.06] text-white/40 hover:bg-white/[0.12] hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-brand/10 hover:text-brand')}>
                      <i data-lucide={PLATFORM_ICONS[s.platform.toLowerCase()] ?? 'link'} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
