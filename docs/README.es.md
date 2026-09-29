# Quaerere Veritatem

> **Quaerere Veritatem** — *"Buscar la verdad"*

Digital garden polimático construido con Astro, Tailwind CSS y TypeScript.

---

## Índice

- [Quaerere Veritatem](#quaerere-veritatem)
  - [Índice](#índice)
  - [Qué es este proyecto](#qué-es-este-proyecto)
  - [Stack tecnológico](#stack-tecnológico)
  - [Estructura del repositorio](#estructura-del-repositorio)
  - [Cómo funciona el contenido](#cómo-funciona-el-contenido)
    - [Identidad del artículo (`articleId`)](#identidad-del-artículo-articleid)
    - [Traducciones](#traducciones)
    - [Frontmatter](#frontmatter)
  - [Sistema de tags](#sistema-de-tags)
  - [Sistema bilingüe](#sistema-bilingüe)
  - [Cómo crear un artículo](#cómo-crear-un-artículo)
  - [Cómo publicar](#cómo-publicar)
  - [Documentación adicional](#documentación-adicional)
  - [Desarrollo local](#desarrollo-local)

---

## Qué es este proyecto

Quaerere Veritatem es un digital garden que explora ideas a través de múltiples disciplinas sin imponer una estructura jerárquica rígida. Los artículos se organizan mediante tags dinámicos que actúan como filtros de la interfaz.

Principios:

- Las disciplinas **no** son la estructura del sitio.
- Los tags son la única taxonomía.
- El contenido es la fuente de verdad.
- No se requiere modificar código para añadir artículos.

---

## Stack tecnológico

| Tecnología | Versión | Propósito |
| --- | --- | --- |
| Astro | 7.x | Framework SSG |
| Tailwind CSS | 4.x | Estilos (via Vite plugin) |
| TypeScript | — | Tipado |
| MiniSearch | — | Búsqueda en cliente |
| Zod | — | Validación de schemas |
| Markdown-it | — | Renderizado Markdown |

---

## Estructura del repositorio

```code
quaerere-veritatem/
├── content/               ← Fuente de verdad editable
│   ├── articles/          ← Artículos (YYYY-MM-DD-NN/)
│   ├── landing/           ← Contenido de la página de inicio
│   ├── about/             ← Contenido de About
│   └── config/
│       └── tags.json      ← Registro de tags conceptuales
├── templates/
│   └── article/           ← Plantilla para nuevos artículos
├── src/                   ← Código de la aplicación
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── lib/
│   ├── styles/
│   └── content/
│       └── loaders/
│           └── articleLoader.ts  ← Loader con markdown-it
├── docs/                  ← Documentación de autor y de proyecto
├── public/                ← Assets estáticos
└── package.json
```

---

## Cómo funciona el contenido

### Identidad del artículo (`articleId`)

Cada artículo conceptual vive en una carpeta con formato:

```code
content/articles/YYYY-MM-DD-NN/
```

Ejemplo: `2026-09-28-01/`

- `YYYY-MM-DD`: fecha de creación.
- `NN`: número secuencial de dos o más dígitos (`01`, `02`, ...).

Este identificador es **inmutable** y es la única fuente de la URL pública:

```code
/es/2026-09-28-01/
/en/2026-09-28-01/
```

### Traducciones

Dentro de la carpeta del artículo:

- `es.md` — versión en español
- `en.md` — versión en inglés

Pueden existir ambas, solo una, o una publicada y otra en borrador.

### Frontmatter

```yaml
---
title: "Título del artículo"
author: "Nombre del autor"
description: "Descripción breve"
heroImage: ""  # opcional
created: 2026-09-28
edited: 2026-09-28
draft: true          # true = no público
featured: false      # true = puede aparecer en destacados
tags:
  - tag
  - otro-tag
---
```

**Reglas:**

- `title`, `author`, `description`, `created`, `edited`, `tags` son obligatorios.
- `tags` debe tener al menos un elemento.
- Los tags deben ser **IDs canónicos** del registro (`content/config/tags.json`).
- No se aceptan traducciones de tags en el frontmatter.

---

## Sistema de tags

La única autoridad es `content/config/tags.json`:

```json
{
  "tags": [
    {
      "id": "tag",
      "es": "etiqueta",
      "en": "tag"
    }
  ]
}
```

- En `frontmatter.tags` solo pueden aparecer los `id`.
- La UI se encarga de traducirlos al idioma activo.
- Un tag desconocido en un artículo provoca **fallo del build**.

---

## Sistema de diseño visual

### Paleta

Todos los colores son variables CSS. El modo oscuro redefine las **mismas** variables (`src/styles/palette.css`). No hay clases `dark:` duplicadas.

| Token | Claro | Oscuro |
|-------|-------|--------|
| `paper` | `#F5F1E8` | `#1E211D` |
| `surface` | `#FAF8F3` | `#252A25` |
| `ink` | `#252820` | `#E8E5DB` |
| `muted` | `#667064` | `#A7AEA4` |
| `border` | `#D8D2C5` | `#454A43` |
| `accent` | `#285C46` | `#82B494` |

### Tipografía

- **Literata**: cuerpo, headings, todo el contenido Markdown.
- **Inter**: navegación, metadata, tags, botones, controles.
- **Libre Baskerville**: blockquotes, citas, voz citada.

### Layouts por contexto

| Contexto | Ancho máximo |
|----------|-------------|
| Artículo | `68ch` |
| About | `72ch` |
| Landing / Default | `80ch` |

### Componentes UI

- **LanguageSwitcher**: toggle segmentado ES / EN. Estado activo: fondo `accent`, texto `paper`.
- **ThemeToggle**: toggle segmentado ☀️ / 🌙. Controlado por JS, persiste en `localStorage`.
- **Mobile menu**: botón hamburguesa visible solo en móvil, menú desplegable con indicador activo (borde lateral verde).

---

## Sistema bilingüe

- URLs con prefijo obligatorio: `/es/...` y `/en/...`.
- El idioma por defecto es el español, pero también lleva prefijo.
- El cambio de idioma en un artículo redirige a la traducción homóloga si existe; si no, al home del idioma destino.

---

## Cómo crear un artículo

1. Copiar la plantilla:

   ```bash
   cp -r templates/article/YYYY-MM-DD-NN content/articles/2026-09-28-03
   ```

2. Rellenar `es.md` y/o `en.md`.
3. Asegurar que `draft: true` mientras esté en trabajo.
4. Verificar que todos los tags existen en `content/config/tags.json`.
5. Cambiar `draft: false` cuando esté listo para publicar.

---

## Cómo publicar

El despliegue es automático via GitHub > Cloudflare Pages:

1. Commit y push a `main`.
2. Cloudflare Pages ejecuta `npm run build`.
3. El sitio se actualiza automáticamente.

---

## Documentación adicional

- [Guía del autor y revisor](author-guide.es.md) — Cómo crear, editar y publicar artículos paso a paso.
- [README en inglés](README.en.md) — Versión en inglés de esta documentación.

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Previsualizar build
npm run preview
```

---

> *Veritas liberavit vos*

---
---

  -- NEBY --
