# Quaerere Veritatem

> **Quaerere Veritatem** — *"To seek the truth"*

A polymathic digital garden built with Astro, Tailwind CSS, and TypeScript.

---

## Table of Contents

- [Quaerere Veritatem](#quaerere-veritatem)
  - [Table of Contents](#table-of-contents)
  - [What is this project](#what-is-this-project)
  - [Tech Stack](#tech-stack)
  - [Repository Structure](#repository-structure)
  - [How Content Works](#how-content-works)
    - [Article Identity (`articleId`)](#article-identity-articleid)
    - [Translations](#translations)
    - [Frontmatter](#frontmatter)
  - [Tag System](#tag-system)
  - [Bilingual System](#bilingual-system)
  - [How to Create an Article](#how-to-create-an-article)
  - [How to Publish](#how-to-publish)
  - [Additional Documentation](#additional-documentation)
  - [Local Development](#local-development)

---

## What is this project

Quaerere Veritatem is a digital garden that explores ideas across multiple disciplines without imposing a rigid hierarchical structure. Articles are organized through dynamic tags that act as filters in the interface.

Principles:

- Disciplines are **not** the site structure.
- Tags are the only taxonomy.
- Content is the source of truth.
- No code changes required to add articles.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Astro | 7.x | SSG framework |
| Tailwind CSS | 4.x | Styling |
| TypeScript | — | Static typing |
| MiniSearch | — | Client-side search |
| Zod | — | Schema validation |

---

## Repository Structure

```code
quaerere-veritatem/
├── content/               ← Editable source of truth
│   ├── articles/          ← Articles (YYYY-MM-DD-NN/)
│   ├── landing/           ← Homepage content
│   ├── about/             ← About content
│   └── config/
│       └── tags.json      ← Conceptual tag registry
├── templates/
│   └── article/           ← Template for new articles
├── src/                   ← Application code
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── lib/
│   └── styles/
├── docs/                  ← Author and project documentation
├── public/                ← Static assets
└── package.json
```

---

## How Content Works

### Article Identity (`articleId`)

Each conceptual article lives in a folder formatted as:

```code
content/articles/YYYY-MM-DD-NN/
```

Example: `2026-09-28-01/`

- `YYYY-MM-DD`: creation date.
- `NN`: sequential number with two or more digits (`01`, `02`, ...).

This identifier is **immutable** and is the sole source of the public URL:

```code
/es/2026-09-28-01/
/en/2026-09-28-01/
```

### Translations

Inside the article folder:

- `es.md` — Spanish version
- `en.md` — English version

Both may exist, only one, or one published and the other a draft.

### Frontmatter

```yaml
---
title: "Article Title"
author: "Author Name"
description: "Short description"
heroImage: "https://mir2.com/defaultHeroImage.png"  # optional
created: 2026-09-28
edited: 2026-09-28
draft: true          # true = not public
featured: false      # true = may appear in featured
tags:
  - philosophy
  - truth
---
```

**Rules:**

- `title`, `author`, `description`, `created`, `edited`, `tags` are required.
- `tags` must have at least one element.
- Tags must be **canonical IDs** from the registry (`content/config/tags.json`).
- Tag translations in frontmatter are not accepted.

---

## Tag System

The sole authority is `content/config/tags.json`:

```json
{
  "tags": [
    {
      "id": "philosophy",
      "es": "filosofía",
      "en": "philosophy"
    }
  ]
}
```

- In `frontmatter.tags`, only `id` values may appear.
- The UI handles translation to the active language.
- An unknown tag in an article causes the **build to fail**.

---

## Bilingual System

- URLs with mandatory prefix: `/es/...` and `/en/...`.
- The default language is Spanish, but it also carries a prefix.
- Language switching on an article redirects to the homologous translation if it exists; otherwise to the target language home.

---

## How to Create an Article

1. Copy the template:

   ```bash
   cp -r templates/article/YYYY-MM-DD-NN content/articles/2026-09-28-03
   ```

2. Fill in `es.md` and/or `en.md`.
3. Ensure `draft: true` while in progress.
4. Verify all tags exist in `content/config/tags.json`.
5. Change `draft: false` when ready to publish.

---

## How to Publish

Deployment is automatic via GitHub > Cloudflare Pages:

1. Commit and push to `main`.
2. Cloudflare Pages runs `npm run build`.
3. The site updates automatically.

---

## Additional Documentation

- [Author and reviewer guide](author-guide.en.md) — How to create, edit, and publish articles step by step.
- [README in Spanish](README.es.md) — Spanish version of this documentation.

---

## Local Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

---
---

  -- NEBY --
