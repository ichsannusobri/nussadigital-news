'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function MarketsHeaderPanel({ latestNews = [] }) {
  const overviewRef = useRef();
  const gaugeRef = useRef();

  useEffect(() => {
    // 1. Mini Overview Widget
    if (overviewRef.current) {
      overviewRef.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbol": "FOREXCOM:SPXUSD",
          "width": "100%",
          "height": "100%",
          "locale": "en",
          "dateRange": "12M",
          "colorTheme": "light",
          "isTransparent": true,
          "autosize": true,
          "largeChartUrl": ""
        }`;
      overviewRef.current.appendChild(script);
    }

    // 2. Technical Analysis Gauge Widget
    if (gaugeRef.current) {
      gaugeRef.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      const script2 = document.createElement("script");
      script2.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
      script2.type = "text/javascript";
      script2.async = true;
      script2.innerHTML = `
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
        }`;
      gaugeRef.current.appendChild(script2);
    }
  }, []);

  return (
    <div className="markets-header-panel">
      
      {/* 1. Markets Overview */}
      <div className="markets-header-col">
        <h3 className="markets-header-title">Markets <span style={{fontSize: '14px'}}>→</span></h3>
        <div className="tradingview-widget-container" ref={overviewRef} style={{ height: '220px', width: '100%' }}></div>
      </div>

      {/* 2. Fear & Greed (Gauge) */}
      <div className="markets-header-col markets-header-center">
        <h3 className="markets-header-title">Market Sentiment <span style={{fontSize: '14px'}}>→</span></h3>
        <div className="tradingview-widget-container" ref={gaugeRef} style={{ height: '220px', width: '100%' }}></div>
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
