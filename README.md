# Website Factory

An AI-powered website generator and visual editor for small businesses. Describe your business in plain text, and Website Factory generates a complete, styled, multi-page website — ready to deploy to Netlify or Vercel.

---

## Overview

Website Factory takes a short business brief (e.g. *"Electrician in Berlin, serves residential and commercial clients"*) and:

1. Uses **AI (DeepSeek / GPT-4o)** to generate a structured site schema with pages, blocks, content, and a design theme
2. Fetches relevant **stock images** from Pexels and Unsplash based on the industry
3. Renders the site as **static HTML** using React server-side rendering + Tailwind CSS
4. Optionally opens a **visual builder** where you can drag, drop, edit, and regenerate blocks live
5. **Deploys** to Netlify or Vercel with one click, or exports as a ZIP

---

## Features

- **2-phase AI generation** — shell (structure + theme) then pages (content), using OpenAI tool-use for structured output
- **20+ block types** — hero, services, testimonials, pricing, FAQ, gallery, team, blog grid, map, and more
- **6 randomized design seeds** — bold, animated, aurora, feature-rich, warm, minimal — each with unique color palettes, layout variants, and animation styles
- **Visual builder** — drag-and-drop block reordering, live preview, inline editing, AI field/block regeneration
- **Multi-provider AI** — DeepSeek V3 (default, cheap), GPT-4o, GPT-4o-mini for enrichment
- **DALL-E 3 hero images** — generate custom AI images for any section
- **Industry-aware images** — automatically searches Pexels/Unsplash with industry-specific queries
- **Deploy integrations** — Netlify and Vercel deploy via API
- **ZIP export** — offline-ready bundle with relative asset paths
- **Share links** — shareable preview URLs with 7-day expiry
- **Version snapshots** — save and restore design history
- **Form handling** — contact forms routed to email via Nodemailer/SMTP
- **SEO** — auto-generated `sitemap.xml` and `robots.txt`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (strict, ES2022, ESM) |
| Backend | Node.js, Express 5 |
| Frontend | React 19, Vite, Tailwind CSS 4 |
| Rendering | React SSR (`renderToStaticMarkup`) |
| AI | OpenAI SDK (DeepSeek V3, GPT-4o, GPT-4o-mini) |
| Images | DALL-E 3, Pexels API, Unsplash API |
| Animations | Framer Motion, WebGL shaders |
| State | Zustand |
| Drag & Drop | @dnd-kit |
| Email | Nodemailer |
| Export | Archiver (ZIP) |

---

## Project Structure

```
website-factory/
├── ai/                     # AI generation engine
│   ├── index.ts            # CLI entrypoint: brief → site.json + HTML
│   ├── generate.ts         # 2-phase generation with tool-use streaming
│   ├── prompts.ts          # System prompts & 6 design seeds (bold, animated, aurora…)
│   ├── providers.ts        # Multi-provider config + token cost estimation
│   ├── enrich.ts           # GPT-4o-mini brief enrichment (expands vague inputs)
│   └── images.ts           # Industry-aware image fetching (Pexels/Unsplash)
│
├── schema/                 # Shared data model
│   ├── types.ts            # TypeScript interfaces: Site, Page, Block, Theme, Globals
│   └── SCHEMA.md           # Human-readable schema reference & design patterns
│
├── renderer/               # Static HTML renderer (legacy)
│   ├── render-site.ts      # Orchestrates pages + sitemap.xml + robots.txt
│   └── components/         # Footer, sitemap, robots components
│
├── renderer-react/         # React-based renderer (preferred)
│   ├── render-page.tsx     # Site + Page → static HTML string
│   ├── blocks/             # 20+ React block components
│   ├── layout/             # Nav and Footer components
│   ├── css.ts              # Tailwind + inline style helpers
│   └── shaders.ts          # WebGL shader code for animated backgrounds
│
├── builder/                # Visual editor
│   ├── server.ts           # Express API (30+ routes): CRUD, AI, preview, deploy, export
│   ├── src/                # React builder UI (Zustand, dnd-kit, live preview)
│   └── vite.config.ts      # Dev server + proxy config
│
├── schema/examples/        # Example site.json files
│   └── electrician-berlin.json
│
├── dist/                   # Generated site output
├── .env.example            # Environment variable template
├── dev.py                  # Windows dev helper (kills port 3001, restarts builder)
├── package.json
└── tsconfig.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your API keys:

```env
# Required for AI generation
DEEPSEEK_API_KEY=sk-...

# Required for DALL-E image generation and GPT-4o fallback
OPENAI_API_KEY=sk-...

# Required for stock photos
PEXELS_API_KEY=...
UNSPLASH_ACCESS_KEY=...

# Optional: email form submissions
FORM_EMAIL=you@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password

# Optional: one-click deploy
NETLIFY_TOKEN=...
VERCEL_TOKEN=...
```

---

## Usage

### Generate a site from a brief (CLI)

```bash
npm run ai
```

You will be prompted to enter a business description. The AI generates a full site to `dist/`.

### Render the built-in example site

```bash
npm run example
```

Renders `schema/examples/electrician-berlin.json` to `dist/electrician-berlin/`.

### Render any site.json manually

```bash
npm run generate
```

### Launch the visual builder

```bash
npm run builder:dev
```

Opens the builder backend at `http://localhost:3001` and the React UI at `http://localhost:5173`.

For production:

```bash
npm run builder:build   # build the React UI
npm run builder         # serve builder + built UI
```

### Windows dev helper

If port 3001 is stuck, run:

```bash
python dev.py
```

This kills any process on port 3001 and restarts the builder.

---

## How It Works

### AI Generation Pipeline

```
Brief (text input)
    ↓
[Enrich] GPT-4o-mini expands vague briefs into rich business context
    ↓
[Phase 1] DeepSeek generates: business info, theme, nav/footer, block plan per page
    ↓
[Phase 2] DeepSeek fills each page's blocks with real content (headlines, items, CTAs)
    ↓
[Images] Pexels/Unsplash queried with industry-specific terms
    ↓
site.json (structured, typed schema)
    ↓
[Renderer] React SSR → static HTML per page + sitemap.xml + robots.txt
    ↓
dist/{slug}/  (ready to serve or deploy)
```

### Schema Model

Every site is a `Site` object containing:

- **`globals`** — nav links, footer links, company name, colors, fonts
- **`theme`** — primary/secondary colors, font family, border radius, design seed
- **`pages[]`** — array of pages, each with:
  - **`blocks[]`** — ordered list of blocks, each with:
    - `type` — e.g. `hero`, `services`, `testimonials`
    - `variant` — layout variation (e.g. `split_image`, `carousel`, `grid`)
    - `data` — content fields (headline, items, CTA text, etc.)
    - `settings` — shared styling (background, padding, animations, gradient heading)

### Block Types

| Block | Variants |
|---|---|
| `hero` | centered, split_image, video_bg, minimal |
| `services` | grid, list, cards, icon_row |
| `testimonials` | carousel, grid, quote, masonry |
| `pricing` | cards, table, toggle (monthly/yearly) |
| `faq` | accordion, two_column |
| `gallery` | masonry, grid, slider |
| `team` | cards, list, spotlight |
| `contact` | form, map_split, minimal |
| `cta_banner` | centered, split, gradient |
| `process` | steps, timeline, numbered |
| `stats` | row, cards, animated_counters |
| `blog_grid` | grid, list, featured |
| `trust_bar` | logos, badges, certifications |
| `logo_cloud` | scrolling, static grid |
| `comparison` | table, cards |
| `promo_banner` | full_width, pill, floating |
| `location_finder` | map, list, search |
| `booking_strip` | inline, modal |
| `core_values` | grid, list, alternating |
| `about` | split, centered, timeline |
| `video` | embed, background, thumbnail |
| `map` | full_width, card |

### Design Seeds

When generating a site, one of 6 design seeds is randomly chosen:

| Seed | Style |
|---|---|
| `bold` | Classic layout, gradient headings, blob effects |
| `animated` | Dark theme, particle background, motion-heavy |
| `aurora` | Black background, neon glow effects |
| `feature-rich` | Colorful, split layouts, dense content |
| `warm` | Muted tones, inviting, soft shadows |
| `minimal` | Clean, whitespace-first, no decoration |

### AI Providers & Costs

| Provider | Model | Input | Output | Use |
|---|---|---|---|---|
| DeepSeek | deepseek-chat (V3) | $0.27/M | $1.10/M | Primary generation |
| OpenAI | gpt-4o | $2.50/M | $10.00/M | Fallback / high quality |
| OpenAI | gpt-4o-mini | $0.15/M | $0.60/M | Brief enrichment only |

Cost per generated site is estimated and logged after each run. DeepSeek prompt caching further reduces costs on repeated generation.

---

## Builder API Reference

The Express server exposes these key endpoints:

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create new project |
| `GET` | `/api/site/:slug` | Get site.json |
| `PUT` | `/api/site/:slug` | Update site.json |
| `DELETE` | `/api/site/:slug` | Delete project |
| `POST` | `/api/ai` | Stream AI site generation (SSE) |
| `POST` | `/api/ai-block` | Regenerate a single block with AI |
| `POST` | `/api/ai-field` | Regenerate a single field with AI |
| `POST` | `/api/ai-image` | Generate image with DALL-E 3 |
| `GET` | `/api/preview/:slug/:page` | Render page preview as HTML |
| `POST` | `/api/deploy/netlify/:slug` | Deploy to Netlify |
| `POST` | `/api/deploy/vercel/:slug` | Deploy to Vercel |
| `GET` | `/api/export/:slug` | Export site as ZIP |
| `POST` | `/api/share/:slug` | Create shareable preview link |
| `POST` | `/api/snapshot/:slug` | Save version snapshot |
| `POST` | `/api/images/search` | Search Unsplash images |
| `POST` | `/api/images/upload` | Upload custom image |
| `POST` | `/api/form-submit` | Handle contact form submission |

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DEEPSEEK_API_KEY` | Yes | DeepSeek API key for site generation |
| `OPENAI_API_KEY` | Yes | OpenAI key for DALL-E 3 + GPT-4o fallback |
| `PEXELS_API_KEY` | Yes | Pexels API key for stock photos |
| `UNSPLASH_ACCESS_KEY` | Yes | Unsplash API key for stock photos |
| `FORM_EMAIL` | No | Email address to receive form submissions |
| `SMTP_HOST` | No | SMTP server host |
| `SMTP_PORT` | No | SMTP server port (default: 587) |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `NETLIFY_TOKEN` | No | Netlify personal access token for deploy |
| `VERCEL_TOKEN` | No | Vercel API token for deploy |

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `generate` | `tsx renderer/index.ts` | Render site.json to HTML |
| `example` | `tsx renderer/index.ts schema/examples/electrician-berlin.json` | Render example site |
| `ai` | `tsx ai/index.ts` | CLI: generate site from brief |
| `builder` | `tsx builder/server.ts` | Run builder API server |
| `builder:dev` | `concurrently "tsx..." "vite..."` | Dev mode with hot reload |
| `builder:build` | `vite build` | Build React UI for production |
