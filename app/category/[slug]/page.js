import Link from 'next/link';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { DEFAULT_ARTICLES } from '../../../lib/data';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

export async function generateStaticParams() {
  const q = query(collection(db, "articles"));
  const querySnapshot = await getDocs(q);
  let categories = new Set();
  
  if (querySnapshot.empty) {
    DEFAULT_ARTICLES.forEach(doc => {
      if (doc.category) categories.add(doc.category.toLowerCase());
    });
  } else {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category.toLowerCase());
      }
    });
  }

  return Array.from(categories).map((cat) => ({
    slug: cat,
  }));
}

// Unique Metadata per Category
export function generateMetadata({ params }) {
  const catName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  const canonicalUrl = `https://nussadigital.co.id/category/${params.slug}`;
  return {
    title: `${catName} News - Latest Updates & Analysis - NDNews`,
    description: `Browse the latest breaking news, in-depth analysis, and expert insights on ${catName} across the Asia-Pacific region.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      siteName: 'NDNews',
      title: `${catName} News - NDNews`,
      description: `Read the latest ${catName} news from the Asia-Pacific.`,
      url: canonicalUrl
    }
  };
}

export default async function CategoryPage({ params }) {
  const q = query(collection(db, "articles"));
  const querySnapshot = await getDocs(q);
  
  let articles = [];
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
  });

  if (articles.length === 0) {
    articles = DEFAULT_ARTICLES;
  }

  articles = articles
    .filter(a => a.category && a.category.toLowerCase() === params.slug.toLowerCase())
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const catName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <main>
      <div className="category-header-banner" style={{backgroundColor: '#003366', color: '#fff', padding: '60px 20px', textAlign: 'center'}}>
        <h1 style={{fontSize: '40px', margin: '0 0 10px 0'}}>{catName} News</h1>
        <p style={{fontSize: '18px', margin: '0', opacity: 0.9}}>Latest breaking news and analysis from the Asia-Pacific</p>
      </div>

      <section className="category-results container" style={{padding: '40px 20px', maxWidth: '1400px', margin: '0 auto'}}>
        {articles.length === 0 ? (
          <div style={{textAlign: 'center', padding: '60px'}}>
            <h3>No articles found in this category yet.</h3>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem'}}>
            {articles.map(a => (
              <Link href={`/article/${a.id}`} key={`cat-${a.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <div style={{position: 'relative', height: '200px', marginBottom: '1rem'}}>
                  <img src={a.image} alt={a.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} loading="lazy" decoding="async" width={800} height={500} />
                  <span style={{position: 'absolute', top: '10px', left: '10px', background: '#D97706', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 'bold'}}>{a.category.toUpperCase()}</span>
                </div>
                <div>
                  <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.2rem', lineHeight: '1.4'}}>{a.title}</h3>
                  <p style={{margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem', lineHeight: '1.5'}}>{a.excerpt}</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.8rem'}}>
                    <span>{a.author}</span>
                    <span>{formatDate(a.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
