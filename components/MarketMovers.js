'use client';

import { useState, useEffect } from 'react';

export default function MarketMovers() {
  const [movers, setMovers] = useState([
    { symbol: 'BTC/USD', name: 'Bitcoin', price: 64230.50, percent: 1.25, isUp: true },
    { symbol: 'ETH/USD', name: 'Ethereum', price: 3490.10, percent: 0.85, isUp: true },
    { symbol: 'SOL/USD', name: 'Solana', price: 135.20, percent: 2.10, isUp: true },
    { symbol: 'BNB/USD', name: 'BNB', price: 585.60, percent: 0.50, isUp: false },
    { symbol: 'XRP/USD', name: 'XRP', price: 0.4850, percent: 0.20, isUp: true }
  ]);

  useEffect(() => {
    // Simulasi Fluktuasi Live (Opsi B)
    const interval = setInterval(() => {
      setMovers(prev => prev.map(m => {
        // Fluktuasi acak yang sangat halus
        const fluctuation = (Math.random() - 0.5) * 0.002; 
        const newPrice = m.price * (1 + fluctuation);
        
        // Sedikit ubah persentase
        const percentShift = (Math.random() - 0.5) * 0.1;
        let newPercent = m.percent + percentShift;
        if (newPercent < 0) newPercent = Math.abs(newPercent);

        return {
          ...m,
          price: newPrice,
          percent: newPercent,
          isUp: fluctuation >= 0 ? true : (Math.random() > 0.5 ? m.isUp : false)
        };
      }));
    }, 2500); // Kedip setiap 2.5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-movers-widget">
      <h3 className="markets-latest-header" style={{ marginBottom: '20px' }}>Market Movers (Crypto) <span>→</span></h3>
      <div style={{ height: 'auto', width: '100%', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#fff' }}>
        {movers.map((mover, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '12px 15px', 
            borderBottom: i !== movers.length - 1 ? '1px solid #eee' : 'none',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{mover.symbol}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{mover.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', transition: 'color 0.3s ease' }}>
                ${mover.price >= 1 ? mover.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : mover.price.toFixed(4)}
              </div>
              <div style={{ 
                color: '#fff', 
                backgroundColor: mover.isUp ? '#008000' : '#cc0000', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                padding: '2px 6px',
                borderRadius: '3px',
                marginTop: '4px',
                display: 'inline-block',
                transition: 'background-color 0.3s ease'
              }}>
                {mover.isUp ? '+' : '-'}{mover.percent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
