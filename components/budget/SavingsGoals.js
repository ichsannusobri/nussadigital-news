'use client';

import { useState } from 'react';
import { formatCurrency, convertCurrency } from '../../lib/budget/currencies';

export default function SavingsGoals({
  savingsGoals = [],
  currency = "IDR",
  onAddSavingsGoal = () => {},
  onUpdateSavingsGoal = () => {},
  onDeleteSavingsGoal = () => {},
  onDepositSavingsGoal = () => {}
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [activeGoal, setActiveGoal] = useState(null);

  // Form states for New Goal
  const [goalName, setGoalName] = useState("");
  const [targetAmountInput, setTargetAmountInput] = useState("");
  const [currentAmountInput, setCurrentAmountInput] = useState("");
  const [targetDateInput, setTargetDateInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [iconInput, setIconInput] = useState("🎯");

  // Form state for Deposit / Top-up
  const [depositAmountInput, setDepositAmountInput] = useState("");

  const PRESET_ICONS = ["🎯", "🛡️", "✈️", "🏠", "🚗", "🕋", "🎓", "💍", "💻", "👶", "💰", "🏖️"];

  // Calculate totals in current display currency
  let totalTargetDisplay = 0;
  let totalSavedDisplay = 0;

  savingsGoals.forEach(g => {
    const targetIDR = g.targetAmount || 0;
    const currentIDR = g.currentAmount || 0;
    totalTargetDisplay += convertCurrency(targetIDR, "IDR", currency);
    totalSavedDisplay += convertCurrency(currentIDR, "IDR", currency);
  });

  const totalRemainingDisplay = Math.max(0, totalTargetDisplay - totalSavedDisplay);
  const overallSavingsPct = totalTargetDisplay > 0 
    ? Math.min(100, Math.round((totalSavedDisplay / totalTargetDisplay) * 100)) 
    : 0;

  // Handlers
  const handleOpenAddModal = () => {
    setGoalName("");
    setTargetAmountInput("");
    setCurrentAmountInput("");
    setTargetDateInput("");
    setNotesInput("");
    setIconInput("🎯");
    setShowAddModal(true);
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalName.trim()) {
      alert("Masukkan nama target tabungan.");
      return;
    }

    const targetNum = Number(targetAmountInput);
    if (isNaN(targetNum) || targetNum <= 0) {
      alert("Masukkan nominal target tabungan yang valid.");
      return;
    }

    const currentNum = Number(currentAmountInput) || 0;

    const targetInIDR = convertCurrency(targetNum, currency, "IDR");
    const currentInIDR = convertCurrency(currentNum, currency, "IDR");

    const newGoal = {
      id: `goal-${Date.now()}`,
      name: goalName.trim(),
      targetAmount: targetInIDR,
      currentAmount: currentInIDR,
      targetDate: targetDateInput || "",
      notes: notesInput.trim(),
      icon: iconInput || "🎯",
      createdAt: new Date().toISOString()
    };

    onAddSavingsGoal(newGoal);
    setShowAddModal(false);
  };

  const handleOpenEditModal = (goal) => {
    setActiveGoal(goal);
    setGoalName(goal.name);
    
    const targetDisplay = convertCurrency(goal.targetAmount || 0, "IDR", currency);
    const currentDisplay = convertCurrency(goal.currentAmount || 0, "IDR", currency);
    
    setTargetAmountInput(String(targetDisplay));
    setCurrentAmountInput(String(currentDisplay));
    setTargetDateInput(goal.targetDate || "");
    setNotesInput(goal.notes || "");
    setIconInput(goal.icon || "🎯");
    setShowEditModal(true);
  };

  const handleSaveEditGoal = (e) => {
    e.preventDefault();
    if (!activeGoal) return;

    const targetNum = Number(targetAmountInput);
    const currentNum = Number(currentAmountInput) || 0;

    if (isNaN(targetNum) || targetNum <= 0) {
      alert("Masukkan nominal target tabungan yang valid.");
      return;
    }

    const targetInIDR = convertCurrency(targetNum, currency, "IDR");
    const currentInIDR = convertCurrency(currentNum, currency, "IDR");

    const updated = {
      ...activeGoal,
      name: goalName.trim(),
      targetAmount: targetInIDR,
      currentAmount: currentInIDR,
      targetDate: targetDateInput || "",
      notes: notesInput.trim(),
      icon: iconInput || "🎯"
    };

    onUpdateSavingsGoal(updated);
    setShowEditModal(false);
  };

  const handleOpenDepositModal = (goal) => {
    setActiveGoal(goal);
    setDepositAmountInput("");
    setShowDepositModal(true);
  };

  const handleSaveDeposit = (e) => {
    e.preventDefault();
    if (!activeGoal) return;

    const depositNum = Number(depositAmountInput);
    if (isNaN(depositNum) || depositNum <= 0) {
      alert("Masukkan jumlah setoran tabungan yang valid.");
      return;
    }

    const depositInIDR = convertCurrency(depositNum, currency, "IDR");
    const newCurrentInIDR = (activeGoal.currentAmount || 0) + depositInIDR;

    const updated = {
      ...activeGoal,
      currentAmount: newCurrentInIDR
    };

    onUpdateSavingsGoal(updated);
    setShowDepositModal(false);
  };

  const handleDeleteGoalClick = (goal) => {
    if (confirm(`Hapus target tabungan "${goal.name}"?`)) {
      onDeleteSavingsGoal(goal.id);
      if (showEditModal) setShowEditModal(false);
    }
  };

  return (
    <div className="budget-savings-goals-card">
      {/* HEADER BAR */}
      <div className="savings-header">
        <div className="savings-title-group">
          <span className="section-icon">🎯</span>
          <div>
            <h3>Target Tabungan & Savings Goals</h3>
            <span className="savings-subtitle">Plot & Pantau Progres Tabungan Impian ({currency})</span>
          </div>
        </div>

        <button onClick={handleOpenAddModal} className="btn-add-savings-goal">
          <span className="btn-icon">➕</span>
          <span>Buat Target Tabungan Baru</span>
        </button>
      </div>

      {/* SAVINGS SUMMARY STATS */}
      <div className="savings-summary-box">
        <div className="savings-stat-item">
          <span className="stat-label">Total Target Tabungan</span>
          <span className="stat-val text-bold">{formatCurrency(totalTargetDisplay, currency)}</span>
        </div>

        <div className="savings-stat-item">
          <span className="stat-label">Dana Terkumpul Saat Ini</span>
          <span className="stat-val text-emerald">{formatCurrency(totalSavedDisplay, currency)}</span>
        </div>

        <div className="savings-stat-item">
          <span className="stat-label">Sisa yang Perlu Ditabung</span>
          <span className="stat-val text-amber">{formatCurrency(totalRemainingDisplay, currency)}</span>
        </div>

        <div className="savings-stat-item">
          <span className="stat-label">Progres Total</span>
          <span className="stat-val text-indigo">{overallSavingsPct}%</span>
        </div>
      </div>

      {/* GOALS CARDS GRID */}
      {savingsGoals.length === 0 ? (
        <div className="empty-savings-state">
          <span className="empty-icon">🎯</span>
          <h4>Belum Ada Target Tabungan</h4>
          <p>Mulai plot tujuan tabungan Anda, seperti <strong>Dana Darurat</strong>, <strong>Liburan</strong>, <strong>Kendaraan</strong>, atau <strong>Investasi</strong>.</p>
          <button onClick={handleOpenAddModal} className="btn-primary-sm">➕ Buat Target Tabungan Pertama</button>
        </div>
      ) : (
        <div className="savings-goals-grid">
          {savingsGoals.map((goal) => {
            const targetDisplay = convertCurrency(goal.targetAmount || 0, "IDR", currency);
            const currentDisplay = convertCurrency(goal.currentAmount || 0, "IDR", currency);
            const remainingGoalDisplay = Math.max(0, targetDisplay - currentDisplay);
            const pct = targetDisplay > 0 ? Math.min(100, Math.round((currentDisplay / targetDisplay) * 100)) : 0;
            const isCompleted = currentDisplay >= targetDisplay && targetDisplay > 0;

            return (
              <div key={goal.id} className={`savings-goal-card ${isCompleted ? 'goal-completed' : ''}`}>
                <div className="goal-card-top">
                  <div className="goal-icon-badge">{goal.icon || "🎯"}</div>
                  <div className="goal-title-wrap">
                    <h4 className="goal-title">{goal.name}</h4>
                    {goal.targetDate && (
                      <span className="goal-date-badge">📅 Target: {goal.targetDate}</span>
                    )}
                  </div>
                  <div className="goal-actions-dropdown">
                    <button onClick={() => handleOpenEditModal(goal)} className="btn-goal-edit" title="Edit Target">✏️</button>
                    <button onClick={() => handleDeleteGoalClick(goal)} className="btn-goal-del" title="Hapus Target">🗑️</button>
                  </div>
                </div>

                <div className="goal-progress-wrap">
                  <div className="goal-progress-numbers">
                    <span className="goal-current-saved">
                      Terkumpul: <strong>{formatCurrency(currentDisplay, currency)}</strong>
                    </span>
                    <span className="goal-pct-badge">{pct}%</span>
                  </div>

                  <div className="goal-progress-track">
                    <div 
                      className={`goal-progress-fill ${isCompleted ? 'fill-completed' : ''}`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="goal-progress-footer">
                    <span className="goal-target-val">Target: {formatCurrency(targetDisplay, currency)}</span>
                    <span className="goal-remaining-val">
                      {isCompleted ? "🎉 Target Tercapai!" : `Kurang: ${formatCurrency(remainingGoalDisplay, currency)}`}
                    </span>
                  </div>
                </div>

                {goal.notes && (
                  <div className="goal-note-pill">
                    📝 {goal.notes}
                  </div>
                )}

                <div className="goal-card-bottom-cta">
                  <button onClick={() => handleOpenDepositModal(goal)} className="btn-deposit-goal">
                    <span>💰 + Tambah Setoran Tabungan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: ADD NEW SAVINGS GOAL */}
      {showAddModal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-box">
            <div className="modal-header">
              <h4>🎯 Buat Target Tabungan Baru</h4>
              <button onClick={() => setShowAddModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleCreateGoal} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Pilih Ikon</label>
                <div className="icon-picker-row">
                  {PRESET_ICONS.map(ic => (
                    <button 
                      key={ic} 
                      type="button" 
                      onClick={() => setIconInput(ic)} 
                      className={`icon-choice-btn ${iconInput === ic ? 'selected' : ''}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Nama Target Tabungan</label>
                <input
                  type="text"
                  placeholder="e.g. Dana Darurat 6 Bulan, Liburan Jepang, Tabungan Haji, Beli Mobil"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Nominal Target Dana ({currency})</label>
                <input
                  type="number"
                  placeholder={`e.g. 50000000`}
                  value={targetAmountInput}
                  onChange={(e) => setTargetAmountInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Saldo Awal Terkumpul ({currency})</label>
                <input
                  type="number"
                  placeholder={`e.g. 10000000 (jika sudah ada)`}
                  value={currentAmountInput}
                  onChange={(e) => setCurrentAmountInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Target Tanggal / Bulan Tercapai (Opsional)</label>
                <input
                  type="date"
                  value={targetDateInput}
                  onChange={(e) => setTargetDateInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Catatan / Keterangan (Opsional)</label>
                <input
                  type="text"
                  placeholder="e.g. Disisihkan 2 juta tiap gajian ke Reksadana"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
              </div>

              <div className="modal-actions full-width">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Batal
                </button>
                <button type="submit" className="btn-submit-save">
                  Simpan Target Tabungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DEPOSIT / TOP UP */}
      {showDepositModal && activeGoal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-box">
            <div className="modal-header">
              <h4>💰 Tambah Setoran Tabungan: {activeGoal.name}</h4>
              <button onClick={() => setShowDepositModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleSaveDeposit} className="modal-form-grid">
              <div className="form-group full-width">
                <p className="deposit-current-info">
                  Saldo Terkumpul Saat Ini: <strong>{formatCurrency(convertCurrency(activeGoal.currentAmount || 0, "IDR", currency), currency)}</strong> dari target <strong>{formatCurrency(convertCurrency(activeGoal.targetAmount || 0, "IDR", currency), currency)}</strong>
                </p>
              </div>

              <div className="form-group full-width">
                <label>Jumlah Dana yang Ditambahkan ({currency})</label>
                <input
                  type="number"
                  placeholder={`Masukkan nominal setoran`}
                  value={depositAmountInput}
                  onChange={(e) => setDepositAmountInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="modal-actions full-width">
                <button type="button" onClick={() => setShowDepositModal(false)} className="btn-cancel">
                  Batal
                </button>
                <button type="submit" className="btn-submit-save">
                  + Tambahkan ke Tabungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT GOAL */}
      {showEditModal && activeGoal && (
        <div className="budget-modal-overlay">
          <div className="budget-modal-box">
            <div className="modal-header">
              <h4>✏️ Edit Target Tabungan</h4>
              <button onClick={() => setShowEditModal(false)} className="btn-close-modal">✕</button>
            </div>

            <form onSubmit={handleSaveEditGoal} className="modal-form-grid">
              <div className="form-group full-width">
                <label>Pilih Ikon</label>
                <div className="icon-picker-row">
                  {PRESET_ICONS.map(ic => (
                    <button 
                      key={ic} 
                      type="button" 
                      onClick={() => setIconInput(ic)} 
                      className={`icon-choice-btn ${iconInput === ic ? 'selected' : ''}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Nama Target Tabungan</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nominal Target Dana ({currency})</label>
                <input
                  type="number"
                  value={targetAmountInput}
                  onChange={(e) => setTargetAmountInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dana Terkumpul Saat Ini ({currency})</label>
                <input
                  type="number"
                  value={currentAmountInput}
                  onChange={(e) => setCurrentAmountInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Tanggal / Bulan Tercapai</label>
                <input
                  type="date"
                  value={targetDateInput}
                  onChange={(e) => setTargetDateInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Catatan / Keterangan</label>
                <input
                  type="text"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
              </div>

              <div className="modal-actions full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" onClick={() => handleDeleteGoalClick(activeGoal)} className="btn-delete-cat" style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  🗑️ Hapus Target
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn-cancel">
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
    </div>
  );
}
