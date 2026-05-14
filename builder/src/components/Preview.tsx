import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '../store';
import type { Site } from '@schema/types';

const DEBOUNCE_MS = 250;

const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', icon: 'D', width: '100%'  },
  { id: 'tablet',  label: 'Tablet',  icon: 'T', width: '768px' },
  { id: 'mobile',  label: 'Mobil',   icon: 'M', width: '390px' },
] as const;

const ZOOM_LEVELS = [75, 100, 125] as const;

type ViewportId = typeof VIEWPORTS[number]['id'];

export default function Preview() {
  const { site, currentPageSlug, previewKey, selectedBlockId } = useStore();
  const [srcDoc, setSrcDoc]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [viewport, setViewport] = useState<ViewportId>('desktop');
  const [zoom, setZoom]         = useState(100);
  const [showFrame, setShowFrame] = useState(false);
  const [showGrid, setShowGrid]   = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  async function fetchPreview(s: Site, slug: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: s, pageSlug: slug }),
      });
      if (res.ok) {
        setSrcDoc(await res.text());
      } else {
        setError(`Preview fejlede (${res.status})`);
        setSrcDoc('');
      }
    } catch (e) {
      setError(String(e));
      setSrcDoc('');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!site) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchPreview(site, currentPageSlug), DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [site, currentPageSlug, previewKey]);

  useEffect(() => {
    if (!selectedBlockId) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const send = () => iframe.contentWindow?.postMessage({ scrollTo: selectedBlockId }, '*');
    if (loading) {
      iframe.addEventListener('load', send, { once: true });
    } else {
      send();
    }
  }, [selectedBlockId]);

  // Ctrl+Scroll to zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(z => {
      const delta = e.deltaY > 0 ? -25 : 25;
      const next = Math.round((z + delta) / 25) * 25;
      return Math.min(150, Math.max(50, next));
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const vp = VIEWPORTS.find(v => v.id === viewport)!;
  const isNonDesktop = viewport !== 'desktop';

  return (
    <div className="flex-1 flex flex-col bg-slate-800 overflow-hidden">

      {/* Browser chrome toolbar */}
      <div className="h-9 bg-slate-900 border-b border-black/30 flex items-center px-4 gap-3 shrink-0">
        {/* Traffic lights */}
        <div className="flex gap-1.5 items-center shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>

        {/* URL bar */}
        <div className="flex-1 bg-slate-800 rounded-md text-[11px] text-slate-500 px-3 py-1 text-center border border-white/[0.06] truncate">
          {currentPageSlug === '/' ? '/ (forside)' : currentPageSlug}
        </div>

        {/* Grid overlay toggle */}
        <button title={showGrid ? 'Skjul gitter' : 'Vis gitter'}
          onClick={() => setShowGrid(g => !g)}
          className="w-7 h-7 flex items-center justify-center rounded-md transition-all shrink-0"
          style={{
            background: showGrid ? 'rgba(96,165,250,0.15)' : 'transparent',
            color: showGrid ? '#60a5fa' : 'rgba(100,116,139,0.6)',
            border: showGrid ? '1px solid rgba(96,165,250,0.3)' : '1px solid transparent',
          }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16M8 4v16M16 4v16"/>
          </svg>
        </button>

        {/* Device frame toggle (only for non-desktop) */}
        {isNonDesktop && (
          <button title={showFrame ? 'Skjul enhedsramme' : 'Vis enhedsramme'}
            onClick={() => setShowFrame(f => !f)}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-all shrink-0"
            style={{
              background: showFrame ? 'rgba(96,165,250,0.15)' : 'transparent',
              color: showFrame ? '#60a5fa' : 'rgba(100,116,139,0.6)',
              border: showFrame ? '1px solid rgba(96,165,250,0.3)' : '1px solid transparent',
            }}>
            {viewport === 'mobile'
              ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 21l18-2M3 7l18-2M3 14h18M3 10h18"/></svg>
            }
          </button>
        )}

        {/* Zoom */}
        <div className="flex items-center bg-slate-800 rounded-md p-0.5 gap-px border border-white/[0.06] shrink-0">
          {ZOOM_LEVELS.map(z => (
            <button key={z} onClick={() => setZoom(z)}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all ${zoom === z ? 'bg-slate-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}>
              {z}%
            </button>
          ))}
        </div>

        {/* Viewport toggle */}
        <div className="flex items-center bg-slate-800 rounded-md p-0.5 gap-px border border-white/[0.06]">
          {VIEWPORTS.map(v => (
            <button key={v.id} title={v.label} onClick={() => setViewport(v.id)}
              className={`px-2.5 py-0.5 text-[10px] font-bold rounded transition-all ${viewport === v.id ? 'bg-slate-600 text-white' : 'text-slate-600 hover:text-slate-300'}`}>
              {v.icon}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Indlæser…
          </div>
        )}
      </div>

      {/* Preview area */}
      <div ref={containerRef} className="flex-1 overflow-auto p-5 flex justify-center items-start">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-1">Preview fejlede</p>
              <p className="text-xs text-slate-600 max-w-xs">{error}</p>
            </div>
            <button onClick={() => site && fetchPreview(site, currentPageSlug)}
              className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">
              Prøv igen
            </button>
          </div>
        ) : (
          <div
            className="h-full bg-white rounded-lg overflow-hidden transition-all duration-300 shadow-2xl shadow-black/40 origin-top relative"
            style={{
              width: vp.width,
              minWidth: isNonDesktop ? vp.width : undefined,
              transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
              transformOrigin: 'top center',
            }}
          >
            {/* Grid overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none z-10" style={{
                backgroundImage: 'linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />
            )}

            {/* Device frame overlay */}
            {showFrame && isNonDesktop && (
              <div className="absolute inset-0 pointer-events-none z-20" style={viewport === 'mobile' ? {
                border: '10px solid #1a1a1e',
                borderRadius: '44px',
                boxShadow: 'inset 0 0 0 1.5px #3a3a3e, 0 0 0 1px #111',
              } : {
                border: '14px solid #1a1a1e',
                borderRadius: '20px',
                boxShadow: 'inset 0 0 0 1.5px #3a3a3e, 0 0 0 1px #111',
              }} />
            )}

            {srcDoc ? (
              <iframe
                ref={iframeRef}
                srcDoc={srcDoc}
                title="Forhåndsvisning"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3">
                <svg className="w-8 h-8 opacity-40 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <span className="text-sm text-slate-500">{loading ? 'Genererer forhåndsvisning…' : 'Indlæser…'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        {zoom !== 100 && (
          <div className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold"
            style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' }}>
            {zoom}%
          </div>
        )}
      </div>
    </div>
  );
}
