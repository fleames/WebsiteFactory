import React from 'react';
import type { ComparisonBlock } from '../../schema/types.js';
import { cn, isDark } from '../utils.js';

interface Props { block: ComparisonBlock; }

const CheckIcon = ({ highlighted }: { highlighted?: boolean }) => (
  <div className={cn('w-5 h-5 rounded-full flex items-center justify-center mx-auto',
    highlighted ? 'bg-white/20' : 'bg-brand/10')}>
    <i data-lucide="check" className={cn('w-3 h-3', highlighted ? 'text-white' : 'text-brand')} />
  </div>
);

const CrossIcon = ({ faded }: { faded?: boolean }) => (
  <div className="w-5 h-5 rounded-full flex items-center justify-center mx-auto bg-gray-100">
    <i data-lucide="x" className={cn('w-3 h-3', faded ? 'text-gray-200' : 'text-gray-300')} />
  </div>
);

function parseBool(val: string) {
  return val === 'true' || val === '✓' || val === 'ja' || val === 'yes';
}
function parseCross(val: string) {
  return val === 'false' || val === '✗' || val === '–' || val === '-' || val === 'nej' || val === 'no';
}

export function Comparison({ block }: Props) {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const { data, variant } = block;
  const cols = data.columns ?? [];
  const rows = data.rows ?? [];

  const sectionCls = cn('relative py-24 lg:py-32',
    dark ? 'bg-gray-950 text-white' : bg === 'surface' ? 'bg-gray-50 text-gray-900' : 'bg-white text-gray-900',
  );

  const Header = () => (data.heading || data.subtext) ? (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {data.heading && (
        <h2 className={cn('font-extrabold mb-3', dark ? 'text-white' : 'text-gray-900')}
          style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', letterSpacing: '-0.028em' }}>
          {data.heading}
        </h2>
      )}
      {data.subtext && (
        <p className={cn('text-lg', dark ? 'text-white/60' : 'text-gray-500')}>{data.subtext}</p>
      )}
    </div>
  ) : null;

  /* Cards variant */
  if (variant === 'cards') {
    return (
      <section className={sectionCls}>
        {!dark && <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <Header />
          <div className={cn('grid gap-5', cols.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3')}>
            {cols.map((col, ci) => {
              const featured = col.highlighted;
              return (
                <div key={ci}
                  className={cn('relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300',
                    featured
                      ? 'ring-2 shadow-2xl scale-[1.02]'
                      : dark ? 'card-dark' : 'bg-white border border-gray-200 shadow-sm hover:-translate-y-0.5')}
                  style={featured ? {
                    background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
                    boxShadow: '0 0 0 1px rgba(var(--brand-rgb),.4), 0 24px 60px rgba(var(--brand-rgb),.25)',
                  } : {}}
                  data-reveal>
                  {col.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={cn('text-[11px] font-bold px-3 py-1 rounded-full',
                        featured ? 'bg-white/20 text-white' : 'bg-brand text-white shadow-lg')}>
                        {col.badge}
                      </span>
                    </div>
                  )}
                  <div className="p-6 pb-4">
                    <h3 className={cn('font-extrabold text-lg', featured ? 'text-white' : dark ? 'text-white' : 'text-gray-900')}>
                      {col.name}
                    </h3>
                  </div>
                  <div className="px-6 pb-6 flex-1">
                    {rows.map((row, ri) => {
                      const val = row.values[ci] ?? '–';
                      const isCheck = parseBool(val);
                      const isCross = parseCross(val);
                      return (
                        <div key={ri} className={cn('py-3 border-t',
                          featured ? 'border-white/15' : dark ? 'border-white/[0.07]' : 'border-gray-100')}>
                          <div className="flex items-center justify-between gap-3">
                            <span className={cn('text-sm', featured ? 'text-white/80' : dark ? 'text-white/65' : 'text-gray-600')}>
                              {row.feature}
                            </span>
                            {isCheck ? <CheckIcon highlighted={featured} />
                              : isCross ? <CrossIcon faded={featured} />
                              : <span className={cn('text-sm font-semibold', featured ? 'text-white' : dark ? 'text-white' : 'text-gray-900')}>{val}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {data.cta && (
            <div className="text-center mt-10">
              <a href={data.cta.href} className="btn btn-lg btn-primary">
                {data.cta.label} <i data-lucide="arrow-right" className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* Table variant (default) */
  return (
    <section className={sectionCls}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <Header />
        <div className={cn('rounded-2xl overflow-hidden',
          dark ? 'border border-white/[0.08]' : 'border border-gray-200 shadow-lg')}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={dark ? 'bg-white/[0.04]' : 'bg-gray-50'}>
                  <th className={cn('py-4 px-6 text-left font-semibold w-2/5',
                    dark ? 'text-white/50' : 'text-gray-500')}>Funktion</th>
                  {cols.map((col, ci) => (
                    <th key={ci} className={cn('py-4 px-4 text-center font-bold relative',
                      col.highlighted ? 'text-brand' : dark ? 'text-white' : 'text-gray-900',
                      col.highlighted ? dark ? 'bg-brand/10' : 'bg-brand/5' : '')}>
                      {col.badge && (
                        <span className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold bg-brand text-white px-2 py-0.5 rounded-full">
                          {col.badge}
                        </span>
                      )}
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={cn(
                    ri % 2 !== 0 ? dark ? 'bg-white/[0.02]' : 'bg-gray-50/60' : '',
                    ri > 0 ? dark ? 'border-t border-white/[0.05]' : 'border-t border-gray-100' : '',
                  )}>
                    <td className={cn('py-3.5 px-6 font-medium', dark ? 'text-white/70' : 'text-gray-700')}>
                      {row.feature}
                    </td>
                    {row.values.map((val, ci) => {
                      const col = cols[ci];
                      const isCheck = parseBool(val);
                      const isCross = parseCross(val);
                      return (
                        <td key={ci} className={cn('py-3.5 px-4 text-center',
                          col?.highlighted ? dark ? 'bg-brand/[0.08]' : 'bg-brand/[0.04]' : '')}>
                          {isCheck ? <CheckIcon highlighted={col?.highlighted} />
                            : isCross ? <CrossIcon />
                            : <span className={cn('font-medium', col?.highlighted ? 'text-brand' : dark ? 'text-white/75' : 'text-gray-700')}>{val}</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {data.cta && (
          <div className="text-center mt-10">
            <a href={data.cta.href} className="btn btn-lg btn-primary">
              {data.cta.label} <i data-lucide="arrow-right" className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
