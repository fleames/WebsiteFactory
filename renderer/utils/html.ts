export function esc(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Maps BlockBackground → Tailwind classes (text + bg)
export function sectionClasses(bg?: string, paddingY?: string): string {
  const bgClass = {
    white:       'bg-white',
    surface:     'bg-gray-50',
    brand:       'bg-brand',
    brand_dark:  'bg-brand-dark',
    dark:        'bg-gray-900',
    black:       'bg-black',
    brand_tint:  'bg-brand/[0.05]',
    transparent: '',
  }[bg ?? 'white'] ?? 'bg-white';

  const textClass = ['brand', 'brand_dark', 'dark', 'black', 'transparent'].includes(bg ?? '')
    ? 'text-white'
    : 'text-gray-900';

  const pyClass = {
    none: '',
    sm:   'py-8',
    md:   'py-12',
    lg:   'py-16',
    xl:   'py-20 md:py-28',
  }[paddingY ?? 'xl'] ?? 'py-16 md:py-24';

  return cx(bgClass, textClass, pyClass);
}

// Decorative background blobs (absolute positioned, blurred)
export function blobBg(dark: boolean): string {
  const c1 = dark ? 'rgba(255,255,255,0.06)' : 'rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.12)';
  const c2 = dark ? 'rgba(255,255,255,0.04)' : 'rgba(var(--blob-r),var(--blob-g),var(--blob-b),0.07)';
  return `
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div style="position:absolute;top:-10%;right:-8%;width:45%;padding-top:45%;border-radius:50%;background:${c1};filter:blur(72px);"></div>
    <div style="position:absolute;bottom:-15%;left:-6%;width:38%;padding-top:38%;border-radius:50%;background:${c2};filter:blur(80px);"></div>
  </div>`.trim();
}

export function isDark(bg?: string): boolean {
  return ['brand', 'brand_dark', 'dark', 'black', 'transparent'].includes(bg ?? '');
}
