import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { DEFAULT_ARTICLES } from '../../lib/data';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

export const metadata = {
  title: 'News Archive - NDNews',
  description: 'Complete archive of all NDNews articles.',
};

export default async function ArchivePage() {
  const q = query(collection(db, "articles"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  
  let articles = [];
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
  });

  if (articles.length === 0) {
    articles = DEFAULT_ARTICLES;
  }

  // Group articles by year and month
  const groupedArticles = articles.reduce((acc, article) => {
    const date = article.date ? new Date(article.date) : new Date();
    const yearMonth = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[yearMonth]) acc[yearMonth] = [];
    acc[yearMonth].push(article);
    return acc;
  }, {});

  return (
    <main>
      <div className="category-header-banner" style={{backgroundColor: '#111827', color: '#fff', padding: '60px 20px', textAlign: 'center'}}>
        <h1 style={{fontSize: '40px', margin: '0 0 10px 0'}}>News Archive</h1>
        <p style={{fontSize: '18px', margin: '0', opacity: 0.9}}>Browse all published articles.</p>
      </div>

      <section style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        {Object.entries(groupedArticles).map(([month, monthArticles]) => (
          <div key={month} style={{ marginBottom: '40px' }}>
            <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#111827' }}>{month}</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {monthArticles.map(article => (
                <li key={article.id} style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                      {formatDate(article.date)} &bull; {article.category?.toUpperCase() || 'NEWS'}
                    </span>
                    <Link href={`/article/${article.id}`} style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '600', textDecoration: 'none' }}>
                      {article.title}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
