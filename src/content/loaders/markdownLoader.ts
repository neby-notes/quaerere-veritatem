import type { Loader } from 'astro/loaders';
import { readFile, readdir } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

const md = new MarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
  typographer: true,
}).use(markdownItAnchor, {
  level: [2, 3, 4],
  permalink: false,
  slugify: (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-'),
});

export function markdownLoader(baseDir: string): Loader {
  return {
    name: `markdown-loader-${baseDir}`,
    load: async ({ store, parseData, config }) => {
      const basePath = join(fileURLToPath(config.root), 'content', baseDir);

      store.clear();

      let files: string[];
      try {
        files = await readdir(basePath);
      } catch {
        return;
      }

      for (const file of files) {
        if (extname(file) !== '.md') continue;

        const lang = basename(file, '.md');
        if (lang !== 'es' && lang !== 'en') continue;

        const filePath = join(basePath, file);
        const content = await readFile(filePath, 'utf-8');
        const parsed = matter(content);

        const parsedData = await parseData({
          id: lang,
          data: {
            ...parsed.data,
            lang,
            body: parsed.content,
          },
        });

        store.set({
          id: lang,
          data: parsedData,
          rendered: { html: md.render(parsed.content) },
        });
      }
    },
  };
}
