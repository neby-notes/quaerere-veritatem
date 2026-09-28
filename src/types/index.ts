export interface ArticleTranslation {
  articleId: string;
  lang: 'es' | 'en';
  title: string;
  author: string;
  description: string;
  heroImage?: string;
  created: Date;
  edited: Date;
  draft: boolean;
  featured: boolean;
  tags: string[];
  body: string;
}

export interface ArticleConcept {
  articleId: string;
  translations: {
    es?: ArticleTranslation;
    en?: ArticleTranslation;
  };
  availableLangs: ('es' | 'en')[];
}

export interface TagRegistryEntry {
  id: string;
  es: string;
  en: string;
}

export interface TagRegistry {
  tags: TagRegistryEntry[];
}