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

const [, , articleId, searchTerm] = process.argv;

async function run() {
  const snap = await getDoc(doc(db, "articles", articleId));
  const data = snap.data();
  const content = data.content || "";
  const idx = content.indexOf(searchTerm);
  if (idx === -1) {
    console.log("NOT FOUND.");
    return;
  }
  const snippet = content.slice(Math.max(0, idx - 60), idx + searchTerm.length + 900);
  console.log(JSON.stringify(snippet));
}
run().catch(console.error);
