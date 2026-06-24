'use client';

import { useEffect, useRef, memo } from 'react';

function MarketMovers() {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = ''; // Bersihkan kontainer
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
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
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="market-movers-widget">
      <h3 className="markets-latest-header" style={{ marginBottom: '20px' }}>Market Movers <span>→</span></h3>
      <div className="tradingview-widget-container" style={{ height: '400px', width: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} ref={container}></div>
      </div>
    </div>
  );
}

export default memo(MarketMovers);
