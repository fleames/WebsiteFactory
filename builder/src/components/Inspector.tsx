import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import DataEditor from '../DataEditor';
import type { Block } from '@schema/types';
import GlobalsEditor, { GOOGLE_FONTS } from './GlobalsEditor';
import { runSeoAudit } from '../utils/seoAudit';

const BLOCK_VARIANTS: Record<string, string[]> = {
  hero:         ['centered', 'split_image', 'split_image_reverse', 'minimal', 'with_badge'],
  services:     ['grid_cards', 'bento_grid', 'list_icons', 'split_highlight', 'circular_icons', 'glass_cards'],
  about:        ['split_image', 'split_image_reverse', 'centered_story'],
  testimonials: ['grid', 'carousel', 'featured_one'],
  pricing:      ['cards', 'simple_list'],
  faq:          ['accordion', 'two_column'],
  cta_banner:   ['centered', 'split', 'pattern'],
  contact:      ['split_form', 'centered_form'],
  trust_bar:    ['icon_row', 'badges', 'logos'],
  process:      ['numbered_steps', 'timeline', 'icon_flow'],
  stats:        ['row', 'grid', 'with_icon', 'neon_counter'],
  gallery:      ['grid', 'masonry', 'carousel'],
  team:         ['grid_cards', 'list', 'featured'],
  blog_grid:    ['grid', 'list', 'featured_first'],
  video:           ['centered', 'wide', 'with_text'],
  map:             ['full_width', 'with_info', 'split'],
  logo_cloud:      ['simple', 'with_heading', 'card_grid', 'marquee'],
  comparison:      ['table', 'cards'],
  promo_banner:    ['announcement', 'offer', 'urgent'],
  location_finder: ['cards', 'list', 'map_grid'],
  booking_strip:   ['centered', 'split', 'with_phone'],
  core_values:     ['icon_grid', 'horizontal_list', 'numbered'],
};

const BLOCK_COLORS: Record<string, string> = {
  hero: '#3B82F6', trust_bar: '#F59E0B', services: '#8B5CF6', about: '#06B6D4',
  process: '#10B981', testimonials: '#EC4899', pricing: '#F97316', faq: '#6366F1',
  cta_banner: '#EF4444', contact: '#14B8A6', stats: '#22C55E', gallery: '#A855F7',
  team: '#64748B', blog_grid: '#0EA5E9', video: '#DC2626', map: '#16A34A',
  logo_cloud: '#9333EA', comparison: '#D97706', promo_banner: '#E11D48',
  location_finder: '#0891B2', booking_strip: '#7C3AED', core_values: '#CA8A04',
};

const BLOCK_ICONS_MAP: Record<string, string> = {
  hero: '⚡', services: '🔧', faq: '❓', testimonials: '💬', pricing: '💰',
  contact: '✉️', gallery: '🖼️', team: '👤', blog_grid: '📰', trust_bar: '🏅',
  about: '👥', process: '📋', cta_banner: '📣', stats: '📊', video: '▶️',
  map: '📍', logo_cloud: '🤝', comparison: '⚖️', promo_banner: '🎉',
  location_finder: '🗺️', booking_strip: '📅', core_values: '🌟',
};

const AI_CHIPS: Record<string, string[]> = {
  hero:            ['Gør mere overbevisende', 'Tilføj akutservice', 'Kortere og mere direkte'],
  services:        ['Tilføj en ekstra service', 'Gør beskrivelserne mere specifikke', 'Fremhæv fordele frem for funktioner'],
  testimonials:    ['Tilføj 2 nye anmeldelser', 'Gør anmeldelserne mere detaljerede', 'Skift til lokal tone'],
  faq:             ['Tilføj 3 nye spørgsmål', 'Fokusér på pris-relaterede spørgsmål', 'Tilføj garanti-spørgsmål'],
  pricing:         ['Tilføj en gratis-plan', 'Fremhæv den populære plan mere', 'Tilføj årsrabat'],
  cta_banner:      ['Gør mere presserende', 'Tilføj telefonnummer', 'Tilbuds-vinkel'],
  contact:         ['Tilføj postnummer-felt', 'Gør formularoverskriften mere indbydende', 'Tilføj besøgsadresse'],
  about:           ['Tilføj grundlæggelseshistorie', 'Tilføj certifikater', 'Fokusér på kunderne'],
  process:         ['Gør trinene kortere', 'Tilføj tidsstempel pr. trin', 'Mere handlingsorienteret sprog'],
  stats:           ['Opdater tallene', 'Tilføj en ekstra statistik', 'Gør etiketterne kortere'],
  gallery:         ['Tilføj billedtekster', 'Tilføj en overskrift', 'Skift til masonry variant'],
  team:            ['Tilføj et nyt teammedlem', 'Kortere bio-tekster', 'Tilføj LinkedIn-links'],
  blog_grid:       ['Tilføj et udvalgt indlæg', 'Opdater overskrifterne', 'Tilføj kategorier'],
  video:           ['Opdater videobeskrivelsen', 'Tilføj en handlingsknap', 'Skift til wide variant'],
  map:             ['Tilføj åbningstider', 'Tilføj kontaktinfo', 'Tilføj parkeringsinfo'],
  logo_cloud:      ['Tilføj et nyt logo', 'Tilføj overskrift', 'Skift til marquee variant'],
  comparison:      ['Tilføj en ekstra kolonne', 'Fremhæv den anbefalede plan', 'Tilføj prisrækker'],
  trust_bar:       ['Tilføj et nyt certifikat', 'Gør teksten kortere', 'Skift til logoer-variant'],
  promo_banner:    ['Gør mere presserende', 'Skift til sommer-kampagne', 'Tilføj procentrabat'],
  location_finder: ['Tilføj en ny afdeling', 'Tilføj åbningstider', 'Tilføj booking-links'],
  booking_strip:   ['Gør opfordringen mere direkte', 'Tilføj telefonnummer', 'Skift til mørk baggrund'],
  core_values:     ['Tilføj en femte værdi', 'Gør beskrivelserne kortere', 'Skift til nummereret variant'],
};

const ANIM_BG_OPTIONS = [
  { value: '',            label: 'Ingen',       icon: '○' },
  { value: 'particles',   label: 'Partikler',   icon: '✦' },
  { value: 'aurora',      label: 'Aurora',      icon: '◈' },
  { value: 'noise_flow',  label: 'Støjbølge',   icon: '∿' },
  { value: 'geometric',   label: 'Geometrisk',  icon: '⬡' },
  { value: 'wave_grid',   label: 'Bølgegitter', icon: '⠿' },
  { value: 'cyber_grid',  label: 'Cyber Grid',  icon: '⊞' },
  { value: 'starfield',   label: 'Stjernefelt', icon: '✧' },
  { value: 'plasma',      label: 'Plasma',      icon: '⚛' },
  { value: 'hex_grid',    label: 'Hex Grid',    icon: '⬢' },
  { value: 'vortex',      label: 'Vortex',      icon: '🌀' },
  { value: 'neon_pulse',  label: 'Neon Pulse',  icon: '◎' },
  { value: 'matrix_rain', label: 'Matrix Rain', icon: '▓' },
  { value: 'fire',        label: 'Ild',         icon: '🔥' },
  { value: 'circuit',     label: 'Circuit',     icon: '⊛' },
  { value: 'galaxy',      label: 'Galakse',     icon: '🌌' },
  { value: 'ripple',      label: 'Ripple',      icon: '≋' },
  { value: 'fbm_warp',    label: 'FBM Warp',    icon: '⌁' },
];

const ANIM_BLOCKS = new Set(['hero', 'cta_banner']);

const BG_OPTIONS = [
  { value: 'white',      label: 'White',      color: '#FFFFFF' },
  { value: 'surface',    label: 'Surface',    color: '#F9FAFB' },
  { value: 'brand_tint', label: 'Brand Tint', color: null },
  { value: 'brand',      label: 'Brand',      color: null },
  { value: 'brand_dark', label: 'Brand Dark', color: null },
  { value: 'dark',       label: 'Dark',       color: '#1F2937' },
  { value: 'black',      label: 'Black',      color: '#000000' },
];

const PY_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl'];

type NoBlockTab = 'seo' | 'globals' | 'snapshots';

// CSS for AI button pulse animation
const AI_PULSE_CSS = `
@keyframes ai-pulse { 0%,100% { opacity:0.6; text-shadow:0 0 4px rgba(167,139,250,0.3); } 50% { opacity:1; text-shadow:0 0 10px rgba(167,139,250,0.8), 0 0 20px rgba(139,92,246,0.4); } }
.ai-pulse-btn { animation: ai-pulse 2.5s ease-in-out infinite; }
`;

export default function Inspector() {
  const { site, currentPageSlug, selectedBlockId, selectBlock,
    updateBlockData, updateBlockSettings, updateBlockVariant, updatePageSeo, filePath } = useStore();
  const [noBlockTab, setNoBlockTab] = useState<NoBlockTab>('seo');
  const [regenerating, setRegenerating] = useState(false);
  const [regenPrompt, setRegenPrompt] = useState('');

  if (!site) return null;
  const page = site.pages.find(p => p.slug === currentPageSlug);
  const block = page?.blocks.find(b => b.id === selectedBlockId) as Block | undefined;

  // ── No block selected ────────────────────────────────────────────────────

  if (!block) {
    return (
      <div className="w-72 shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: AI_PULSE_CSS }} />
        <div className="flex border-b border-slate-100 shrink-0 bg-slate-50/80 relative">
          {([['seo', 'SEO'], ['globals', 'Globals'], ['snapshots', 'Snapshots']] as [NoBlockTab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setNoBlockTab(t as NoBlockTab)}
              className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors relative ${
                noBlockTab === t
                  ? 'text-blue-600 bg-white'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              {label}
              {noBlockTab === t && (
                <motion.div layoutId="inspector-tab-pill"
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-blue-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
              )}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={noBlockTab} className="flex-1 overflow-y-auto"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}>
            {noBlockTab === 'seo' && page && <SeoEditor page={page} onUpdate={seo => updatePageSeo(currentPageSlug, seo)} />}
            {noBlockTab === 'globals' && <GlobalsEditor />}
            {noBlockTab === 'snapshots' && <SnapshotsPanel filePath={filePath} />}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const variants = BLOCK_VARIANTS[block.type] ?? [];
  const brandColor = site.theme.colors.brand;
  const blockColor = BLOCK_COLORS[block.type] ?? '#3B82F6';
  const blockIcon  = BLOCK_ICONS_MAP[block.type] ?? '▪';

  // ── Block selected ────────────────────────────────────────────────────────

  const handleRegenWith = async (prompt: string) => {
    if (!prompt.trim()) return;
    setRegenerating(true);
    try {
      const r = await fetch('/api/ai-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site, pageSlug: currentPageSlug, blockId: block.id, prompt }),
      });
      if (r.ok) {
        const { data } = await r.json() as { data: Record<string, unknown> };
        updateBlockData(currentPageSlug, block.id, data);
        setRegenPrompt('');
      }
    } finally {
      setRegenerating(false);
    }
  };

  const handleRegen = () => handleRegenWith(regenPrompt);

  const note = (block.settings as Record<string, unknown>)?.note as string ?? '';

  return (
    <div className="w-72 shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: AI_PULSE_CSS }} />

      {/* Block header with color accent */}
      <div className="relative px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${blockColor}08 0%, rgba(249,250,251,0.9) 60%)` }}>
        {/* Color bar at top */}
        <div className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${blockColor} 0%, ${blockColor}40 60%, transparent 100%)` }} />

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ background: `${blockColor}18`, border: `1px solid ${blockColor}30` }}>
            {blockIcon}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 capitalize">{block.type.replace(/_/g, ' ')}</div>
            <div className="text-[10px] text-slate-400 font-mono">{block.id}</div>
          </div>
        </div>
        <button onClick={() => selectBlock(null)}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Settings */}
        <CollapsibleSection title="Indstillinger">
          {/* Visual variant picker */}
          {variants.length > 1 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-slate-600 mb-1.5">Variant</div>
              <div className="flex flex-wrap gap-1">
                {variants.map(v => {
                  const isActive = block.variant === v;
                  return (
                    <button key={v} onClick={() => updateBlockVariant(currentPageSlug, block.id, v)}
                      className={`px-2 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >{v.replace(/_/g, ' ')}</button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-slate-600 mb-1.5">Baggrund</div>
            <div className="flex flex-wrap gap-1.5">
              {BG_OPTIONS.map(opt => {
                const isActive = (block.settings?.background ?? 'white') === opt.value;
                return (
                  <button key={opt.value} title={opt.label}
                    onClick={() => updateBlockSettings(currentPageSlug, block.id, { background: opt.value })}
                    className={`relative w-7 h-7 rounded-lg ring-2 transition-all ${
                      isActive
                        ? 'ring-blue-500 scale-110 shadow-md'
                        : 'ring-transparent hover:ring-slate-300 hover:scale-105'
                    }`}
                    style={{ background: opt.color ?? (opt.value === 'brand_tint' ? `${brandColor}18` : opt.value.includes('brand') ? brandColor : undefined) }}
                  >
                    {isActive && (
                      <span className="absolute inset-0 flex items-center justify-center text-[8px]">
                        <svg className={`w-3 h-3 ${opt.value === 'white' || opt.value === 'surface' ? 'text-slate-600' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-600 mb-1.5">Afstand (Y)</div>
            <div className="flex gap-1">
              {PY_OPTIONS.map(py => (
                <button key={py}
                  onClick={() => updateBlockSettings(currentPageSlug, block.id, { paddingY: py })}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded-md border transition-colors ${
                    (block.settings?.paddingY ?? 'xl') === py
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                  }`}
                >{py}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="text-xs font-medium text-slate-600">Gennemsigtighed</div>
              <span className="text-[10px] font-mono text-slate-500">
                {Math.round((block.settings?.opacity ?? 1) * 100)}%
              </span>
            </div>
            <input
              type="range" min={0} max={100} step={5}
              value={Math.round((block.settings?.opacity ?? 1) * 100)}
              onChange={e => {
                const pct = parseInt(e.target.value);
                const opacity = parseFloat((pct / 100).toFixed(2));
                updateBlockSettings(currentPageSlug, block.id, { opacity: opacity >= 1 ? undefined : opacity });
              }}
              className="w-full h-1.5 rounded-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-300 mt-0.5">
              <span>Usynlig</span><span>Fuldt synlig</span>
            </div>
          </div>

          {ANIM_BLOCKS.has(block.type) && (
            <div>
              <div className="text-xs font-medium text-slate-600 mb-1.5">Animeret baggrund</div>
              <div className="grid grid-cols-3 gap-1">
                {ANIM_BG_OPTIONS.map(opt => {
                  const current = (block.settings as Record<string, unknown>)?.animatedBg as string ?? '';
                  const isActive = current === opt.value;
                  return (
                    <button key={opt.value}
                      onClick={() => updateBlockSettings(currentPageSlug, block.id, { animatedBg: opt.value || undefined })}
                      className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border text-center transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm leading-none">{opt.icon}</span>
                      <span className="text-[9px] font-semibold leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-slate-600 mb-1.5">Visuelle effekter</div>
            <div className="flex flex-col gap-1.5">
              {([
                ['gradientHeading', 'Gradient overskrift'],
                ['blobs', 'Dekorative baggrundsblobs'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!((block.settings as Record<string, unknown>)?.[key])}
                    onChange={e => updateBlockSettings(currentPageSlug, block.id, { [key]: e.target.checked || undefined })}
                    className="w-3.5 h-3.5 rounded accent-blue-500"
                  />
                  <span className="text-xs text-slate-600">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Block note */}
          <div>
            <div className="text-xs font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
              <span>Note</span>
              <span className="text-[9px] text-slate-400 font-normal">(intern, vises ikke)</span>
            </div>
            <textarea
              value={note}
              onChange={e => updateBlockSettings(currentPageSlug, block.id, { note: e.target.value || undefined })}
              placeholder="Tilføj en intern note til denne blok…"
              rows={2}
              className={`${inputCls} resize-none text-[11px]`}
            />
          </div>
        </CollapsibleSection>

        {/* Typography */}
        <CollapsibleSection title="Typografi">
          <TypographyEditor blockId={block.id} settings={block.settings as Record<string,unknown>} brandColor={brandColor} />
        </CollapsibleSection>

        {/* AI Regenerate */}
        <CollapsibleSection title="AI Generer" accent="violet">
          <div className="space-y-2">
            {AI_CHIPS[block.type]?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {AI_CHIPS[block.type].map(chip => (
                  <button key={chip}
                    onClick={() => setRegenPrompt(chip)}
                    className="px-2 py-0.5 text-[10px] font-medium rounded-full border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 hover:border-violet-300 transition-colors truncate max-w-full"
                  >{chip}</button>
                ))}
              </div>
            )}

            {/* Translate quick buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[9px] font-mono text-slate-400">🌐</span>
              {[['DK', 'Oversæt til dansk'], ['EN', 'Translate to English'], ['DE', 'Auf Deutsch übersetzen']].map(([lang, prompt]) => (
                <button key={lang}
                  onClick={() => handleRegenWith(prompt)}
                  disabled={regenerating}
                  className="px-2 py-0.5 text-[9px] font-bold rounded-md border transition-colors disabled:opacity-40 font-mono"
                  style={{ border: '1px solid rgba(148,163,184,0.3)', color: 'rgba(100,116,139,0.9)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#60a5fa'; (e.currentTarget as HTMLElement).style.color = '#2563eb'; (e.currentTarget as HTMLElement).style.background = '#eff6ff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.3)'; (e.currentTarget as HTMLElement).style.color = 'rgba(100,116,139,0.9)'; (e.currentTarget as HTMLElement).style.background = ''; }}
                >{lang}</button>
              ))}
            </div>

            <textarea
              value={regenPrompt}
              onChange={e => setRegenPrompt(e.target.value)}
              placeholder={`f.eks. "Gør denne mere presserende" / "Tilføj en akutservice"`}
              rows={2}
              className={`${inputCls} resize-none border-violet-200 focus:border-violet-400 focus:ring-violet-500/20`}
            />
            <button
              onClick={handleRegen}
              disabled={regenerating || !regenPrompt.trim()}
              className="w-full py-1.5 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-slate-100 disabled:text-slate-400 transition-colors flex items-center justify-center gap-2"
            >
              <span className={`${!regenerating ? 'ai-pulse-btn' : ''}`}>✦</span>
              {regenerating ? 'Genererer…' : 'Generer blok'}
            </button>
          </div>
        </CollapsibleSection>

        {/* Content */}
        <CollapsibleSection title="Indhold">
          <DataEditor
            data={(block as unknown as Record<string, unknown>).data as Record<string, never>}
            onChange={(key, value) => updateBlockData(currentPageSlug, block.id, { [key]: value })}
            aiContext={{ blockType: block.type, blockData: (block as unknown as { data: Record<string, never> }).data }}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}

// ── Typography Editor ─────────────────────────────────────────────────────────

function TypographyEditor({ blockId, settings, brandColor }: {
  blockId: string;
  settings: Record<string, unknown>;
  brandColor: string;
}) {
  const { updateBlockSettings } = useStore();
  const { currentPageSlug } = useStore();
  const set = (patch: Record<string, unknown>) =>
    updateBlockSettings(currentPageSlug, blockId, patch);

  const get = <T,>(key: string, fallback: T) =>
    (settings?.[key] ?? fallback) as T;

  const headingFont    = get('headingFont', '');
  const headingColor   = get('headingColor', '');
  const headingSize    = get('headingSize', 'base');
  const headingWeight  = get('headingWeight', '800');
  const headingAlign   = get('headingAlign', 'inherit');
  const letterSpacing  = get('letterSpacing', 'normal');
  const headingEffect  = get('headingEffect', '');
  const bodyColor      = get('bodyColor', '');

  const pill = (active: boolean) =>
    `flex-1 py-1 text-[10px] font-semibold rounded-md border transition-colors ${
      active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
    }`;

  const colorSwatches = [
    { label: 'Standard', value: '',        bg: '#e2e8f0' },
    { label: 'Hvid',     value: '#ffffff',  bg: '#ffffff' },
    { label: 'Sort',     value: '#0f172a',  bg: '#0f172a' },
    { label: 'Brand',    value: brandColor, bg: brandColor },
    { label: 'Grå',      value: '#94a3b8',  bg: '#94a3b8' },
  ];

  return (
    <div className="space-y-3">

      {/* Heading font */}
      <div>
        <div className="text-xs font-medium text-slate-600 mb-1.5">Overskrift font</div>
        <select
          value={headingFont}
          onChange={e => set({ headingFont: e.target.value || undefined })}
          className={inputCls}
          style={{ fontFamily: headingFont || undefined }}
        >
          <option value="">Standard</option>
          {GOOGLE_FONTS.map(f => (
            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
          ))}
        </select>
      </div>

      {/* Heading color */}
      <div>
        <div className="text-xs font-medium text-slate-600 mb-1.5">Overskrift farve</div>
        <div className="flex items-center gap-1.5">
          {colorSwatches.map(s => (
            <button key={s.value} title={s.label}
              onClick={() => set({ headingColor: s.value || undefined })}
              className={`w-6 h-6 rounded-md ring-2 transition-all shrink-0 ${headingColor === s.value ? 'ring-blue-500 scale-110 shadow-sm' : 'ring-transparent hover:ring-slate-300 hover:scale-105'}`}
              style={{ background: s.bg, border: '1px solid rgba(0,0,0,.1)' }}
            />
          ))}
          <input type="color"
            value={headingColor || '#000000'}
            onChange={e => set({ headingColor: e.target.value })}
            title="Vælg farve"
            className="w-6 h-6 rounded-md cursor-pointer shrink-0"
            style={{ padding: '1px', border: '1px solid rgba(0,0,0,.15)', background: 'none' }}
          />
        </div>
      </div>

      {/* Heading size */}
      <div>
        <div className="text-xs font-medium text-slate-600 mb-1.5">Størrelse</div>
        <div className="flex gap-1">
          {(['xs','sm','base','lg','xl','2xl'] as const).map(s => (
            <button key={s} onClick={() => set({ headingSize: s === 'base' ? undefined : s })}
              className={pill(headingSize === s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Heading weight */}
      <div>
        <div className="text-xs font-medium text-slate-600 mb-1.5">Tykkelse</div>
        <div className="flex gap-1 flex-wrap">
          {(['400','500','600','700','800','900'] as const).map(w => (
            <button key={w} onClick={() => set({ headingWeight: w === '800' ? undefined : w })}
              className={pill(headingWeight === w)}
              style={{ fontWeight: w }}>{w}</button>
          ))}
        </div>
      </div>

      {/* Text align + letter spacing on same row */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs font-medium text-slate-600 mb-1.5">Justering</div>
          <div className="flex gap-1">
            {([
              { v: 'inherit', icon: (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10"/>
                </svg>
              )},
              { v: 'center', icon: (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 10h10M4 14h16M7 18h10"/>
                </svg>
              )},
              { v: 'right', icon: (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 10h10M4 14h16M10 18h10"/>
                </svg>
              )},
            ] as const).map(({ v, icon }) => (
              <button key={v}
                onClick={() => set({ headingAlign: v === 'inherit' ? undefined : v })}
                className={`flex-1 flex items-center justify-center py-1 rounded-md border transition-colors ${
                  headingAlign === v ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >{icon}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-600 mb-1.5">Afstand</div>
          <div className="flex gap-1">
            {(['tight','normal','wide'] as const).map(ls => (
              <button key={ls} onClick={() => set({ letterSpacing: ls === 'normal' ? undefined : ls })}
                className={pill(letterSpacing === ls)}
                style={{ fontSize: '9px' }}>{ls[0].toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Text effect */}
      <div>
        <div className="text-xs font-medium text-slate-600 mb-1.5">Teksteffekt</div>
        <div className="grid grid-cols-3 gap-1">
          {([
            { value: '',         label: 'Ingen',    icon: 'T' },
            { value: 'gradient', label: 'Gradient', icon: '🌈' },
            { value: 'cosmic',   label: 'Cosmic',   icon: '✦' },
            { value: 'shimmer',  label: 'Shimmer',  icon: '✧' },
            { value: 'glitch',   label: 'Glitch',   icon: '⚡' },
            { value: 'chromatic',label: 'Chroma',   icon: '◈' },
          ] as const).map(opt => (
            <button key={opt.value}
              onClick={() => set({ headingEffect: opt.value || undefined })}
              className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg border text-center transition-all ${
                headingEffect === opt.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <span className="text-xs leading-none">{opt.icon}</span>
              <span className="text-[9px] font-semibold leading-tight">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body text color */}
      <div>
        <div className="text-xs font-medium text-slate-600 mb-1.5">Brødtekst farve</div>
        <div className="flex items-center gap-1.5">
          {[
            { label: 'Standard', value: '',        bg: '#e2e8f0' },
            { label: 'Hvid',     value: '#ffffff',  bg: '#ffffff' },
            { label: 'Lys grå', value: '#cbd5e1',  bg: '#cbd5e1' },
            { label: 'Grå',      value: '#64748b',  bg: '#64748b' },
            { label: 'Sort',     value: '#0f172a',  bg: '#0f172a' },
          ].map(s => (
            <button key={s.value} title={s.label}
              onClick={() => set({ bodyColor: s.value || undefined })}
              className={`w-6 h-6 rounded-md ring-2 transition-all shrink-0 ${bodyColor === s.value ? 'ring-blue-500 scale-110 shadow-sm' : 'ring-transparent hover:ring-slate-300 hover:scale-105'}`}
              style={{ background: s.bg, border: '1px solid rgba(0,0,0,.1)' }}
            />
          ))}
          <input type="color"
            value={bodyColor || '#64748b'}
            onChange={e => set({ bodyColor: e.target.value })}
            title="Vælg farve"
            className="w-6 h-6 rounded-md cursor-pointer shrink-0"
            style={{ padding: '1px', border: '1px solid rgba(0,0,0,.15)', background: 'none' }}
          />
        </div>
      </div>

    </div>
  );
}

// ── Collapsible Section ───────────────────────────────────────────────────────

function CollapsibleSection({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  const [open, setOpen] = useState(true);
  const accentColor = accent === 'violet' ? 'rgba(139,92,246,0.7)' : 'rgba(148,163,184,0.5)';
  return (
    <div className="border-b border-slate-100" style={accent === 'violet' ? { background: 'linear-gradient(180deg, rgba(237,233,254,0.25) 0%, transparent 100%)' } : {}}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50/60"
      >
        <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>{title}</div>
        <motion.svg
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.15 }}
          className="w-3 h-3" style={{ color: 'rgba(148,163,184,0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SEO Editor ────────────────────────────────────────────────────────────────

function SeoEditor({ page, onUpdate }: {
  page: { seo?: { title?: string; description?: string; schema?: string }; title: string; slug?: string };
  onUpdate: (seo: { title?: string; description?: string; schema?: string }) => void;
}) {
  const { site, currentPageSlug } = useStore();
  const seo      = page.seo ?? {};
  const titleLen = (seo.title ?? '').length;
  const descLen  = (seo.description ?? '').length;
  const audit    = site ? runSeoAudit(site, currentPageSlug) : null;

  const scoreColor = !audit ? '#94a3b8' :
    audit.score >= 80 ? '#10b981' :
    audit.score >= 55 ? '#f59e0b' : '#ef4444';

  const statusIcon = (s: 'pass' | 'warn' | 'fail') =>
    s === 'pass' ? '✓' : s === 'warn' ? '!' : '✕';
  const statusColor = (s: 'pass' | 'warn' | 'fail') =>
    s === 'pass' ? 'text-emerald-500' : s === 'warn' ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest">Side SEO</div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-slate-600 font-medium">Titel-tag</div>
          <div className={`text-[10px] font-medium ${titleLen > 60 ? 'text-red-500' : titleLen > 45 ? 'text-amber-500' : 'text-slate-400'}`}>
            {titleLen}/60
          </div>
        </div>
        <input type="text" value={seo.title ?? ''} maxLength={70}
          onChange={e => onUpdate({ ...seo, title: e.target.value })}
          placeholder="Sidetitel til søgemaskiner"
          className={inputCls} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-slate-600 font-medium">Meta-beskrivelse</div>
          <div className={`text-[10px] font-medium ${descLen > 160 ? 'text-red-500' : descLen > 130 ? 'text-amber-500' : 'text-slate-400'}`}>
            {descLen}/160
          </div>
        </div>
        <textarea value={seo.description ?? ''} maxLength={180}
          onChange={e => onUpdate({ ...seo, description: e.target.value })}
          placeholder="Beskriv siden til søgeresultater"
          rows={3}
          className={`${inputCls} resize-none`} />
      </div>

      <div>
        <div className="text-xs text-slate-600 font-medium mb-1">Schema-type</div>
        <select
          value={seo.schema ?? ''}
          onChange={e => onUpdate({ ...seo, schema: e.target.value || undefined })}
          className={inputCls}
        >
          <option value="">Ingen</option>
          <option value="LocalBusiness">LocalBusiness</option>
          <option value="Organization">Organization</option>
          <option value="Service">Service</option>
          <option value="FAQPage">FAQPage</option>
        </select>
      </div>

      {/* SERP preview */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest mb-2.5">Søgevisning</div>
        <div className="text-sm text-blue-600 font-medium truncate leading-snug">
          {seo.title || page.title || 'Sidetitel'}
        </div>
        <div className="text-[11px] text-emerald-700 mt-0.5 mb-1">
          {(site?.globals?.siteUrl?.replace(/^https?:\/\//,'').replace(/\/$/,'') || (site?.business?.name ?? 'dinside').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,24) + '.dk')}{(page as { slug?: string }).slug ?? '/'}
        </div>
        <div className="text-xs text-slate-600 leading-snug line-clamp-2">
          {seo.description || 'Ingen beskrivelse angivet — tilføj en for at forbedre klikraten.'}
        </div>
      </div>

      {/* SEO Score — animated ring */}
      {audit && (
        <div className="space-y-2">
          <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest">SEO Score</div>
          <div className="flex items-center gap-4 px-3 py-3 rounded-xl border border-slate-200 bg-white">
            <SeoRing score={audit.score} color={scoreColor} />
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-700 mb-0.5">
                {audit.score >= 80 ? 'God SEO-opsætning' : audit.score >= 55 ? 'Kan forbedres' : 'Mangler vigtige elementer'}
              </div>
              <div className="text-[10px] text-slate-400">{audit.checks.filter(c => c.status === 'pass').length}/{audit.checks.length} tjek bestået</div>
            </div>
          </div>

          <div className="space-y-1.5">
            {audit.checks.map((check, i) => (
              <div key={i} className="rounded-lg border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-2 px-2.5 py-1.5">
                  <span className={`text-[11px] font-bold w-3 shrink-0 ${statusColor(check.status)}`}>
                    {statusIcon(check.status)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-700 flex-1">{check.label}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[90px]">{check.detail}</span>
                </div>
                {check.fix && check.status !== 'pass' && (
                  <div className="px-2.5 pb-2 pt-0">
                    <div className="text-[10px] text-slate-500 leading-snug pl-5">{check.fix}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SeoRing({ score, color }: { score: number; color: string }) {
  const r = 18;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <circle cx="22" cy="22" r={r} stroke="rgba(0,0,0,0.06)" strokeWidth="3.5" fill="none" />
      <motion.circle
        cx="22" cy="22" r={r}
        stroke={color} strokeWidth="3.5" fill="none"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        strokeLinecap="round"
        style={{ transformOrigin: '22px 22px', rotate: '-90deg' } as React.CSSProperties}
      />
      <text x="22" y="22" dominantBaseline="middle" textAnchor="middle"
        fontSize="11" fontWeight="800" fill={color}>
        {score}
      </text>
    </svg>
  );
}

// ── Snapshots Panel ───────────────────────────────────────────────────────────

function SnapshotsPanel({ filePath }: { filePath: string }) {
  const { site } = useStore();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [snapshots, setSnapshots] = useState<Array<{ name: string; path: string; date: string }>>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const r = await fetch(`/api/snapshots?path=${encodeURIComponent(filePath)}`);
    if (r.ok) setSnapshots(await r.json());
    setLoaded(true);
  };

  if (!loaded) { load(); return <div className="px-4 py-4 text-xs text-slate-400">Indlæser snapshots…</div>; }

  const save = async () => {
    if (!name.trim() || !site) return;
    setSaving(true);
    try {
      await fetch('/api/snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, site, name }),
      });
      setName('');
      setLoaded(false);
    } finally { setSaving(false); }
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="text-[9px] font-bold text-slate-400/80 uppercase tracking-widest">Versionshistorik</div>

      <div className="flex gap-2">
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder='f.eks. "Godkendt af kunde v1"'
          className={`${inputCls} flex-1`}
          onKeyDown={e => e.key === 'Enter' && save()} />
        <button onClick={save} disabled={saving || !name.trim()}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors shrink-0">
          Gem
        </button>
      </div>

      <div className="space-y-2">
        {snapshots.length === 0 && (
          <div className="text-xs text-slate-400 text-center py-4">Ingen snapshots endnu.</div>
        )}
        {snapshots.map(s => (
          <div key={s.path} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div>
              <div className="text-xs font-semibold text-slate-700">{s.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{new Date(s.date).toLocaleString()}</div>
            </div>
            <a href={`/api/snapshot/download?path=${encodeURIComponent(s.path)}`} download
              className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold px-2 py-1 rounded-md hover:bg-blue-50 transition-colors">
              Gendan
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export const inputCls = 'w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors placeholder-slate-300';
