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
    <div className="markets-page" style={{ paddingTop: '20px' }}>
      
      {/* 1. Live Ticker Section */}
      <TradingViewTicker />
      
      <div className="alj-container">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--text-color)' }}>
          Markets & Finance
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>
          Global market updates, investment strategies, and APAC economic insights.
        </p>

        {/* 2. Content Grid */}
        <div className="alj-home-grid">
          
          {/* Main Column */}
          <div className="alj-main-col">
            <div className="alj-latest-grid">
              {financeArticles.length > 0 ? financeArticles.map((article) => (
                <Link href={`/article/${article.id}`} className="alj-card" key={article.id}>
                  <div className="alj-card-img-wrapper" style={{ height: '200px' }}>
                    <img src={article.image} alt={article.title} className="alj-card-img" />
                    <span className="alj-card-category">{article.category}</span>
                  </div>
                  <div className="alj-card-content">
                    <h3 className="alj-card-title">{article.title}</h3>
                    <p className="alj-card-excerpt">{truncateText(article.excerpt, 120)}</p>
                    <div className="alj-card-meta">
                      <div className="alj-card-author">
                        <div className="alj-card-avatar">{getInitials(article.author)}</div>
                        <span>{article.author}</span>
                      </div>
                      <TimeAgo date={article.date} />
                    </div>
                  </div>
                </Link>
              )) : (
                <div style={{ padding: '40px 0', color: 'var(--text-muted)' }}>
                  No finance or economy articles found yet.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="alj-sidebar-col">
            <div className="alj-sidebar-section">
              <h4 className="alj-sidebar-header">HOT TOPICS</h4>
              <Link href="/category/investment" className="alj-sidebar-item">
                <span className="alj-sidebar-number">1</span>
                <div className="alj-sidebar-text">
                  <h5>Investment Strategies 2026</h5>
                  <span className="alj-sidebar-meta">High Yield Returns</span>
                </div>
              </Link>
              <Link href="/category/loans" className="alj-sidebar-item">
                <span className="alj-sidebar-number">2</span>
                <div className="alj-sidebar-text">
                  <h5>SME Business Loans</h5>
                  <span className="alj-sidebar-meta">APAC Credit Market</span>
                </div>
              </Link>
              <Link href="/category/crypto" className="alj-sidebar-item">
                <span className="alj-sidebar-number">3</span>
                <div className="alj-sidebar-text">
                  <h5>Crypto & Blockchain</h5>
                  <span className="alj-sidebar-meta">Digital Assets</span>
                </div>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
