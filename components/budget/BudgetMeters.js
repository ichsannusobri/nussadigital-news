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
  onAddCustomCategory = () => {}
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

  // Active categories are strictly the keys in user's categoryBudgets (Pos Kebutuhan / Pockets)
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
      alert("Masukkan angka yang valid untuk alokasi limit dan realisasi pengeluaran.");
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
    if (confirm(`Apakah Anda yakin ingin menghapus pos/kantong "${editingCategory}"?`)) {
      onDeleteCategory(editingCategory);
      setShowModal(false);
    }
  };

  const handleCreateNewCategory = (e) => {
    e.preventDefault();
    const cleanName = newCatName.trim();
    if (!cleanName) {
      alert("Masukkan nama pos / kantong kebutuhan.");
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
          <span className="section-icon">🗂️</span>
          <div>
            <h3>Pos Anggaran & Kantong Kebutuhan (Pockets)</h3>
            <span className="meters-subtitle">Plot Alokasi Dana per Kebutuhan Bulanan ({currency})</span>
          </div>
        </div>

        <div className="meters-header-actions">
          <button onClick={() => setShowAddCategoryModal(true)} className="btn-add-budget-limit">
            <span className="btn-icon">➕</span>
            <span>Tambah Pos / Kantong Baru</span>
          </button>
        </div>
      </div>

      {/* OVERALL TOTAL BUDGET SUMMARY BOX */}
      <div className="total-budget-summary-box">
        <div className="summary-stat-item">
          <span className="stat-label">Total Alokasi Pos Kebutuhan</span>
          <span className="stat-val text-bold">{formatCurrency(grandTotalBudget, currency)}</span>
        </div>

        <div className="summary-stat-item">
          <span className="stat-label">Total Terpakai (Realisasi)</span>
          <span className="stat-val text-amber">{formatCurrency(grandTotalSpent, currency)}</span>
        </div>

        <div className="summary-stat-item">
          <span className="stat-label">Sisa Saldo Kantong</span>
          <span className={`stat-val ${remainingBudget >= 0 ? 'text-emerald' : 'text-red'}`}>
            {formatCurrency(remainingBudget, currency)}
          </span>
        </div>

        <div className="summary-stat-item">
          <span className="stat-label">Total Pemakaian</span>
          <span className={`stat-val ${overallPct >= 90 ? 'text-red' : 'text-indigo'}`}>{overallPct}%</span>
        </div>
      </div>

      <p className="click-hint-text">💡 <em>Klik kartu pos kebutuhan di bawah untuk mengubah alokasi budget, realisasi pengeluaran, atau menghapus pos!</em></p>

      {/* CATEGORY METER GRID (CLICKABLE POCKET CARDS) */}
      {categories.length === 0 ? (
        <div className="empty-expenses-state" style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
          <span className="empty-icon">🗂️</span>
          <h4>Belum Ada Pos Kebutuhan</h4>
          <p>Buat kantong kebutuhan pertama Anda, misalnya <strong>Belanja Dapur</strong>, <strong>Uang Sekolah</strong>, <strong>Transport</strong>, atau <strong>Transfer Keluarga</strong>.</p>
          <button onClick={() => setShowAddCategoryModal(true)} className="btn-primary-sm">➕ Tambah Pos / Kantong Pertama</button>
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
                title="Klik untuk ubah alokasi atau hapus pos"
              >
                <div className="meter-info-top">
                  <div className="meter-cat-title-group">
                    <span className="meter-cat-title">{cat}</span>
                    <span className="badge-edit-pencil">✏️ Ubah</span>
                  </div>
                  <span className="meter-pct">{pct}% Terpakai</span>
                </div>

                <div className="meter-bar-track">
                  <div className={`meter-bar-fill fill-${statusClass}`} style={{ width: `${pct}%` }}></div>
                </div>

                <div className="meter-info-bottom">
                  <span className="spent-val">Terpakai: <strong>{formatCurrency(spent, currency)}</strong></span>
                  <span className="limit-val">Alokasi: <strong>{formatCurrency(limit, currency)}</strong></span>
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
              <h4>Kelola Pos Anggaran: {editingCategory}</h4>
              <button onClick={() => setShowModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleSaveCategoryDetails} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Nama Pos / Kantong</label>
                <input type="text" value={editingCategory} disabled className="disabled-input" />
              </div>

              <div className="form-group">
                <label>Realisasi Pengeluaran / Terpakai ({currency})</label>
                <input
                  type="number"
                  placeholder={`Realisasi dalam ${currency}`}
                  value={spentInput}
                  onChange={(e) => setSpentInput(e.target.value)}
                  required
                  autoFocus
                />
                <small className="field-hint">Ubah langsung jumlah yang sudah Anda belanjakan bulan ini</small>
              </div>

              <div className="form-group">
                <label>Alokasi Budget / Limit ({currency})</label>
                <input
                  type="number"
                  placeholder={`Alokasi dalam ${currency}`}
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  required
                />
                <small className="field-hint">Batas maksimal anggaran kantong ini</small>
              </div>

              <div className="form-group full-width">
                <label>Catatan & Rincian (Opsional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Belanja bahan pokok beras, telur, minimarket & dapur"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
              </div>

              <div className="modal-actions full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" onClick={handleDeleteCategoryClick} className="btn-delete-cat" style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  🗑️ Hapus Pos / Kantong
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                    Batal
                  </button>
                  <button type="submit" className="btn-submit-save">
                    Simpan Perubahan
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
              <h4>➕ Tambah Pos Anggaran / Kantong Baru</h4>
              <button onClick={() => setShowAddCategoryModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleCreateNewCategory} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Nama Pos / Kantong Kebutuhan</label>
                <input
                  type="text"
                  placeholder="e.g. Belanja Dapur, Uang Sekolah Anak, Renovasi Rumah, Transfer Orang Tua"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group full-width">
                <label>Alokasi Budget Bulanan ({currency})</label>
                <input
                  type="number"
                  placeholder={`e.g. 3500000 dalam ${currency}`}
                  value={newCatLimit}
                  onChange={(e) => setNewCatLimit(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Keterangan / Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="e.g. Kebutuhan operasional mingguan"
                  value={newCatNotes}
                  onChange={(e) => setNewCatNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions full-width">
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="btn-cancel">
                  Batal
                </button>
                <button type="submit" className="btn-submit-save">
                  Tambah Pos Kebutuhan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
