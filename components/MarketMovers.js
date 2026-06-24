'use client';

import { useState, useEffect } from 'react';

export default function MarketMovers() {
  const [movers, setMovers] = useState([
    { symbol: 'BTC/USD', name: 'Bitcoin', price: '...', percent: '...', isUp: true },
    { symbol: 'ETH/USD', name: 'Ethereum', price: '...', percent: '...', isUp: true },
    { symbol: 'SOL/USD', name: 'Solana', price: '...', percent: '...', isUp: true },
    { symbol: 'BNB/USD', name: 'BNB', price: '...', percent: '...', isUp: true },
    { symbol: 'XRP/USD', name: 'XRP', price: '...', percent: '...', isUp: true }
  ]);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true';
        const res = await fetch(url);
        const data = await res.json();
        
        const mapData = [
          { id: 'bitcoin', symbol: 'BTC/USD', name: 'Bitcoin' },
          { id: 'ethereum', symbol: 'ETH/USD', name: 'Ethereum' },
          { id: 'solana', symbol: 'SOL/USD', name: 'Solana' },
          { id: 'binancecoin', symbol: 'BNB/USD', name: 'BNB' },
          { id: 'ripple', symbol: 'XRP/USD', name: 'XRP' }
        ];

        const formatData = mapData.map(coin => {
          const coinData = data[coin.id];
          if (!coinData) return { ...coin, price: '...', percent: '...', isUp: true };
          
          const currentPrice = coinData.usd;
          const percentChange = coinData.usd_24h_change;

          return {
            symbol: coin.symbol,
            name: coin.name,
            price: currentPrice >= 1 ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : currentPrice.toFixed(4),
            percent: Math.abs(percentChange).toFixed(2),
            isUp: percentChange >= 0
          };
        });

        // Sort by biggest % movers
        formatData.sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent));
        setMovers(formatData);
      } catch (err) {
        console.error("Failed to fetch crypto movers", err);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 30000); // Live update every 30s
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
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>${mover.price}</div>
              <div style={{ 
                color: '#fff', 
                backgroundColor: mover.isUp ? '#008000' : '#cc0000', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                padding: '2px 6px',
                borderRadius: '3px',
                marginTop: '4px',
                display: 'inline-block'
              }}>
                {mover.isUp ? '+' : '-'}{mover.percent}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
