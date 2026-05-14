import type { Block } from '../../schema/types.js';
import { renderHero } from './hero.js';
import { renderTrustBar } from './trust-bar.js';
import { renderServices } from './services.js';
import { renderAbout } from './about.js';
import { renderProcess } from './process.js';
import { renderTestimonials } from './testimonials.js';
import { renderPricing } from './pricing.js';
import { renderFaq } from './faq.js';
import { renderCtaBanner } from './cta-banner.js';
import { renderContact } from './contact.js';
import { renderStats } from './stats.js';
import { renderGallery } from './gallery.js';
import { renderTeam } from './team.js';
import { renderBlogGrid } from './blog-grid.js';
import { renderVideo } from './video.js';
import { renderMap } from './map.js';
import { renderLogoCloud } from './logo-cloud.js';
import { renderComparison } from './comparison.js';
import { renderPromoBanner } from './promo-banner.js';
import { renderLocationFinder } from './location-finder.js';
import { renderBookingStrip } from './booking-strip.js';
import { renderCoreValues } from './core-values.js';

export function renderBlock(block: Block, brandColor = '#3B82F6'): string {
  if (block.settings?.hidden) return '';

  let html: string;
  switch (block.type) {
    case 'hero':            html = renderHero(block, brandColor); break;
    case 'trust_bar':       html = renderTrustBar(block); break;
    case 'services':        html = renderServices(block); break;
    case 'about':           html = renderAbout(block); break;
    case 'process':         html = renderProcess(block); break;
    case 'testimonials':    html = renderTestimonials(block); break;
    case 'pricing':         html = renderPricing(block); break;
    case 'faq':             html = renderFaq(block); break;
    case 'cta_banner':      html = renderCtaBanner(block); break;
    case 'contact':         html = renderContact(block); break;
    case 'stats':           html = renderStats(block); break;
    case 'gallery':         html = renderGallery(block); break;
    case 'team':            html = renderTeam(block); break;
    case 'blog_grid':       html = renderBlogGrid(block); break;
    case 'video':           html = renderVideo(block); break;
    case 'map':             html = renderMap(block); break;
    case 'logo_cloud':      html = renderLogoCloud(block); break;
    case 'comparison':      html = renderComparison(block); break;
    case 'promo_banner':    html = renderPromoBanner(block); break;
    case 'location_finder': html = renderLocationFinder(block); break;
    case 'booking_strip':   html = renderBookingStrip(block); break;
    case 'core_values':     html = renderCoreValues(block); break;
    default: return '';
  }

  // Non-hero blocks get a scroll-reveal entrance; hero loads instantly
  const reveal = block.type === 'hero' || block.type === 'trust_bar' ? '' : ' data-reveal';
  return html.replace(/^<section/, `<section id="${block.id}"${reveal}`);
}
