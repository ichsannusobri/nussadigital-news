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

export const DEFAULT_SETTINGS = {
  currency: "IDR",
  monthlyIncome: 0,
  categoryBudgets: {
    Housing: 0,
    Groceries: 0,
    Utilities: 0,
    Subscriptions: 0,
    Insurance: 0,
    Transport: 0,
    Savings: 0
  }
};

export async function getUserExpenses(uid) {
  if (!uid || uid === "guest") {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('local_budget_expenses');
      if (saved !== null) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
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
    return [];
  }
}

export async function saveUserExpense(uid, expense) {
  if (!uid || uid === "guest") {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('local_budget_expenses');
      let list = saved ? JSON.parse(saved) : [];
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
  if (!uid || uid === "guest") {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('local_budget_expenses');
      let list = saved ? JSON.parse(saved) : [];
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
  if (!uid || uid === "guest") {
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
  if (!uid || uid === "guest") {
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
