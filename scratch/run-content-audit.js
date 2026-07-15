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

// Token-based Jaccard similarity functions
function getTokens(sentence) {
  if (!sentence) return new Set();
  return new Set(
    sentence.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
  );
}

function jaccardSimilarity(s1, s2) {
  const set1 = getTokens(s1);
  const set2 = getTokens(s2);
  if (set1.size === 0 || set2.size === 0) return 0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// First/last sentence parsing logic
function getFirstSentence(text) {
  if (!text) return "";
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return "";
  const firstParagraph = paragraphs[0];
  const sentences = firstParagraph.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  return sentences.length > 0 ? sentences[0] : "";
}

function getLastSentence(text) {
  if (!text) return "";
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return "";
  const lastParagraph = paragraphs[paragraphs.length - 1];
  const sentences = lastParagraph.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  return sentences.length > 0 ? sentences[sentences.length - 1] : "";
}

// Escaping values for CSV
function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

async function runAudit() {
  console.log("=== STARTING FIRESTORE CONTENT AUDIT ===");
  console.log("Fetching all articles from collection 'articles'...");
  
  const querySnapshot = await getDocs(collection(db, "articles"));
  const articles = [];
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
  });
  
  console.log(`Fetched ${articles.length} articles.`);
  
  const templatePatterns = [
    /why it matters/i, /business impact/i, /apac impact/i,
    /expert opinion/i, /future outlook/i, /the bottom line/i,
    /closing thoughts/i, /key takeaways/i
  ];
  
  const oversaturatedTopics = [
    'goat debate', 'messi vs ronaldo', 'how to start a blog', 'evergreen', 'making money online'
  ];
  
  const attributionPattern = /(according to|said|noted|told (?:CNBC|Reuters|[A-Z][a-z]+)|[A-Z][a-z]+ (?:said|added|explained))/gi;

  console.log("Processing article analysis & flags...");
  
  // Extract sentences and intermediate flags
  const auditedList = articles.map(a => {
    const content = a.content || "";
    const title = a.title || "";
    const tags = a.tags || [];
    const author = a.author || "";
    const authorAvatar = a.authorAvatar || null;
    
    const word_count = content.split(/\s+/).filter(Boolean).length;
    const thin_flag = word_count < 500;
    
    const template_flag = templatePatterns.some(p => p.test(content));
    
    const first_sentence = getFirstSentence(content);
    const last_sentence = getLastSentence(content);
    
    const generic_topic_flag = oversaturatedTopics.some(t => 
      title.toLowerCase().includes(t) || 
      tags.some(tag => tag.toLowerCase().includes(t))
    );
    
    const quotes_found = content.match(attributionPattern) || [];
    const needs_source_verification = quotes_found.length > 0;
    
    const fake_author_flag = !author || author.trim().length < 3 || authorAvatar === null;
    
    return {
      id: a.id,
      title,
      category: a.category || "Uncategorized",
      word_count,
      thin_flag,
      template_flag,
      first_sentence,
      last_sentence,
      generic_topic_flag,
      quotes_found,
      needs_source_verification,
      fake_author_flag,
      high_similarity_cluster: []
    };
  });
  
  console.log("Performing structural similarity clustering Jaccard (> 0.6)...");
  
  // Similarity clustering within categories
  for (let i = 0; i < auditedList.length; i++) {
    const artA = auditedList[i];
    for (let j = 0; j < auditedList.length; j++) {
      if (i === j) continue;
      const artB = auditedList[j];
      
      // Compare only within same category
      if (artA.category === artB.category) {
        let isSimilar = false;
        
        // Jaccard similarity of opening sentences
        if (artA.first_sentence && artB.first_sentence) {
          const simFirst = jaccardSimilarity(artA.first_sentence, artB.first_sentence);
          if (simFirst > 0.6) isSimilar = true;
        }
        
        // Jaccard similarity of closing sentences
        if (artA.last_sentence && artB.last_sentence) {
          const simLast = jaccardSimilarity(artA.last_sentence, artB.last_sentence);
          if (simLast > 0.6) isSimilar = true;
        }
        
        if (isSimilar) {
          artA.high_similarity_cluster.push(artB.id);
        }
      }
    }
  }

  console.log("Writing reports to Firestore collection 'content_audit_report'...");
  
  // Write to Firestore reports
  let writeCount = 0;
  for (const report of auditedList) {
    const reportDocRef = doc(db, "content_audit_report", report.id);
    await setDoc(reportDocRef, {
      id: report.id,
      title: report.title,
      category: report.category,
      word_count: report.word_count,
      thin_flag: report.thin_flag,
      template_flag: report.template_flag,
      high_similarity_cluster: report.high_similarity_cluster,
      generic_topic_flag: report.generic_topic_flag,
      quotes_found: report.quotes_found,
      needs_source_verification: report.needs_source_verification,
      fake_author_flag: report.fake_author_flag,
      reviewed: false,
      recommendation: "",
      audited_at: new Date()
    });
    writeCount++;
  }
  
  console.log(`Successfully wrote ${writeCount} reports to Firestore.`);

  // Export to CSV
  console.log("Exporting audit data to scratch/content_audit_report.csv...");
  const scratchDir = __dirname;
  const csvPath = path.join(scratchDir, "content_audit_report.csv");
  const headers = "ID,Title,Category,Word Count,Thin Flag,Template Flag,Oversaturated Topic Flag,Quotes Found Count,Needs Verification,Fake Author,Cluster Count,Cluster IDs\n";
  
  const csvRows = auditedList.map(r => {
    return [
      r.id,
      r.title,
      r.category,
      r.word_count,
      r.thin_flag ? "TRUE" : "FALSE",
      r.template_flag ? "TRUE" : "FALSE",
      r.generic_topic_flag ? "TRUE" : "FALSE",
      r.quotes_found.length,
      r.needs_source_verification ? "TRUE" : "FALSE",
      r.fake_author_flag ? "TRUE" : "FALSE",
      r.high_similarity_cluster.length,
      r.high_similarity_cluster.join("|")
    ].map(escapeCSV).join(",");
  }).join("\n");
  
  fs.writeFileSync(csvPath, headers + csvRows, "utf8");
  console.log(`CSV Report generated at: ${csvPath}`);
  
  // Console summary
  const totalArticles = auditedList.length;
  const thinCount = auditedList.filter(r => r.thin_flag).length;
  const templateCount = auditedList.filter(r => r.template_flag).length;
  const genericCount = auditedList.filter(r => r.generic_topic_flag).length;
  const verificationCount = auditedList.filter(r => r.needs_source_verification).length;
  const fakeAuthorCount = auditedList.filter(r => r.fake_author_flag).length;
  const clusteredCount = auditedList.filter(r => r.high_similarity_cluster.length > 0).length;
  
  console.log("\n=== AUDIT SUMMARY ===");
  console.log(`Total Articles Audited: ${totalArticles}`);
  console.log(`- Thin Content (< 500 words): ${thinCount} articles`);
  console.log(`- Legacy Template Headers: ${templateCount} articles`);
  console.log(`- Oversaturated Topics: ${genericCount} articles`);
  console.log(`- Requires Source Verification: ${verificationCount} articles`);
  console.log(`- Fake/Missing Author Identity: ${fakeAuthorCount} articles`);
  console.log(`- Structural Similarity Clustered: ${clusteredCount} articles`);
  console.log("=====================\n");
}

runAudit().catch(console.error);
