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

// ENRICHED WALLOS-STYLE SAMPLE EXPENSES & SUBSCRIPTIONS FOR DEMO MODE
export const DEMO_EXPENSES = [
  {
    id: "demo-1",
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
    id: "demo-2",
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
    id: "demo-3",
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
    id: "demo-4",
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
    id: "demo-5",
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
    id: "demo-6",
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
    id: "demo-7",
    name: "YouTube Premium",
    category: "Subscriptions",
    amount: 99000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-12",
    paymentMethod: "Credit Card",
    status: "Paid",
    notes: "Ad-free & Music"
  },
  {
    id: "demo-8",
    name: "Google One 2TB",
    category: "Subscriptions",
    amount: 135000,
    currency: "IDR",
    cycle: "Monthly",
    dueDate: "2026-08-14",
    paymentMethod: "Credit Card",
    status: "Paid",
    notes: "Cloud storage for photos"
  },
  {
    id: "demo-9",
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

export const DEMO_SETTINGS = {
  currency: "IDR",
  monthlyIncome: 18000000,
  categoryBudgets: {
    Housing: 6000000,
    Groceries: 4000000,
    Utilities: 2000000,
    Subscriptions: 1000000,
    Insurance: 2000000,
    Transport: 1500000,
    Savings: 2000000
  }
};

export async function getUserExpenses(uid) {
  if (!uid || uid === "demo") return DEMO_EXPENSES;
  try {
    const colRef = collection(db, "budget_users", uid, "expenses");
    const snap = await getDocs(query(colRef, orderBy("dueDate", "asc")));
    const list = [];
    snap.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list.length > 0 ? list : DEMO_EXPENSES;
  } catch (e) {
    console.error("Error fetching user expenses:", e);
    return DEMO_EXPENSES;
  }
}

export async function saveUserExpense(uid, expense) {
  if (!uid || uid === "demo") return expense;
  try {
    const colRef = collection(db, "budget_users", uid, "expenses");
    if (expense.id && !expense.id.startsWith("demo-")) {
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
  if (!uid || uid === "demo") return true;
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
  if (!uid || uid === "demo") return DEMO_SETTINGS;
  try {
    const docRef = doc(db, "budget_users", uid, "settings", "main");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return DEMO_SETTINGS;
  } catch (e) {
    console.error("Error fetching user settings:", e);
    return DEMO_SETTINGS;
  }
}

export async function saveUserSettings(uid, settings) {
  if (!uid || uid === "demo") return settings;
  try {
    const docRef = doc(db, "budget_users", uid, "settings", "main");
    await setDoc(docRef, settings, { merge: true });
    return settings;
  } catch (e) {
    console.error("Error saving user settings:", e);
    throw e;
  }
}
