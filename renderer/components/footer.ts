import type { Footer } from '../../schema/types.js';
import { esc } from '../utils/html.js';

const socialIcons: Record<string, string> = {
  instagram: 'instagram',
  facebook:  'facebook',
  linkedin:  'linkedin',
  x:         'twitter',
  youtube:   'youtube',
  tiktok:    'music-2',
};

export function renderFooter(footer: Footer, businessName: string): string {
  const logoHtml = footer.logo
    ? footer.logo.type === 'text'
      ? `<span class="text-xl font-bold font-heading">${esc(footer.logo.value)}</span>`
      : `<img src="${esc(footer.logo.src)}" alt="${esc(footer.logo.alt)}" class="h-8 w-auto">`
    : `<span class="text-xl font-bold font-heading">${esc(businessName)}</span>`;

  const taglineHtml = footer.tagline
    ? `<p class="text-sm text-gray-400 mt-2 max-w-xs">${esc(footer.tagline)}</p>`
    : '';

  const socialHtml = footer.social?.length
    ? `<div class="flex gap-3 mt-4">
        ${footer.social.map(s => `
          <a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.platform)}"
             class="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <i data-lucide="${socialIcons[s.platform] ?? s.platform}" class="w-4 h-4"></i>
          </a>`).join('')}
       </div>`
    : '';

  const contactHtml = footer.contact
    ? `<div class="flex flex-col gap-1 text-sm text-gray-400 mt-3">
        ${footer.contact.phone ? `<a href="tel:${esc(footer.contact.phone.replace(/\s/g,''))}" class="hover:text-white transition-colors flex items-center gap-2"><i data-lucide="phone" class="w-3 h-3"></i>${esc(footer.contact.phone)}</a>` : ''}
        ${footer.contact.email ? `<a href="mailto:${esc(footer.contact.email)}" class="hover:text-white transition-colors flex items-center gap-2"><i data-lucide="mail" class="w-3 h-3"></i>${esc(footer.contact.email)}</a>` : ''}
        ${footer.contact.address ? `<span class="flex items-center gap-2"><i data-lucide="map-pin" class="w-3 h-3"></i>${esc(footer.contact.address)}</span>` : ''}
      </div>`
    : '';

  const columnsHtml = footer.columns?.length
    ? footer.columns.map(col => `
        <div>
          <h3 class="text-sm font-semibold text-white mb-4">${esc(col.heading)}</h3>
          <ul class="space-y-2">
            ${col.links.map(l => `<li><a href="${esc(l.href)}" class="text-sm text-gray-400 hover:text-white transition-colors">${esc(l.label)}</a></li>`).join('')}
          </ul>
        </div>`).join('')
    : '';

  return `
<footer class="bg-gray-900 text-white">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

      <div class="lg:col-span-2">
        ${logoHtml}
        ${taglineHtml}
        ${contactHtml}
        ${socialHtml}
      </div>

      ${columnsHtml}

    </div>
  </div>

  <div class="border-t border-white/10">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
      <p class="text-xs text-gray-500">${esc(footer.copyright)}</p>
    </div>
  </div>
</footer>`.trim();
}
