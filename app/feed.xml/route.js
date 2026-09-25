import { getAllArticles } from '../../lib/articles';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = 'https://nussadigital.co.id';
  
  const articles = (await getAllArticles()).slice(0, 20);

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NDNews - APAC Economy, Finance &amp; Sports News</title>
    <link>${baseUrl}</link>
    <description>Latest breaking news, in-depth analysis and coverage of economy, finance and sports across the Asia-Pacific region.</description>
    <language>en</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${articles.map(article => `
      <item>
        <title><![CDATA[${article.title}]]></title>
        <link>${baseUrl}/article/${article.id}</link>
        <description><![CDATA[${article.excerpt || ''}]]></description>
        <category><![CDATA[${article.category}]]></category>
        <pubDate>${new Date(article.date).toUTCString()}</pubDate>
        <guid isPermaLink="true">${baseUrl}/article/${article.id}</guid>
        ${article.image ? `<media:content url="${article.image.replace(/&/g, '&amp;')}" medium="image" />` : ''}
      </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  });
}
