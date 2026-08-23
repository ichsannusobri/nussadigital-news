'use client';

import Link from 'next/link';

export default function HeroBetaBanner() {
  return (
    <div className="cnn-sidebar-promo-card">
      <div className="sidebar-promo-header">
        <span className="sidebar-promo-badge">NEW FEATURE</span>
        <span className="sidebar-promo-tag">🤖 AI Powered</span>
      </div>

      <h3 className="sidebar-promo-title">
        Budget AI & Household Financial Advisor
      </h3>

      <p className="sidebar-promo-desc">
        Control your family subscriptions, bills, and get AI financial advice with multi-currency tracking (USD, SGD, IDR).
      </p>

      <div className="sidebar-promo-cta">
        <Link href="/budget" className="btn-sidebar-promo">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Launch Budget AI Beta →
        </Link>
      </div>
    </div>
  );
}
