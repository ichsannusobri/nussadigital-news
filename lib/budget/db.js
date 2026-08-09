import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";

// INITIAL HOUSEHOLD EXPENSES SEED (User can edit or delete any item)
export const INITIAL_EXPENSES = [
  {
    id: "exp-1",
    name: "Home Rent / Mortgage",
    category: "Housing",
    amount: 5000000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-25",
    paymentMethod: "Bank Transfer",
    status: "Upcoming",
    notes: "Primary family residence"
  },
  {
    id: "exp-2",
    name: "PLN Electricity & Water",
    category: "Utilities",
    amount: 1200000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-20",
    paymentMethod: "Autopay",
    status: "Upcoming",
    notes: "Token PLN & PDAM"
  },
  {
    id: "exp-3",
    name: "IndiHome 100Mbps Broadband",
    category: "Utilities",
    amount: 450000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-15",
    paymentMethod: "Credit Card",
    status: "Paid",
    notes: "High speed home wifi"
  },
  {
    id: "exp-4",
    name: "Weekly Family Groceries",
    category: "Groceries",
    amount: 3500000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-30",
    paymentMethod: "Debit Card",
    status: "Upcoming",
    notes: "Fresh produce & supermarket"
  },
  {
    id: "exp-5",
    name: "Netflix Premium 4K",
    category: "Subscriptions",
    amount: 186000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-18",
    paymentMethod: "Credit Card",
    status: "Upcoming",
    notes: "Family 4-screen plan"
  },
  {
    id: "exp-6",
    name: "Spotify Family",
    category: "Subscriptions",
    amount: 86000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-22",
    paymentMethod: "Apple Pay",
    status: "Upcoming",
    notes: "6 members plan"
  },
  {
    id: "exp-7",
    name: "Prudential Health Insurance",
    category: "Insurance",
    amount: 1500000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-10",
    paymentMethod: "Autopay",
    status: "Paid",
    notes: "Medical protection"
  }
];

export const DEFAULT_SETTINGS = {
  currency: "IDR",
  monthlyIncome: 18000000,
  categoryBudgets: {
    Housing: 5400000,
    Groceries: 3600000,
    Utilities: 1800000,
    Subscriptions: 900000,
    Insurance: 1800000,
    Transport: 1800000,
    Savings: 2700000
  }
};

export async function getUserExpenses(uid) {
  if (!uid || uid === "guest" || uid === "demo") {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('local_budget_expenses');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_EXPENSES;
  }

  try {
    const colRef = collection(db, "budget_users", uid, "expenses");
    const snap = await getDocs(query(colRef, orderBy("dueDate", "asc")));
    const list = [];
    snap.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (e) {
    console.error("Error fetching user expenses:", e);
    return INITIAL_EXPENSES;
  }
}

export async function saveUserExpense(uid, expense) {
  if (!uid || uid === "guest" || uid === "demo") {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('local_budget_expenses');
      let list = saved ? JSON.parse(saved) : [...INITIAL_EXPENSES];
      const existingIdx = list.findIndex(e => e.id === expense.id);
      if (existingIdx >= 0) {
        list[existingIdx] = expense;
      } else {
        const newId = `exp-${Date.now()}`;
        expense.id = newId;
        list.push(expense);
      }
      localStorage.setItem('local_budget_expenses', JSON.stringify(list));
    }
    return expense;
  }

  try {
    const colRef = collection(db, "budget_users", uid, "expenses");
    if (expense.id && !expense.id.startsWith("exp-")) {
      const docRef = doc(db, "budget_users", uid, "expenses", expense.id);
      await updateDoc(docRef, expense);
      return expense;
    } else {
      const { id, ...data } = expense;
      const docRef = await addDoc(colRef, data);
      return { id: docRef.id, ...data };
    }
  } catch (e) {
    console.error("Error saving user expense:", e);
    throw e;
  }
}

export async function deleteUserExpense(uid, expenseId) {
  if (!uid || uid === "guest" || uid === "demo") {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('local_budget_expenses');
      let list = saved ? JSON.parse(saved) : [...INITIAL_EXPENSES];
      list = list.filter(e => e.id !== expenseId);
      localStorage.setItem('local_budget_expenses', JSON.stringify(list));
    }
    return true;
  }

  try {
    const docRef = doc(db, "budget_users", uid, "expenses", expenseId);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error("Error deleting expense:", e);
    throw e;
  }
}

export async function getUserSettings(uid) {
  if (!uid || uid === "guest" || uid === "demo") {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('local_budget_settings');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_SETTINGS;
  }

  try {
    const docRef = doc(db, "budget_users", uid, "settings", "main");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return DEFAULT_SETTINGS;
  } catch (e) {
    console.error("Error fetching user settings:", e);
    return DEFAULT_SETTINGS;
  }
}

export async function saveUserSettings(uid, settings) {
  if (!uid || uid === "guest" || uid === "demo") {
    if (typeof window !== 'undefined') {
      localStorage.setItem('local_budget_settings', JSON.stringify(settings));
    }
    return settings;
  }

  try {
    const docRef = doc(db, "budget_users", uid, "settings", "main");
    await setDoc(docRef, settings, { merge: true });
    return settings;
  } catch (e) {
    console.error("Error saving user settings:", e);
    throw e;
  }
}
