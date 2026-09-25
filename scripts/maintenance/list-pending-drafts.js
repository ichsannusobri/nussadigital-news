/**
 * List Pending Draft Rewrites (Firestore, READ-ONLY)
 * ------------------------------------------------------------------
 * Lists every article that has a `content_draft` field pending review
 * (rewrite_pending_review === true or content_draft is non-empty),
 * along with word counts before/after and a content preview, so a
 * human can sanity-check before publishing to the live fields.
 *
 * Usage:
 *   node scripts/list-pending-drafts.js
 */
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

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

function wc(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

async function run() {
  const snap = await getDocs(collection(db, "articles"));
  const pending = [];
  snap.forEach(d => {
    const a = { id: d.id, ...d.data() };
    if (a.content_draft) pending.push(a);
  });

  console.log(`=== ${pending.length} ARTICLES WITH PENDING content_draft ===\n`);

  const outDir = path.join(__dirname, "output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "pending_drafts_preview.txt");
  let out = "";

  for (const a of pending) {
    const block = [
      `================================================================`,
      `ID: ${a.id}`,
      `LIVE TITLE:   ${a.title}`,
      `DRAFT TITLE:  ${a.title_draft || "(same)"}`,
      `LIVE EXCERPT: ${a.excerpt}`,
      `DRAFT EXCERPT:${a.excerpt_draft || "(same)"}`,
      `LIVE WORDS: ${wc(a.content)}   DRAFT WORDS: ${wc(a.content_draft)}`,
      `Sourcing notes: ${a.sourcing_notes_draft || "(none)"}`,
      `Expansion ratio: ${a.expansion_ratio_draft || "(none)"}`,
      `--- DRAFT CONTENT PREVIEW (first 500 chars) ---`,
      (a.content_draft || "").slice(0, 500),
      ``
    ].join("\n");
    out += block + "\n";
    console.log(`- ${a.id} | live=${wc(a.content)}w -> draft=${wc(a.content_draft)}w | "${a.title}"`);
  }

  fs.writeFileSync(outPath, out, "utf8");
  console.log(`\nFull preview written to: ${outPath}`);
}

run().catch(err => { console.error(err); process.exit(1); });
