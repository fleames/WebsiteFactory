import type { BlogGridBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

export function renderBlogGrid(block: BlogGridBlock): string {
  const bg = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec = sectionClasses(bg, block.settings?.paddingY ?? 'xl');
  const { data } = block;
  const posts = data.posts ?? [];

  const postCards = posts.map(post => `
    <a href="${esc(post.slug)}" class="group flex flex-col rounded-2xl overflow-hidden border ${dark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-md'} transition-all">
      ${post.image ? `
        <div class="aspect-video overflow-hidden bg-slate-100">
          <img src="${esc(post.image)}" alt="${esc(post.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </div>` : `
        <div class="aspect-video bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center text-4xl">📝</div>`
      }
      <div class="p-5 flex flex-col flex-1">
        ${post.category ? `<span class="text-xs font-bold text-brand uppercase tracking-wider mb-2">${esc(post.category)}</span>` : ''}
        <h3 class="font-bold text-base ${dark ? 'text-white' : 'text-slate-800'} group-hover:text-brand transition-colors leading-snug">${esc(post.title)}</h3>
        <p class="text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} mt-2 flex-1 leading-relaxed">${esc(post.excerpt)}</p>
        <div class="mt-4 text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}">${esc(post.date)}</div>
      </div>
    </a>`).join('');

  const ctaHtml = data.cta ? `
    <div class="text-center mt-10">
      <a href="${esc(data.cta.href)}" class="inline-block px-6 py-3 rounded-xl font-semibold text-sm border-2 border-brand ${dark ? 'text-white hover:bg-brand' : 'text-brand hover:bg-brand hover:text-white'} transition-colors">
        ${esc(data.cta.label)}
      </a>
    </div>` : '';

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${data.heading ? `<h2 class="text-3xl font-extrabold font-heading text-center mb-10">${esc(data.heading)}</h2>` : ''}
    ${posts.length === 0
      ? `<p class="text-center ${dark ? 'text-gray-400' : 'text-gray-400'}">No posts yet.</p>`
      : `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${postCards}</div>`
    }
    ${ctaHtml}
  </div>
</section>`.trim();
}
