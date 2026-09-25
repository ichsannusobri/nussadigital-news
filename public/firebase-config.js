import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, addDoc, query, orderBy, limit, where, deleteDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPy-dbKz3I3jCV896qGtdBZEtWEVw6mgY",
  authDomain: "nussadigital-news-a332e.firebaseapp.com",
  projectId: "nussadigital-news-a332e",
  storageBucket: "nussadigital-news-a332e.firebasestorage.app",
  messagingSenderId: "20933999579",
  appId: "1:20933999579:web:8b6d67d825237d6b4145fe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.firebaseDB = db;
window.fsTools = { collection, getDocs, getDoc, doc, setDoc, addDoc, query, orderBy, limit, where, deleteDoc, updateDoc, increment };

// ---------------------------------------------------------------------------
// Admin gate: the dashboard only initialises after a Google sign-in whose
// ID token carries the custom claim { admin: true }. Firestore Rules enforce
// the same claim server-side, so this UI gate is convenience, not security.
// ---------------------------------------------------------------------------
const auth = getAuth(app);
window.fbAuth = auth;

function gate(html) {
  let el = document.getElementById("admin-gate");
  if (!el) {
    el = document.createElement("div");
    el.id = "admin-gate";
    el.style.cssText = "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#0f172a;color:#fff;font-family:Inter,system-ui,sans-serif;padding:16px";
    document.body.appendChild(el);
  }
  el.innerHTML = '<div style="max-width:380px;width:100%;background:#111827;border:1px solid #1f2937;border-radius:12px;padding:28px;text-align:center">' + html + "</div>";
  return el;
}

function showLogin(msg) {
  const el = gate('<h2 style="margin:0 0 8px">NDNews Creator Studio</h2><p style="color:#9ca3af;margin:0 0 20px">Masuk dengan akun admin.</p>' +
    (msg ? '<p style="color:#f87171;font-size:14px;margin:0 0 16px">' + msg + "</p>" : "") +
    '<button id="admin-login-btn" style="padding:12px 18px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer;width:100%">Sign in with Google</button>');
  el.querySelector("#admin-login-btn").onclick = () =>
    signInWithPopup(auth, new GoogleAuthProvider()).catch((e) => showLogin("Login gagal: " + (e.code || e.message)));
}

let started = false;
onAuthStateChanged(auth, async (user) => {
  if (!user) return showLogin();
  const token = await user.getIdTokenResult(true);
  if (token.claims.admin !== true) {
    await signOut(auth);
    return showLogin("Akun ini tidak memiliki akses admin.");
  }
  const el = document.getElementById("admin-gate");
  if (el) el.remove();
  if (!started) {
    started = true;
    window.dispatchEvent(new Event("firebase-ready"));
  }
});

window.adminSignOut = () => signOut(auth).then(() => location.reload());
