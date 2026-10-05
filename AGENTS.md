# Quaerere Veritatem — Agent Context

This file provides context for any AI agent, IDE assistant, or automated tool working on this repository.

---

## Project Overview

**Quaerere Veritatem** is a bilingual polymathic digital garden built with Astro, Tailwind CSS v4, and TypeScript. It explores ideas across multiple disciplines without imposing a rigid hierarchical structure. Articles are organized through dynamic tags.

**Principles:**
- Disciplines are **not** the site structure.
- Tags are the only taxonomy.
- Content is the source of truth.
- No code changes required to add articles.

**Stack:**
- Astro 7.x (SSG)
- Tailwind CSS 4.x (via Vite plugin)
- TypeScript
- MiniSearch (client-side search)
- Zod (schema validation)
- Markdown-it + markdown-it-anchor (Markdown rendering with heading anchors)
- @astrojs/rss (RSS feeds by language)

---

## Repository Structure

```
quaerere-veritatem/
├── content/               ← Editable source of truth
│   ├── articles/          ← Articles (YYYY-MM-DD-NN/)
│   ├── landing/           ← Homepage content (es.md, en.md)
│   ├── about/             ← About content (es.md, en.md)
│   ├── temporary/         ← Withdrawn articles (inert: not read by any loader)
│   └── config/
│       └── tags.json      ← Canonical tag registry
├── templates/
│   └── article/           ← Template for new articles
├── docs/                  ← Documentation (READMEs, guides)
├── src/                   ← Application code
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── lib/
│   ├── styles/
│   └── content/
│       └── loaders/
│           └── articleLoader.ts  ← Custom loader with markdown-it
├── public/                ← Static assets
├── astro.config.mjs
├── package.json
└── AGENTS.md              ← This file
```

---

## Architecture Rules

1. **SSG only**: `output: 'static'`. No SSR, no edge functions.
2. **Content lives outside `src/`**: All editable Markdown resides in `content/`.
3. **Bilingual**: Spanish (`es`) and English (`en`) with mandatory URL prefix (`/es/`, `/en/`).
4. **Article identity**: Folders named `YYYY-MM-DD-NN`. Immutable. Never derived from title.
5. **No slug field**: URLs use `articleId` only. No `slugify.ts`.
6. **Tag registry**: Single source of truth at `content/config/tags.json`. Unknown tags fail the build.
7. **Drafts**: `draft: true` excludes content from all public output (pages, lists, search, sitemap). No route is generated for a draft — its URL returns 404, never a redirect. The article loader watches `content/articles/` during `astro dev`, so toggling `draft` (or editing content) takes effect live without restarting the server.
8. **Vanilla JS**: No React, Vue, Svelte, or Alpine. Client interactivity uses vanilla TypeScript.

---

## Design System

### Palette (`src/styles/palette.css`)

All colors are CSS custom properties. Dark mode redefines the **same** variables:

| Token | Light | Dark |
|-------|-------|------|
| `paper` | `#F5F1E8` | `#1E211D` |
| `surface` | `#FAF8F3` | `#252A25` |
| `ink` | `#252820` | `#E8E5DB` |
| `muted` | `#667064` | `#A7AEA4` |
| `border` | `#D8D2C5` | `#454A43` |
| `accent` | `#285C46` | `#82B494` |
| `accent-hover` | `#1F4938` | `#A0C8AA` |
| `accent-soft` | `#D4E0D4` | `#29372E` |

### Typography

- **Literata**: body, headings, articles, essays — all Markdown content.
- **Inter**: navigation, metadata, tags, buttons, controls.
- **Libre Baskerville**: blockquotes, epigraphs, quoted voice.

### Layout widths

| Context | Max width |
|---------|-----------|
| Article | `68ch` |
| About | `72ch` |
| Landing / Default | `80ch` |

### Markdown editorial scale

| Element | Size | Line-height | Weight | Font |
|---------|------|-------------|--------|------|
| Body | 18px | 1.72 | 400 | Literata |
| H1 | clamp(2rem, 5vw, 2.625rem) | 1.12 | 600 | Literata |
| H2 | clamp(1.5rem, 3.5vw, 2.125rem) | 1.2 | 600 | Literata |
| H3 | clamp(1.25rem, 2.5vw, 1.75rem) | 1.25 | 600 | Literata |
| H4 | clamp(1.125rem, 2vw, 1.5rem) | 1.3 | 600 | Literata |
| H5 | clamp(1rem, 1.5vw, 1.25rem) | 1.35 | 600 | Literata |
| H6 | 1rem | 1.35 | 600 | Literata |

Links: `accent` color, underline 1px with 0.16em offset. Blockquotes: Libre Baskerville italic, left border `accent`.

### Components

- **LanguageSwitcher**: segmented toggle ESP | ENG. Active state: `bg-accent text-paper`.
- **ThemeToggle**: segmented toggle ☀️ | 🌙. Active state set by JS.
- **Nav active**: `text-ink font-semibold border-b-2 border-accent`.
- **Mobile menu**: hamburger button (sm:hidden), dropdown menu with border-left active indicator.

---

## Content Conventions

- **articleId format**: `YYYY-MM-DD-NN` where date is real and `NN` has 2+ digits.
- **Frontmatter tags**: Must be canonical IDs from `tags.json`. No translations in frontmatter.
- **Translations**: `es.md` and/or `en.md` inside the article folder. Independent draft status.
- **Translation parity**: When both languages exist, they must carry the exact same amount of content — same sections, headings, lists, tables, quotes and internal links. Titles and descriptions are fully translated, never abbreviated in one language only. If one version is more complete, it is the source of truth and the other must be aligned to it. Tags are the same canonical IDs in both files.
- **Internal article links**: absolute root paths — `/{lang}/YYYY-MM-DD-NN/` (e.g., `/es/2026-09-30-01/` in `es.md`, `/en/2026-09-30-01/` in `en.md`). Never relative `.md` links; those paths do not exist on the site.
- **Landing/About frontmatter**: `title` only; the H1 is rendered from it, so the body starts directly at the first paragraph or `##` heading. Same parity rule between `es.md` and `en.md`.
- **Authorial voice**: the site speaks in first person (the author is NEBY). Never refer to the author in the third person anywhere in `content/`.
- **Saints**: Catholic saints always carry their title in mentions, tags and titles — `San/Santo …` in Spanish, `Saint …` in English (San Agustín / Saint Augustine, Santo Tomás de Aquino / Saint Thomas Aquinas). Exception: proper names of works (a book title like *Initiation à saint Thomas d'Aquin* stays untouched). Non-Catholic figures (Lutero, Tertuliano, the Pseudo-Dionysius) take no title. Adjectives derived from names (agustiniana / Augustinian) stay untouched.
- **Bible**: never name Bible versions or editions (no Reina-Valera, Biblia de Jerusalén, NA28 identifiers, etc.), especially in references — the Bible is the Bible. Discussing the Greek, Hebrew or Latin wording of the text itself is fine.
- **Foreign-language terms**: any word, phrase or work title in a language other than the article's must carry a translation into the article's language on first mention in the body (e.g., *Oper und Drama* («Ópera y drama» / "Opera and Drama")). References at the end are exempt. No redundancy required: once translated, the term can be used freely thereafter.
- **Citing works and authors**: a work's title is a proper name and takes no determiner, in either language — «En *Confesiones*», "in *Confessions*", «en *Summa theologiae* I, q. 16», "in *Republic* X". The determiner appears only when it is part of the title itself, and then it belongs inside the italics, capitalized (*El nacimiento de la tragedia*, *La Última Cena*, *The Last Supper*, *The Two Cultures*). Conventional names that include the article as a common noun keep it (la Biblia, la Regla de San Benito / the Rule of Saint Benedict), and italicized concept-terms are unaffected (el *Gesamtkunstwerk*, the *readymade*). An author's doctrine is attributed with «según»/«para» + author ("According to/For + author"), never with «en + author».
- **Templates**: `templates/article/YYYY-MM-DD-NN/` with `draft: true`. Not processed by the loader.
- **Temporary**: `content/temporary/` holds withdrawn articles. No loader reads it, so nothing there ever reaches the site, regardless of `draft` status.
- **Markdown rendering**: Articles, landing and about all use the same `markdown-it` + `markdown-it-anchor` pipeline (via `articleLoader.ts` and `markdownLoader.ts`). H2–H4 headings receive automatic anchors; do not add manual anchor HTML in Markdown.
- **Related articles**: Article pages display up to 5 related articles ranked by shared tags.
- **Table of contents**: Articles with 3+ H2–H4 headings get a client-side TOC inserted above the body.
- **RSS feeds**: One feed per language at `/{lang}/rss.xml` with the 20 most recently edited public articles.
- **404 page**: Bilingual static `src/pages/404.astro`; detects browser language on the client.
- **SEO defaults**: `og:image` falls back to `/og-default.png` when no `heroImage` is set; `robots.txt` points to the sitemap; sitemap excludes the root redirect page at `/`.

---

## Commands

```bash
npm install     # Install dependencies
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview build
```

---

## Documentation

- `README.md` — Project overview (bilingual index)
- `docs/README.es.md` — Full documentation in Spanish
- `docs/README.en.md` — Full documentation in English
- `docs/author-guide.es.md` — Author + reviewer guide (Spanish)
- `docs/author-guide.en.md` — Author + reviewer guide (English)

---

## Deployment

- GitHub → Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist/`
- Media assets: Cloudflare R2 (configured via absolute URLs in frontmatter)

---

> *Veritas liberabit vos*
