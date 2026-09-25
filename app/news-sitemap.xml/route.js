import { getAllArticles } from '../../lib/articles';
import { SITE_URL } from '../../lib/data';

export const dynamic = 'force-static';

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Google News sitemap: only articles published in the last 48 hours.
// Because the site is statically exported, this is refreshed on every build.
export async function GET() {
  const articles = await getAllArticles();
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = articles.filter((a) => a.date && new Date(a.date).getTime() >= cutoff).slice(0, 1000);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recent.map((a) => `  <url>
    <loc>${SITE_URL}/article/${a.id}</loc>
    <news:news>
      <news:publication><news:name>NDNews</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${new Date(a.date).toISOString()}</news:publication_date>
      <news:title>${esc(a.title)}</news:title>
    </news:news>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
