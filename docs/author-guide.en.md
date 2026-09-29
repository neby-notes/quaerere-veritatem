# Author and Reviewer Guide — Quaerere Veritatem

This guide explains how to create, edit, and review articles without knowing the project's source code. As an author, you are also the editor of your own content: verify your article's status before publishing.

---

## Table of Contents

- [Creating a New Article](#creating-a-new-article)
- [Review Before Publishing (Checklist)](#review-before-publishing-checklist)
- [Publication Process](#publication-process)
- [Common Build Errors](#common-build-errors)
- [`featured` Rules](#featured-rules)
- [Complete Example](#complete-example)

---

## Creating a New Article

### 1. Copy the Template

Copy the folder `templates/article/YYYY-MM-DD-NN/` to `content/articles/` and rename it with the correct format.

```code
# Example:
2026-10-15-01
```

### 2. articleId Format

The folder must follow the format: `YYYY-MM-DD-NN`

- `YYYY-MM-DD`: creation date (e.g., `2026-10-15`).
- `NN`: sequential number with two or more digits (e.g., `01`, `02`).

This identifier is **immutable** and defines the article's URL.

### 3. Fill in Language Files

Inside the article folder, create or edit:

- `es.md` — Spanish version
- `en.md` — English version

You may create both, only one, or one published and the other a draft.

### 4. Frontmatter

Each `.md` file must begin with this block:

```yaml
---
title: "Article Title"
author: "NEBY"
description: "Brief description of the article (1-2 sentences)"
heroImage: ""  # optional; absolute URL
created: 2026-10-15
edited: 2026-10-15
draft: true          # true = not public; false = public
featured: false     # true = may appear in featured
tags:
  - tag
  - another-tag
---
```

**Rules:**

- `title`, `author`, `description`, `created`, `edited`, `tags`: required.
- `tags`: array with at least one element.
- `heroImage`: optional. If used, must be a valid URL (preferably R2).
- `draft`: keep `true` while working.
- `featured`: only `true` if the article is featured.

### Hero images

The `heroImage` field is optional. If you include one, use an absolute URL (ideally hosted on R2 or a CDN).

Recommended specs for best results:

- **Aspect ratio**: 16:9 or 3:2
- **Minimum width**: 900px (the container is `68ch` wide)
- **Safe area**: keep important content away from the top edge; the image is cropped from the top when it exceeds the max height
- **Max display height**: 384px (`max-h-96`). The CSS crops via `object-cover`, so the image will never look stretched

If you omit `heroImage`, the article simply shows no header image.

### 5. Tags

Tags must be **canonical IDs** defined in `content/config/tags.json`.

Valid example:

```yaml
tags:
  - tag
```

Invalid example:

```yaml
tags:
  - etiqueta       # ERROR: not the canonical ID
  - Tag            # ERROR: case mismatch
```

### How to create a new tag

Tags are not defined inside the article: they are registered in `content/config/tags.json`. To create a new one:

1. Open `content/config/tags.json`.
2. Add an object inside the `tags` array with this shape:

   ```json
   {
     "id": "my-new-tag",
     "es": "Mi nueva etiqueta",
     "en": "My new tag"
   }
   ```

3. Save the file.
4. Use the `id` (not the translation) in the article frontmatter.

**Rules for the `id`:**
- Lowercase letters, numbers, and hyphens only.
- No spaces or accents.
- Must be unique across the entire registry.

### 6. Content

After the frontmatter, write the article body in standard Markdown.

---

## Review Before Publishing (Checklist)

Before changing `draft: false`, review:

### Frontmatter

- [ ] `title` is present and not empty.
- [ ] `author` is present.
- [ ] `description` is present and descriptive.
- [ ] `created` has valid date format (`YYYY-MM-DD`).
- [ ] `edited` has valid date format.
- [ ] `draft` is `true` (change to `false` when ready).
- [ ] `featured` makes sense for the content.

### Tags

- [ ] Every tag in `tags` exists in `content/config/tags.json`.
- [ ] Tags are canonical IDs (not translations).
- [ ] There is at least one tag.
- [ ] Tags are relevant to the content.

### Content

- [ ] The article body makes sense and is complete.
- [ ] No obvious Markdown formatting errors.
- [ ] Images (if any) use valid absolute URLs.

### Translations

- [ ] If both `es.md` and `en.md` exist, they cover the same topic.
- [ ] Tags are the same IDs in both languages.
- [ ] One language may be draft while the other is published.

---

## Publication Process

1. Complete the checklist above.
2. Change `draft: false`.
3. Update `edited` if needed.
4. Save the file.
5. Run the local build to catch errors:

   ```bash
   npm run build
   ```

6. If the build fails, fix the reported errors.
7. Commit and push to `main`.
8. Cloudflare Pages handles automatic deployment.

---

## Common Build Errors

### Unknown Tag

```code
Build Error: Invalid article tags detected.
  Tag "xyz" | content/articles/2026-10-15-01/en.md | en
```

**Solution:** Add the tag to `content/config/tags.json` or correct the tag in frontmatter.

### Invalid articleId

```code
Invalid articleId "2026-02-30-01". Must match format YYYY-MM-DD-NN
```

**Solution:** Correct the date (must be real) or the format.

### Empty Tags

```code
Frontmatter validation error: tags — tags must have at least one element
```

**Solution:** Add at least one valid tag.

---

## `featured` Rules

- `featured: true` only takes effect if `draft: false`.
- A draft with `featured: true` **never** appears publicly.
- Featured articles appear in the "Featured" section of the landing page.

## Dates

- `created`: article creation date. Do not change after publishing.
- `edited`: last edit date. Update when significant corrections are made.

---

## Complete Example

File: `content/articles/2026-10-15-01/en.md`

```yaml
---
title: "The Nature of Knowledge"
author: "NEBY"
description: "A reflection on how we acquire knowledge."
heroImage: ""
created: 2026-10-15
edited: 2026-10-15
draft: false
featured: false
tags:
  - tag
---

Human knowledge is a continuous process of inquiry...
```

---

## Related Documentation

- [Project README](README.en.md) — General documentation for Quaerere Veritatem.
- [Guia del autor en español](author-guide.es.md) — Spanish version of this guide.

---
---

  -- NEBY --
