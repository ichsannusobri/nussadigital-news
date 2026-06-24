export default function MarketMovers() {
  return (
    <div className="market-movers-widget">
      <h3 className="markets-latest-header" style={{ marginBottom: '20px' }}>Market Movers <span>→</span></h3>
      <div style={{ height: '400px', width: '100%' }}>
        <iframe 
          src="/widgets/tv-movers.html" 
          width="100%" 
          height="100%" 
          style={{ border: 'none' }}
          title="Market Movers"
        />
      </div>
    </div>
  );
}
