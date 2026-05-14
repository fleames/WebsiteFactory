import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useStore } from '../store';
import { inputCls } from './Inspector';
import type { MouseEffects } from '@schema/types';

type Tab = 'nav' | 'footer' | 'settings' | 'mus';

export const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat',
  'Raleway', 'Oswald', 'Merriweather', 'Playfair Display', 'DM Sans',
  'Nunito', 'Work Sans', 'Space Grotesk', 'Outfit', 'Plus Jakarta Sans',
  'Sora', 'Lexend', 'DM Serif Display', 'Cormorant Garamond', 'Geist',
] as const;

const THEME_PRESETS = [
  { id: 'nordic',  label: 'Nordic',  brand: '#3B82F6', accent: '#06B6D4' },
  { id: 'forest',  label: 'Forest',  brand: '#16A34A', accent: '#84CC16' },
  { id: 'fire',    label: 'Fire',    brand: '#EF4444', accent: '#F97316' },
  { id: 'violet',  label: 'Violet',  brand: '#7C3AED', accent: '#EC4899' },
  { id: 'pro',     label: 'Pro',     brand: '#334155', accent: '#3B82F6' },
  { id: 'gold',    label: 'Gold',    brand: '#B45309', accent: '#D97706' },
  { id: 'ocean',   label: 'Ocean',   brand: '#0E7490', accent: '#06B6D4' },
  { id: 'rose',    label: 'Rose',    brand: '#E11D48', accent: '#F43F5E' },
  { id: 'teal',    label: 'Teal',    brand: '#0F766E', accent: '#14B8A6' },
  { id: 'indigo',  label: 'Indigo',  brand: '#4338CA', accent: '#8B5CF6' },
] as const;

export default function GlobalsEditor() {
  const { site, updateGlobals, updateTheme, updateTypography } = useStore();
  const TAB_LABELS: Record<Tab, string> = { nav: 'Navigation', footer: 'Footer', settings: 'Indstillinger', mus: 'Museffekter' };
  const [tab, setTab] = useState<Tab>('nav');
  if (!site) return null;

  const { globals, theme } = site;
  const nav = globals.nav;
  const footer = globals.footer;

  return (
    <div className="flex flex-col h-full">
      {/* Sub-tabs */}
      <div className="flex border-b border-slate-100 shrink-0 bg-slate-50/80 flex-wrap">
        {(['nav', 'footer', 'settings', 'mus'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors min-w-[25%] ${
              tab === t
                ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
            }`}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* NAV */}
        {tab === 'nav' && (
          <>
            <Row label="Logo tekst">
              <input className={inputCls} value={(nav.logo as { type: 'text'; value: string }).value ?? ''}
                onChange={e => updateGlobals({ nav: { ...nav, logo: { type: 'text', value: e.target.value } } })} />
            </Row>
            <Row label="Telefon i navigation">
              <input className={inputCls} value={nav.phone ?? ''}
                onChange={e => updateGlobals({ nav: { ...nav, phone: e.target.value } })} />
            </Row>
            <Row label="CTA-tekst">
              <input className={inputCls} value={nav.cta?.label ?? ''}
                onChange={e => updateGlobals({ nav: { ...nav, cta: { ...nav.cta!, label: e.target.value } } })} />
            </Row>
            <Row label="CTA-link">
              <input className={inputCls} value={nav.cta?.href ?? ''}
                onChange={e => updateGlobals({ nav: { ...nav, cta: { ...nav.cta!, href: e.target.value } } })} />
            </Row>
            <div className="pt-1 border-t border-slate-100">
              <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mb-2">Online booking</div>
              <Row label="Booking-URL (Planway, Treatwell…)">
                <input className={inputCls}
                  placeholder="https://planway.com/…"
                  value={nav.bookingUrl ?? ''}
                  onChange={e => updateGlobals({ nav: { ...nav, bookingUrl: e.target.value } })}
                />
                <div className="text-[10px] text-slate-400 mt-1">Viser en "Book tid"-knap i navigationen</div>
              </Row>
              <Row label="Booking-knapetekst">
                <input className={inputCls}
                  placeholder="Book en tid"
                  value={nav.bookingLabel ?? ''}
                  onChange={e => updateGlobals({ nav: { ...nav, bookingLabel: e.target.value } })}
                />
              </Row>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-1.5">
                Navigationslinks
                <span className="ml-1.5 text-slate-400 font-normal text-[10px]">Tekst|/sti pr. linje</span>
              </div>
              <textarea rows={Math.max(nav.links.length + 1, 3)}
                className={`${inputCls} resize-none font-mono text-[11px]`}
                value={nav.links.map(l => `${l.label}|${l.href}`).join('\n')}
                onChange={e => {
                  const links = e.target.value.split('\n').filter(Boolean).map(line => {
                    const [label, href = '/'] = line.split('|');
                    return { label: label.trim(), href: href.trim() };
                  });
                  updateGlobals({ nav: { ...nav, links } });
                }}
              />
            </div>
          </>
        )}

        {/* FOOTER */}
        {tab === 'footer' && (
          <>
            <Row label="Tagline">
              <input className={inputCls} value={footer.tagline ?? ''}
                onChange={e => updateGlobals({ footer: { ...footer, tagline: e.target.value } })} />
            </Row>
            <Row label="Telefon">
              <input className={inputCls} value={footer.contact?.phone ?? ''}
                onChange={e => updateGlobals({ footer: { ...footer, contact: { ...footer.contact, phone: e.target.value } } })} />
            </Row>
            <Row label="E-mail">
              <input className={inputCls} value={footer.contact?.email ?? ''}
                onChange={e => updateGlobals({ footer: { ...footer, contact: { ...footer.contact, email: e.target.value } } })} />
            </Row>
            <Row label="Adresse">
              <input className={inputCls} value={footer.contact?.address ?? ''}
                onChange={e => updateGlobals({ footer: { ...footer, contact: { ...footer.contact, address: e.target.value } } })} />
            </Row>
            <Row label="Copyright">
              <input className={inputCls} value={footer.copyright ?? ''}
                onChange={e => updateGlobals({ footer: { ...footer, copyright: e.target.value } })} />
            </Row>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-1.5">
                Sociale links
                <span className="ml-1.5 text-slate-400 font-normal text-[10px]">platform|url</span>
              </div>
              <textarea rows={3} className={`${inputCls} resize-none font-mono text-[11px]`}
                value={(footer.social ?? []).map(s => `${s.platform}|${s.url}`).join('\n')}
                onChange={e => {
                  const social = e.target.value.split('\n').filter(Boolean).map(line => {
                    const [platform, url = ''] = line.split('|');
                    return { platform: platform.trim() as never, url: url.trim() };
                  });
                  updateGlobals({ footer: { ...footer, social } });
                }}
              />
            </div>
          </>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <>
            {/* Theme presets */}
            <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mb-1">Farvetema</div>
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {THEME_PRESETS.map(p => {
                const isActive = theme.colors.brand === p.brand;
                return (
                  <button key={p.id} title={p.label}
                    onClick={() => updateTheme({ brand: p.brand, accent: p.accent })}
                    className="flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all"
                    style={{
                      border: isActive ? `1.5px solid ${p.brand}` : '1.5px solid transparent',
                      background: isActive ? `${p.brand}10` : 'rgba(0,0,0,0.02)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${p.brand}10`; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)'; }}
                  >
                    <div className="flex gap-0.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: p.brand }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: p.accent }} />
                    </div>
                    <span className="text-[8px] font-semibold" style={{ color: isActive ? p.brand : 'rgba(71,85,105,0.7)' }}>{p.label}</span>
                  </button>
                );
              })}
            </div>

            <BrandColorPicker
              color={theme.colors.brand}
              onChange={color => updateTheme({ brand: color })}
            />

            <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest">Typografi</div>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-1.5">Overskriftsskrift</div>
              <FontPicker value={theme.typography.fontHeading} onChange={f => updateTypography({ fontHeading: f })} />
              <div className="text-[10px] text-slate-400 mt-1">Gemmes automatisk og bruges i næste preview-opdatering.</div>
            </div>

            <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mt-2">Analytics</div>
            <Row label="GA4 Målings-ID">
              <input className={inputCls}
                placeholder="G-XXXXXXXXXX"
                value={globals.analyticsGa4 ?? ''}
                onChange={e => updateGlobals({ analyticsGa4: e.target.value })}
              />
            </Row>
            <Row label="GTM Container-ID">
              <input className={inputCls}
                placeholder="GTM-XXXXXXX"
                value={globals.analyticsGtm ?? ''}
                onChange={e => updateGlobals({ analyticsGtm: e.target.value })}
              />
            </Row>

            <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mt-2">SEO &amp; Kanonisk URL</div>
            <Row label="Websteds-URL (ingen afsluttende /)">
              <input className={inputCls}
                placeholder="https://dinhjemmeside.dk"
                value={globals.siteUrl ?? ''}
                onChange={e => updateGlobals({ siteUrl: e.target.value.replace(/\/$/, '') })}
              />
              <div className="text-[10px] text-slate-400 mt-1">Bruges til canonical, og:url og sitemap.xml</div>
            </Row>

            <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mt-2">Cookie-samtykke</div>
            <Row label="Cookie-banner">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox"
                    checked={globals.cookieBanner?.enabled ?? false}
                    onChange={e => updateGlobals({ cookieBanner: { ...(globals.cookieBanner ?? {}), enabled: e.target.checked } })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-200 rounded-full peer-checked:bg-blue-500 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-xs text-slate-600">Vis cookie-banner</span>
              </label>
            </Row>
            {globals.cookieBanner?.enabled && (
              <>
                <Row label="Bannertekst">
                  <textarea className={`${inputCls} resize-none`} rows={2}
                    placeholder="Vi bruger cookies til at forbedre din oplevelse…"
                    value={globals.cookieBanner?.text ?? ''}
                    onChange={e => updateGlobals({ cookieBanner: { ...(globals.cookieBanner ?? { enabled: true }), text: e.target.value } })}
                  />
                </Row>
                <Row label="Link til privatlivspolitik">
                  <input className={inputCls}
                    placeholder="/privatlivspolitik"
                    value={globals.cookieBanner?.privacyUrl ?? ''}
                    onChange={e => updateGlobals({ cookieBanner: { ...(globals.cookieBanner ?? { enabled: true }), privacyUrl: e.target.value } })}
                  />
                </Row>
              </>
            )}

            <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mt-2">Formularer</div>
            <Row label="Standard formular-webhook">
              <input className={inputCls}
                placeholder="https://hooks.zapier.com/..."
                value={globals.formWebhook ?? ''}
                onChange={e => updateGlobals({ formWebhook: e.target.value })}
              />
            </Row>
            <Row label="Modtager-e-mail">
              <input className={inputCls}
                placeholder="dig@eksempel.dk"
                value={(globals as unknown as Record<string, string>).formEmail ?? ''}
                onChange={e => updateGlobals({ formEmail: e.target.value } as never)}
              />
              <div className="text-[10px] text-slate-400 mt-1">Kræver SMTP_* variabler i .env</div>
            </Row>

            <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mt-2">Immersivt baggrund</div>
            <div className="text-[10px] text-slate-400 mb-2">Fast baggrund der aldrig scroller — giver en dybdefornemmelse</div>
            <ImmersiveBgPicker
              value={globals.immersiveBg ?? ''}
              onChange={v => updateGlobals({ immersiveBg: v || undefined })}
            />
          </>
        )}

        {tab === 'mus' && <MouseEffectsEditor />}
      </div>
    </div>
  );
}

// ── Mouse defaults (mirror of shaders.ts mouseDefaults) ──────────────────────

const MOUSE_DEFAULTS: Required<MouseEffects> = {
  cursor: true,
  cursorDotSize: 7, cursorDotColor: '#ffffff', cursorDotBlend: 'difference',
  cursorRing: true, cursorRingSize: 36, cursorRingColor: '#ffffff', cursorRingOpacity: 0.45,
  cursorRingWidth: 1.5, cursorRingLag: 0.13,
  cursorGlow: true, cursorGlowSize: 700, cursorGlowOpacity: 0.06, cursorGlowColor: 'brand', cursorGlowLag: 0.055,
  cursorHoverExpand: true, cursorHoverScale: 2,
  trail: false, trailStyle: 'dots', trailCount: 12, trailSize: 4, trailColor: 'brand',
  trailOpacity: 0.7, trailLifetime: 600, trailBlend: 'screen',
  clickBurst: false, burstCount: 10, burstRadius: 70, burstColor: 'brand', burstGravity: 0.15, burstSize: 5,
  grain: true, grainOpacity: 0.03, grainFps: 12, grainScale: 1,
  scrollBar: true, scrollBarHeight: 3, scrollBarColor: 'brand', scrollBarGlow: true,
  magnetic: true, magneticStrength: 0.12, magneticSelector: '.btn-primary,.btn-lg',
};

// ── Shared sub-components ─────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div className="relative shrink-0">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-8 h-4 bg-slate-200 rounded-full peer-checked:bg-blue-500 transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </div>
      <span className="text-xs text-slate-600">{label}</span>
    </label>
  );
}

function Slider({ label, value, min, max, step = 0.01, onChange, unit = '' }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-slate-500">{label}</span>
        <span className="text-[10px] font-mono text-slate-700">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full accent-blue-500 cursor-pointer" />
    </div>
  );
}

function NumField({ label, value, min, max, step = 1, onChange, unit = '' }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 flex-1">{label}</span>
      <div className="flex items-center gap-1">
        <input type="number" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value) || min)}
          className="w-16 px-1.5 py-1 text-xs font-mono border border-slate-200 rounded-lg text-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
        {unit && <span className="text-[10px] text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

function ColField({ label, value, brandColor, onChange }: {
  label: string; value: string; brandColor: string; onChange: (v: string) => void;
}) {
  const isBrand = value === 'brand';
  const displayColor = isBrand ? brandColor : value;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 flex-1">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-md border border-slate-200 shrink-0" style={{ background: displayColor }} />
        <select value={value} onChange={e => onChange(e.target.value)}
          className="text-[10px] border border-slate-200 rounded-lg px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300">
          <option value="brand">Brand</option>
          <option value="#ffffff">Hvid</option>
          <option value="#000000">Sort</option>
          <option value="#ef4444">Rød</option>
          <option value="#3b82f6">Blå</option>
          <option value="#22c55e">Grøn</option>
          <option value="#f59e0b">Gul</option>
          <option value="#8b5cf6">Lilla</option>
          <option value="custom">Tilpas…</option>
        </select>
        {value !== 'brand' && (
          <input type="color" value={value.startsWith('#') ? value : '#ffffff'}
            onChange={e => onChange(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border-0 p-0" />
        )}
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 flex-1">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="text-[10px] border border-slate-200 rounded-lg px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function MSection({ title, enabled, onToggle, children }: {
  title: string; enabled: boolean; onToggle: (v: boolean) => void; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border transition-colors ${enabled ? 'border-blue-200 bg-blue-50/40' : 'border-slate-100 bg-white'}`}>
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-[11px] font-bold text-slate-700">{title}</span>
        <Toggle checked={enabled} onChange={onToggle} label="" />
      </div>
      {enabled && <div className="px-3 pb-3 space-y-2.5 border-t border-slate-100">{children}</div>}
    </div>
  );
}

// ── Main mouse effects editor ─────────────────────────────────────────────────

function MouseEffectsEditor() {
  const { site, updateGlobals } = useStore();
  if (!site) return null;
  const brandColor = site.theme.colors.brand;
  const m: Required<MouseEffects> = { ...MOUSE_DEFAULTS, ...(site.globals.mouse ?? {}) };
  const up = (patch: Partial<MouseEffects>) => updateGlobals({ mouse: { ...m, ...patch } });

  const BLEND_OPTS = [
    { value: 'normal', label: 'Normal' },
    { value: 'screen', label: 'Screen' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'difference', label: 'Difference' },
  ];

  return (
    <div className="space-y-2.5 pb-2">
      <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest pt-1 pb-0.5">Museffekter</div>

      {/* ── Cursor ── */}
      <MSection title="Mus-markør" enabled={m.cursor} onToggle={v => up({ cursor: v })}>
        <div className="pt-1 space-y-2.5">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Prik</div>
          <NumField label="Størrelse" value={m.cursorDotSize} min={2} max={30} onChange={v => up({ cursorDotSize: v })} unit="px" />
          <ColField label="Farve" value={m.cursorDotColor} brandColor={brandColor} onChange={v => up({ cursorDotColor: v })} />
          <SelectField label="Blend-tilstand" value={m.cursorDotBlend} onChange={v => up({ cursorDotBlend: v as MouseEffects['cursorDotBlend'] })}
            options={[
              { value: 'difference', label: 'Difference' }, { value: 'normal', label: 'Normal' },
              { value: 'screen', label: 'Screen' }, { value: 'exclusion', label: 'Exclusion' }, { value: 'overlay', label: 'Overlay' },
            ]} />
          <Toggle checked={m.cursorHoverExpand} onChange={v => up({ cursorHoverExpand: v })} label="Udvid ved hover" />
          {m.cursorHoverExpand && (
            <Slider label="Udvidelsesgrad" value={m.cursorHoverScale} min={1.2} max={5} step={0.1} onChange={v => up({ cursorHoverScale: v })} unit="×" />
          )}

          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1">Ring</div>
          <Toggle checked={m.cursorRing} onChange={v => up({ cursorRing: v })} label="Vis ring" />
          {m.cursorRing && <>
            <NumField label="Diameter" value={m.cursorRingSize} min={10} max={120} onChange={v => up({ cursorRingSize: v })} unit="px" />
            <ColField label="Farve" value={m.cursorRingColor} brandColor={brandColor} onChange={v => up({ cursorRingColor: v })} />
            <Slider label="Opacitet" value={m.cursorRingOpacity} min={0.05} max={1} step={0.05} onChange={v => up({ cursorRingOpacity: v })} />
            <Slider label="Kantbredde" value={m.cursorRingWidth} min={0.5} max={5} step={0.5} onChange={v => up({ cursorRingWidth: v })} unit="px" />
            <Slider label="Lag (høj = hurtig)" value={m.cursorRingLag} min={0.02} max={0.5} step={0.01} onChange={v => up({ cursorRingLag: v })} />
          </>}

          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-1">Glød</div>
          <Toggle checked={m.cursorGlow} onChange={v => up({ cursorGlow: v })} label="Vis glød" />
          {m.cursorGlow && <>
            <NumField label="Størrelse" value={m.cursorGlowSize} min={100} max={1400} step={50} onChange={v => up({ cursorGlowSize: v })} unit="px" />
            <ColField label="Farve" value={m.cursorGlowColor} brandColor={brandColor} onChange={v => up({ cursorGlowColor: v })} />
            <Slider label="Opacitet" value={m.cursorGlowOpacity} min={0.01} max={0.3} step={0.01} onChange={v => up({ cursorGlowOpacity: v })} />
            <Slider label="Lag (høj = hurtig)" value={m.cursorGlowLag} min={0.01} max={0.15} step={0.005} onChange={v => up({ cursorGlowLag: v })} />
          </>}
        </div>
      </MSection>

      {/* ── Trail ── */}
      <MSection title="Muse-spor" enabled={m.trail} onToggle={v => up({ trail: v })}>
        <div className="pt-1 space-y-2.5">
          <SelectField label="Stil" value={m.trailStyle} onChange={v => up({ trailStyle: v as MouseEffects['trailStyle'] })}
            options={[
              { value: 'dots', label: 'Prikker' }, { value: 'sparks', label: 'Gnister' },
              { value: 'comet', label: 'Komet' }, { value: 'ribbon', label: 'Bånd' },
            ]} />
          {m.trailStyle !== 'ribbon' && (
            <NumField label="Maks. partikler" value={m.trailCount} min={3} max={50} onChange={v => up({ trailCount: v })} />
          )}
          <Slider label="Størrelse" value={m.trailSize} min={1} max={20} step={0.5} onChange={v => up({ trailSize: v })} unit="px" />
          <ColField label="Farve" value={m.trailColor} brandColor={brandColor} onChange={v => up({ trailColor: v })} />
          <Slider label="Opacitet" value={m.trailOpacity} min={0.1} max={1} step={0.05} onChange={v => up({ trailOpacity: v })} />
          <NumField label="Levetid" value={m.trailLifetime} min={100} max={2000} step={50} onChange={v => up({ trailLifetime: v })} unit="ms" />
          <SelectField label="Blend" value={m.trailBlend} onChange={v => up({ trailBlend: v as MouseEffects['trailBlend'] })} options={BLEND_OPTS} />
        </div>
      </MSection>

      {/* ── Click burst ── */}
      <MSection title="Klik-burst" enabled={m.clickBurst} onToggle={v => up({ clickBurst: v })}>
        <div className="pt-1 space-y-2.5">
          <NumField label="Partikler pr. klik" value={m.burstCount} min={3} max={30} onChange={v => up({ burstCount: v })} />
          <NumField label="Spredningsradius" value={m.burstRadius} min={20} max={200} onChange={v => up({ burstRadius: v })} unit="px" />
          <NumField label="Partikelstørrelse" value={m.burstSize} min={2} max={20} onChange={v => up({ burstSize: v })} unit="px" />
          <ColField label="Farve" value={m.burstColor} brandColor={brandColor} onChange={v => up({ burstColor: v })} />
          <Slider label="Tyngdekraft" value={m.burstGravity} min={0} max={1} step={0.05} onChange={v => up({ burstGravity: v })} />
        </div>
      </MSection>

      {/* ── Film grain ── */}
      <MSection title="Film-korn" enabled={m.grain} onToggle={v => up({ grain: v })}>
        <div className="pt-1 space-y-2.5">
          <Slider label="Opacitet" value={m.grainOpacity} min={0.005} max={0.15} step={0.005} onChange={v => up({ grainOpacity: v })} />
          <NumField label="Opdatering" value={m.grainFps} min={1} max={60} onChange={v => up({ grainFps: v })} unit="fps" />
          <SelectField label="Korn-størrelse" value={String(m.grainScale)} onChange={v => up({ grainScale: parseInt(v) })}
            options={[
              { value: '1', label: 'Fint (1×)' }, { value: '2', label: 'Mellem (2×)' },
              { value: '3', label: 'Groft (3×)' }, { value: '4', label: 'Meget groft (4×)' },
            ]} />
        </div>
      </MSection>

      {/* ── Scroll bar ── */}
      <MSection title="Scroll-linje" enabled={m.scrollBar} onToggle={v => up({ scrollBar: v })}>
        <div className="pt-1 space-y-2.5">
          <Slider label="Højde" value={m.scrollBarHeight} min={1} max={8} step={0.5} onChange={v => up({ scrollBarHeight: v })} unit="px" />
          <ColField label="Farve" value={m.scrollBarColor} brandColor={brandColor} onChange={v => up({ scrollBarColor: v })} />
          <Toggle checked={m.scrollBarGlow} onChange={v => up({ scrollBarGlow: v })} label="Glød-skygge" />
        </div>
      </MSection>

      {/* ── Magnetic buttons ── */}
      <MSection title="Magnetiske knapper" enabled={m.magnetic} onToggle={v => up({ magnetic: v })}>
        <div className="pt-1 space-y-2.5">
          <Slider label="Tiltrækningsstyrke" value={m.magneticStrength} min={0.02} max={0.5} step={0.01} onChange={v => up({ magneticStrength: v })} />
          <div>
            <div className="text-[10px] text-slate-500 mb-1">CSS-selector</div>
            <input className={inputCls} value={m.magneticSelector} onChange={e => up({ magneticSelector: e.target.value })} />
          </div>
        </div>
      </MSection>

      <button
        onClick={() => updateGlobals({ mouse: { ...MOUSE_DEFAULTS } })}
        className="w-full py-1.5 text-[10px] text-slate-400 hover:text-slate-600 border border-dashed border-slate-200 rounded-lg transition-colors hover:border-slate-300"
      >
        Nulstil til standard
      </button>
    </div>
  );
}

function FontPicker({ value, onChange }: { value: string; onChange: (f: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById('fp-fonts')) {
      const link = document.createElement('link');
      link.id = 'fp-fonts';
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(f => `family=${encodeURIComponent(f)}:wght@400;700`).join('&')}&display=swap`;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const filtered = (GOOGLE_FONTS as readonly string[]).filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors group">
        <span className="flex-1 text-left text-base text-slate-800 truncate"
          style={{ fontFamily: `'${value}', sans-serif` }}>{value}</span>
        <span className="text-[10px] text-slate-400 shrink-0">Aa</span>
        <svg className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-100 overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)' }}>
          <div className="p-2 border-b border-slate-100">
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Søg skrifttype…"
              className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white" />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.map(f => (
              <button key={f} onClick={() => { onChange(f); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between group
                  ${value === f ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                <div>
                  <div className="text-base leading-tight text-slate-800"
                    style={{ fontFamily: `'${f}', sans-serif` }}>
                    {f}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5"
                    style={{ fontFamily: `'${f}', sans-serif` }}>
                    The quick brown fox
                  </div>
                </div>
                {value === f && (
                  <svg className="w-3.5 h-3.5 text-blue-500 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-xs text-slate-400 text-center">Ingen resultater</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BrandColorPicker({ color, onChange }: { color: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(color);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setHex(color); }, [color]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const commit = (c: string) => { setHex(c); onChange(c); };

  return (
    <div ref={ref} className="relative mb-4">
      <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mb-2">Brandfarve</div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors group"
      >
        <div className="w-8 h-8 rounded-lg ring-2 ring-white ring-offset-1 shadow-sm shrink-0 transition-transform group-hover:scale-105"
          style={{ background: hex, boxShadow: `0 0 12px ${hex}55` }} />
        <div className="flex-1 text-left">
          <div className="text-xs font-mono font-bold text-slate-700 uppercase">{hex}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Klik for at ændre</div>
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-slate-100"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)' }}>
          <HexColorPicker color={hex} onChange={commit} style={{ width: '220px' }} />
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 text-xs font-mono px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase"
              value={hex}
              onChange={e => {
                const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                if (/^#[0-9a-fA-F]{6}$/.test(v)) commit(v);
                else setHex(v);
              }}
              maxLength={7}
            />
            <button onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors">
              OK
            </button>
          </div>
          {/* Preset swatches */}
          <div className="mt-3 grid grid-cols-8 gap-1.5">
            {['#3B82F6','#7C3AED','#EC4899','#EF4444','#F59E0B','#10B981','#06B6D4','#1E40AF',
              '#6366F1','#8B5CF6','#0EA5E9','#22C55E','#F97316','#DC2626','#64748B','#0F172A'].map(sw => (
              <button key={sw} onClick={() => commit(sw)}
                className="w-6 h-6 rounded-md ring-offset-1 transition-all hover:scale-110"
                style={{
                  background: sw,
                  boxShadow: hex === sw ? `0 0 0 2px white, 0 0 0 3px ${sw}` : 'none',
                }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const IMMERSIVE_EFFECTS = [
  { id: 'starfield',   label: 'Stjerner',  color: '#0a0a18' },
  { id: 'galaxy',      label: 'Galakse',   color: '#060610' },
  { id: 'aurora',      label: 'Aurora',    color: '#020214' },
  { id: 'particles',   label: 'Partikler', color: '#040410' },
  { id: 'plasma',      label: 'Plasma',    color: '#08020f' },
  { id: 'vortex',      label: 'Vortex',    color: '#030308' },
  { id: 'neon_pulse',  label: 'Neon',      color: '#020208' },
  { id: 'matrix_rain', label: 'Matrix',    color: '#01060a' },
  { id: 'noise_flow',  label: 'Strøm',     color: '#060618' },
  { id: 'fire',        label: 'Ild',       color: '#0a0202' },
  { id: 'circuit',     label: 'Kredsløb',  color: '#010408' },
  { id: 'cyber_grid',  label: 'Cyber',     color: '#010108' },
  { id: 'geometric',   label: 'Geo',       color: '#020208' },
  { id: 'hex_grid',    label: 'Hex',       color: '#020208' },
  { id: 'wave_grid',   label: 'Bølge',     color: '#020208' },
  { id: 'ripple',      label: 'Ringe',     color: '#010208' },
] as const;

function ImmersiveBgPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      <button
        onClick={() => onChange('')}
        className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl border text-[9px] font-semibold transition-all ${
          !value ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-400 hover:border-slate-300 bg-white hover:bg-slate-50'
        }`}
      >
        <div className="w-8 h-5 rounded-md border border-slate-200 bg-white flex items-center justify-center">
          <span className="text-[9px] text-slate-300">—</span>
        </div>
        Ingen
      </button>
      {IMMERSIVE_EFFECTS.map(fx => (
        <button key={fx.id}
          onClick={() => onChange(fx.id)}
          className={`flex flex-col items-center gap-1 px-1 py-2 rounded-xl border text-[9px] font-semibold transition-all ${
            value === fx.id ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-400 hover:border-slate-300 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="w-8 h-5 rounded-md" style={{ background: fx.color, border: '1px solid rgba(255,255,255,0.08)' }} />
          {fx.label}
        </button>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-600 mb-1.5">{label}</div>
      {children}
    </div>
  );
}
