/**
 * Parser Artifact Scanner (Firestore, READ-ONLY)
 * ------------------------------------------------------------------
 * Scans every document in the `articles` collection for leftover
 * AI-prompt/parser artifacts that leaked into live fields — e.g.
 * titles literally starting with "PART 1:", or raw parser delimiters
 * like "=== PARSER ===" ending up in content/excerpt.
 *
 * This is a READ-ONLY diagnostic script. It does NOT write anything
 * to Firestore. It only prints a report to the console and writes a
 * CSV to scripts/output/parser_artifacts_report.csv.
 *
 * Usage:
 *   node scripts/scan-parser-artifacts.js
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

// Patterns that indicate a leaked prompt/parser artifact.
const ARTIFACT_PATTERNS = [
  { name: "PART_N_PREFIX", regex: /^\s*PART\s*\d+\s*:/i },
  { name: "PART_N_INLINE", regex: /\bPART\s*\d+\s*:/i },
  { name: "PARSER_DELIMITER", regex: /===\s*PARSER\s*===/i },
  { name: "TITLE_LABEL_LEAK", regex: /^\s*Title\s*:/i },
  { name: "EXCERPT_LABEL_LEAK", regex: /^\s*Excerpt\s*:/i },
  { name: "CONTENT_LABEL_LEAK", regex: /^\s*Content\s*:/i },
  { name: "SOURCING_NOTES_LEAK", regex: /SOURCING\s+NOTES/i },
  { name: "NEEDS_SOURCE_TAG", regex: /\[NEEDS\s+SOURCE/i },
  { name: "LOW_DIFFERENTIATION_TAG", regex: /\[LOW\s+DIFFERENTIATION/i },
  { name: "NEEDS_IMAGE_TAG", regex: /NEEDS\s+IMAGE/i },
  { name: "MARKDOWN_BOLD_HEADER_LEAK", regex: /^\*\*[A-Z][^*]+\*\*\s*$/m },
];

const FIELDS_TO_SCAN = ["title", "excerpt", "content", "title_draft", "excerpt_draft", "content_draft"];

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
  console.log("=== SCANNING FOR LEAKED AI/PARSER ARTIFACTS (read-only) ===");
  const snapshot = await getDocs(collection(db, "articles"));
  const articles = [];
  snapshot.forEach(d => articles.push({ id: d.id, ...d.data() }));
  console.log(`Fetched ${articles.length} articles.\n`);

  const findings = [];

  for (const a of articles) {
    const hits = [];
    for (const field of FIELDS_TO_SCAN) {
      const value = a[field];
      if (typeof value !== "string" || !value) continue;
      for (const pattern of ARTIFACT_PATTERNS) {
        if (pattern.regex.test(value)) {
          const match = value.match(pattern.regex);
          const snippet = match ? value.substring(Math.max(0, match.index - 20), match.index + match[0].length + 40) : value.substring(0, 60);
          hits.push({ field, pattern: pattern.name, snippet: snippet.replace(/\n/g, " \\n ") });
        }
      }
    }
    if (hits.length > 0) {
      findings.push({
        id: a.id,
        title: a.title,
        category: a.category,
        isLive: !!(a.title || ""),
        hasDraft: !!a.content_draft,
        hits
      });
    }
  }

  console.log(`\n=== FOUND ${findings.length} ARTICLES WITH LEAKED ARTIFACTS ===\n`);
  for (const f of findings) {
    console.log(`- [${f.id}] "${f.title}"`);
    for (const h of f.hits) {
      console.log(`    field=${h.field} pattern=${h.pattern} snippet="${h.snippet}"`);
    }
  }

  // Separate: artifacts in LIVE fields (title/excerpt/content) vs only in *_draft fields.
  const liveIssues = findings.filter(f => f.hits.some(h => !h.field.endsWith("_draft")));
  const draftOnlyIssues = findings.filter(f => f.hits.every(h => h.field.endsWith("_draft")));

  console.log(`\n--- Severity breakdown ---`);
  console.log(`Articles with artifacts in LIVE fields (title/excerpt/content) — publicly visible right now: ${liveIssues.length}`);
  liveIssues.forEach(f => console.log(`  * ${f.id} - "${f.title}"`));
  console.log(`Articles with artifacts ONLY in *_draft fields (not yet published, lower urgency): ${draftOnlyIssues.length}`);
  draftOnlyIssues.forEach(f => console.log(`  * ${f.id}`));

  // CSV export
  const outDir = path.join(__dirname, "output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(outDir, "parser_artifacts_report.csv");
  const headers = "ID,Title,Category,Field,Pattern,Snippet,Severity\n";
  const rows = [];
  for (const f of findings) {
    for (const h of f.hits) {
      const severity = h.field.endsWith("_draft") ? "draft_only" : "LIVE";
      rows.push([f.id, f.title, f.category, h.field, h.pattern, h.snippet, severity].map(escapeCSV).join(","));
    }
  }
  fs.writeFileSync(csvPath, headers + rows.join("\n"), "utf8");
  console.log(`\nCSV report written to: ${csvPath}`);
  console.log("\n=== SCAN COMPLETE (no data was modified) ===");
}

scan().catch(err => {
  console.error("SCAN FAILED:", err);
  process.exit(1);
});
