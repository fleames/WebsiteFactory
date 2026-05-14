import type { VideoBlock } from '../../schema/types.js';
import { esc, sectionClasses, isDark } from '../utils/html.js';

function toEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`;
  return url;
}

export function renderVideo(block: VideoBlock): string {
  const bg   = block.settings?.background ?? 'white';
  const dark = isDark(bg);
  const sec  = sectionClasses(bg, block.settings?.paddingY);
  const { data, variant } = block;

  const embedUrl = toEmbedUrl(data.url);
  const isIframe = embedUrl.includes('youtube.com/embed') || embedUrl.includes('vimeo.com/video') || embedUrl.includes('embed');

  const playerHtml = isIframe
    ? `<div class="relative w-full rounded-2xl overflow-hidden shadow-2xl" style="padding-top:56.25%">
        <iframe
          src="${esc(embedUrl)}"
          class="absolute inset-0 w-full h-full"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
          title="${esc(data.heading ?? 'Video')}"
        ></iframe>
       </div>`
    : `<div class="relative w-full rounded-2xl overflow-hidden shadow-2xl">
        <video
          src="${esc(data.url)}"
          ${data.poster ? `poster="${esc(data.poster)}"` : ''}
          controls
          ${data.autoplay ? 'autoplay muted playsinline' : ''}
          class="w-full h-auto"
          loading="lazy"
        ></video>
       </div>`;

  const headerHtml = (data.heading || data.subtext)
    ? `<div class="text-center mb-10">
        ${data.heading ? `<h2 class="text-3xl md:text-4xl font-extrabold font-heading mb-3">${esc(data.heading)}</h2>` : ''}
        ${data.subtext ? `<p class="text-lg ${dark ? 'text-gray-300' : 'text-gray-500'} max-w-2xl mx-auto">${esc(data.subtext)}</p>` : ''}
       </div>`
    : '';

  const captionHtml = data.caption
    ? `<p class="text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} text-center mt-4">${esc(data.caption)}</p>`
    : '';

  if (variant === 'with_text') {
    return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        ${data.heading ? `<h2 class="text-3xl md:text-4xl font-extrabold font-heading mb-4">${esc(data.heading)}</h2>` : ''}
        ${data.subtext ? `<p class="text-lg ${dark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed">${esc(data.subtext)}</p>` : ''}
      </div>
      <div>
        ${playerHtml}
        ${captionHtml}
      </div>
    </div>
  </div>
</section>`.trim();
  }

  const maxW = variant === 'wide' ? 'max-w-5xl' : 'max-w-3xl';

  return `
<section class="${sec}">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    ${headerHtml}
    <div class="${maxW} mx-auto">
      ${playerHtml}
      ${captionHtml}
    </div>
  </div>
</section>`.trim();
}
