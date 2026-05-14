// ── Style seeds — picked randomly at generation time ─────────────────────────

export interface StyleSeed {
  id: string;
  heroVariant: string;
  heroBg: 'dark' | 'black' | 'brand_dark';
  statVariant: 'row' | 'grid' | 'with_icon' | 'neon_counter';
  servicesVariant: 'grid_cards' | 'bento_grid' | 'list_icons' | 'split_highlight' | 'circular_icons' | 'glass_cards';
  processVariant: 'numbered_steps' | 'timeline' | 'icon_flow';
  testimonialsVariant: 'grid' | 'carousel' | 'featured_one';
  extraHomeBlocks: string[];
  gradientHeadingBlocks: string[];
  blobBlocks: string[];
  animatedBg: '' | 'particles' | 'aurora' | 'noise_flow' | 'geometric' | 'wave_grid' | 'cyber_grid' | 'starfield'
    | 'plasma' | 'hex_grid' | 'vortex' | 'neon_pulse' | 'matrix_rain' | 'fire' | 'circuit' | 'galaxy' | 'ripple';
  bgPalette: 'standard' | 'dark_heavy' | 'tint_heavy';
}

export const STYLE_SEEDS: StyleSeed[] = [
  {
    id: 'bold',
    heroVariant: 'with_badge',
    heroBg: 'dark',
    statVariant: 'with_icon',
    servicesVariant: 'grid_cards',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['core_values'],
    gradientHeadingBlocks: ['hero', 'stats', 'cta_banner'],
    blobBlocks: ['hero', 'cta_banner'],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'animated',
    heroVariant: 'centered',
    heroBg: 'dark',
    statVariant: 'with_icon',
    servicesVariant: 'split_highlight',
    processVariant: 'icon_flow',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['booking_strip'],
    gradientHeadingBlocks: ['hero', 'services'],
    blobBlocks: [],
    animatedBg: 'particles',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'aurora',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'row',
    servicesVariant: 'grid_cards',
    processVariant: 'timeline',
    testimonialsVariant: 'grid',
    extraHomeBlocks: [],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: ['stats'],
    animatedBg: 'aurora',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'feature-rich',
    heroVariant: 'split_image',
    heroBg: 'dark',
    statVariant: 'grid',
    servicesVariant: 'circular_icons',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['promo_banner', 'logo_cloud', 'booking_strip'],
    gradientHeadingBlocks: ['hero'],
    blobBlocks: ['about'],
    animatedBg: '',
    bgPalette: 'tint_heavy',
  },
  {
    id: 'warm',
    heroVariant: 'split_image_reverse',
    heroBg: 'dark',
    statVariant: 'row',
    servicesVariant: 'split_highlight',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['logo_cloud', 'core_values'],
    gradientHeadingBlocks: [],
    blobBlocks: ['hero', 'testimonials'],
    animatedBg: '',
    bgPalette: 'tint_heavy',
  },
  {
    id: 'minimal',
    heroVariant: 'minimal',
    heroBg: 'dark',
    statVariant: 'row',
    servicesVariant: 'list_icons',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: [],
    gradientHeadingBlocks: [],
    blobBlocks: [],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'premium',
    heroVariant: 'split_image',
    heroBg: 'black',
    statVariant: 'grid',
    servicesVariant: 'bento_grid',
    processVariant: 'timeline',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['comparison'],
    gradientHeadingBlocks: [],
    blobBlocks: [],
    animatedBg: '',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'geometric',
    heroVariant: 'centered',
    heroBg: 'dark',
    statVariant: 'with_icon',
    servicesVariant: 'circular_icons',
    processVariant: 'icon_flow',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['booking_strip'],
    gradientHeadingBlocks: ['hero', 'stats'],
    blobBlocks: ['services'],
    animatedBg: 'geometric',
    bgPalette: 'standard',
  },
  {
    id: 'futurism',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'glass_cards',
    processVariant: 'icon_flow',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['stats', 'core_values'],
    gradientHeadingBlocks: ['hero', 'cta_banner', 'services', 'stats'],
    blobBlocks: [],
    animatedBg: 'cyber_grid',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'glassmorphism',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'glass_cards',
    processVariant: 'timeline',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['stats'],
    gradientHeadingBlocks: ['hero'],
    blobBlocks: ['hero', 'services', 'cta_banner', 'stats'],
    animatedBg: 'aurora',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'cosmic',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'row',
    servicesVariant: 'bento_grid',
    processVariant: 'icon_flow',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['stats', 'logo_cloud'],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: [],
    animatedBg: 'starfield',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'vibrant',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'with_icon',
    servicesVariant: 'glass_cards',
    processVariant: 'icon_flow',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['stats'],
    gradientHeadingBlocks: ['hero', 'services', 'cta_banner'],
    blobBlocks: [],
    animatedBg: 'plasma',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'electric',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'glass_cards',
    processVariant: 'timeline',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['booking_strip'],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: [],
    animatedBg: 'neon_pulse',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'hex_tech',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'bento_grid',
    processVariant: 'icon_flow',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['comparison', 'stats'],
    gradientHeadingBlocks: ['hero', 'stats', 'cta_banner'],
    blobBlocks: [],
    animatedBg: 'hex_grid',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'inferno',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'with_icon',
    servicesVariant: 'grid_cards',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['core_values'],
    gradientHeadingBlocks: ['hero', 'stats'],
    blobBlocks: [],
    animatedBg: 'fire',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'ripple_flow',
    heroVariant: 'centered',
    heroBg: 'dark',
    statVariant: 'row',
    servicesVariant: 'split_highlight',
    processVariant: 'timeline',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: [],
    gradientHeadingBlocks: ['hero'],
    blobBlocks: ['about'],
    animatedBg: 'ripple',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'noise_drift',
    heroVariant: 'split_image',
    heroBg: 'dark',
    statVariant: 'row',
    servicesVariant: 'list_icons',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['core_values', 'logo_cloud'],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: ['about', 'testimonials'],
    animatedBg: 'noise_flow',
    bgPalette: 'tint_heavy',
  },
  {
    id: 'wave_corp',
    heroVariant: 'centered',
    heroBg: 'dark',
    statVariant: 'grid',
    servicesVariant: 'bento_grid',
    processVariant: 'timeline',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['stats', 'logo_cloud'],
    gradientHeadingBlocks: ['hero'],
    blobBlocks: [],
    animatedBg: 'wave_grid',
    bgPalette: 'standard',
  },
  {
    id: 'matrix_dev',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'glass_cards',
    processVariant: 'icon_flow',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['stats', 'comparison'],
    gradientHeadingBlocks: ['hero', 'stats', 'services', 'cta_banner'],
    blobBlocks: [],
    animatedBg: 'matrix_rain',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'vortex_energy',
    heroVariant: 'centered',
    heroBg: 'dark',
    statVariant: 'with_icon',
    servicesVariant: 'circular_icons',
    processVariant: 'icon_flow',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['stats', 'core_values'],
    gradientHeadingBlocks: ['hero', 'cta_banner', 'stats'],
    blobBlocks: [],
    animatedBg: 'vortex',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'circuit_pro',
    heroVariant: 'split_image',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'bento_grid',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['comparison', 'stats'],
    gradientHeadingBlocks: ['hero', 'stats'],
    blobBlocks: [],
    animatedBg: 'circuit',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'galaxy_soft',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'row',
    servicesVariant: 'grid_cards',
    processVariant: 'timeline',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['core_values', 'stats'],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: ['hero', 'about'],
    animatedBg: 'galaxy',
    bgPalette: 'dark_heavy',
  },

  // ── Batch 3 — 20 new seeds ────────────────────────────────────────────────

  {
    id: 'soft_glow',
    heroVariant: 'split_image_reverse',
    heroBg: 'dark',
    statVariant: 'grid',
    servicesVariant: 'glass_cards',
    processVariant: 'timeline',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['core_values', 'stats'],
    gradientHeadingBlocks: ['hero', 'services'],
    blobBlocks: ['hero', 'cta_banner'],
    animatedBg: 'aurora',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'editorial',
    heroVariant: 'split_image',
    heroBg: 'dark',
    statVariant: 'row',
    servicesVariant: 'list_icons',
    processVariant: 'timeline',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['logo_cloud'],
    gradientHeadingBlocks: [],
    blobBlocks: ['about'],
    animatedBg: '',
    bgPalette: 'tint_heavy',
  },
  {
    id: 'brutalist',
    heroVariant: 'with_badge',
    heroBg: 'dark',
    statVariant: 'with_icon',
    servicesVariant: 'grid_cards',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['stats', 'core_values'],
    gradientHeadingBlocks: ['hero'],
    blobBlocks: [],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'daylight',
    heroVariant: 'minimal',
    heroBg: 'dark',
    statVariant: 'row',
    servicesVariant: 'split_highlight',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['logo_cloud', 'booking_strip'],
    gradientHeadingBlocks: [],
    blobBlocks: [],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'neon_sprint',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'bento_grid',
    processVariant: 'icon_flow',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['stats', 'comparison'],
    gradientHeadingBlocks: ['hero', 'services', 'cta_banner', 'stats'],
    blobBlocks: [],
    animatedBg: 'neon_pulse',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'star_voyage',
    heroVariant: 'split_image',
    heroBg: 'black',
    statVariant: 'row',
    servicesVariant: 'grid_cards',
    processVariant: 'timeline',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['stats', 'logo_cloud'],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: ['about'],
    animatedBg: 'starfield',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'linen_soft',
    heroVariant: 'minimal',
    heroBg: 'dark',
    statVariant: 'row',
    servicesVariant: 'list_icons',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['logo_cloud', 'core_values'],
    gradientHeadingBlocks: [],
    blobBlocks: [],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'deep_noir',
    heroVariant: 'split_image',
    heroBg: 'black',
    statVariant: 'grid',
    servicesVariant: 'glass_cards',
    processVariant: 'timeline',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['stats'],
    gradientHeadingBlocks: [],
    blobBlocks: [],
    animatedBg: '',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'coral_bloom',
    heroVariant: 'split_image_reverse',
    heroBg: 'dark',
    statVariant: 'with_icon',
    servicesVariant: 'circular_icons',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['core_values', 'booking_strip'],
    gradientHeadingBlocks: ['hero'],
    blobBlocks: ['hero', 'testimonials'],
    animatedBg: 'particles',
    bgPalette: 'tint_heavy',
  },
  {
    id: 'crystal_clear',
    heroVariant: 'centered',
    heroBg: 'dark',
    statVariant: 'grid',
    servicesVariant: 'bento_grid',
    processVariant: 'timeline',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['stats', 'logo_cloud'],
    gradientHeadingBlocks: [],
    blobBlocks: ['services'],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'midnight_lounge',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'glass_cards',
    processVariant: 'timeline',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['stats', 'booking_strip'],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: ['hero'],
    animatedBg: 'aurora',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'candy_pop',
    heroVariant: 'centered',
    heroBg: 'brand_dark',
    statVariant: 'with_icon',
    servicesVariant: 'grid_cards',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['promo_banner', 'stats'],
    gradientHeadingBlocks: ['hero', 'services', 'cta_banner'],
    blobBlocks: ['hero', 'cta_banner'],
    animatedBg: 'particles',
    bgPalette: 'tint_heavy',
  },
  {
    id: 'copper_edge',
    heroVariant: 'split_image',
    heroBg: 'dark',
    statVariant: 'with_icon',
    servicesVariant: 'bento_grid',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['stats', 'comparison'],
    gradientHeadingBlocks: ['hero', 'stats'],
    blobBlocks: [],
    animatedBg: 'geometric',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'chrome',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'grid_cards',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['stats', 'comparison'],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: [],
    animatedBg: 'cyber_grid',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'sunrise',
    heroVariant: 'split_image',
    heroBg: 'brand_dark',
    statVariant: 'row',
    servicesVariant: 'circular_icons',
    processVariant: 'icon_flow',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['core_values', 'booking_strip'],
    gradientHeadingBlocks: ['hero'],
    blobBlocks: ['hero', 'about', 'cta_banner'],
    animatedBg: '',
    bgPalette: 'tint_heavy',
  },
  {
    id: 'urban_street',
    heroVariant: 'with_badge',
    heroBg: 'dark',
    statVariant: 'with_icon',
    servicesVariant: 'list_icons',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['gallery', 'team'],
    gradientHeadingBlocks: ['hero'],
    blobBlocks: [],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'vintage_press',
    heroVariant: 'split_image_reverse',
    heroBg: 'dark',
    statVariant: 'row',
    servicesVariant: 'grid_cards',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'carousel',
    extraHomeBlocks: ['logo_cloud', 'team'],
    gradientHeadingBlocks: [],
    blobBlocks: ['about', 'testimonials'],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'velvet',
    heroVariant: 'centered',
    heroBg: 'black',
    statVariant: 'grid',
    servicesVariant: 'split_highlight',
    processVariant: 'timeline',
    testimonialsVariant: 'featured_one',
    extraHomeBlocks: ['core_values', 'gallery'],
    gradientHeadingBlocks: ['hero', 'cta_banner'],
    blobBlocks: ['hero', 'testimonials'],
    animatedBg: '',
    bgPalette: 'dark_heavy',
  },
  {
    id: 'mint_fresh',
    heroVariant: 'split_image',
    heroBg: 'brand_dark',
    statVariant: 'row',
    servicesVariant: 'grid_cards',
    processVariant: 'numbered_steps',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['stats', 'core_values'],
    gradientHeadingBlocks: [],
    blobBlocks: ['services'],
    animatedBg: '',
    bgPalette: 'standard',
  },
  {
    id: 'quantum',
    heroVariant: 'split_image',
    heroBg: 'black',
    statVariant: 'neon_counter',
    servicesVariant: 'bento_grid',
    processVariant: 'icon_flow',
    testimonialsVariant: 'grid',
    extraHomeBlocks: ['stats', 'comparison'],
    gradientHeadingBlocks: ['hero', 'stats', 'services'],
    blobBlocks: [],
    animatedBg: 'hex_grid',
    bgPalette: 'dark_heavy',
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Keyword weights per seed — scored against the lowercased brief
const SEED_KEYWORDS: Record<string, string[]> = {
  bold: [
    // Fitness & sport (DK/DE/EN)
    'gym', 'fitness', 'træning', 'sport', 'crossfit', 'boksning', 'kampsport',
    'fitnesscenter', 'styrketræning', 'personlig træner', 'personal trainer',
    'yoga studio', 'pilates', 'svømmeklub', 'fodboldklub', 'løbeklub',
    'fitnessstudio', 'kraftsport', 'sportsklubb', 'sportverein', 'fitnessstudio',
    // Marketing & kreativt bureau (DK/DE/EN)
    'bureau', 'agency', 'marketing', 'branding', 'reklame', 'kreativ',
    'marketingbureau', 'reklamebureau', 'kreativt bureau', 'design bureau',
    'social media', 'influencer', 'content', 'pr bureau', 'mediebureau',
    'werbeagentur', 'kreativagentur', 'marketingagentur', 'digitalmarketing',
    // Energi & grøn tech (DK/DE/EN)
    'elektriker', 'electrician', 'energi', 'elbil', 'solceller', 'ladestandere',
    'solenergi', 'vindenergi', 'bæredygtig', 'grøn energi', 'varmepumpe',
    'photovoltaik', 'solaranlage', 'elektromobilitaet', 'ladestationen',
    'renewable', 'solar', 'electric vehicle', 'charging',
    // Startup & tech produkt
    'startup', 'app', 'saas', 'platform', 'bold', 'modern', 'disruption',
    'launch', 'growth', 'scale', 'venture', 'pitch',
  ],
  animated: [
    // Softwareudvikling & IT (DK/DE/EN)
    'softwareudvikling', 'programmering', 'it-konsulent', 'webbureau',
    'digital', 'software', 'it ', 'tech', 'web', 'online', 'app ', 'saas',
    'cloud', 'data', 'ai ', 'kunstig intelligens', 'automatisering',
    'programmering', 'udvikling', 'platform', 'code', 'kode',
    'webagentur', 'softwareentwicklung', 'it-beratung', 'webentwicklung',
    'softwarehaus', 'digitalagentur', 'it-dienstleistung',
    // AI, data & cybersikkerhed
    'machine learning', 'neural', 'cybersikkerhed', 'cybersecurity',
    'it-sikkerhed', 'datascience', 'analytics', 'big data', 'blockchain',
    'automation', 'robotics', 'iot', 'internet of things',
    'datenschutz', 'informationssicherheit', 'kuenstliche intelligenz',
    // Spil & interaktiv media
    'spilstudie', 'game', 'vr', 'ar', 'augmented reality', 'virtual reality',
    'animation studio', 'motion graphics', 'interactive', 'immersive',
    // Drone, UAV & luftfotografering (DK/DE/EN)
    'drone', 'uav', 'dronefilmning', 'droneinspektion', 'luftfotografering',
    'droneservice', 'droneovervågning', 'termisk drone', 'dronelevering',
    'drohne', 'drohnenservice', 'luftaufnahmen', 'drohneninspektion', 'uav-service',
    // Smart home, IoT & hjemmeautomatisering (DK/DE/EN)
    'smart home', 'hjemmeautomatisering', 'knx', 'smarthome installatør',
    'lysstyring', 'portautomatik', 'automatisk solafskærmning', 'smart belysning',
    'smart-home', 'hausautomation', 'beleuchtungssteuerung', 'torautomatik', 'smarthome',
    // Robotics, PLC & industri 4.0 (DK/DE/EN)
    'robot', 'robotteknik', 'plc programmering', 'cobots', 'intelligent produktion',
    'industri 4.0', 'digitalisering', 'maskinovervågning', 'predictive maintenance',
    'roboter', 'robotik', 'plc-programmierung', 'industrie-4.0', 'automatisierungstechnik',
    // Digital markedsføring, SEO & performance (DK/DE/EN)
    'seo', 'søgemaskineoptimering', 'google ads', 'ppc', 'performance marketing',
    'email marketing', 'marketing automation', 'lead generation', 'konverteringsoptimering',
    'suchmaschinenoptimierung', 'suchmaschinenwerbung', 'leistungsmarketing',
  ],
  aurora: [
    // Foto & kunst (DK/DE/EN)
    'fotograf', 'photograph', 'fotografstudio', 'bryllupsfotograf',
    'portrætfotograf', 'erhvervsfotograf', 'eventfotograf', 'videoproduktion',
    'hochzeitsfotograf', 'portraitfotograf', 'fotostudio',
    'kunst', 'art', 'galleri', 'gallery', 'kunstgalleri', 'atelier',
    // Wellness, spa & skønhed (DK/DE/EN)
    'spa', 'wellness', 'meditation', 'yoga', 'mindfulness', 'reiki',
    'beauty', 'kosmetik', 'kosmetolog', 'skin', 'hud', 'anti-age',
    'skønhedsklinik', 'ansigtsbehandling', 'massage', 'aromaterapi',
    'schoenheitssalon', 'kosmetikstudio', 'wellnesscenter', 'massagepraxis',
    // Fine dining & gourmet
    'fine dining', 'gourmet', 'michelin', 'vineyard', 'vinbar', 'sommelier',
    'luksus', 'luxury', 'premium', 'eksklusiv', 'bespoke', 'haute couture',
    // Bryllup & events
    'bryllup', 'wedding', 'event', 'planner', 'celebration', 'venue',
    // Bryllupslokale, festlokale & eventplanner (DK/DE/EN)
    'bryllupssted', 'bryllupslokale', 'festlokale', 'festsal',
    'bryllupsarrangør', 'konfirmationsfest', 'jubilæum', 'barnedåb',
    'bryllupsforberedelse', 'wedding planner', 'bryllupsdekoration',
    'hochzeitslocation', 'hochzeitsplanung', 'festraumvermietung', 'hochzeitsdekor',
    // Kunsthåndværk, keramik & atelier (DK/DE/EN)
    'keramik', 'pottemager', 'glaskunst', 'kunsthåndværk', 'håndlavet',
    'keramikstudie', 'glasblæsning', 'metal kunst', 'skulptur', 'tekstilkunst',
    'töpferei', 'keramikstudio', 'glaskunst', 'kunsthandwerk', 'handgemacht',
    // Blomsterhandler, florist & plantedesign (DK/DE/EN)
    'blomsterhandler', 'blomsterbinding', 'buket', 'blomsterdekoratør',
    'indendørsplanter', 'plantekrukker', 'interiorplants', 'plantevæg',
    'blumenladen', 'floristik', 'blumenhandel', 'pflanzendekoration', 'raumepflanzung',
    // Musik, scenekunst & teater (DK/DE/EN)
    'musiker', 'musikgruppe', 'kor', 'teatergruppe', 'dans', 'ballet',
    'orkester', 'sangskriver', 'cover band', 'tribute band', 'jazzband',
    'musikverein', 'theatergruppe', 'tanzschule', 'orchester', 'chor',
  ],
  'feature-rich': [
    // Sundhed & kliniker (DK/DE/EN)
    'klinik', 'clinic', 'tandlæge', 'dentist', 'læge', 'doctor', 'psykolog',
    'tandklinik', 'ortodontist', 'tandlægepraksis', 'kiropraktor', 'fysioterapeut',
    'osteopat', 'ergoterapeut', 'speciallæge', 'praktiserende læge',
    'zahnarzt', 'arztpraxis', 'physiotherapie', 'chiropraktik', 'medizin',
    // Skønhed & pleje services
    'frisør', 'salon', 'negle', 'nail', 'barbershop', 'neglestudio',
    'hårbehandling', 'extensions', 'lash', 'brows', 'frisørsalon',
    'friseursalon', 'nagelstudio', 'kosmetikerin',
    // Overnatning & hospitality
    'hotel', 'hostel', 'b&b', 'bed and breakfast', 'resort', 'boutique hotel',
    'airbnb', 'ferielejlighed', 'pension', 'kurbad',
    // Restaurant & catering (kæder)
    'restaurant', 'café', 'bistro', 'catering', 'sushi', 'pizza',
    'pizzeria', 'sushirestaurant', 'fastfood', 'takeaway', 'burger',
    'booking', 'afdeling', 'lokation', 'filial', 'kæde', 'franchise',
    'reservierung', 'gastronomie', 'restaurant-kette',
    // Rejsebureau, turisme & oplevelser (DK/DE/EN)
    'rejsebureau', 'ferierejser', 'pakkerejser', 'cruise', 'charterrejse',
    'turistattraktion', 'guidede ture', 'rejsearrangør', 'grupperejser',
    'citybreak', 'ekskursion', 'sightseeing', 'turist', 'oplevelsescenter',
    'reisebüro', 'pauschalreise', 'kreuzfahrt', 'reiseveranstalter', 'touristik',
    // Apotek, optiker & hørecenter (DK/DE/EN)
    'apotek', 'pharmacy', 'optiker', 'briller', 'kontaktlinser', 'syntest',
    'hørecenter', 'høreapparater', 'audiolog', 'ortoptist', 'audiologisk klinik',
    'apotheke', 'optiker', 'brillen', 'hörgeräte', 'hörakustik', 'optometrie',
    // Webshop, e-handel & online butik (DK/DE/EN)
    'webshop', 'nettbutik', 'onlinebutik', 'e-handel', 'nethandel',
    'online shopping', 'varekatalog', 'bestil online', 'drop shipping',
    'onlineshop', 'e-commerce', 'versandhandel', 'onlinehandel', 'webstore',
    // Biludlejning, leasing & bilabonnement (DK/DE/EN)
    'biludlejning', 'billeje', 'leasing', 'firmabil', 'flådestyring',
    'autocamper', 'bilabonnement', 'køretøjsudlejning', 'lastbilsudlejning',
    'autovermietung', 'fahrzeugleasing', 'flottenmanagement', 'mietwagen',
    // Sportsklupper & idrætsanlæg (DK/DE/EN)
    'sportsklub', 'fodboldklub', 'håndboldklub', 'tennisklub', 'golfklub',
    'badmintonklub', 'svømmeklub', 'cykelklub', 'løbeklub', 'atletikklub',
    'sportsplads', 'idrætshal', 'golfbane', 'kunstgræsbane', 'svømmebad',
    'sportverein', 'fußballverein', 'tennisverein', 'golfclub', 'hallenbad',
  ],
  warm: [
    // Rengøring & hjemmeservice (DK/DE/EN)
    'rengøring', 'cleaning', 'rengøringsservice', 'erhvervsrengøring',
    'vinduespolering', 'hjemmeservice', 'husholdning', 'vask',
    'reinigung', 'gebäudereinigung', 'haushaltsservice', 'reinigungsservice',
    // Børn & familie
    'børn', 'child', 'familie', 'dagpleje', 'børnehave', 'vuggestue',
    'sfo', 'fritidshjem', 'babysitter', 'pædiater', 'legestue',
    'kindertagesstätte', 'kindergarten', 'kinderbetreuung',
    // Bageri, mad & lokale forretninger
    'bageri', 'bakery', 'mad', 'food', 'catering', 'hjemme', 'home',
    'konditori', 'chokolade', 'is ', 'iskiosk', 'delikatesse', 'gårdbutik',
    'bäckerei', 'konditorei', 'feinkost', 'hofloaden',
    // Have & natur
    'have', 'garden', 'haveservice', 'landskab', 'blomster', 'florist',
    'anlægsgartner', 'trærydning', 'hækkeklipning', 'græsplæne',
    'gartner', 'landschaftsbau', 'gartenservice', 'floristik',
    // Dyr & kæledyr
    'dyrlæge', 'vet', 'dyr', 'pet', 'hundepasser', 'dyrepension',
    'kattepension', 'hundetræning', 'hundesalon', 'akvarium',
    'tierarzt', 'tierpension', 'hundetraining', 'hundepflege',
    // Flytning & lokale services
    'flytning', 'moving', 'transport', 'budkørsel', 'lagerservice',
    // Uddannelse, kurser & fritidsaktiviteter (DK/DE/EN)
    'skole', 'privatskole', 'friskole', 'efterskole', 'kostskole', 'musikskole',
    'danseskole', 'rideskole', 'sprogskole', 'lektiehjælp', 'undervisning',
    'tutoring', 'pædagog', 'sfo ', 'fritidstilbud', 'aftenskole', 'folkeskole',
    'schule', 'musikschule', 'tanzschule', 'nachhilfe', 'fahrschule',
    // Transport, fragt & kurér (DK/DE/EN)
    'fragtfirma', 'kurér', 'bud', 'budservice', 'expressleverance', 'fragtbil',
    'godstransport', 'speditør', 'paletfragt', 'kranvogn', 'renovationsbil',
    'spedition', 'freight', 'courier', 'lieferdienst', 'paketzustellung',
    // Landbrug, gård & natur (DK/DE/EN)
    'landbrug', 'gård ', 'biavl', 'honning', 'frugtavl', 'frilandsgrøntsager',
    'planteskole', 'juletræer', 'skovbrug', 'skovdrift', 'gartneri', 'drivhus',
    'landwirtschaft', 'bauernhof', 'hofladen', 'imkerei', 'gärtnerei', 'obstbau',
    // Foreninger, NGO & frivillige (DK/DE/EN)
    'forening', 'idrætsforening', 'kulturforening', 'borgerforening',
    'frivillig', 'velgørenhed', 'ngo', 'non-profit', 'humanitær', 'forbund',
    'brancheforening', 'fagforbund', 'interesseorganisation', 'frivilligcenter',
    'verein', 'ehrenamt', 'wohltätigkeit', 'gemeinnützig', 'nonprofit', 'stiftung',
    // Madlevering, abonnement & lokal handel (DK/DE/EN)
    'madboks', 'foodbox', 'madabonnement', 'lokal handel', 'brugsforening',
    'kolonial', 'isenkram', 'frugtbutik', 'grøntsagsbutik', 'slagter', 'fiskehandler',
  ],
  minimal: [
    // Jura & regnskab (DK/DE/EN)
    'advokat', 'lawyer', 'juridisk', 'legal', 'advokatfirma', 'advokatkontor',
    'jura', 'ret', 'fogedret', 'inkasso', 'kontrakt', 'patentadvokat',
    'rechtsanwalt', 'kanzlei', 'anwaltskanzlei', 'steuerrecht', 'notariat',
    'revisor', 'accountant', 'bogholder', 'bookkeeper', 'regnskab',
    'skatterådgiver', 'skatterevisor', 'revision', 'årsregnskab',
    'steuerberater', 'buchhalter', 'wirtschaftsprüfer', 'buchhaltung',
    // Finansiel rådgivning
    'konsulent', 'consultant', 'rådgiver', 'management consulting',
    'forsikring', 'insurance', 'bank', 'finans', 'finance', 'invest',
    'formuerådgiver', 'pensionsrådgiver', 'investering', 'portefølje',
    'versicherung', 'finanzberatung', 'vermoegensverwaltung', 'banking',
    // Coaching & terapi
    'coach', 'terapeut', 'therapist', 'psykoterapi', 'hypnose',
    'business coach', 'livscoach', 'karriererådgiver', 'executive coach',
    'ernæringsrådgiver', 'diætist', 'psykoterapeut', 'hypnoterapeut',
    'lifecoach', 'unternehmensberatung', 'karrierecoaching',
    // Rekruttering, HR & personale (DK/DE/EN)
    'rekruttering', 'headhunter', 'hr konsulent', 'jobformidling', 'vikarbureau',
    'vikar', 'personaleadministration', 'lønadministration', 'talentudvikling',
    'onboarding', 'personalejura', 'bemanding', 'rekrutteringsbureau',
    'personalberatung', 'personalvermittlung', 'headhunting', 'recruiting', 'hr-beratung',
    // Oversættelse, tolkning & sprogservice (DK/DE/EN)
    'oversætter', 'tolk', 'oversættelsesbureau', 'sprogservice', 'teknisk oversættelse',
    'simultantolkning', 'lokalisering', 'undertekster', 'korrekturlæsning',
    'übersetzungsbüro', 'dolmetscher', 'sprachdienstleister', 'lokalisierung', 'translation',
    // Kursusudbydere, certificering & efteruddannelse (DK/DE/EN)
    'kursus', 'kursusudbyder', 'efteruddannelse', 'kompetenceudvikling',
    'certificering', 'akademi', 'faglig uddannelse', 'erhvervskursus', 'AMU',
    'weiterbildung', 'fortbildung', 'zertifizierung', 'e-learning', 'ausbildung',
    // Ejendomsadministration & -forvaltning (DK/DE/EN)
    'ejendomsadministration', 'boligadministration', 'andelsbolig', 'ejerforening',
    'lejeadministration', 'viceværtservice', 'husadministration', 'boligudlejning',
    'hausverwaltung', 'mietverwaltung', 'wohnungsverwaltung', 'immobilienverwaltung',
  ],
  premium: [
    // Arkitektur & design (DK/DE/EN)
    'arkitekt', 'architect', 'arkitektfirma', 'arkitekttegning',
    'interiør', 'interior', 'interiørdesigner', 'indretningsarkitekt',
    'design studio', 'formgivning', 'produktdesign', 'industridesign',
    'architekturbüro', 'innenarchitektur', 'designstudio', 'raumgestaltung',
    // Ejendom & luksus boliger
    'ejendom', 'ejendomsmægler', 'mægler', 'realtor', 'luksus bolig',
    'penthouse', 'villa', 'eksklusive boliger', 'ejendomsinvestering',
    'immobilien', 'makler', 'luxusimmobilien', 'immobilienmakler',
    // Smykker, ure & mode
    'smykker', 'jewelry', 'ur ', 'watch', 'mode', 'fashion', 'tøj',
    'guldsmed', 'juvelerer', 'diamant', 'guld', 'sølv', 'couture',
    'modeboutique', 'designertøj', 'haute couture', 'bespoke skrædder',
    'juwelier', 'goldschmied', 'modehaus', 'luxusmode', 'designermode',
    // Generelt luksus
    'premium', 'eksklusiv', 'high-end', 'privat', 'diskret',
    'luxury', 'prestige', 'bespoke', 'tailored', 'curated',
    // Luksus biler & importører (DK/DE/EN)
    'porsche', 'ferrari', 'lamborghini', 'bentley', 'rolls royce', 'aston martin',
    'maserati', 'luksusbi', 'sportsvogn', 'super car', 'bilimportør', 'eksklusiv bil',
    'luxusauto', 'sportwagen', 'automobilimporteur', 'exklusivfahrzeug', 'luxuswagen',
    // Privatjet, yacht & helikopter (DK/DE/EN)
    'privatjet', 'charter fly', 'helikopter charter', 'jet charter',
    'yacht charter', 'superyacht', 'luksus krydstogt', 'privat sejlads',
    'hubschraubercharter', 'yachtcharter', 'luxuskreuzfahrt', 'privatflug',
    // Eksklusivt festlokale, slot & venue (DK/DE/EN)
    'slotsanlæg', 'herregård', 'gods', 'eksklusivt festlokale',
    'private dining', 'corporate events', 'galadinere', 'VIP reception',
    'schloss', 'herrenhaus', 'exklusive eventlocation', 'galaabend',
    // Eksklusiv uddannelse & kostskole (DK/DE/EN)
    'kostskole', 'privatgymnasium', 'eliteskole', 'studieforberedelse',
    'internationale skole', 'IB school', 'boarding school', 'college',
    'privatschule', 'eliteschule', 'internationale schule', 'bildungseinrichtung',
  ],
  geometric: [
    // Håndværk & bygge (DK/DE/EN)
    'tømrer', 'carpenter', 'tømrerfirma', 'snedker', 'snedkeri',
    'byg', 'byggeri', 'construction', 'bygmester', 'totalentreprise',
    'zimmererei', 'tischler', 'schreiner', 'bauunternehmen', 'bauleistung',
    'murer', 'bricklayer', 'murerforretning', 'betonarbejde', 'fundament',
    // VVS, el & teknik
    'anlæg', 'vvs', 'plumber', 'vand', 'vvs-firma', 'kloakservice',
    'vandmester', 'rørfitter', 'varmeinstallation', 'ventilation',
    'klempner', 'sanitär', 'heizung', 'lüftung', 'haustechnik',
    'elektriker', 'el-installatør', 'elentreprenør', 'stærkstrøm',
    // Overflader & finish
    'maler', 'painter', 'malerfirma', 'facademaler', 'gulvlægger',
    'tag', 'roof', 'gulv', 'floor', 'kloak', 'tagdækker', 'tagentreprenør',
    'flise', 'parket', 'epoxy', 'isolering', 'facaderenovering',
    'maler', 'bodenleger', 'dachdecker', 'fliesenleger', 'malerarbeiten',
    // Industri & teknik
    'ingeniør', 'engineer', 'installatør', 'montør', 'service',
    'maskinfabrik', 'industriservice', 'svejsning', 'metalbearbejdning',
    'bilmekaniker', 'autoværksted', 'karosseri', 'lakering',
    'ingenieurbüro', 'maschinenbau', 'stahlbau', 'metallbau',
    // Bilforhandler, brugtbiler & bilservice (DK/DE/EN)
    'bilforhandler', 'bilsalg', 'brugtbil', 'brugtbilsforhandler',
    'bilreparation', 'mekaniker', 'dæk', 'dækmontering', 'dækcenter',
    'rustbehandling', 'klimaservice', 'synsforberedelse', 'autocenter',
    'autohaus', 'gebrauchtwagen', 'kfz-werkstatt', 'reifenhandel', 'reifenwechsel',
    // Alarm, vagt & sikkerhedsanlæg (DK/DE/EN)
    'vagtfirma', 'alarminstallation', 'sikkerhedsanlæg', 'overvågning', 'adgangskontrol',
    'sikkerhedsvagt', 'kameraovervågning', 'nattevagt', 'brandalarmsanlæg',
    'sicherheitsdienst', 'alarmanlage', 'videoüberwachung', 'zugangskontrolle', 'wachdienst',
    // Container, affald & genbrug (DK/DE/EN)
    'containerudlejning', 'container ', 'affaldsservice', 'skrothandler',
    'genbrugsplads', 'bortskaffelse', 'byggeaffald', 'renovationsservice',
    'entrümpelung', 'containerservice', 'recycling', 'schrott', 'abfallentsorgung',
    // Lager, opbevaring & self storage (DK/DE/EN)
    'opbevaring', 'lager ', 'lagerhus', 'self storage', 'minilager', 'møbelopbevaring',
    'lagerraum', 'self-storage', 'möbeleinlagerung', 'lagerhalle', 'außenlager',
    // Køkken, bad & boligforbedring (DK/DE/EN)
    'køkken', 'kitchen', 'badeværelse', 'bathroom', 'køkkenmontage', 'badeværelsesrenovering',
    'køkkenforhandler', 'skabsproducent', 'garderobeskabe', 'vinduesmontage', 'vinduer',
    'küchenstudio', 'badezimmer', 'küchenplanung', 'einbauküche', 'fenster', 'türen',
  ],
  futurism: [
    // Gaming, esports & interactive
    'gaming', 'esports', 'game studio', 'spilstudie', 'twitch', 'streamer',
    'vr studio', 'ar studio', 'metaverse', 'nft', 'web3', 'dao',
    // Crypto & fintech
    'kryptovaluta', 'cryptocurrency', 'bitcoin', 'blockchain', 'defi', 'crypto',
    'fintech', 'neobank', 'digital bank', 'payment', 'betalingsløsning',
    'kryptoplatform', 'tokenisering', 'kryptobørs',
    // Futurism keywords
    'cyberpunk', 'futuristisk', 'neon', 'quantum', 'nano', 'bio-tech',
    'space tech', 'droner', 'drone', 'autonom', 'autonomous', 'neuralink',
    'transhumanist', 'silicon valley', 'deep tech', 'frontier tech',
    // Defence, security & surveillance
    'cybersikkerhed', 'cybersecurity', 'sikkerhedssoftware', 'hacking', 'pentest',
    'soc', 'threat intelligence', 'zero trust', 'infrastruktur sikkerhed',
    // Electric & future mobility
    'elbil ladestation', 'autonome køretøjer', 'hyperloop', 'jetpack',
    'fremtidens transport', 'elfly', 'urban air mobility',
  ],
  glassmorphism: [
    // Premium SaaS & dashboards
    'saas dashboard', 'analytics platform', 'business intelligence', 'bi tool',
    'crm system', 'erp system', 'projektledelse', 'project management',
    'kollaborationsværktøj', 'team tool', 'workflow', 'automation platform',
    // Design studios & creative agencies
    'design studio', 'ui ux', 'ux design', 'grafisk design', 'branding studio',
    'motion design', 'art direction', 'kreativt studie', 'digitalt bureau',
    'designbureau', 'visual identity', 'brand identity',
    // Music, media & entertainment
    'musikproduktion', 'lydstudio', 'recording studio', 'producer', 'dj',
    'musikbureau', 'management', 'talent agency', 'film produktion',
    'videoproduktion', 'podcast', 'streaming service',
    // Premium apps & platforms
    'premium app', 'mobile app', 'webapp', 'platform launch', 'beta',
    'produktvision', 'mvp', 'produkt design', 'human centered',
    // Luxury tech & lifestyle
    'luxusteknologi', 'smart home', 'smarthome', 'hjemmeautomatisering',
    'concierge service', 'on-demand', 'personaliseret', 'bespoke software',
    // HR tech, rekrutteringsplatform & people analytics (DK/DE/EN)
    'hr platform', 'hr software', 'personalestyring', 'lønplatform',
    'ansøgersystem', 'ats', 'onboarding platform', 'kompetencestyring',
    'hr-software', 'personalverwaltung', 'lohnabrechnung', 'bewerbermanagementsystem',
    // EdTech, e-learning & LMS (DK/DE/EN)
    'e-learning platform', 'lms', 'online kursus', 'microlearning',
    'uddannelsesplatform', 'læringsplatform', 'blended learning', 'edtech',
    'lernplattform', 'e-learning-plattform', 'online-kurs', 'schulungssoftware',
    // PropTech & ejendomsplatform (DK/DE/EN)
    'proptech', 'boligplatform', 'ejendomsplatform', 'udlejningssystem',
    'digital ejendom', 'boligportal', 'lejeportal', 'ejendomssoftware',
    'immobiliensoftware', 'mietverwaltung', 'proptech-plattform', 'immobilienportal',
    // LegalTech, compliance & digital signering (DK/DE/EN)
    'legaltech', 'kontraktstyring', 'compliance software', 'gdpr værktøj',
    'digital signering', 'juridisk platform', 'kontraktplatform',
    'vertragsmanagement', 'compliance-software', 'digitale unterschrift', 'rechtstech',
    // FinTech & betalingsplatform (DK/DE/EN)
    'fintech', 'betalingsplatform', 'fakturering', 'regnskabssoftware', 'bogføring',
    'invoicing', 'payment gateway', 'subscription billing', 'økonomiplatform',
    'buchhaltungssoftware', 'rechnungsstellung', 'zahlungsplattform', 'fintech-plattform',
  ],
  cosmic: [
    // Proxy, VPN, network & anonymity
    'proxy', 'vpn', 'anonymitet', 'privacy', 'anonymisering', 'ip rotation',
    'datacenter proxy', 'residential proxy', 'network security', 'scraping',
    // Space, astronomy & sci-fi
    'rumfart', 'astronomi', 'space', 'satellit', 'observatory', 'nasa',
    'telescope', 'cosmos', 'galakse', 'univers', 'astrophysics',
    // Dark / atmospheric SaaS
    'dark saas', 'developer tool', 'devtool', 'api service', 'infrastructure',
    'cloud platform', 'edge computing', 'serverless', 'headless', 'web3 tool',
    // Mystery & premium night-mode brands
    'mørk branding', 'dark mode', 'premium noir', 'midnight', 'night club',
    'eksklusivt natklub', 'mystisk', 'premium mørk', 'luxury dark',
  ],
  vibrant: [
    // Kreative bureauer & musik (DK/DE/EN)
    'musik', 'music', 'band', 'kunstner', 'artist', 'producer', 'label',
    'musikbureau', 'pladeselskab', 'lydstudio', 'recording studio', 'netlabel',
    'kreativ agency', 'art studio', 'visual art', 'illustration', 'animation',
    'festival', 'event bureau', 'koncertarrangør', 'promotor', 'booking agent',
    // Mode & livsstil
    'mode', 'fashion', 'lifestyle', 'streetwear', 'brand identity',
    'modebrand', 'tøjmærke', 'accessories', 'sneakers', 'urban',
    // Film & media
    'film', 'biograf', 'streamer', 'podcast', 'youtube', 'content creator',
    'videoproduction', 'filmproduktion', 'post production', 'vfx',
  ],
  electric: [
    // Natteliv, events & underholdning (DK/DE/EN)
    'natklub', 'nightclub', 'bar', 'klub', 'dj', 'techno', 'house', 'rave',
    'lounge', 'cocktailbar', 'rooftop bar', 'nightlife', 'party', 'event',
    'nachtclub', 'diskothek', 'veranstaltung', 'eventlocation',
    // Sport events & esports arenas
    'esports arena', 'gaming lounge', 'lan party', 'arcade', 'karting',
    'lasertag', 'escape room', 'paintball', 'go-kart', 'race track',
    // Live entertainment
    'teater', 'theatre', 'comedy', 'stand-up', 'cirkus', 'show',
    'entertainmentpark', 'forlystelsespark', 'tivoli',
  ],
  hex_tech: [
    // Blockchain, crypto & web3 (DK/DE/EN)
    'blockchain', 'kryptovaluta', 'cryptocurrency', 'bitcoin', 'ethereum',
    'defi', 'nft', 'web3', 'tokenisering', 'smart contract', 'dao',
    'kryptobørs', 'crypto exchange', 'wallet', 'kryptoplatform',
    // Cybersecurity & IT-sikkerhed
    'cybersikkerhed', 'cybersecurity', 'informationssikkerhed',
    'penetrationstest', 'pentest', 'soc', 'threat intelligence', 'zero trust',
    'firewall', 'sikkerhedsaudit', 'datasikkerhed', 'gdpr compliance',
    'it-sikkerhed', 'sicherheit', 'datenschutz', 'informationssicherheit',
    // Avanceret tech & hardware
    'chip', 'processor', 'semiconductors', 'fpga', 'embedded systems',
    'iot platform', 'edge computing', 'hardware startup', 'elektronik',
  ],
  inferno: [
    // Fitness, sport & energibrands (DK/DE/EN)
    'gym', 'fitnesscenter', 'crossfit', 'boksning', 'kampsport', 'mma',
    'styrketræning', 'personlig træner', 'personal trainer', 'bodybuilding',
    'kraftsport', 'sport', 'atletik', 'triathlon', 'spartan',
    'fitnessstudio', 'kampfsport', 'kraftsport', 'sportverein',
    // Energidrinks & supplements
    'energidrik', 'energy drink', 'supplement', 'pre-workout', 'protein',
    'sportsmad', 'ernæring', 'sportsernæring',
    // Motorbrands & off-road
    'motorcykel', 'motorcycle', 'motocross', 'offroad', 'racing', 'drift',
    'tuning', 'hot rod', 'custom bikes', 'stuntshow',
    // Tatovering & alternatve brands
    'tatovering', 'tattoo', 'piercing', 'tatoveringsstudie', 'ink',
  ],
  ripple_flow: [
    // Wellness, vand & natur (DK/DE/EN)
    'svømmeklub', 'swimming', 'pool', 'svømmehal', 'badelandet',
    'vandsport', 'surfing', 'kajak', 'kano', 'sejlsport', 'dykning',
    'svømmeskole', 'schwimmschule', 'wassersport', 'tauchen',
    // Spa & vand-baseret wellness
    'termisk bad', 'flotation', 'hydroterapi', 'vandmassage', 'balneoterapi',
    'kurbad', 'thermal spa', 'floattank', 'watsu',
    // Maritime & hav
    'marinа', 'bådeforhandler', 'sejlerskole', 'havne', 'fiskeri',
    'maritim', 'båd', 'yacht', 'sejlbåd', 'bådreparation',
    'bootshandel', 'segelschule', 'yachtcharter', 'bootswerft',
    // Psykologi & beroligende services
    'psykolog', 'terapeut', 'mindfulness', 'stresscoach', 'coaching',
  ],
  noise_drift: [
    // Management konsulenter & strategirådgivning (DK/DE/EN)
    'management konsulent', 'strategirådgiver', 'forretningsudvikling',
    'organisationsudvikling', 'procesforbedring', 'forandringsledelse',
    'transformationsrådgiver', 'change management', 'interim management',
    'unternehmensberatung', 'strategieberatung', 'organisationsberatung',
    // PR, kommunikation & public affairs (DK/DE/EN)
    'pr bureau', 'kommunikationsrådgiver', 'public affairs', 'pressekontakt',
    'reputation management', 'krisekommunikation', 'intern kommunikation',
    'pr-agentur', 'kommunikationsagentur', 'öffentlichkeitsarbeit', 'corporate communications',
    // Bæredygtighed, CSR & grøn omstilling (DK/DE/EN)
    'bæredygtighed', 'sustainability', 'csr', 'grøn omstilling', 'klimastrategi',
    'co2 reduktion', 'miljørådgiver', 'grønt regnskab', 'bæredygtig forretning',
    'nachhaltigkeit', 'klimaschutz', 'nachhaltigkeitsberatung', 'co2-bilanz',
    // Sundhedsteknologi & medtech (DK/DE/EN)
    'medtech', 'medicinsk udstyr', 'sundhedsteknologi', 'digital sundhed',
    'telemedicin', 'diagnostisk udstyr', 'medicinsk software', 'patientplatform',
    'medizintechnik', 'medizinprodukte', 'digitale gesundheit', 'telemedizin',
  ],
  wave_corp: [
    // Forsikring, pension & benefit (DK/DE/EN)
    'forsikring', 'livsforsikring', 'erhvervsforsikring', 'skadesforsikring',
    'forsikringsmægler', 'pensionsrådgiver', 'pensionskasse', 'firmapension',
    'versicherung', 'altersvorsorge', 'versicherungsmakler', 'betriebsrente',
    // Bank, kredit & erhvervsfinansiering (DK/DE/EN)
    'bank', 'pengeinstitut', 'kredit', 'realkreditlån', 'erhvervslån',
    'leasing selskab', 'factoring', 'kreditvurdering', 'erhvervsfinansiering',
    'bank', 'kredit', 'finanzierung', 'leasing', 'hypothek', 'unternehmenskredit',
    // Revisionshuse & erhvervsservice (større) (DK/DE/EN)
    'revisionshus', 'erhvervsrevision', 'due diligence', 'transfer pricing',
    'international skatterådgivning', 'corporate finance', 'kapitalmarked',
    'wirtschaftsprüfung', 'steuerprüfung', 'kapitalmarktberatung',
    // Konferencecenter, kursuscenter & erhvervslokaler (DK/DE/EN)
    'konferencecenter', 'kursuscenter', 'mødelokale', 'kontorhotel', 'co-working',
    'erhvervslokaler', 'kontorudlejning', 'erhvervsejendom', 'business park',
    'konferenzzentrum', 'tagungshotel', 'coworking', 'büroimmobilien',
  ],
  matrix_dev: [
    // Developer tools, CLI, open source & API (DK/DE/EN)
    'developer', 'devtools', 'cli tool', 'open source', 'npm package',
    'api ', 'sdk', 'library', 'framework', 'middleware', 'plugin', 'extension',
    'backend', 'frontend', 'fullstack', 'devops', 'kubernetes', 'docker',
    // Database, datainfrastruktur & streaming (DK/DE/EN)
    'database', 'datalager', 'datainfrastruktur', 'sql', 'nosql',
    'data pipeline', 'etl', 'data warehouse', 'data lake', 'kafka', 'streaming data',
    // Monitoring, observability & cloud native (DK/DE/EN)
    'monitoring', 'observability', 'logging', 'alerting', 'uptime',
    'cloud native', 'microservices', 'service mesh', 'infrastructure as code',
    // Hacker, security research & CTF (DK/DE/EN)
    'hacker', 'security research', 'ctf', 'bug bounty', 'red team', 'blue team',
    'exploit', 'vulnerability', 'reverse engineering', 'malware analysis',
    // Kryptoinfrastruktur & node operators (DK/DE/EN)
    'blockchain node', 'validator', 'staking', 'rpc provider', 'web3 infrastructure',
  ],
  vortex_energy: [
    // Vindenergi, bølgekraft & grøn energi (DK/DE/EN)
    'vindenergi', 'vindmølle', 'offshore wind', 'onshore wind', 'havvind',
    'bølgekraft', 'tidevandsenergi', 'vandkraft', 'grøn energi', 'vedvarende energi',
    'windenergie', 'windkraft', 'offshore-windpark', 'erneuerbare energien',
    // Energioptimering, audit & ISO 50001 (DK/DE/EN)
    'energioptimering', 'energibesparelse', 'energiledelse', 'iso 50001',
    'energigennemgang', 'energirenovering', 'energiaudit', 'energistyring',
    'energieoptimierung', 'energieberatung', 'energieeffizienz', 'energieaudit',
    // Motionscenter, crossfit & kampsport (DK/DE/EN)
    'crossfit box', 'holdtræning', 'funktionel træning', 'bootcamp',
    'kickboxing', 'muay thai', 'jiujitsu', 'wrestling', 'fægtning', 'parkour',
    'crossfit', 'kampfsport', 'funktionelles training', 'groupfitness',
    // E-mobility, ladeinfrastruktur & el-transport (DK/DE/EN)
    'elbil ladestation', 'ladeinfrastruktur', 'e-mobilitet', 'elbus', 'elscooter',
    'ladestandere', 'hurtiglader', 'hjemmelader', 'fleet charging',
    'ladeinfrastruktur', 'elektromobilität', 'ladestationen', 'e-fahrzeug',
  ],
  circuit_pro: [
    // Elektronik, PCB & embedded systems (DK/DE/EN)
    'elektronik', 'pcb', 'printplade', 'embedded', 'microcontroller', 'arduino',
    'elektronikproducent', 'elektronikdesign', 'hardwareudvikling', 'firmware',
    'elektronik', 'leiterplatte', 'microcontroller', 'hardwareentwicklung',
    // Test, kalibrering & kvalitetssikring (DK/DE/EN)
    'kalibrering', 'måleudstyr', 'teststationer', 'kvalitetskontrol', 'iso 9001',
    'instrumentering', 'sensorer', 'data acquisition', 'signalbehandling',
    'kalibrierung', 'messtechnik', 'prüfstand', 'qualitätssicherung', 'iso-zertifizierung',
    // Telekommunikation, netværk & fiber (DK/DE/EN)
    'telekommunikation', 'netværksinstallation', 'fiberinstallation', 'antenner',
    'radiokommunikation', 'datacenter', '5g', 'wifi installation', 'struktureret kabling',
    'telekommunikation', 'glasfaser', 'antennenbau', 'netzwerkinstallation',
    // Automation, robotteknik & MES-systemer (DK/DE/EN)
    'automation', 'robotteknik', 'plc', 'scada', 'mes system', 'industri automation',
    'pick and place', 'visionsystem', 'maskinsikkerhed', 'ce-mærkning',
    'automatisierungstechnik', 'robotertechnik', 'maschinensteuerung',
  ],
  galaxy_soft: [
    // Astrologi, healing & alternativ behandling (DK/DE/EN)
    'astrologi', 'numerologi', 'tarot', 'klairvoyance', 'healing',
    'krystalterapi', 'chakra', 'åndelig vejledning', 'shamansk', 'energihealing',
    'astrologie', 'spiritualität', 'heilpraktiker', 'energiearbeit', 'naturheilkunde',
    // Forskning, videnskab & observatorier (DK/DE/EN)
    'forskning', 'research', 'videnskab', 'laboratorium', 'universitets',
    'observatorium', 'astronomi', 'astrophysics', 'klimaforskning', 'bioforskning',
    'forschung', 'wissenschaft', 'labor', 'universität', 'sternwarte',
    // Meditation, retreats & åndelig vækst (DK/DE/EN)
    'retreat', 'meditationscenter', 'åndelig', 'silent retreat', 'vipassana',
    'zen', 'buddhistisk center', 'yoga retreat', 'spirituel', 'kontemplation',
    'retreat', 'meditationszentrum', 'spirituelles zentrum', 'yoga-retreat',
    // Psykiatri, neurologi & mental sundhed (DK/DE/EN)
    'psykiatri', 'neurologi', 'mental sundhed', 'angstbehandling', 'depression',
    'traumebehandling', 'kognitiv terapi', 'cbt', 'dbt', 'emdr',
    'psychiatrie', 'neurologie', 'psychotherapie', 'verhaltenstherapie',
  ],

  // ── Batch 3 keyword maps ──────────────────────────────────────────────────

  soft_glow: [
    // Luksus skønhed, parfume & anti-age (DK/DE/EN)
    'luksus skønhed', 'parfume', 'anti-age', 'hudpleje', 'serum', 'ansigtsbehandling',
    'skønhedssalon', 'kosmetolog', 'æstetisk klinik', 'botox', 'fillers', 'laserbehandling',
    'luxuskosmetik', 'parfüm', 'anti-aging', 'hautpflege', 'kosmetikstudio', 'ästhetik',
    // Bridal, brud & bryllupsmakeover (DK/DE/EN)
    'bryllupsmakeup', 'bryllupsfrisør', 'brud', 'bridal', 'brudepige', 'brudekjole',
    'brudebutik', 'brudekjoleforretning', 'bryllupsstylist',
    'brautmakeup', 'brautfriseur', 'brautkleid', 'brautmode',
    // Luksus privat klinik & wellness (DK/DE/EN)
    'privatklinik', 'plastikkirurgi', 'estetisk kirurgi', 'skønhedskirurgi',
    'velvære', 'wellness klinik', 'holistic health', 'ayurveda',
    'schönheitsklinik', 'privatpraxis', 'wohlbefinden', 'ganzheitlich',
  ],
  editorial: [
    // Medier, presse & journalistik (DK/DE/EN)
    'medie', 'avis', 'magasin', 'journalistik', 'nyhedsmedie', 'online medie',
    'redaktion', 'nyhedsportal', 'digitalt medie', 'tidsskrift', 'fagblad',
    'zeitung', 'magazin', 'nachrichtenportal', 'redaktion', 'onlinemedium',
    // Thinktank, NGO & kulturinstitution (DK/DE/EN)
    'thinktank', 'analyseinstitut', 'kulturhus', 'bibliotek', 'museum',
    'fondation', 'fond', 'almennyttig', 'kulturcenter', 'kulturinstitution',
    'denkfabrik', 'analyseinstitut', 'kultureinrichtung', 'bibliothek', 'museum',
    // Forfatter, forlag & indholdsproduktion (DK/DE/EN)
    'forfatter', 'forlag', 'bogforlag', 'udgiver', 'copywriter', 'tekstforfatter',
    'ghostwriter', 'indholdsstrateg', 'content strategist', 'redaktør',
    'verlag', 'buchverlag', 'texter', 'lektor', 'ghostwriter',
  ],
  brutalist: [
    // Startup launch & disruptive produkter (DK/DE/EN)
    'launch', 'product launch', 'beta launch', 'mvp launch', 'go to market',
    'startup', 'disruptive', 'manifesto', 'revolution', 'challenger brand',
    'direct to consumer', 'd2c', 'brand launch', 'product drop',
    // Venture, accelerator & pitch (DK/DE/EN)
    'accelerator', 'incubator', 'venture capital', 'vc', 'angel investor',
    'seed funding', 'pre-seed', 'series a', 'startup hub', 'co-founder',
    'accelerator', 'risikokapital', 'gründerzentrum', 'startup-ökosystem',
    // Politisk kampagne & advocacy (DK/DE/EN)
    'kampagne', 'politisk', 'valg', 'parti', 'bevægelse', 'advocacy',
    'aktivisme', 'borgerrettigheder', 'socialt engagement',
    'wahlkampagne', 'politische partei', 'bürgerbewegung',
  ],
  daylight: [
    // SaaS, produktivitetsværktøjer & no-code (DK/DE/EN)
    'saas', 'produktivitetsværktøj', 'no-code', 'low-code', 'workflow tool',
    'task management', 'projektledelse', 'time tracking', 'notestaking',
    'collaboration tool', 'remote work', 'distributed team',
    'produktivitätssoftware', 'no-code-tool', 'projektmanagement',
    // CleanTech & grøn startup (DK/DE/EN)
    'cleantech', 'grøn startup', 'klimateknologi', 'bæredygtig startup',
    'grøn innovation', 'cirkulær økonomi', 'zero waste', 'net zero',
    'cleantech', 'klimatechnologie', 'nachhaltige innovation', 'kreislaufwirtschaft',
    // Freelance platform & marketplace (DK/DE/EN)
    'freelance', 'marketplace', 'platform', 'markedsplads', 'job platform',
    'gig economy', 'talent marketplace', 'consultant marketplace',
    'freiberufler', 'marktplatz', 'plattform', 'auftragsplattform',
  ],
  neon_sprint: [
    // Esports, gaming gear & streamer (DK/DE/EN)
    'esports', 'gaming peripherals', 'gaming chair', 'gaming desk', 'gaming gear',
    'streamer', 'twitch', 'youtube gaming', 'gaming brand', 'pro gaming',
    'esport', 'gaming-ausrüstung', 'streaming', 'zubehör für gamer',
    // Energidrik, pre-workout & supplements brand (DK/DE/EN)
    'energidrik brand', 'pre-workout brand', 'supplement brand', 'protein brand',
    'sports nutrition brand', 'beverage brand', 'performance drink',
    'energydrink-marke', 'supplement-marke', 'sportgetränk',
    // Ekstremsport & adventure brand (DK/DE/EN)
    'ekstremsport', 'base jump', 'wingsuit', 'free climbing', 'bouldering',
    'mountainbike brand', 'adventure brand', 'extreme', 'adrenalin',
    'extremsport', 'klettern', 'mountainbiking', 'abenteuermarke',
  ],
  star_voyage: [
    // Rejse, fly & turisme (DK/DE/EN)
    'rejse', 'flyrejse', 'flybillet', 'flyselskab', 'lufthavn', 'charter',
    'langdistancerejse', 'businessrejse', 'ferierejse', 'rundrejse',
    'flugreise', 'fluggesellschaft', 'flugticket', 'reiseveranstalter',
    // Krydstogt, luksusrejse & privat rejsearrangør (DK/DE/EN)
    'krydstogt', 'cruise', 'luksusrejse', 'privat rejsearrangør',
    'eksklusive rejser', 'skræddersyet rejse', 'honeymoon rejse',
    'kreuzfahrt', 'luxusreise', 'maßgeschneiderte reise', 'flitterwochen',
    // Romfart, astronomi & sci-fi brand (DK/DE/EN)
    'rumfart', 'space tourism', 'satellit', 'raket', 'nasa', 'esa',
    'planetarium', 'teleskop', 'astronomi klub', 'rumprogram',
    'raumfahrt', 'weltraumtourismus', 'planetarium', 'teleskop',
  ],
  linen_soft: [
    // B2B service, rådgivning & interim (DK/DE/EN)
    'b2b', 'erhvervsrådgivning', 'forretningsrådgiver', 'interim',
    'ekstern direktør', 'fractional cfo', 'fractional cto', 'board advisor',
    'b2b-beratung', 'unternehmensberater', 'interimsmanager',
    // Notarialservice & retshjælp (DK/DE/EN)
    'notar', 'notarialservice', 'retshjælp', 'juridisk bistand',
    'testamente', 'arv', 'boopgørelse', 'tinglysning',
    'notar', 'notarservice', 'rechtsberatung', 'erbschaft', 'nachlassbearbeitung',
    // Offentlige institutioner & myndigheder (DK/DE/EN)
    'kommune', 'statslig', 'myndighed', 'offentlig institution', 'ministerium',
    'styrelse', 'region', 'kommunal', 'offentlig forvaltning',
    'kommune', 'behörde', 'öffentliche einrichtung', 'ministerium', 'amt',
  ],
  deep_noir: [
    // Film, tv-produktion & post-produktion (DK/DE/EN)
    'film produktion', 'tv-produktion', 'post-produktion', 'filmselskab',
    'produktionsselskab', 'vfx', 'color grading', 'klipning', 'lyddesign',
    'filmproduktion', 'fernsehproduktion', 'nachbearbeitung', 'filmstudio',
    // Luksus modefotografi & kommerciel fotograf (DK/DE/EN)
    'modefotograf', 'kommerciel fotograf', 'produktfotograf', 'reklamefotograf',
    'editorialfotograf', 'katalogfotografi', 'lookbook fotografi',
    'modefotograf', 'werbefotograf', 'produktfotografie', 'lookbook',
    // Luksus tøjmærke & designermærke (DK/DE/EN)
    'designermærke', 'luksustøj', 'eksklusive tøj', 'couture', 'atelier',
    'dansk mode', 'skandinavisk design', 'slow fashion', 'ready-to-wear',
    'designermarke', 'luxusmode', 'modeatelier', 'skandinavisches design',
  ],
  coral_bloom: [
    // Personlig branding & influencer (DK/DE/EN)
    'personlig branding', 'personal brand', 'influencer', 'content creator',
    'brand ambassador', 'instagram brand', 'lifestyle brand', 'thought leader',
    'persönliches branding', 'influencer-marketing', 'lifestyle-marke',
    // Beauty & wellness coach (DK/DE/EN)
    'beauty coach', 'wellness coach', 'hormonbalance', 'fertilitetscoach',
    'menstruation', 'kvindekrop', 'holistic beauty', 'naturlig skønhed',
    'beauty-coaching', 'wellness-coaching', 'frauengesundheit', 'naturschönheit',
    // Håndlavet smykker & accessories (DK/DE/EN)
    'håndlavet smykker', 'jewelry designer', 'accessories brand', 'sølvsmykker',
    'guldsmykker', 'sterling sølv', 'minimalistiske smykker', 'custom smykker',
    'handgemachter schmuck', 'schmuckdesignerin', 'silberschmuck', 'goldschmuck',
  ],
  crystal_clear: [
    // Biotech, pharma & klinisk forskning (DK/DE/EN)
    'biotech', 'bioteknologi', 'pharma', 'farmaceutisk', 'klinisk forskning',
    'klinisk studie', 'medicinsk forskning', 'drug development', 'genomik',
    'biotech', 'biotechnologie', 'pharmazeutisch', 'klinische forschung',
    // Medicinsk udstyr & diagnostik (DK/DE/EN)
    'medicinsk udstyr', 'diagnostisk', 'imaging', 'mri', 'ultralyd',
    'laboratorieudstyr', 'in vitro diagnostik', 'medicinsk software',
    'medizinisches gerät', 'diagnostik', 'bildgebung', 'laborgeräte',
    // Sundhedsplatform & digital sundhed (DK/DE/EN)
    'sundhedsplatform', 'digital sundhed', 'sundhedsapp', 'telemedicin',
    'patientportal', 'epj', 'electronic health record', 'sundhedsdata',
    'gesundheitsplattform', 'digitale gesundheit', 'patientenportal', 'telemedizin',
  ],
  midnight_lounge: [
    // Cocktailbar, vinbar & lounge (DK/DE/EN)
    'cocktailbar', 'vinbar', 'lounge', 'speakeasy', 'bartender', 'mixologi',
    'whiskybar', 'rum bar', 'craft cocktails', 'tasting menu',
    'cocktailbar', 'weinbar', 'lounge', 'mixologie', 'whiskybar', 'craftcocktails',
    // Jazz, live musik & premium klub (DK/DE/EN)
    'jazz klub', 'live musik', 'jazzbar', 'blues bar', 'piano bar',
    'musikscene', 'liveunderholdning', 'premium natklub', 'eksklusive club',
    'jazzclub', 'livemusik', 'bluesbar', 'pianobar', 'exklusiver club',
    // Casinohotel & resort (DK/DE/EN)
    'casino', 'casinohotel', 'luxury resort', 'five star', 'femstjernet',
    'suite hotel', 'boutique luxury', 'grand hotel', 'palace hotel',
    'casino', 'luxusresort', 'fünf-sterne-hotel', 'grandhotel', 'palasthotel',
  ],
  candy_pop: [
    // Børneaktiviteter, legecentre & familiepark (DK/DE/EN)
    'legecenter', 'legepark', 'børnepark', 'trampolinpark', 'børneaktiviteter',
    'familiepark', 'børnefødselsdage', 'underholdning for børn',
    'spielcenter', 'trampolinpark', 'kinderpark', 'freizeitpark für kinder',
    // Slik, konfekture & sukkervarer (DK/DE/EN)
    'slik', 'slikkepind', 'chokoladekasse', 'konfekture', 'bolsjer', 'karamel',
    'slikbutik', 'godteribod', 'candy store', 'sukkervarer',
    'süßwarenladen', 'bonbons', 'schokolade', 'konfiserie', 'zuckerwaren',
    // Børnetøj, legetøj & babyvarer (DK/DE/EN)
    'børnetøj', 'legetøj', 'babyvarer', 'babyudstyr', 'børnebutik',
    'pusling', 'barnevogn', 'barneklær', 'toy brand', 'educational toys',
    'kinderbekleidung', 'spielzeug', 'babyartikel', 'kindermode',
  ],
  copper_edge: [
    // Premium industridesign & produktion (DK/DE/EN)
    'industridesign', 'produktdesign', 'industriel produktion', 'fremstilling',
    'manufacturing', 'OEM', 'prototypeproduktion', 'small batch produktion',
    'industriedesign', 'produktentwicklung', 'fertigungsunternehmen', 'serienfertigung',
    // Arkitektfirma & byplanlægning (DK/DE/EN)
    'byplanlægning', 'urban design', 'landskabsarkitekt', 'byrum',
    'byggeprojekt', 'boligprojekt', 'ejendomsudvikling', 'totalrådgiver',
    'stadtplanung', 'landschaftsarchitekt', 'städtebau', 'bauprojektentwicklung',
    // Premium møbelproducent & interiørbrand (DK/DE/EN)
    'møbelproducent', 'møbeldesign', 'snedkerier', 'håndlavet møbel',
    'interiørbrand', 'designmøbler', 'kontormøbler', 'indretningsløsninger',
    'möbelhersteller', 'möbeldesign', 'handgefertigte möbel', 'inneneinrichtung',
  ],
  chrome: [
    // Bilforhandler premium & sportsvogne (DK/DE/EN)
    'sportsvogn', 'performance bil', 'high performance', 'trackday', 'racerbane',
    'bilimportør', 'eksklusiv bilforhandler', 'luksussalg', 'showroom',
    'sportwagen', 'leistungsfahrzeug', 'autohaus premium', 'luxusautohändler',
    // Tuning, lakering & bodywork (DK/DE/EN)
    'tuning', 'chiptuning', 'stage 2', 'bodykit', 'lakering', 'foliering',
    'carbonfiber', 'custom bil', 'racerbil', 'drifting', 'drag racing',
    'tuning', 'chiptuning', 'folierung', 'karosseriebau', 'motorsport',
    // Motorcykel brand & accessoires (DK/DE/EN)
    'motorcykel brand', 'mc tilbehør', 'motorcykeludstyr', 'hjelme', 'gear',
    'custom chopper', 'custom bike', 'café racer', 'scrambler',
    'motorradbekleidung', 'motorradzubehör', 'custom-motorrad', 'caféracer',
  ],
  sunrise: [
    // Yoga, pilates & mindful bevægelse (DK/DE/EN)
    'yoga', 'pilates', 'yin yoga', 'hot yoga', 'power yoga', 'ashtanga',
    'yogastudie', 'yogastudio', 'pilatesstudio', 'breathwork', 'somatic',
    'yoga', 'pilates', 'yogastudio', 'pilatestudio', 'atemarbeit', 'atemtherapie',
    // Sundhedscoach, nutritionist & krop (DK/DE/EN)
    'sundhedscoach', 'nutritionist', 'ernæringsekspert', 'kostvejleder',
    'hormoner', 'funktionel medicin', 'autoimmun', 'gut health', 'tarmflora',
    'gesundheitscoach', 'ernährungsberaterin', 'funktionelle medizin', 'darmgesundheit',
    // Løb, marathon & outdoor fitness (DK/DE/EN)
    'løbecoach', 'marathon', 'ultra løb', 'trail running', 'triatlon coach',
    'cykelcoach', 'udendørs fitness', 'outdoor træning', 'naturløb',
    'laufcoach', 'marathontraining', 'ultramarathon', 'trailrunning', 'triathlon',
  ],
  urban_street: [
    // Streetwear, sneakers & urban brand (DK/DE/EN)
    'streetwear', 'sneakers', 'urban fashion', 'hypebeast', 'drop', 'limited edition',
    'streetwear brand', 'sneaker boutique', 'urban lifestyle', 'skateboard',
    'streetwear-marke', 'sneakerkultur', 'skateboardshop', 'urban lifestyle',
    // Barbershop, herreklipning & mandegrooming (DK/DE/EN)
    'barbershop', 'herreklipning', 'fadein', 'skæg', 'skægtrimning',
    'herrefrisør', 'grooming', 'mandegrooming', 'hot towel shave',
    'barbershop', 'herrenfriseur', 'bartpflege', 'männerpflege', 'rasur',
    // Tatovering, piercing & body art (DK/DE/EN)
    'tatovering', 'tattoo studio', 'tatovør', 'piercing', 'body art',
    'old school tattoo', 'black and grey', 'fine line', 'realistisk tattoo',
    'tattoo', 'tattoostudio', 'tätowierung', 'piercingstudio', 'körperkunst',
  ],
  vintage_press: [
    // Craft beer, bryggeri & mikrobrygning (DK/DE/EN)
    'craft beer', 'bryggeri', 'mikrobryggeri', 'hjemmebryggeri', 'ipa', 'ale',
    'stout', 'sour beer', 'bryggeriklubb', 'taproom', 'øl smagning',
    'craft beer', 'brauerei', 'mikrobrauerei', 'heimbrauerei', 'biersommelier',
    // Whisky, gin & destilleri (DK/DE/EN)
    'whisky', 'whiskey', 'destilleri', 'gin', 'rom', 'vodka', 'snaps',
    'spiritus', 'håndlavet spiritus', 'dansk destilleri', 'snapsebryggeri',
    'whisky', 'destillerie', 'gin', 'rum', 'handgemachter schnaps',
    // Vintage, antikviteter & genbrugsmode (DK/DE/EN)
    'vintage', 'antikviteter', 'antik', 'retro', 'genbrugsmode', 'second hand',
    'brugtbutik', 'thrift store', 'vintage butik', 'samlerobjekter',
    'vintage', 'antiquitäten', 'retromode', 'secondhand', 'trödel',
  ],
  velvet: [
    // Luksus livsstil & eksklusivt brand (DK/DE/EN)
    'luksus livsstil', 'eksklusivt brand', 'prestige brand', 'high-end brand',
    'concierge', 'privat klub', 'members only', 'invitation only', 'sorte kort',
    'luxusmarke', 'lifestyle-marke', 'prestige', 'private members club',
    // Haute couture, skræddersyet tøj & haute joaillerie (DK/DE/EN)
    'skræddersyet', 'haute couture', 'couture atelier', 'bespoke suit', 'sartorial',
    'skræddermester', 'eksklusive kjoler', 'aftenkjole', 'galla',
    'maßgeschneidert', 'schneiderei', 'couture', 'abendmode', 'galakleider',
    // Eksklusive parfumer, skønhed & ritualer (DK/DE/EN)
    'niche parfume', 'eksklusiv parfume', 'duft atelier', 'luksus hudpleje',
    'skønhedsritual', 'guldbehandling', 'eksklusiv massageolie',
    'nischeparfüm', 'luxuskosmetik', 'duftkreation', 'pflegeriual',
  ],
  mint_fresh: [
    // Organic, øko & ren mad (DK/DE/EN)
    'organic', 'øko', 'biodynamisk', 'ren mad', 'naturlig mad', 'plantebaseret',
    'veganisme', 'vegansk', 'vegetarisk', 'glutenfri', 'superfood', 'rawfood',
    'bio', 'ökologisch', 'biodynamisch', 'pflanzenbasiert', 'vegankost', 'superfood',
    // Naturkosmetik, grøn skønhed & zero waste (DK/DE/EN)
    'naturkosmetik', 'grøn skønhed', 'zero waste', 'plastikfri', 'refill',
    'bæredygtig kosmetik', 'clean beauty', 'vegan kosmetik', 'cruelty free',
    'naturkosmetik', 'grüne schönheit', 'plastikfrei', 'zero-waste', 'clean beauty',
    // Miljø, klima & bæredygtighed (DK/DE/EN)
    'miljø', 'klima', 'co2 neutral', 'klimaneutral', 'bæredygtig', 'grøn',
    'regenerativt landbrug', 'biodiversitet', 'naturbevarelse', 'miljøorganisation',
    'umwelt', 'klimaneutral', 'nachhaltigkeit', 'regenerative landwirtschaft',
  ],
  quantum: [
    // Kvanteteknologi, AI-forskning & deeptech (DK/DE/EN)
    'kvantecomputer', 'quantum computing', 'kvantekryptografi', 'quantum security',
    'deep tech', 'ai forskning', 'ai laboratorium', 'large language model', 'llm',
    'quantencomputer', 'quantenkryptographie', 'deep-tech', 'ki-forschung',
    // Forsvar, efterretning & kritisk infrastruktur (DK/DE/EN)
    'forsvar', 'defense', 'militær teknologi', 'dual use', 'efterretning',
    'kritisk infrastruktur', 'national sikkerhed', 'surveillance tech',
    'verteidigung', 'militärtechnologie', 'nachrichtendienst', 'kritische infrastruktur',
    // Bioinformatik, genomik & syntetisk biologi (DK/DE/EN)
    'bioinformatik', 'genomik', 'crispr', 'syntetisk biologi', 'proteomik',
    'drug discovery', 'computational biology', 'bioinformatics', 'molecular dynamics',
    'bioinformatik', 'genomik', 'synthetische biologie', 'wirkstoffforschung',
  ],
};

export function pickSeedForBrief(brief: string): StyleSeed {
  const lower = brief.toLowerCase();
  const scores: Record<string, number> = {};
  for (const seed of STYLE_SEEDS) scores[seed.id] = 0;

  for (const [seedId, keywords] of Object.entries(SEED_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) scores[seedId] = (scores[seedId] ?? 0) + 1;
    }
  }

  // Sort all seeds that got at least one match, pick randomly from the top 3
  // so same brief produces different-looking sites on repeated generation
  const ranked = STYLE_SEEDS
    .map(s => ({ seed: s, score: scores[s.id] ?? 0 }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return pickRandom(STYLE_SEEDS);
  return pickRandom(ranked.slice(0, 3).map(x => x.seed));
}

// ── Phase 1: Shell prompt ─────────────────────────────────────────────────────

export const SHELL_SYSTEM_PROMPT = `\
You are an expert website architect. Given a business brief and a style seed, output a site shell via the submit_shell tool.
The shell contains: business info, theme, nav/footer globals, and a block plan for each page.
Never respond with plain text — always call submit_shell.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHELL SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "version": "1.0",
  "id": "proj_{slug}",
  "business": {
    "name": string,
    "industry": string,
    "city": string,
    "country": "DK"|"DE"|"AT"|"CH"|"GB"|"US"|...,
    "language": string (BCP-47: "da" Danish, "de" German, "en" English),
    "phone": string,
    "email": string,
    "address": string,
    "hours": string,
    "founded": string (optional)
  },
  "theme": {
    "colors": {
      "brand": string (hex),
      "brandDark": string (hex, ~15% darker),
      "accent": "#111827",
      "background": "#FFFFFF",
      "surface": "#F9FAFB",
      "text": "#111827",
      "textMuted": "#6B7280",
      "border": "#E5E7EB",
      "success": "#10B981",
      "warning": "#F59E0B",
      "error": "#EF4444"
    },
    "typography": { "fontHeading": string, "fontBody": "Inter", "scale": "default" },
    "spacing": "default",
    "radius": "sm"|"md"|"lg"|"full",
    "shadow": "sm"|"md"|"lg",
    "buttons": { "style": "filled"|"outline"|"ghost", "radius": "sm"|"md"|"lg"|"full" }
  },
  "globals": {
    "nav": {
      "variant": "sticky_top",
      "logo": { "type": "text", "value": string },
      "links": [ { "label": string, "href": string } ],
      "cta": { "label": string, "href": string, "style": "filled" },
      "phone": string,
      "bookingUrl"?: string,
      "bookingLabel"?: string
    },
    "footer": {
      "variant": "columns",
      "logo": { "type": "text", "value": string },
      "tagline": string,
      "columns": [ { "heading": string, "links": [ { "label": string, "href": string } ] } ],
      "contact": { "phone": string, "email": string, "address": string },
      "social": [ { "platform": "instagram"|"facebook"|"linkedin"|"youtube", "url": string } ],
      "copyright": string  // use current year ${new Date().getFullYear()}
    }
  },
  "pages": [
    {
      "id": string,
      "slug": "/"  |  "/ydelser"  |  "/om-os"  |  "/kontakt",
      "title": string,
      "seo": {
        "title": string (50–60 chars, city + keyword),
        "description": string (140–160 chars, CTA hint),
        "schema": "LocalBusiness"|"Service"|"Organization"
      },
      "blockPlan": [
        {
          "type": string,
          "variant": string,
          "background": "white"|"surface"|"brand"|"brand_dark"|"brand_tint"|"dark"|"black",
          "gradientHeading"?: true,
          "blobs"?: true,
          "animatedBg"?: "particles"|"aurora"|"noise_flow"|"geometric"|"wave_grid"|"cyber_grid"|"starfield"|"plasma"|"hex_grid"|"vortex"|"neon_pulse"|"matrix_rain"|"fire"|"circuit"|"galaxy"|"ripple"
        }
      ]
    }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AVAILABLE BLOCK TYPES & VARIANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hero           — centered | split_image | split_image_reverse | minimal | with_badge
trust_bar      — icon_row | badges | logos
services       — grid_cards | list_icons | split_highlight | circular_icons
about          — split_image | split_image_reverse | centered_story
process        — numbered_steps | timeline | icon_flow
testimonials   — grid | carousel | featured_one
pricing        — cards | simple_list
faq            — accordion | two_column
cta_banner     — centered | split
contact        — split_form | centered_form
stats          — row | grid | with_icon
gallery        — grid | masonry | carousel
team           — grid_cards | list | featured
blog_grid      — grid | list | featured_first
logo_cloud     — simple | marquee | card_grid
comparison     — table | cards
promo_banner   — announcement | offer | urgent
location_finder — cards | list
booking_strip  — centered | split | with_phone
core_values    — icon_grid | horizontal_list | numbered

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKGROUND PALETTE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Never use the same background for two adjacent blocks.
white/surface alternate freely.
brand_tint (very light brand colour) — good for stats, core_values, logo_cloud.
brand / brand_dark — high-impact, use for trust_bar, cta_banner, booking_strip.
dark / black — hero, sections needing drama.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCK SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

gradientHeading: true  — applies brand-colour gradient to the main heading. Best on hero, stats with_icon, cta_banner.
blobs: true            — adds decorative blur circles behind the section. Best on hero, about, testimonials, cta_banner.
animatedBg             — animated canvas background on hero or cta_banner only. Overrides blobs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THEME PRESETS  (pick the best match — fonts create identity, don't default to Inter)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

electrician/energy/speed/el/strøm:       brand:#F59E0B brandDark:#B45309 font:Space Grotesk    radius:md  shadow:lg  buttons:filled
plumber/water/vvs/pipes/blikkenslager:   brand:#1D4ED8 brandDark:#1E3A8A font:DM Sans          radius:md  shadow:md
kloak/kloakservice/drain:                brand:#334155 brandDark:#1E293B font:DM Sans          radius:sm  shadow:md
dentist/dental/teeth/tand/klinik:        brand:#0E7490 brandDark:#155E75 font:DM Sans          radius:lg  shadow:sm
doctor/medical/health/læge/hospital:     brand:#047857 brandDark:#065F46 font:DM Sans          radius:lg  shadow:sm
physiotherapy/fysio/kiropraktor/rehab:   brand:#0D9488 brandDark:#0F766E font:Lora             radius:lg  shadow:sm
psychologist/psykolog/therapist/terapi:  brand:#6D28D9 brandDark:#5B21B6 font:Lora             radius:xl  shadow:sm
lawyer/law/legal/advokat/notary/juridisk: brand:#1a1a2e brandDark:#0d0d1a font:Playfair Display radius:sm  shadow:lg  buttons:outline
accountant/tax/finance/revisor/bogholder: brand:#1E3A8A brandDark:#1e2e6b font:Space Grotesk   radius:sm  shadow:md
gym/fitness/sport/crossfit/træning/box:  brand:#DC2626 brandDark:#B91C1C font:Bebas Neue       radius:sm  shadow:xl  buttons:filled
yoga/pilates/meditation/mindfulness:     brand:#9333EA brandDark:#7E22CE font:Lora             radius:full shadow:sm
wellness/spa/massage/relaxation:         brand:#B45309 brandDark:#92400E font:Cormorant Garamond radius:lg shadow:sm
restaurant/dining/bistro/gourmet:        brand:#C2410C brandDark:#9A3412 font:Playfair Display radius:md  shadow:md
cafe/coffee/kaffebar/kafé:               brand:#92400E brandDark:#78350F font:Cormorant Garamond radius:lg shadow:sm
bakery/bageri/patisserie/konditori:      brand:#D97706 brandDark:#B45309 font:Cormorant Garamond radius:xl shadow:sm
pizza/burger/fastfood/takeaway:          brand:#DC2626 brandDark:#B91C1C font:Montserrat       radius:md  shadow:md  buttons:filled
sushi/asian/thai/wok:                    brand:#B45309 brandDark:#92400E font:Montserrat       radius:sm  shadow:md
agency/creative/bureau/design/reklame:   brand:#7C2D92 brandDark:#5B1F6B font:Syne             radius:lg  shadow:lg
webbureau/seo/marketing/digital:         brand:#4F46E5 brandDark:#3730A3 font:Syne             radius:lg  shadow:lg
tech/saas/startup/software/app:          brand:#0F4C81 brandDark:#0a3566 font:Space Grotesk    radius:md  shadow:md
it/it-konsulent/cybersikkerhed/security:  brand:#1e293b brandDark:#0f172a font:Space Grotesk   radius:sm  shadow:lg
cleaning/rengøring/home/hus:             brand:#0369A1 brandDark:#075985 font:Nunito           radius:xl  shadow:sm
painter/maler/decorator/malerservice:    brand:#7C3AED brandDark:#6D28D9 font:Nunito           radius:lg  shadow:md
roofing/tagdækker/tømrer/construction:   brand:#92400E brandDark:#78350F font:Montserrat       radius:sm  shadow:lg
landscaping/garden/anlæg/haveservice:    brand:#15803D brandDark:#14532D font:Nunito           radius:xl  shadow:sm
beauty/skønhed/kosmetik/hudpleje:        brand:#BE185D brandDark:#9D174D font:Raleway          radius:full shadow:sm  buttons:outline
hair/frisør/barbershop/hår:              brand:#DB2777 brandDark:#BE185D font:Raleway          radius:full shadow:sm
photographer/fotograf/foto/visual:       brand:#18181B brandDark:#09090B font:Cormorant Garamond radius:sm shadow:xl
interior/indretning/arkitekt/furniture:  brand:#44403C brandDark:#292524 font:DM Serif Display radius:sm  shadow:md
hotel/accommodation/bnb/overnatning:     brand:#92400E brandDark:#78350F font:Playfair Display radius:md  shadow:lg
moving/flytning/transport/logistics:     brand:#EA580C brandDark:#C2410C font:Montserrat       radius:md  shadow:md
childcare/børnehave/pædagog/daycare:     brand:#F59E0B brandDark:#D97706 font:Nunito           radius:full shadow:sm
veterinary/dyrlæge/vet/animal:           brand:#059669 brandDark:#047857 font:DM Sans          radius:lg  shadow:sm
locksmith/låsesmed/security/alarm:       brand:#334155 brandDark:#1E293B font:Montserrat       radius:sm  shadow:md
default:                                 brand:#2563EB brandDark:#1D4ED8 font:Inter            radius:md  shadow:md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUAGE & LOCALISATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Denmark/Danish cities → language:"da", country:"DK"
Germany/German cities → language:"de", country:"DE"
Austria              → language:"de", country:"AT"
Default              → language:"en", country:"GB"

Danish nav slugs: /ydelser, /om-os, /kontakt, /priser
German nav slugs: /leistungen, /ueber-uns, /kontakt, /preise
English nav slugs: /services, /about, /contact, /pricing

Danish nav labels: "Ydelser","Om os","Kontakt","Priser"
German nav labels: "Leistungen","Über uns","Kontakt","Preise"
`;

export function buildShellUserPrompt(brief: string, seed?: StyleSeed): string {
  const s = seed ?? pickRandom(STYLE_SEEDS);

  const bgRule = s.bgPalette === 'dark_heavy'
    ? 'Prefer dark/black backgrounds — use brand_tint/surface sparingly.'
    : s.bgPalette === 'tint_heavy'
    ? 'Use brand_tint for stats/core_values/logo_cloud sections. Use white and surface for most content blocks.'
    : 'Alternate white and surface for content blocks. Use brand for trust_bar and cta_banner.';

  const gradientNote = s.gradientHeadingBlocks.length
    ? `Set gradientHeading:true on these blocks: ${s.gradientHeadingBlocks.join(', ')}.`
    : 'Do not use gradientHeading.';

  const blobNote = s.blobBlocks.length
    ? `Set blobs:true on these blocks: ${s.blobBlocks.join(', ')}.`
    : 'Do not use blobs.';

  const animNote = s.animatedBg
    ? `Set animatedBg:"${s.animatedBg}" on the hero block (omit blobs on hero when animatedBg is set).`
    : 'Do not use animatedBg.';

  const extraNote = s.extraHomeBlocks.length
    ? `Include these extra blocks on the home page (insert in a logical position): ${s.extraHomeBlocks.join(', ')}.`
    : '';

  const briefLower = brief.toLowerCase();
  const isLanding = briefLower.includes('landing page kun');
  const isSmall   = briefLower.includes('2-3 siders') || briefLower.includes('3 siders hjemmeside');

  const pageInstruction = isLanding
    ? `Output EXACTLY 1 page — a single IMMERSIVE landing page (4–5 blocks MAX):
1. Home (/) — exactly 4–5 blocks: hero + trust_bar + one content block (services OR about) + cta_banner or contact. Optionally add testimonials or stats as a 5th block.
RULES FOR LANDING PAGES — MANDATORY:
- animatedBg MUST be set on the hero block (use "${s.animatedBg || 'aurora'}"). This is non-negotiable.
- EVERY block MUST use a dark or black background (dark/black/brand_dark). NO white, surface or brand_tint.
- Quality over quantity — 4 elite blocks beat 7 mediocre ones.
- hero: use variant "centered" with animatedBg and gradientHeading:true
- Do NOT include faq, gallery, team, blog_grid, location_finder, logo_cloud, or process on landing pages.
IMPORTANT: Only 1 page. Do NOT add more pages.`
    : isSmall
    ? `Output EXACTLY 3 pages:
1. Home (/) — 7–9 blocks
2. Services (/ydelser or /services or /leistungen) — 4–5 blocks
3. Contact (/kontakt or /contact) — 3 blocks
IMPORTANT: Only 3 pages. Do NOT add more pages.`
    : `Output 4 pages:
1. Home (/) — 8–10 blocks
2. Services (/ydelser or /services or /leistungen) — 5–6 blocks
3. About (/om-os or /about or /ueber-uns) — 5–6 blocks
4. Contact (/kontakt or /contact) — 3 blocks`;

  return `Generate the site shell for this business:

${brief}

STYLE SEED: ${s.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Follow these style instructions exactly:

Hero: use variant "${s.heroVariant}" with background "${s.heroBg}"
Stats: use variant "${s.statVariant}"
Services: use variant "${s.servicesVariant}"
Process: use variant "${s.processVariant}"
Testimonials: use variant "${s.testimonialsVariant}"
${extraNote}
Background palette: ${bgRule}
${gradientNote}
${blobNote}
${animNote}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${pageInstruction}

Invent realistic business details: phone, email, address, founding year.
Choose font and colour from the theme presets.
Language: detect from brief.`;
}

// ── Phase 2: Page content prompt ──────────────────────────────────────────────

export const PAGE_SYSTEM_PROMPT = `\
You are an expert website copywriter. Given a business context and a block plan, generate all blocks for one page via the submit_page tool.
Never respond with plain text — always call submit_page.

Every block must have: { "id": string, "type": string, "variant": string, "data": {...}, "settings": { "background": string, "paddingY": "xl", "gradientHeading"?: true, "blobs"?: true, "animatedBg"?: string } }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCK SCHEMAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

hero
  variants: centered | split_image | split_image_reverse | minimal | with_badge
  data: { badge?, badgeIsNew?:true, headline, accentLine?, subtext?, ctas: [{label,href,style:"filled"|"outline"}], chips?: string[], image?, imageAlt? }
  accentLine — italic brand-colored word/phrase appended to headline (e.g. headline:"Vi løser dit problem", accentLine:"hurtigt")
  badgeIsNew — adds a bright "NEW" chip prefix to the badge pill
  chips — 3-6 short use-case tags shown as pills below the CTA buttons (e.g. ["VVS", "Akutservice", "Tilbud"])
  settings: copy animatedBg value verbatim from the block plan — do NOT change or invent it

trust_bar
  variants: icon_row | badges | logos
  data: { heading?, items: [{type:"badge",label,icon} | {type:"stat",value,label} | {type:"logo",label,image}] }
  icons: star, shield, clock, zap, check, award, users, phone, truck, wrench

services
  variants: grid_cards | bento_grid | list_icons | split_highlight | circular_icons | glass_cards
  data: { heading, subtext?, columns?:2|3|4, items:[{icon,title,description,link?}], cta? }
  bento_grid — Apple/Linear-style mixed-size grid: first item is a featured card spanning 2 cols; float-card depth shadows; best with 5-6 items for modern/premium brands
  circular_icons — numbered circular badges, ideal for step-like services
  glass_cards — translucent frosted-glass cards for dark/black backgrounds (futurism or glassmorphism style)
  icons: zap,wrench,droplets,hammer,car,building,lightbulb,plug,cpu,shield,star,heart,leaf,
         home,users,briefcase,truck,scissors,utensils,dumbbell,scale,stethoscope,camera,
         paintbrush,key,package,phone

about
  variants: split_image | split_image_reverse | centered_story
  data: { heading, body (2–3 paragraphs), highlights?:[{stat,label}], image?, imageAlt?, cta? }

process
  variants: numbered_steps | timeline | icon_flow
  data: { heading, subtext?, steps:[{number?,title,description,icon?}], cta? }

testimonials
  variants: grid | carousel | featured_one
  data: { heading?, aggregate?:{rating,count,source}, items:[{name,location?,rating,text,source?,avatar?}] }
  — Min 3. Specific: mention timeframe, problem solved, outcome.

pricing
  variants: cards | simple_list
  data: { heading, subtext?, disclaimer?, items:[{name,price,period?,description?,features:[],cta,highlighted?,badge?}] }

faq
  variants: accordion | two_column
  data: { heading?, items:[{question,answer}] }
  — 6–8 items. First sentence of answer must directly address the question.

cta_banner
  variants: centered | split | pattern
  data: { heading, subtext?, ctas:[{label,href,style}] }
  pattern — dot-grid overlay with cursor spotlight and shimmer CTA buttons; high-impact for final conversion section

contact
  variants: split_form | centered_form
  data: { heading, subtext?, form:{id,fields:[{name,label,type,required?,options?}],submitLabel,successMessage?}, contactInfo?:{phone?,email?,address?,hours?,mapEmbed?} }
  field types: text | email | tel | textarea | select

stats
  variants: row | grid | with_icon | neon_counter
  data: { heading?, items:[{stat,label,icon?,description?}] }
  with_icon — large numbers separated by vertical dividers, very impactful
  neon_counter — glowing neon numbers in glass cards; use only on dark/black backgrounds (futurism/glassmorphism)

gallery
  variants: grid | masonry | carousel
  data: { heading?, subtext?, items:[{src,alt,caption?}] }
  — image paths like /assets/work-1.jpg

team
  variants: grid_cards | list | featured
  data: { heading?, subtext?, members:[{name,role,bio?,image?,social?}] }

blog_grid
  variants: grid | list | featured_first
  data: { heading?, source:"static", posts:[{title,slug,date,excerpt,image?,category?}], cta? }

logo_cloud
  variants: simple | marquee | card_grid
  data: { heading?, subtext?, items:[{name,image?,url?}] }
  marquee — infinite scrolling strip, great for "trusted by" sections

comparison
  variants: table | cards
  data: { heading, subtext?, columns:[{name,highlighted?,badge?}], rows:[{feature,values:[]}], cta? }

promo_banner
  variants: announcement | offer | urgent
  data: { emoji?, text, cta?:{label,href,style}, dismissable?:true }
  — Place at the very top of home page when included. paddingY:"none"

location_finder
  variants: cards | list
  data: { heading?, subtext?, locations:[{name,address?,city?,phone?,hours?,email?,bookingUrl?,mapUrl?,image?}] }

booking_strip
  variants: centered | split | with_phone
  data: { heading, subtext?, bookingUrl, bookingLabel?, phone?, phoneLabel? }
  — Use brand or brand_dark background

core_values
  variants: icon_grid | horizontal_list | numbered
  data: { heading, subtext?, items:[{icon,title,description}] }
  — 4–6 values. icon_grid uses circular badges.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPY RULES — MANDATORY, NOT OPTIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL: Every piece of copy must pass these gates before you submit. Generic copy = failed generation.

Headlines — outcome-focused, city-specific. NEVER generic:
  ✓ "Berlins mest pålidelige VVS-firma" / "Lys og varme i Aarhus — dag og nat"
  ✗ FORBIDDEN: "Professionelle VVS-ydelser" / "Vi leverer kvalitet" / "Din lokale ekspert"

Hero subtext — 1–2 sentences, MUST include: trust signal + city name + ONE concrete proof:
  ✓ "Autoriseret og fuldt forsikret. 60 minutters udrykning i hele Aarhus og omegn."
  ✗ FORBIDDEN: "Vi tilbyder professionel service" / "Kontakt os i dag"

Service descriptions — MUST lead with customer pain point, end with outcome:
  ✓ "Vandskade midt om natten? Vi er fremme inden for 60 minutter."
  ✗ FORBIDDEN: "Vi tilbyder VVS-service af høj kvalitet."

Testimonials — MUST include: specific detail OR timeframe OR named outcome. Min 3 testimonials:
  ✓ "Ringede kl. 23, de var her på 45 min. Anbefales varmt! — Peter K., Aarhus"
  ✗ FORBIDDEN: "Fantastisk service!" / "Meget professionelt firma."

Stats — NEVER round numbers. Use specific, realistic values with units:
  ✓ stat:"847" label:"Tilfredse kunder" / stat:"4,8" label:"Google-stjerner" / stat:"18" label:"Års erfaring"
  ✗ FORBIDDEN: stat:"1000+" / stat:"100%" / stat:"5 stjerner" (5 is too perfect)

FAQ — MUST include real prices, timeframes, and location-specific answers:
  ✓ "Hvad koster en akutudrykningskald? Priser starter fra 895 kr. inkl. moms."
  ✗ FORBIDDEN: "Kontakt os for at få et tilbud."

CTA copy — action verb + concrete specificity:
  ✓ "Ring nu — svar inden 2 timer" / "Få et gratis tilbud i dag"
  ✗ FORBIDDEN: "Læs mere" / "Klik her" / "Kontakt os"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DANISH FAQ BANKS (use as templates — always localise)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VVS: Akutpris starter fra 895 kr. Udrykning inden 60 min. Autoriserede og forsikrede. Vagttelefon 24/7.
Elektriker: Timepris 695–895 kr. Autoriseret. Anmelder til Sikkerhedsstyrelsen. Vagtelektriker klar.
Tandlæge: Tandeftersyn 695 kr. Ny patienter velkomne. Invisalign. Akuttime samme dag.
Maler: 3-værelses fra 15.000–28.000 kr. Gratis tilbud. Lavemissions-maling. Facadeistandsættelse.
Rengøring: Fra 1.200 kr./uge. Svanemærkede produkter. Erhvervsansvarsforsikring.
Kloakservice: TV-inspektion fra 1.495 kr. Renses hvert 2–3 år.
Gym: Første træning gratis. Fra 299 kr./md.

Generiske: Dækker [CITY] +30 km. Garanti på alt arbejde. MobilePay/faktura. Ærlige om tidsplan.
`;

export interface PagePlan {
  id: string;
  slug: string;
  title: string;
  seo: { title: string; description: string; schema?: string };
  blockPlan: Array<{ type: string; variant: string; background: string; gradientHeading?: boolean; blobs?: boolean; animatedBg?: string }>;
}

export interface SiteShell {
  version: '1.0';
  id: string;
  business: {
    name: string; industry: string; city: string; country: string; language: string;
    phone?: string; email?: string; address?: string; hours?: string; founded?: string;
  };
  theme: Record<string, unknown>;
  globals: Record<string, unknown>;
  pages: PagePlan[];
}

export function buildPageUserPrompt(shell: SiteShell, page: PagePlan): string {
  const b = shell.business;
  const plan = page.blockPlan
    .map((bp, i) => {
      const extras: string[] = [];
      if (bp.gradientHeading) extras.push('gradientHeading:true');
      if (bp.blobs) extras.push('blobs:true');
      if (bp.animatedBg) extras.push(`animatedBg:"${bp.animatedBg}"`);
      const extrasStr = extras.length ? ` [${extras.join(', ')}]` : '';
      return `  ${i + 1}. ${bp.type} (variant: ${bp.variant}, background: ${bp.background})${extrasStr}`;
    })
    .join('\n');

  return `Business: ${b.name}
Industry: ${b.industry}
City: ${b.city}, ${b.country}
Language: ${b.language}
Phone: ${b.phone ?? 'invent realistic number'}
Email: ${b.email ?? 'invent realistic email'}
Address: ${b.address ?? 'invent realistic address'}
Hours: ${b.hours ?? 'invent realistic hours'}
Brand color: ${(shell.theme as Record<string, Record<string, string>>).colors?.brand ?? '#3B82F6'}

Page: ${page.title} (${page.slug})
SEO title: ${page.seo.title}

Block plan for this page:
${plan}

Generate all ${page.blockPlan.length} blocks via submit_page.
Write rich, conversion-focused copy entirely in ${b.language?.startsWith('da') ? 'Danish' : b.language?.startsWith('de') ? 'German' : 'English'}.
Use the exact variants, backgrounds, and settings specified. Make every block feel specific to this business and city.
BREVITY RULE: subtext/description fields max 25 words. body (about) max 60 words. testimonial text max 35 words. faq answers max 40 words. This is mandatory to fit within token limits.`;
}

// ── Legacy: kept for CLI backward compat ──────────────────────────────────────

export const SYSTEM_PROMPT = SHELL_SYSTEM_PROMPT;
export function buildUserPrompt(brief: string): string { return buildShellUserPrompt(brief); }
