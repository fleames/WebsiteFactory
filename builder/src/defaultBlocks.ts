import type { Block } from '@schema/types';

let _id = Date.now();
const uid = () => `block_${(_id++).toString(36)}`;

export const BLOCK_META: Record<string, { icon: string; label: string; description: string }> = {
  hero:         { icon: '⚡', label: 'Hero',           description: 'Åbningssektion i fuld bredde med overskrift og knap' },
  trust_bar:    { icon: '🏅', label: 'Tillidsbånd',    description: 'Badges, statistikker og certificeringer' },
  services:     { icon: '🔧', label: 'Ydelser',        description: 'Gitter eller liste over virksomhedens ydelser' },
  about:        { icon: '👥', label: 'Om os',          description: 'Virksomhedens historie med billede og nøgletal' },
  process:      { icon: '📋', label: 'Fremgangsmåde',  description: 'Trin-for-trin forklaring af arbejdsprocessen' },
  testimonials: { icon: '💬', label: 'Anmeldelser',    description: 'Kundeanmeldelser og social proof' },
  pricing:      { icon: '💰', label: 'Priser',         description: 'Prisplaner eller servicepriser' },
  faq:          { icon: '❓', label: 'FAQ',             description: 'Harmonika med ofte stillede spørgsmål' },
  cta_banner:   { icon: '📣', label: 'CTA-banner',     description: 'Fremtrædende handlingsopfordring' },
  contact:      { icon: '✉️', label: 'Kontakt',        description: 'Kontaktformular med virksomhedsoplysninger' },
  stats:        { icon: '📊', label: 'Statistikker',   description: 'Nøgletal og målinger' },
  gallery:      { icon: '🖼️', label: 'Galleri',        description: 'Billedgitter, masonry-layout eller karrusel' },
  team:         { icon: '👤', label: 'Team',           description: 'Teammedlemmers kort med biografier' },
  blog_grid:    { icon: '📰', label: 'Blog',           description: 'Blogindlæg i gitter- eller listelayout' },
  video:           { icon: '▶️', label: 'Video',          description: 'Indlejret YouTube/Vimeo video' },
  map:             { icon: '📍', label: 'Kort',           description: 'Google Maps med adresse og åbningstider' },
  logo_cloud:      { icon: '🤝', label: 'Logoer',         description: 'Kundelogoer eller partnerbadges' },
  comparison:      { icon: '⚖️', label: 'Sammenligning',  description: 'Sammenligningstabel for tjenester eller planer' },
  promo_banner:    { icon: '🎉', label: 'Promo-banner',   description: 'Afviselig topstrip med kampagnetilbud' },
  location_finder: { icon: '🗺️', label: 'Lokationer',    description: 'Kort-gitter med adresse, telefon og booking' },
  booking_strip:   { icon: '📅', label: 'Book-strip',     description: 'Bred CTA-strip med booking-link og telefon' },
  core_values:     { icon: '🌟', label: 'Kerneværdier',   description: 'Ikon-gitter med 4–6 virksomhedsværdier' },
};

export function createBlock(type: string): Block {
  const id = uid();

  const templates: Record<string, Omit<Block, 'id'>> = {
    hero: {
      type: 'hero', variant: 'split_image',
      data: {
        badge: 'Nyhed',
        headline: 'Din stærke overskrift her',
        subtext: 'En kort beskrivelse af det du tilbyder. Fokusér på resultater og fordele for kunden.',
        ctas: [
          { label: 'Kom i gang',  href: '/kontakt', style: 'filled' },
          { label: 'Læs mere',   href: '#ydelser',  style: 'outline' },
        ],
        image: '/assets/hero.jpg', imageAlt: 'Forsidefoto',
      },
      settings: { background: 'dark', paddingY: 'xl' },
    },

    trust_bar: {
      type: 'trust_bar', variant: 'icon_row',
      data: {
        items: [
          { type: 'badge', label: 'Fuldt licenseret', icon: 'shield-check' },
          { type: 'badge', label: 'Fuldt forsikret',  icon: 'shield' },
          { type: 'stat',  value: '500+',  label: 'Tilfredse kunder' },
          { type: 'badge', label: 'Hurtig respons',   icon: 'clock' },
        ],
      },
      settings: { background: 'brand', paddingY: 'sm' },
    },

    services: {
      type: 'services', variant: 'grid_cards',
      data: {
        heading: 'Vores ydelser',
        subtext: 'Vi tilbyder professionelle løsninger tilpasset dine behov.',
        columns: 3,
        items: [
          { icon: 'star',   title: 'Ydelse ét',  description: 'Beskriv ydelsen og det konkrete udbytte kunden får.' },
          { icon: 'zap',    title: 'Ydelse to',  description: 'Beskriv ydelsen og det konkrete udbytte kunden får.' },
          { icon: 'shield', title: 'Ydelse tre', description: 'Beskriv ydelsen og det konkrete udbytte kunden får.' },
        ],
      },
      settings: { background: 'white', paddingY: 'xl' },
    },

    about: {
      type: 'about', variant: 'split_image',
      data: {
        heading: 'Om os',
        body: 'Fortæl jeres historie her. Hvorfor startede I? Hvad adskiller jer fra konkurrenterne? Hold det ægte og kundefokuseret.',
        highlights: [
          { stat: '10+',   label: 'Års erfaring' },
          { stat: '500+',  label: 'Tilfredse kunder' },
          { stat: '4.9★', label: 'Gennemsnitlig vurdering' },
        ],
        image: '/assets/about.jpg', imageAlt: 'Vores team',
        cta: { label: 'Mød teamet', href: '/om-os', style: 'outline' },
      },
      settings: { background: 'white', paddingY: 'xl' },
    },

    process: {
      type: 'process', variant: 'numbered_steps',
      data: {
        heading: 'Sådan fungerer det',
        subtext: 'Tre enkle trin fra kontakt til færdigt arbejde.',
        steps: [
          { number: 1, title: 'Kontakt os',       description: 'Ring eller skriv til os. Vi svarer inden for 2 timer.' },
          { number: 2, title: 'Få et tilbud',     description: 'Vi giver en klar og fast pris uden skjulte omkostninger.' },
          { number: 3, title: 'Opgaven løst',     description: 'Vi udfører arbejdet professionelt og efterlader stedet ryddeligt.' },
        ],
        cta: { label: 'Kom i gang', href: '/kontakt', style: 'filled' },
      },
      settings: { background: 'surface', paddingY: 'xl' },
    },

    testimonials: {
      type: 'testimonials', variant: 'grid',
      data: {
        heading: 'Hvad kunderne siger',
        aggregate: { rating: 4.9, count: 50, source: 'Google' },
        items: [
          { name: 'Anna K.',   location: 'København', rating: 5, text: 'Fantastisk service. Hurtigt, professionelt og god pris. Kan klart anbefales.', source: 'google' },
          { name: 'Thomas M.', location: 'Aarhus',    rating: 5, text: 'Ringede om morgenen, ordnet om eftermiddagen. Fremragende kommunikation hele vejen igennem.', source: 'google' },
          { name: 'Sara L.',   location: 'Odense',    rating: 5, text: 'Meget kompetente og venlige. Løste et problem som tre andre firmaer ikke kunne.', source: 'google' },
        ],
      },
      settings: { background: 'surface', paddingY: 'xl' },
    },

    pricing: {
      type: 'pricing', variant: 'cards',
      data: {
        heading: 'Priser',
        subtext: 'Gennemsigtige, faste priser. Ingen skjulte gebyrer.',
        items: [
          {
            name: 'Standard', price: 'Fra kr. X', period: 'pr. opgave',
            description: 'Til almindelige opgaver',
            features: ['Ydelse ét', 'Ydelse to', 'Ydelse tre'],
            cta: { label: 'Få et tilbud', href: '/kontakt', style: 'filled' },
            highlighted: false,
          },
          {
            name: 'Premium', price: 'Fra kr. X', period: 'pr. opgave',
            description: 'Til akut eller komplekst arbejde',
            features: ['Alt i Standard', 'Prioriteret respons', 'Udvidet garanti'],
            cta: { label: 'Få et tilbud', href: '/kontakt', style: 'filled' },
            highlighted: true, badge: 'Mest populær',
          },
        ],
      },
      settings: { background: 'white', paddingY: 'xl' },
    },

    faq: {
      type: 'faq', variant: 'accordion',
      data: {
        heading: 'Ofte stillede spørgsmål',
        items: [
          { question: 'Hvor hurtigt kan I reagere?',            answer: 'Vi svarer typisk inden for 2 timer og kan ofte komme samme dag.' },
          { question: 'Giver I gratis tilbud?',                 answer: 'Ja, alle tilbud er gratis og uforpligtende.' },
          { question: 'Er I licenseret og forsikrede?',         answer: 'Ja, vi er fuldt licenserede og har en omfattende erhvervsforsikring.' },
          { question: 'Hvilke områder dækker I?',               answer: 'Vi dækker byen og omegn inden for 30 km.' },
          { question: 'Tilbyder I akutservice?',                answer: 'Ja, vi tilbyder akutudkald døgnet rundt. Tillæg kan forekomme.' },
        ],
      },
      settings: { background: 'surface', paddingY: 'xl' },
    },

    cta_banner: {
      type: 'cta_banner', variant: 'centered',
      data: {
        heading: 'Klar til at komme i gang?',
        subtext: 'Ring til os nu eller send en besked – vi svarer inden for 2 timer.',
        ctas: [
          { label: 'Ring nu',       href: 'tel:+00000000', style: 'filled' },
          { label: 'Send besked',   href: '/contact',      style: 'outline' },
        ],
      },
      settings: { background: 'brand', paddingY: 'lg' },
    },

    contact: {
      type: 'contact', variant: 'split_form',
      data: {
        heading: 'Kontakt os',
        subtext: 'Udfyld formularen, og vi vender tilbage inden for 2 timer.',
        form: {
          id: `form_${uid()}`,
          fields: [
            { name: 'name',    label: 'Navn',        type: 'text',     required: true },
            { name: 'phone',   label: 'Telefon',     type: 'tel',      required: true },
            { name: 'email',   label: 'E-mail',      type: 'email',    required: false },
            { name: 'message', label: 'Besked',      type: 'textarea', required: false },
          ],
          submitLabel: 'Send besked',
          successMessage: 'Tak! Vi vender tilbage hurtigst muligt.',
        },
        contactInfo: { phone: '', email: '', hours: 'Man–fre 9–17' },
      },
      settings: { background: 'white', paddingY: 'xl' },
    },

    stats: {
      type: 'stats', variant: 'row',
      data: {
        items: [
          { stat: '500+',  label: 'Tilfredse kunder',    icon: 'users' },
          { stat: '10 år', label: 'Års erfaring',         icon: 'calendar' },
          { stat: '4.9★', label: 'Google-vurdering',     icon: 'star' },
          { stat: '24/7',  label: 'Support',              icon: 'clock' },
        ],
      },
      settings: { background: 'surface', paddingY: 'md' },
    },

    gallery: {
      type: 'gallery', variant: 'grid',
      data: {
        heading: 'Vores arbejde',
        items: [
          { src: '/assets/gallery-1.jpg', alt: 'Projekt 1' },
          { src: '/assets/gallery-2.jpg', alt: 'Projekt 2' },
          { src: '/assets/gallery-3.jpg', alt: 'Projekt 3' },
          { src: '/assets/gallery-4.jpg', alt: 'Projekt 4' },
          { src: '/assets/gallery-5.jpg', alt: 'Projekt 5' },
          { src: '/assets/gallery-6.jpg', alt: 'Projekt 6' },
        ],
      },
      settings: { background: 'white', paddingY: 'xl' },
    },

    team: {
      type: 'team', variant: 'grid_cards',
      data: {
        heading: 'Mød teamet',
        subtext: 'Personerne bag arbejdet.',
        members: [
          { name: 'Jane Smith',  role: 'Stifter & direktør',  bio: 'Kort biografi her.', image: '/assets/team-1.jpg' },
          { name: 'John Doe',    role: 'Cheftekniker',        bio: 'Kort biografi her.', image: '/assets/team-2.jpg' },
          { name: 'Maria Chen',  role: 'Kundeservice',        bio: 'Kort biografi her.', image: '/assets/team-3.jpg' },
        ],
      },
      settings: { background: 'surface', paddingY: 'xl' },
    },

    blog_grid: {
      type: 'blog_grid', variant: 'grid',
      data: {
        heading: 'Seneste artikler',
        source: 'static',
        posts: [
          { title: 'Indlægstitel ét',   slug: '/blog/indlaeg-1', date: '2024-01-15', excerpt: 'Et kort resumé af dette indlæg.', category: 'Tips' },
          { title: 'Indlægstitel to',   slug: '/blog/indlaeg-2', date: '2024-01-08', excerpt: 'Et kort resumé af dette indlæg.', category: 'Nyheder' },
          { title: 'Indlægstitel tre',  slug: '/blog/indlaeg-3', date: '2024-01-01', excerpt: 'Et kort resumé af dette indlæg.', category: 'Guide' },
        ],
        cta: { label: 'Se alle indlæg', href: '/blog', style: 'outline' },
      },
      settings: { background: 'white', paddingY: 'xl' },
    },

    video: {
      type: 'video', variant: 'centered',
      data: {
        heading: 'Se os i aktion',
        subtext: 'Et kort kig på vores arbejde og vores hold.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        caption: 'Vores seneste projekt',
      },
      settings: { background: 'surface', paddingY: 'xl' },
    },

    map: {
      type: 'map', variant: 'split',
      data: {
        heading: 'Find os',
        address: 'Eksempelgade 1, 1000 København',
        phone: '',
        hours: 'Man–fre 8–17',
        embedUrl: '',
        directionsUrl: '',
      },
      settings: { background: 'white', paddingY: 'xl' },
    },

    logo_cloud: {
      type: 'logo_cloud', variant: 'simple',
      data: {
        heading: 'Virksomheder vi har hjulpet',
        items: [
          { name: 'Kunde 1', image: '/assets/logo-1.png' },
          { name: 'Kunde 2', image: '/assets/logo-2.png' },
          { name: 'Kunde 3', image: '/assets/logo-3.png' },
          { name: 'Kunde 4', image: '/assets/logo-4.png' },
          { name: 'Kunde 5', image: '/assets/logo-5.png' },
        ],
      },
      settings: { background: 'surface', paddingY: 'md' },
    },

    promo_banner: {
      type: 'promo_banner', variant: 'offer',
      data: {
        emoji: '🎉',
        text: 'Tilbud denne uge: 15% rabat på alle bestillinger — brug koden SOMMER',
        cta: { label: 'Brug tilbud', href: '/kontakt', style: 'filled' },
        dismissable: true,
      },
      settings: { background: 'brand', paddingY: 'none' },
    },

    location_finder: {
      type: 'location_finder', variant: 'cards',
      data: {
        heading: 'Find din nærmeste afdeling',
        subtext: 'Vi har afdelinger i hele landet klar til at hjælpe dig.',
        locations: [
          {
            name: 'København',
            address: 'Eksempelgade 1',
            city: 'København K',
            phone: '+45 33 00 00 01',
            hours: 'Man–lør 09–18',
            bookingUrl: '#',
            mapUrl: '#',
          },
          {
            name: 'Aarhus',
            address: 'Handelsgade 22',
            city: 'Aarhus C',
            phone: '+45 87 00 00 02',
            hours: 'Man–fre 09–17',
            bookingUrl: '#',
            mapUrl: '#',
          },
          {
            name: 'Odense',
            address: 'Vestergade 8',
            city: 'Odense C',
            phone: '+45 66 00 00 03',
            hours: 'Man–fre 10–17',
            bookingUrl: '#',
            mapUrl: '#',
          },
        ],
      },
      settings: { background: 'surface', paddingY: 'xl' },
    },

    booking_strip: {
      type: 'booking_strip', variant: 'split',
      data: {
        heading: 'Klar til at bestille tid?',
        subtext: 'Book nemt og hurtigt online — eller ring til os.',
        bookingUrl: '#',
        bookingLabel: 'Book en tid online',
        phone: '+45 12 34 56 78',
        phoneLabel: 'Ring til os',
      },
      settings: { background: 'brand', paddingY: 'md' },
    },

    core_values: {
      type: 'core_values', variant: 'icon_grid',
      data: {
        heading: 'Vores værdier',
        subtext: 'Det er ikke bare ord — det er måden vi arbejder på hver dag.',
        items: [
          { icon: 'shield-check', title: 'Troværdighed',    description: 'Vi holder altid hvad vi lover og er transparente om pris og proces.' },
          { icon: 'clock',        title: 'Punktlighed',     description: 'Din tid er værdifuld. Vi møder til aftalt tid og overholder deadlines.' },
          { icon: 'star',         title: 'Kvalitet',        description: 'Vi bruger kun de bedste materialer og certificerede metoder.' },
          { icon: 'heart',        title: 'Kundefokus',      description: 'Tilfredse kunder er kernen i alt vi gør. Din oplevelse er vores vigtigste mål.' },
        ],
      },
      settings: { background: 'white', paddingY: 'xl' },
    },

    comparison: {
      type: 'comparison', variant: 'table',
      data: {
        heading: 'Sammenlign dine muligheder',
        subtext: 'Find den løsning der passer bedst til dine behov.',
        columns: [
          { name: 'Os',           highlighted: true,  badge: 'Anbefalet' },
          { name: 'Konkurrent A', highlighted: false },
        ],
        rows: [
          { feature: 'Reaktionstid', values: ['Inden for 2 timer', '1–2 dage'] },
          { feature: 'Garanti',      values: ['2-årig garanti',    '6 mdr garanti'] },
          { feature: 'Priser',       values: ['Fast pris',         'Variabel'] },
          { feature: 'Support',      values: ['24/7',              'Hverdage'] },
          { feature: 'Erfaring',     values: ['10+ år',            '5 år'] },
        ],
        cta: { label: 'Kom i gang', href: '/kontakt', style: 'filled' },
      },
      settings: { background: 'white', paddingY: 'xl' },
    },
  };

  const template = templates[type];
  if (!template) throw new Error(`Unknown block type: ${type}`);
  return { id, ...template } as Block;
}
