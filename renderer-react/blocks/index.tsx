import React from 'react';
import type { Block } from '../../schema/types.js';
import { Hero } from './Hero.js';
import { Services } from './Services.js';
import { About } from './About.js';
import { Testimonials } from './Testimonials.js';
import { FAQ } from './FAQ.js';
import { Pricing } from './Pricing.js';
import { CTABanner } from './CTABanner.js';
import { Contact } from './Contact.js';
import { Stats } from './Stats.js';
import { Process } from './Process.js';
import { TrustBar } from './TrustBar.js';
import { Gallery } from './Gallery.js';
import { Team } from './Team.js';
import { BlogGrid } from './BlogGrid.js';
import { LogoCloud } from './LogoCloud.js';
import { Comparison } from './Comparison.js';
import { BookingStrip } from './BookingStrip.js';
import { CoreValues } from './CoreValues.js';
import { PromoBanner } from './PromoBanner.js';
// Fallback to existing string renderer for unported blocks
import { renderBlock as renderBlockLegacy } from '../../renderer/blocks/index.js';

interface Props { block: Block; brandColor: string; }

const NO_REVEAL = new Set(['hero', 'trust_bar', 'logo_cloud', 'booking_strip']);

export function BlockRenderer({ block, brandColor }: Props) {
  if (block.settings?.hidden) return null;

  let inner: React.ReactNode;

  switch (block.type) {
    case 'hero':         inner = <Hero block={block as never} brandColor={brandColor} />; break;
    case 'services':     inner = <Services block={block as never} />; break;
    case 'about':        inner = <About block={block as never} />; break;
    case 'testimonials': inner = <Testimonials block={block as never} />; break;
    case 'faq':          inner = <FAQ block={block as never} />; break;
    case 'pricing':      inner = <Pricing block={block as never} />; break;
    case 'cta_banner':   inner = <CTABanner block={block as never} />; break;
    case 'contact':      inner = <Contact block={block as never} />; break;
    case 'stats':        inner = <Stats block={block as never} />; break;
    case 'process':      inner = <Process block={block as never} />; break;
    case 'trust_bar':    inner = <TrustBar block={block as never} />; break;
    case 'gallery':      inner = <Gallery block={block as never} />; break;
    case 'team':         inner = <Team block={block as never} />; break;
    case 'blog_grid':    inner = <BlogGrid block={block as never} />; break;
    case 'logo_cloud':   inner = <LogoCloud block={block as never} />; break;
    case 'comparison':   inner = <Comparison block={block as never} />; break;
    case 'booking_strip':  inner = <BookingStrip block={block as never} />; break;
    case 'core_values':    inner = <CoreValues block={block as never} />; break;
    case 'promo_banner':   inner = <PromoBanner block={block as never} />; break;
    default: {
      const html = renderBlockLegacy(block, brandColor);
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
  }

  const { anchor, blobs, gradientHeading, opacity } = block.settings ?? {};

  return (
    <>
      {anchor && <div id={anchor} style={{ height: 0, marginBottom: 0, pointerEvents: 'none' as const }} />}
      <div id={block.id}
        data-reveal={NO_REVEAL.has(block.type) || (opacity !== undefined && opacity < 1) ? undefined : ''}
        data-gradient-heading={gradientHeading ? '' : undefined}
        data-blobs={blobs ? brandColor : undefined}
        style={opacity !== undefined && opacity < 1 ? { opacity } : undefined}>
        {inner}
      </div>
    </>
  );
}
