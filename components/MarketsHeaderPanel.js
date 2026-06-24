'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarketsHeaderPanel({ latestNews = [] }) {
  const [markets, setMarkets] = useState([
    { name: 'S&P 500', price: 5464.62, change: 12.31, percent: 0.23, isUp: true },
    { name: 'NASDAQ', price: 17688.88, change: 22.14, percent: 0.12, isUp: true },
    { name: 'DOW 30', price: 39150.33, change: 15.57, percent: 0.04, isUp: true }
  ]);

  const [sentiment, setSentiment] = useState({ value: 55, classification: 'Greed' });

  useEffect(() => {
    // Simulasi Fluktuasi Live (Opsi B)
    const interval = setInterval(() => {
      setMarkets(prev => prev.map(m => {
        // Fluktuasi acak antara -0.05% hingga +0.05%
        const fluctuation = (Math.random() - 0.5) * 0.001; 
        const newPrice = m.price * (1 + fluctuation);
        const priceDiff = newPrice - m.price;
        const newChange = Math.abs(m.change + priceDiff);
        const newPercent = (newChange / newPrice) * 100;
        
        return {
          ...m,
          price: newPrice,
          change: newChange,
          percent: newPercent,
          isUp: priceDiff >= 0 ? true : (Math.random() > 0.5 ? m.isUp : false) // Jaga tren visual
        };
      }));

      // Fluktuasi sentimen secara perlahan
      setSentiment(prev => {
        const move = Math.random() > 0.5 ? 1 : -1;
        const newVal = Math.max(0, Math.min(100, prev.value + (Math.random() > 0.8 ? move : 0)));
        let classif = 'Neutral';
        if (newVal <= 25) classif = 'Extreme Fear';
        else if (newVal <= 45) classif = 'Fear';
        else if (newVal >= 75) classif = 'Extreme Greed';
        else if (newVal >= 55) classif = 'Greed';
        return { value: newVal, classification: classif };
      });

    }, 3000); // Update setiap 3 detik agar terlihat sangat live!

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="markets-header-panel">
      
      {/* 1. Markets Overview (Simulated Live) */}
      <div className="markets-header-col">
        <h3 className="markets-header-title">Markets <span style={{fontSize: '14px'}}>→</span></h3>
        <div style={{ padding: '15px 0' }}>
          {markets.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>{m.name}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div style={{ color: m.isUp ? '#008000' : '#cc0000', fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>
                  {m.isUp ? '▲' : '▼'} {m.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({m.percent.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Fear & Greed Sentiment */}
      <div className="markets-header-col markets-header-center">
        <h3 className="markets-header-title">Market Sentiment <span style={{fontSize: '14px'}}>→</span></h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <div style={{ 
            fontSize: '50px', 
            fontWeight: '900', 
            color: sentiment.value >= 55 ? '#008000' : (sentiment.value <= 45 ? '#cc0000' : '#e6b800'),
            lineHeight: '1',
            transition: 'color 0.5s ease'
          }}>
            {sentiment.value}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' }}>
            {sentiment.classification}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '15px', textAlign: 'center' }}>
            Crypto Fear & Greed Index<br/>(Live Simulation)
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
