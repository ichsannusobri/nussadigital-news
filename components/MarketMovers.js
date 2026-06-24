const moversHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; overflow: hidden; background: transparent; }</style>
</head>
<body>
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js" async>
    {
      "colorTheme": "light",
      "dateRange": "12M",
      "exchange": "US",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": false,
      "showPrice": false,
      "width": "100%",
      "height": "100%"
    }
    </script>
  </div>
</body>
</html>
`;

export default function MarketMovers() {
  return (
    <div className="market-movers-widget">
      <h3 className="markets-latest-header" style={{ marginBottom: '20px' }}>Market Movers <span>→</span></h3>
      <div style={{ height: '400px', width: '100%' }}>
        <iframe 
          srcDoc={moversHtml} 
          width="100%" 
          height="100%" 
          style={{ border: 'none' }}
          title="Market Movers"
        />
      </div>
    </div>
  );
}
