const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs } = require("firebase/firestore");

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

async function main() {
  const targetId = "art-mrd0x2kh-sdwcm";
  console.log(`Checking article: ${targetId}...`);

  const docRef = doc(db, "articles", targetId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("SUCCESS: Article exists in Firestore!");
    console.log("Data:", JSON.stringify(docSnap.data(), null, 2));
  } else {
    console.log("ERROR: Article NOT found in Firestore!");
    
    console.log("\nFetching latest 10 articles in Firestore to check IDs...");
    const q = query(collection(db, "articles"), orderBy("date", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ID: "${doc.id}" | Title: "${data.title}" | Date: ${data.date} | Views: ${data.views || 0}`);
    });
  }
}

main().catch(console.error);
