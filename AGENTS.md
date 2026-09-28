# Quaerere Veritatem — Agent Context

This file provides context for any AI agent, IDE assistant, or automated tool working on this repository.

---

## Project Overview

**Quaerere Veritatem** is a polymathic digital garden built with Astro, Tailwind CSS, and TypeScript. It explores ideas across multiple disciplines without imposing a rigid hierarchical structure. Articles are organized through dynamic tags.

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

---

## Repository Structure

```
quaerere-veritatem/
├── content/               ← Editable source of truth
│   ├── articles/          ← Articles (YYYY-MM-DD-NN/)
│   ├── landing/           ← Homepage content
│   ├── about/             ← About content
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
│   └── styles/
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
7. **Drafts**: `draft: true` excludes content from all public output (pages, lists, search, sitemap).
8. **Vanilla JS**: No React, Vue, Svelte, or Alpine. Client interactivity uses vanilla TypeScript.

---

## Content Conventions

- **articleId format**: `YYYY-MM-DD-NN` where date is real and `NN` has 2+ digits.
- **Frontmatter tags**: Must be canonical IDs from `tags.json`. No translations in frontmatter.
- **Translations**: `es.md` and/or `en.md` inside the article folder. Independent draft status.
- **Templates**: `templates/article/YYYY-MM-DD-NN/` with `draft: true`. Not processed by the loader.

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

- GitHub > Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist/`
- Media assets: Cloudflare R2 (configured via absolute URLs in frontmatter)

---

> *Veritas liberavit vos*