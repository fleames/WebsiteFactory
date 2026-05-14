import { useEffect, useRef, useState } from 'react';
import { inputCls } from './components/Inspector';
import { useStore } from './store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonVal = string | number | boolean | null | any[] | Record<string, any>;

interface AiContext {
  blockType: string;
  blockData: Record<string, JsonVal>;
}

interface Props {
  data: Record<string, JsonVal>;
  onChange: (key: string, value: JsonVal) => void;
  aiContext?: AiContext;
}

const MULTILINE_KEYS = new Set(['body', 'subtext', 'description', 'text', 'answer', 'bio', 'tagline', 'summary', 'excerpt']);
const IMAGE_KEYS = new Set(['image', 'src', 'photo', 'logo', 'img', 'thumbnail', 'cover', 'imageUrl', 'photoUrl']);

const FIELD_SUGGESTIONS: Record<string, string[]> = {
  city:        ['København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Herning', 'Helsingør', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg', 'Køge', 'Slagelse', 'Hillerød', 'Holbæk'],
  country:     ['Danmark', 'Sverige', 'Norge', 'Finland', 'Tyskland', 'England', 'USA'],
  currency:    ['DKK', 'EUR', 'USD', 'SEK', 'NOK'],
  language:    ['Dansk', 'Engelsk', 'Tysk', 'Norsk', 'Svensk'],
  cta:         ['Kontakt os', 'Book nu', 'Få et tilbud', 'Ring nu', 'Læs mere', 'Kom i gang', 'Se priser', 'Gratis konsultation', 'Book gratis', 'Se ledige tider'],
  buttontext:  ['Kontakt os', 'Book nu', 'Få et tilbud', 'Ring nu', 'Læs mere', 'Se priser', 'Kom i gang'],
  ctatext:     ['Kontakt os', 'Book nu', 'Få et tilbud', 'Ring nu', 'Se mere', 'Kom i gang', 'Gratis konsultation'],
  label:       ['Navn', 'Email', 'Telefon', 'Besked', 'By', 'Postnummer', 'Adresse', 'Virksomhed', 'Dato', 'Emne'],
  placeholder: ['Dit navn', 'Din email', 'Din besked', 'Valgfrit', 'Skriv her…', 'f.eks. København'],
  icon:        ['⚡', '🔧', '💎', '✓', '→', '★', '🏆', '🛡️', '💡', '🎯', '🔑', '📞', '📍', '✉️', '🚀', '🔒', '💪', '⭐', '🌟', '🤝'],
  industry:    ['Håndværk', 'Advokat', 'Tandlæge', 'Revisor', 'IT & Tech', 'Marketing', 'Byg & Anlæg', 'Transport', 'Rengøring', 'Frisør', 'Ejendomsmægler', 'Fysioterapi'],
  zip:         ['1000 KBH K', '2000 Frederiksberg', '2100 KBH Ø', '2200 KBH N', '2300 KBH S', '2400 KBH NV', '2600 Glostrup', '2800 Lyngby', '8000 Aarhus C', '5000 Odense C', '9000 Aalborg'],
  hours:       ['Man–Fre 8–16', 'Man–Fre 8–17', 'Man–Fre 9–17', 'Man–Fre 7–15', 'Man–Tor 8–17, Fre 8–15', 'Alle dage 8–22', 'Man–Søn 24/7'],
  day:         ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'],
  region:      ['Hovedstaden', 'Sjælland', 'Fyn', 'Jylland', 'Nordjylland', 'Midtjylland', 'Syddanmark', 'Bornholm'],
  unit:        ['kr.', 'DKK', 'EUR', 'USD', '%', 'stk', 'timer', 'dage', 'måneder'],
  period:      ['pr. måned', 'pr. år', 'pr. time', 'pr. dag', 'engangsbeløb', 'fra'],
  badge:       ['Ny', 'Populær', 'Anbefalet', 'Bedst valuta', 'Tilbud', 'Gratis', 'Premium', 'Eksklusiv'],
  tag:         ['Ny', 'Hot', 'Sale', 'Populær', 'Anbefalet', 'Eksklusiv'],
};

function getFieldSuggestions(fieldKey: string): string[] {
  const lower = fieldKey.toLowerCase();
  for (const [pattern, suggs] of Object.entries(FIELD_SUGGESTIONS)) {
    if (lower === pattern || lower.endsWith(pattern)) return suggs;
  }
  return [];
}

export default function DataEditor({ data, onChange, aiContext }: Props) {
  return (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <FieldRow
          key={key}
          fieldKey={key}
          value={value}
          onChange={v => onChange(key, v)}
          aiContext={aiContext}
        />
      ))}
    </div>
  );
}

function isAiableField(fieldKey: string, value: JsonVal): boolean {
  if (typeof value === 'string') {
    const isColor = fieldKey.toLowerCase().includes('color') || /^#[0-9a-f]{3,6}$/i.test(value);
    const isUrl = fieldKey === 'href' || fieldKey === 'link' || fieldKey.endsWith('Url') || fieldKey.endsWith('url');
    const isImage = IMAGE_KEYS.has(fieldKey) || fieldKey.toLowerCase().includes('image');
    return !isColor && !isUrl && !isImage;
  }
  if (Array.isArray(value) && value.every(v => typeof v === 'string')) return true;
  return false;
}

function FieldRow({ fieldKey, value, onChange, aiContext }: {
  fieldKey: string;
  value: JsonVal;
  onChange: (v: JsonVal) => void;
  aiContext?: AiContext;
}) {
  const { site } = useStore();
  const [aiLoading, setAiLoading] = useState(false);

  const label = fieldKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());

  const canAi = !!aiContext && isAiableField(fieldKey, value);

  const handleAi = async () => {
    if (!aiContext || !site) return;
    setAiLoading(true);
    try {
      const r = await fetch('/api/ai-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site,
          blockType: aiContext.blockType,
          fieldName: fieldKey,
          fieldLabel: label,
          blockData: aiContext.blockData,
        }),
      });
      if (r.ok) {
        const d = await r.json() as { value: JsonVal };
        onChange(d.value);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const suggestions = getFieldSuggestions(fieldKey);
  const isStr = typeof value === 'string';
  const isColor = isStr && (fieldKey.toLowerCase().includes('color') || /^#[0-9a-f]{3,6}$/i.test(value as string));
  const isImage = isStr && (IMAGE_KEYS.has(fieldKey) || fieldKey.toLowerCase().includes('image'));
  const isUrl = isStr && (fieldKey === 'href' || fieldKey === 'link' || fieldKey.endsWith('Url') || fieldKey.endsWith('url'));
  const showSuggestions = suggestions.length > 0 && isStr && !isColor && !isImage && !isUrl;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-500 capitalize">{label}</div>
        {canAi && (
          <button
            onClick={handleAi}
            disabled={aiLoading}
            title="Generer med AI"
            className="w-4 h-4 flex items-center justify-center text-[9px] text-violet-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors disabled:opacity-40"
          >
            {aiLoading ? '⟳' : '✦'}
          </button>
        )}
      </div>
      <ValueEditor fieldKey={fieldKey} value={value} onChange={onChange} />
      {showSuggestions && (
        <div className="flex gap-1 mt-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => onChange(s)}
              className="shrink-0 px-1.5 py-0.5 text-[10px] rounded-md border border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ValueEditor({ fieldKey, value, onChange }: {
  fieldKey: string;
  value: JsonVal;
  onChange: (v: JsonVal) => void;
}) {
  // null / undefined — skip
  if (value === null || value === undefined) return null;

  // Boolean
  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={e => onChange(e.target.checked)}
          className="w-3.5 h-3.5 accent-blue-500"
        />
        <span className="text-xs text-slate-600">{value ? 'Yes' : 'No'}</span>
      </label>
    );
  }

  // Number
  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={inputCls}
      />
    );
  }

  // String
  if (typeof value === 'string') {
    const isMultiline = MULTILINE_KEYS.has(fieldKey);
    const isColor = fieldKey.toLowerCase().includes('color') || /^#[0-9a-f]{3,6}$/i.test(value);
    const isUrl = fieldKey === 'href' || fieldKey === 'link' || fieldKey.endsWith('Url') || fieldKey.endsWith('url');
    const isImage = IMAGE_KEYS.has(fieldKey) || fieldKey.toLowerCase().includes('image');

    if (isColor) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value.startsWith('#') ? value : '#000000'}
            onChange={e => onChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-slate-200"
          />
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`${inputCls} flex-1`}
          />
        </div>
      );
    }

    if (isImage) {
      return <ImageField value={value} onChange={onChange} />;
    }

    if (isMultiline) {
      return (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
        />
      );
    }

    return (
      <input
        type={isUrl ? 'url' : 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={inputCls}
      />
    );
  }

  // Array of strings
  if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
    return (
      <textarea
        value={(value as string[]).join('\n')}
        onChange={e => onChange(e.target.value ? e.target.value.split('\n') : [])}
        rows={Math.min((value as string[]).length + 1, 6)}
        className={`${inputCls} resize-none font-mono text-[11px]`}
        placeholder="Ét element per linje"
      />
    );
  }

  // Array of objects
  if (Array.isArray(value) && (value.length === 0 || typeof value[0] === 'object')) {
    return (
      <ItemListEditor
        items={value as Record<string, JsonVal>[]}
        onChange={onChange}
      />
    );
  }

  // Nested object
  if (typeof value === 'object' && !Array.isArray(value)) {
    return (
      <ObjectEditor data={value as Record<string, JsonVal>} onChange={onChange} />
    );
  }

  return null;
}

function ItemListEditor({ items, onChange }: {
  items: Record<string, JsonVal>[];
  onChange: (v: JsonVal) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const update = (idx: number, key: string, val: JsonVal) => {
    const next = items.map((item, i) => i === idx ? { ...item, [key]: val } : item);
    onChange(next);
  };

  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  const add = () => {
    const template = items[0] ? Object.fromEntries(Object.keys(items[0]).map(k => [k, ''])) : { title: '', description: '' };
    onChange([...items, template]);
    setExpanded(items.length);
  };

  return (
    <div className="space-y-1">
      {items.map((item, idx) => {
        const preview = (item.title ?? item.name ?? item.question ?? item.label ?? `Element ${idx + 1}`) as string;
        const isOpen = expanded === idx;

        return (
          <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setExpanded(isOpen ? null : idx)}
            >
              <span className="text-xs font-medium text-slate-700 truncate">{String(preview).slice(0, 40) || `Element ${idx + 1}`}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={e => { e.stopPropagation(); remove(idx); }}
                  className="w-4 h-4 flex items-center justify-center text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                >✕</button>
                <span className="text-slate-400 text-[10px]">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {isOpen && (
              <div className="px-3 pb-3 border-t border-slate-100 space-y-2.5 pt-2.5 bg-slate-50/50">
                {Object.entries(item).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] text-slate-400 mb-1 capitalize">{k.replace(/_/g, ' ')}</div>
                    <ValueEditor fieldKey={k} value={v} onChange={val => update(idx, k, val)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={add}
        className="w-full py-1.5 text-xs font-medium text-slate-500 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:text-slate-700 transition-colors"
      >
        + Tilføj element
      </button>
    </div>
  );
}

function ObjectEditor({ data, onChange }: {
  data: Record<string, JsonVal>;
  onChange: (v: JsonVal) => void;
}) {
  const update = (key: string, val: JsonVal) => onChange({ ...data, [key]: val });

  return (
    <div className="pl-3 border-l-2 border-slate-100 space-y-2">
      {Object.entries(data).map(([k, v]) => (
        <div key={k}>
          <div className="text-[10px] text-slate-400 mb-1 capitalize">{k.replace(/_/g, ' ')}</div>
          <ValueEditor fieldKey={k} value={v} onChange={val => update(k, val)} />
        </div>
      ))}
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: JsonVal) => void }) {
  const { filePath } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const url = `/api/upload?projectDir=${encodeURIComponent(filePath)}`;
      const r = await fetch(url, { method: 'POST', body: fd });
      const d = await r.json() as { url?: string; error?: string };
      if (d.url) onChange(d.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${inputCls} flex-1`}
          placeholder="/assets/image.jpg"
        />
        <button
          onClick={() => setPickerOpen(true)}
          title="Søg stockbilleder (Unsplash)"
          className="shrink-0 px-2 py-1.5 text-[11px] font-medium rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 text-slate-500 transition-colors"
        >
          🔍
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title="Upload billede"
          className="shrink-0 px-2 py-1.5 text-[11px] font-medium rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50"
        >
          {uploading ? '⟳' : '↑'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {value && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value) && (
        <img
          src={value} alt=""
          className="h-16 rounded-lg object-cover border border-slate-100 bg-slate-50 w-full"
          onError={e => (e.currentTarget.style.display = 'none')}
        />
      )}
      {pickerOpen && (
        <UnsplashPicker
          onSelect={url => { onChange(url); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

// ── Unsplash Picker ───────────────────────────────────────────────────────────

interface UnsplashPhoto {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
}

function UnsplashPicker({ onSelect, onClose }: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const search = async (q: string, pg = 1) => {
    if (!q.trim()) return;
    setLoading(true); setError('');
    try {
      const r = await fetch(`/api/unsplash?q=${encodeURIComponent(q)}&page=${pg}`);
      const d = await r.json() as { results?: UnsplashPhoto[]; error?: string };
      if (d.error) { setError(d.error); return; }
      if (pg === 1) setPhotos(d.results ?? []);
      else setPhotos(prev => [...prev, ...(d.results ?? [])]);
      setPage(pg);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 shrink-0">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') search(query); if (e.key === 'Escape') onClose(); }}
              placeholder="Søg billeder på Unsplash…"
              className="flex-1 bg-transparent text-sm outline-none placeholder-slate-400"
            />
          </div>
          <button
            onClick={() => search(query)}
            disabled={loading || !query.trim()}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors shrink-0"
          >
            {loading ? '…' : 'Søg'}
          </button>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-3">
          {error && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 leading-relaxed">{error}</div>
          )}
          {!error && photos.length === 0 && !loading && (
            <div className="text-center py-10 text-slate-400">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="text-sm">Skriv noget og tryk Søg</div>
              <div className="text-xs mt-1 text-slate-300">Powered by Unsplash</div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            {photos.map(photo => (
              <button
                key={photo.id}
                onClick={() => onSelect(photo.urls.regular)}
                className="relative group rounded-lg overflow-hidden aspect-video bg-slate-100 hover:ring-2 hover:ring-blue-500 transition-all"
                title={`Photo by ${photo.user.name} on Unsplash`}
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description ?? ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                  <div className="w-full px-1.5 py-1 text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent truncate">
                    {photo.user.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {photos.length > 0 && (
            <button
              onClick={() => search(query, page + 1)}
              disabled={loading}
              className="mt-3 w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 border border-dashed border-slate-200 hover:border-slate-300 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Indlæser…' : 'Indlæs flere'}
            </button>
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-100 shrink-0">
          <p className="text-[10px] text-slate-400 text-center">
            Billeder fra <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Unsplash</a> — gratis til erhvervsbrug
          </p>
        </div>
      </div>
    </div>
  );
}
