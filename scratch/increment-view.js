const { initializeApp } = require("firebase/app");
const { getFirestore, doc, updateDoc, increment, getDoc } = require("firebase/firestore");

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
  console.log(`Incrementing views for: ${targetId}...`);

  const docRef = doc(db, "articles", targetId);
  
  // Get before views
  let docSnap = await getDoc(docRef);
  console.log("Views before increment:", docSnap.data().views);

  // Increment
  await updateDoc(docRef, {
    views: increment(1)
  });
  console.log("Increment call completed.");

  // Get after views
  docSnap = await getDoc(docRef);
  console.log("Views after increment:", docSnap.data().views);
}

main().catch(console.error);
