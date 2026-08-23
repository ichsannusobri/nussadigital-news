'use client';

import { useState } from 'react';
import { formatCurrency, convertCurrency, SUPPORTED_CURRENCIES } from '../../lib/budget/currencies';
import { getExpenseLogoInfo, getPaymentBadge } from '../../lib/budget/brandLogos';

const DEFAULT_CATEGORIES = [
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

const BILLING_CYCLES = ["Monthly", "Yearly", "Weekly", "One-Time"];
const PAYMENT_METHODS = ["Bank Transfer", "Credit Card", "Debit Card", "Autopay", "Apple Pay", "PayPal", "QRIS / E-Wallet"];

export default function ExpenseTracker({ expenses, currency, onAddExpense, onDeleteExpense, onUpdateExpense, categories = [] }) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  // Dynamic categories matching user's active categories
  const availableCategories = (categories && categories.length > 0) ? categories : DEFAULT_CATEGORIES;

  const [formData, setFormData] = useState({
    name: "",
    category: availableCategories[0] || "Housing",
    amount: "",
    currency: currency,
    cycle: "Monthly",
    dueDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Credit Card",
    status: "Upcoming",
    notes: ""
  });

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormData({
      name: "",
      category: availableCategories[0] || "Housing",
      amount: "",
      currency: currency,
      cycle: "Monthly",
      dueDate: new Date().toISOString().split("T")[0],
      paymentMethod: "Credit Card",
      status: "Upcoming",
      notes: ""
    });
    setShowModal(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExpense(exp);
    setFormData({
      name: exp.name || "",
      category: exp.category || "Housing",
      amount: exp.amount || "",
      currency: exp.currency || currency,
      cycle: exp.cycle || "Monthly",
      dueDate: exp.dueDate || new Date().toISOString().split("T")[0],
      paymentMethod: exp.paymentMethod || "Credit Card",
      status: exp.status || "Upcoming",
      notes: exp.notes || ""
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      alert("Please enter the expense name and amount.");
      return;
    }

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      id: editingExpense ? editingExpense.id : `exp-${Date.now()}`
    };

    if (editingExpense) {
      onUpdateExpense(payload);
    } else {
      onAddExpense(payload);
    }
    setShowModal(false);
  };

  const handleDeleteCurrentExpense = () => {
    if (!editingExpense) return;
    if (confirm(`Are you sure you want to delete expense "${editingExpense.name}"?`)) {
      onDeleteExpense(editingExpense.id);
      setShowModal(false);
    }
  };

  // Filter items by search & category
  const filteredExpenses = expenses.filter((item) => {
    const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="wallos-workspace-wrapper">
      {/* TOP WALLOS CONTROLS BAR */}
      <div className="wallos-top-bar">
        <div className="wallos-bar-left">
          <button onClick={handleOpenAdd} className="btn-wallos-primary">
            <span className="btn-icon-plus">➕</span>
            <span>New Expense / Subscription</span>
          </button>
        </div>

        <div className="wallos-bar-right">
          {/* SEARCH BAR */}
          <div className="wallos-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Search expenses, subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="btn-clear-search">✕</button>
            )}
          </div>

          {/* DYNAMIC CATEGORY FILTER SELECT */}
          <div className="wallos-filter-select">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories ({expenses.length})</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* VIEW MODE TOGGLE (Grid vs List) */}
          <div className="wallos-view-toggle">
            <button
              onClick={() => setViewMode("grid")}
              className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              title="Grid View (Wallos Cards)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect></svg>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
              title="Table List View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      {filteredExpenses.length === 0 ? (
        <div className="empty-expenses-state">
          <span className="empty-icon">📂</span>
          <p>No expenses found matching your filter.</p>
          <button onClick={handleOpenAdd} className="btn-secondary-sm">Add New Item</button>
        </div>
      ) : viewMode === "grid" ? (
        /* WALLOS 3-COLUMN CARD GRID VIEW */
        <div className="wallos-cards-grid">
          {filteredExpenses.map((item) => {
            const logoInfo = getExpenseLogoInfo(item.name, item.category);
            const payBadge = getPaymentBadge(item.paymentMethod);
            const convertedAmt = convertCurrency(item.amount, item.currency || "IDR", currency);

            return (
              <div key={item.id} className="wallos-card">
                {/* CARD HEADER */}
                <div className="wallos-card-top">
                  <div className="brand-logo-container">
                    {logoInfo.type === "brand" ? (
                      <img src={logoInfo.logo} alt={item.name} className="brand-img-logo" />
                    ) : (
                      <div className="stock-icon-avatar" style={{ backgroundColor: logoInfo.bg, color: logoInfo.color }}>
                        {logoInfo.icon}
                      </div>
                    )}
                  </div>

                  <div className="card-menu-dropdown" style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => handleOpenEdit(item)} className="btn-card-menu" title="Edit Item">
                      ✏️
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Delete "${item.name}"?`)) onDeleteExpense(item.id);
                      }} 
                      className="btn-card-menu" 
                      title="Delete Item"
                      style={{ color: '#EF4444' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="wallos-card-body">
                  <h4 className="card-item-title">{item.name}</h4>
                  <div className="card-item-price">
                    {formatCurrency(convertedAmt, currency)}
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className="wallos-card-footer">
                  <div className="card-meta-left">
                    <span className="meta-line">
                      <span className="icon-cycle">🔄</span> {item.cycle}
                    </span>
                    <span className="meta-line">
                      <span className="icon-date">📅</span> Due {item.dueDate}
                    </span>
                  </div>

                  <div className="card-meta-right">
                    <span className="payment-badge-pill" style={{ backgroundColor: payBadge.bg, color: payBadge.color }}>
                      {payBadge.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="wallos-table-container">
          <table className="wallos-table">
            <thead>
              <tr>
                <th>Item / Subscription</th>
                <th>Category</th>
                <th>Cycle</th>
                <th>Due Date</th>
                <th>Method</th>
                <th className="text-right">Cost ({currency})</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((item) => {
                const convertedAmt = convertCurrency(item.amount, item.currency || "IDR", currency);
                const isPaid = item.status === "Paid";

                return (
                  <tr key={item.id} className={isPaid ? "row-paid" : ""}>
                    <td className="font-semibold text-main">
                      <div className="table-item-cell">
                        <span className="table-item-name">{item.name}</span>
                        {item.notes && <span className="item-subnote">{item.notes}</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`cat-badge cat-${(item.category || '').toLowerCase()}`}>
                        {item.category}
                      </span>
                    </td>
                    <td><span className="cycle-pill">{item.cycle}</span></td>
                    <td><span className="due-date">{item.dueDate}</span></td>
                    <td><span className="pay-method">{item.paymentMethod}</span></td>
                    <td className="text-right font-bold text-amount">
                      {formatCurrency(convertedAmt, currency)}
                    </td>
                    <td>
                      <span className={`status-pill status-${(item.status || '').toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="action-btn-group">
                        <button onClick={() => handleOpenEdit(item)} className="btn-icon-edit" title="Edit">✏️</button>
                        <button onClick={() => { if (confirm(`Delete "${item.name}"?`)) onDeleteExpense(item.id); }} className="btn-icon-delete" title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DIALOG */}
      {showModal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-box">
            <div className="modal-header">
              <h4>{editingExpense ? "Edit Subscription / Expense" : "Add Subscription / Expense"}</h4>
              <button onClick={() => setShowModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Item Name (e.g. Netflix, PLN Electricity, Groceries)</label>
                <input
                  type="text"
                  placeholder="e.g. Netflix, Spotify, PLN Electricity, Rent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Billing Cycle</label>
                <select
                  value={formData.cycle}
                  onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                >
                  {BILLING_CYCLES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Amount Cost</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  {Object.keys(SUPPORTED_CURRENCIES).map(code => (
                    <option key={code} value={code}>{code} ({SUPPORTED_CURRENCIES[code].symbol})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Next Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Payment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Notes / Memo (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Family plan 4-screen"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingExpense ? (
                  <button type="button" onClick={handleDeleteCurrentExpense} className="btn-delete-cat" style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    🗑️ Delete Expense
                  </button>
                ) : <div />}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-save">
                    Save Item
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
