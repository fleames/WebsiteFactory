import type { Theme } from '../../schema/types.js';

export function tailwindConfigScript(theme: Theme): string {
  const { colors, typography, radius } = theme;

  const radiusMap: Record<string, string> = {
    none: '0',
    sm:   '0.25rem',
    md:   '0.5rem',
    lg:   '0.75rem',
    full: '9999px',
  };

  return `
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand:        '${colors.brand}',
          'brand-dark': '${colors.brandDark}',
          accent:       '${colors.accent}',
          muted:        '${colors.textMuted}',
        },
        fontFamily: {
          heading: ['${typography.fontHeading}', 'sans-serif'],
          body:    ['${typography.fontBody}', 'sans-serif'],
        },
        borderRadius: {
          DEFAULT: '${radiusMap[radius] ?? '0.5rem'}',
        },
      },
    },
  };
</script>`.trim();
}

const FONT_QUERY: Record<string, string> = {
  'Bebas Neue':           'Bebas+Neue',
  'Cormorant Garamond':   'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600',
  'DM Serif Display':     'DM+Serif+Display:ital@0;1',
  'DM Sans':              'DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700',
  'Playfair Display':     'Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,700',
  'Space Grotesk':        'Space+Grotesk:wght@300;400;500;600;700',
  'Syne':                 'Syne:wght@400;500;600;700;800',
  'Raleway':              'Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400',
  'Lora':                 'Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700',
  'Montserrat':           'Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700',
  'Nunito':               'Nunito:wght@400;500;600;700;800;900',
  'Oswald':               'Oswald:wght@300;400;500;600;700',
  'Inter':                'Inter:wght@300;400;500;600;700;800',
  'Poppins':              'Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400',
};

export function googleFontsLink(theme: Theme): string {
  const fonts = [...new Set([theme.typography.fontHeading, theme.typography.fontBody])];
  const query = fonts
    .map(f => `family=${FONT_QUERY[f] ?? `${encodeURIComponent(f)}:wght@400;500;600;700;800`}`)
    .join('&');
  return `<link href="https://fonts.googleapis.com/css2?${query}&display=swap" rel="stylesheet">`;
}
