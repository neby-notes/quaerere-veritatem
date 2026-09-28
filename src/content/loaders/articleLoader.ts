import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { readFile, readdir } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const ARTICLE_ID_REGEX = /^\d{4}-\d{2}-\d{2}-\d{2,}$/;

const md = new MarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
  typographer: true,
});

const articleSchema = z.object({
  title: z.string().min(1, 'title is required'),
  author: z.string().min(1, 'author is required'),
  description: z.string().min(1, 'description is required'),
  heroImage: z.string().url().optional(),
  created: z.coerce.date(),
  edited: z.coerce.date(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string().min(1)).min(1, 'tags must have at least one element'),
});

interface TagRegistry {
  tags: Array<{ id: string; es: string; en: string }>;
}

interface ValidationError {
  tag?: string;
  articleId?: string;
  file?: string;
  lang?: string;
  message: string;
}

function isValidDate(dateStr: string): boolean {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

async function loadTagRegistry(root: URL): Promise<TagRegistry> {
  const tagsPath = join(fileURLToPath(root), 'content', 'config', 'tags.json');
  const content = await readFile(tagsPath, 'utf-8');
  return JSON.parse(content) as TagRegistry;
}



export function articleLoader(): Loader {
  return {
    name: 'article-loader',
    schema: articleSchema,
    load: async ({ store, parseData, config }) => {
      const errors: ValidationError[] = [];
      const seenArticleIds = new Set<string>();
      const basePath = join(fileURLToPath(config.root), 'content', 'articles');
      const registry = await loadTagRegistry(config.root);
      const validTagIds = new Set(registry.tags.map((t) => t.id));

      store.clear();

      let articleDirs: string[];
      try {
        articleDirs = await readdir(basePath);
      } catch {
        // No articles directory yet
        return;
      }

      for (const articleId of articleDirs) {
        const articlePath = join(basePath, articleId);

        // Validate articleId format
        if (!ARTICLE_ID_REGEX.test(articleId)) {
          errors.push({
            articleId,
            message: `Invalid articleId "${articleId}". Must match format YYYY-MM-DD-NN (e.g., 2026-09-28-01)`,
          });
          continue;
        }

        // Validate date is real
        const datePart = articleId.slice(0, 10);
        if (!isValidDate(datePart)) {
          errors.push({
            articleId,
            message: `Invalid date "${datePart}" in articleId "${articleId}". Not a valid calendar date.`,
          });
          continue;
        }

        // Check duplicates
        if (seenArticleIds.has(articleId)) {
          errors.push({
            articleId,
            message: `Duplicate articleId "${articleId}" detected.`,
          });
          continue;
        }
        seenArticleIds.add(articleId);

        // Process markdown files
        let files: string[];
        try {
          files = await readdir(articlePath);
        } catch {
          continue;
        }

        for (const file of files) {
          if (extname(file) !== '.md') continue;

          const lang = basename(file, '.md');
          if (lang !== 'es' && lang !== 'en') {
            errors.push({
              file: join(articlePath, file),
              message: `Invalid language file "${file}". Must be "es.md" or "en.md"`,
            });
            continue;
          }

          const filePath = join(articlePath, file);
          const content = await readFile(filePath, 'utf-8');
          const parsed = matter(content);

          // Validate frontmatter with Zod
          let data: z.infer<typeof articleSchema>;
          try {
            data = articleSchema.parse(parsed.data);
          } catch (e) {
            if (e instanceof z.ZodError) {
              for (const issue of e.issues) {
                errors.push({
                  file: filePath,
                  lang,
                  message: `Frontmatter validation error: ${issue.path.join('.')} — ${issue.message}`,
                });
              }
            }
            continue;
          }

          // Validate tags against registry
          for (const tag of data.tags) {
            if (!validTagIds.has(tag)) {
              errors.push({
                tag,
                file: filePath,
                lang,
                message: `Unknown tag "${tag}"`,
              });
            }
          }

          // If there are tag errors for this file, skip adding it
          const fileHasTagErrors = errors.some(
            (e) => e.file === filePath && e.tag
          );
          if (fileHasTagErrors) continue;

          // Parse and store entry
          const parsedData = await parseData({
            id: `${articleId}-${lang}`,
            data: {
              ...data,
              articleId,
              lang,
              body: parsed.content,
            },
          });

          store.set({
            id: `${articleId}-${lang}`,
            data: parsedData,
            rendered: { html: md.render(parsed.content) },
          });
        }
      }

      // Throw aggregated error if any
      if (errors.length > 0) {
        const tagErrors = errors.filter((e) => e.tag);
        const otherErrors = errors.filter((e) => !e.tag);

        let message = 'Build Error: Content validation failed.\n\n';

        if (tagErrors.length > 0) {
          message += 'Invalid article tags detected:\n\n';
          message += '  Tag         | File                                           | Language\n';
          message += '  ------------|------------------------------------------------|----------\n';
          for (const err of tagErrors) {
            const tag = err.tag?.padEnd(11) ?? '            ';
            const file = err.file?.padEnd(46) ?? '';
            const lang = err.lang?.padEnd(8) ?? '';
            message += `  ${tag} | ${file} | ${lang}\n`;
          }
          message += '\nTo fix this:\n';
          message += '  1. Add the missing tags to content/config/tags.json with translations, OR\n';
          message += '  2. Correct the tag(s) in the article frontmatter.\n\n';
        }

        if (otherErrors.length > 0) {
          message += 'Other validation errors:\n\n';
          for (const err of otherErrors) {
            message += `  [${err.articleId ?? err.file}] ${err.message}\n`;
          }
        }

        throw new Error(message);
      }
    },
  };
}
