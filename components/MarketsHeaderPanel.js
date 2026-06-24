import Link from 'next/link';

const overviewHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; overflow: hidden; background: transparent; }</style>
</head>
<body>
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>
    {
      "colorTheme": "light",
      "dateRange": "12M",
      "showChart": false,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "width": "100%",
      "height": "100%",
      "tabs": [
        {
          "title": "Markets",
          "symbols": [
            { "s": "FOREXCOM:SPXUSD", "d": "S&P 500" },
            { "s": "FOREXCOM:NSXUSD", "d": "NASDAQ" },
            { "s": "FOREXCOM:DJI", "d": "DOW 30" }
          ]
        }
      ]
    }
    </script>
  </div>
</body>
</html>
`;

const sentimentHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; overflow: hidden; background: transparent; }</style>
</head>
<body>
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js" async>
    {
      "interval": "1m",
      "width": "100%",
      "isTransparent": true,
      "height": "100%",
      "symbol": "NASDAQ:AAPL",
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "light"
    }
    </script>
  </div>
</body>
</html>
`;

export default function MarketsHeaderPanel({ latestNews = [] }) {
  return (
    <div className="markets-header-panel">
      
      {/* 1. Markets Overview */}
      <div className="markets-header-col">
        <h3 className="markets-header-title">Markets <span style={{fontSize: '14px'}}>→</span></h3>
        <div style={{ height: '220px', width: '100%' }}>
          <iframe 
            srcDoc={overviewHtml} 
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
            srcDoc={sentimentHtml} 
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
