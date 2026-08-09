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
import BudgetMeters from '../../components/budget/BudgetMeters';
import AIAdvisorWidget from '../../components/budget/AIAdvisorWidget';

export default function BudgetPage() {
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // App Data State
  const [currency, setCurrency] = useState('IDR');
  const [monthlyIncome, setMonthlyIncome] = useState(18000000);
  const [expenses, setExpenses] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState({});
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
      setUser(currentUser);
      if (!currentUser) {
        setIsDemo(true); // Default to demo mode if not logged in
      } else {
        setIsDemo(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
          setMonthlyIncome(userSet.monthlyIncome || 18000000);
          setCategoryBudgets(userSet.categoryBudgets || DEMO_SETTINGS.categoryBudgets);
        }
      } catch (e) {
        console.error("Error loading budget data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, isDemo]);

  // Handle Currency Change
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    const activeUid = isDemo || !user ? 'demo' : user.uid;
    saveUserSettings(activeUid, {
      currency: newCurrency,
      monthlyIncome,
      categoryBudgets
    }).catch(console.error);
  };

  // Handle Income Save
  const handleSaveIncome = async () => {
    const num = Number(tempIncomeInput);
    if (isNaN(num) || num < 0) return;

    // Convert from current currency baseline if needed
    const baselineIncomeIDR = convertCurrency(num, currency, 'IDR');
    setMonthlyIncome(baselineIncomeIDR);
    setIsEditingIncome(false);

    const activeUid = isDemo || !user ? 'demo' : user.uid;
    await saveUserSettings(activeUid, {
      currency,
      monthlyIncome: baselineIncomeIDR,
      categoryBudgets
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

  // Financial Calculations
  const incomeInCurrentCurrency = convertCurrency(monthlyIncome, 'IDR', currency);

  const totalExpenseInCurrentCurrency = expenses.reduce((acc, item) => {
    return acc + convertCurrency(item.amount, item.currency || 'IDR', currency);
  }, 0);

  const netSavings = incomeInCurrentCurrency - totalExpenseInCurrentCurrency;
  const savingsRate = incomeInCurrentCurrency > 0 
    ? Math.round((netSavings / incomeInCurrentCurrency) * 100) 
    : 0;

  // Financial Health Score
  let healthScore = 70;
  if (savingsRate >= 30) healthScore = 92;
  else if (savingsRate >= 20) healthScore = 85;
  else if (savingsRate >= 10) healthScore = 75;
  else if (savingsRate < 0) healthScore = 45;

  return (
    <div className="budget-page-container">
      {/* 1. AUTH & HEADER BAR */}
      <AuthBar 
        user={user} 
        isDemo={isDemo} 
        onToggleDemo={(val) => setIsDemo(val)} 
      />

      {/* 2. APP TOP TOOLBAR (Currency Switcher & Quick Stats) */}
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
            <span className="badge-live-mode">🔒 Isolated Private Cloud Data ({user?.email})</span>
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
            <span className="kpi-subtext">{expenses.length} Recurring bills & subscriptions</span>
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
              <span className={`health-status-badge ${healthScore >= 80 ? 'badge-excel' : 'badge-good'}`}>
                {healthScore >= 80 ? 'Excellent' : 'Healthy'}
              </span>
            </div>
            <span className="kpi-subtext">Automated risk assessment</span>
          </div>
        </div>
      </div>

      {/* 4. MAIN WORKSPACE GRID */}
      <div className="budget-workspace-grid">
        {/* LEFT COLUMN: Wallos Expense Tracker & Budget Progress Meters */}
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
            currency={currency}
            onUpdateBudgetLimit={(cat, limit) => {
              const updatedBudgets = { ...categoryBudgets, [cat]: limit };
              setCategoryBudgets(updatedBudgets);
              const activeUid = isDemo || !user ? 'demo' : user.uid;
              saveUserSettings(activeUid, { currency, monthlyIncome, categoryBudgets: updatedBudgets });
            }}
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
