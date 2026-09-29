import { getCollection } from 'astro:content';
import type { ArticleTranslation, ArticleConcept, Locale } from '../types';

export async function getAllArticles(): Promise<ArticleTranslation[]> {
  const entries = await getCollection('articles');
  return entries.map((entry) => ({
    articleId: entry.data.articleId,
    lang: entry.data.lang as Locale,
    title: entry.data.title,
    author: entry.data.author,
    description: entry.data.description,
    heroImage: entry.data.heroImage,
    created: entry.data.created,
    edited: entry.data.edited,
    draft: entry.data.draft,
    featured: entry.data.featured,
    tags: entry.data.tags,
    body: entry.rendered?.html ?? entry.data.body,
  }));
}

export async function getPublicArticles(lang?: Locale): Promise<ArticleTranslation[]> {
  const all = await getAllArticles();
  return all.filter((a) => !a.draft && (!lang || a.lang === lang));
}

export async function getArticleConcepts(): Promise<ArticleConcept[]> {
  const all = await getAllArticles();
  const byId = new Map<string, ArticleConcept>();

  for (const article of all) {
    if (!byId.has(article.articleId)) {
      byId.set(article.articleId, {
        articleId: article.articleId,
        translations: {},
        availableLangs: [],
      });
    }
    const concept = byId.get(article.articleId)!;
    concept.translations[article.lang] = article;
    if (!concept.availableLangs.includes(article.lang)) {
      concept.availableLangs.push(article.lang);
    }
  }

  return Array.from(byId.values());
}

export async function getPublicArticleConcepts(): Promise<ArticleConcept[]> {
  const concepts = await getArticleConcepts();
  return concepts
    .map((concept) => ({
      ...concept,
      translations: Object.fromEntries(
        Object.entries(concept.translations).filter(([, t]) => !t.draft)
      ) as ArticleConcept['translations'],
      availableLangs: concept.availableLangs.filter(
        (lang) => concept.translations[lang] && !concept.translations[lang]?.draft
      ),
    }))
    .filter((concept) => concept.availableLangs.length > 0);
}

export async function getPublicArticleConceptsByLang(lang: Locale): Promise<ArticleConcept[]> {
  const publicConcepts = await getPublicArticleConcepts();
  return publicConcepts.filter((concept) => concept.availableLangs.includes(lang));
}

export async function getPublicArticle(articleId: string, lang: Locale): Promise<ArticleTranslation | undefined> {
  const publicArticles = await getPublicArticles(lang);
  return publicArticles.find((a) => a.articleId === articleId);
}

export async function getFeaturedArticles(lang: Locale): Promise<ArticleTranslation[]> {
  const publicArticles = await getPublicArticles(lang);
  return publicArticles.filter((a) => a.featured).slice(0, 5);
}

export async function getLatestArticles(lang: Locale, limit?: number): Promise<ArticleTranslation[]> {
  const publicArticles = await getPublicArticles(lang);
  const sorted = [...publicArticles].sort(
    (a, b) => new Date(b.edited).getTime() - new Date(a.edited).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getLandingContent(lang: Locale) {
  const entries = await getCollection('landing');
  const entry = entries.find((e) => e.id === lang);
  if (!entry) return null;
  return {
    title: entry.data.title as string,
    body: entry.rendered?.html ?? '',
  };
}

export async function getAboutContent(lang: Locale) {
  const entries = await getCollection('about');
  const entry = entries.find((e) => e.id === lang);
  if (!entry) return null;
  return {
    title: entry.data.title as string,
    body: entry.rendered?.html ?? '',
  };
}