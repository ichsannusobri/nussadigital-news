'use client';

import { useEffect, useRef } from 'react';

export default function MarketMovers() {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
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
          "height": "400"
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="market-movers-widget">
      <h3 className="markets-latest-header" style={{ marginBottom: '20px' }}>Market Movers <span>→</span></h3>
      <div className="tradingview-widget-container" ref={container}></div>
    </div>
  );
}
