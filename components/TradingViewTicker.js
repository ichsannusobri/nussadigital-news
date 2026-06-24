'use client';

import { useEffect, useRef } from 'react';

export default function TradingViewTicker() {
  const container = useRef();

  useEffect(() => {
    // Prevent appending multiple scripts in dev mode (strict mode)
    if (container.current && container.current.children.length === 1) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500 Index" },
            { "proName": "FOREXCOM:NSXUSD", "title": "US 100 Cash Indices" },
            { "proName": "FX_IDC:EURUSD", "title": "EUR to USD" },
            { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
            { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
            { "description": "Gold", "proName": "OANDA:XAUUSD" },
            { "description": "Apple", "proName": "NASDAQ:AAPL" },
            { "description": "Tesla", "proName": "NASDAQ:TSLA" },
            { "description": "Nvidia", "proName": "NASDAQ:NVDA" },
            { "description": "IHSG", "proName": "IDX:COMPOSITE" }
          ],
          "showSymbolLogo": true,
          "isTransparent": true,
          "displayMode": "adaptive",
          "colorTheme": "dark",
          "locale": "en"
        }`;
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: '100%', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
