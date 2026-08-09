'use client';

import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { 
  getUserExpenses, 
  saveUserExpense, 
  deleteUserExpense, 
  getUserSettings, 
  saveUserSettings,
  DEMO_EXPENSES,
  DEMO_SETTINGS
} from '../../lib/budget/db';

import { 
  SUPPORTED_CURRENCIES, 
  formatCurrency, 
  convertCurrency 
} from '../../lib/budget/currencies';

import AuthBar from '../../components/budget/AuthBar';
import ExpenseTracker from '../../components/budget/ExpenseTracker';
import BudgetMeters, { STANDARD_CATEGORIES } from '../../components/budget/BudgetMeters';
import AIAdvisorWidget from '../../components/budget/AIAdvisorWidget';

// Ratios for auto-syncing budget targets to Monthly Income (50/30/20 household rule)
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
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // App Data State
  const [currency, setCurrency] = useState('IDR');
  const [monthlyIncome, setMonthlyIncome] = useState(18000000);
  const [expenses, setExpenses] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [categorySpentOverrides, setCategorySpentOverrides] = useState({});
  const [categoryNotes, setCategoryNotes] = useState({});

  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncomeInput, setTempIncomeInput] = useState('');

  // 1. Auth Listener
  useEffect(() => {
    if (!auth) {
      setIsDemo(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsDemo(false);
      } else if (!user) {
        setIsDemo(true); // Default to demo mode if no custom or google user
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Load Data based on User/Demo status
  useEffect(() => {
    async function loadData() {
      const activeUid = isDemo || !user ? 'demo' : user.uid;
      setLoading(true);

      try {
        const [userExp, userSet] = await Promise.all([
          getUserExpenses(activeUid),
          getUserSettings(activeUid)
        ]);

        setExpenses(userExp || DEMO_EXPENSES);
        if (userSet) {
          setCurrency(userSet.currency || 'IDR');
          const loadedIncome = userSet.monthlyIncome || 18000000;
          setMonthlyIncome(loadedIncome);

          let loadedBudgets = userSet.categoryBudgets || DEMO_SETTINGS.categoryBudgets;
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
  }, [user, isDemo]);

  // Custom Direct Email/Password User Handler
  const handleCustomUserLogin = (customUser) => {
    setUser(customUser);
    if (customUser) {
      setIsDemo(false);
    } else {
      setIsDemo(true);
    }
  };

  // Currency Change Handler
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    const activeUid = isDemo || !user ? 'demo' : user.uid;
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

    // Auto sync category targets to match new income
    const syncedBudgets = generateSyncedCategoryBudgets(baselineIncomeIDR);
    setCategoryBudgets(syncedBudgets);

    const activeUid = isDemo || !user ? 'demo' : user.uid;
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

    const activeUid = isDemo || !user ? 'demo' : user.uid;
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
    const activeUid = isDemo || !user ? 'demo' : user.uid;
    await saveUserExpense(activeUid, newExp);
  };

  const handleUpdateExpense = async (updatedExp) => {
    const updated = expenses.map(e => e.id === updatedExp.id ? updatedExp : e);
    setExpenses(updated);
    const activeUid = isDemo || !user ? 'demo' : user.uid;
    await saveUserExpense(activeUid, updatedExp);
  };

  const handleDeleteExpense = async (id) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    const activeUid = isDemo || !user ? 'demo' : user.uid;
    await deleteUserExpense(activeUid, id);
  };

  // Category Budget & Realized Spent Handlers
  const handleUpdateCategoryBudget = (cat, limitInIDR) => {
    const updatedBudgets = { ...categoryBudgets, [cat]: limitInIDR };
    setCategoryBudgets(updatedBudgets);
    const activeUid = isDemo || !user ? 'demo' : user.uid;
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
    const activeUid = isDemo || !user ? 'demo' : user.uid;
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
    const activeUid = isDemo || !user ? 'demo' : user.uid;
    saveUserSettings(activeUid, {
      currency,
      monthlyIncome,
      categoryBudgets,
      categorySpentOverrides,
      categoryNotes: updatedNotes
    }).catch(console.error);
  };

  const handleAddCustomCategory = (name, limitInIDR, notes) => {
    const updatedBudgets = { ...categoryBudgets, [name]: limitInIDR };
    const updatedNotes = { ...categoryNotes, [name]: notes };
    setCategoryBudgets(updatedBudgets);
    setCategoryNotes(updatedNotes);
    const activeUid = isDemo || !user ? 'demo' : user.uid;
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

  // Calculate Total Expenses: sum of actual category spent (overrides or item sums)
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

  return (
    <div className="budget-page-container">
      {/* 1. AUTH & HEADER BAR */}
      <AuthBar 
        user={user} 
        isDemo={isDemo} 
        onToggleDemo={(val) => setIsDemo(val)} 
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
          {isDemo ? (
            <span className="badge-demo-mode">🎮 Demo Mode (Sample Household Data)</span>
          ) : (
            <span className="badge-live-mode">🔒 Isolated Account ({user?.displayName || user?.email || 'User'})</span>
          )}
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
                  {formatCurrency(incomeInCurrentCurrency, currency)}
                </h3>
                <button 
                  onClick={() => {
                    setTempIncomeInput(incomeInCurrentCurrency);
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
