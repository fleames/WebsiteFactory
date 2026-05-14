import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { validateBeforeDeploy, type ValidationIssue } from '../utils/deployValidation';

export default function TopBar() {
  const {
    site, filePath, isDirty, isSaving, currentPageSlug,
    setCurrentPage, saveSite, refreshPreview, loadSite,
    addPage, deletePage, renamePage, undo, redo, past, future,
  } = useStore();

  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState('');
  const [deployError, setDeployError] = useState('');
  const [deployTarget, setDeployTarget] = useState<'netlify' | 'vercel'>('netlify');
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[] | null>(null);
  const [pendingDeploy, setPendingDeploy] = useState<'netlify' | 'vercel' | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [renamingSlug, setRenamingSlug] = useState<string | null>(null);
  const renameRef = useRef<HTMLInputElement>(null);

  if (!site) return null;

  const runDeploy = async (target: 'netlify' | 'vercel') => {
    if (!filePath) return;
    setDeploying(true); setDeployError(''); setDeployUrl('');
    try {
      const endpoint = target === 'netlify' ? '/api/netlify-deploy' : '/api/vercel-deploy';
      const r = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
      const d = await r.json() as { url?: string; error?: string };
      if (!r.ok) throw new Error(d.error ?? `${target} deploy fejlede`);
      setDeployUrl(d.url!);
    } catch (e) { setDeployError(String(e)); }
    finally { setDeploying(false); }
  };

  const handleRenameBlur = (slug: string) => {
    const val = renameRef.current?.value.trim();
    if (val && val !== site.pages.find(p => p.slug === slug)?.title) {
      renamePage(slug, val);
    }
    setRenamingSlug(null);
  };

  const handleShare = async () => {
    if (!filePath) return;
    const r = await fetch('/api/preview-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath }),
    });
    const d = await r.json() as { url: string };
    setShareUrl(d.url);
    await navigator.clipboard.writeText(d.url).catch(() => {});
  };

  return (
    <div className="shrink-0 z-10" style={{ background: 'rgba(3,4,9,0.97)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="h-11 flex items-center px-3 gap-2">

        {/* Logo + Back */}
        <button
          onClick={() => { if (!isDirty || confirm('Ikke-gemte ændringer — forlad alligevel?')) loadSite(null as never, ''); }}
          className="flex items-center gap-2 shrink-0 group pr-1"
        >
          <div className="w-6 h-6 rounded-[7px] flex items-center justify-center shrink-0" style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)',
            boxShadow: '0 0 10px rgba(59,130,246,0.3)',
          }}>
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <svg className="w-3 h-3 transition-all group-hover:translate-x-[-2px]" style={{ color: 'rgba(71,85,105,0.6)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="w-px h-5 shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Project name */}
        <div className="flex items-center gap-1.5 min-w-0 shrink-0 px-1">
          <span className="text-xs font-semibold truncate max-w-[130px]" style={{ color: 'rgba(226,232,240,0.75)' }}>
            {filePath ? filePath.split(/[\\/]/).slice(-2, -1)[0] : 'Ikke gemt'}
          </span>
          {isDirty && (
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{
              background: '#FBBF24',
              boxShadow: '0 0 6px rgba(251,191,36,0.6)',
            }} title="Ikke-gemte ændringer" />
          )}
        </div>

        {/* Page tabs */}
        <div className="flex items-stretch gap-px ml-1 overflow-x-auto flex-1 min-w-0 h-full">
          {site.pages.map(page => {
            const isActive = currentPageSlug === page.slug;
            return (
              <div key={page.slug} className="flex items-center shrink-0 relative">
                {renamingSlug === page.slug ? (
                  <input
                    ref={renameRef}
                    defaultValue={page.title}
                    autoFocus
                    onBlur={() => handleRenameBlur(page.slug)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRenameBlur(page.slug); if (e.key === 'Escape') setRenamingSlug(null); }}
                    className="px-2 py-1 text-xs border rounded outline-none w-24 text-white"
                    style={{ border: '1px solid rgba(96,165,250,0.5)', background: 'rgba(30,41,59,0.8)' }}
                  />
                ) : (
                  <button
                    onClick={() => setCurrentPage(page.slug)}
                    onDoubleClick={() => setRenamingSlug(page.slug)}
                    title="Dobbeltklik for at omdøbe"
                    className="flex items-center gap-1 px-3 h-full text-xs font-medium transition-colors relative"
                    style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(100,116,139,0.8)' }}
                  >
                    {page.title}
                    {site.pages.length > 1 && isActive && (
                      <button
                        onClick={e => { e.stopPropagation(); if (confirm(`Slet siden "${page.title}"?`)) deletePage(page.slug); }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded transition-colors ml-0.5 text-[9px]"
                        style={{ color: 'rgba(71,85,105,0.7)' }}
                        onMouseEnter={e => { (e.target as HTMLElement).style.color = '#F87171'; }}
                        onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(71,85,105,0.7)'; }}
                        title="Slet side"
                      >✕</button>
                    )}
                    {/* Animated sliding underline pill */}
                    {isActive && (
                      <motion.span
                        layoutId="topbar-tab-pill"
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #60A5FA, #A78BFA)',
                          boxShadow: '0 0 6px rgba(96,165,250,0.5)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={addPage}
            title="Tilføj side"
            className="w-7 h-7 my-auto flex items-center justify-center rounded-lg transition-all ml-0.5 shrink-0 text-lg font-light"
            style={{ color: 'rgba(71,85,105,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(71,85,105,0.7)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
          >+</button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Undo / Redo */}
          <button onClick={undo} disabled={!past.length} title="Fortryd (Ctrl+Z)"
            className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-20 transition-all"
            style={{ color: 'rgba(100,116,139,0.8)' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(100,116,139,0.8)'; e.currentTarget.style.background = 'transparent'; }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
          </button>
          <button onClick={redo} disabled={!future.length} title="Annuller fortryd (Ctrl+Y)"
            className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-20 transition-all"
            style={{ color: 'rgba(100,116,139,0.8)' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(100,116,139,0.8)'; e.currentTarget.style.background = 'transparent'; }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"/></svg>
          </button>

          <div className="w-px h-5 bg-white/[0.07] mx-0.5" />

          {/* Refresh */}
          <button onClick={refreshPreview} title="Opdater forhåndsvisning"
            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <div className="w-px h-5 bg-white/[0.07] mx-0.5" />

          {/* Save — Ctrl+S hint in title */}
          <button onClick={saveSite} disabled={isSaving || !isDirty}
            title={isDirty ? 'Gem (Ctrl+S)' : 'Gemt'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-w-[64px] justify-center ${
              isSaving
                ? 'bg-slate-800 text-slate-400'
                : isDirty
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950'
                  : 'text-slate-600 cursor-default'
            }`}>
            {isSaving ? '⟳ Gemmer…' : isDirty ? '● Gem' : '✓ Gemt'}
          </button>

          {/* Share */}
          <div className="relative">
            <button onClick={handleShare}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-white/[0.06] transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              Del
            </button>
            {shareUrl && (
              <div className="absolute top-10 right-0 z-50 w-72 p-3.5 rounded-xl shadow-2xl bg-slate-900 text-white text-xs border border-slate-700">
                <div className="font-semibold mb-1.5 text-emerald-400">✓ Link kopieret!</div>
                <a href={shareUrl} target="_blank" rel="noopener" className="underline break-all text-slate-400 hover:text-slate-200">{shareUrl}</a>
                <button onClick={() => setShareUrl('')} className="absolute top-2.5 right-2.5 text-slate-600 hover:text-white">✕</button>
              </div>
            )}
          </div>

          {/* Export ZIP */}
          <a href={filePath ? `/api/export-zip?path=${encodeURIComponent(filePath)}` : '#'} download
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-white/[0.06] transition-colors"
            onClick={e => { if (!filePath) e.preventDefault(); }}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            ZIP
          </a>

          {/* Deploy */}
          <div className="relative">
            <div className="flex rounded-lg overflow-hidden border border-white/[0.08]">
              <button
                onClick={() => {
                  if (!filePath || !site) return;
                  const issues = validateBeforeDeploy(site);
                  const hasErrors = issues.some(i => i.severity === 'error');
                  if (issues.length > 0) {
                    setValidationIssues(issues);
                    setPendingDeploy(deployTarget);
                  } else {
                    runDeploy(deployTarget);
                  }
                  void hasErrors;
                }}
                disabled={deploying || !filePath}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-700 hover:bg-teal-600 text-white disabled:bg-slate-800 disabled:text-slate-600 transition-colors"
              >{deploying ? '⟳ Udgiver…' : `▲ ${deployTarget === 'netlify' ? 'Netlify' : 'Vercel'}`}</button>
              <select
                value={deployTarget}
                onChange={e => setDeployTarget(e.target.value as 'netlify' | 'vercel')}
                className="bg-teal-800 hover:bg-teal-700 text-white text-xs px-1.5 border-l border-white/10 cursor-pointer focus:outline-none transition-colors"
              >
                <option value="netlify">Netlify</option>
                <option value="vercel">Vercel</option>
              </select>
            </div>

            {(deployUrl || deployError) && (
              <div className={`absolute top-10 right-0 z-50 w-72 p-3.5 rounded-xl shadow-2xl text-xs border ${
                deployError
                  ? 'bg-red-950 border-red-800/50 text-red-300'
                  : 'bg-teal-950 border-teal-800/50 text-teal-300'
              }`}>
                {deployError
                  ? deployError
                  : (<><div className="font-semibold mb-1.5 text-teal-400">✓ Udgivet!</div><a href={deployUrl} target="_blank" rel="noopener" className="underline break-all text-teal-500 hover:text-teal-300">{deployUrl}</a></>)}
                <button onClick={() => { setDeployUrl(''); setDeployError(''); }} className="absolute top-2.5 right-2.5 text-slate-600 hover:text-white">✕</button>
              </div>
            )}
          </div>

          {/* Validation modal */}
          {validationIssues && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-96 max-w-[90vw] p-5">
                <div className="text-sm font-bold text-white mb-1">Kontroller inden udgivelse</div>
                <div className="text-xs text-slate-400 mb-4">
                  {validationIssues.some(i => i.severity === 'error')
                    ? 'Der er fejl der bør rettes før udgivelse.'
                    : 'Alt ser godt ud — du kan udgive nu.'}
                </div>
                <div className="space-y-1.5 mb-5 max-h-52 overflow-y-auto">
                  {validationIssues.map((issue, i) => (
                    <div key={i} className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs ${
                      issue.severity === 'error'
                        ? 'bg-red-950/60 border border-red-800/40 text-red-300'
                        : 'bg-amber-950/60 border border-amber-800/40 text-amber-300'
                    }`}>
                      <span className="font-bold shrink-0 mt-px">{issue.severity === 'error' ? '✕' : '!'}</span>
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setValidationIssues(null); setPendingDeploy(null); }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >Ret problemer</button>
                  <button
                    onClick={() => {
                      const target = pendingDeploy!;
                      setValidationIssues(null);
                      setPendingDeploy(null);
                      runDeploy(target);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
                  >Udgiv alligevel</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
