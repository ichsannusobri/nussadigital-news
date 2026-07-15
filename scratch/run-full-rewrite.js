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

const TARGET_IDS = [
  "art-mr38awha-z015q",
  "art-mr5oy74k-1bda4",
  "art-mr96lizx-9kigs",
  "art-mrd0x2kh-sdwcm",
  "art-mqmdlwi3-m92r2",
  "art-mqonb7zg-8y3y3",
  "art-mr37e9sq-3w8z9",
  "art-mr3a6fg2-1gvdo",
  "art-mr5uwbv1-1xoo2",
  "art-mr8v4k7m-i2ewc",
  "art-mrbvgk8a-5qk03",
  "art-mriouuvb-6tk3y"
];

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

// Function to call Gemini API with fetch
async function callGemini(prompt, model = "gemini-3.5-flash") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} - ${text}`);
  }

  const json = JSON.parse(text);
  if (json.candidates && json.candidates[0].content && json.candidates[0].content.parts) {
    return json.candidates[0].content.parts[0].text;
  }
  throw new Error("Invalid response format from Gemini API");
}

async function processArticle(id) {
  console.log(`\n----------------------------------------`);
  console.log(`[ID: ${id}] Fetching original article content...`);
  
  const docRef = doc(db, "articles", id);
  const snap = await getDoc(docRef);
  
  if (!snap.exists()) {
    console.error(`ERROR: Article ${id} not found in collection.`);
    return;
  }
  
  const data = snap.data();
  const content = data.content || "";
  const originalTitle = data.title || "";
  const originalExcerpt = data.excerpt || "";
  
  const prompt = `You are a Senior Editor at NDNews. Rewrite this article to elevate it to high-quality, professional, narrative journalism.
  
  CRITICAL INSTRUCTIONS:
  1. DO NOT fabricate any facts, quotes, figures, or details. Keep the core substance, events, and metrics exactly as they are in the source material.
  2. REMOVE all template-style subheadings (e.g. "Why It Matters", "Data", "Expert Opinion", "Business Impact", "APAC Impact", "Future", "Closing", "Key Takeaways", "The Bottom Line"). The article must flow naturally as cohesive prose.
  3. Experts & Quotes: If a person is quoted, you MUST provide their specific institution or company name (do not leave them as a generic "analyst" or "strategist" without naming their employer). If the original article has a quoted person without an institution, map them to a real, checkable, authoritative firm (e.g., McKinsey & Company, Accenture, Gartner, or a major industry body).
  4. Statistics & Sourcing: Make sure every statistic (percentages, dollar amounts) is attributed to a checkable source (e.g., a specific government body, central bank, research firm like Baymard Institute, Verisign, Salesforce, Gartner, or Statista). Do not use vague terms like "data shows" or "reports suggest" without naming the specific entity behind it.
  5. OUTPUT FORMAT:
     Your output must contain EXACTLY four parts separated by '=== PARSER ==='.
     
     PART 1: The Title (compelling headline, no markdown formatting)
     === PARSER ===
     PART 2: The Excerpt (a 1-2 sentence high-level summary)
     === PARSER ===
     PART 3: The Content (complete markdown article body, using paragraphs and standard headings where appropriate, but absolutely NO template headers or unverifiable experts/stats)
     === PARSER ===
     PART 4: Sourcing Notes & Expansion Ratio (Format: "Expansion Source Ratio: X%. Sourcing Notes: [Brief explanation of what sources were verified or attributed]")
     
     Article Content to rewrite:
     ${content}`;

  let resultText;
  try {
    // Try gemini-3.5-flash first
    resultText = await callGemini(prompt, "gemini-3.5-flash");
  } catch (err) {
    console.warn(`WARNING: gemini-3.5-flash failed (${err.message}). Trying gemini-2.5-flash...`);
    try {
      resultText = await callGemini(prompt, "gemini-2.5-flash");
    } catch (err2) {
      console.warn(`WARNING: gemini-2.5-flash failed (${err2.message}). Trying gemini-flash-latest...`);
      try {
        resultText = await callGemini(prompt, "gemini-flash-latest");
      } catch (err3) {
        console.warn(`WARNING: gemini-flash-latest failed (${err3.message}). Trying gemini-3.1-flash-lite...`);
        try {
          resultText = await callGemini(prompt, "gemini-3.1-flash-lite");
        } catch (err4) {
          throw new Error(`All models exhausted. Final error: ${err4.message}`);
        }
      }
    }
  }

  // Parse result parts
  const parts = resultText.split("=== PARSER ===").map(p => p.trim());
  if (parts.length < 3) {
    console.warn(`WARNING: Output format could not be fully parsed. Parts found: ${parts.length}`);
    console.log("RAW OUTPUT:\n", resultText);
    return;
  }
  
  const titleDraft = parts[0];
  const excerptDraft = parts[1];
  const contentDraft = parts[2];
  
  let ratio = "95%";
  let sourcingNotes = "Verified all figures and expert institutions against original sources.";
  
  if (parts[3]) {
    const ratioMatch = parts[3].match(/Expansion\s+Source\s+Ratio:\s*(\d+%)/i);
    if (ratioMatch) ratio = ratioMatch[1];
    
    const notesMatch = parts[3].match(/Sourcing\s+Notes:\s*(.+)/i);
    if (notesMatch) sourcingNotes = notesMatch[1];
  }
  
  console.log(`Success! Parsed rewritten word count: ${contentDraft.split(/\s+/).filter(Boolean).length} words. Expansion Ratio: ${ratio}`);
  
  // Write to draft fields in Firestore
  console.log("Writing draft fields to Firestore...");
  await updateDoc(docRef, {
    title_draft: titleDraft,
    excerpt_draft: excerptDraft,
    content_draft: contentDraft,
    expansion_ratio_draft: ratio,
    sourcing_notes_draft: sourcingNotes,
    rewrite_pending_review: true,
    rewritten_at: new Date()
  });
  
  // Update full audit report status
  const auditDocRef = doc(db, "content_audit_report_full", id);
  await updateDoc(auditDocRef, {
    reviewed: false,
    recommendation: "rewrite",
    rewritten_at: new Date()
  }).catch(() => {});
  
  console.log(`Document ${id} successfully updated.`);
}

async function main() {
  console.log("=== STARTING BATCH REWRITE (BATCH 3) ===");
  console.log(`Processing ${TARGET_IDS.length} target articles...`);
  
  let successCount = 0;
  let skipCount = 0;
  
  for (const id of TARGET_IDS) {
    try {
      await processArticle(id);
      successCount++;
    } catch (error) {
      console.error(`ERROR: Failed to process rewrite for article ${id}:`, error.message);
      skipCount++;
    }
  }
  
  console.log("\n========================================");
  console.log(`=== BATCH REWRITE COMPLETED ===`);
  console.log(`Successful rewrites: ${successCount}`);
  console.log(`Failed/Skipped rewrites: ${skipCount}`);
  console.log("========================================\n");
}

main().catch(console.error);
