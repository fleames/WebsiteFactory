// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────

export interface Theme {
  colors: {
    brand: string;       // primary brand color
    brandDark: string;   // hover/active state
    accent: string;      // contrast color (usually dark)
    background: string;
    surface: string;     // slightly off-white sections
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontHeading: string;  // Google Font name
    fontBody: string;
    scale: "compact" | "default" | "spacious";
  };
  spacing: "tight" | "default" | "loose";
  radius: "none" | "sm" | "md" | "lg" | "full";
  shadow: "none" | "sm" | "md" | "lg";
  buttons: {
    style: "filled" | "outline" | "soft";
    radius: "none" | "sm" | "md" | "lg" | "full";
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBALS (nav + footer — shared across all pages)
// ─────────────────────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[]; // dropdown
}

export interface CTA {
  label: string;
  href: string;
  style: "filled" | "outline" | "ghost";
}

export interface Nav {
  variant: "sticky_top" | "transparent_overlay" | "minimal" | "floating_glass";
  logo: { type: "text"; value: string } | { type: "image"; src: string; alt: string };
  links: NavLink[];
  cta?: CTA;
  phone?: string;        // shown in nav on mobile
  bookingUrl?: string;   // shows a "Book en tid" pill button
  bookingLabel?: string; // custom label (default: "Book en tid")
}

export interface Footer {
  variant: "minimal" | "columns" | "centered";
  tagline?: string;
  logo?: { type: "text"; value: string } | { type: "image"; src: string; alt: string };
  columns?: Array<{ heading: string; links: NavLink[] }>;
  contact?: { phone?: string; email?: string; address?: string };
  social?: Array<{
    platform: "instagram" | "facebook" | "linkedin" | "x" | "youtube" | "tiktok";
    url: string;
  }>;
  copyright: string;
}

export interface CookieBannerSettings {
  enabled: boolean;
  text?: string;
  privacyUrl?: string;
}

export interface MouseEffects {
  // ── Custom cursor
  cursor: boolean;
  cursorDotSize: number;          // diameter px
  cursorDotColor: string;         // hex
  cursorDotBlend: 'normal' | 'difference' | 'exclusion' | 'screen' | 'overlay';
  cursorRing: boolean;
  cursorRingSize: number;         // diameter px
  cursorRingColor: string;        // hex
  cursorRingOpacity: number;      // 0–1
  cursorRingWidth: number;        // border px
  cursorRingLag: number;          // lerp factor 0.01–0.5 (higher = snappier)
  cursorGlow: boolean;
  cursorGlowSize: number;         // diameter px
  cursorGlowOpacity: number;      // 0–1
  cursorGlowColor: string;        // 'brand' or hex
  cursorGlowLag: number;          // lerp factor 0.01–0.15
  cursorHoverExpand: boolean;
  cursorHoverScale: number;       // size multiplier on hover

  // ── Mouse trail
  trail: boolean;
  trailStyle: 'dots' | 'sparks' | 'comet' | 'ribbon';
  trailCount: number;             // max live particles
  trailSize: number;              // particle diameter px
  trailColor: string;             // 'brand' or hex
  trailOpacity: number;           // 0–1
  trailLifetime: number;          // fade duration ms
  trailBlend: 'normal' | 'screen' | 'overlay' | 'difference';

  // ── Click burst
  clickBurst: boolean;
  burstCount: number;             // particles per click
  burstRadius: number;            // spread px
  burstColor: string;             // 'brand' or hex
  burstGravity: number;           // downward pull 0–1
  burstSize: number;              // particle diameter px

  // ── Film grain
  grain: boolean;
  grainOpacity: number;           // 0–1
  grainFps: number;               // redraws per second
  grainScale: number;             // pixel upscale 1–4 (higher = chunkier grain)

  // ── Scroll progress bar
  scrollBar: boolean;
  scrollBarHeight: number;        // px
  scrollBarColor: string;         // 'brand' or hex
  scrollBarGlow: boolean;

  // ── Magnetic buttons
  magnetic: boolean;
  magneticStrength: number;       // pull factor 0.0–0.5
  magneticSelector: string;       // CSS selector
}

export interface Globals {
  nav: Nav;
  footer: Footer;
  formWebhook?: string;
  analyticsGtm?: string;
  analyticsGa4?: string;
  siteUrl?: string;
  cookieBanner?: CookieBannerSettings;
  mouse?: Partial<MouseEffects>;
  immersiveBg?: string; // page-level fixed canvas — never scrolls, stays behind all content
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCK SETTINGS (shared overrides on any block)
// ─────────────────────────────────────────────────────────────────────────────

export type BlockBackground = "white" | "surface" | "brand" | "brand_dark" | "dark" | "black" | "brand_tint" | "transparent";
export type BlockPaddingY = "none" | "sm" | "md" | "lg" | "xl";

export interface BlockSettings {
  background?: BlockBackground;
  paddingY?: BlockPaddingY;
  opacity?: number;         // block transparency 0–1 (default 1 = fully opaque)
  fullWidth?: boolean;      // removes max-width container
  hidden?: boolean;         // soft-delete without removing from JSON
  gradientHeading?: boolean; // applies brand gradient to the section heading
  blobs?: boolean;           // adds decorative blur blob shapes in the background
  anchor?: string;           // id for in-page navigation (e.g. "services")
  animatedBg?: 'particles' | 'aurora' | 'noise_flow' | 'geometric' | 'wave_grid' | 'cyber_grid' | 'starfield'
    | 'plasma' | 'hex_grid' | 'vortex' | 'neon_pulse' | 'matrix_rain' | 'fire' | 'circuit' | 'galaxy' | 'ripple';
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKS
// ─────────────────────────────────────────────────────────────────────────────

// — Hero ——————————————————————————————————————————————————————————————————————

export interface HeroBlock {
  id: string;
  type: "hero";
  variant: "centered" | "split_image" | "split_image_reverse" | "minimal" | "with_badge";
  data: {
    badge?: string;
    badgeIsNew?: boolean;  // prefix badge with a colored "NEW" chip
    headline: string;
    accentLine?: string;   // italic accent word/phrase appended to headline in brand color
    subtext?: string;
    ctas?: CTA[];
    chips?: string[];      // use-case tag chips below CTAs (e.g. ["SEO", "E-commerce"])
    image?: string;
    imageAlt?: string;
    videoUrl?: string;     // used only with video_bg variant
  };
  settings?: BlockSettings;
}

// — Services ——————————————————————————————————————————————————————————————————

export interface ServiceItem {
  icon?: string;          // Lucide icon name
  image?: string;
  title: string;
  description: string;
  link?: string;
}

export interface ServicesBlock {
  id: string;
  type: "services";
  variant: "grid_cards" | "list_icons" | "feature_tabs" | "split_highlight" | "circular_icons" | "glass_cards" | "bento_grid";
  data: {
    heading: string;
    subtext?: string;
    items: ServiceItem[];
    columns?: 2 | 3 | 4;
    cta?: CTA;
  };
  settings?: BlockSettings;
}

// — About ———————————————————————————————————————————————————————————————————

export interface AboutBlock {
  id: string;
  type: "about";
  variant: "split_image" | "split_image_reverse" | "centered_story" | "team_intro";
  data: {
    heading: string;
    body: string;
    highlights?: Array<{ stat: string; label: string }>;
    image?: string;
    imageAlt?: string;
    cta?: CTA;
  };
  settings?: BlockSettings;
}

// — Testimonials ——————————————————————————————————————————————————————————————

export interface TestimonialItem {
  name: string;
  location?: string;
  role?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  text: string;
  avatar?: string;
  source?: "google" | "trustpilot" | "facebook" | "direct";
}

export interface TestimonialsBlock {
  id: string;
  type: "testimonials";
  variant: "grid" | "carousel" | "featured_one" | "masonry";
  data: {
    heading?: string;
    subtext?: string;
    items: TestimonialItem[];
    aggregate?: { rating: number; count: number; source: string }; // "4.9 from 120 reviews"
  };
  settings?: BlockSettings;
}

// — Pricing ———————————————————————————————————————————————————————————————————

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: CTA;
  highlighted?: boolean;
  badge?: string;
}

export interface PricingBlock {
  id: string;
  type: "pricing";
  variant: "cards" | "table" | "simple_list";
  data: {
    heading: string;
    subtext?: string;
    disclaimer?: string;
    items: PricingTier[];
  };
  settings?: BlockSettings;
}

// — Contact ———————————————————————————————————————————————————————————————————

export type FormFieldType = "text" | "email" | "tel" | "textarea" | "select" | "checkbox";

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];  // for select
}

export interface ContactBlock {
  id: string;
  type: "contact";
  variant: "split_form" | "centered_form" | "minimal_cta";
  data: {
    heading: string;
    subtext?: string;
    form: {
      id: string;
      fields: FormField[];
      submitLabel: string;
      successMessage?: string;
      webhook?: string;    // overrides globals.formWebhook
    };
    contactInfo?: {
      phone?: string;
      email?: string;
      address?: string;
      hours?: string;
      mapEmbed?: string;
    };
  };
  settings?: BlockSettings;
}

// — FAQ ———————————————————————————————————————————————————————————————————————

export interface FaqBlock {
  id: string;
  type: "faq";
  variant: "accordion" | "two_column" | "simple_list";
  data: {
    heading?: string;
    subtext?: string;
    items: Array<{ question: string; answer: string }>;
  };
  settings?: BlockSettings;
}

// — CTA Banner ————————————————————————————————————————————————————————————————

export interface CtaBannerBlock {
  id: string;
  type: "cta_banner";
  variant: "centered" | "split" | "card" | "pattern";
  data: {
    heading: string;
    subtext?: string;
    ctas: CTA[];
  };
  settings?: BlockSettings;
}

// — Trust Bar —————————————————————————————————————————————————————————————————

export interface TrustBarBlock {
  id: string;
  type: "trust_bar";
  variant: "logos" | "badges" | "icon_row";
  data: {
    heading?: string;
    items: Array<
      | { type: "badge"; label: string; icon: string }
      | { type: "logo"; label: string; image: string; value?: string }
      | { type: "stat"; value: string; label: string }
    >;
  };
  settings?: BlockSettings;
}

// — Process ———————————————————————————————————————————————————————————————————

export interface ProcessBlock {
  id: string;
  type: "process";
  variant: "numbered_steps" | "timeline" | "icon_flow";
  data: {
    heading: string;
    subtext?: string;
    steps: Array<{ number?: number; icon?: string; title: string; description: string }>;
    cta?: CTA;
  };
  settings?: BlockSettings;
}

// — Stats —————————————————————————————————————————————————————————————————————

export interface StatsBlock {
  id: string;
  type: "stats";
  variant: "row" | "grid" | "with_icon" | "neon_counter";
  data: {
    heading?: string;
    items: Array<{ stat: string; label: string; icon?: string; description?: string }>;
  };
  settings?: BlockSettings;
}

// — Gallery ———————————————————————————————————————————————————————————————————

export interface GalleryBlock {
  id: string;
  type: "gallery";
  variant: "grid" | "masonry" | "carousel";
  data: {
    heading?: string;
    items: Array<{ src: string; alt: string; caption?: string }>;
  };
  settings?: BlockSettings;
}

// — Team ——————————————————————————————————————————————————————————————————————

export interface TeamBlock {
  id: string;
  type: "team";
  variant: "grid_cards" | "list" | "featured";
  data: {
    heading?: string;
    subtext?: string;
    members: Array<{
      name: string;
      role: string;
      bio?: string;
      image?: string;
      social?: Array<{ platform: string; url: string }>;
    }>;
  };
  settings?: BlockSettings;
}

// — Blog Grid —————————————————————————————————————————————————————————————————

export interface BlogGridBlock {
  id: string;
  type: "blog_grid";
  variant: "grid" | "list" | "featured_first";
  data: {
    heading?: string;
    source: "static" | "cms";     // static = inline, cms = fetched at build time
    posts?: Array<{
      title: string;
      slug: string;
      date: string;
      excerpt: string;
      image?: string;
      category?: string;
    }>;
    cta?: CTA;
  };
  settings?: BlockSettings;
}

// — Video ─────────────────────────────────────────────────────────────────────

export interface VideoBlock {
  id: string;
  type: 'video';
  variant: 'centered' | 'wide' | 'with_text';
  data: {
    heading?: string;
    subtext?: string;
    url: string;       // YouTube/Vimeo URL or direct video URL
    poster?: string;   // thumbnail image
    caption?: string;
    autoplay?: boolean;
  };
  settings?: BlockSettings;
}

// — Map ───────────────────────────────────────────────────────────────────────

export interface MapBlock {
  id: string;
  type: 'map';
  variant: 'full_width' | 'with_info' | 'split';
  data: {
    heading?: string;
    embedUrl: string;  // Google Maps embed URL
    address?: string;
    phone?: string;
    hours?: string;
    directionsUrl?: string;
  };
  settings?: BlockSettings;
}

// — Logo Cloud ────────────────────────────────────────────────────────────────

export interface LogoCloudBlock {
  id: string;
  type: 'logo_cloud';
  variant: 'simple' | 'with_heading' | 'card_grid' | 'marquee';
  data: {
    heading?: string;
    subtext?: string;
    items: Array<{ name: string; image?: string; url?: string }>;
  };
  settings?: BlockSettings;
}

// — Comparison ────────────────────────────────────────────────────────────────

export interface ComparisonBlock {
  id: string;
  type: 'comparison';
  variant: 'table' | 'cards';
  data: {
    heading?: string;
    subtext?: string;
    columns: Array<{ name: string; highlighted?: boolean; badge?: string }>;
    rows: Array<{ feature: string; values: string[] }>;
    cta?: CTA;
  };
  settings?: BlockSettings;
}

// — Promo Banner ──────────────────────────────────────────────────────────────

export interface PromoBannerBlock {
  id: string;
  type: 'promo_banner';
  variant: 'announcement' | 'offer' | 'urgent';
  data: {
    text: string;
    emoji?: string;
    cta?: CTA;
    dismissable?: boolean;
  };
  settings?: BlockSettings;
}

// — Location Finder ───────────────────────────────────────────────────────────

export interface LocationEntry {
  name: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
  hours?: string;
  image?: string;
  bookingUrl?: string;
  mapUrl?: string;
}

export interface LocationFinderBlock {
  id: string;
  type: 'location_finder';
  variant: 'cards' | 'list' | 'map_grid';
  data: {
    heading?: string;
    subtext?: string;
    locations: LocationEntry[];
  };
  settings?: BlockSettings;
}

// — Booking Strip ─────────────────────────────────────────────────────────────

export interface BookingStripBlock {
  id: string;
  type: 'booking_strip';
  variant: 'centered' | 'split' | 'with_phone';
  data: {
    heading: string;
    subtext?: string;
    bookingUrl: string;
    bookingLabel?: string;
    phone?: string;
    phoneLabel?: string;
  };
  settings?: BlockSettings;
}

// — Core Values ───────────────────────────────────────────────────────────────

export interface CoreValuesBlock {
  id: string;
  type: 'core_values';
  variant: 'icon_grid' | 'horizontal_list' | 'numbered';
  data: {
    heading?: string;
    subtext?: string;
    items: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  };
  settings?: BlockSettings;
}

// — Union of all block types ——————————————————————————————————————————————————

export type Block =
  | HeroBlock
  | ServicesBlock
  | AboutBlock
  | TestimonialsBlock
  | PricingBlock
  | ContactBlock
  | FaqBlock
  | CtaBannerBlock
  | TrustBarBlock
  | ProcessBlock
  | StatsBlock
  | GalleryBlock
  | TeamBlock
  | BlogGridBlock
  | VideoBlock
  | MapBlock
  | LogoCloudBlock
  | ComparisonBlock
  | PromoBannerBlock
  | LocationFinderBlock
  | BookingStripBlock
  | CoreValuesBlock;

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export interface PageSeo {
  title: string;
  description: string;
  ogImage?: string;
  noIndex?: boolean;
  schema?: "LocalBusiness" | "Organization" | "Service" | "FAQPage" | "Article";
}

export interface Page {
  id: string;
  slug: string;         // "/" for home, "/services" etc.
  title: string;        // internal label
  seo: PageSeo;
  blocks: Block[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE (top-level document)
// ─────────────────────────────────────────────────────────────────────────────

export interface BusinessInfo {
  name: string;
  industry: string;     // used by AI for context
  city: string;
  country: string;
  language: string;     // BCP-47 code: "da", "de", "en", etc.
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  founded?: string;
}

export interface Site {
  version: "1.0";
  id: string;           // uuid
  business: BusinessInfo;
  theme: Theme;
  globals: Globals;
  pages: Page[];
}
