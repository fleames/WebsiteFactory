import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent, DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store';
import BlockPicker from './BlockPicker';
import type { Block } from '@schema/types';

const BLOCK_ICONS: Record<string, string> = {
  hero: '⚡', trust_bar: '🏅', services: '🔧', about: '👥', process: '📋',
  testimonials: '💬', pricing: '💰', faq: '❓', cta_banner: '📣', contact: '✉️',
  stats: '📊', gallery: '🖼️', team: '👤', blog_grid: '📰',
  video: '▶️', map: '📍', logo_cloud: '🤝', comparison: '⚖️',
  promo_banner: '🎉', location_finder: '🗺️', booking_strip: '📅', core_values: '🌟',
};

const BLOCK_COLORS: Record<string, string> = {
  hero: '#3B82F6', trust_bar: '#F59E0B', services: '#8B5CF6', about: '#06B6D4',
  process: '#10B981', testimonials: '#EC4899', pricing: '#F97316', faq: '#6366F1',
  cta_banner: '#EF4444', contact: '#14B8A6', stats: '#22C55E', gallery: '#A855F7',
  team: '#64748B', blog_grid: '#0EA5E9', video: '#DC2626', map: '#16A34A',
  logo_cloud: '#9333EA', comparison: '#D97706', promo_banner: '#E11D48',
  location_finder: '#0891B2', booking_strip: '#7C3AED', core_values: '#CA8A04',
};

export default function BlockList() {
  const { site, currentPageSlug, selectedBlockId, selectBlock,
    moveBlock, toggleBlockHidden, deleteBlock, addBlock, duplicateBlock, reorderBlocks } = useStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  if (!site) return null;
  const page = site.pages.find(p => p.slug === currentPageSlug);
  if (!page) return null;

  const filteredBlocks = search.trim()
    ? page.blocks.filter(b =>
        b.type.includes(search.toLowerCase()) ||
        b.variant.includes(search.toLowerCase())
      )
    : page.blocks;

  const activeBlock = activeId ? page.blocks.find(b => b.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const blocks = page!.blocks;
    const oldIdx = blocks.findIndex(b => b.id === active.id);
    const newIdx = blocks.findIndex(b => b.id === over.id);
    reorderBlocks(currentPageSlug, arrayMove(blocks, oldIdx, newIdx));
  }

  return (
    <>
      {pickerOpen && (
        <BlockPicker
          onPick={type => addBlock(currentPageSlug, type, selectedBlockId)}
          onClose={() => setPickerOpen(false)}
        />
      )}
      <div className="w-[216px] shrink-0 flex flex-col overflow-hidden" style={{ background: 'rgba(3,4,9,0.97)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'rgba(71,85,105,0.8)' }}>Blokke</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(100,116,139,0.8)' }}>
              {search.trim() ? `${filteredBlocks.length}/${page.blocks.length}` : page.blocks.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Search toggle */}
            <button
              onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearch(''); }}
              title="Søg blokke"
              className="w-6 h-6 flex items-center justify-center rounded-md transition-all"
              style={{ color: searchOpen ? 'rgba(96,165,250,0.9)' : 'rgba(71,85,105,0.6)', background: searchOpen ? 'rgba(59,130,246,0.12)' : 'transparent' }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            {/* Add block */}
            <button
              onClick={() => setPickerOpen(true)}
              title="Tilføj blok"
              className="w-6 h-6 flex items-center justify-center rounded-lg text-white font-bold text-sm transition-all"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', boxShadow: '0 0 10px rgba(59,130,246,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(59,130,246,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 10px rgba(59,130,246,0.3)'; }}
            >+</button>
          </div>
        </div>

        {/* Search input */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="px-2 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filtrer blokke…"
                  className="w-full bg-transparent text-[11px] text-white outline-none px-2 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', caretColor: '#60A5FA' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Block list */}
        <div className="flex-1 overflow-y-auto py-1.5 px-1.5">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={page.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence initial={false}>
                {filteredBlocks.map((block, idx) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.02 }}
                    layout
                  >
                    <SortableBlock
                      block={block}
                      idx={page.blocks.findIndex(b => b.id === block.id)}
                      total={page.blocks.length}
                      isSelected={selectedBlockId === block.id}
                      isDraggingThis={activeId === block.id}
                      onSelect={() => selectBlock(selectedBlockId === block.id ? null : block.id)}
                      onMoveUp={() => moveBlock(currentPageSlug, block.id, 'up')}
                      onMoveDown={() => moveBlock(currentPageSlug, block.id, 'down')}
                      onToggleHidden={() => toggleBlockHidden(currentPageSlug, block.id)}
                      onDuplicate={() => duplicateBlock(currentPageSlug, block.id)}
                      onDelete={() => { if (confirm(`Slet ${block.type}-blok?`)) deleteBlock(currentPageSlug, block.id); }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>

            {/* Custom drag overlay ghost */}
            <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
              {activeBlock && (
                <div className="rounded-lg px-3 py-2.5 pl-[14px] flex items-center gap-2 shadow-2xl"
                  style={{
                    background: `linear-gradient(90deg, ${BLOCK_COLORS[activeBlock.type] ?? '#3B82F6'}18 0%, rgba(15,20,40,0.95) 50%)`,
                    border: `1px solid ${BLOCK_COLORS[activeBlock.type] ?? '#3B82F6'}40`,
                    boxShadow: `0 8px 32px ${BLOCK_COLORS[activeBlock.type] ?? '#3B82F6'}30, 0 2px 8px rgba(0,0,0,0.6)`,
                    cursor: 'grabbing',
                  }}>
                  <div className="w-[3px] absolute left-0 top-1.5 bottom-1.5 rounded-r-full"
                    style={{ background: BLOCK_COLORS[activeBlock.type] ?? '#64748B', boxShadow: `0 0 6px ${BLOCK_COLORS[activeBlock.type] ?? '#64748B'}80` }} />
                  <span className="text-sm leading-none">{BLOCK_ICONS[activeBlock.type] ?? '▪'}</span>
                  <span className="text-[11px] font-semibold capitalize text-white/90">{activeBlock.type.replace(/_/g, ' ')}</span>
                </div>
              )}
            </DragOverlay>
          </DndContext>

          {filteredBlocks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-700 text-xs px-4 text-center gap-2">
              {search.trim() ? (
                <>
                  <span className="text-2xl opacity-40">🔍</span>
                  <span className="text-[11px]" style={{ color: 'rgba(100,116,139,0.6)' }}>Ingen blokke matcher "{search}"</span>
                  <button onClick={() => setSearch('')} className="text-[10px] underline underline-offset-2" style={{ color: 'rgba(96,165,250,0.7)' }}>Ryd</button>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
                  </svg>
                  <span>Klik + for at tilføje den første blok</span>
                </>
              )}
            </div>
          )}
        </div>

        <ThemeStrip />
      </div>
    </>
  );
}

function SortableBlock({
  block, idx, total, isSelected, isDraggingThis,
  onSelect, onMoveUp, onMoveDown, onToggleHidden, onDuplicate, onDelete,
}: {
  block: Block; idx: number; total: number; isSelected: boolean; isDraggingThis: boolean;
  onSelect: () => void; onMoveUp: () => void; onMoveDown: () => void;
  onToggleHidden: () => void; onDuplicate: () => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDraggingThis ? 0.15 : 1 };
  const isHidden = block.settings?.hidden;
  const hasNote = !!(block.settings as Record<string, unknown>)?.note;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative mb-px rounded-lg cursor-pointer transition-all overflow-hidden ${isHidden ? 'opacity-30' : ''}`}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Color-coded left bar */}
      <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full transition-opacity"
        style={{
          background: BLOCK_COLORS[block.type] ?? '#64748B',
          opacity: isSelected ? 1 : 0.35,
          boxShadow: isSelected ? `0 0 6px ${BLOCK_COLORS[block.type] ?? '#64748B'}80` : 'none',
        }} />

      {/* Selected background */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
          background: `linear-gradient(90deg, ${BLOCK_COLORS[block.type] ?? '#3B82F6'}12 0%, transparent 60%)`,
          border: `1px solid ${BLOCK_COLORS[block.type] ?? '#3B82F6'}22`,
        }} />
      )}

      <div className="flex items-center gap-2 px-3 py-2.5 pl-[14px]">
        {/* Drag handle */}
        <span
          {...attributes} {...listeners}
          onClick={e => e.stopPropagation()}
          title="Træk for at omarrangere"
          className="cursor-grab active:cursor-grabbing shrink-0 select-none transition-opacity opacity-0 group-hover:opacity-100"
          style={{ color: 'rgba(71,85,105,0.8)' }}
        >
          <svg className="w-2.5 h-3" viewBox="0 0 8 12" fill="currentColor">
            <circle cx="2" cy="2" r="1.1"/><circle cx="6" cy="2" r="1.1"/>
            <circle cx="2" cy="6" r="1.1"/><circle cx="6" cy="6" r="1.1"/>
            <circle cx="2" cy="10" r="1.1"/><circle cx="6" cy="10" r="1.1"/>
          </svg>
        </span>

        <span className="text-sm leading-none shrink-0">{BLOCK_ICONS[block.type] ?? '▪'}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <div className="text-[11px] font-semibold capitalize truncate leading-tight transition-colors"
              style={{ color: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(148,163,184,0.85)' }}>
              {block.type.replace(/_/g, ' ')}
            </div>
            {/* Note indicator dot */}
            {hasNote && (
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#F59E0B', boxShadow: '0 0 4px rgba(245,158,11,0.6)' }} title="Har note" />
            )}
          </div>
          <div className="text-[9px] truncate leading-tight mt-0.5 font-mono"
            style={{ color: 'rgba(71,85,105,0.8)' }}>{block.variant}</div>
        </div>
      </div>

      {/* Hover / selected actions */}
      <div className={`absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 ${
        isSelected ? 'flex' : 'hidden group-hover:flex'
      }`}>
        <DarkBtn title="Flyt op"    disabled={idx === 0}           onClick={e => { e.stopPropagation(); onMoveUp(); }}>↑</DarkBtn>
        <DarkBtn title="Flyt ned"  disabled={idx === total - 1}    onClick={e => { e.stopPropagation(); onMoveDown(); }}>↓</DarkBtn>
        <DarkBtn title="Dupliker"  onClick={e => { e.stopPropagation(); onDuplicate(); }}>⧉</DarkBtn>
        <DarkBtn title={isHidden ? 'Vis' : 'Skjul'} onClick={e => { e.stopPropagation(); onToggleHidden(); }}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isHidden
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            }
          </svg>
        </DarkBtn>
        <DarkBtn title="Slet" onClick={e => { e.stopPropagation(); onDelete(); }} danger>✕</DarkBtn>
      </div>
    </div>
  );
}

function DarkBtn({ children, onClick, disabled, title, danger, className = '' }: {
  children: React.ReactNode; onClick: React.MouseEventHandler;
  disabled?: boolean; title?: string; danger?: boolean; className?: string;
}) {
  return (
    <button
      title={title} disabled={disabled} onClick={onClick}
      className={`w-5 h-5 flex items-center justify-center text-[10px] rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed ${
        danger
          ? 'text-slate-600 hover:text-red-400 hover:bg-red-500/10'
          : 'text-slate-600 hover:text-slate-200 hover:bg-slate-700'
      } ${className}`}
    >{children}</button>
  );
}

function ThemeStrip() {
  const { site, updateTheme } = useStore();
  if (!site) return null;
  const { colors } = site.theme;
  return (
    <div className="px-4 py-3.5 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-[9px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(71,85,105,0.7)' }}>Tema</div>
      <div className="flex items-center gap-3">
        {([['brand', 'Brand'], ['accent', 'Accent']] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer group" title={label}>
            <div className="relative w-6 h-6 rounded-lg transition-all group-hover:scale-110"
              style={{
                background: colors[key],
                boxShadow: `0 0 8px ${colors[key]}60`,
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
              }} />
            </div>
            <input type="color" value={colors[key]} onChange={e => updateTheme({ [key]: e.target.value })} className="sr-only" />
            <span className="text-[10px] transition-colors" style={{ color: 'rgba(71,85,105,0.8)' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = 'rgba(148,163,184,0.9)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(71,85,105,0.8)'; }}>
              {label}
            </span>
          </label>
        ))}
        {/* Color preview strip */}
        <div className="flex-1 flex gap-0.5 overflow-hidden rounded-md h-3 ml-1">
          {Object.values(colors).filter(Boolean).slice(0, 6).map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c as string }} />
          ))}
        </div>
      </div>
    </div>
  );
}
