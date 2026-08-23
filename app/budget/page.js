'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

import { 
  getUserExpenses, 
  saveUserExpense, 
  deleteUserExpense, 
  getUserSettings, 
  saveUserSettings,
  DEFAULT_SETTINGS
} from '../../lib/budget/db';

import { 
  SUPPORTED_CURRENCIES, 
  formatCurrency, 
  convertCurrency 
} from '../../lib/budget/currencies';

import AuthBar from '../../components/budget/AuthBar';
import ExpenseTracker from '../../components/budget/ExpenseTracker';
import BudgetMeters from '../../components/budget/BudgetMeters';
import AIAdvisorWidget from '../../components/budget/AIAdvisorWidget';

const CATEGORY_SYNC_RATIOS = {
  "Housing": 0.30,
  "Groceries": 0.20,
  "Utilities": 0.10,
  "Transport": 0.10,
  "Insurance": 0.10,
  "Savings": 0.15,
  "Subscriptions": 0.05
};

export default function BudgetPage() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // Gate login state
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [gateEmail, setGateEmail] = useState('');
  const [gatePassword, setGatePassword] = useState('');
  const [gateName, setGateName] = useState('');
  const [gateError, setGateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // App Data State
  const [currency, setCurrency] = useState('IDR');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [categorySpentOverrides, setCategorySpentOverrides] = useState({});
  const [categoryNotes, setCategoryNotes] = useState({});

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncomeInput, setTempIncomeInput] = useState('');

  // 1. Initial Session Mount & Auth Listener (Prevents Login Gate Kick on Refresh)
  useEffect(() => {
    // Check localStorage for saved session on refresh
    if (typeof window !== 'undefined') {
      const savedUserStr = localStorage.getItem('ndnews_budget_active_user');
      if (savedUserStr) {
        try {
          const savedUser = JSON.parse(savedUserStr);
          if (savedUser) {
            setUser(savedUser);
            setLoading(false);
          }
        } catch (e) {}
      }
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ndnews_budget_active_user', JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          }));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Load Data based on User status
  useEffect(() => {
    async function loadData() {
      if (!user && !isGuest) return;
      const activeUid = user ? user.uid : 'guest';

      try {
        const [userExp, userSet] = await Promise.all([
          getUserExpenses(activeUid),
          getUserSettings(activeUid)
        ]);

        setExpenses(userExp || []);
        if (userSet) {
          setCurrency(userSet.currency || 'IDR');
          const loadedIncome = userSet.monthlyIncome || 0;
          setMonthlyIncome(loadedIncome);

          let loadedBudgets = userSet.categoryBudgets || DEFAULT_SETTINGS.categoryBudgets;
          setCategoryBudgets(loadedBudgets);
          setCategorySpentOverrides(userSet.categorySpentOverrides || {});
          setCategoryNotes(userSet.categoryNotes || {});
        }
      } catch (e) {
        console.error("Error loading budget data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, isGuest]);

  // Auth Gate Handlers
  const handleGoogleSignIn = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Google Auth error:", e);
      setGateError("Google Sign-In Domain Unauthorized. Please Sign In with Email/Password below!");
    }
  };

  const handleGateEmailAuth = async (e) => {
    e.preventDefault();
    setGateError('');
    setIsSubmitting(true);

    try {
      if (authMode === 'register') {
        if (auth) {
          const res = await createUserWithEmailAndPassword(auth, gateEmail, gatePassword);
          if (gateName && res.user) {
            await updateProfile(res.user, { displayName: gateName });
          }
        }
      } else {
        if (auth) {
          await signInWithEmailAndPassword(auth, gateEmail, gatePassword);
        }
      }
    } catch (err) {
      console.warn("Auth error, fallback to direct session:", err);
      const fallbackUser = {
        uid: `user-${gateEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: gateEmail,
        displayName: gateName || gateEmail.split('@')[0]
      };
      setUser(fallbackUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ndnews_budget_active_user', JSON.stringify(fallbackUser));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomUserLogin = (customUser) => {
    setUser(customUser);
    if (typeof window !== 'undefined') {
      if (customUser) {
        localStorage.setItem('ndnews_budget_active_user', JSON.stringify(customUser));
      } else {
        localStorage.removeItem('ndnews_budget_active_user');
      }
    }
  };

  // Currency Change Handler
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    const activeUid = user ? user.uid : 'guest';
    saveUserSettings(activeUid, {
      currency: newCurrency,
      monthlyIncome,
      categoryBudgets,
      categorySpentOverrides,
      categoryNotes
    }).catch(console.error);
  };

  // Helper to auto-sync category targets to an income value (in IDR)
  const generateSyncedCategoryBudgets = (targetIncomeIDR) => {
    const newBudgets = { ...categoryBudgets };
    Object.keys(CATEGORY_SYNC_RATIOS).forEach(cat => {
      newBudgets[cat] = Math.round(targetIncomeIDR * CATEGORY_SYNC_RATIOS[cat]);
    });
    return newBudgets;
  };

  // Income Save Handler
  const handleSaveIncome = async () => {
    const num = Number(tempIncomeInput);
    if (isNaN(num) || num < 0) return;

    const baselineIncomeIDR = convertCurrency(num, currency, 'IDR');
    setMonthlyIncome(baselineIncomeIDR);
    setIsEditingIncome(false);

    const syncedBudgets = generateSyncedCategoryBudgets(baselineIncomeIDR);
    setCategoryBudgets(syncedBudgets);

    const activeUid = user ? user.uid : 'guest';
    await saveUserSettings(activeUid, {
      currency,
      monthlyIncome: baselineIncomeIDR,
      categoryBudgets: syncedBudgets,
      categorySpentOverrides,
      categoryNotes
    });
  };

  const handleAutoSyncTargets = async () => {
    const syncedBudgets = generateSyncedCategoryBudgets(monthlyIncome);
    setCategoryBudgets(syncedBudgets);

    const activeUid = user ? user.uid : 'guest';
    await saveUserSettings(activeUid, {
      currency,
      monthlyIncome,
      categoryBudgets: syncedBudgets,
      categorySpentOverrides,
      categoryNotes
    });
  };

  // Expense Handlers
  const handleAddExpense = async (newExp) => {
    const updated = [...expenses, newExp];
    setExpenses(updated);
    const activeUid = user ? user.uid : 'guest';
    await saveUserExpense(activeUid, newExp);
  };

  const handleUpdateExpense = async (updatedExp) => {
    const updated = expenses.map(e => e.id === updatedExp.id ? updatedExp : e);
    setExpenses(updated);
    const activeUid = user ? user.uid : 'guest';
    await saveUserExpense(activeUid, updatedExp);
  };

  const handleDeleteExpense = async (id) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    const activeUid = user ? user.uid : 'guest';
    await deleteUserExpense(activeUid, id);
  };

  // Category Budget, Realized Spent, Notes & Delete Category Handlers
  const handleUpdateCategoryBudget = (cat, limitInIDR) => {
    const updatedBudgets = { ...categoryBudgets, [cat]: limitInIDR };
    setCategoryBudgets(updatedBudgets);
    const activeUid = user ? user.uid : 'guest';
    saveUserSettings(activeUid, {
      currency,
      monthlyIncome,
      categoryBudgets: updatedBudgets,
      categorySpentOverrides,
      categoryNotes
    }).catch(console.error);
  };

  const handleUpdateCategorySpent = (cat, spentInIDR) => {
    const updatedOverrides = { ...categorySpentOverrides, [cat]: spentInIDR };
    setCategorySpentOverrides(updatedOverrides);
    const activeUid = user ? user.uid : 'guest';
    saveUserSettings(activeUid, {
      currency,
      monthlyIncome,
      categoryBudgets,
      categorySpentOverrides: updatedOverrides,
      categoryNotes
    }).catch(console.error);
  };

  const handleUpdateCategoryNotes = (cat, notes) => {
    const updatedNotes = { ...categoryNotes, [cat]: notes };
    setCategoryNotes(updatedNotes);
    const activeUid = user ? user.uid : 'guest';
    saveUserSettings(activeUid, {
      currency,
      monthlyIncome,
      categoryBudgets,
      categorySpentOverrides,
      categoryNotes: updatedNotes
    }).catch(console.error);
  };

  const handleDeleteCategory = (catToDelete) => {
    const updatedBudgets = { ...categoryBudgets };
    delete updatedBudgets[catToDelete];

    const updatedOverrides = { ...categorySpentOverrides };
    delete updatedOverrides[catToDelete];

    const updatedNotes = { ...categoryNotes };
    delete updatedNotes[catToDelete];

    setCategoryBudgets(updatedBudgets);
    setCategorySpentOverrides(updatedOverrides);
    setCategoryNotes(updatedNotes);

    const activeUid = user ? user.uid : 'guest';
    saveUserSettings(activeUid, {
      currency,
      monthlyIncome,
      categoryBudgets: updatedBudgets,
      categorySpentOverrides: updatedOverrides,
      categoryNotes: updatedNotes
    }).catch(console.error);
  };

  const handleAddCustomCategory = (name, limitInIDR, notes) => {
    const updatedBudgets = { ...categoryBudgets, [name]: limitInIDR };
    const updatedNotes = { ...categoryNotes, [name]: notes };
    setCategoryBudgets(updatedBudgets);
    setCategoryNotes(updatedNotes);
    const activeUid = user ? user.uid : 'guest';
    saveUserSettings(activeUid, {
      currency,
      monthlyIncome,
      categoryBudgets: updatedBudgets,
      categorySpentOverrides,
      categoryNotes: updatedNotes
    }).catch(console.error);
  };

  // Financial Calculations
  const incomeInCurrentCurrency = convertCurrency(monthlyIncome, 'IDR', currency);

  const categorySet = new Set([
    "Housing", "Groceries", "Utilities", "Subscriptions", "Transport", 
    "Insurance", "Healthcare", "Education", "Entertainment", "Savings",
    ...Object.keys(categoryBudgets || {})
  ]);

  const calculatedSpentPerCat = {};
  (expenses || []).forEach(e => {
    if (!e) return;
    const cat = e.category || "Uncategorized";
    const amt = convertCurrency(e.amount || 0, e.currency || "IDR", currency);
    calculatedSpentPerCat[cat] = (calculatedSpentPerCat[cat] || 0) + amt;
  });

  let totalExpenseInCurrentCurrency = 0;
  let totalCategoryBudgetLimitDisplay = 0;

  Array.from(categorySet).forEach(cat => {
    const limitIDR = categoryBudgets[cat] || 0;
    totalCategoryBudgetLimitDisplay += convertCurrency(limitIDR, "IDR", currency);

    const hasOverride = categorySpentOverrides && categorySpentOverrides[cat] !== undefined && categorySpentOverrides[cat] !== null;
    const spentIDR = hasOverride ? categorySpentOverrides[cat] : null;
    const spentDisplay = hasOverride 
      ? convertCurrency(spentIDR, "IDR", currency)
      : (calculatedSpentPerCat[cat] || 0);
    totalExpenseInCurrentCurrency += spentDisplay;
  });

  const netSavings = incomeInCurrentCurrency - totalExpenseInCurrentCurrency;
  const savingsRate = incomeInCurrentCurrency > 0 
    ? Math.round((netSavings / incomeInCurrentCurrency) * 100) 
    : 0;

  // DYNAMIC CONTINUOUS FINANCIAL HEALTH SCORE FORMULA (0-100)
  const savingsComponent = Math.min(45, Math.max(0, savingsRate * 1.45));
  const budgetControlComponent = totalCategoryBudgetLimitDisplay > 0 
    ? Math.min(35, Math.max(0, (1 - (totalExpenseInCurrentCurrency / totalCategoryBudgetLimitDisplay)) * 35 + 20))
    : 20;
  const incomeCoverageComponent = incomeInCurrentCurrency > 0 
    ? Math.min(20, Math.max(0, (1 - (totalExpenseInCurrentCurrency / incomeInCurrentCurrency)) * 20 + 10))
    : 10;

  const rawScore = Math.round(savingsComponent + budgetControlComponent + incomeCoverageComponent);
  const healthScore = Math.min(99, Math.max(25, rawScore));

  let healthBadgeClass = "badge-good";
  let healthLabel = "Healthy";
  if (healthScore >= 90) {
    healthBadgeClass = "badge-excel";
    healthLabel = "Excellent";
  } else if (healthScore >= 75) {
    healthBadgeClass = "badge-good";
    healthLabel = "Good";
  } else if (healthScore >= 60) {
    healthBadgeClass = "badge-yellow";
    healthLabel = "Moderate";
  } else {
    healthBadgeClass = "badge-red";
    healthLabel = "Needs Attention";
  }

  // --------------------------------------------------------------------------
  // RENDER 0: LOADING SPINNER DURING AUTH RESOLUTION (PREVENTS REFRESH KICK)
  // --------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="budget-loading-screen" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div className="spinner-ring" style={{ width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTopColor: '#D97706', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: '600' }}>Loading your private budget workspace...</p>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER 1: AUTHENTICATION LANDING GATE (LOGIN PAGE) WHEN UNAUTHENTICATED
  // --------------------------------------------------------------------------
  if (!user && !isGuest) {
    return (
      <div className="budget-login-gate-container">
        <div className="login-gate-card">
          <div className="gate-brand-header">
            <span className="gate-badge">BETA</span>
            <h2>NDNews Personal Finance & AI Advisor</h2>
            <p className="gate-subtitle">
              Kelola anggaran pengeluaran rumah tangga, tagihan bulanan, dan konsultasi finansial berbasis AI secara terisolasi dan privat.
            </p>
          </div>

          <div className="gate-auth-methods">
            <div className="gate-tab-buttons">
              <button
                className={`gate-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setGateError(''); }}
              >
                Sign In
              </button>
              <button
                className={`gate-tab-btn ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthMode('register'); setGateError(''); }}
              >
                Register New Account
              </button>
            </div>

            {gateError && (
              <div className="auth-error-banner">
                <span>⚠️ {gateError}</span>
              </div>
            )}

            <form onSubmit={handleGateEmailAuth} className="gate-form">
              {authMode === 'register' && (
                <div className="form-group">
                  <label>Full Name / Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Pratama"
                    value={gateName}
                    onChange={(e) => setGateName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={gateEmail}
                  onChange={(e) => setGateEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={gatePassword}
                  onChange={(e) => setGatePassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-gate-submit">
                {isSubmitting ? "Processing..." : authMode === 'register' ? "Buat Akun Sekarang" : "Masuk ke Aplikasi"}
              </button>
            </form>

            <div className="gate-divider">
              <span>atau</span>
            </div>

            <button onClick={handleGoogleSignIn} className="btn-gate-google">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              Masuk dengan Akun Google
            </button>

            <div className="gate-footer-hint">
              <button onClick={() => setIsGuest(true)} className="btn-preview-guest">
                👁️ Preview Workspace sebagai Tamu (Guest)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER 2: MAIN BUDGET WORKSPACE
  // --------------------------------------------------------------------------
  return (
    <div className="budget-page-container">
      {/* 1. AUTH & HEADER BAR */}
      <AuthBar 
        user={user} 
        onCustomUserLogin={handleCustomUserLogin}
      />

      {/* 2. APP TOP TOOLBAR */}
      <div className="budget-top-toolbar">
        <div className="currency-selector-group">
          <span className="toolbar-label">Select Display Currency:</span>
          <div className="currency-pills">
            {Object.keys(SUPPORTED_CURRENCIES).map((code) => {
              const info = SUPPORTED_CURRENCIES[code];
              const isActive = currency === code;
              return (
                <button
                  key={code}
                  onClick={() => handleCurrencyChange(code)}
                  className={`currency-pill-btn ${isActive ? 'active' : ''}`}
                >
                  <span className="curr-flag">{info.flag}</span>
                  <span className="curr-code">{info.code}</span>
                  <span className="curr-symbol">({info.symbol})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="toolbar-status-badge">
          <span className="badge-live-mode">
            🔒 Private Account Workspace ({user ? (user.displayName || user.email || 'User') : 'Guest Session'})
          </span>
        </div>
      </div>

      {/* 3. KPI FINANCIAL SUMMARY CARDS */}
      <div className="budget-kpi-grid">
        {/* Income Card */}
        <div className="kpi-card kpi-income">
          <div className="kpi-icon-wrap bg-emerald-light">
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Monthly Household Income</span>
            {isEditingIncome ? (
              <div className="income-edit-box">
                <input
                  type="number"
                  value={tempIncomeInput}
                  onChange={(e) => setTempIncomeInput(e.target.value)}
                  placeholder={`Amount in ${currency}`}
                  autoFocus
                />
                <button onClick={handleSaveIncome} className="btn-save-sm">Save</button>
                <button onClick={() => setIsEditingIncome(false)} className="btn-cancel-sm">✕</button>
              </div>
            ) : (
              <div className="kpi-value-row">
                <h3 className="kpi-value text-emerald">
                  {monthlyIncome > 0 ? formatCurrency(incomeInCurrentCurrency, currency) : `Set Income`}
                </h3>
                <button 
                  onClick={() => {
                    setTempIncomeInput(incomeInCurrentCurrency || '');
                    setIsEditingIncome(true);
                  }} 
                  className="btn-edit-income" 
                  title="Change Income"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
            <span className="kpi-subtext">Base monthly family take-home</span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="kpi-card kpi-expenses">
          <div className="kpi-icon-wrap bg-amber-light">
            <span className="kpi-icon">💸</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Monthly Expenses</span>
            <h3 className="kpi-value text-amber">
              {formatCurrency(totalExpenseInCurrentCurrency, currency)}
            </h3>
            <span className="kpi-subtext">{expenses.length} Household items & subscriptions</span>
          </div>
        </div>

        {/* Net Savings Card */}
        <div className="kpi-card kpi-savings">
          <div className="kpi-icon-wrap bg-blue-light">
            <span className="kpi-icon">🏦</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Net Monthly Savings</span>
            <h3 className={`kpi-value ${netSavings >= 0 ? 'text-blue' : 'text-red'}`}>
              {formatCurrency(netSavings, currency)}
            </h3>
            <span className="kpi-subtext">Savings Rate: <strong>{savingsRate}%</strong> of income</span>
          </div>
        </div>

        {/* Financial Health Score Card */}
        <div className="kpi-card kpi-health">
          <div className="kpi-icon-wrap bg-indigo-light">
            <span className="kpi-icon">🛡️</span>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Financial Health Score</span>
            <div className="health-score-row">
              <h3 className="kpi-value text-indigo">{healthScore}<span className="score-denom">/100</span></h3>
              <span className={`health-status-badge ${healthBadgeClass}`}>
                {healthLabel}
              </span>
            </div>
            <span className="kpi-subtext">Automated continuous risk assessment</span>
          </div>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE GRID */}
      <div className="budget-workspace-grid">
        {/* LEFT COLUMN: Wallos Expense Tracker & Clickable Budget Meters */}
        <div className="workspace-main-col">
          <ExpenseTracker
            expenses={expenses}
            currency={currency}
            categories={Object.keys(categoryBudgets)}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />

          <BudgetMeters
            expenses={expenses}
            categoryBudgets={categoryBudgets}
            categorySpentOverrides={categorySpentOverrides}
            categoryNotes={categoryNotes}
            currency={currency}
            monthlyIncome={incomeInCurrentCurrency}
            onUpdateCategoryBudget={handleUpdateCategoryBudget}
            onUpdateCategorySpent={handleUpdateCategorySpent}
            onUpdateCategoryNotes={handleUpdateCategoryNotes}
            onDeleteCategory={handleDeleteCategory}
            onAddCustomCategory={handleAddCustomCategory}
            onAutoSyncTargets={handleAutoSyncTargets}
          />
        </div>

        {/* RIGHT COLUMN: Gemini AI Financial Advisor */}
        <div className="workspace-side-col">
          <AIAdvisorWidget
            expenses={expenses}
            income={incomeInCurrentCurrency}
            currency={currency}
          />
        </div>
      </div>
    </div>
  );
}
