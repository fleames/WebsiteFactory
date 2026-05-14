import { useEffect, useRef } from 'react';
import { BLOCK_META } from '../defaultBlocks';

interface Props {
  onPick: (type: string) => void;
  onClose: () => void;
}

export default function BlockPicker({ onPick, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-slate-900 border border-white/[0.08] rounded-2xl shadow-2xl w-[580px] max-h-[75vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-white">Tilføj blok</h2>
            <p className="text-xs text-slate-500 mt-0.5">Vælg en bloktype at indsætte</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-4 grid grid-cols-2 gap-2">
          {Object.entries(BLOCK_META).map(([type, meta]) => (
            <button
              key={type}
              onClick={() => { onPick(type); onClose(); }}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500/40 text-left transition-all group"
            >
              <span className="text-2xl leading-none mt-0.5 shrink-0">{meta.icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{meta.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{meta.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
