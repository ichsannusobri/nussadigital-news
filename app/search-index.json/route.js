import { getAllArticles } from '../../lib/articles';

export const dynamic = 'force-static';

// Lightweight static search index. Replaces the previous client-side
// full-collection Firestore read on every search (slow, costly, and it
// shipped every article body to the browser).
export async function GET() {
  const articles = await getAllArticles();
  const index = articles.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt || '',
    category: a.category,
    tags: a.tags || [],
    date: a.date || null,
    image: a.image || null,
  }));
  return Response.json(index);
}
