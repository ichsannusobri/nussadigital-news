/**
 * Dump a specific field of a specific article (Firestore, READ-ONLY).
 * Usage: node scripts/dump-article-field.js <articleId> <fieldName>
 */
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

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

const [, , articleId, fieldName] = process.argv;

async function run() {
  if (!articleId) {
    console.error("Usage: node scripts/dump-article-field.js <articleId> [fieldName]");
    process.exit(1);
  }
  const snap = await getDoc(doc(db, "articles", articleId));
  if (!snap.exists()) {
    console.error(`Article ${articleId} not found.`);
    process.exit(1);
  }
  const data = snap.data();
  if (fieldName) {
    console.log(data[fieldName]);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

run().catch(err => { console.error(err); process.exit(1); });
