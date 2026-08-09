'use client';

import { useState } from 'react';
import { formatCurrency, convertCurrency, SUPPORTED_CURRENCIES } from '../../lib/budget/currencies';

const AVAILABLE_CATEGORIES = [
  "Housing",
  "Groceries",
  "Utilities",
  "Subscriptions",
  "Transport",
  "Insurance",
  "Healthcare",
  "Education",
  "Entertainment",
  "Savings"
];

export default function BudgetMeters({ expenses, categoryBudgets, currency, onUpdateBudgetLimit }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState("Groceries");
  const [limitInput, setLimitInput] = useState("");

  // Compute actual spent per category in active display currency
  const spentPerCategory = {};
  let grandTotalSpent = 0;

  expenses.forEach(e => {
    const cat = e.category || "Uncategorized";
    const amt = convertCurrency(e.amount, e.currency || "IDR", currency);
    spentPerCategory[cat] = (spentPerCategory[cat] || 0) + amt;
    grandTotalSpent += amt;
  });

  const categories = Object.keys(categoryBudgets || {});

  // Calculate Grand Total Budget Target in active currency
  let grandTotalBudget = 0;
  categories.forEach(cat => {
    grandTotalBudget += convertCurrency(categoryBudgets[cat] || 0, "IDR", currency);
  });

  const remainingBudget = grandTotalBudget - grandTotalSpent;
  const overallPct = grandTotalBudget > 0 ? Math.min(100, Math.round((grandTotalSpent / grandTotalBudget) * 100)) : 0;

  const handleOpenModal = (catToEdit = null) => {
    const initialCat = catToEdit || (categories.length > 0 ? categories[0] : "Groceries");
    setEditingCategory(initialCat);
    const existingLimitIDR = categoryBudgets[initialCat] || 0;
    const existingLimitCurrent = convertCurrency(existingLimitIDR, "IDR", currency);
    setLimitInput(existingLimitCurrent ? String(existingLimitCurrent) : "");
    setShowModal(true);
  };

  const handleSaveBudgetLimit = (e) => {
    e.preventDefault();
    const num = Number(limitInput);
    if (isNaN(num) || num < 0) {
      alert("Please enter a valid positive number for the budget limit.");
      return;
    }

    // Convert from current display currency back to IDR baseline for persistent storage
    const limitInIDR = convertCurrency(num, currency, "IDR");
    onUpdateBudgetLimit(editingCategory, limitInIDR);
    setShowModal(false);
  };

  return (
    <div className="budget-meters-card">
      {/* HEADER BAR */}
      <div className="meters-header">
        <div className="meters-title-group">
          <span className="section-icon">📊</span>
          <h3>Category Spending Meters & Budget Limits</h3>
          <span className="meters-subtitle">({currency})</span>
        </div>

        <button onClick={() => handleOpenModal()} className="btn-add-budget-limit">
          <span className="btn-icon">⚙️</span>
          <span>Set / Add Category Budget</span>
        </button>
      </div>

      {/* OVERALL TOTAL BUDGET SUMMARY BAR */}
      <div className="total-budget-summary-box">
        <div className="summary-stat-item">
          <span className="stat-label">Total Monthly Budget Target</span>
          <span className="stat-val text-bold">{formatCurrency(grandTotalBudget, currency)}</span>
        </div>

        <div className="summary-stat-item">
          <span className="stat-label">Total Spent So Far</span>
          <span className="stat-val text-amber">{formatCurrency(grandTotalSpent, currency)}</span>
        </div>

        <div className="summary-stat-item">
          <span className="stat-label">Remaining Available</span>
          <span className={`stat-val ${remainingBudget >= 0 ? 'text-emerald' : 'text-red'}`}>
            {formatCurrency(remainingBudget, currency)}
          </span>
        </div>

        <div className="summary-stat-item">
          <span className="stat-label">Overall Usage</span>
          <span className={`stat-val ${overallPct >= 90 ? 'text-red' : 'text-indigo'}`}>{overallPct}%</span>
        </div>
      </div>

      {/* CATEGORY METER GRID */}
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
                <div className="meter-cat-title-group">
                  <span className="meter-cat-title">{cat}</span>
                  <button onClick={() => handleOpenModal(cat)} className="btn-edit-limit-icon" title="Edit Budget Limit">
                    ✏️
                  </button>
                </div>
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

      {/* MODAL TO ADD / EDIT CATEGORY BUDGET LIMIT */}
      {showModal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-box">
            <div className="modal-header">
              <h4>Set Category Budget Target</h4>
              <button onClick={() => setShowModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleSaveBudgetLimit} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Select Category</label>
                <select
                  value={editingCategory}
                  onChange={(e) => {
                    const selectedCat = e.target.value;
                    setEditingCategory(selectedCat);
                    const existingLimitIDR = categoryBudgets[selectedCat] || 0;
                    const existingLimitCurrent = convertCurrency(existingLimitIDR, "IDR", currency);
                    setLimitInput(existingLimitCurrent ? String(existingLimitCurrent) : "");
                  }}
                >
                  {AVAILABLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Monthly Budget Target Limit ({currency})</label>
                <input
                  type="number"
                  placeholder={`e.g. 4000000 in ${currency}`}
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="modal-actions full-width">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit-save">
                  Save Budget Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
