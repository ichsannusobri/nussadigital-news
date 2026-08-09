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

async function main() {
  const ids = [
    "art-mqv14gcr-cdhwh", // 30% ratio
    "art-mr5oy74k-1bda4", // 229 words
    "art-mrioam46-40aq7", // manual
    "art-mrkpdt7a-iyths", // manual
    "art-mrkv6koq-oywyc"  // manual
  ];
  
  for (const id of ids) {
    console.log(`\n========================================`);
    console.log(`DOCUMENT ID: ${id}`);
    const snap = await getDoc(doc(db, "articles", id));
    if (snap.exists()) {
      const data = snap.data();
      console.log(`Title Draft: "${data.title_draft || 'N/A'}"`);
      console.log(`Word Count (Draft): ${data.content_draft ? data.content_draft.split(/\s+/).filter(Boolean).length : 0}`);
      console.log(`Expansion Ratio Draft: "${data.expansion_ratio_draft || 'N/A'}"`);
      console.log(`Sourcing Notes Draft: "${data.sourcing_notes_draft || 'N/A'}"`);
      console.log(`Content Draft Snippet (First 200 chars):\n${data.content_draft ? data.content_draft.substring(0, 200) + '...' : 'N/A'}`);
    } else {
      console.log("NOT FOUND");
    }
  }
}
main().catch(console.error);
