import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Site, Page, Block } from '../schema/types.js';
import { premiumCss } from './css.js';
import { Nav } from './layout/Nav.js';
import { Footer } from './layout/Footer.js';
import { BlockRenderer } from './blocks/index.js';
import { tailwindConfigScript } from '../renderer/utils/theme.js';
import { esc } from '../renderer/utils/html.js';
import { animatedBgScript, landingPageScript } from './shaders.js';

// ── Per-block typography overrides ───────────────────────────────────────────

function blockTypographyCss(blocks: Block[]): string {
  const SIZE: Record<string, string> = {
    xs:  'clamp(1.1rem,2.2vw,1.8rem)',
    sm:  'clamp(1.6rem,3.2vw,2.8rem)',
    lg:  'clamp(2.6rem,5.2vw,4.5rem)',
    xl:  'clamp(3.1rem,6.2vw,5.8rem)',
    '2xl':'clamp(3.8rem,7.6vw,7.5rem)',
  };
  const LS: Record<string, string> = {
    tight: '-0.04em',
    wide:  '0.06em',
    wider: '0.14em',
  };
  const EFFECTS: Record<string, string> = {
    // Solid brand gradient — works on any bg
    gradient:  `background:linear-gradient(135deg,var(--brand),var(--brand-dark,var(--brand)));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;display:inline-block;`,
    // Flowing brand sweep — no white so visible on light AND dark bg
    cosmic:    `background:linear-gradient(120deg,var(--brand-dark,var(--brand)) 0%,var(--brand) 35%,rgba(var(--brand-rgb),.55) 55%,var(--brand-dark,var(--brand)) 100%);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;display:inline-block;animation:cosmic-shift 8s ease-in-out infinite;`,
    // Moving brand shimmer — brand tints only, visible on any bg
    shimmer:   `background:linear-gradient(90deg,var(--brand) 0%,var(--brand-dark,var(--brand)) 22%,rgba(var(--brand-rgb),.4) 44%,var(--brand-dark,var(--brand)) 66%,var(--brand) 100%);background-size:250% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;display:inline-block;animation:shimmer 3s linear infinite;`,
    // Periodic glitch burst (mostly calm, twitches every ~4s)
    glitch:    `display:inline-block;animation:glitch-fx 4s steps(1) infinite;`,
    // Chromatic aberration via text-shadow — no JS/data-text needed
    chromatic: `display:inline-block;text-shadow:-1.5px 0 var(--brand),1.5px 0 var(--brand-dark,var(--brand));animation:chrom-text 3.5s ease-in-out infinite alternate;`,
  };

  const rules: string[] = [];

  for (const block of blocks) {
    const s = (block.settings ?? {}) as Record<string, unknown>;
    const id = block.id;
    const hFont    = s.headingFont    as string | undefined;
    const hColor   = s.headingColor   as string | undefined;
    const hSize    = s.headingSize    as string | undefined;
    const hWeight  = s.headingWeight  as string | undefined;
    const hAlign   = s.headingAlign   as string | undefined;
    const hLS      = s.letterSpacing  as string | undefined;
    const hEffect  = s.headingEffect  as string | undefined;
    const bColor   = s.bodyColor      as string | undefined;

    const hProps: string[] = [];

    if (hFont)   hProps.push(`font-family:'${hFont}',sans-serif`);
    if (hSize && SIZE[hSize]) hProps.push(`font-size:${SIZE[hSize]}`);
    if (hWeight) hProps.push(`font-weight:${hWeight}`);
    if (hLS && LS[hLS]) hProps.push(`letter-spacing:${LS[hLS]}`);

    const effectCss = hEffect ? EFFECTS[hEffect] : '';

    // Color only applies when no gradient effect is active
    if (hColor && !effectCss?.includes('background-clip')) {
      hProps.push(`color:${hColor}`);
    }

    if (hProps.length) {
      rules.push(`#${id} h1,#${id} h2,#${id} h3,#${id} h4{${hProps.join(';')}}`);
    }
    if (effectCss) {
      rules.push(`#${id} h1,#${id} h2,#${id} h3{${effectCss}}`);
    }
    if (hAlign && hAlign !== 'inherit') {
      rules.push(`#${id}{text-align:${hAlign}}`);
    }
    if (bColor) {
      rules.push(`#${id} p,#${id} li,#${id} blockquote{color:${bColor}}`);
    }
  }

  return rules.join('\n');
}

function extraFontLinks(blocks: Block[], siteHeading: string, siteBody: string): string[] {
  const used = new Set<string>();
  for (const block of blocks) {
    const f = ((block.settings ?? {}) as Record<string, unknown>).headingFont as string | undefined;
    if (f && f !== siteHeading && f !== siteBody) used.add(f);
  }
  return [...used].map(
    f => `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@400;500;600;700;800;900&display=swap`
  );
}

// ── Library init script builder ──────────────────────────────────────────────

function libInitScript(libs: Set<string>, brand: string, brandDark: string): string {
  const parts: string[] = [];

  // Defer until all deferred scripts have loaded via DOMContentLoaded + rAF
  parts.push(`document.addEventListener('DOMContentLoaded',function(){requestAnimationFrame(function(){`);

  // ── Splide ────────────────────────────────────────────────────────────────
  if (libs.has('splide')) {
    parts.push(`
// Splide carousels
document.querySelectorAll('.splide').forEach(function(el){
  var opts={type:'loop',perPage:el.dataset.perPage||1,gap:'1.5rem',arrows:true,pagination:true,autoplay:!!el.dataset.autoplay,pauseOnHover:true,speed:600,easing:'cubic-bezier(.25,.46,.45,.94)',breakpoints:{768:{perPage:1}}};
  if(el.dataset.perPage){opts.perPage=parseInt(el.dataset.perPage);}
  new Splide(el,opts).mount();
});`);
  }

  // ── GLightbox ─────────────────────────────────────────────────────────────
  if (libs.has('glightbox')) {
    parts.push(`
// GLightbox
if(typeof GLightbox!=='undefined'){
  GLightbox({selector:'[data-glightbox]',touchNavigation:true,loop:true,autoplayVideos:true,
    openEffect:'zoom',closeEffect:'zoom',cssEfects:{zoom:{in:'zoomIn',out:'zoomOut'}},
    skin:'glightbox-custom'});
}`);
  }

  // ── Notyf ─────────────────────────────────────────────────────────────────
  if (libs.has('notyf')) {
    parts.push(`
// Notyf — global instance on window so Contact block can call it
if(typeof Notyf!=='undefined'){
  window._notyf=new Notyf({duration:4000,position:{x:'right',y:'bottom'},ripple:true,
    types:[
      {type:'success',background:'linear-gradient(135deg,${brand},${brandDark})',icon:{className:'notyf__icon--success',tagName:'i'}},
      {type:'error',background:'#DC2626'}
    ]});
}`);
  }

  // ── Pristine form validation ──────────────────────────────────────────────
  if (libs.has('pristine')) {
    parts.push(`
// Pristine — attach to every contact form
if(typeof Pristine!=='undefined'){
  document.querySelectorAll('form[data-webhook]').forEach(function(form){
    var p=new Pristine(form,{classTo:'div',errorClass:'has-error',successClass:'has-success',errorTextParent:'div',errorTextTag:'p',errorTextClass:'form-error-text'});
    form.addEventListener('submit',function(e){if(!p.validate()){e.preventDefault();e.stopPropagation();}});
  });
}`);
  }

  // ── TypeIt typewriter ─────────────────────────────────────────────────────
  if (libs.has('typeit')) {
    parts.push(`
// TypeIt — hero cycling through chip strings
var tiEl=document.querySelector('[data-typeit-target]');
var tiStr=window._typeItStrings;
if(tiEl&&tiStr&&tiStr.length>=2&&typeof TypeIt!=='undefined'){
  var instance=new TypeIt(tiEl,{speed:60,deleteSpeed:35,waitUntilVisible:true,loop:true,cursorChar:'|',cursorSpeed:700});
  tiStr.forEach(function(s,i){
    if(i>0)instance.pause(800).delete(null,{delay:200});
    instance.type(s,{delay:i===0?800:0});
  });
  instance.pause(1200).go();
}`);
  }

  // ── Motion One ───────────────────────────────────────────────────────────────
  if (libs.has('motion')) {
    parts.push(`
// Motion One — smooth scroll-reveals + stagger grids
if(typeof Motion!=='undefined'){
  document.querySelectorAll('[data-reveal]').forEach(function(el){
    if(el.closest('[data-stagger]'))return;
    el.style.willChange='opacity,transform';
    Motion.inView(el,function(){
      el.style.transition='none';
      Motion.animate(el,{opacity:[0,1],transform:['translateY(24px)','translateY(0)']},{duration:.65,easing:[.22,1,.36,1]});
    },{margin:'0px 0px -40px 0px'});
  });
  document.querySelectorAll('[data-stagger]').forEach(function(wrap){
    var kids=[].slice.call(wrap.children).filter(function(k){return k.tagName!=='STYLE'&&k.tagName!=='SCRIPT';});
    kids.forEach(function(el){el.style.willChange='opacity,transform';el.style.transition='none';el.style.opacity='0';el.style.transform='translateY(20px)';});
    Motion.inView(wrap,function(){
      Motion.animate(kids,{opacity:[0,1],transform:['translateY(20px)','translateY(0)']},{duration:.5,delay:Motion.stagger&&Motion.stagger(.1,{start:.1})||0,easing:[.22,1,.36,1]});
    },{margin:'0px 0px -50px 0px'});
  });
}`);
  }

  // ── Anime.js ─────────────────────────────────────────────────────────────────
  if (libs.has('animejs')) {
    parts.push(`
// Anime.js — enhanced stat counter animations
if(typeof anime!=='undefined'){
  var _cio=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target;var target=parseFloat(el.dataset.countTo);var suffix=el.dataset.countSuffix||'';var dec=parseInt(el.dataset.countDec||'0');
      var proxy={val:0};
      anime({targets:proxy,val:target,duration:1800,easing:'easeOutExpo',update:function(){el.textContent=proxy.val.toFixed(dec)+suffix;}});
      _cio.unobserve(el);
    });
  },{threshold:.4});
  document.querySelectorAll('[data-count-to]').forEach(function(el){_cio.observe(el);});
}`);
  }

  parts.push(`});});`);
  return parts.join('\n');
}

// ── Conditional CDN loader ────────────────────────────────────────────────────

interface CdnAsset { js?: string; css?: string }

const CDN: Record<string, CdnAsset> = {
  splide: {
    js:  'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.6/dist/splide.umd.min.js',
    css: 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.6/dist/splide-core.min.css',
  },
  glightbox: {
    js:  'https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/glightbox.min.js',
    css: 'https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/glightbox.min.css',
  },
  notyf: {
    js:  'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js',
    css: 'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css',
  },
  pristine: {
    js:  'https://cdn.jsdelivr.net/npm/pristinejs@0.2.4/pristine.min.js',
  },
  typeit: {
    js:  'https://cdn.jsdelivr.net/npm/typeit@8.8.7/dist/index.umd.js',
  },
  motion: {
    js:  'https://cdn.jsdelivr.net/npm/motion@11.15.0/dist/motion.min.js',
  },
  animejs: {
    js:  'https://cdn.jsdelivr.net/npm/anime@3.2.1/lib/anime.min.js',
  },
};

function getPageLibs(blocks: Block[]): Set<string> {
  const libs = new Set<string>();
  for (const b of blocks) {
    if (b.type === 'testimonials' && (b as {variant?:string}).variant === 'carousel') libs.add('splide');
    if (b.type === 'gallery') { libs.add('glightbox'); if ((b as {variant?:string}).variant === 'carousel') libs.add('splide'); }
    if (b.type === 'contact') { libs.add('notyf'); libs.add('pristine'); }
    if (b.type === 'hero' && (b as {data?:{chips?:unknown[]}}).data?.chips?.length) libs.add('typeit');
    if (b.type === 'stats') libs.add('animejs');
    if (['hero','features','services','process','stats','corevalues','team','pricing','testimonials'].includes(b.type)) libs.add('motion');
  }
  return libs;
}

function headingPersonalityCss(font: string): string {
  const f = font.toLowerCase();
  if (f.includes('bebas') || f.includes('oswald'))
    return `h1,h2,h3,h4,h5,h6,.font-heading{text-transform:uppercase;letter-spacing:.06em;}h1{font-weight:400;line-height:1.0;}`;
  if (f.includes('cormorant') || f.includes('dm serif'))
    return `h1{font-style:italic;font-weight:500;letter-spacing:-.01em;}h3{font-style:italic;}`;
  if (f.includes('playfair'))
    return `h1{font-style:italic;font-weight:700;}h2{font-weight:700;}`;
  if (f.includes('syne'))
    return `h1,h2{font-weight:800;text-transform:uppercase;letter-spacing:-.03em;}`;
  if (f.includes('space grotesk'))
    return `h1,h2,h3{letter-spacing:-.045em;}`;
  if (f.includes('raleway'))
    return `h1,h2{text-transform:uppercase;letter-spacing:.04em;}`;
  return '';
}

function SitePage({ site, page }: { site: Site; page: Page }) {
  const { theme, globals, business } = site;
  const brand     = theme.colors.brand;
  const brandDark = theme.colors.brandDark ?? brand;
  const libs      = getPageLibs(page.blocks);
  const isDarkNav = !!globals.immersiveBg || (globals.nav && (page.slug === '/' || ['dark','black','transparent'].includes(page.blocks[0]?.settings?.background ?? '')));

  const siteUrl = (globals.siteUrl ?? '').replace(/\/$/,'');
  const pageUrl = siteUrl ? `${siteUrl}${page.slug === '/' ? '' : page.slug}` : '';

  const schemaJson = page.seo.schema === 'LocalBusiness'
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: business.name,
        telephone: business.phone,
        email: business.email,
        address: business.address ? { '@type': 'PostalAddress', streetAddress: business.address } : undefined,
        openingHours: business.hours,
      }, null, 2)
    : null;

  return (
    <html lang={esc(business.language ?? (business.country === 'DE' ? 'de' : 'en'))}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{page.seo.title}</title>
        <meta name="description" content={page.seo.description} />
        <meta name="theme-color" content={brand} />
        {page.seo.noIndex && <meta name="robots" content="noindex" />}
        {pageUrl && <link rel="canonical" href={pageUrl} />}
        <meta property="og:title" content={page.seo.title} />
        <meta property="og:description" content={page.seo.description} />
        <meta property="og:type" content="website" />
        {pageUrl && <meta property="og:url" content={pageUrl} />}
        {page.seo.ogImage && <meta property="og:image" content={page.seo.ogImage} />}
        {schemaJson && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
        )}
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.typography.fontHeading)}:wght@400;500;600;700;800;900&family=${encodeURIComponent(theme.typography.fontBody)}:wght@300;400;500;600;700&display=swap`}
          rel="stylesheet"
        />
        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com" />
        <script dangerouslySetInnerHTML={{ __html: tailwindConfigScript(theme).replace(/<\/?script[^>]*>/g,'').trim() }} />
        {/* Lucide icons */}
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" />
        {/* Extra Google Fonts for per-block font overrides */}
        {extraFontLinks(page.blocks, theme.typography.fontHeading, theme.typography.fontBody).map(href => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        {/* Premium CSS design system */}
        <style dangerouslySetInnerHTML={{ __html: premiumCss(brand, brandDark, theme.typography.fontHeading, theme.typography.fontBody) }} />
        <style dangerouslySetInnerHTML={{ __html: headingPersonalityCss(theme.typography.fontHeading) }} />
        {/* Per-block typography overrides */}
        {(() => { const css = blockTypographyCss(page.blocks); return css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null; })()}
        {/* Conditional library CSS */}
        {[...libs].filter(k => CDN[k]?.css).map(k => (
          <link key={k} rel="stylesheet" href={CDN[k].css} />
        ))}
        {/* Immersive fixed background — transparent body so the canvas shows through */}
        {globals.immersiveBg && (
          <style dangerouslySetInnerHTML={{ __html: `html{background:#030303!important}body{background:transparent!important}` }} />
        )}
      </head>
      <body className={globals.immersiveBg ? 'text-gray-900 antialiased' : 'bg-white text-gray-900 antialiased'}>
        {globals.immersiveBg && (
          <canvas
            data-immersive-bg={globals.immersiveBg}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' } as React.CSSProperties}
          />
        )}
        <Nav nav={globals.nav} dark={!!isDarkNav} brandColor={brand} />
        <main>
          {page.blocks.map(block => (
            <BlockRenderer key={block.id} block={block} brandColor={brand} />
          ))}
        </main>
        <Footer footer={globals.footer} business={business} brandColor={brand} />

        {/* Analytics */}
        {globals.analyticsGa4 && (
          <script dangerouslySetInnerHTML={{ __html: `
window._ga4Id='${esc(globals.analyticsGa4)}';
function _initGA4(){if(window._ga4loaded)return;window._ga4loaded=true;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+window._ga4Id;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',window._ga4Id);}
if(localStorage.getItem('cookie_consent')==='accepted')_initGA4();
          `.trim() }} />
        )}

        {/* Core init script */}
        <script dangerouslySetInnerHTML={{ __html: `
document.addEventListener('DOMContentLoaded',function(){
  lucide.createIcons();
  // Scroll reveal
  var els=document.querySelectorAll('[data-reveal]');
  if(els.length&&typeof Motion==='undefined'){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -40px 0px'});els.forEach(function(el){io.observe(el);});}
  // Stat counters — fallback when anime.js not loaded
  var counters=document.querySelectorAll('[data-count-to]');
  if(counters.length&&typeof anime==='undefined'){var cio=new IntersectionObserver(function(entries){entries.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;var target=parseFloat(el.dataset.countTo);var suffix=el.dataset.countSuffix||'';var dec=parseInt(el.dataset.countDec||'0');var dur=1600;var start=performance.now();function tick(now){var p=Math.min((now-start)/dur,1);var ease=1-Math.pow(1-p,3);el.textContent=(target*ease).toFixed(dec)+suffix;if(p<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);cio.unobserve(el);});},{threshold:.4});counters.forEach(function(el){cio.observe(el);});}
  // Mobile menu
  var mobToggle=document.getElementById('mob-toggle');var mobMenu=document.getElementById('mob-menu');if(mobToggle&&mobMenu){mobToggle.addEventListener('click',function(){mobMenu.classList.toggle('hidden');});}
  // Builder scroll
  window.addEventListener('message',function(e){if(e.data&&e.data.scrollTo){var el=document.getElementById(e.data.scrollTo);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}});
  // Cursor spotlight
  document.querySelectorAll('[data-spotlight]').forEach(function(el){el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--x',(e.clientX-r.left)+'px');el.style.setProperty('--y',(e.clientY-r.top)+'px');});});
  // Decorative blobs — injected into section so they clip/blend correctly
  document.querySelectorAll('[data-blobs]').forEach(function(wrapper){
    var target=wrapper.querySelector('section');
    if(!target)return;
    var col=wrapper.dataset.blobs||'#3B82F6';
    var b1=document.createElement('div');b1.setAttribute('aria-hidden','true');
    b1.style.cssText='position:absolute;top:-5rem;right:8%;width:28rem;height:28rem;border-radius:50%;background:radial-gradient(circle,'+col+' 0%,transparent 65%);filter:blur(72px);opacity:.18;pointer-events:none;z-index:1;';
    var b2=document.createElement('div');b2.setAttribute('aria-hidden','true');
    b2.style.cssText='position:absolute;bottom:-5rem;left:5%;width:22rem;height:22rem;border-radius:50%;background:radial-gradient(circle,'+col+' 0%,transparent 65%);filter:blur(80px);opacity:.12;pointer-events:none;z-index:1;';
    target.appendChild(b1);target.appendChild(b2);
  });
});
        `.trim() }} />
        {/* WebGL animated backgrounds + landing page immersive effects */}
        <script dangerouslySetInnerHTML={{ __html: `document.addEventListener('DOMContentLoaded',function(){\n${animatedBgScript()}\n${landingPageScript(site.globals.mouse)}\n});` }} />
        {/* Conditional library JS */}
        {[...libs].filter(k => CDN[k]?.js).map(k => (
          <script key={k} src={CDN[k].js} defer />
        ))}
        {/* Library init */}
        {libs.size > 0 && (
          <script dangerouslySetInnerHTML={{ __html: libInitScript(libs, brand, brandDark) }} />
        )}
      </body>
    </html>
  );
}

export function renderPageReact(site: Site, page: Page): string {
  const html = renderToStaticMarkup(<SitePage site={site} page={page} />);
  return '<!DOCTYPE html>\n' + html;
}
