import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function esc(s: string | undefined | null): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '59,130,246';
}

export function isDark(bg: string): boolean {
  return bg === 'dark' || bg === 'black' || bg === 'brand' || bg === 'brand_dark' || bg === 'transparent';
}

/** Returns Tailwind/CSS classes for all BG_OPTIONS values. */
export function bgCls(bg: string): string {
  if (bg === 'transparent') return 'text-white';          // no bg — immersive canvas shows through
  if (bg === 'dark' || bg === 'black') return 'bg-gray-950 text-white';
  if (bg === 'surface') return 'bg-gray-50 text-gray-900';
  if (bg === 'brand' || bg === 'brand_dark') return 'section-brand';
  if (bg === 'brand_tint') return 'section-brand-subtle';
  return 'bg-white text-gray-900';
}

export function stars(n: number, size = 'w-4 h-4'): string {
  return Array.from({length:5},(_,i)=>`<i data-lucide="star" class="${size} ${i<n?'fill-brand text-brand':'text-gray-300 dark:text-gray-600'}"></i>`).join('');
}
