'use client';

import { useState } from 'react';
import { formatCurrency, convertCurrency } from '../../lib/budget/currencies';

export default function BudgetMeters({ 
  expenses = [], 
  categoryBudgets = {}, 
  categorySpentOverrides = {},
  categoryNotes = {},
  currency = "IDR", 
  monthlyIncome = 0,
  onUpdateCategoryBudget = () => {},
  onUpdateCategorySpent = () => {},
  onUpdateCategoryNotes = () => {},
  onDeleteCategory = () => {},
  onAddCustomCategory = () => {},
  onAutoSyncTargets = () => {}
}) {
  const [showModal, setShowModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState("");
  const [limitInput, setLimitInput] = useState("");
  const [spentInput, setSpentInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  // Add custom category state
  const [newCatName, setNewCatName] = useState("");
  const [newCatLimit, setNewCatLimit] = useState("");
  const [newCatNotes, setNewCatNotes] = useState("");

  // Compute calculated spent from Expense Tracker per category in display currency
  const calculatedSpentPerCat = {};
  (expenses || []).forEach(e => {
    if (!e) return;
    const cat = e.category || "Uncategorized";
    const amt = convertCurrency(e.amount || 0, e.currency || "IDR", currency);
    calculatedSpentPerCat[cat] = (calculatedSpentPerCat[cat] || 0) + amt;
  });

  const safeBudgets = categoryBudgets || {};
  const safeSpentOverrides = categorySpentOverrides || {};
  const safeNotes = categoryNotes || {};

  // Active categories are strictly the keys in user's categoryBudgets
  const categories = Object.keys(safeBudgets);

  // Calculate totals
  let grandTotalBudget = 0;
  let grandTotalSpent = 0;

  categories.forEach(cat => {
    const limitIDR = safeBudgets[cat] || 0;
    const limitDisplay = convertCurrency(limitIDR, "IDR", currency);
    grandTotalBudget += limitDisplay;

    const hasOverride = safeSpentOverrides[cat] !== undefined && safeSpentOverrides[cat] !== null;
    const spentIDR = hasOverride ? safeSpentOverrides[cat] : null;
    const spentDisplay = hasOverride 
      ? convertCurrency(spentIDR, "IDR", currency)
      : (calculatedSpentPerCat[cat] || 0);

    grandTotalSpent += spentDisplay;
  });

  const remainingBudget = grandTotalBudget - grandTotalSpent;
  const overallPct = grandTotalBudget > 0 ? Math.min(100, Math.round((grandTotalSpent / grandTotalBudget) * 100)) : 0;

  // Open modal to edit existing category
  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    
    // Existing limit in display currency
    const limitIDR = safeBudgets[cat] || 0;
    const limitDisplay = convertCurrency(limitIDR, "IDR", currency);
    setLimitInput(limitDisplay ? String(limitDisplay) : "");

    // Existing spent override in display currency
    const hasOverride = safeSpentOverrides[cat] !== undefined && safeSpentOverrides[cat] !== null;
    const spentIDR = hasOverride ? safeSpentOverrides[cat] : (calculatedSpentPerCat[cat] || 0);
    const spentDisplay = convertCurrency(spentIDR, "IDR", currency);
    setSpentInput(spentDisplay ? String(spentDisplay) : "0");

    // Existing notes
    setNotesInput(safeNotes[cat] || "");

    setShowModal(true);
  };

  const handleSaveCategoryDetails = (e) => {
    e.preventDefault();

    const limitNum = Number(limitInput);
    const spentNum = Number(spentInput);

    if (isNaN(limitNum) || limitNum < 0 || isNaN(spentNum) || spentNum < 0) {
      alert("Please enter valid non-negative numbers for limit and realized spent.");
      return;
    }

    const limitInIDR = convertCurrency(limitNum, currency, "IDR");
    const spentInIDR = convertCurrency(spentNum, currency, "IDR");

    onUpdateCategoryBudget(editingCategory, limitInIDR);
    onUpdateCategorySpent(editingCategory, spentInIDR);
    onUpdateCategoryNotes(editingCategory, notesInput);

    setShowModal(false);
  };

  const handleDeleteCategoryClick = () => {
    if (confirm(`Are you sure you want to permanently delete category "${editingCategory}"?`)) {
      onDeleteCategory(editingCategory);
      setShowModal(false);
    }
  };

  const handleCreateNewCategory = (e) => {
    e.preventDefault();
    const cleanName = newCatName.trim();
    if (!cleanName) {
      alert("Please enter a category name.");
      return;
    }

    const limitNum = Number(newCatLimit) || 0;
    const limitInIDR = convertCurrency(limitNum, currency, "IDR");

    if (onAddCustomCategory) {
      onAddCustomCategory(cleanName, limitInIDR, newCatNotes);
    }
    setNewCatName("");
    setNewCatLimit("");
    setNewCatNotes("");
    setShowAddCategoryModal(false);
  };

  return (
    <div className="budget-meters-card">
      {/* HEADER BAR */}
      <div className="meters-header">
        <div className="meters-title-group">
          <span className="section-icon">📊</span>
          <h3>Category Spending Meters & Realized Limits</h3>
          <span className="meters-subtitle">({currency})</span>
        </div>

        <div className="meters-header-actions">
          <button onClick={onAutoSyncTargets} className="btn-sync-income-targets" title="Auto-scale category budget targets to match Monthly Household Income">
            <span>⚡ Auto-Sync Targets to Income</span>
          </button>
          <button onClick={() => setShowAddCategoryModal(true)} className="btn-add-budget-limit">
            <span className="btn-icon">➕</span>
            <span>Add Custom Category</span>
          </button>
        </div>
      </div>

      {/* OVERALL TOTAL BUDGET SUMMARY BOX */}
      <div className="total-budget-summary-box">
        <div className="summary-stat-item">
          <span className="stat-label">Total Monthly Budget Target</span>
          <span className="stat-val text-bold">{formatCurrency(grandTotalBudget, currency)}</span>
        </div>

        <div className="summary-stat-item">
          <span className="stat-label">Realized Total Spent</span>
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

      <p className="click-hint-text">💡 <em>Click on any category card below to edit Realized Spent, Budget Limit, or delete category!</em></p>

      {/* CATEGORY METER GRID (CLICKABLE CARDS) */}
      {categories.length === 0 ? (
        <div className="empty-expenses-state" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <span className="empty-icon">📊</span>
          <p>No categories configured yet.</p>
          <button onClick={() => setShowAddCategoryModal(true)} className="btn-secondary-sm">Add First Category</button>
        </div>
      ) : (
        <div className="meters-grid">
          {categories.map((cat) => {
            const limitIDR = safeBudgets[cat] || 0;
            const limit = convertCurrency(limitIDR, "IDR", currency);

            const hasOverride = safeSpentOverrides[cat] !== undefined && safeSpentOverrides[cat] !== null;
            const spentIDR = hasOverride ? safeSpentOverrides[cat] : (calculatedSpentPerCat[cat] || 0);
            const spent = convertCurrency(spentIDR, "IDR", currency);

            const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
            const noteText = safeNotes[cat] || "";

            let statusClass = "green";
            if (pct >= 90) statusClass = "red";
            else if (pct >= 70) statusClass = "yellow";

            return (
              <div 
                key={cat} 
                onClick={() => handleOpenEditModal(cat)} 
                className={`meter-item meter-status-${statusClass} clickable-category-card`}
                title="Click to edit or delete category"
              >
                <div className="meter-info-top">
                  <div className="meter-cat-title-group">
                    <span className="meter-cat-title">{cat}</span>
                    <span className="badge-edit-pencil">✏️ Edit</span>
                  </div>
                  <span className="meter-pct">{pct}% Used</span>
                </div>

                <div className="meter-bar-track">
                  <div className={`meter-bar-fill fill-${statusClass}`} style={{ width: `${pct}%` }}></div>
                </div>

                <div className="meter-info-bottom">
                  <span className="spent-val">Spent (Realisasi): <strong>{formatCurrency(spent, currency)}</strong></span>
                  <span className="limit-val">Limit Target: <strong>{formatCurrency(limit, currency)}</strong></span>
                </div>

                {noteText && (
                  <div className="category-note-pill">
                    📝 {noteText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: EDIT / DELETE CATEGORY DETAILS */}
      {showModal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-box">
            <div className="modal-header">
              <h4>Manage {editingCategory} Category</h4>
              <button onClick={() => setShowModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleSaveCategoryDetails} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Category Name</label>
                <input type="text" value={editingCategory} disabled className="disabled-input" />
              </div>

              <div className="form-group">
                <label>Realized Actual Spent / Realisasi ({currency})</label>
                <input
                  type="number"
                  placeholder={`Actual spent in ${currency}`}
                  value={spentInput}
                  onChange={(e) => setSpentInput(e.target.value)}
                  required
                  autoFocus
                />
                <small className="field-hint">Directly edit how much you actually spent this month</small>
              </div>

              <div className="form-group">
                <label>Monthly Budget Target Limit ({currency})</label>
                <input
                  type="number"
                  placeholder={`Budget limit in ${currency}`}
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  required
                />
                <small className="field-hint">Maximum limit for alert meter</small>
              </div>

              <div className="form-group full-width">
                <label>Detailed Notes & Description (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Belanja bahan pokok beras, telur, minyak goreng & Minimarket"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
              </div>

              <div className="modal-actions full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" onClick={handleDeleteCategoryClick} className="btn-delete-cat" style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  🗑️ Delete Category
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-save">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW CUSTOM CATEGORY */}
      {showAddCategoryModal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-box">
            <div className="modal-header">
              <h4>Add New Custom Budget Category</h4>
              <button onClick={() => setShowAddCategoryModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleCreateNewCategory} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pendidikan Anak, Renovasi Rumah, Sedekah / Zakat"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group full-width">
                <label>Monthly Budget Target Limit ({currency})</label>
                <input
                  type="number"
                  placeholder={`e.g. 2000000 in ${currency}`}
                  value={newCatLimit}
                  onChange={(e) => setNewCatLimit(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Description & Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Biaya kursus & SPP bulanan"
                  value={newCatNotes}
                  onChange={(e) => setNewCatNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions full-width">
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit-save">
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
