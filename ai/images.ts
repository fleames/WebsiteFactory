import 'dotenv/config';
import type { Site, Block } from '../schema/types.js';

// ── Image source ──────────────────────────────────────────────────────────────

const PEXELS_KEY    = process.env.PEXELS_API_KEY;
const UNSPLASH_KEY  = process.env.UNSPLASH_ACCESS_KEY;

type Orientation = 'landscape' | 'portrait' | 'square';

async function fetchPexels(query: string, count: number, orientation: Orientation = 'landscape'): Promise<string[]> {
  if (!PEXELS_KEY) return [];
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=${orientation}&size=large`;
    const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
    if (!res.ok) return [];
    const json = await res.json() as { photos?: Array<{ src: { large2x: string; large: string } }> };
    return (json.photos ?? []).map(p => p.src.large2x || p.src.large);
  } catch { return []; }
}

async function fetchUnsplash(query: string, count: number, orientation: Orientation = 'landscape'): Promise<string[]> {
  if (!UNSPLASH_KEY) return [];
  try {
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${count}&orientation=${orientation}`;
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
    if (!res.ok) return [];
    const json = await res.json() as Array<{ urls: { regular: string; full: string } }>;
    if (!Array.isArray(json)) return [];
    return json.map(p => p.urls.regular);
  } catch { return []; }
}

// Fallback: deterministic Unsplash Source URL (no key, redirects to matching photo)
function unsplashSourceUrl(query: string, width: number, height: number, sig: number): string {
  return `https://source.unsplash.com/featured/${width}x${height}/?${encodeURIComponent(query)}&sig=${sig}`;
}

async function getImages(query: string, count: number, orientation: Orientation = 'landscape'): Promise<string[]> {
  const pexels = await fetchPexels(query, count, orientation);
  if (pexels.length >= count) return pexels;

  const unsplash = await fetchUnsplash(query, count, orientation);
  if (unsplash.length >= count) return unsplash;

  const combined = [...pexels, ...unsplash];
  if (combined.length > 0) return combined;

  // No API keys — generate Unsplash Source fallback URLs
  const [w, h] = orientation === 'portrait' ? [800, 1000] : orientation === 'square' ? [800, 800] : [1200, 800];
  return Array.from({ length: count }, (_, i) => unsplashSourceUrl(query, w, h, i * 31 + query.length * 7));
}

// ── Industry → search queries ─────────────────────────────────────────────────

interface IndustryQueries {
  hero:    string;
  about:   string;
  gallery: string;
  team:    string;
  blog:    string;
}

const INDUSTRY_MAP: Array<{ keywords: string[]; queries: IndustryQueries }> = [
  {
    keywords: ['vvs', 'plumber', 'plumbing', 'rør', 'pipe', 'kloakservice', 'kloak', 'drain', 'blikkenslager'],
    queries: { hero: 'plumber modern bathroom professional', about: 'plumber team workshop tools', gallery: 'bathroom renovation modern kitchen plumbing', team: 'tradesman professional portrait confident', blog: 'home plumbing improvement tips' },
  },
  {
    keywords: ['elektriker', 'electrician', 'electric', 'el-', 'strøm', 'ladestander', 'solceller', 'solar', 'energy'],
    queries: { hero: 'electrician solar panel modern energy professional', about: 'electrical team workshop professional', gallery: 'electrical installation modern home solar', team: 'electrician professional portrait hard hat', blog: 'electrical home improvement modern' },
  },
  {
    keywords: ['tandlæge', 'dentist', 'dental', 'tand', 'teeth', 'orthodontist', 'invisalign'],
    queries: { hero: 'modern dental clinic bright clean professional', about: 'dentist team clinic professional smiling', gallery: 'dental office modern equipment bright', team: 'dentist professional white coat portrait smiling', blog: 'dental health smile teeth care' },
  },
  {
    keywords: ['læge', 'doctor', 'medical', 'health', 'hospital', 'klinik', 'clinic', 'physiotherapy', 'fysio', 'kiropraktor'],
    queries: { hero: 'modern medical clinic professional healthcare bright', about: 'medical team professional clinic smiling', gallery: 'medical office healthcare modern professional', team: 'doctor professional white coat portrait confident', blog: 'health wellness medical advice' },
  },
  {
    keywords: ['psykolog', 'psychologist', 'therapist', 'terapi', 'therapy', 'coach', 'coaching', 'counseling'],
    queries: { hero: 'calm therapy office modern serene plants', about: 'therapist professional warm office', gallery: 'therapy office calm peaceful interior', team: 'therapist counselor professional warm portrait', blog: 'mental health wellness mindfulness' },
  },
  {
    keywords: ['advokat', 'lawyer', 'law', 'legal', 'juridisk', 'notary', 'revisor', 'accountant', 'bogholder', 'finans', 'finance'],
    queries: { hero: 'modern law office professional dark wood', about: 'law firm team professional meeting room', gallery: 'law office professional meeting room books', team: 'lawyer attorney professional suit portrait', blog: 'legal business financial advice' },
  },
  {
    keywords: ['gym', 'fitness', 'crossfit', 'træning', 'sport', 'workout', 'styrketræning', 'personal trainer'],
    queries: { hero: 'modern gym fitness equipment motivational', about: 'gym team trainer professional athletic', gallery: 'gym equipment modern fitness facility weights', team: 'personal trainer athletic professional portrait', blog: 'fitness workout training motivation' },
  },
  {
    keywords: ['yoga', 'pilates', 'meditation', 'mindfulness', 'wellness', 'spa', 'massage'],
    queries: { hero: 'yoga studio calm natural light serene', about: 'yoga instructor calm studio professional', gallery: 'yoga class serene studio light meditation', team: 'yoga instructor calm professional serene portrait', blog: 'yoga wellness mindfulness lifestyle' },
  },
  {
    keywords: ['restaurant', 'bistro', 'dining', 'gourmet', 'café', 'coffee', 'kaffebar', 'bar', 'vin'],
    queries: { hero: 'restaurant modern interior atmospheric dining', about: 'chef restaurant team kitchen professional', gallery: 'restaurant food beautiful plating interior', team: 'chef professional kitchen portrait confident', blog: 'food restaurant recipe culinary' },
  },
  {
    keywords: ['bageri', 'bakery', 'konditori', 'pastry', 'baking', 'bread', 'cake'],
    queries: { hero: 'bakery fresh bread pastry beautiful morning', about: 'bakery team professional shop smiling', gallery: 'bakery bread pastry beautiful artisan', team: 'baker professional apron portrait warm', blog: 'baking bread pastry recipe artisan' },
  },
  {
    keywords: ['frisør', 'hair', 'salon', 'barbershop', 'negle', 'nail', 'beauty', 'skønhed', 'kosmetik', 'lash', 'brows'],
    queries: { hero: 'hair salon modern beautiful interior bright', about: 'hair salon team stylists professional smiling', gallery: 'hair salon styling beautiful modern interior', team: 'hair stylist professional portrait smiling', blog: 'hair beauty style tips trend' },
  },
  {
    keywords: ['rengøring', 'cleaning', 'renhold', 'vask', 'service'],
    queries: { hero: 'cleaning professional modern home sparkling', about: 'cleaning team professional smiling uniform', gallery: 'clean modern home professional spotless', team: 'cleaning professional uniform portrait smiling', blog: 'cleaning home tips organization' },
  },
  {
    keywords: ['maler', 'painter', 'malerfirma', 'decorator', 'painting'],
    queries: { hero: 'house painting professional modern colorful', about: 'painter team professional work site', gallery: 'house painting renovation beautiful result modern', team: 'painter professional uniform portrait', blog: 'painting home decoration color tips' },
  },
  {
    keywords: ['tømrer', 'carpenter', 'snedker', 'byggeri', 'construction', 'byg', 'renovering'],
    queries: { hero: 'construction carpenter wood craft professional', about: 'construction team professional work site', gallery: 'carpentry woodwork beautiful renovation result', team: 'carpenter craftsman professional portrait', blog: 'home renovation construction tips' },
  },
  {
    keywords: ['murer', 'bricklayer', 'tagdækker', 'roof', 'tag', 'tile', 'flise'],
    queries: { hero: 'modern construction roofing professional quality', about: 'construction roofing team professional', gallery: 'roofing tile construction modern result quality', team: 'construction worker professional portrait', blog: 'roofing home improvement construction' },
  },
  {
    keywords: ['have', 'garden', 'haveservice', 'landscaping', 'anlæg', 'blomster', 'florist', 'gartner'],
    queries: { hero: 'beautiful garden landscaping professional green', about: 'landscaping team garden professional smiling', gallery: 'garden landscaping beautiful result modern', team: 'gardener landscape professional portrait', blog: 'gardening plants landscape tips' },
  },
  {
    keywords: ['hotel', 'accommodation', 'bnb', 'overnatning', 'resort', 'boutique'],
    queries: { hero: 'hotel lobby modern luxury beautiful interior', about: 'hotel team staff professional smiling', gallery: 'hotel room beautiful modern luxury interior', team: 'hotel staff professional portrait welcoming', blog: 'travel hotel hospitality tips' },
  },
  {
    keywords: ['arkitekt', 'architect', 'interiør', 'interior', 'design studio', 'indretning'],
    queries: { hero: 'architecture modern interior design beautiful minimal', about: 'architect design studio team professional', gallery: 'interior design modern architecture beautiful', team: 'architect designer professional portrait', blog: 'architecture interior design inspiration' },
  },
  {
    keywords: ['fotograf', 'photographer', 'photo', 'video', 'studio', 'visual'],
    queries: { hero: 'photographer camera professional studio dramatic lighting', about: 'photographer studio professional behind scenes', gallery: 'photography portfolio professional beautiful dramatic', team: 'photographer creative professional portrait', blog: 'photography tips creative visual inspiration' },
  },
  {
    keywords: ['tech', 'software', 'startup', 'app', 'saas', 'digital', 'it', 'web', 'data', 'ai'],
    queries: { hero: 'tech startup modern office team working laptop', about: 'tech team developer modern office collaborative', gallery: 'technology startup office modern workspace', team: 'developer engineer professional portrait office', blog: 'technology software innovation digital trends' },
  },
  {
    keywords: ['marketing', 'agency', 'bureau', 'creative', 'branding', 'design', 'media'],
    queries: { hero: 'creative agency modern office design team', about: 'creative agency team professional modern', gallery: 'creative agency office design work portfolio', team: 'creative professional designer portrait confident', blog: 'marketing creative design branding strategy' },
  },
  {
    keywords: ['flytning', 'moving', 'transport', 'logistics', 'delivery', 'truck', 'pakke'],
    queries: { hero: 'moving truck professional service modern', about: 'moving company team professional friendly', gallery: 'moving service professional careful packing', team: 'mover professional uniform portrait confident', blog: 'moving tips relocation advice' },
  },
  {
    keywords: ['dyrlæge', 'vet', 'veterinary', 'dyr', 'animal', 'pet', 'dog', 'cat', 'hund', 'kat'],
    queries: { hero: 'veterinarian modern clinic bright professional animal', about: 'vet team professional clinic smiling friendly', gallery: 'veterinary clinic modern animals care', team: 'veterinarian professional portrait smiling warm', blog: 'pet health veterinary care animal tips' },
  },
  {
    keywords: ['børnehave', 'daycare', 'children', 'børn', 'school', 'education', 'pædagog'],
    queries: { hero: 'childcare bright playful colorful happy children', about: 'daycare team educators smiling professional', gallery: 'childcare classroom bright colorful happy learning', team: 'educator teacher professional portrait warm smiling', blog: 'early childhood education development tips' },
  },
  {
    keywords: ['ejendom', 'ejendomsmægler', 'real estate', 'realtor', 'bolig', 'property', 'home', 'house'],
    queries: { hero: 'luxury real estate modern house exterior beautiful', about: 'real estate team professional smiling office', gallery: 'real estate property modern beautiful home interior', team: 'realtor real estate professional portrait confident', blog: 'real estate property buying selling tips' },
  },
];

const DEFAULT_QUERIES: IndustryQueries = {
  hero:    'professional business modern office bright',
  about:   'business team professional smiling office',
  gallery: 'professional work quality result modern',
  team:    'professional business portrait confident smiling',
  blog:    'business professional modern workspace tips',
};

function getIndustryQueries(industry: string): IndustryQueries {
  const lower = industry.toLowerCase();
  for (const entry of INDUSTRY_MAP) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.queries;
    }
  }
  return DEFAULT_QUERIES;
}

// ── Block-level image injection ───────────────────────────────────────────────

type PickFn = (orientation?: Orientation) => string | undefined;

function makePool(urls: string[]): PickFn {
  const used = new Set<string>();
  const arr = [...urls];
  return (orientation?: Orientation) => {
    const available = arr.filter(u => !used.has(u));
    if (!available.length) return arr[Math.floor(Math.random() * arr.length)];
    const pick = available[Math.floor(Math.random() * available.length)];
    used.add(pick);
    return pick;
  };
}

function needsImage(block: Block): boolean {
  if (block.type === 'hero') {
    const v = block.variant;
    return v === 'split_image' || v === 'split_image_reverse';
  }
  if (block.type === 'about') {
    const v = block.variant;
    return v === 'split_image' || v === 'split_image_reverse';
  }
  return block.type === 'gallery' || block.type === 'team' || block.type === 'blog_grid';
}

// ── Main enrichment function ──────────────────────────────────────────────────

export async function enrichSiteImages(
  site: Site,
  onStatus?: (msg: string) => void,
): Promise<Site> {
  const industry = site.business.industry ?? '';
  const city     = site.business.city ?? '';
  const q        = getIndustryQueries(industry);
  const lang     = site.business.language ?? 'en';

  onStatus?.('Henter billeder…');

  // Collect what we need across the whole site
  let needsHero    = false;
  let needsAbout   = false;
  let galleryCount = 0;
  let teamCount    = 0;
  let blogCount    = 0;

  for (const page of site.pages) {
    for (const block of page.blocks) {
      if (!needsImage(block)) continue;
      if (block.type === 'hero')      needsHero    = true;
      if (block.type === 'about')     needsAbout   = true;
      if (block.type === 'gallery')   galleryCount += Math.max((block as {data:{items?:unknown[]}}).data.items?.length ?? 6, 1);
      if (block.type === 'team')      teamCount    += Math.max((block as {data:{members?:unknown[]}}).data.members?.length ?? 3, 1);
      if (block.type === 'blog_grid') blogCount    += Math.max((block as {data:{posts?:unknown[]}}).data.posts?.length ?? 3, 1);
    }
  }

  // Fetch all pools in parallel
  const cityModifier = city ? ` ${city.toLowerCase()}` : '';
  const [heroUrls, aboutUrls, galleryUrls, teamUrls, blogUrls] = await Promise.all([
    needsHero    ? getImages(q.hero + cityModifier,    4, 'landscape') : Promise.resolve([]),
    needsAbout   ? getImages(q.about,                  3, 'landscape') : Promise.resolve([]),
    galleryCount ? getImages(q.gallery + cityModifier, Math.min(galleryCount + 2, 12), 'landscape') : Promise.resolve([]),
    teamCount    ? getImages(q.team,                   Math.min(teamCount + 1, 8),     'portrait')  : Promise.resolve([]),
    blogCount    ? getImages(q.blog,                   Math.min(blogCount + 1, 8),     'landscape') : Promise.resolve([]),
  ]);

  const pickHero    = makePool(heroUrls);
  const pickAbout   = makePool(aboutUrls);
  const pickGallery = makePool(galleryUrls);
  const pickTeam    = makePool(teamUrls);
  const pickBlog    = makePool(blogUrls);

  // Deep-clone the site and inject images
  const enriched = JSON.parse(JSON.stringify(site)) as Site;

  for (const page of enriched.pages) {
    for (const block of page.blocks) {
      if (!needsImage(block)) continue;

      if (block.type === 'hero') {
        const b = block as { data: { image?: string; imageAlt?: string } };
        b.data.image    ??= pickHero();
        b.data.imageAlt ??= `${site.business.name} — professionel service`;
      }

      else if (block.type === 'about') {
        const b = block as { data: { image?: string; imageAlt?: string } };
        b.data.image    ??= pickAbout();
        b.data.imageAlt ??= `${site.business.name} — vores team`;
      }

      else if (block.type === 'gallery') {
        const b = block as { data: { items: Array<{ src: string; alt: string }> } };
        b.data.items = (b.data.items ?? []).map((item, i) => {
          const isPlaceholder = !item.src || item.src.startsWith('/assets/') || item.src.startsWith('http') === false;
          if (isPlaceholder) {
            return { ...item, src: pickGallery() ?? item.src };
          }
          return item;
        });
      }

      else if (block.type === 'team') {
        const b = block as { data: { members: Array<{ image?: string; name: string }> } };
        b.data.members = (b.data.members ?? []).map(m => {
          if (!m.image || m.image.startsWith('/assets/')) {
            return { ...m, image: pickTeam() };
          }
          return m;
        });
      }

      else if (block.type === 'blog_grid') {
        const b = block as { data: { posts?: Array<{ image?: string; title: string; category?: string }> } };
        if (b.data.posts) {
          b.data.posts = b.data.posts.map(post => {
            if (!post.image || post.image.startsWith('/assets/')) {
              return { ...post, image: pickBlog() };
            }
            return post;
          });
        }
      }
    }
  }

  onStatus?.('Billeder hentet ✓');
  return enriched;
}
