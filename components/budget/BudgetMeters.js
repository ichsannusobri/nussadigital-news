'use client';

import { formatCurrency, convertCurrency } from '../../lib/budget/currencies';

export default function BudgetMeters({ expenses, categoryBudgets, currency, onUpdateBudgetLimit }) {
  // Compute actual spent per category
  const spentPerCategory = {};

  expenses.forEach(e => {
    const cat = e.category || "Uncategorized";
    const amt = convertCurrency(e.amount, e.currency || "IDR", currency);
    spentPerCategory[cat] = (spentPerCategory[cat] || 0) + amt;
  });

  const categories = Object.keys(categoryBudgets || {});

  return (
    <div className="budget-meters-card">
      <div className="meters-header">
        <span className="section-icon">📊</span>
        <h3>Category Spending Meters & Limits</h3>
        <span className="meters-subtitle">Monitors monthly category thresholds ({currency})</span>
      </div>

      <div className="meters-grid">
        {categories.map((cat) => {
          const limit = convertCurrency(categoryBudgets[cat] || 0, "IDR", currency);
          const spent = spentPerCategory[cat] || 0;
          const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          
          let statusClass = "green";
          if (pct >= 90) statusClass = "red";
          else if (pct >= 70) statusClass = "yellow";

          return (
            <div key={cat} className={`meter-item meter-status-${statusClass}`}>
              <div className="meter-info-top">
                <span className="meter-cat-title">{cat}</span>
                <span className="meter-pct">{pct}% Used</span>
              </div>

              <div className="meter-bar-track">
                <div className={`meter-bar-fill fill-${statusClass}`} style={{ width: `${pct}%` }}></div>
              </div>

              <div className="meter-info-bottom">
                <span className="spent-val">Spent: {formatCurrency(spent, currency)}</span>
                <span className="limit-val">Limit: {formatCurrency(limit, currency)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
