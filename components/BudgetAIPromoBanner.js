'use client';

import Link from 'next/link';

export default function BudgetAIPromoBanner() {
  return (
    <div className="cnn-budget-promo-section">
      <div className="cnn-budget-promo-card">
        <div className="budget-promo-left">
          <div className="budget-promo-badge-row">
            <span className="budget-promo-badge">BETA FEATURE</span>
            <span className="budget-promo-tag">🔒 Private Workspace</span>
          </div>

          <h2 className="budget-promo-headline">
            Smart Household Budgeting & AI Financial Advisor
          </h2>

          <p className="budget-promo-text">
            Take full control of your household expenses, recurring subscriptions, and family bills. Get actionable recommendations, cost-cutting tips, and meal planning in <strong>USD ($)</strong>, <strong>SGD (S$)</strong>, and <strong>IDR (Rp)</strong> powered by Gemini AI.
          </p>

          <div className="budget-promo-feature-pills">
            <span className="feature-pill">📊 Wallos Card Grid</span>
            <span className="feature-pill">🤖 Gemini AI Advice</span>
            <span className="feature-pill">⚡ Auto-Sync Targets</span>
            <span className="feature-pill">🛡️ Health Score 0-100</span>
          </div>

          <div className="budget-promo-actions">
            <Link href="/budget" className="btn-launch-budget-ai">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Launch Budget AI Beta →
            </Link>
            <span className="budget-promo-free-hint">100% Free for NDNews Readers</span>
          </div>
        </div>

        <div className="budget-promo-right">
          <div className="budget-promo-mini-preview">
            <div className="preview-top-bar">
              <span className="p-dot r"></span>
              <span className="p-dot y"></span>
              <span className="p-dot g"></span>
              <span className="preview-label">Live Financial Health</span>
            </div>

            <div className="preview-kpi-row">
              <div className="preview-kpi">
                <span className="pk-label">Income</span>
                <span className="pk-val text-emerald">Rp 23.500.000</span>
              </div>
              <div className="preview-kpi">
                <span className="pk-label">Expenses</span>
                <span className="pk-val text-amber">Rp 12.400.000</span>
              </div>
              <div className="preview-kpi">
                <span className="pk-label">Health</span>
                <span className="pk-val text-indigo">92/100</span>
              </div>
            </div>

            <div className="preview-ai-bubble">
              <span className="sparkle-ai">✨</span>
              <p><strong>Gemini AI:</strong> Your savings rate is 47%! You have Rp 11.100.000 available for emergency funds or investments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
