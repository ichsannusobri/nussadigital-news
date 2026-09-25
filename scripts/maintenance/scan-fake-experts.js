/**
 * Fake-Expert-Mapping Scanner (Firestore, READ-ONLY)
 * ------------------------------------------------------------------
 * Scans `content` and `content_draft` of every article for sentences
 * that quote/attribute a claim to a named PERSON tied to a well-known
 * research/consulting/analyst institution (Gartner, Accenture,
 * McKinsey, Mercer, Bain, CFR, CASS, etc). These are exactly the
 * pattern flagged in prior rewrite "sourcing notes" as AI having
 * "mapped" or "assigned" a generic analyst to a real firm to fake
 * credibility - the person is very likely fabricated even though the
 * institution is real.
 *
 * This is READ-ONLY. It prints findings + writes a CSV so a human can
 * decide keep/cut per case (some quotes might reference genuinely
 * real, checkable people - e.g. a named PBOC/BOJ/RBA official, a sitting
 * head of state, or a company spokesperson explicitly disclosed as
 * such in the source). This script does NOT auto-delete anything.
 *
 * Usage:
 *   node scripts/scan-fake-experts.js
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

// Research/consulting/analyst-type institutions commonly used by the AI
// rewrite process to "launder" a fabricated analyst quote. This list is
// deliberately narrow (generic advisory/research firms) to avoid
// flagging real government bodies, central banks, or named public
// officials, which are a different (lower-risk) category.
const ADVISORY_INSTITUTIONS = [
  "Gartner", "Accenture", "McKinsey", "Mercer", "Bain & Company", "Bain",
  "Council on Foreign Relations", "CFR", "Chinese Academy of Social Sciences", "CASS",
  "Forrester", "Deloitte", "PwC", "KPMG", "EY", "Boston Consulting Group", "BCG",
  "Moody's Analytics", "Oxford Economics", "Capital Economics", "Gavekal Dragonomics"
];

// Sentence-splitting regex (simple, good enough for scanning).
function splitSentences(text) {
  return (text || "").replace(/\n+/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean);
}

// A person-name pattern: 2-3 capitalized words in a row, not at sentence start article words.
const PERSON_NAME_PATTERN = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})\b/g;

const FIELDS_TO_SCAN = ["content", "content_draft"];

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

async function scan() {
  console.log("=== SCANNING FOR AI-MAPPED FAKE EXPERT ATTRIBUTIONS (read-only) ===\n");
  const snap = await getDocs(collection(db, "articles"));
  const articles = [];
  snap.forEach(d => articles.push({ id: d.id, ...d.data() }));
  console.log(`Fetched ${articles.length} articles.\n`);

  const findings = [];

  for (const a of articles) {
    for (const field of FIELDS_TO_SCAN) {
      const text = a[field];
      if (typeof text !== "string" || !text) continue;
      const sentences = splitSentences(text);
      for (const sentence of sentences) {
        const hasInstitution = ADVISORY_INSTITUTIONS.some(inst => sentence.includes(inst));
        if (!hasInstitution) continue;
        // Extract candidate person names from this sentence and the next context.
        const names = [...sentence.matchAll(PERSON_NAME_PATTERN)].map(m => m[1]);
        // Filter out the institution names themselves and common false positives.
        const candidateNames = names.filter(n =>
          !ADVISORY_INSTITUTIONS.some(inst => inst.includes(n) || n.includes(inst))
        );
        if (candidateNames.length > 0) {
          findings.push({
            id: a.id,
            title: a.title,
            field,
            institution: ADVISORY_INSTITUTIONS.find(inst => sentence.includes(inst)),
            candidateNames: [...new Set(candidateNames)].join(" | "),
            sentence: sentence.trim()
          });
        }
      }
    }
  }

  console.log(`=== FOUND ${findings.length} SENTENCES WITH PERSON+ADVISORY-INSTITUTION PATTERN ===\n`);
  for (const f of findings) {
    console.log(`- [${f.id}] field=${f.field} institution=${f.institution}`);
    console.log(`    names: ${f.candidateNames}`);
    console.log(`    sentence: "${f.sentence}"`);
    console.log("");
  }

  const outDir = path.join(__dirname, "output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(outDir, "fake_experts_report.csv");
  const headers = "ID,Title,Field,Institution,CandidateNames,Sentence\n";
  const rows = findings.map(f => [f.id, f.title, f.field, f.institution, f.candidateNames, f.sentence].map(escapeCSV).join(","));
  fs.writeFileSync(csvPath, headers + rows.join("\n"), "utf8");
  console.log(`CSV report written to: ${csvPath}`);
  console.log("\n=== SCAN COMPLETE (no data was modified) ===");
  console.log("NOTE: Review each finding manually. Real named officials (central bank governors,");
  console.log("government ministers) quoted alongside these firms in a comparative sentence are");
  console.log("a different, lower-risk case than a generic 'analyst at Firm X' with no other trace.");
}

scan().catch(err => { console.error("SCAN FAILED:", err); process.exit(1); });
