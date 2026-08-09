/**
 * Parser Artifact Fixer (Firestore)
 * ------------------------------------------------------------------
 * Removes leaked "PART N: " prefixes from the `title`, `excerpt`,
 * `title_draft`, and `excerpt_draft` fields of specific articles in
 * the `articles` collection.
 *
 * SAFETY: Defaults to DRY RUN. It will only print a before/after
 * preview and will NOT write to Firestore unless you pass --write.
 *
 * Usage:
 *   node scripts/fix-parser-artifacts.js            (dry run, no writes)
 *   node scripts/fix-parser-artifacts.js --write    (applies the fix)
 */
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, updateDoc } = require("firebase/firestore");

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

// Target articles identified by scripts/scan-parser-artifacts.js
const TARGET_IDS = [
  "art-mr38awha-z015q",
  "art-mr5oy74k-1bda4"
];

const FIELDS_TO_CLEAN = ["title", "excerpt", "title_draft", "excerpt_draft"];

// Strips a leading "PART <number>: " (or "PART <number> - ") prefix.
function stripPartPrefix(value) {
  if (typeof value !== "string") return value;
  return value.replace(/^\s*PART\s*\d+\s*[:\-]\s*/i, "").trim();
}

const isWriteMode = process.argv.includes("--write");

async function run() {
  console.log(`=== PARSER ARTIFACT FIXER (${isWriteMode ? "WRITE MODE" : "DRY RUN - no writes"}) ===\n`);

  for (const id of TARGET_IDS) {
    const docRef = doc(db, "articles", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      console.warn(`[${id}] SKIPPED: document not found.`);
      continue;
    }

    const data = snap.data();
    const updates = {};
    let hasChanges = false;

    console.log(`--- [${id}] ---`);
    for (const field of FIELDS_TO_CLEAN) {
      const original = data[field];
      if (typeof original !== "string" || !original) continue;
      const cleaned = stripPartPrefix(original);
      if (cleaned !== original) {
        hasChanges = true;
        updates[field] = cleaned;
        console.log(`  ${field}:`);
        console.log(`    BEFORE: "${original}"`);
        console.log(`    AFTER:  "${cleaned}"`);
      }
    }

    if (!hasChanges) {
      console.log("  No changes needed.");
      continue;
    }

    if (isWriteMode) {
      await updateDoc(docRef, updates);
      console.log(`  -> WRITTEN to Firestore.`);
    } else {
      console.log(`  -> (dry run) Not written. Re-run with --write to apply.`);
    }
    console.log("");
  }

  console.log("=== DONE ===");
  if (!isWriteMode) {
    console.log("\nThis was a DRY RUN. No data was changed.");
    console.log("Review the BEFORE/AFTER preview above, then run:");
    console.log("  node scripts/fix-parser-artifacts.js --write");
  }
}

run().catch(err => {
  console.error("FIX SCRIPT FAILED:", err);
  process.exit(1);
});
