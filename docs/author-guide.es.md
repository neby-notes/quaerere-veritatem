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
author: "NEBY"
description: "Descripcion breve del articulo (1-2 frases)"
heroImage: ""  # opcional; URL absoluta
created: 2026-10-15
edited: 2026-10-15
draft: true          # true = no publico; false = publico
featured: false     # true = puede aparecer en destacados
tags:
  - tag
  - otro-tag
---
```

**Reglas:**

- `title`, `author`, `description`, `created`, `edited`, `tags`: obligatorios.
- `tags`: array con al menos un elemento.
- `heroImage`: opcional. Si lo usas, debe ser una URL valida (preferiblemente en R2).
- `draft`: mientras trabajes, mantenlo en `true`.
- `featured`: solo `true` si el articulo es destacado.

### Imagenes de cabecera (heroImage)

El campo `heroImage` es opcional. Si lo incluyes, usa una URL absoluta (idealmente alojada en R2 o un CDN).

Especificaciones recomendadas para un resultado optimo:

- **Proporcion**: 16:9 o 3:2
- **Ancho minimo**: 900px (el contenedor del articulo mide `68ch` de ancho)
- **Zona segura**: evita colocar elementos importantes cerca del borde superior; la imagen se recorta por arriba si supera la altura maxima
- **Altura maxima de visualizacion**: 384px (`max-h-96`). El CSS recorta con `object-cover`, asi que la imagen nunca se deformara

Si omites `heroImage`, el articulo simplemente no muestra imagen de cabecera.

### 5. Tags

Los tags deben ser **IDs canonicos** definidos en `content/config/tags.json`.

Ejemplo valido:

```yaml
tags:
  - tag
```

Ejemplo invalido:

```yaml
tags:
  - etiqueta       # ERROR: no es el ID canonico
  - Tag            # ERROR: las mayusculas no coinciden con el ID
```

### Como crear un tag nuevo

Los tags no se definen en el articulo: se registran en `content/config/tags.json`. Para crear uno nuevo:

1. Abre `content/config/tags.json`.
2. Anade un objeto dentro del array `tags` con esta forma:

   ```json
   {
     "id": "mi-nuevo-tag",
     "es": "Mi nueva etiqueta",
     "en": "My new tag"
   }
   ```

3. Guarda el archivo.
4. Usa el `id` (no la traduccion) en el frontmatter del articulo.

**Reglas para el `id`:**
- Solo letras minusculas, numeros y guiones medios.
- Sin espacios ni acentos.
- Unico en todo el registro.

### 6. Contenido

Despues del frontmatter, escribe el cuerpo del articulo en Markdown estandar. El titulo del frontmatter se renderiza como H1 de la pagina, asi que el cuerpo no debe repetirlo y empieza directamente con el primer parrafo o un encabezado `##`.

**Enlaces entre articulos:** enlaza a otros articulos con rutas absolutas desde la raiz — `[Texto](/es/2026-09-30-01/)` en `es.md`, `[Texto](/en/2026-09-30-01/)` en `en.md`. Nunca uses enlaces relativos a archivos `.md`: esas rutas no existen en la web.

**Anclas de encabezados:** el renderizador genera anclas automaticas para los encabezados `##`, `###` y `####`. No insertes anclas HTML a mano (`<a name="..."></a>`).

**Voz del sitio:** el sitio habla en primera persona (firmo como NEBY). No te refieras al autor en tercera persona en ningun contenido.

**Santos catolicos:** llevan siempre su titulo en menciones, titulos y tags — `San/Santo ...` en espanol, `Saint ...` en ingles (San Agustin / Saint Augustine, Santo Tomas de Aquino / Saint Thomas Aquinas). Excepcion: nombres propios de obras (un titulo de libro se deja intacto). Los no catolicos (Lutero, Tertuliano, el Pseudo-Dionisio) no llevan titulo. Los adjetivos derivados (agustiniana / Augustinian) tampoco cambian.

**La Biblia:** nunca nombres versiones ni ediciones (Reina-Valera, Biblia de Jerusalen, identificadores como NA28...), sobre todo en las referencias — la Biblia es la Biblia. Discutir la forma griega, hebrea o latina del texto en si esta permitido.

**Terminos en otros idiomas:** toda palabra, frase o titulo de obra en un idioma distinto al del articulo lleva traduccion al idioma del articulo en su primera mencion dentro del cuerpo (ej. *Oper und Drama* («Ópera y drama»)). Las referencias finales estan exentas. Sin redundancia: traducido una vez, el termino se usa libremente despues.

**Paridad de traducciones:** si el articulo existe en ambos idiomas, las dos versiones deben contener exactamente la misma cantidad de contenido. En concreto:

- Mismas secciones y encabezados (traducidos), en el mismo orden.
- Mismas listas, tablas, citas y notas.
- Mismos enlaces internos a otros articulos (solo cambia el prefijo `/es/` → `/en/`).
- Titulo y descripcion traducidos por completo; nunca abreviados en un solo idioma.
- Los mismos IDs de tags en ambos frontmatter.

Si una version avanza mas que la otra, la mas completa es la fuente de verdad y la otra debe alinearse a ella antes de publicar. La paridad aplica igualmente a `content/landing/` y `content/about/`.

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

- [ ] Si hay `es.md` y `en.md`, ambos cubren el mismo tema con la misma cantidad de contenido.
- [ ] Mismas secciones, listas, tablas, citas y enlaces internos en ambos idiomas.
- [ ] Titulo y descripcion traducidos por completo en ambos, sin abreviar en uno solo.
- [ ] Los enlaces internos usan rutas absolutas `/es/...` o `/en/...` segun el idioma del archivo.
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
author: "NEBY"
description: "Una reflexion sobre como adquirimos conocimiento."
heroImage: ""
created: 2026-10-15
edited: 2026-10-15
draft: false
featured: false
tags:
  - tag
---

El conocimiento humano es un proceso continuo de indagacion...
```

---

## Documentacion relacionada

- [README del proyecto](README.es.md) — Documentacion general de Quaerere Veritatem.
- [Author guide in English](author-guide.en.md) — English version of this guide.

---

> *Veritas liberabit vos*

---
---

    -- NEBY --
