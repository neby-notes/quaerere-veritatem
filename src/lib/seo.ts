import type { Locale } from './i18n';

export function getCanonicalUrl(site: string, lang: Locale, path: string): string {
  const cleanPath = path.replace(/^\//, '').replace(/\/$/, '');
  return `${site}/${lang}/${cleanPath}/`;
}

export function generateHreflang(
  articleId: string | undefined,
  availableLangs: Locale[],
  site: string
): { lang: string; url: string }[] {
  const links: { lang: string; url: string }[] = [];

  for (const lang of availableLangs) {
    const path = articleId ? `${articleId}/` : '';
    links.push({
      lang,
      url: `${site}/${lang}/${path}`,
    });
  }

  // x-default
  if (availableLangs.length > 0) {
    const defaultLang = availableLangs.includes('es') ? 'es' : availableLangs[0];
    const path = articleId ? `${articleId}/` : '';
    links.push({
      lang: 'x-default',
      url: `${site}/${defaultLang}/${path}`,
    });
  }

  return links;
}