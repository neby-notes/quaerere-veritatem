import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { loadTagRegistry, translateTag } from '../../lib/tags';
import type { Locale } from '../../lib/i18n';

export async function getStaticPaths() {
  return [
    { params: { lang: 'es' } },
    { params: { lang: 'en' } },
  ];
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Locale;
  const site = 'https://quaerere-veritatem.pages.dev';
  const registry = await loadTagRegistry();

  const entries = await getCollection('articles');
  const articles = entries
    .filter((e) => e.data.lang === lang && !e.data.draft)
    .sort((a, b) => new Date(b.data.edited).getTime() - new Date(a.data.edited).getTime())
    .slice(0, 20);

  return rss({
    title: lang === 'es' ? 'Quaerere Veritatem' : 'Quaerere Veritatem',
    description:
      lang === 'es'
        ? 'Digital garden polimático dedicado a la búsqueda de la verdad.'
        : 'Polymathic digital garden dedicated to the pursuit of truth.',
    site: `${site}/${lang}/`,
    items: articles.map((article) => ({
      title: article.data.title,
      link: `/${lang}/${article.data.articleId}/`,
      pubDate: new Date(article.data.edited),
      description: article.data.description,
      categories: article.data.tags.map((tag) => translateTag(tag, lang, registry)),
    })),
    customData: `<language>${lang === 'es' ? 'es-ES' : 'en-US'}</language>
<generator>Astro</generator>`,
  });
};
