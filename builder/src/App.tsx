import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Folder, LayoutGrid, Zap, Activity, Clock, ChevronRight, ArrowRight, Trash2, Search, X, List } from 'lucide-react';
import { useStore } from './store';
import TopBar from './components/TopBar';
import BlockList from './components/BlockList';
import Preview from './components/Preview';
import Inspector from './components/Inspector';
import GeneratePanel, { type LogEntry } from './components/GeneratePanel';
import type { Site } from '@schema/types';

export default function App() {
  const { site, loadFromApi, loadSite, isDirty } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cmdOpen, setCmdOpen] = useState(false);
  const setCmdOpenRef = useRef(setCmdOpen);
  setCmdOpenRef.current = setCmdOpen;

  useEffect(() => {
    const file = new URLSearchParams(location.search).get('file');
    if (file) {
      setLoading(true);
      loadFromApi(file).catch(e => setError(String(e))).finally(() => setLoading(false));
    }
  }, []);

  // Keyboard shortcuts — uses getState() to avoid stale closures
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const st = useStore.getState();
      if (!st.site) return;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName) ||
        (e.target as HTMLElement).contentEditable === 'true';

      // Always-on shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); st.undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); st.redo(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (st.isDirty) st.saveSite(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setCmdOpenRef.current(v => !v); return; }

      if (isInput) return;

      const { selectedBlockId, currentPageSlug } = st;
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedBlockId) {
        e.preventDefault(); st.copyBlock(currentPageSlug, selectedBlockId); return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && st.copiedBlock) {
        e.preventDefault(); st.pasteBlock(currentPageSlug); return;
      }
      if (!selectedBlockId) return;
      if (e.key === 'Escape') { e.preventDefault(); st.selectBlock(null); return; }
      if (e.key === 'Delete') { e.preventDefault(); if (confirm('Slet blok?')) st.deleteBlock(currentPageSlug, selectedBlockId); return; }
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); st.duplicateBlock(currentPageSlug, selectedBlockId); return; }
      if (e.key === 'h' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); st.toggleBlockHidden(currentPageSlug, selectedBlockId); return; }
      if (e.key === 'ArrowUp' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); st.moveBlock(currentPageSlug, selectedBlockId, 'up'); return; }
      if (e.key === 'ArrowDown' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); st.moveBlock(currentPageSlug, selectedBlockId, 'down'); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-save after 30s of unsaved changes
  useEffect(() => {
    if (!isDirty || !site) return;
    const timer = setTimeout(() => useStore.getState().saveSite(), 30000);
    return () => clearTimeout(timer);
  }, [isDirty, site]);

  if (loading) return <Splash message="Indlæser projekt…" />;
  if (!site) return <Dashboard onOpen={(s, p) => loadSite(s, p)} onLoad={(f) => { setLoading(true); loadFromApi(f).catch(e => setError(String(e))).finally(() => setLoading(false)); }} error={error} />;

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <BlockList />
        <Preview />
        <Inspector />
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}

// ── Command Palette ───────────────────────────────────────────────────────────

const BLOCK_ICONS_CP: Record<string, string> = {
  hero: '⚡', trust_bar: '🏅', services: '🔧', about: '👥', process: '📋',
  testimonials: '💬', pricing: '💰', faq: '❓', cta_banner: '📣', contact: '✉️',
  stats: '📊', gallery: '🖼️', team: '👤', blog_grid: '📰', video: '▶️',
  map: '📍', logo_cloud: '🤝', comparison: '⚖️', promo_banner: '🎉',
  location_finder: '🗺️', booking_strip: '📅', core_values: '🌟',
};

type CmdItem = { id: string; icon: string; label: string; sub?: string; action: () => void };

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { site, currentPageSlug, selectBlock, addBlock, setCurrentPage } = useStore();

  useEffect(() => {
    if (open) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const items = useMemo<CmdItem[]>(() => {
    if (!site) return [];
    const results: CmdItem[] = [];
    const q = query.toLowerCase();

    // Pages
    site.pages.forEach(p => {
      if (!q || p.title.toLowerCase().includes(q) || p.slug.includes(q)) {
        results.push({ id: `page:${p.slug}`, icon: '📄', label: p.title, sub: p.slug,
          action: () => { setCurrentPage(p.slug); onClose(); } });
      }
    });

    // Blocks on current page
    const page = site.pages.find(p => p.slug === currentPageSlug);
    page?.blocks.forEach(b => {
      const label = b.type.replace(/_/g, ' ');
      if (!q || label.includes(q) || b.variant.includes(q)) {
        results.push({ id: `block:${b.id}`, icon: BLOCK_ICONS_CP[b.type] ?? '▪', label, sub: b.variant,
          action: () => { selectBlock(b.id); onClose(); } });
      }
    });

    // Add block quick actions
    Object.entries(BLOCK_ICONS_CP).forEach(([type, icon]) => {
      const label = `Tilføj ${type.replace(/_/g, ' ')}`;
      if (!q || type.includes(q) || label.toLowerCase().includes(q)) {
        results.push({ id: `add:${type}`, icon, label, sub: '+ Tilføj blok',
          action: () => { addBlock(currentPageSlug, type); onClose(); } });
      }
    });

    return results.slice(0, 12);
  }, [query, site, currentPageSlug]);

  useEffect(() => { setCursor(0); }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, items.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); items[cursor]?.action(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, items, cursor]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh]" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-[520px] rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <svg className="w-4 h-4 shrink-0" style={{ color: 'rgba(100,116,139,0.7)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Søg blokke, sider, handlinger…"
            className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder-slate-600"
          />
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(100,116,139,0.6)' }}>ESC</kbd>
        </div>
        <div className="overflow-y-auto max-h-[360px] py-1">
          {items.length === 0 && (
            <div className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(71,85,105,0.8)' }}>Ingen resultater for "{query}"</div>
          )}
          {items.map((item, i) => (
            <button key={item.id} onClick={item.action}
              onMouseEnter={() => setCursor(i)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
              style={{ background: cursor === i ? 'rgba(59,130,246,0.1)' : 'transparent' }}
            >
              <span className="text-base shrink-0 w-6 text-center">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium capitalize truncate" style={{ color: cursor === i ? 'rgba(255,255,255,0.95)' : 'rgba(203,213,225,0.85)' }}>{item.label}</div>
                {item.sub && <div className="text-[10px] font-mono truncate" style={{ color: 'rgba(71,85,105,0.8)' }}>{item.sub}</div>}
              </div>
              {cursor === i && <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }}>↵</kbd>}
            </button>
          ))}
        </div>
        <div className="px-4 py-2.5 flex items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {[['↑↓', 'Naviger'], ['↵', 'Vælg'], ['ESC', 'Luk'], ['⌘K', 'Åbn/luk']].map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5 text-[10px]" style={{ color: 'rgba(71,85,105,0.7)' }}>
              <kbd className="font-mono px-1 py-0.5 rounded text-[9px]" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(100,116,139,0.8)' }}>{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Splash ────────────────────────────────────────────────────────────────────

function Splash({ message }: { message: string }) {
  return (
    <div className="h-screen flex items-center justify-center bg-[#020306] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full" style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 65%)',
        }} />
      </div>
      <div className="relative flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 scale-150 blur-3xl rounded-2xl" style={{ background: 'rgba(59,130,246,0.2)' }} />
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0" style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
            boxShadow: '0 0 40px rgba(59,130,246,0.35), 0 0 80px rgba(124,58,237,0.15)',
          }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" style={{ height: '50%' }} />
          </div>
        </div>
        <div className="flex items-center gap-2.5" style={{ color: 'rgba(100,116,139,0.8)' }}>
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <span className="text-[13px] font-mono tracking-wide">{message}</span>
        </div>
      </div>
    </div>
  );
}

// ── Templates ─────────────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: 'vvs-dk',          emoji: '🔧', label: 'VVS-mester',       country: 'DK', color: '#3B82F6', brief: 'VVS-mester i København. Autoriseret og fuldt forsikret. 24/7 akutudrykning inden for 60 min. 15 års erfaring. Specialer: vandskade, badeværelsesrenovering, gasinstallationer.' },
  { id: 'elektriker-dk',   emoji: '⚡', label: 'Elektriker',        country: 'DK', color: '#F59E0B', brief: 'Autoriseret elektriker i Aarhus. El-installationer privat og erhverv. Ladestandere til elbil, solceller, sikringsskab. Vagtelektriker 24/7.' },
  { id: 'tandlaege-dk',    emoji: '🦷', label: 'Tandlæge',          country: 'DK', color: '#06B6D4', brief: 'Tandlægeklinik i Odense. Familietandlæge med fokus på smertefri behandling. Invisalign, tandblegning, implantater. Tager imod nye patienter. Online booking.' },
  { id: 'gym-dk',          emoji: '💪', label: 'Fitnesscenter',     country: 'DK', color: '#EF4444', brief: 'Moderne fitnesscenter i Aalborg. Styrketræning, cardio, holdtræning (yoga, HIIT, pilates). Personlig træner tilknyttet. Åbent 7 dage om ugen. Første træning gratis.' },
  { id: 'bureau-dk',       emoji: '🚀', label: 'Digitalt bureau',   country: 'DK', color: '#7C3AED', brief: "Digitalt marketingbureau i København. Branding, webdesign, SEO, sociale medier. Hjælper SMV'er med at vokse online. Topbedømt på Google. Gratis strategimøde." },
  { id: 'maler-dk',        emoji: '🎨', label: 'Malerfirma',        country: 'DK', color: '#8B5CF6', brief: 'Malermester i Aalborg. Indendørs og udendørs maling. Facadeistandsættelse, tapet, sparkling. Autoriseret. Gratis tilbud indenfor 24 timer. Lokalt firma siden 2008.' },
  { id: 'rengoring-dk',    emoji: '🧹', label: 'Rengøring',         country: 'DK', color: '#0EA5E9', brief: 'Professionel rengøringsservice i Frederiksberg, København. Erhverv og privat. Svanemærkede midler. Faste hjælpere. Abonnement fra 1.200 kr./uge.' },
  { id: 'restaurant-dk',   emoji: '🍽️', label: 'Restaurant',        country: 'DK', color: '#EA580C', brief: 'Moderne restaurant i Aarhus. Dansk og international køkken. Frokostmenu, à la carte, catering og selskaber. Online bordbooking. Veganske og glutenfrie retter.' },
  { id: 'kloakservice-dk', emoji: '🚿', label: 'Kloakservice',      country: 'DK', color: '#475569', brief: 'Autoriseret kloakservice i Esbjerg. TV-inspektion, rensning, reparation. Akutservice 24/7. Certifikat medfølger ved afsluttet arbejde.' },
  { id: 'advocat-dk',      emoji: '⚖️', label: 'Advokatfirma',      country: 'DK', color: '#1E40AF', brief: 'Advokatfirma i Roskilde. Specialer: erhvervsret, fast ejendom, familieret. Gratis første konsultation. Over 20 års erfaring.' },
  { id: 'frisør-dk',       emoji: '✂️', label: 'Frisørsalon',       country: 'DK', color: '#EC4899', brief: 'Moderne frisørsalon i Aalborg. Klipning, farve, behandlinger for mænd og kvinder. Luksus hårpleje. Online booking. Åben 6 dage om ugen.' },
  { id: 'toemrer-dk',      emoji: '🪚', label: 'Tømrerfirma',       country: 'DK', color: '#92400E', brief: 'Tømrermester i Vejle. Tilbygninger, udestuer, carporte, køkkener, badeværelser. Nybyg og renovering. Autoriseret. 25 års erfaring. Gratis og uforpligtende tilbud.' },
] as const;

// ── Dashboard types ───────────────────────────────────────────────────────────

interface Project {
  filePath: string;
  name: string;
  city: string;
  industry: string;
  pages: number;
  slug: string;
  modifiedAt: string;
  estimatedCostUsd?: number;
  usage?: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number };
  brandColor?: string;
  totalBlocks?: number;
  hasContact?: boolean;
}

type DashView = 'projects' | 'templates';

// ── CSS animations (injected once) ───────────────────────────────────────────

const DASH_CSS = `
  @keyframes wf-scan {
    0%   { transform: translateY(-2px); opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  @keyframes wf-orbit  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
  @keyframes wf-orbitR { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
  @keyframes wf-float  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
  @keyframes wf-blink  { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
  @keyframes wf-pulse  { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
  @keyframes wf-slide  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .wf-scan   { animation: wf-scan 14s linear infinite; }
  .wf-orbit  { animation: wf-orbit  7s linear infinite; }
  .wf-orbitR { animation: wf-orbitR 4.5s linear infinite; }
  .wf-float  { animation: wf-float 5s ease-in-out infinite; }
  .wf-blink  { animation: wf-blink 2.4s ease-in-out infinite; }
  .wf-pulse  { animation: wf-pulse 3s ease-in-out infinite; }
  .wf-slide  { animation: wf-slide 0.35s ease-out both; }
`;

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onOpen, onLoad, error }: {
  onOpen: (site: Site, filePath: string) => void;
  onLoad: (filePath: string) => void;
  error: string;
}) {
  const [projects, setProjects]       = useState<Project[]>([]);
  const [templateBrief, setTemplateBrief] = useState('');
  const [generating, setGenerating]   = useState(false);
  const [genError, setGenError]       = useState('');
  const [genStatus, setGenStatus]     = useState('');
  const [genLog, setGenLog]           = useState<LogEntry[]>([]);
  const [genSeed, setGenSeed]         = useState('');
  const [genPhase, setGenPhase]       = useState<1 | 2>(1);
  const [genPageCount, setGenPageCount] = useState(0);
  const [view, setView]               = useState<DashView>('projects');
  const [search, setSearch]           = useState('');
  const [sortBy, setSortBy]           = useState<'date' | 'name' | 'cost' | 'pages'>('date');
  const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid');
  const [time, setTime]               = useState('');

  const filteredProjects = useMemo(() => {
    let list = [...projects];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'name':  list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'cost':  list.sort((a, b) => (b.estimatedCostUsd ?? 0) - (a.estimatedCostUsd ?? 0)); break;
      case 'pages': list.sort((a, b) => b.pages - a.pages); break;
      default:      list.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt)); break;
    }
    return list;
  }, [projects, search, sortBy]);
  const nodeId = useMemo(() => `WF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, []);

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {});
  }, []);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleGenerate = async (brief: string, opts: { provider: string; enrichBriefAI: boolean } = { provider: 'deepseek', enrichBriefAI: true }) => {
    if (!brief.trim()) return;
    setGenerating(true); setGenError(''); setGenLog([]); setGenSeed('');
    setGenPhase(1); setGenPageCount(0); setGenStatus('Opretter forbindelse til AI…');
    let site: Site | null = null, filePath: string | null = null;
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brief, provider: opts.provider, enrichBriefAI: opts.enrichBriefAI }) });
      if (!res.body) throw new Error('Ingen streaming-respons fra server');
      const reader = res.body.getReader(), decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n'); buffer = parts.pop() ?? '';
        for (const part of parts) {
          if (!part.trim()) continue;
          let event = '', dataStr = '';
          for (const line of part.split('\n')) {
            if (line.startsWith('event: ')) event = line.slice(7).trim();
            if (line.startsWith('data: '))  dataStr = line.slice(6).trim();
          }
          if (!event || !dataStr) continue;
          const payload = JSON.parse(dataStr) as Record<string, unknown>;
          if (event === 'status') {
            const msg = payload.message as string; setGenStatus(msg);
            const m = msg.match(/\(stil:\s*(\S+?)\)/); if (m) setGenSeed(m[1].replace('…','').trim());
            if (msg.includes('sitestruktur')) setGenPhase(1);
            if (msg.includes('side:')) setGenPhase(2);
          }
          if (event === 'page')  { setGenPageCount(c => c + 1); setGenLog(l => [...l, { kind: 'page', slug: payload.slug as string }]); }
          if (event === 'block') setGenLog(l => [...l, { kind: 'block', blockType: payload.blockType as string }]);
          if (event === 'done')  { site = payload.site as Site; toast.success('Site genereret!'); }
          if (event === 'saved') filePath = payload.filePath as string;
          if (event === 'error') throw new Error((payload.message ?? payload.error) as string);
        }
      }
      if (site && filePath) onOpen(site, filePath);
      else throw new Error('Generering afsluttet uden resultat');
    } catch (e) { const msg = String(e); setGenError(msg); toast.error(msg.slice(0, 80)); setGenerating(false); setGenStatus(''); }
  };

  const handleDelete = async (filePath: string) => {
    try {
      const res = await fetch(`/api/project?path=${encodeURIComponent(filePath)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(((await res.json()) as { error: string }).error);
      setProjects(prev => prev.filter(p => p.filePath !== filePath));
      toast.success('Projekt slettet');
    } catch (e) { toast.error(String(e).slice(0, 80)); }
  };

  const handleDuplicate = async (filePath: string) => {
    try {
      const res = await fetch('/api/duplicate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
      if (!res.ok) throw new Error(((await res.json()) as { error: string }).error ?? 'Duplikering fejlede');
      toast.success('Projekt duplikeret');
      fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {});
    } catch (e) { toast.error(String(e).slice(0, 80)); }
  };

  const totalCost   = projects.reduce((s, p) => s + (p.estimatedCostUsd ?? 0), 0);
  const totalTokens = projects.reduce((s, p) => s + (p.usage ? p.usage.inputTokens + p.usage.outputTokens : 0), 0);
  const totalPages  = projects.reduce((s, p) => s + p.pages, 0);

  return (
    <div className="h-screen flex flex-col overflow-hidden relative" style={{ background: '#020306' }}>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#0d1117', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '13px' },
        success: { iconTheme: { primary: '#34D399', secondary: '#0d1117' } },
        error: { iconTheme: { primary: '#F87171', secondary: '#0d1117' } },
      }} />
      <style dangerouslySetInnerHTML={{ __html: DASH_CSS }} />

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.032) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Glow orbs */}
        <div className="absolute -top-64 left-[8%] w-[800px] h-[600px] rounded-full" style={{
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 65%)',
          filter: 'blur(1px)',
        }} />
        <div className="absolute -bottom-48 right-[5%] w-[700px] h-[500px] rounded-full" style={{
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.055) 0%, transparent 65%)',
          filter: 'blur(1px)',
        }} />
        <div className="absolute top-[40%] left-[38%] w-[500px] h-[400px] rounded-full" style={{
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.025) 0%, transparent 65%)',
        }} />
        {/* Scanning line */}
        <div className="wf-scan absolute left-0 right-0 h-px" style={{
          top: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.12) 15%, rgba(147,197,253,0.45) 50%, rgba(59,130,246,0.12) 85%, transparent 100%)',
          boxShadow: '0 0 12px rgba(147,197,253,0.25), 0 0 24px rgba(59,130,246,0.1)',
        }} />
      </div>

      {/* ── System HUD bar ── */}
      <div className="h-[30px] shrink-0 flex items-center px-5 gap-5 relative z-20" style={{
        background: 'rgba(2,3,6,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
      }}>
        <div className="flex items-center gap-2">
          <div className="wf-blink w-[5px] h-[5px] rounded-full" style={{
            background: '#34D399',
            boxShadow: '0 0 6px 2px rgba(52,211,153,0.55)',
          }} />
          <span className="text-[9px] font-mono font-bold tracking-[0.18em]" style={{ color: 'rgba(52,211,153,0.65)' }}>SYS:ONLINE</span>
        </div>
        <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.1)' }}>NODE:{nodeId}</span>
        <span className="text-[9px] font-mono flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.08)' }}>
          <Zap className="w-2.5 h-2.5" />ENGINE:DEEPSEEK-V3
        </span>
        <div className="ml-auto flex items-center gap-5">
          <span className="text-[9px] font-mono flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.08)' }}>
            <Clock className="w-2.5 h-2.5" />UTC+1
          </span>
          <span className="text-[9px] font-mono tabular-nums flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.14)' }}>
            <Activity className="w-2.5 h-2.5" />{time}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden relative z-10">

        {/* ── Sidebar ── */}
        <aside className="w-[204px] shrink-0 flex flex-col relative" style={{
          background: 'linear-gradient(180deg, rgba(6,8,18,0.92) 0%, rgba(4,5,12,0.96) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}>
          {/* Right edge gradient accent */}
          <div className="absolute right-0 inset-y-0 w-px pointer-events-none" style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(96,165,250,0.18) 30%, rgba(167,139,250,0.12) 70%, transparent 100%)',
          }} />
          {/* Top inner glow */}
          <div className="absolute top-0 left-0 right-0 h-36 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 70%)',
          }} />

          {/* Brand */}
          <div className="relative px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-3 mb-3.5">
              <div className="relative w-9 h-9 rounded-[10px] overflow-hidden shrink-0" style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
                boxShadow: '0 0 18px rgba(59,130,246,0.35), 0 0 36px rgba(124,58,237,0.15)',
              }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, transparent 55%)',
                }} />
              </div>
              <div>
                <div className="text-[12px] font-black text-white tracking-tight leading-none">WEBSITE</div>
                <div className="text-[12px] font-black tracking-tight leading-none mt-[3px]" style={{
                  background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>FACTORY</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="wf-blink w-[5px] h-[5px] rounded-full shrink-0" style={{
                background: '#34D399',
                boxShadow: '0 0 5px rgba(52,211,153,0.6)',
              }} />
              <span className="text-[10px] font-mono" style={{ color: 'rgba(71,85,105,0.9)' }}>AI:READY · DeepSeek V3</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="relative flex-1 px-2.5 py-3.5 space-y-1">
            {([
              ['projects',  'Projekter',  projects.length > 0 ? String(projects.length) : null, <Folder className="w-[15px] h-[15px]" />],
              ['templates', 'Skabeloner', String(TEMPLATES.length), <LayoutGrid className="w-[15px] h-[15px]" />],
            ] as [DashView, string, string | null, React.ReactNode][]).map(([v, label, badge, icon]) => {
              const active = view === v;
              return (
                <button key={v} onClick={() => setView(v)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all relative overflow-hidden group"
                  style={{
                    background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(59,130,246,0.14)' : 'transparent'}`,
                    color: active ? '#93C5FD' : 'rgba(100,116,139,0.9)',
                    boxShadow: active ? '0 0 20px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.03)' : 'none',
                  }}
                >
                  {active && (
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full" style={{
                      background: 'linear-gradient(180deg, #60A5FA, #A78BFA)',
                      boxShadow: '0 0 6px rgba(96,165,250,0.5)',
                    }} />
                  )}
                  <span style={{ color: active ? '#60A5FA' : 'rgba(71,85,105,0.8)' }}>{icon}</span>
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md transition-all" style={{
                      background: active ? 'rgba(59,130,246,0.22)' : 'rgba(255,255,255,0.04)',
                      color: active ? '#93C5FD' : 'rgba(71,85,105,0.8)',
                    }}>{badge}</span>
                  )}
                </button>
              );
            })}

            {/* Divider */}
            <div className="my-2 mx-1" style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />

            {/* Quick stats in sidebar */}
            {projects.length > 0 && (
              <div className="px-1 py-2 space-y-2">
                <div className="text-[8px] font-mono font-bold tracking-[0.2em] mb-2" style={{ color: 'rgba(71,85,105,0.6)' }}>STATISTIK</div>
                {[
                  { label: 'Sites', val: String(projects.length), color: '#60A5FA' },
                  { label: 'Tokens', val: fmtTokens(totalTokens), color: '#A78BFA' },
                  { label: 'AI Cost', val: totalCost > 0 ? (totalCost < 0.01 ? `$${totalCost.toFixed(4)}` : `$${totalCost.toFixed(3)}`) : '$0', color: '#34D399' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-mono" style={{ color: 'rgba(71,85,105,0.7)' }}>{item.label}</span>
                    <span className="text-[11px] font-bold font-mono" style={{ color: item.color }}>{item.val}</span>
                  </div>
                ))}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="relative px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-[8px] font-mono" style={{ color: 'rgba(51,65,85,0.7)' }}>v2.0 · {nodeId} · claude-sonnet-4-6</div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Content header */}
          <div className="shrink-0 px-8 pt-6 pb-4 relative">
            <div className="absolute top-0 left-0 right-0 h-px" style={{
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.15), rgba(167,139,250,0.1), transparent)',
            }} />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] font-mono font-bold tracking-[0.22em] mb-1.5" style={{ color: 'rgba(71,85,105,0.7)' }}>
                  {view === 'projects'
                    ? (projects.length > 0 ? `${projects.length} SITES · ${totalPages} SIDER` : 'PROJEKTER')
                    : `${TEMPLATES.length} SKABELONER`}
                </div>
                <h1 className="text-[22px] font-black text-white tracking-tight leading-none">
                  {view === 'projects' ? 'Projekter' : 'Skabeloner'}
                </h1>
              </div>
              {view === 'projects' && projects.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="wf-pulse w-2 h-2 rounded-full" style={{ background: '#34D399', boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} />
                  <span className="text-[10px] font-mono" style={{ color: 'rgba(52,211,153,0.7)' }}>AI KLAR</span>
                </div>
              )}
            </div>
          </div>

          {/* Bento metric cards */}
          {view === 'projects' && projects.length > 0 && (
            <div className="shrink-0 px-8 pb-5 grid grid-cols-4 gap-3">
              <MetricCard label="TOTAL SITES"  value={String(projects.length)}  sub={projects.length > 1 ? `${Math.round(totalPages / projects.length)} sider avg` : `${totalPages} sider`} color="#3B82F6" />
              <MetricCard label="TOTAL SIDER"  value={String(totalPages)}        sub="på tværs af projekter"  color="#8B5CF6" />
              <MetricCard label="AI TOKENS"    value={fmtTokens(totalTokens)}    sub="brugt i alt"            color="#06B6D4" />
              <MetricCard label="AI COST"      value={totalCost > 0 ? (totalCost < 0.01 ? `$${totalCost.toFixed(4)}` : `$${totalCost.toFixed(2)}`) : '$0.000'} sub="estimeret total" color="#10B981" accent />
            </div>
          )}

          {/* Search + Sort + View toolbar */}
          {view === 'projects' && projects.length > 0 && (
            <div className="shrink-0 px-8 pb-4 flex items-center gap-2.5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(148,163,184,0.5)' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Søg navn, by, branche…"
                  className="w-full py-2 rounded-xl text-[12px] text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', paddingLeft: '2.25rem', paddingRight: search ? '2rem' : '0.75rem', color: 'rgba(226,232,240,0.9)', caretColor: '#60A5FA' }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid rgba(96,165,250,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md transition-colors hover:bg-white/10">
                    <X className="w-3 h-3" style={{ color: 'rgba(148,163,184,0.8)' }} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center rounded-xl p-0.5 gap-px shrink-0" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {(['date', 'name', 'cost', 'pages'] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className="px-2.5 py-1.5 rounded-lg text-[9px] font-bold font-mono tracking-wider transition-all"
                    style={{
                      background: sortBy === s ? 'rgba(255,255,255,0.12)' : 'transparent',
                      color: sortBy === s ? 'rgba(255,255,255,1)' : 'rgba(148,163,184,0.7)',
                    }}>
                    {s === 'date' ? 'DATO' : s === 'name' ? 'NAVN' : s === 'cost' ? 'COST' : 'SIDER'}
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center rounded-xl p-0.5 gap-px shrink-0" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {([['grid', LayoutGrid], ['list', List]] as const).map(([m, Icon]) => (
                  <button key={m} onClick={() => setViewMode(m)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{
                      background: viewMode === m ? 'rgba(255,255,255,0.12)' : 'transparent',
                      color: viewMode === m ? 'rgba(255,255,255,1)' : 'rgba(148,163,184,0.6)',
                    }}>
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-[13px]" style={{
                background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(239,68,68,0.18)', color: '#FCA5A5',
              }}>{error}</div>
            )}

            <AnimatePresence mode="wait">
              {/* Projects grid */}
              {view === 'projects' && (
                <motion.div key="projects"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                >
                  {projects.length === 0 ? (
                    <EmptyProjects onTemplates={() => setView('templates')} />
                  ) : filteredProjects.length === 0 ? (
                    <EmptySearch query={search} onClear={() => setSearch('')} />
                  ) : viewMode === 'list' ? (
                    <motion.div className="flex flex-col gap-1.5"
                      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                      initial="hidden" animate="show"
                    >
                      {search && (
                        <div className="text-[9px] font-mono mb-2" style={{ color: 'rgba(71,85,105,0.6)' }}>
                          {filteredProjects.length} RESULTAT{filteredProjects.length !== 1 ? 'ER' : ''}
                        </div>
                      )}
                      {filteredProjects.map(p => (
                        <ProjectRow key={p.filePath} project={p} onClick={() => onLoad(p.filePath)} onDelete={() => handleDelete(p.filePath)} onDuplicate={() => handleDuplicate(p.filePath)} />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div className="grid grid-cols-2 xl:grid-cols-3 gap-4"
                      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                      initial="hidden" animate="show"
                    >
                      {search && (
                        <div className="col-span-full text-[9px] font-mono mb-1" style={{ color: 'rgba(71,85,105,0.6)' }}>
                          {filteredProjects.length} RESULTAT{filteredProjects.length !== 1 ? 'ER' : ''}
                        </div>
                      )}
                      {filteredProjects.map(p => (
                        <ProjectCard key={p.filePath} project={p} onClick={() => onLoad(p.filePath)} onDelete={() => handleDelete(p.filePath)} onDuplicate={() => handleDuplicate(p.filePath)} />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Templates grid */}
              {view === 'templates' && (
                <motion.div key="templates"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div className="grid grid-cols-2 xl:grid-cols-3 gap-3"
                    variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                    initial="hidden" animate="show"
                  >
                    {TEMPLATES.map(t => (
                      <TemplateCard key={t.id} template={t} onClick={() => { setTemplateBrief(t.brief); setView('projects'); }} />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Generate panel */}
        <GeneratePanel
          templateBrief={templateBrief}
          onGenerate={handleGenerate}
          onLoadFile={onLoad}
          generating={generating}
          genPhase={genPhase}
          genSeed={genSeed}
          genStatus={genStatus}
          genLog={genLog}
          genPageCount={genPageCount}
          genError={genError}
        />
      </div>
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color, accent }: {
  label: string; value: string; sub?: string; color: string; accent?: boolean;
}) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: `0 0 30px ${color}18, 0 16px 40px rgba(0,0,0,0.55)` }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        background: 'rgba(7,9,16,0.8)',
        border: `1px solid rgba(255,255,255,0.055)`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <motion.div className="h-[2px]"
        whileHover={{ boxShadow: `0 0 8px ${color}60` }}
        style={{ background: `linear-gradient(90deg, ${color} 0%, ${color}30 60%, transparent 100%)` }} />
      <div className="p-5">
        <div className="text-[8px] font-mono font-bold tracking-[0.22em] mb-3.5 uppercase" style={{ color: 'rgba(100,116,139,0.6)' }}>{label}</div>
        <div className="text-[28px] font-black leading-none tabular-nums" style={{
          color: accent ? color : '#FFFFFF',
          textShadow: `0 0 12px ${color}20`,
          fontVariantNumeric: 'tabular-nums',
        }}>{value}</div>
        {sub && (
          <div className="text-[10px] font-mono mt-2" style={{ color: 'rgba(71,85,105,0.8)' }}>{sub}</div>
        )}
      </div>
    </motion.div>
  );
}

// ── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({ template, onClick }: {
  template: typeof TEMPLATES[number];
  onClick: () => void;
}) {
  const c = template.color;
  return (
    <motion.div
      className="rounded-2xl overflow-hidden cursor-pointer"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, boxShadow: `0 0 32px ${c}18, 0 16px 48px rgba(0,0,0,0.6)` }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      onClick={onClick}
      style={{ padding: '1px', background: 'rgba(255,255,255,0.05)' }}
    >
      <motion.div className="rounded-[15px] overflow-hidden h-full" style={{ background: 'rgba(5,7,12,1)' }}
        whileHover={{ background: 'rgba(6,8,14,0.97)' }}>
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${c} 0%, ${c}40 55%, transparent 100%)` }} />
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <motion.div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              whileHover={{ scale: 1.12, boxShadow: `0 0 20px ${c}30` }}
              style={{ background: `${c}14`, border: `1px solid ${c}28` }}>
              {template.emoji}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white leading-tight">{template.label}</div>
              <div className="text-[10px] mt-0.5 font-semibold font-mono" style={{ color: `${c}90` }}>🇩🇰 DANSK</div>
            </div>
            <motion.div whileHover={{ x: 3 }} style={{ color: 'rgba(71,85,105,0.5)' }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
          <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'rgba(71,85,105,0.7)' }}>{template.brief}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyProjects({ onTemplates }: { onTemplates: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[460px] text-center select-none">
      {/* Orbital rig */}
      <div className="wf-float relative w-36 h-36 mb-8">
        {/* Outer ring */}
        <div className="wf-orbit absolute inset-0 rounded-full" style={{
          border: '1px solid rgba(59,130,246,0.12)',
          boxShadow: 'inset 0 0 20px rgba(59,130,246,0.04)',
        }} />
        {/* Middle ring */}
        <div className="wf-orbitR absolute inset-[14px] rounded-full" style={{
          border: '1px solid rgba(167,139,250,0.15)',
        }} />
        {/* Inner ring */}
        <div className="wf-orbit absolute inset-7 rounded-full" style={{
          border: '1px dashed rgba(6,182,212,0.12)',
          animationDuration: '3s',
        }} />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            <svg className="w-7 h-7" style={{ color: 'rgba(71,85,105,0.8)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
            </svg>
          </div>
        </div>
        {/* Orbiting dot — blue */}
        <div className="wf-orbit absolute inset-0" style={{ animationDuration: '5s' }}>
          <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{
            background: '#60A5FA',
            boxShadow: '0 0 8px 3px rgba(96,165,250,0.45)',
          }} />
        </div>
        {/* Orbiting dot — violet */}
        <div className="wf-orbitR absolute inset-[14px]" style={{ animationDuration: '3.5s' }}>
          <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{
            background: '#A78BFA',
            boxShadow: '0 0 8px 3px rgba(167,139,250,0.45)',
          }} />
        </div>
      </div>

      <div className="text-[9px] font-mono font-bold tracking-[0.22em] mb-2" style={{ color: 'rgba(71,85,105,0.6)' }}>
        INGEN DATA FUNDET
      </div>
      <h3 className="text-[18px] font-black text-white mb-2 leading-tight">Ingen projekter endnu</h3>
      <p className="text-[13px] max-w-xs mb-7 leading-relaxed" style={{ color: 'rgba(100,116,139,0.7)' }}>
        Beskriv en virksomhed i generatoren til højre,<br />eller vælg en skabelon for hurtig start.
      </p>

      <div className="flex items-center gap-3">
        <button onClick={onTemplates}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group"
          style={{
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.18)',
            color: '#93C5FD',
            boxShadow: '0 0 20px rgba(59,130,246,0.06)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(59,130,246,0.14)';
            e.currentTarget.style.boxShadow = '0 0 28px rgba(59,130,246,0.14)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.06)';
          }}
        >
          <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
          </svg>
          Se skabeloner
        </button>
        <span className="text-[11px] font-mono" style={{ color: 'rgba(51,65,85,0.8)' }}>eller skriv i generatoren →</span>
      </div>
    </div>
  );
}

// ── Quality score ─────────────────────────────────────────────────────────────

function qualityScore(p: Project): number {
  let s = 0;
  s += Math.min(p.pages * 8, 24);
  const avg = p.totalBlocks ? Math.ceil(p.totalBlocks / p.pages) : 3;
  s += Math.min(avg * 4, 32);
  if (p.hasContact) s += 20;
  if (p.usage?.inputTokens) s += 14;
  if (p.estimatedCostUsd != null) s += 10;
  return Math.min(Math.round(s), 100);
}

function scoreColor(score: number): string {
  if (score >= 80) return '#34D399';
  if (score >= 60) return '#F59E0B';
  return '#F87171';
}

// ── Empty search state ─────────────────────────────────────────────────────────

function EmptySearch({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[240px] text-center select-none">
      <div className="text-4xl mb-4 opacity-40">🔍</div>
      <div className="text-[13px] mb-1.5" style={{ color: 'rgba(100,116,139,0.8)' }}>
        Ingen projekter matcher{' '}
        <span className="text-white font-semibold">"{query}"</span>
      </div>
      <button onClick={onClear}
        className="text-[11px] font-mono mt-2 underline underline-offset-4 transition-colors"
        style={{ color: 'rgba(96,165,250,0.7)' }}
        onMouseEnter={e => { (e.target as HTMLElement).style.color = 'rgba(96,165,250,1)'; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(96,165,250,0.7)'; }}>
        Ryd søgning
      </button>
    </div>
  );
}

// ── Industry meta ─────────────────────────────────────────────────────────────

const INDUSTRY_META: Record<string, { emoji: string; color: string }> = {
  electrician: { emoji: '⚡', color: '#F59E0B' }, plumber:  { emoji: '🔧', color: '#3B82F6' },
  plumbing:    { emoji: '🔧', color: '#3B82F6' }, dentist:  { emoji: '🦷', color: '#06B6D4' },
  dental:      { emoji: '🦷', color: '#06B6D4' }, doctor:   { emoji: '🏥', color: '#10B981' },
  medical:     { emoji: '🏥', color: '#10B981' }, lawyer:   { emoji: '⚖️', color: '#6366F1' },
  law:         { emoji: '⚖️', color: '#6366F1' }, legal:    { emoji: '⚖️', color: '#6366F1' },
  gym:         { emoji: '💪', color: '#EF4444' }, fitness:  { emoji: '💪', color: '#EF4444' },
  restaurant:  { emoji: '🍽️', color: '#EA580C' }, food:     { emoji: '🍽️', color: '#EA580C' },
  agency:      { emoji: '🚀', color: '#7C3AED' }, marketing:{ emoji: '🚀', color: '#7C3AED' },
  cleaning:    { emoji: '🧹', color: '#0EA5E9' }, cleaner:  { emoji: '🧹', color: '#0EA5E9' },
  roofing:     { emoji: '🏠', color: '#78716C' }, roofer:   { emoji: '🏠', color: '#78716C' },
  construction:{ emoji: '🏗️', color: '#92400E' }, painter:  { emoji: '🎨', color: '#8B5CF6' },
  landscaping: { emoji: '🌿', color: '#22C55E' }, garden:   { emoji: '🌿', color: '#22C55E' },
  hair:        { emoji: '✂️', color: '#EC4899' }, salon:    { emoji: '✂️', color: '#EC4899' },
  default:     { emoji: '🏢', color: '#64748B' },
};

function getMeta(industry: string): { emoji: string; color: string } {
  const lower = industry.toLowerCase();
  for (const [key, meta] of Object.entries(INDUSTRY_META)) {
    if (lower.includes(key)) return meta;
  }
  return INDUSTRY_META.default;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Nu';
  if (mins < 60) return `${mins}m siden`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}t siden`;
  return `${Math.floor(hrs / 24)}d siden`;
}

function fmtCost(usd: number): string {
  if (usd < 0.001) return `<$0.001`;
  if (usd < 0.01)  return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return String(n);
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, onClick, onDelete, onDuplicate }: { project: Project; onClick: () => void; onDelete: () => void; onDuplicate: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const meta  = getMeta(project.industry);
  const c     = project.brandColor ?? meta.color;
  const score = qualityScore(project);
  const sc    = scoreColor(score);
  const totalTokens = project.usage ? project.usage.inputTokens + project.usage.outputTokens : 0;

  return (
    <motion.div
      className="rounded-2xl overflow-hidden cursor-pointer group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: confirming ? 0 : -4, boxShadow: confirming ? 'none' : `0 0 40px ${c}14, 0 20px 56px rgba(0,0,0,0.6)` }}
      whileTap={{ scale: confirming ? 1 : 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={confirming ? () => setConfirming(false) : onClick}
      style={{ padding: '1px', background: confirming ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.054)' }}
    >
      <motion.div className="rounded-[15px] h-full overflow-hidden" style={{ background: 'rgba(5,7,12,1)' }}
        whileHover={{ background: 'rgba(8,10,18,0.97)' }}>

        {/* Colored header band */}
        <div className="relative h-[72px] overflow-hidden" style={{
          background: `linear-gradient(135deg, ${c}22 0%, ${c}08 60%, transparent 100%)`,
        }}>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(${c}2a 1px, transparent 1px)`,
            backgroundSize: '14px 14px',
          }} />
          <div className="absolute -top-10 -left-6 w-36 h-36 rounded-full pointer-events-none" style={{
            background: `radial-gradient(circle, ${c}20 0%, transparent 65%)`,
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{
            background: `linear-gradient(90deg, transparent 0%, ${c}55 35%, ${c}55 65%, transparent 100%)`,
          }} />
          {/* Big emoji */}
          <div className="absolute left-4 bottom-3 text-3xl leading-none select-none">{meta.emoji}</div>
          {/* Score */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-right">
            <div className="text-[26px] font-black tabular-nums leading-none" style={{
              color: sc, textShadow: `0 0 20px ${sc}55`,
            }}>{score}</div>
            <div className="text-[7px] font-mono font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: `${sc}55` }}>score</div>
          </div>
          {/* Cost */}
          {project.estimatedCostUsd != null && (
            <div className="absolute left-[68px] bottom-3 text-[10px] font-bold font-mono" style={{ color: 'rgba(52,211,153,0.7)' }}>
              {fmtCost(project.estimatedCostUsd)}
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Name + meta */}
          <div className="mb-3.5">
            <div className="font-bold text-sm text-white truncate leading-tight">{project.name}</div>
            <div className="text-[10px] mt-0.5 font-mono truncate" style={{ color: 'rgba(100,116,139,0.65)' }}>
              {project.city} · {project.industry}
            </div>
          </div>

          {/* Token usage bar */}
          {project.usage && totalTokens > 0 && (
            <div className="mb-3.5">
              <div className="flex h-1 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ width: `${(project.usage.cacheCreationTokens / totalTokens) * 100}%`, background: 'rgba(96,165,250,0.55)' }} />
                <div style={{ width: `${(project.usage.cacheReadTokens / totalTokens) * 100}%`, background: 'rgba(96,165,250,0.2)' }} />
                <div style={{ width: `${(project.usage.outputTokens / totalTokens) * 100}%`, background: 'rgba(167,139,250,0.55)' }} />
              </div>
              <div className="flex items-center gap-3 text-[9px] font-mono" style={{ color: 'rgba(71,85,105,0.7)' }}>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-sm inline-block" style={{ background: 'rgba(96,165,250,0.55)' }} />
                  {fmtTokens(project.usage.inputTokens)} in
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-sm inline-block" style={{ background: 'rgba(167,139,250,0.55)' }} />
                  {fmtTokens(project.usage.outputTokens)} out
                </span>
                <span className="ml-auto">{fmtTokens(totalTokens)} total</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: 'rgba(71,85,105,0.7)' }}>
            {confirming ? (
              <div className="flex items-center justify-between w-full" onClick={e => e.stopPropagation()}>
                <span className="font-bold" style={{ color: '#F87171' }}>Slet projekt permanent?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(); }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors"
                    style={{ background: 'rgba(239,68,68,0.2)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                    Slet
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setConfirming(false); }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors"
                    style={{ color: 'rgba(100,116,139,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    Annuller
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>{project.pages} side{project.pages !== 1 ? 'r' : ''}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ color: 'rgba(51,65,85,0.8)' }}>{timeAgo(project.modifiedAt)}</span>
                  <button
                    className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500/20"
                    onClick={e => { e.stopPropagation(); onDuplicate(); }}
                    title="Dupliker projekt"
                    style={{ border: '1px solid rgba(96,165,250,0.25)' }}>
                    <svg className="w-3 h-3" style={{ color: '#60A5FA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </button>
                  <button
                    className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                    onClick={e => { e.stopPropagation(); setConfirming(true); }}
                    style={{ border: '1px solid rgba(248,113,113,0.25)' }}>
                    <Trash2 className="w-3 h-3" style={{ color: '#F87171' }} />
                  </button>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ border: `1px solid ${c}40`, background: `${c}15` }}>
                    <ArrowRight className="w-3 h-3" style={{ color: c }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project row (list view) ───────────────────────────────────────────────────

function ProjectRow({ project, onClick, onDelete, onDuplicate }: { project: Project; onClick: () => void; onDelete: () => void; onDuplicate: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const meta  = getMeta(project.industry);
  const c     = project.brandColor ?? meta.color;
  const score = qualityScore(project);
  const sc    = scoreColor(score);

  return (
    <motion.div
      className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer group relative overflow-hidden"
      onClick={confirming ? () => setConfirming(false) : onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ background: 'rgba(255,255,255,0.025)' }}
      style={{ border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Left brand accent */}
      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full opacity-60"
        style={{ background: c }} />

      {/* Emoji */}
      <div className="text-base shrink-0 ml-2">{meta.emoji}</div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white truncate leading-tight">{project.name}</div>
        <div className="text-[10px] font-mono mt-0.5 truncate" style={{ color: 'rgba(71,85,105,0.8)' }}>
          {project.city} · {project.industry}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-5 shrink-0 text-[10px] font-mono">
        <div className="text-center hidden sm:block">
          <div className="font-bold text-white">{project.pages}</div>
          <div style={{ color: 'rgba(71,85,105,0.7)' }}>sider</div>
        </div>
        {project.totalBlocks != null && (
          <div className="text-center hidden md:block">
            <div className="font-bold text-white">{project.totalBlocks}</div>
            <div style={{ color: 'rgba(71,85,105,0.7)' }}>blokke</div>
          </div>
        )}
        <div className="text-center">
          <div className="font-black" style={{ color: sc }}>{score}</div>
          <div style={{ color: 'rgba(71,85,105,0.7)' }}>score</div>
        </div>
        {project.estimatedCostUsd != null && (
          <div className="text-center hidden lg:block">
            <div className="font-bold" style={{ color: '#34D399' }}>{fmtCost(project.estimatedCostUsd)}</div>
            <div style={{ color: 'rgba(71,85,105,0.7)' }}>cost</div>
          </div>
        )}
        <div style={{ color: 'rgba(51,65,85,0.8)' }}>{timeAgo(project.modifiedAt)}</div>
      </div>

      {/* Actions */}
      {confirming ? (
        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
            style={{ background: 'rgba(239,68,68,0.18)', color: '#F87171', border: '1px solid rgba(239,68,68,0.28)' }}>
            Slet
          </button>
          <button onClick={e => { e.stopPropagation(); setConfirming(false); }}
            className="px-2.5 py-1 rounded-lg text-[10px]"
            style={{ color: 'rgba(100,116,139,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            Annuller
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button onClick={e => { e.stopPropagation(); onDuplicate(); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            whileHover={{ background: 'rgba(96,165,250,0.15)' }}
            title="Dupliker projekt"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <svg className="w-3 h-3" style={{ color: '#60A5FA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </motion.button>
          <motion.button onClick={e => { e.stopPropagation(); setConfirming(true); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            whileHover={{ background: 'rgba(239,68,68,0.15)' }}
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <Trash2 className="w-3 h-3" style={{ color: '#F87171' }} />
          </motion.button>
          <motion.div className="w-7 h-7 rounded-lg flex items-center justify-center"
            whileHover={{ background: `${c}20` }}
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <ArrowRight className="w-3 h-3" style={{ color: c }} />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
