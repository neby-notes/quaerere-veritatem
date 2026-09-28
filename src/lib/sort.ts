import type { ArticleTranslation } from '../types';

export type SortMode = 'created-asc' | 'created-desc' | 'edited-asc' | 'edited-desc' | 'alpha-asc' | 'alpha-desc' | 'featured';

export function sortArticles(articles: ArticleTranslation[], mode: SortMode): ArticleTranslation[] {
  const sorted = [...articles];

  switch (mode) {
    case 'created-asc':
      return sorted.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
    case 'created-desc':
      return sorted.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    case 'edited-asc':
      return sorted.sort((a, b) => new Date(a.edited).getTime() - new Date(b.edited).getTime());
    case 'edited-desc':
      return sorted.sort((a, b) => new Date(b.edited).getTime() - new Date(a.edited).getTime());
    case 'alpha-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'alpha-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });
    default:
      return sorted;
  }
}