/**
 * Template Header Restructure: art-mrkpiq3g-z0mma
 * ------------------------------------------------------------------
 * Replaces the entire `content` (and `content_draft` if present) of
 * this single article with a manually restructured version that
 * removes the recurring template header skeleton (#### Why It Matters,
 * #### Data, #### Expert Opinion, #### Business Impact, #### APAC
 * Impact, #### Future, #### Closing) flagged by the content quality
 * audit. All facts, statistics, quotes, and the data table are kept
 * verbatim - only the structure/transitions were rewritten into
 * flowing narrative prose, per the site's own editorial skill
 * guideline (no recurring section skeleton).
 *
 * SAFETY: Defaults to DRY RUN. Pass --write to apply to Firestore.
 *
 * Usage:
 *   node scripts/fix-template-headers.js            (dry run)
 *   node scripts/fix-template-headers.js --write     (applies the fix)
 */
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

const ARTICLE_ID = "art-mrkpiq3g-z0mma";

const NEW_CONTENT = `In the precise, empirical arena of global macroeconomics, top-line numbers can frequently act as an effective veil for deep structural imbalances. On July 14, 2026, the General Administration of Customs in Beijing released a trade report that sent immediate shockwaves through global financial terminals: dollar-denominated exports surged by an astonishing 27 percent year-on-year in June, while imports climbed 36 percent to hit a five-year high. Driven by an insatiable global demand for the physical hardware required to power artificial intelligence data centers, China recorded a staggering $125.6 billion monthly trade surplus—the second largest in modern history. Yet, beneath this historic display of industrial power lies a dangerous macroeconomic paradox: an economy increasingly dependent on external technological cycles to mask a persistent, unresolved domestic contraction.

The exceptional scale of China's June trade data marks a major turning point in post-pandemic economic management. For over a year, international monetary bodies have raised alarms over the world's second-largest economy experiencing a two-speed growth trajectory. While the manufacturing sector operates at historic capacity levels, domestic retail spending, consumer confidence, and the real-estate landscape remain deeply depressed. By tying its economic stability directly to the global AI capital expenditure boom, Beijing has managed to sustain its official 4.5% to 5% GDP growth targets for the second quarter. However, this strategy introduces a significant long-term vulnerability: it leaves the country's economic baseline deeply exposed to any sudden cooling in international tech investments or an intensification of Western tariff frameworks.

The structural dominance of tech-driven industrial output is clearly mapped across the country's first-half trade balances. Data released by Vice Minister Wang Jun confirmed that total foreign trade crossed an unprecedented 25.47 trillion yuan ($3.75 trillion) in the first six months of the year.

\`\`\`
[The Asymmetric Trade Balance — H1 2026]
Commodity Segment                 H1 Value Realized     YoY Growth Rate   Strategic GDP Contribution
Computing Power Hardware / Parts  5.13 Trillion Yuan    +56.6%            6.9 Percentage Points
Mechanical & Electrical Products  9.36 Trillion Yuan    +20.1%            63.5% of Aggregate Exports
High-Tech Strategic Shipments     3.26 Trillion Yuan    +39.0%            Core Industrial Anchor
\`\`\`

This structural expansion is heavily concentrated within the advanced technology supply chain. Total H1 imports and exports of electronic components and computer parts reached 5.13 trillion yuan, powered by a massive global supply crunch for high-end semiconductors. According to forensic price indexing, the global rush to build out automated intelligence infrastructure has driven prices for select high-end processing components up by as much as 700 percent over the past year. This pricing surge has artificially inflated total trade values across the entire East Asian supply chain, turning a localized hardware boom into the primary engine keeping China's massive manufacturing sector humming.

Independent institutional economists warn that the current export surge is reaching an unsustainable level of concentration. "The ratio of annual exports to total manufacturing sales in China has climbed back up to 24 percent—the highest point since the country joined the World Trade Organization in 2001," notes a comprehensive research brief from Gavekal Dragonomics. They emphasize that while such an intense export reliance is routine for small, trade-dependent nations, for a $20 trillion economic giant, it represents a highly fragile structural model. "This explosive AI-led export rush is making the domestic economy deeply unbalanced," warns Wei Li, head of Multi-Asset Investments at BNP Paribas Securities (China). He notes that robust shipments in advanced hardware and electric vehicles remain entirely dependent on global demand stability and are highly vulnerable to sudden regulatory interventions or cross-border trade restrictions.

For global enterprise tech boards, international logistics providers, and supply chain risk managers, the record-breaking Chinese trade metrics confirm that the global AI hardware pipeline remains deeply rooted in Chinese industrial clusters. Despite multi-year corporate initiatives to diversify operations into alternative regional hubs via "China plus one" strategies, the sheer capacity of Chinese manufacturing ecosystems to rapidly scale the production of complex sub-assemblies, advanced bionic components, and computing parts remains completely unmatched. Corporate buyers must recognize that navigating this landscape requires balancing the immense cost efficiencies of Chinese electronic component integration against the rising operational risks of cross-border trade disruption and sudden national export controls.

The broader macroeconomic shockwaves of Beijing's trade data are rapidly restructuring financial flows across the wider Asia-Pacific region. The global AI infrastructure boom has transformed intra-regional trade into a high-velocity, interconnected pipeline, exemplified by South Korea's exports to China surging by an astonishing 92 percent in June—the fastest expansion rate recorded since 2010. However, this extreme concentration introduces systemic stock market volatility. The moment institutional investors question the long-term sustainability of global AI capital expenditures, the entire regional supply chain experiences immediate financial pressure, as demonstrated by South Korean chip giant SK Hynix suffering a record 15 percent single-day share price drop amid shifting global portfolio allocations.

Looking toward the final half of 2026, the primary factor that will dictate the durability of China's economic trajectory is the impending release of second-quarter GDP data. As the International Monetary Fund cautiously adjusts its annual growth forecast upward to 4.6 percent, Chinese policymakers face an intense structural dilemma. They can no longer rely on external technology booms to permanently offset domestic structural stagnation. If international demand for advanced computing hardware normalizes or if Western economies implement broader, more restrictive tariff networks before Beijing can successfully restore domestic consumer demand and stabilize its real-estate markets, the economy will face an abrupt adjustment.

Ultimately, China's record-breaking June trade metrics prove that specialized industrial capacity remains a powerful macroeconomic shield against localized domestic downturns. The global AI investment wave has provided Beijing's manufacturing sector with an immense, high-margin lifeline, turning international data center expansions into a primary stabilizer for the domestic economy. Yet, in the long-term discipline of statecraft, an economic engine that relies almost entirely on external demand is inherently vulnerable. For global investors and corporate leaders tracking this historic cycle, the strategic lesson is absolute: true structural resilience cannot be manufactured by riding the waves of an international technology boom—it is achieved only by building a balanced domestic economy capable of generating its own momentum from within.`;

const isWriteMode = process.argv.includes("--write");

async function run() {
  console.log(`=== TEMPLATE HEADER RESTRUCTURE (${isWriteMode ? "WRITE MODE" : "DRY RUN - no writes"}) ===\n`);
  const docRef = doc(db, "articles", ARTICLE_ID);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    console.error(`Article ${ARTICLE_ID} not found.`);
    process.exit(1);
  }
  const data = snap.data();

  const oldWordCount = (data.content || "").trim().split(/\s+/).filter(Boolean).length;
  const newWordCount = NEW_CONTENT.trim().split(/\s+/).filter(Boolean).length;
  console.log(`Old word count: ${oldWordCount}`);
  console.log(`New word count: ${newWordCount}`);
  console.log(`Headers removed: Why It Matters, Data, Expert Opinion, Business Impact, APAC Impact, Future, Closing`);
  console.log(`All facts, figures, quotes, and the data table preserved verbatim.\n`);

  const updates = { content: NEW_CONTENT };
  if (data.content_draft) {
    updates.content_draft = NEW_CONTENT;
    console.log("content_draft field also present - will be updated to match.");
  }

  if (isWriteMode) {
    await updateDoc(docRef, updates);
    console.log(`-> WRITTEN to Firestore.`);
  } else {
    console.log(`-> (dry run) Not written. Re-run with --write to apply.`);
    console.log(`\n--- NEW CONTENT PREVIEW (first 600 chars) ---`);
    console.log(NEW_CONTENT.slice(0, 600));
  }
}

run().catch(err => { console.error("FAILED:", err); process.exit(1); });
