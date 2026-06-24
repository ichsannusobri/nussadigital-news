import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import TimeAgo from '../../components/TimeAgo';
import TradingViewTicker from '../../components/TradingViewTicker';

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function truncateText(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

export const metadata = {
  title: 'Markets & Finance - NDNews',
  description: 'Live global market data, personal finance insights, and investment strategies across the Asia-Pacific region.',
};

export default async function MarketsPage() {
  const q = query(collection(db, "articles"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  
  let allArticles = [];
  querySnapshot.forEach((doc) => {
    allArticles.push({ id: doc.id, ...doc.data() });
  });

  // Filter only Finance and Economy articles for this page
  const financeArticles = allArticles.filter(a => 
    a.category?.toLowerCase() === 'finance' || a.category?.toLowerCase() === 'economy'
  );

  return (
    <div className="markets-page">
      
      {/* 1. Live Ticker Section */}
      <TradingViewTicker />
      
      <div className="markets-container">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: 'var(--clr-text)' }}>
          Markets & Finance
        </h1>

        {/* Hero Section (70-30 Split) */}
        {financeArticles.length > 0 ? (
          <div className="markets-hero-grid">
            
            {/* Left: Main Featured Article */}
            <div className="markets-hero-main">
              <Link href={`/article/${financeArticles[0].id}`}>
                <img src={financeArticles[0].image} alt={financeArticles[0].title} className="markets-main-img" />
                <h2 className="markets-main-title">{financeArticles[0].title}</h2>
                <p className="markets-main-excerpt">{truncateText(financeArticles[0].excerpt, 150)}</p>
                <div className="markets-list-meta" style={{ marginTop: '10px' }}>
                  {financeArticles[0].author} • <TimeAgo date={financeArticles[0].date} />
                </div>
              </Link>
            </div>

            {/* Right: Latest Market News List */}
            <div className="markets-hero-right">
              <h3 className="markets-latest-header">Latest Market News</h3>
              <div className="markets-latest-list">
                {financeArticles.slice(1, 6).map((article) => (
                  <Link href={`/article/${article.id}`} className="markets-list-item" key={article.id}>
                    <div>
                      <h4>{article.title}</h4>
                      <div className="markets-list-meta"><TimeAgo date={article.date} /></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ padding: '40px 0', color: 'var(--clr-text-muted)' }}>
            No finance or economy articles found yet.
          </div>
        )}

        {/* Secondary Section: "What to watch" */}
        {financeArticles.length > 6 && (
          <div style={{ marginTop: '40px' }}>
            <h3 className="markets-latest-header">What to watch</h3>
            <div className="markets-secondary-grid">
              {financeArticles.slice(6, 10).map((article) => (
                <Link href={`/article/${article.id}`} className="markets-card-small" key={article.id}>
                  <img src={article.image} alt={article.title} className="markets-card-img" />
                  <h4>{article.title}</h4>
                  <div className="markets-list-meta"><TimeAgo date={article.date} /></div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
