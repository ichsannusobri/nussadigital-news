import Link from 'next/link';
import { getAllArticles } from '../../lib/articles';
import TimeAgo from '../../components/TimeAgo';
import { getOptimizedImageUrl } from '../../lib/data';
import { MarketsOverviewPanel, EconomicCalendarPanel } from '../../components/MarketsDataPanels';

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
  title: 'Markets & Finance',
  description: 'Live global market data, personal finance insights, and investment strategies across the Asia-Pacific region.',
  alternates: {
    canonical: 'https://nussadigital.co.id/markets',
  },
  openGraph: {
    title: 'Markets & Finance - NDNews',
    description: 'Live global market data, personal finance insights, and investment strategies across the Asia-Pacific region.',
    url: 'https://nussadigital.co.id/markets',
  }
};

export default async function MarketsPage() {
  let allArticles = await getAllArticles();

  // Filter only Finance and Economy articles for this page
  const financeArticles = allArticles.filter(a => 
    a.category?.toLowerCase() === 'finance' || a.category?.toLowerCase() === 'economy'
  );

  return (
    <div className="markets-page">
      
      <div className="markets-container" style={{ paddingTop: '24px' }}>
        <header style={{ marginBottom: '16px' }}>
          <p className="markets-kicker" style={{ color: '#D97706', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.5px', margin: 0 }}>MARKETS</p>
          <h1 className="markets-latest-header" style={{ margin: '4px 0 6px' }}>Asia-Pacific markets at a glance</h1>
          <p style={{ margin: 0, color: 'var(--clr-text-secondary, #6B7280)', fontSize: '0.9rem' }}>
            Indices, currencies and commodities that matter for the region, plus the week's key economic releases. Market data is provided by TradingView and may be delayed.
          </p>
        </header>
        <MarketsOverviewPanel />
      </div>

      <div className="markets-container">

        {/* Hero Section (70-30 Split) */}
        {financeArticles.length > 0 ? (
          <div className="markets-hero-grid">
            
            {/* Left: Main Featured Article */}
            <div className="markets-hero-main">
              <Link href={`/article/${financeArticles[0].id}`}>
                <img src={getOptimizedImageUrl(financeArticles[0].image, 600)} alt={financeArticles[0].title} className="markets-main-img" loading="eager" fetchPriority="high" width={600} height={375} />
                <h2 className="markets-main-title">{financeArticles[0].title}</h2>
                <p className="markets-main-excerpt">{truncateText(financeArticles[0].excerpt, 150)}</p>
                <div className="markets-list-meta" style={{ marginTop: '10px' }}>
                  {financeArticles[0].author} • <TimeAgo date={financeArticles[0].date} />
                </div>
              </Link>
            </div>

            {/* Right: economic calendar (real data) */}
            <div className="markets-hero-right">
              <h3 className="markets-latest-header" style={{ marginBottom: '12px' }}>Economic calendar</h3>
              <EconomicCalendarPanel />
            </div>

          </div>
        ) : (
          <div style={{ padding: '40px 0', color: 'var(--clr-text-muted)' }}>
            No finance or economy articles found yet.
          </div>
        )}

        {/* Secondary Section: "What to watch" */}
        {financeArticles.length > 1 && (
          <div style={{ marginTop: '40px' }}>
            <h3 className="markets-latest-header">Latest markets &amp; economy analysis</h3>
            <div className="markets-secondary-grid">
              {financeArticles.slice(1, 9).map((article) => (
                <Link href={`/article/${article.id}`} className="markets-card-small" key={article.id}>
                  <img src={getOptimizedImageUrl(article.image, 300)} alt={article.title} className="markets-card-img" loading="lazy" decoding="async" width={300} height={188} />
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
