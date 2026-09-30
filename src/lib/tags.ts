import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { TagRegistry, TagRegistryEntry, Locale } from '../types';

let cachedRegistry: TagRegistry | null = null;

export async function loadTagRegistry(): Promise<TagRegistry> {
  if (cachedRegistry) return cachedRegistry;
  const content = await readFile(join(process.cwd(), 'content', 'config', 'tags.json'), 'utf-8');
  cachedRegistry = JSON.parse(content) as TagRegistry;
  return cachedRegistry;
}

export function getValidTagIds(registry: TagRegistry): Set<string> {
  return new Set(registry.tags.map((t) => t.id));
}

export function getTagTranslations(registry: TagRegistry): Record<string, Record<Locale, string>> {
  const map: Record<string, Record<Locale, string>> = {};
  for (const tag of registry.tags) {
    map[tag.id] = {
      es: tag.es,
      en: tag.en,
    };
  }
  return map;
}

export function translateTag(tagId: string, lang: Locale, registry: TagRegistry): string {
  const tag = registry.tags.find((t) => t.id === tagId);
  return tag?.[lang] ?? tagId;
}

export function getTagOrder(registry: TagRegistry): Map<string, number> {
  return new Map(registry.tags.map((t, i) => [t.id, i]));
}

export function sortTagsByCanonicalOrder<T extends { id: string }>(
  tags: T[],
  order: Map<string, number>
): T[] {
  return [...tags].sort((a, b) => {
    const oa = order.get(a.id) ?? Infinity;
    const ob = order.get(b.id) ?? Infinity;
    return oa - ob;
  });
}