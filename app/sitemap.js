import { getAllArticles, getCategoryStats } from '../lib/articles';
import { slugifyAuthor, SITE_URL } from '../lib/data';

// Only canonical, indexable URLs. Paginated listing pages (/page/N,
// /category/x/page/N) are left out on purpose: they are crawlable through
// on-page links and add no value as sitemap entries.
// changeFrequency/priority are omitted because Google ignores them.
export default async function sitemap() {
  const articles = await getAllArticles();
  const stats = await getCategoryStats();
  const latest = articles[0]?.date ? new Date(articles[0].date) : new Date();

  const core = [
    { url: SITE_URL, lastModified: latest },
    { url: `${SITE_URL}/markets`, lastModified: latest },
    { url: `${SITE_URL}/archive`, lastModified: latest },
    { url: `${SITE_URL}/about`, lastModified: new Date('2026-07-01') },
    { url: `${SITE_URL}/contact`, lastModified: new Date('2026-07-01') },
    { url: `${SITE_URL}/privacy`, lastModified: new Date('2026-07-01') },
    { url: `${SITE_URL}/terms`, lastModified: new Date('2026-07-01') },
  ];

  const categories = Object.entries(stats).map(([cat, s]) => ({
    url: `${SITE_URL}/category/${cat}`,
    lastModified: s.latestDate || latest,
  }));

  const articleUrls = articles.map((a) => ({
    url: `${SITE_URL}/article/${a.id}`,
    lastModified: new Date(a.updatedAt || a.date || latest),
  }));

  const authors = {};
  for (const a of articles) {
    const slug = slugifyAuthor(a.author);
    const d = a.date ? new Date(a.date) : latest;
    if (!authors[slug] || d > authors[slug]) authors[slug] = d;
  }
  const authorUrls = Object.entries(authors).map(([slug, d]) => ({
    url: `${SITE_URL}/author/${slug}`,
    lastModified: d,
  }));

  return [...core, ...categories, ...articleUrls, ...authorUrls];
}
