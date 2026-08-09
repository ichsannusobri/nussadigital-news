/**
 * Content Quality Audit (Firestore, read-only against `articles`)
 * ------------------------------------------------------------------
 * Re-runs the AdSense "Low Value Content" audit described in
 * Antigravity_Firestore_Content_Audit_Brief.md against the CURRENT
 * state of the `articles` collection.
 *
 * This script:
 *  - Reads every document in `articles` (no writes to that collection).
 *  - Computes quality flags per article (thin content, legacy template
 *    headers, oversaturated/generic topic, unverifiable named experts,
 *    unsourced statistics, missing author identity).
 *  - Detects articles that already have a pending `content_draft`
 *    (Phase 2 rewrite already generated, waiting for human review).
 *  - Writes a fresh snapshot to the separate `content_audit_report`
 *    collection (does NOT touch the live `articles` content).
 *  - Exports a CSV to scripts/output/content_audit_report.csv.
 *
 * Usage:
 *   node scripts/audit-content.js
 */
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, setDoc } = require("firebase/firestore");
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

// ---------------------------------------------------------------------------
// Flag heuristics
// ---------------------------------------------------------------------------

const TEMPLATE_PATTERNS = [
  /why it matters/i, /business impact/i, /apac impact/i,
  /expert opinion/i, /future outlook/i, /the bottom line/i,
  /closing thoughts/i, /key takeaways/i
];

const OVERSATURATED_TOPICS = [
  'goat debate', 'messi vs ronaldo', 'how to start a blog', 'evergreen', 'making money online'
];

// Institution/organization keywords used to decide if a named person/entity
// is anchored to a checkable, real-world source.
const INSTITUTION_KEYWORDS = /(Institute|University|Bank|Corporation|Ministry|Company|Inc\.|Ltd\.?|Agency|Organization|Organisation|Fund|Group|Association|Commission|Department|Reuters|Bloomberg|CNBC|IMF|World Bank|ADB|WTO|Securities|Capital|Partners|Research|Analytics|Dragonomics)/i;

// Matches "Name said/according to/noted/told X" style attribution.
const ATTRIBUTION_PATTERN = /([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){0,3})\s+(?:said|noted|added|explained|told\s+\w+)|according to\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){0,4})/g;

// Matches numeric statistics: percentages and currency amounts.
const STATISTIC_PATTERN = /(\$\s?\d[\d,.]*\s?(?:billion|million|trillion|bn|m|k)?|\d[\d,.]*\s?%)/gi;

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

function getFirstSentence(text) {
  if (!text) return "";
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return "";
  const sentences = paragraphs[0].split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  return sentences[0] || "";
}

function getLastSentence(text) {
  if (!text) return "";
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return "";
  const sentences = paragraphs[paragraphs.length - 1].split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  return sentences[sentences.length - 1] || "";
}

function getTokens(sentence) {
  if (!sentence) return new Set();
  return new Set(sentence.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean));
}

function jaccardSimilarity(s1, s2) {
  const set1 = getTokens(s1);
  const set2 = getTokens(s2);
  if (set1.size === 0 || set2.size === 0) return 0;
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

/**
 * Extracts named attribution candidates and checks whether each is
 * anchored to a real, checkable institution within the same sentence.
 */
function analyzeAttributions(content) {
  const found = [];
  let match;
  const re = new RegExp(ATTRIBUTION_PATTERN);
  while ((match = re.exec(content)) !== null) {
    const name = (match[1] || match[2] || "").trim();
    if (!name) continue;
    // Look at a window around the match to decide if an institution is named.
    const windowStart = Math.max(0, match.index - 40);
    const windowEnd = Math.min(content.length, match.index + match[0].length + 80);
    const window = content.slice(windowStart, windowEnd);
    const hasInstitution = INSTITUTION_KEYWORDS.test(window);
    found.push({ name, hasInstitution });
  }
  return found;
}

function analyzeStatistics(content) {
  const stats = content.match(STATISTIC_PATTERN) || [];
  let unsourced = 0;
  stats.forEach(s => {
    const idx = content.indexOf(s);
    const windowStart = Math.max(0, idx - 120);
    const windowEnd = Math.min(content.length, idx + s.length + 40);
    const window = content.slice(windowStart, windowEnd);
    const hasSourceNearby = INSTITUTION_KEYWORDS.test(window) || /according to|reported by|data from|survey by/i.test(window);
    if (!hasSourceNearby) unsourced++;
  });
  return { count: stats.length, unsourced };
}

async function runAudit() {
  console.log("=== NDNEWS CONTENT QUALITY AUDIT (live Firestore read) ===");
  console.log("Fetching all articles from collection 'articles'...");

  const querySnapshot = await getDocs(collection(db, "articles"));
  const articles = [];
  querySnapshot.forEach((d) => articles.push({ id: d.id, ...d.data() }));
  console.log(`Fetched ${articles.length} articles.\n`);

  console.log("Analyzing each article...");
  const audited = articles.map(a => {
    const content = a.content || "";
    const title = a.title || "";
    const tags = a.tags || [];
    const author = a.author || "";
    const authorAvatar = a.authorAvatar || null;

    const word_count = content.trim().split(/\s+/).filter(Boolean).length;
    const thin_flag = word_count < 500;
    const template_flag = TEMPLATE_PATTERNS.some(p => p.test(content));
    const generic_topic_flag = OVERSATURATED_TOPICS.some(t =>
      title.toLowerCase().includes(t) || tags.some(tag => tag.toLowerCase().includes(t))
    );

    const attributions = analyzeAttributions(content);
    const unverifiable_experts = attributions.filter(x => !x.hasInstitution);
    const unverifiable_expert_flag = unverifiable_experts.length > 0;

    const statInfo = analyzeStatistics(content);
    const unsourced_statistic_flag = statInfo.unsourced > 0;

    const fake_author_flag = !author || author.trim().length < 3 || authorAvatar === null;

    const has_pending_draft = !!a.rewrite_pending_review || !!a.content_draft;

    const first_sentence = getFirstSentence(content);
    const last_sentence = getLastSentence(content);

    return {
      id: a.id,
      title,
      category: a.category || "Uncategorized",
      date: a.date || a.createdAt || "",
      word_count,
      thin_flag,
      template_flag,
      generic_topic_flag,
      unverifiable_experts,
      unverifiable_expert_flag,
      stat_count: statInfo.count,
      unsourced_stat_count: statInfo.unsourced,
      unsourced_statistic_flag,
      fake_author_flag,
      has_pending_draft,
      first_sentence,
      last_sentence,
      high_similarity_cluster: []
    };
  });

  console.log("Clustering structurally similar articles within the same category (Jaccard > 0.6)...");
  for (let i = 0; i < audited.length; i++) {
    for (let j = 0; j < audited.length; j++) {
      if (i === j) continue;
      const a = audited[i], b = audited[j];
      if (a.category !== b.category) continue;
      const simFirst = jaccardSimilarity(a.first_sentence, b.first_sentence);
      const simLast = jaccardSimilarity(a.last_sentence, b.last_sentence);
      if (simFirst > 0.6 || simLast > 0.6) {
        a.high_similarity_cluster.push(b.id);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Recommendation logic
  // -------------------------------------------------------------------------
  audited.forEach(r => {
    if (r.has_pending_draft) {
      r.recommendation = "review_pending_draft";
    } else if (r.thin_flag && (r.generic_topic_flag || r.high_similarity_cluster.length > 0)) {
      r.recommendation = "noindex_or_delete";
    } else if (r.unverifiable_expert_flag || r.unsourced_statistic_flag) {
      r.recommendation = "verify_sources_before_keep";
    } else if (r.thin_flag || r.template_flag || r.generic_topic_flag) {
      r.recommendation = "rewrite";
    } else {
      r.recommendation = "keep";
    }
  });

  // -------------------------------------------------------------------------
  // Write snapshot to a separate Firestore collection (does not touch
  // the live `articles` content).
  // -------------------------------------------------------------------------
  console.log("\nWriting audit snapshot to Firestore collection 'content_audit_report'...");
  let writeCount = 0;
  for (const r of audited) {
    await setDoc(doc(db, "content_audit_report", r.id), {
      id: r.id,
      title: r.title,
      category: r.category,
      word_count: r.word_count,
      thin_flag: r.thin_flag,
      template_flag: r.template_flag,
      generic_topic_flag: r.generic_topic_flag,
      unverifiable_expert_flag: r.unverifiable_expert_flag,
      unverifiable_experts: r.unverifiable_experts.map(e => `${e.name} (hasInstitution: ${e.hasInstitution})`),
      stat_count: r.stat_count,
      unsourced_stat_count: r.unsourced_stat_count,
      unsourced_statistic_flag: r.unsourced_statistic_flag,
      fake_author_flag: r.fake_author_flag,
      has_pending_draft: r.has_pending_draft,
      high_similarity_cluster: r.high_similarity_cluster,
      recommendation: r.recommendation,
      reviewed: false,
      audited_at: new Date()
    });
    writeCount++;
  }
  console.log(`Wrote ${writeCount} audit snapshots.`);

  // -------------------------------------------------------------------------
  // CSV export
  // -------------------------------------------------------------------------
  const outDir = path.join(__dirname, "output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(outDir, "content_audit_report.csv");

  const headers = [
    "ID", "Title", "Category", "Date", "Word Count", "Thin Flag", "Template Flag",
    "Generic Topic Flag", "Unverifiable Expert Flag", "Unverifiable Experts",
    "Stat Count", "Unsourced Stat Count", "Unsourced Statistic Flag",
    "Fake Author Flag", "Has Pending Draft", "Cluster Count", "Cluster IDs", "Recommendation"
  ].join(",") + "\n";

  const rows = audited.map(r => [
    r.id, r.title, r.category, r.date, r.word_count,
    r.thin_flag, r.template_flag, r.generic_topic_flag,
    r.unverifiable_expert_flag,
    r.unverifiable_experts.map(e => `${e.name}(${e.hasInstitution ? "OK" : "NO-SRC"})`).join(" | "),
    r.stat_count, r.unsourced_stat_count, r.unsourced_statistic_flag,
    r.fake_author_flag, r.has_pending_draft,
    r.high_similarity_cluster.length, r.high_similarity_cluster.join("|"),
    r.recommendation
  ].map(escapeCSV).join(",")).join("\n");

  fs.writeFileSync(csvPath, headers + rows, "utf8");
  console.log(`CSV report written to: ${csvPath}`);

  // -------------------------------------------------------------------------
  // Console summary
  // -------------------------------------------------------------------------
  const total = audited.length;
  const count = (pred) => audited.filter(pred).length;

  console.log("\n=== AUDIT SUMMARY ===");
  console.log(`Total articles audited: ${total}`);
  console.log(`- Thin content (<500 words):        ${count(r => r.thin_flag)}`);
  console.log(`- Legacy template headers:           ${count(r => r.template_flag)}`);
  console.log(`- Oversaturated/generic topic:        ${count(r => r.generic_topic_flag)}`);
  console.log(`- Unverifiable named experts:         ${count(r => r.unverifiable_expert_flag)}`);
  console.log(`- Unsourced statistics:               ${count(r => r.unsourced_statistic_flag)}`);
  console.log(`- Missing/fake author identity:       ${count(r => r.fake_author_flag)}`);
  console.log(`- Structurally similar to another:    ${count(r => r.high_similarity_cluster.length > 0)}`);
  console.log(`- Already has a pending draft rewrite: ${count(r => r.has_pending_draft)}`);
  console.log("\n--- Recommendations ---");
  console.log(`- keep:                     ${count(r => r.recommendation === "keep")}`);
  console.log(`- rewrite:                  ${count(r => r.recommendation === "rewrite")}`);
  console.log(`- verify_sources_before_keep: ${count(r => r.recommendation === "verify_sources_before_keep")}`);
  console.log(`- noindex_or_delete:        ${count(r => r.recommendation === "noindex_or_delete")}`);
  console.log(`- review_pending_draft:     ${count(r => r.recommendation === "review_pending_draft")}`);
  console.log("=====================\n");
}

runAudit().catch(err => {
  console.error("AUDIT FAILED:", err);
  process.exit(1);
});
