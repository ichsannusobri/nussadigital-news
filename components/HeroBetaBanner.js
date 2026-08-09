'use client';

import Link from 'next/link';

export default function HeroBetaBanner() {
  return (
    <div className="beta-hero-banner">
      <div className="banner-glass-container">
        <div className="banner-left">
          <div className="banner-tag">
            <span className="pulse-dot"></span>
            <span className="tag-text">NEW BETA FEATURE</span>
          </div>

          <h2 className="banner-headline">
            NDNews Smart Household Budget & AI Financial Advisor
          </h2>

          <p className="banner-description">
            Take full control of your household expenses, bills, and recurring subscriptions. Get automated AI recommendations, cost-cutting tips, and multi-currency tracking (<strong>USD $</strong>, <strong>SGD S$</strong>, <strong>IDR Rp</strong>) inspired by Wallos.
          </p>

          <div className="banner-actions">
            <Link href="/budget" className="btn-banner-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Try Budget AI Beta Now
            </Link>
            <span className="banner-auth-hint">🔒 Private & Secured via Google Account</span>
          </div>
        </div>

        <div className="banner-right">
          <div className="banner-mockup-card">
            <div className="mockup-header">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
              <span className="mockup-title">Wallos-Style Financial Health</span>
            </div>

            <div className="mockup-stats-row">
              <div className="mockup-stat-pill">
                <span className="stat-label">Income</span>
                <span className="stat-value text-emerald">Rp 18.000.000</span>
              </div>
              <div className="mockup-stat-pill">
                <span className="stat-label">Expenses</span>
                <span className="stat-value text-amber">Rp 11.930.000</span>
              </div>
            </div>

            <div className="mockup-ai-tip">
              <span className="sparkle-icon">✨</span>
              <p><strong>AI Suggestion:</strong> Savings rate is 33%. Trimming non-essential subscriptions will save S$ 350 annually!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
