/**
 * Clear Redundant Draft Fields (Firestore)
 * ------------------------------------------------------------------
 * For every article that still has a `content_draft` field, this
 * clears all `*_draft` fields and `rewrite_pending_review` /
 * `rewritten_at`, EXCEPT for `art-mqv14gcr-cdhwh` which was already
 * published and cleared by scripts/publish-single-draft.js.
 *
 * Rationale: after review, all remaining drafts were confirmed to be
 * identical to (or, for 5 articles, now intentionally mirrored with)
 * the live `content`/`title`/`excerpt` fields. Leaving stale draft
 * fields around would confuse future audits into thinking there is
 * unreviewed pending work. This does NOT change any live-facing
 * field (title/excerpt/content) - it only removes the leftover draft
 * scaffolding fields.
 *
 * SAFETY: Defaults to DRY RUN. Pass --write to apply to Firestore.
 *
 * Usage:
 *   node scripts/clear-redundant-drafts.js            (dry run)
 *   node scripts/clear-redundant-drafts.js --write     (applies)
 */
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, updateDoc, deleteField } = require("firebase/firestore");

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

const ALREADY_HANDLED = new Set(["art-mqv14gcr-cdhwh"]); // published separately

const DRAFT_FIELDS = [
  "title_draft", "excerpt_draft", "content_draft", "category_draft",
  "author_draft", "image_draft", "tags_draft", "isBreaking_draft",
  "isLive_draft", "sourcing_notes_draft", "expansion_ratio_draft",
  "rewrite_pending_review", "rewritten_at"
];

const isWriteMode = process.argv.includes("--write");

async function run() {
  console.log(`=== CLEAR REDUNDANT DRAFT FIELDS (${isWriteMode ? "WRITE MODE" : "DRY RUN"}) ===\n`);
  const snap = await getDocs(collection(db, "articles"));
  const targets = [];
  snap.forEach(d => {
    const a = { id: d.id, ...d.data() };
    if (a.content_draft && !ALREADY_HANDLED.has(a.id)) targets.push(a);
  });

  console.log(`Found ${targets.length} articles with a content_draft to clear.\n`);

  for (const a of targets) {
    console.log(`- ${a.id} ("${a.title}")`);
    if (isWriteMode) {
      const clearOps = {};
      DRAFT_FIELDS.forEach(f => { clearOps[f] = deleteField(); });
      await updateDoc(doc(db, "articles", a.id), clearOps);
      console.log(`  -> cleared draft fields.`);
    }
  }

  console.log(`\n=== DONE ===`);
  if (!isWriteMode) {
    console.log("DRY RUN only. Re-run with --write to apply.");
  }
}

run().catch(err => { console.error("FAILED:", err); process.exit(1); });
