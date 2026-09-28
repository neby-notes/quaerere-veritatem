import MiniSearch from 'minisearch';
import type { ArticleTranslation } from '../types';

export interface SearchDocument {
  id: string;
  articleId: string;
  lang: string;
  title: string;
  description: string;
  tags: string;
  body: string;
}

export function buildSearchDocuments(articles: ArticleTranslation[]): SearchDocument[] {
  return articles.map((article) => ({
    id: `${article.articleId}-${article.lang}`,
    articleId: article.articleId,
    lang: article.lang,
    title: article.title,
    description: article.description,
    tags: article.tags.join(' '),
    body: article.body,
  }));
}

export function createMiniSearch(documents: SearchDocument[]) {
  const miniSearch = new MiniSearch({
    fields: ['title', 'description', 'tags', 'body'],
    storeFields: ['articleId', 'lang', 'title'],
  });
  miniSearch.addAll(documents);
  return miniSearch;
}

export function serializeIndex(miniSearch: MiniSearch): string {
  return JSON.stringify(miniSearch.toJSON());
}