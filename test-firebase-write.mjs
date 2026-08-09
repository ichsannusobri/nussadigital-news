import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc } from "firebase/firestore";

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

async function testWrite() {
  try {
    console.log("Testing write access...");
    const docRef = await addDoc(collection(db, "test_collection"), { test: true });
    console.log("Write success! ID:", docRef.id);
    await deleteDoc(docRef);
    console.log("Delete success!");
    process.exit(0);
  } catch (e) {
    console.error("Write failed:", e.message);
    process.exit(1);
  }
}

testWrite();
