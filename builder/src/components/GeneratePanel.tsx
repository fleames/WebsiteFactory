import { useState, useEffect, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode     = 'guided' | 'freetext';
type Lang     = 'DK' | 'DE' | 'EN';
type Scope    = 'landing' | 'small' | 'full';
type Provider = 'deepseek' | 'gpt-4o-mini' | 'gpt-4o';

const PROVIDER_META: Record<Provider, { label: string; speed: string; costTag: string; color: string; note: string }> = {
  'deepseek':    { label: 'DeepSeek V3',  speed: 'Hurtig',    costTag: '~$0.002', color: 'text-blue-400',    note: 'Billig og hurtig' },
  'gpt-4o-mini': { label: 'GPT-4o mini',  speed: 'Balanceret',costTag: '~$0.05',  color: 'text-emerald-400', note: 'God kvalitet' },
  'gpt-4o':      { label: 'GPT-4o',       speed: 'Bedst',     costTag: '~$0.40',  color: 'text-violet-400',  note: 'Bedste kvalitet' },
};

interface GuidedState {
  name: string;
  phone: string;
  type: string;
  city: string;
  services: string[];
  usps: string[];
  styles: string[];
  lang: Lang;
}

export type LogEntry = { kind: 'page'; slug: string } | { kind: 'block'; blockType: string };

// ── Static data ───────────────────────────────────────────────────────────────

const TYPE_SUGGESTIONS = [
  'VVS-mester', 'Elektriker', 'Tømrerfirma', 'Malerfirma', 'Kloakservice',
  'Tandlæge', 'Fysioterapeut', 'Psykolog', 'Kiropraktor', 'Speciallæge',
  'Fitnesscenter', 'Yogastudie', 'Personlig træner', 'Crossfit-boks',
  'Restaurant', 'Café', 'Bageri', 'Pizzeria', 'Sushirestaurant',
  'Advokatfirma', 'Revisor', 'Bogholder', 'Skatterådgiver',
  'Digitalt bureau', 'Webbureau', 'SEO-bureau', 'Reklamebureau',
  'Frisørsalon', 'Skønhedsklinik', 'Neglestudio', 'Barbershop',
  'Rengøringsservice', 'Ejendomsmægler', 'Arkitektfirma',
  'Dyrlæge', 'Anlægsgartner', 'Blomsterbutik', 'Hundepasser',
  'Hotel', 'Bed & Breakfast', 'Ferieudlejning',
  'Software-startup', 'SaaS-platform', 'IT-konsulent', 'Cybersikkerhed',
  'Smykkebutik', 'Modeboutique', 'Interiørdesigner',
];

// Dynamic service suggestions keyed by lowercased type keyword
const SERVICE_MAP: Array<[string[], string[]]> = [
  [['vvs','blikkenslager'],         ['Rørinstallation', 'Badeværelsesrenovering', 'Varmepumper', 'Varmesystemer', 'Akutservice', 'Kloak']],
  [['elektriker','el-'],             ['El-installation', 'LED-belysning', 'El-tavler', 'Solceller', 'Ladestandere', 'Alarmsystemer']],
  [['tømrer','snedker'],             ['Tilbygning', 'Køkkenrenovering', 'Gulvlægning', 'Vinduer & Døre', 'Terrassebygning', 'Loftsrum']],
  [['maler'],                        ['Indvendig maling', 'Udvendig maling', 'Facaderenovering', 'Tapetsering', 'Spartling', 'Gulvlakering']],
  [['kloak','kloakservice'],         ['TV-inspektion', 'Kloakspuling', 'Stikledninger', 'Drænanlæg', 'Nedsivningsanlæg', 'Akutservice']],
  [['tandlæge','dental'],            ['Tandrensning', 'Tandfyldning', 'Tandblegning', 'Tandregulering', 'Implantat', 'Børnetandlæge']],
  [['fysioterapeut','fysio'],        ['Sportsskader', 'Ryg & Nakke', 'Genoptræning', 'Manuel terapi', 'Dry needling', 'Holdtræning']],
  [['psykolog'],                     ['Individuel terapi', 'Parterapi', 'Angstbehandling', 'Depression', 'Stressbehandling', 'Børn & Unge']],
  [['kiropraktor'],                  ['Rygbehandling', 'Nakkesmerter', 'Sportsskader', 'Graviditetsbehandling', 'Akupunktur', 'Scandicare']],
  [['fitness','gym'],                ['Styrketræning', 'Cardio', 'Personlig træner', 'Gruppehold', 'Ernæringsvejledning', 'Crossfit']],
  [['yoga'],                         ['Hatha Yoga', 'Vinyasa', 'Yin Yoga', 'Meditationskurser', 'Privattimer', 'Onlinehold']],
  [['restaurant','café','bakery','bageri','pizzeria'],
                                     ['Morgenmad', 'Frokost', 'Aftensmad', 'Takeaway', 'Catering', 'Selskaber']],
  [['advokat','juridisk'],           ['Familieretssager', 'Erhvervsret', 'Arv & Testamente', 'Købekontrakter', 'Strafferet', 'Inkasso']],
  [['revisor','bogholder'],          ['Årsregnskab', 'Moms & Skat', 'Lønadministration', 'Rådgivning', 'Startup-hjælp', 'Selskabsstiftelse']],
  [['bureau','seo','marketing','webbureau'],
                                     ['SEO & SEM', 'Webdesign', 'Social Media', 'Contentmarketing', 'Google Ads', 'Email-marketing']],
  [['frisør','hår'],                 ['Klipning', 'Farvning', 'Highlights', 'Behandlinger', 'Brud & Event', 'Barbering']],
  [['skønhed','klinik','neglestudio','spa'],
                                     ['Negle', 'Vippeextensions', 'Bryn & Vippeløft', 'Ansigtsbehandling', 'Hudpleje', 'Laserbehandling']],
  [['rengøring'],                    ['Hjemmerengøring', 'Erhvervsrengøring', 'Vinduespolering', 'Flytning', 'Trappevask', 'Sæsonrengøring']],
  [['ejendoms','mægler'],            ['Salg af bolig', 'Boligvurdering', 'Køberrådgivning', 'Udlejning', 'Erhvervsejendomme', 'Markedsanalyse']],
  [['arkitekt'],                     ['Nybyggeri', 'Tilbygning', 'Ombygning', 'Byggesagsbehandling', 'Visualisering', 'Energirenovering']],
  [['dyrlæge','veterinær'],          ['Vacciner', 'Kastration', 'Operationer', 'Tandrens', 'Blodprøver', 'Husdyrspasning']],
  [['saas','startup','it-konsulent','software'],
                                     ['Produktudvikling', 'API-integration', 'Cloud-opsætning', 'DevOps', 'UI/UX Design', 'Tech-strategi']],
  [['hotel','b&b','ferieudlejning'], ['Overnatning', 'Morgenmad', 'Mødelokaler', 'Events', 'Langstidsophold', 'Privat parkering']],
];

function getSuggestions(type: string): string[] {
  const lower = type.toLowerCase();
  for (const [keys, services] of SERVICE_MAP) {
    if (keys.some(k => lower.includes(k))) return services;
  }
  return [];
}

const USP_CHIPS = [
  { id: 'authorized',   label: 'Autoriseret',         kw: 'autoriseret',                       icon: '✓' },
  { id: 'insured',      label: 'Fuldt forsikret',      kw: 'fuldt forsikret',                   icon: '🛡' },
  { id: '24h',          label: '24/7 service',         kw: '24/7 service',                      icon: '⏰' },
  { id: 'emergency',    label: 'Akutudrykning',        kw: 'akutudrykning',                     icon: '⚡' },
  { id: 'free-quote',   label: 'Gratis tilbud',        kw: 'gratis og uforpligtende tilbud',    icon: '💬' },
  { id: 'online-book',  label: 'Online booking',       kw: 'online booking',                    icon: '📅' },
  { id: 'top-rated',    label: 'Topbedømt',            kw: 'topbedømt på Google',               icon: '⭐' },
  { id: 'local',        label: 'Lokalt firma',         kw: 'lokalt ejet firma',                 icon: '📍' },
  { id: 'free-consult', label: 'Gratis konsultation',  kw: 'gratis første konsultation',        icon: '🎁' },
  { id: 'guarantee',    label: 'Tilfredshedsgaranti',  kw: 'tilfredshedsgaranti',               icon: '🏆' },
  { id: 'weekend',      label: 'Åbent weekender',      kw: 'åbent weekender',                   icon: '📆' },
  { id: 'home-visit',   label: 'Hjemmebesøg',          kw: 'hjemmebesøg tilbydes',              icon: '🏠' },
  { id: 'eco',          label: 'Miljøcertificeret',    kw: 'miljøcertificeret',                 icon: '🌱' },
  { id: 'new-clients',  label: 'Nye kunder velkomne',  kw: 'tager imod nye kunder',             icon: '👋' },
];

const STYLE_CHIPS = [
  { id: 'modern',      label: 'Moderne',        kw: 'moderne, digital, frisk',                  seed: 'animated',      dot: '#3B82F6' },
  { id: 'bold',        label: 'Fed & Energisk', kw: 'fed, energisk, dynamisk, kraftfuld',       seed: 'bold',          dot: '#F97316' },
  { id: 'warm',        label: 'Varm & Venlig',  kw: 'varm, venlig, personlig, lokal',           seed: 'warm',          dot: '#F59E0B' },
  { id: 'minimal',     label: 'Minimalistisk',  kw: 'minimalistisk, ren, simpel',               seed: 'minimal',       dot: '#94A3B8' },
  { id: 'premium',     label: 'Premium',        kw: 'premium, eksklusivt, high-end',            seed: 'premium',       dot: '#A1A1AA' },
  { id: 'luxury',      label: 'Luksus',         kw: 'luksus, eksklusiv, elegant, diskret',      seed: 'aurora',        dot: '#A78BFA' },
  { id: 'futurism',    label: 'Futuristisk',    kw: 'futuristisk, neon, cutting-edge',          seed: 'futurism',      dot: '#84CC16' },
  { id: 'glass',       label: 'Glassmorphism',  kw: 'glassmorphism, premium UI, transparent',  seed: 'glassmorphism', dot: '#818CF8' },
  { id: 'cosmic',      label: 'Kosmisk',        kw: 'kosmisk, mørk, stjerner, deep space',     seed: 'cosmic',        dot: '#E879F9' },
];

const SEED_COLORS: Record<string, string> = {
  bold:          'text-orange-400 bg-orange-500/10 border-orange-500/30',
  animated:      'text-blue-400 bg-blue-500/10 border-blue-500/30',
  aurora:        'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'feature-rich':'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  warm:          'text-amber-400 bg-amber-500/10 border-amber-500/30',
  minimal:       'text-slate-400 bg-slate-500/10 border-slate-500/30',
  premium:       'text-zinc-300 bg-zinc-500/10 border-zinc-500/30',
  geometric:     'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  futurism:      'text-lime-400 bg-lime-500/10 border-lime-500/30',
  glassmorphism: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
  cosmic:        'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30',
};

const BLOCK_ICONS: Record<string, string> = {
  hero: '⚡', trust_bar: '🏅', services: '🔧', about: '👥', process: '📋',
  testimonials: '💬', pricing: '💰', faq: '❓', cta_banner: '📣', contact: '✉️',
  stats: '📊', gallery: '🖼️', team: '👤', blog_grid: '📰',
  video: '▶️', map: '📍', logo_cloud: '🤝', comparison: '⚖️',
  promo_banner: '🎉', location_finder: '🗺️', booking_strip: '📅', core_values: '🌟',
};

const BLOCK_LABELS: Record<string, string> = {
  hero: 'Hero', trust_bar: 'Tillidsbånd', services: 'Ydelser', about: 'Om os',
  process: 'Fremgangsmåde', testimonials: 'Anmeldelser', pricing: 'Priser',
  faq: 'FAQ', cta_banner: 'CTA-banner', contact: 'Kontakt', stats: 'Statistikker',
  gallery: 'Galleri', team: 'Team', blog_grid: 'Blog', video: 'Video',
  map: 'Kort', logo_cloud: 'Logoer', comparison: 'Sammenligning',
  promo_banner: 'Promo-banner', location_finder: 'Lokationer',
  booking_strip: 'Booking-strip', core_values: 'Kerneværdier',
};

const PAGE_LABELS: Record<string, string> = {
  '/': 'Forside', '/services': 'Ydelser', '/ydelser': 'Ydelser',
  '/om-os': 'Om os', '/about': 'Om os', '/kontakt': 'Kontakt',
  '/contact': 'Kontakt', '/priser': 'Priser', '/pricing': 'Priser',
  '/blog': 'Blog', '/faq': 'FAQ',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function scopeNote(sc: Scope): string {
  if (sc === 'landing') return 'landing page kun';
  if (sc === 'small')   return '2-3 siders hjemmeside';
  return '';
}

function composeBrief(g: GuidedState): string {
  const parts: string[] = [];

  const locStr = g.type && g.city ? `${g.type} i ${g.city}` : g.type || (g.city ? `Virksomhed i ${g.city}` : '');
  if (locStr) parts.push(g.name ? `${g.name} — ${locStr}` : locStr);

  if (g.services.length > 0)  parts.push(g.services.join(', '));
  const uspKws = g.usps.map(id => USP_CHIPS.find(c => c.id === id)?.kw ?? '').filter(Boolean);
  if (uspKws.length > 0)       parts.push(uspKws.join(', '));
  const styleKws = g.styles.map(id => STYLE_CHIPS.find(c => c.id === id)?.kw ?? '').filter(Boolean);
  if (styleKws.length > 0)     parts.push(styleKws.join(', '));

  if (g.lang !== 'DK')         parts.push(g.lang === 'DE' ? 'Webseite auf Deutsch' : 'Website in English');

  if (g.phone) parts.push(`Tlf: ${g.phone}`);

  return parts.join('. ').replace(/\.\./g, '.').trim();
}

function qualityScore(g: GuidedState): number {
  let s = 0;
  if (g.name)               s += 10;
  if (g.type)               s += 25;
  if (g.city)               s += 15;
  if (g.services.length >= 1) s += 20;
  if (g.services.length >= 3) s += 10;
  if (g.usps.length >= 1)   s += 10;
  if (g.styles.length >= 1) s += 10;
  return Math.min(100, s);
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface GeneratePanelProps {
  templateBrief: string;
  onGenerate: (brief: string, opts: { provider: Provider; enrichBriefAI: boolean }) => void;
  onLoadFile: (path: string) => void;
  generating: boolean;
  genPhase: 1 | 2;
  genSeed: string;
  genStatus: string;
  genLog: LogEntry[];
  genPageCount: number;
  genError: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

const EMPTY: GuidedState = { name: '', phone: '', type: '', city: '', services: [], usps: [], styles: [], lang: 'DK' };

export default function GeneratePanel({
  templateBrief, onGenerate, onLoadFile,
  generating, genPhase, genSeed, genStatus, genLog, genPageCount, genError,
}: GeneratePanelProps) {
  const [mode, setMode]         = useState<Mode>('guided');
  const [guided, setGuided]     = useState<GuidedState>(EMPTY);
  const [freetext, setFreetext] = useState('');
  const [svcInput, setSvcInput] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [scope, setScope]         = useState<Scope>('full');
  const [provider, setProvider]   = useState<Provider>('deepseek');
  const [enrichBrief, setEnrichBrief] = useState(true);
  const [recentBriefs, setRecentBriefs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('wb_recent_briefs') ?? '[]'); } catch { return []; }
  });
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (templateBrief) { setFreetext(templateBrief); setMode('freetext'); }
  }, [templateBrief]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [genLog]);

  const brief = mode === 'guided' ? composeBrief(guided) : freetext;
  const score = qualityScore(guided);

  const predictedSeed = guided.styles.length > 0
    ? (STYLE_CHIPS.find(c => c.id === guided.styles[guided.styles.length - 1])?.seed ?? null)
    : null;

  const typeMatches = guided.type
    ? TYPE_SUGGESTIONS.filter(s => s.toLowerCase().includes(guided.type.toLowerCase()) && s !== guided.type).slice(0, 6)
    : [];

  const svcSuggestions = guided.type
    ? getSuggestions(guided.type).filter(s => !guided.services.includes(s))
    : [];

  function switchToFreetext() {
    const composed = composeBrief(guided);
    if (composed && !freetext) setFreetext(composed);
    setMode('freetext');
  }

  function addService(val: string) {
    const v = val.trim().replace(/,+$/, '');
    if (v && guided.services.length < 8 && !guided.services.includes(v)) {
      setGuided(g => ({ ...g, services: [...g.services, v] }));
    }
    setSvcInput('');
  }

  const set = <K extends keyof GuidedState>(k: K, v: GuidedState[K]) =>
    setGuided(g => ({ ...g, [k]: v }));

  const toggleUSP   = (id: string) => setGuided(g => ({ ...g, usps:   g.usps.includes(id)   ? g.usps.filter(u => u !== id)   : [...g.usps, id] }));
  const toggleStyle = (id: string) => setGuided(g => ({ ...g, styles: g.styles.includes(id) ? g.styles.filter(s => s !== id) : [...g.styles, id] }));

  const hasAny = guided.type || guided.city || guided.name;

  // Quality steps
  const steps = [
    { done: !!guided.type,               label: 'Virksomhedstype' },
    { done: !!guided.city,               label: 'By / Region' },
    { done: guided.services.length >= 1, label: 'Ydelser tilføjet' },
    { done: guided.usps.length >= 1,     label: 'USP valgt' },
    { done: guided.styles.length >= 1,   label: 'Stil valgt' },
  ];
  const doneCount = steps.filter(s => s.done).length;

  const input = 'w-full px-3 py-2.5 text-sm bg-slate-800/80 border border-white/[0.07] rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500/30 transition-all';
  const label = 'block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest';

  return (
    <div className="w-[340px] shrink-0 bg-slate-900 border-l border-white/[0.06] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">Generer website</h2>
            <p className="text-[11px] text-slate-600 mt-0.5">AI bygger hele sitet fra din beskrivelse</p>
          </div>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            {(['DK','DE','EN'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => set('lang', l)}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                  guided.lang === l
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-600 hover:text-slate-400 border border-transparent'
                }`}
              >{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex shrink-0 border-b border-white/[0.06]">
        <button onClick={() => setMode('guided')}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${mode === 'guided' ? 'text-blue-400 border-b-2 border-blue-500 -mb-px bg-blue-500/[0.04]' : 'text-slate-500 hover:text-slate-300'}`}>
          ✦ Guidet
        </button>
        <button onClick={switchToFreetext}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${mode === 'freetext' ? 'text-blue-400 border-b-2 border-blue-500 -mb-px bg-blue-500/[0.04]' : 'text-slate-500 hover:text-slate-300'}`}>
          ✎ Fritekst
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* ── Guided ── */}
        {mode === 'guided' && (
          <div className="px-4 py-4 space-y-4">

            {/* Name + Phone row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={label}>Firmanavn</label>
                <input value={guided.name} onChange={e => set('name', e.target.value)}
                  placeholder="Hansen VVS" className={input} />
              </div>
              <div>
                <label className={label}>Telefon</label>
                <input value={guided.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="12 34 56 78" className={input} />
              </div>
            </div>

            {/* Business type */}
            <div className="relative">
              <label className={label}>Virksomhedstype <span className="text-red-500/70">*</span></label>
              <input
                value={guided.type}
                onChange={e => { set('type', e.target.value); setTypeOpen(true); }}
                onFocus={() => setTypeOpen(true)}
                onBlur={() => setTimeout(() => setTypeOpen(false), 160)}
                placeholder="Tandlæge, Elektriker, Startup…"
                className={input}
              />
              {typeOpen && typeMatches.length > 0 && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-slate-800 border border-white/[0.12] rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                  {typeMatches.map(s => (
                    <button key={s} onMouseDown={() => { set('type', s); setTypeOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-[13px] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City */}
            <div>
              <label className={label}>By / Region <span className="text-red-500/70">*</span></label>
              <input value={guided.city} onChange={e => set('city', e.target.value)}
                placeholder="København, Aarhus, Berlin…" className={input} />
            </div>

            {/* Services */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`${label} mb-0`}>Ydelser & Specialer</label>
                {guided.services.length > 0 && (
                  <span className="text-[9px] text-slate-700 font-mono">{guided.services.length}/8</span>
                )}
              </div>

              {/* Added services */}
              {guided.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {guided.services.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] rounded-full">
                      {s}
                      <button onClick={() => setGuided(g => ({ ...g, services: g.services.filter(x => x !== s) }))}
                        className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-500/30 transition-colors text-[11px] text-blue-400 hover:text-white">×</button>
                    </span>
                  ))}
                </div>
              )}

              <input
                value={svcInput}
                onChange={e => setSvcInput(e.target.value)}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ',') && svcInput.trim()) { e.preventDefault(); addService(svcInput); }
                  if (e.key === 'Backspace' && !svcInput && guided.services.length > 0)
                    setGuided(g => ({ ...g, services: g.services.slice(0, -1) }));
                }}
                onBlur={() => svcInput.trim() && addService(svcInput)}
                placeholder={guided.services.length === 0 ? 'Skriv ydelse og tryk Enter…' : '+ Tilføj endnu en…'}
                disabled={guided.services.length >= 8}
                className={`${input} disabled:opacity-30 disabled:cursor-not-allowed`}
              />

              {/* Dynamic suggestions */}
              {svcSuggestions.length > 0 && guided.services.length < 8 && (
                <div className="mt-2">
                  <p className="text-[9px] text-slate-700 mb-1.5 uppercase tracking-widest font-bold">Forslag</p>
                  <div className="flex flex-wrap gap-1">
                    {svcSuggestions.slice(0, 6).map(s => (
                      <button key={s} onClick={() => addService(s)}
                        className="text-[11px] px-2.5 py-0.5 bg-slate-800 border border-white/[0.07] text-slate-500 hover:text-slate-200 hover:border-white/20 rounded-full transition-all">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* USP chips */}
            <div>
              <label className={label}>Fordele & USP</label>
              <div className="flex flex-wrap gap-1.5">
                {USP_CHIPS.map(chip => {
                  const on = guided.usps.includes(chip.id);
                  return (
                    <button key={chip.id} onClick={() => toggleUSP(chip.id)}
                      className={`px-2.5 py-1 text-[11px] rounded-full border transition-all ${
                        on ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                           : 'border-white/[0.07] text-slate-500 hover:border-white/[0.15] hover:text-slate-300'
                      }`}>
                      {on ? '✓ ' : ''}{chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Style chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`${label} mb-0`}>Visuel stil</label>
                {predictedSeed && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${SEED_COLORS[predictedSeed] ?? 'text-slate-400 bg-slate-700 border-slate-600'}`}>
                    {predictedSeed}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {STYLE_CHIPS.map(chip => {
                  const on = guided.styles.includes(chip.id);
                  return (
                    <button key={chip.id} onClick={() => toggleStyle(chip.id)}
                      className={`relative flex items-center gap-2 px-2.5 py-2 text-[11px] rounded-xl border transition-all text-left ${
                        on ? 'border-white/20 bg-white/[0.05] text-white'
                           : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12] hover:text-slate-300'
                      }`}>
                      <span className="w-2 h-2 rounded-full shrink-0 flex-none" style={{ backgroundColor: chip.dot, opacity: on ? 1 : 0.4 }} />
                      <span className="leading-tight">{chip.label}</span>
                      {on && <span className="ml-auto text-[9px] text-white/40">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality checklist */}
            {hasAny && (
              <div className="rounded-xl border border-white/[0.06] bg-slate-800/30 p-3 space-y-1.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brief kvalitet</span>
                  <span className={`text-[10px] font-bold ${doneCount >= 4 ? 'text-emerald-400' : doneCount >= 2 ? 'text-amber-400' : 'text-red-400/70'}`}>
                    {doneCount >= 4 ? 'Stærk' : doneCount >= 2 ? 'God' : 'Svag'}
                  </span>
                </div>
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      step.done ? 'bg-emerald-500/20 border border-emerald-500/40' : 'border border-white/[0.08]'
                    }`}>
                      {step.done
                        ? <svg className="w-2 h-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                        : <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]" />
                      }
                    </div>
                    <span className={`text-[11px] ${step.done ? 'text-slate-400' : 'text-slate-700'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ── Freetext ── */}
        {mode === 'freetext' && (
          <div className="px-4 py-4">
            <label className={label}>Virksomhedsbeskrivelse</label>
            <textarea
              value={freetext}
              onChange={e => setFreetext(e.target.value)}
              placeholder={"Hansen VVS i København, akutservice, autoriseret, premium\n\nElektriker i Aarhus, solceller, ladestander\n\nFitnesscenter, crossfit, personlig træner"}
              rows={10}
              disabled={generating}
              className={`${input} resize-none`}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[10px] text-slate-700">Jo mere kontekst, jo bedre AI-resultat</p>
              <span className={`text-[10px] font-mono tabular-nums ${freetext.length > 800 ? 'text-amber-500' : 'text-slate-700'}`}>{freetext.length}</span>
            </div>
          </div>
        )}

      </div>

      {/* ── Bottom: progress + button ── */}
      <div className="px-4 py-4 border-t border-white/[0.06] space-y-3 shrink-0">

        {/* Generation log */}
        {generating && (
          <div className="rounded-xl border border-white/[0.07] bg-slate-800/60 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-800/80 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-blue-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <span className="text-[11px] font-bold text-white">Fase {genPhase}/2</span>
                <span className="text-[10px] text-slate-500">— {genPhase === 1 ? 'Sitestruktur' : 'Sideindhold'}</span>
              </div>
              {genSeed && (
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${SEED_COLORS[genSeed] ?? 'text-slate-400 bg-slate-700 border-slate-600'}`}>
                  {genSeed}
                </span>
              )}
            </div>
            <div className="px-3 py-1.5 border-b border-white/[0.04]">
              <p className="text-[10px] text-slate-400 truncate">{genStatus}</p>
            </div>
            {genPhase === 1 && (
              <div className="px-3 py-2.5 space-y-1.5">
                {['Analyserer virksomhedsbeskrivelse', 'Vælger tema, farver og skrifttype', 'Planlægger sider og blokplan'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-blue-500/40 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-slate-500">{step}</span>
                  </div>
                ))}
              </div>
            )}
            {genPhase === 2 && genLog.length > 0 && (
              <div ref={logRef} className="px-3 py-2 max-h-40 overflow-y-auto space-y-px">
                {genLog.map((entry, i) => {
                  if (entry.kind === 'page') {
                    return (
                      <div key={i} className={`flex items-center gap-2 ${i > 0 ? 'mt-2' : ''} mb-0.5`}>
                        <span className="text-[10px]">📄</span>
                        <span className="text-[11px] font-bold text-slate-200">{PAGE_LABELS[entry.slug] ?? entry.slug}</span>
                      </div>
                    );
                  }
                  const isNewest = i === genLog.length - 1;
                  return (
                    <div key={i} className={`flex items-center gap-2 pl-4 py-0.5 rounded ${isNewest ? 'bg-blue-500/[0.06]' : ''}`}>
                      <span className="text-[11px]">{BLOCK_ICONS[entry.blockType] ?? '▪'}</span>
                      <span className={`text-[10px] ${isNewest ? 'text-blue-300' : 'text-slate-600'}`}>
                        {BLOCK_LABELS[entry.blockType] ?? entry.blockType.replace(/_/g, ' ')}
                      </span>
                      {isNewest && (
                        <svg className="ml-auto w-2.5 h-2.5 text-blue-500 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="px-3 py-1.5 border-t border-white/[0.04] flex items-center gap-3 bg-slate-800/40">
              <span className="text-[10px] text-slate-700">{genPageCount > 0 ? `${genPageCount} sider` : 'Forbereder…'}</span>
              {genLog.filter(e => e.kind === 'block').length > 0 && (
                <span className="text-[10px] text-slate-700">{genLog.filter(e => e.kind === 'block').length} blokke</span>
              )}
            </div>
          </div>
        )}

        {genError && (
          <div className="px-3 py-2.5 bg-red-900/20 border border-red-800/40 text-red-400 text-[11px] rounded-xl leading-relaxed">
            {genError}
          </div>
        )}

        {/* Scope selector — always visible */}
        {!generating && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Omfang</span>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                ['landing', '1 side',   '🎯'],
                ['small',   '2–3 sider', '📄'],
                ['full',    '5+ sider',  '🌐'],
              ] as [Scope, string, string][]).map(([val, sub, icon]) => (
                <button key={val} onClick={() => setScope(val)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    scope === val
                      ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                      : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12] hover:text-slate-300'
                  }`}>
                  <div className="text-base leading-none mb-1">{icon}</div>
                  <div className="text-[11px] font-semibold leading-tight">{val === 'landing' ? 'Landing' : val === 'small' ? 'Lille' : 'Fuld'}</div>
                  <div className="text-[9px] text-slate-600 mt-0.5">{sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Provider selector */}
        {!generating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI-model</span>
              <button
                onClick={() => setEnrichBrief(v => !v)}
                className={`flex items-center gap-1.5 text-[10px] font-semibold rounded-full px-2 py-0.5 border transition-all ${
                  enrichBrief
                    ? 'bg-violet-500/10 border-violet-500/25 text-violet-300'
                    : 'border-white/[0.06] text-slate-600 hover:text-slate-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${enrichBrief ? 'bg-violet-400' : 'bg-slate-700'}`} />
                Berig brief
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.entries(PROVIDER_META) as [Provider, typeof PROVIDER_META[Provider]][]).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setProvider(key)}
                  className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                    provider === key
                      ? 'border-white/20 bg-white/[0.05]'
                      : 'border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <div className={`text-[11px] font-bold leading-tight ${provider === key ? meta.color : 'text-slate-500'}`}>{meta.label}</div>
                  <div className="text-[9px] text-slate-700 mt-0.5">{meta.costTag}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent briefs */}
        {!generating && recentBriefs.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seneste briefs</span>
            <div className="flex flex-col gap-1">
              {recentBriefs.map((b, i) => (
                <button key={i} onClick={() => { setFreetext(b); setMode('freetext'); }}
                  className="text-left text-[11px] text-slate-500 hover:text-slate-300 truncate px-2.5 py-1.5 bg-slate-800/60 border border-white/[0.05] rounded-lg hover:border-white/[0.12] transition-all">
                  {b.length > 65 ? b.slice(0, 65) + '…' : b}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (!brief.trim()) return;
            const note = scopeNote(scope);
            const finalBrief = note ? `${brief.trim()}. ${note}` : brief.trim();
            const updated = [brief.trim(), ...recentBriefs.filter(b => b !== brief.trim())].slice(0, 5);
            setRecentBriefs(updated);
            localStorage.setItem('wb_recent_briefs', JSON.stringify(updated));
            onGenerate(finalBrief, { provider, enrichBriefAI: enrichBrief });
          }}
          disabled={generating || !brief.trim()}
          className={`w-full py-3 text-sm font-bold rounded-xl transition-all shadow-lg ${
            brief.trim() && !generating
              ? 'bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white shadow-blue-950/50'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {generating ? 'Genererer…' : '✨ Generer Website'}
        </button>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px bg-white/[0.04]" />
            <span className="text-[10px] text-slate-700">eller åbn eksisterende</span>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>
          <input
            type="text"
            placeholder="C:\...\site.json"
            className="w-full px-3 py-2 text-xs bg-slate-800/60 border border-white/[0.06] rounded-xl text-slate-400 placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const v = (e.target as HTMLInputElement).value.trim();
                if (v) onLoadFile(v);
              }
            }}
          />
        </div>

      </div>
    </div>
  );
}
