const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, updateDoc, getDoc } = require("firebase/firestore");

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

// Parser function to extract CMS fields from Gemini output
function parseCMSFields(responseText) {
  const result = {
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    imageUrl: "",
    tags: [],
    breaking: false,
    live: false,
    sourcingNotes: "",
    expansionRatio: ""
  };
  
  // Split response by "---" to separate Sourcing Notes
  const parts = responseText.split(/---/);
  const mainPart = parts[0];
  const notesPart = parts.slice(1).join("---");
  
  // Parse main part fields
  const lines = mainPart.split("\n");
  let currentField = null;
  let contentAccumulator = [];
  
  for (const line of lines) {
    const titleMatch = line.match(/^Title:\s*(.*)/i);
    const excerptMatch = line.match(/^Excerpt:\s*(.*)/i);
    const contentMatch = line.match(/^Content:\s*(.*)/i);
    const categoryMatch = line.match(/^Category:\s*(.*)/i);
    const authorMatch = line.match(/^Author:\s*(.*)/i);
    const imageMatch = line.match(/^Image URL:\s*(.*)/i);
    const tagsMatch = line.match(/^Tags:\s*(.*)/i);
    const breakingMatch = line.match(/^Breaking News:\s*(.*)/i);
    const liveMatch = line.match(/^Live Updates:\s*(.*)/i);
    
    if (titleMatch) {
      result.title = titleMatch[1].trim();
      currentField = "title";
    } else if (excerptMatch) {
      result.excerpt = excerptMatch[1].trim();
      currentField = "excerpt";
    } else if (contentMatch) {
      result.content = contentMatch[1].trim();
      currentField = "content";
    } else if (categoryMatch) {
      result.category = categoryMatch[1].trim();
      currentField = "category";
    } else if (authorMatch) {
      result.author = authorMatch[1].trim();
      currentField = "author";
    } else if (imageMatch) {
      result.imageUrl = imageMatch[1].trim();
      currentField = "imageUrl";
    } else if (tagsMatch) {
      const tagsStr = tagsMatch[1].trim();
      result.tags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);
      currentField = "tags";
    } else if (breakingMatch) {
      result.breaking = breakingMatch[1].trim().toLowerCase() === "true";
      currentField = "breaking";
    } else if (liveMatch) {
      result.live = liveMatch[1].trim().toLowerCase() === "true";
      currentField = "live";
    } else {
      if (currentField === "content") {
        contentAccumulator.push(line);
      } else if (currentField === "title" && result.title) {
        result.title += "\n" + line;
      } else if (currentField === "excerpt" && result.excerpt) {
        result.excerpt += "\n" + line;
      }
    }
  }
  
  if (contentAccumulator.length > 0) {
    result.content = contentAccumulator.join("\n").trim();
  }
  
  // Parse sourcing notes part
  if (notesPart) {
    result.sourcingNotes = notesPart.trim();
    const ratioMatch = notesPart.match(/expansion_source_ratio:\s*(.*)/i);
    if (ratioMatch) {
      result.expansionRatio = ratioMatch[1].trim();
    }
  }
  
  return result;
}

async function runRewrite() {
  console.log("=== STARTING FIRESTORE CONTENT REWRITE (FASE 2 - QUALITY SKILL) ===");
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("\nERROR: GEMINI_API_KEY environment variable is not set!");
    console.error("Please set it in your terminal before running this script:");
    console.error("PowerShell: $env:GEMINI_API_KEY=\"your-api-key\"");
    console.error("CMD: set GEMINI_API_KEY=your-api-key\n");
    process.exit(1);
  }
  
  console.log("Loading audit reports from collection 'content_audit_report'...");
  const auditSnapshot = await getDocs(collection(db, "content_audit_report"));
  const pendingReports = [];
  
  auditSnapshot.forEach((doc) => {
    const data = doc.data();
    // Filter candidates for rewrite: thin or template, and NOT requiring quote verification, and NOT reviewed yet
    if ((data.thin_flag === true || data.template_flag === true) && 
        data.needs_source_verification === false && 
        data.reviewed === false) {
      pendingReports.push({ id: doc.id, ...data });
    }
  });
  
  console.log(`Found ${pendingReports.length} pending candidates for rewrite.`);
  if (pendingReports.length === 0) {
    console.log("No articles need rewrites at this time. Exiting.");
    return;
  }
  
  // Process up to 10 articles per run
  const batchLimit = 10;
  const batch = pendingReports.slice(0, batchLimit);
  console.log(`Processing batch of ${batch.length} articles...`);
  
  for (const report of batch) {
    console.log(`\n----------------------------------------`);
    console.log(`[ID: ${report.id}] Fetching original article content...`);
    
    const articleDocRef = doc(db, "articles", report.id);
    const articleSnap = await getDoc(articleDocRef);
    
    if (!articleSnap.exists()) {
      console.warn(`WARNING: Original article ${report.id} not found in collection 'articles'. Skipping.`);
      continue;
    }
    
    const articleData = articleSnap.data();
    const title = articleData.title || "";
    const category = articleData.category || "";
    const content = articleData.content || "";
    const author = articleData.author || "NDNews Editorial Team";
    const image = articleData.image || "NEEDS IMAGE";
    const tags = articleData.tags || [];
    
    console.log(`Title: "${title}"`);
    console.log(`Flags: Thin=${report.thin_flag}, Template=${report.template_flag}, Generic=${report.generic_topic_flag}`);
    
    const prompt = `You are a senior editorial journalist at NDNews, an APAC-focused economy, finance, and sports publication — not a content generator producing SEO filler.

Your task is to rewrite the article below to resolve quality/AdSense issues using the following strict editorial guidelines:

1. FACTUAL DISCIPLINE:
- Attribute quotes/statistics to real named people/institutions ONLY if they are present in the source. Never invent named figures.
- Do not add fake statistics or hallucinated quotes.

2. ANTI-PADDING:
- If expanding thin content, add deep, professional analysis, regional context, and background. Do not pad with speculative or repeating phrases.

3. VOICE:
- Tone must be concrete, professional, human editorial (avoid stock AI phrases like "in the ever-evolving landscape", "it is important to note", "delve into").

4. STRUCTURE:
- Do not use a recurring template structure. Format this story on its own terms.
${report.template_flag ? "- REMOVE LEGACY HEADERS: Remove repeating sections like 'Why It Matters', 'Business Impact', 'APAC Impact', 'Expert Opinion', etc. Form the content into a natural narrative flow or custom sub-headers.\n" : ""}
${report.generic_topic_flag ? "- UNIQUE APAC/INDONESIA ANGLE: This topic is generic/oversaturated. You MUST inject a unique Asia-Pacific or Indonesian angle/context to make the article unique.\n" : ""}
${report.thin_flag ? "- EXPAND CONTENT: The current content is thin. Expand it so the final word count is at least 600 - 800 words.\n" : ""}

5. CMS OUTPUT FORMAT:
You MUST output the result in the following exact format and fields in this order:

Title: [Specific, non-clickbait title]
Excerpt: [1-2 sentences summarizing the news]
Content: [Clean Markdown content body]
Category: ${category}
Author: ${author}
Image URL: ${image}
Tags: ${tags.join(", ")}
Breaking News: ${articleData.isBreaking ? "true" : "false"}
Live Updates: ${articleData.isLive ? "true" : "false"}

---
SOURCING NOTES:
[List all primary sources/institutions confirmed in the text]
expansion_source_ratio: [Specify your honest estimate of what % of final factual claims trace directly to original content vs. general framing/transitions. Example: 95%]

ARTICLE TO REWRITE:
Title: ${title}
Category: ${category}
Content:
${content}`;

    console.log("Calling Gemini API (gemini-pro-latest) for rewrite...");
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errText}`);
      }
      
      const resJson = await response.json();
      if (!resJson.candidates || resJson.candidates.length === 0 || 
          !resJson.candidates[0].content || !resJson.candidates[0].content.parts || 
          resJson.candidates[0].content.parts.length === 0) {
        throw new Error("Invalid response format received from Gemini API");
      }
      
      const rawText = resJson.candidates[0].content.parts[0].text.trim();
      const parsed = parseCMSFields(rawText);
      const newWordCount = parsed.content.split(/\s+/).filter(Boolean).length;
      
      console.log(`Success! Parsed rewritten word count: ${newWordCount} words.`);
      console.log(`Expansion Ratio: ${parsed.expansionRatio || "N/A"}`);
      
      // Update original article document with structured drafts
      await updateDoc(articleDocRef, {
        title_draft: parsed.title,
        excerpt_draft: parsed.excerpt,
        content_draft: parsed.content,
        category_draft: parsed.category,
        author_draft: parsed.author,
        image_draft: parsed.imageUrl,
        tags_draft: parsed.tags,
        isBreaking_draft: parsed.breaking,
        isLive_draft: parsed.live,
        sourcing_notes_draft: parsed.sourcingNotes,
        expansion_ratio_draft: parsed.expansionRatio,
        rewrite_pending_review: true,
        rewritten_at: new Date()
      });
      
      // Update audit report status to reviewed
      const auditDocRef = doc(db, "content_audit_report", report.id);
      await updateDoc(auditDocRef, {
        reviewed: true,
        recommendation: "rewrite",
        rewritten_at: new Date()
      });
      
      console.log(`Firestore documents updated successfully for ${report.id}.`);
      
    } catch (e) {
      console.error(`ERROR: Failed to process rewrite for article ${report.id}:`, e.message);
    }
  }
  
  console.log("\n========================================");
  console.log("=== BATCH REWRITE COMPLETED ===");
  console.log("========================================\n");
}

runRewrite().catch(console.error);
