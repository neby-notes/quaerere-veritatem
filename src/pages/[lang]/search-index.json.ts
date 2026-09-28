import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildSearchDocuments, createMiniSearch, serializeIndex } from '../../lib/search';

export async function getStaticPaths() {
  return [
    { params: { lang: 'es' } },
    { params: { lang: 'en' } },
  ];
}

export const GET: APIRoute = async ({ params }) => {
  const { lang } = params;

  const entries = await getCollection('articles');
  const articles = entries
    .filter((e) => e.data.lang === lang && !e.data.draft)
    .map((e) => ({
      articleId: e.data.articleId,
      lang: e.data.lang,
      title: e.data.title,
      description: e.data.description,
      tags: e.data.tags,
      body: e.data.body,
    }));

  const documents = buildSearchDocuments(articles);
  const miniSearch = createMiniSearch(documents);
  const serialized = serializeIndex(miniSearch);

  return new Response(serialized, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};