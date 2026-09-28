'use client';

import { useEffect, useRef, useState } from 'react';

// Official TradingView embed (real market data, free with attribution).
// Loads only when scrolled near the viewport to protect page speed.
export default function TradingViewWidget({ widget, config, height = 500, title }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setVisible(true); io.disconnect(); }
    }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !ref.current) return;
    const host = ref.current.querySelector('.tradingview-widget-container__widget');
    if (!host || host.childNodes.length) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const s = document.createElement('script');
    s.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widget}.js`;
    s.async = true;
    s.innerHTML = JSON.stringify({ colorTheme: isDark ? 'dark' : 'light', locale: 'en', isTransparent: false, width: '100%', height, ...config });
    ref.current.appendChild(s);
  }, [visible, widget, config, height]);

  return (
    <div className="tradingview-widget-container" ref={ref} style={{ minHeight: height }} aria-label={title}>
      <div className="tradingview-widget-container__widget" />
      <div className="tradingview-widget-copyright" style={{ fontSize: 11, color: 'var(--clr-text-secondary, #6B7280)', marginTop: 4 }}>
        Market data by{' '}
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">TradingView</a>
      </div>
    </div>
  );
}
