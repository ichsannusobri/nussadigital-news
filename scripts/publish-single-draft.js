/**
 * Publish a single approved draft rewrite to the live fields.
 * Copies title_draft -> title, excerpt_draft -> excerpt,
 * content_draft -> content, then clears the draft fields and
 * rewrite_pending_review flag.
 *
 * SAFETY: Defaults to DRY RUN. Pass --write to apply to Firestore.
 *
 * Usage:
 *   node scripts/publish-single-draft.js <articleId>            (dry run)
 *   node scripts/publish-single-draft.js <articleId> --write    (applies)
 */
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, updateDoc, deleteField } = require("firebase/firestore");

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

const articleId = process.argv[2];
const isWriteMode = process.argv.includes("--write");

async function run() {
  if (!articleId) {
    console.error("Usage: node scripts/publish-single-draft.js <articleId> [--write]");
    process.exit(1);
  }

  const docRef = doc(db, "articles", articleId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    console.error(`Article ${articleId} not found.`);
    process.exit(1);
  }
  const data = snap.data();

  console.log(`=== PUBLISH DRAFT (${isWriteMode ? "WRITE MODE" : "DRY RUN"}) : ${articleId} ===\n`);
  console.log(`TITLE:   "${data.title}"  ->  "${data.title_draft || data.title}"`);
  console.log(`EXCERPT: "${data.excerpt}"  ->  "${data.excerpt_draft || data.excerpt}"`);
  console.log(`CONTENT WORD COUNT: ${(data.content||"").split(/\s+/).length} -> ${(data.content_draft||data.content||"").split(/\s+/).length}`);

  const updates = {
    title: data.title_draft || data.title,
    excerpt: data.excerpt_draft || data.excerpt,
    content: data.content_draft || data.content,
    updatedAt: new Date().toISOString(),
    title_draft: deleteField(),
    excerpt_draft: deleteField(),
    content_draft: deleteField(),
    category_draft: deleteField(),
    author_draft: deleteField(),
    image_draft: deleteField(),
    tags_draft: deleteField(),
    isBreaking_draft: deleteField(),
    isLive_draft: deleteField(),
    sourcing_notes_draft: deleteField(),
    expansion_ratio_draft: deleteField(),
    rewrite_pending_review: deleteField(),
    rewritten_at: deleteField()
  };

  if (isWriteMode) {
    await updateDoc(docRef, updates);
    console.log(`\n-> WRITTEN to Firestore. Draft fields cleared, live fields updated.`);
  } else {
    console.log(`\n-> (dry run) Not written. Re-run with --write to apply.`);
  }
}

run().catch(err => { console.error("FAILED:", err); process.exit(1); });
