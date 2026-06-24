'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarketsHeaderPanel({ latestNews = [] }) {
  const [markets, setMarkets] = useState([
    { name: 'S&P 500', price: '...', change: '...', percent: '...', isUp: true },
    { name: 'NASDAQ', price: '...', change: '...', percent: '...', isUp: true },
    { name: 'DOW 30', price: '...', change: '...', percent: '...', isUp: true }
  ]);

  const [sentiment, setSentiment] = useState({ value: 50, classification: 'Neutral' });

  useEffect(() => {
    // Fetch Indices from Yahoo Finance via AllOrigins Proxy
    const fetchIndices = async () => {
      try {
        const symbols = ['^GSPC', '^IXIC', '^DJI'];
        const results = await Promise.all(symbols.map(async (symbol) => {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
          const res = await fetch(proxyUrl);
          const data = await res.json();
          const parsed = JSON.parse(data.contents);
          const meta = parsed.chart.result[0].meta;
          const current = meta.regularMarketPrice;
          const prev = meta.chartPreviousClose;
          const change = current - prev;
          const percent = (change / prev) * 100;
          
          let name = symbol;
          if (symbol === '^GSPC') name = 'S&P 500';
          if (symbol === '^IXIC') name = 'NASDAQ';
          if (symbol === '^DJI') name = 'DOW 30';

          return {
            name,
            price: current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            percent: Math.abs(percent).toFixed(2),
            isUp: change >= 0
          };
        }));
        setMarkets(results);
      } catch (err) {
        console.error("Failed to fetch indices", err);
      }
    };

    // Fetch Fear & Greed Index from Alternative.me
    const fetchSentiment = async () => {
      try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1');
        const data = await res.json();
        if (data && data.data && data.data.length > 0) {
          setSentiment({
            value: parseInt(data.data[0].value),
            classification: data.data[0].value_classification
          });
        }
      } catch (err) {
        console.error("Failed to fetch sentiment", err);
      }
    };

    fetchIndices();
    fetchSentiment();
    // Update every 60 seconds
    const interval = setInterval(() => {
      fetchIndices();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="markets-header-panel">
      
      {/* 1. Markets Overview (Live Data) */}
      <div className="markets-header-col">
        <h3 className="markets-header-title">Markets <span style={{fontSize: '14px'}}>→</span></h3>
        <div style={{ padding: '15px 0' }}>
          {markets.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>{m.name}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{m.price}</div>
                <div style={{ color: m.isUp ? '#008000' : '#cc0000', fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>
                  {m.isUp ? '▲' : '▼'} {m.change} ({m.percent}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Fear & Greed Sentiment (Live Data) */}
      <div className="markets-header-col markets-header-center">
        <h3 className="markets-header-title">Market Sentiment <span style={{fontSize: '14px'}}>→</span></h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <div style={{ 
            fontSize: '50px', 
            fontWeight: '900', 
            color: sentiment.value >= 50 ? '#008000' : '#cc0000',
            lineHeight: '1'
          }}>
            {sentiment.value}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>
            {sentiment.classification}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '15px', textAlign: 'center' }}>
            Crypto Fear & Greed Index<br/>(Live Updates)
          </div>
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
