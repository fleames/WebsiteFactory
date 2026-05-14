import { create } from 'zustand';
import type { Site, Block, Theme, Globals } from '@schema/types';
import { createBlock } from './defaultBlocks';

interface PageSeo { title?: string; description?: string }

interface BuilderState {
  site: Site | null;
  filePath: string;
  currentPageSlug: string;
  selectedBlockId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  previewKey: number;
  past: Site[];
  future: Site[];
  copiedBlock: Block | null;

  // Loaders
  loadFromApi: (filePath: string) => Promise<void>;
  loadSite: (site: Site | null, filePath: string) => void;

  // Navigation
  setCurrentPage: (slug: string) => void;
  selectBlock: (id: string | null) => void;

  // Block mutations
  updateBlockData: (pageSlug: string, blockId: string, data: Record<string, unknown>) => void;
  updateBlockSettings: (pageSlug: string, blockId: string, settings: Record<string, unknown>) => void;
  updateBlockVariant: (pageSlug: string, blockId: string, variant: string) => void;
  moveBlock: (pageSlug: string, blockId: string, dir: 'up' | 'down') => void;
  toggleBlockHidden: (pageSlug: string, blockId: string) => void;
  deleteBlock: (pageSlug: string, blockId: string) => void;
  duplicateBlock: (pageSlug: string, blockId: string) => void;
  addBlock: (pageSlug: string, type: string, afterBlockId?: string | null) => void;
  reorderBlocks: (pageSlug: string, blocks: Block[]) => void;
  copyBlock: (pageSlug: string, blockId: string) => void;
  pasteBlock: (pageSlug: string) => void;

  // Page management
  addPage: () => void;
  deletePage: (slug: string) => void;
  renamePage: (slug: string, newTitle: string) => void;
  updatePageSeo: (slug: string, seo: PageSeo) => void;

  // Globals
  updateGlobals: (patch: Partial<Globals>) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;

  // Theme
  updateTheme: (patch: Partial<Theme['colors']>) => void;
  updateTypography: (patch: Partial<{ fontHeading: string; fontBody: string }>) => void;

  // Persistence
  saveSite: () => Promise<void>;
  refreshPreview: () => void;
}

const MAX_HISTORY = 50;

function snapshot(s: BuilderState): Site[] {
  return s.site ? [...s.past.slice(-(MAX_HISTORY - 1)), s.site] : s.past;
}

function mutatePage(site: Site, pageSlug: string, fn: (blocks: Block[]) => Block[]): Site {
  return {
    ...site,
    pages: site.pages.map(p => p.slug === pageSlug ? { ...p, blocks: fn(p.blocks) } : p),
  };
}

let _pageId = Date.now();
const pageUid = () => `page_${(_pageId++).toString(36)}`;

export const useStore = create<BuilderState>((set, get) => ({
  site: null,
  filePath: '',
  currentPageSlug: '/',
  selectedBlockId: null,
  isDirty: false,
  isSaving: false,
  previewKey: 0,
  past: [],
  future: [],
  copiedBlock: null,

  loadFromApi: async (filePath) => {
    const res = await fetch(`/api/site?path=${encodeURIComponent(filePath)}`);
    if (!res.ok) throw new Error(await res.text());
    const { site, filePath: absPath } = await res.json() as { site: Site; filePath: string };
    get().loadSite(site, absPath);
  },

  loadSite: (site, filePath) => {
    let past: Site[] = [];
    let future: Site[] = [];
    if (filePath) {
      try {
        const saved = localStorage.getItem(`wf:undo:${filePath}`);
        if (saved) {
          const h = JSON.parse(saved) as { past?: Site[]; future?: Site[] };
          past = h.past ?? [];
          future = h.future ?? [];
        }
      } catch {}
    }
    set({ site, filePath, currentPageSlug: site?.pages[0]?.slug ?? '/', selectedBlockId: null, isDirty: false, previewKey: Date.now(), past, future });
  },

  setCurrentPage: (slug) => set({ currentPageSlug: slug, selectedBlockId: null }),
  selectBlock: (id) => set({ selectedBlockId: id }),

  // ── Block mutations ───────────────────────────────────────────────────────

  addBlock: (pageSlug, type, afterBlockId) => set(s => {
    const block = createBlock(type);
    return {
      isDirty: true, past: snapshot(s), future: [],
      selectedBlockId: block.id,
      site: mutatePage(s.site!, pageSlug, blocks => {
        if (!afterBlockId) return [...blocks, block];
        const idx = blocks.findIndex(b => b.id === afterBlockId);
        const next = [...blocks];
        next.splice(idx + 1, 0, block);
        return next;
      }),
    };
  }),

  duplicateBlock: (pageSlug, blockId) => set(s => {
    const page = s.site!.pages.find(p => p.slug === pageSlug);
    const src = page?.blocks.find(b => b.id === blockId);
    if (!src) return s;
    const clone = { ...structuredClone(src), id: `block_${Date.now().toString(36)}` };
    return {
      isDirty: true, past: snapshot(s), future: [],
      selectedBlockId: clone.id,
      site: mutatePage(s.site!, pageSlug, blocks => {
        const idx = blocks.findIndex(b => b.id === blockId);
        const next = [...blocks];
        next.splice(idx + 1, 0, clone);
        return next;
      }),
    };
  }),

  reorderBlocks: (pageSlug, blocks) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    site: mutatePage(s.site!, pageSlug, () => blocks),
  })),

  copyBlock: (pageSlug, blockId) => {
    const page = get().site?.pages.find(p => p.slug === pageSlug);
    const block = page?.blocks.find(b => b.id === blockId);
    if (block) set({ copiedBlock: structuredClone(block) as Block });
  },

  pasteBlock: (pageSlug) => set(s => {
    const { copiedBlock, selectedBlockId } = s;
    if (!copiedBlock || !s.site) return s;
    const clone = { ...structuredClone(copiedBlock), id: `block_${Date.now().toString(36)}` } as Block;
    return {
      isDirty: true, past: snapshot(s), future: [],
      selectedBlockId: clone.id,
      site: mutatePage(s.site, pageSlug, blocks => {
        if (!selectedBlockId) return [...blocks, clone];
        const idx = blocks.findIndex(b => b.id === selectedBlockId);
        if (idx < 0) return [...blocks, clone];
        const next = [...blocks];
        next.splice(idx + 1, 0, clone);
        return next;
      }),
    };
  }),

  updateBlockData: (pageSlug, blockId, data) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    site: mutatePage(s.site!, pageSlug, blocks =>
      blocks.map(b => b.id === blockId ? { ...b, data: { ...(b as unknown as Record<string,unknown>).data as object, ...data } } as typeof b : b)
    ),
  })),

  updateBlockSettings: (pageSlug, blockId, settings) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    site: mutatePage(s.site!, pageSlug, blocks =>
      blocks.map(b => b.id === blockId ? { ...b, settings: { ...b.settings, ...settings } } : b)
    ),
  })),

  updateBlockVariant: (pageSlug, blockId, variant) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    site: mutatePage(s.site!, pageSlug, blocks =>
      blocks.map(b => b.id === blockId ? { ...b, variant } as typeof b : b)
    ),
  })),

  moveBlock: (pageSlug, blockId, dir) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    site: mutatePage(s.site!, pageSlug, blocks => {
      const idx = blocks.findIndex(b => b.id === blockId);
      if (idx < 0) return blocks;
      const newIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= blocks.length) return blocks;
      const next = [...blocks];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    }),
  })),

  toggleBlockHidden: (pageSlug, blockId) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    site: mutatePage(s.site!, pageSlug, blocks =>
      blocks.map(b => b.id === blockId ? { ...b, settings: { ...b.settings, hidden: !b.settings?.hidden } } : b)
    ),
  })),

  deleteBlock: (pageSlug, blockId) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    selectedBlockId: s.selectedBlockId === blockId ? null : s.selectedBlockId,
    site: mutatePage(s.site!, pageSlug, blocks => blocks.filter(b => b.id !== blockId)),
  })),

  // ── Page management ───────────────────────────────────────────────────────

  addPage: () => set(s => {
    if (!s.site) return s;
    const num = s.site.pages.length + 1;
    const slug = `/page-${num}`;
    const newPage = {
      id: pageUid(),
      slug,
      title: `Page ${num}`,
      seo: { title: `Page ${num}`, description: '' },
      blocks: [],
    };
    return {
      isDirty: true, past: snapshot(s), future: [],
      currentPageSlug: slug,
      selectedBlockId: null,
      site: { ...s.site, pages: [...s.site.pages, newPage] },
    };
  }),

  deletePage: (slug) => set(s => {
    if (!s.site || s.site.pages.length <= 1) return s;
    const pages = s.site.pages.filter(p => p.slug !== slug);
    return {
      isDirty: true, past: snapshot(s), future: [],
      currentPageSlug: pages[0]?.slug ?? '/',
      selectedBlockId: null,
      site: { ...s.site, pages },
    };
  }),

  renamePage: (slug, newTitle) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    site: s.site ? {
      ...s.site,
      pages: s.site.pages.map(p => p.slug === slug ? { ...p, title: newTitle } : p),
    } : s.site,
  })),

  updatePageSeo: (slug, seo) => set(s => ({
    isDirty: true,
    site: s.site ? {
      ...s.site,
      pages: s.site.pages.map(p => p.slug === slug ? { ...p, seo: { ...p.seo, ...seo } } : p),
    } : s.site,
  })),

  // ── Globals ───────────────────────────────────────────────────────────────

  updateGlobals: (patch) => set(s => ({
    isDirty: true, past: snapshot(s), future: [],
    site: s.site ? { ...s.site, globals: { ...s.site.globals, ...patch } } : s.site,
  })),

  // ── Undo/Redo ─────────────────────────────────────────────────────────────

  undo: () => set(s => {
    if (!s.past.length) return s;
    const prev = s.past[s.past.length - 1];
    return {
      past: s.past.slice(0, -1),
      future: s.site ? [s.site, ...s.future] : s.future,
      site: prev, isDirty: true,
    };
  }),

  redo: () => set(s => {
    if (!s.future.length) return s;
    const next = s.future[0];
    return {
      past: s.site ? [...s.past, s.site] : s.past,
      future: s.future.slice(1),
      site: next, isDirty: true,
    };
  }),

  // ── Theme ─────────────────────────────────────────────────────────────────

  updateTheme: (patch) => set(s => ({
    isDirty: true,
    site: s.site ? { ...s.site, theme: { ...s.site.theme, colors: { ...s.site.theme.colors, ...patch } } } : s.site,
  })),

  updateTypography: (patch) => set(s => ({
    isDirty: true,
    site: s.site ? {
      ...s.site,
      theme: { ...s.site.theme, typography: { ...s.site.theme.typography, ...patch } },
    } : s.site,
  })),

  // ── Persistence ───────────────────────────────────────────────────────────

  saveSite: async () => {
    const { site, filePath } = get();
    if (!site || !filePath) return;
    set({ isSaving: true });
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site, filePath }),
      });
      set({ isDirty: false });
    } finally {
      set({ isSaving: false });
    }
  },

  refreshPreview: () => set(s => ({ previewKey: s.previewKey + 1 })),
}));

// Persist undo/redo history to localStorage so it survives page refresh
useStore.subscribe((state, prev) => {
  if (!state.filePath || (state.past === prev.past && state.future === prev.future)) return;
  try {
    localStorage.setItem(`wf:undo:${state.filePath}`, JSON.stringify({
      past:   state.past.slice(-15),
      future: state.future.slice(0, 10),
    }));
  } catch {}
});
