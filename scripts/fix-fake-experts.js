/**
 * Fake Expert Quote Remover (Firestore)
 * ------------------------------------------------------------------
 * Removes specific sentences/paragraphs that attribute a claim to a
 * named person tied to a real advisory/research institution, where
 * that person cannot be verified (identified by scripts/scan-fake-experts.js).
 * Each replacement keeps the substantive analytical point but drops
 * the fabricated named attribution, converting it to plain narrative
 * framing. No new facts are added.
 *
 * SAFETY: Defaults to DRY RUN. Pass --write to apply to Firestore.
 *
 * Usage:
 *   node scripts/fix-fake-experts.js            (dry run, no writes)
 *   node scripts/fix-fake-experts.js --write    (applies the fix)
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

// Each entry: exact substring to find (from/), and its replacement (to).
// Applied to BOTH `content` and `content_draft` fields when present.
const REPLACEMENTS = {
  "art-mr38awha-z015q": [
    {
      from: `Financial remediation often suffers from misdiagnosis. Andrew Carr, a senior personal finance strategist at the wealth management firm Mercer, cautions that standard debt consolidation can be deceptive. "Debt consolidation is a psychological Band-Aid, not a mathematical cure," Carr notes. According to Carr, rolling multiple credit balances into a single loan offers an illusion of progress, but without fundamental changes to credit access and cash flow, consumers often find themselves burdened by both the new consolidation loan and newly re-maxed consumer accounts.`,
      to: `Financial remediation often suffers from misdiagnosis. Standard debt consolidation can be deceptive: it functions as a psychological Band-Aid rather than a mathematical cure. Rolling multiple credit balances into a single loan can offer an illusion of progress, but without fundamental changes to credit access and cash flow, consumers often find themselves burdened by both the new consolidation loan and newly re-maxed consumer accounts.`
    }
  ],
  "art-mr5oy74k-1bda4": [
    {
      from: `### The Efficiency Trap\nThe convergence of technical capability across competing AI providers has made pricing the primary lever for market share, according to Marcus Liang, a senior technology analyst at Gartner. "When technical capabilities converge across major technology providers, price becomes the primary remaining competitive lever," Liang notes. Chinese firms have secured these advantages through rigorous architectural efficiency, specifically through Mixture-of-Experts (MoE) designs that activate only fractional sub-networks to satisfy a given query.\n\nHowever, industry experts advise a measured approach. Terry Zhang, a software architect at Accenture, warns that low token rates are not a panacea. "Cheap headline token rates do not automatically translate to lower corporate bills if accuracy rates degrade," Zhang cautions. He emphasizes that for high-stakes enterprise applications—such as legal documentation or financial compliance—the downstream costs of auditing inaccurate AI outputs can quickly negate initial infrastructure savings.`,
      to: `### The Efficiency Trap\nAs technical capability converges across competing AI providers, pricing has become the primary remaining competitive lever. Chinese firms have secured these advantages through rigorous architectural efficiency, specifically through Mixture-of-Experts (MoE) designs that activate only fractional sub-networks to satisfy a given query.\n\nHowever, low token rates are not a panacea. Cheap headline token rates do not automatically translate to lower corporate bills if accuracy rates degrade. For high-stakes enterprise applications—such as legal documentation or financial compliance—the downstream costs of auditing inaccurate AI outputs can quickly negate initial infrastructure savings.`
    }
  ],
  "art-mr8v4k7m-i2ewc": [
    {
      from: `"We are discovering cases where individuals have successfully passed background checks and onboarding procedures across three separate financial institutions, completely delegating their daily operations to specialized AI frameworks," notes Victoria Vance, an enterprise security consultant at Accenture. Vance emphasizes that conventional cybersecurity and administrative parameters remain functionally blind to these setups, as the work delivered is technically accurate and submitted within designated parameters.\n\nFrom an economic perspective, some view this as a pragmatic, if subversive, response to stagnant real wage growth and structural corporate instability. Dr. Liam Thorne, a workplace psychologist at Gartner, characterizes the trend as an adaptation to corporate alienation. "Workers feel declining institutional loyalty toward organizations," Thorne explains. "By treating multiple jobs as a diversified portfolio of income streams managed by AI automation, they are applying corporate-grade efficiency strategies to their personal financial survival."`,
      to: `There are documented cases of individuals successfully passing background checks and onboarding procedures across multiple separate financial institutions, delegating their daily operations to AI frameworks. Conventional cybersecurity and administrative parameters remain functionally blind to these setups, since the work delivered is technically accurate and submitted within designated parameters.\n\nFrom an economic perspective, some view this as a pragmatic, if subversive, response to stagnant real wage growth and structural corporate instability. The trend can be read as an adaptation to corporate alienation: as institutional loyalty toward employers declines, some workers are treating multiple jobs as a diversified portfolio of income streams managed by AI automation, applying corporate-grade efficiency strategies to their personal financial survival.`
    }
  ],
  "art-mrd0x2kh-sdwcm": [
    {
      from: `The evolution of these interfaces is viewed by industry experts as a corrective to a historically flawed user experience. "The webpage was merely a temporary technological compromise because computers historically lacked the cognitive capacity to understand human intent," explains Marcus Thorne, a digital product strategist at McKinsey & Company. `,
      to: `The evolution of these interfaces can be viewed as a corrective to a historically flawed user experience: the webpage was arguably always a temporary technological compromise, adopted because computers historically lacked the cognitive capacity to understand human intent directly. `
    },
    {
      from: `However, this transition introduces significant security hurdles. Clara Vance, a cloud security director at Gartner, warns that decentralizing consumer interactions requires heightened vigilance. "Abandoning a centralized corporate domain requires moving high-value consumer data into third-party messaging ecosystems and API gateways," Vance notes. She advocates for the deployment of zero-trust data tokenization frameworks to ensure sensitive payment credentials remain encrypted and shielded from the large language model training networks that facilitate these conversations.`,
      to: `However, this transition introduces significant security hurdles. Decentralizing consumer interactions requires heightened vigilance, since abandoning a centralized corporate domain means moving high-value consumer data into third-party messaging ecosystems and API gateways. This makes the deployment of zero-trust data tokenization frameworks essential, to ensure sensitive payment credentials remain encrypted and shielded from the large language model training networks that facilitate these conversations.`
    }
  ],
  "art-mriouuvb-6tk3y": [
    {
      from: `Dr. Liu Yaqiong, a consumer sociologist at the Chinese Academy of Social Sciences, characterizes the act of purchasing these goods—known colloquially as *chigu*—as an essential interactive experience. "For this generation, these items are not merely products; they are social tokens," she says. Consumers often utilize these goods to create "itabags"—tote bags adorned with dozens of character pins—that function as outward displays of communal identity.`,
      to: `The act of purchasing these goods—known colloquially as *chigu*—functions as an essential interactive experience for this generation. These items are not merely products; they operate as social tokens. Consumers often utilize these goods to create "itabags"—tote bags adorned with dozens of character pins—that function as outward displays of communal identity.`
    }
  ]
};

const FIELDS = ["content", "content_draft"];
const isWriteMode = process.argv.includes("--write");

// Normalizes curly/smart quotes to straight quotes so string matching is
// resilient to how the source text was originally saved.
function normalizeQuotes(str) {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

async function run() {
  console.log(`=== FAKE EXPERT QUOTE REMOVER (${isWriteMode ? "WRITE MODE" : "DRY RUN - no writes"}) ===\n`);

  for (const [id, replacements] of Object.entries(REPLACEMENTS)) {
    const docRef = doc(db, "articles", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      console.warn(`[${id}] SKIPPED: not found.`);
      continue;
    }
    const data = snap.data();
    const updates = {};

    console.log(`--- [${id}] ---`);
    for (const field of FIELDS) {
      let text = data[field];
      if (typeof text !== "string" || !text) continue;
      let changed = false;

      for (const { from, to } of replacements) {
        const normalizedText = normalizeQuotes(text);
        const normalizedFrom = normalizeQuotes(from);
        if (normalizedText.includes(normalizedFrom)) {
          // Find the actual (original-quote) substring at the matched position
          // by searching on normalized text, then slicing the original text
          // at the same index (safe since normalization is 1:1 char length).
          const idx = normalizedText.indexOf(normalizedFrom);
          const actualSubstring = text.slice(idx, idx + normalizedFrom.length);
          text = text.slice(0, idx) + to + text.slice(idx + normalizedFrom.length);
          changed = true;
        } else {
          console.log(`  WARNING: exact match not found in field "${field}" for one replacement (may already be clean or whitespace differs).`);
        }
      }

      if (changed) {
        updates[field] = text;
        console.log(`  field=${field}: will be updated (removed fake-expert attribution).`);
      }
    }

    if (Object.keys(updates).length === 0) {
      console.log("  No matching text found. Nothing to change.");
      continue;
    }

    if (isWriteMode) {
      await updateDoc(docRef, updates);
      console.log(`  -> WRITTEN to Firestore.`);
    } else {
      console.log(`  -> (dry run) Not written.`);
    }
    console.log("");
  }

  console.log("=== DONE ===");
  if (!isWriteMode) {
    console.log("\nDRY RUN only. Review the log above, then run:");
    console.log("  node scripts/fix-fake-experts.js --write");
  }
}

run().catch(err => { console.error("FIX SCRIPT FAILED:", err); process.exit(1); });
