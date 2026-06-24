import Link from 'next/link';

export default function MarketsHeaderPanel({ latestNews = [] }) {
  return (
    <div className="markets-header-panel">
      
      {/* 1. Markets Overview */}
      <div className="markets-header-col">
        <h3 className="markets-header-title">Markets <span style={{fontSize: '14px'}}>→</span></h3>
        <div style={{ height: '220px', width: '100%' }}>
          <iframe 
            src="/widgets/tv-overview.html" 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            title="Markets Overview"
          />
        </div>
      </div>

      {/* 2. Fear & Greed (Gauge) */}
      <div className="markets-header-col markets-header-center">
        <h3 className="markets-header-title">Market Sentiment <span style={{fontSize: '14px'}}>→</span></h3>
        <div style={{ height: '220px', width: '100%' }}>
          <iframe 
            src="/widgets/tv-sentiment.html" 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            title="Market Sentiment"
          />
        </div>
      </div>

      {/* 3. Latest Market News */}
      <div className="markets-header-col">
        <h3 className="markets-header-title">Latest Market News <span style={{fontSize: '14px'}}>→</span></h3>
        <div className="markets-header-news">
          {latestNews.slice(0, 3).map((article) => (
            <Link href={`/article/${article.id}`} key={article.id} className="markets-header-news-item">
              {article.title}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
