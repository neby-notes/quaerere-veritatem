# Guia del Autor y Revisor — Quaerere Veritatem

Esta guia explica como crear, editar y revisar articulos sin necesidad de conocer el codigo fuente del proyecto. Como autor, tu eres tambien el editor de tu propio contenido: verifica el estado de tu articulo antes de publicarlo.

---

## Indice

- [Crear un articulo nuevo](#crear-un-articulo-nuevo)
- [Verificar antes de publicar](#verificar-antes-de-publicar-checklist)
- [Proceso de publicacion](#proceso-de-publicacion)
- [Errores comunes del build](#errores-comunes-del-build)
- [Reglas de featured](#reglas-de-featured)
- [Ejemplo completo](#ejemplo-completo)

---

## Crear un articulo nuevo

### 1. Copiar la plantilla

Copia la carpeta `templates/article/YYYY-MM-DD-NN/` a `content/articles/` y renombra la carpeta con el formato correcto.

```code
# Ejemplo:
2026-10-15-01
```

### 2. Formato del articleId

La carpeta debe seguir el formato: `YYYY-MM-DD-NN`

- `YYYY-MM-DD`: fecha de creacion (ej. `2026-10-15`).
- `NN`: numero secuencial de dos o mas digitos (ej. `01`, `02`).

Este identificador es **inmutable** y define la URL del articulo.

### 3. Rellenar los archivos de idioma

Dentro de la carpeta del articulo, crea o edita:

- `es.md` — version en espanol
- `en.md` — version en ingles

Puedes crear ambos, uno solo, o uno publicado y otro en borrador.

### 4. Frontmatter

Cada archivo `.md` debe comenzar con este bloque:

```yaml
---
title: "Titulo del articulo"
author: "Tu nombre"
description: "Descripcion breve del articulo (1-2 frases)"
heroImage: "https://mir2.com/defaultHeroImage.png"  # opcional; URL absoluta
created: 2026-10-15
edited: 2026-10-15
draft: true          # true = no publico; false = publico
featured: false     # true = puede aparecer en destacados
tags:
  - philosophy
  - inquiry
---
```

**Reglas:**

- `title`, `author`, `description`, `created`, `edited`, `tags`: obligatorios.
- `tags`: array con al menos un elemento.
- `heroImage`: opcional. Si lo usas, debe ser una URL valida (preferiblemente en R2).
- `draft`: mientras trabajes, mantenlo en `true`.
- `featured`: solo `true` si el articulo es destacado.

### 5. Tags

Los tags deben ser **IDs canonicos** definidos en `content/config/tags.json`.

Ejemplo valido:

```yaml
tags:
  - philosophy
  - truth
```

Ejemplo invalido:

```yaml
tags:
  - filosofia       # ERROR: no es el ID canonico
  - filosofía         # ERROR: acentos no coinciden con ID
```

Si necesitas un tag nuevo, debes anadirlo primero a `content/config/tags.json` con sus traducciones.

### 6. Contenido

Despues del frontmatter, escribe el cuerpo del articulo en Markdown estandar.

---

## Verificar antes de publicar (checklist)

Antes de cambiar `draft: false`, revisa:

### Frontmatter

- [ ] `title` esta presente y no es vacio.
- [ ] `author` esta presente.
- [ ] `description` esta presente y es descriptiva.
- [ ] `created` tiene formato de fecha valido (`YYYY-MM-DD`).
- [ ] `edited` tiene formato de fecha valido.
- [ ] `draft` esta en `true` (cambiar a `false` cuando este listo).
- [ ] `featured` tiene sentido para el contenido.

### Tags

- [ ] Cada tag en `tags` existe en `content/config/tags.json`.
- [ ] Los tags son IDs canonicos (no traducciones).
- [ ] Hay al menos un tag.
- [ ] Los tags son relevantes para el contenido.

### Contenido

- [ ] El cuerpo del articulo tiene sentido y esta completo.
- [ ] No hay errores de formato Markdown obvios.
- [ ] Las imagenes (si hay) usan URLs absolutas validas.

### Traducciones

- [ ] Si hay `es.md` y `en.md`, ambos cubren el mismo tema.
- [ ] Los tags son los mismos IDs en ambos idiomas.
- [ ] Un idioma puede estar en draft mientras el otro se publica.

---

## Proceso de publicacion

1. Completa la checklist de arriba.
2. Cambia `draft: false`.
3. Actualiza `edited` si es necesario.
4. Guarda el archivo.
5. Ejecuta el build local para detectar errores:

   ```bash
   npm run build
   ```

6. Si el build falla, corrige los errores reportados.
7. Commit y push a `main`.
8. Cloudflare Pages se encarga del despliegue automatico.

---

## Errores comunes del build

### Tag desconocido

```code
Build Error: Invalid article tags detected.
  Tag "xyz" | content/articles/2026-10-15-01/es.md | es
```

**Solucion:** Anadir el tag a `content/config/tags.json` o corregir el tag en el frontmatter.

### articleId invalido

```code
Invalid articleId "2026-02-30-01". Must match format YYYY-MM-DD-NN
```

**Solucion:** Corregir la fecha (debe ser real) o el formato.

### Tags vacios

```code
Frontmatter validation error: tags — tags must have at least one element
```

**Solucion:** Anadir al menos un tag valido.

---

## Reglas de `featured`

- `featured: true` solo tiene efecto si `draft: false`.
- Un draft con `featured: true` **nunca** aparece publicamente.
- Los articulos destacados aparecen en la seccion "Destacados" de la landing.

## Fechas

- `created`: fecha de creacion del articulo. No cambiar despues de publicar.
- `edited`: fecha de ultima edicion. Actualizar cuando se hacen correcciones significativas.

---

## Ejemplo completo

Archivo: `content/articles/2026-10-15-01/es.md`

```yaml
---
title: "La naturaleza del conocimiento"
author: "Juan Perez"
description: "Una reflexion sobre como adquirimos conocimiento."
heroImage: "https://mir2.com/defaultHeroImage.png"
created: 2026-10-15
edited: 2026-10-15
draft: false
featured: false
tags:
  - epistemology
  - philosophy
---

El conocimiento humano es un proceso continuo de indagacion...
```

---

## Documentacion relacionada

- [README del proyecto](README.es.md) — Documentacion general de Quaerere Veritatem.
- [Author guide in English](author-guide.en.md) — English version of this guide.

---
---

  -- NEBY --
