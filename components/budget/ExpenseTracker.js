'use client';

import { useState } from 'react';
import { formatCurrency, convertCurrency, SUPPORTED_CURRENCIES } from '../../lib/budget/currencies';

const CATEGORIES = [
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
const PAYMENT_METHODS = ["Bank Transfer", "Credit Card", "Debit Card", "Autopay", "E-Wallet / QRIS", "Cash"];

export default function ExpenseTracker({ expenses, currency, onAddExpense, onDeleteExpense, onUpdateExpense }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingExpense, setEditingExpense] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Housing",
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
      category: "Housing",
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
      alert("Please fill in the expense name and amount.");
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

  const filteredExpenses = selectedCategory === "All"
    ? expenses
    : expenses.filter(e => e.category === selectedCategory);

  return (
    <div className="wallos-tracker-card">
      <div className="tracker-card-header">
        <div className="header-title-group">
          <span className="section-icon">📑</span>
          <h3>Household Expenses & Subscriptions (Wallos-Style)</h3>
          <span className="badge-count">{filteredExpenses.length} Items</span>
        </div>

        <div className="header-actions">
          <div className="category-filter-select">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories ({expenses.length})</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button onClick={handleOpenAdd} className="btn-add-expense">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Expense / Bill
          </button>
        </div>
      </div>

      {/* EXPENSE TABLE */}
      <div className="tracker-table-container">
        {filteredExpenses.length === 0 ? (
          <div className="empty-expenses-state">
            <p>No expenses found in this category.</p>
            <button onClick={handleOpenAdd} className="btn-secondary-sm">Add First Expense</button>
          </div>
        ) : (
          <table className="wallos-table">
            <thead>
              <tr>
                <th>Expense / Subscription</th>
                <th>Category</th>
                <th>Cycle</th>
                <th>Due Date</th>
                <th>Method</th>
                <th className="text-right">Cost ({currency})</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((item) => {
                const convertedAmt = convertCurrency(item.amount, item.currency || "IDR", currency);
                const isPaid = item.status === "Paid";

                return (
                  <tr key={item.id} className={isPaid ? "row-paid" : ""}>
                    <td className="font-semibold text-main">
                      {item.name}
                      {item.notes && <span className="item-subnote">{item.notes}</span>}
                    </td>
                    <td>
                      <span className={`cat-badge cat-${item.category.toLowerCase()}`}>
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
                      <span className={`status-pill status-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="action-btn-group">
                        <button onClick={() => handleOpenEdit(item)} className="btn-icon-edit" title="Edit">
                          ✏️
                        </button>
                        <button onClick={() => onDeleteExpense(item.id)} className="btn-icon-delete" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-box">
            <div className="modal-header">
              <h4>{editingExpense ? "Edit Expense / Subscription" : "Add Household Expense / Bill"}</h4>
              <button onClick={() => setShowModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Expense / Subscription Name</label>
                <input
                  type="text"
                  placeholder="e.g. Netflix Premium, Electricity PLN, PLN Token, Mortgage"
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
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                  placeholder="e.g. Shared account with family, discount promo code"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="modal-actions full-width">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit-save">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
