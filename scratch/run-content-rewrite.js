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

async function runRewrite() {
  console.log("=== STARTING FIRESTORE CONTENT REWRITE (FASE 2) ===");
  
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
  
  // Batch size limit: up to 10 articles per run
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
    
    console.log(`Title: "${title}"`);
    console.log(`Flags: Thin=${report.thin_flag}, Template=${report.template_flag}, Generic=${report.generic_topic_flag}`);
    
    // Construct Prompt
    let promptRules = "";
    if (report.template_flag) {
      promptRules += `- REMOVE LEGACY TEMPLATE HEADERS: Remove generic sub-headers like 'Why It Matters', 'Business Impact', 'APAC Impact', 'Expert Opinion', 'Future Outlook', 'Closing', or 'The Bottom Line'. Instead, present this information as a smooth, naturally flowing narrative or use customized, descriptive headers.\n`;
    }
    if (report.generic_topic_flag) {
      promptRules += `- UNIQUE APAC/INDONESIA ANGLE: The topic of this article is generic/oversaturated. You MUST introduce a unique, specific Asia-Pacific (APAC) or Indonesian angle/context (such as local business impacts, regional market sentiment, or Indonesian implications) to make the content valuable and unique.\n`;
    }
    if (report.thin_flag) {
      promptRules += `- EXPAND CONTENT: The current content is thin. Expand it with professional, detailed analysis, regional context, and background details so the final word count is at least 600 - 800 words. Do NOT add hallucinated quotes or fake statistics.\n`;
    }
    
    const prompt = `You are a professional editorial assistant. Your task is to rewrite the following news article to improve its SEO quality and make it AdSense compliant.

Article Title: ${title}
Category: ${category}
Current Content:
${content}

REWRITE RULES:
${promptRules}
- FORMATTING: Output the rewritten article in clean Markdown format.
- STRICT CONSTRAINT: Output ONLY the updated article content. Do not include any greeting, intro, outro, explanations, or wrapper (like "Here is the rewritten article").`;

    console.log("Calling Gemini API for rewrite...");
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
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
      
      const newContent = resJson.candidates[0].content.parts[0].text.trim();
      const newWordCount = newContent.split(/\s+/).filter(Boolean).length;
      
      console.log(`Success! Rewritten word count: ${newWordCount} words.`);
      
      // Update original article in 'articles' collection with content_draft
      await updateDoc(articleDocRef, {
        content_draft: newContent,
        rewrite_pending_review: true,
        rewritten_at: new Date()
      });
      
      // Update audit report document status
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
