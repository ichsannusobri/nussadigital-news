import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { DEFAULT_ARTICLES, getOptimizedImageUrl } from '../../../lib/data';
import Pagination from '../../../components/Pagination';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncateText(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

const ITEMS_PER_PAGE = 12; // Consistent with ClientNewsFeed previous load

export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, "articles"));
  let totalArticles = querySnapshot.empty ? DEFAULT_ARTICLES.length : querySnapshot.size;
  
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);
  
  // Start from page 2, because page 1 is the main homepage
  let pages = [];
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ page: i.toString() });
  }
  
  return pages;
}

export async function generateMetadata({ params }) {
  const currentPage = parseInt(params.page);
  const querySnapshot = await getDocs(collection(db, "articles"));
  let totalArticles = querySnapshot.empty ? DEFAULT_ARTICLES.length : querySnapshot.size;
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);
  const isEmpty = currentPage > totalPages;

  return {
    title: `Latest News - Page ${params.page} | NDNews`,
    description: `Browse the latest breaking news, economy, finance, and sports articles on NDNews - Page ${params.page}.`,
    alternates: {
      canonical: `https://nussadigital.co.id/page/${params.page}`,
    },
    robots: {
      index: !isEmpty,
      follow: true,
    }
  };
}

export default async function PaginatedHomePage({ params }) {
  const currentPage = parseInt(params.page);
  
  const q = query(collection(db, "articles"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  
  let allArticles = [];
  querySnapshot.forEach((doc) => {
    allArticles.push({ id: doc.id, ...doc.data() });
  });

  if (allArticles.length === 0) {
    allArticles = DEFAULT_ARTICLES;
  }
  
  const totalPages = Math.ceil(allArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageArticles = allArticles.slice(startIndex, endIndex);

  return (
    <main className="container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '30px' }}>
        Latest News - Page {currentPage}
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {pageArticles.map((article) => (
          <article key={article.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/article/${article.id}`} style={{ display: 'block', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '8px', marginBottom: '15px' }}>
              <img 
                src={getOptimizedImageUrl(article.image, 400)} 
                alt={article.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                loading="lazy"
                decoding="async"
                width={400}
                height={250}
              />
            </Link>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--brand-primary, #e63946)', textTransform: 'uppercase', marginBottom: '8px' }}>
                {article.category || 'NEWS'}
              </span>
              <h2 style={{ fontSize: '1.2rem', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                <Link href={`/article/${article.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {article.title}
                </Link>
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 15px 0', flex: 1 }}>
                {truncateText(article.excerpt, 100)}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {formatDate(article.date)}
              </div>
            </div>
          </article>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/page" />
    </main>
  );
}
