import type { ArticleConcept } from '../types';

export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export function getTranslationMap(articles: ArticleConcept[]): Record<string, Locale[]> {
  const map: Record<string, Locale[]> = {};
  for (const article of articles) {
    map[article.articleId] = article.availableLangs;
  }
  return map;
}

export function getAlternateLangUrl(
  currentLang: Locale,
  targetLang: Locale,
  articleId: string | undefined,
  translationMap: Record<string, Locale[]>
): string {
  if (articleId && translationMap[articleId]?.includes(targetLang)) {
    return `/${targetLang}/${articleId}/`;
  }
  return `/${targetLang}/`;
}