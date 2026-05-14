# Website Factory — Schema Reference

## Document Structure

```
Site
├── version         "1.0"
├── id              uuid
├── business        name, industry, city, phone, email, hours
├── theme           colors, typography, spacing, radius, buttons
├── globals
│   ├── nav         variant, logo, links, cta, phone
│   └── footer      variant, columns, contact, social, copyright
└── pages[]
    ├── id / slug / title
    ├── seo         title, description, ogImage, schema
    └── blocks[]    (ordered array — top to bottom on page)
```

## Block Types

| type           | variants                                              |
|----------------|-------------------------------------------------------|
| `hero`         | centered, split_image, split_image_reverse, minimal, with_badge |
| `services`     | grid_cards, list_icons, feature_tabs, split_highlight |
| `about`        | split_image, split_image_reverse, centered_story, team_intro |
| `testimonials` | grid, carousel, featured_one, masonry               |
| `pricing`      | cards, table, simple_list                            |
| `contact`      | split_form, centered_form, minimal_cta               |
| `faq`          | accordion, two_column, simple_list                   |
| `cta_banner`   | centered, split, card                                |
| `trust_bar`    | logos, badges, icon_row                              |
| `process`      | numbered_steps, timeline, icon_flow                  |
| `stats`        | row, grid, with_icon                                 |
| `gallery`      | grid, masonry, carousel                              |
| `team`         | grid_cards, list, featured                           |
| `blog_grid`    | grid, list, featured_first                           |

## Block Shape

Every block follows this structure:

```json
{
  "id": "unique_string",
  "type": "hero",
  "variant": "split_image",
  "data": { ... },
  "settings": {
    "background": "white | surface | brand | brand_dark | dark | black",
    "paddingY":   "none | sm | md | lg | xl",
    "fullWidth":  false,
    "hidden":     false
  }
}
```

## Theme Quick Reference

```json
{
  "colors": {
    "brand":      "#F59E0B",
    "brandDark":  "#D97706",
    "accent":     "#111827",
    "background": "#FFFFFF",
    "surface":    "#FAFAFA",
    "text":       "#111827",
    "textMuted":  "#6B7280",
    "border":     "#E5E7EB"
  },
  "typography": { "fontHeading": "Inter", "fontBody": "Inter", "scale": "default" },
  "spacing":    "default",
  "radius":     "md",
  "shadow":     "md",
  "buttons":    { "style": "filled", "radius": "md" }
}
```

## Typical Page Structures

**Home (local service business)**
hero → trust_bar → services → process → about → testimonials → pricing → faq → cta_banner → contact

**Services page**
hero → services (full list) → cta_banner

**About page**
hero → about → stats → team → testimonials → cta_banner

**Contact page**
contact (split_form with map)

## Design Rules

- `background: "brand"` on cta_banner and trust_bar sections — creates visual rhythm
- `background: "surface"` every 2–3 white sections — breaks monotony
- Always end a page with either `cta_banner` or `contact` block
- `hero` is always first, never has `settings.paddingY: "none"`
- `trust_bar` should follow hero on any local service business site
