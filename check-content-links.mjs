import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function checkLinks() {
  const snapshot = await getDocs(collection(db, "articles"));
  let articlesWithLinks = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.content && (data.content.includes('<a ') || data.content.includes(']('))) {
      console.log(`Article ${doc.id} has links in content!`);
      articlesWithLinks++;
    }
  });
  console.log(`Found ${articlesWithLinks} articles with links in content.`);
  process.exit(0);
}

checkLinks();
