/**
 * Full Firestore backup to a local JSON file (Spark plan has no managed export).
 *   node scripts/maintenance/backup-firestore.js --out=<folder OUTSIDE the repo>
 * Includes all collections and subcollections (budget_users = personal data:
 * keep the file in a restricted folder and delete it when retention ends).
 * Timestamps/GeoPoints/References are tagged so restore-firestore.js can rebuild them.
 */
const fs = require('fs');
const path = require('path');
const { admin, db } = require('./_admin');
const { Timestamp, GeoPoint, DocumentReference } = require('firebase-admin/firestore');

const out = (process.argv.find((a) => a.startsWith('--out=')) || '').slice(6);
if (!out) { console.error('Usage: --out=<folder>'); process.exit(1); }

function enc(v) {
  if (v instanceof Timestamp) return { __ts: v.toDate().toISOString() };
  if (v instanceof GeoPoint) return { __geo: [v.latitude, v.longitude] };
  if (v instanceof DocumentReference) return { __ref: v.path };
  if (Array.isArray(v)) return v.map(enc);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)]));
  return v;
}

async function dumpCollection(col, bag, counter) {
  const refs = await col.listDocuments();
  for (const ref of refs) {
    const snap = await ref.get();
    if (snap.exists) { bag[ref.path] = enc(snap.data()); counter.n++; }
    for (const sub of await ref.listCollections()) await dumpCollection(sub, bag, counter);
  }
}

(async () => {
  const bag = {}; const counter = { n: 0 }; const perCol = {};
  for (const col of await db.listCollections()) {
    const before = counter.n;
    await dumpCollection(col, bag, counter);
    perCol[col.id] = counter.n - before;
  }
  fs.mkdirSync(out, { recursive: true });
  const file = path.join(out, `firestore-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(file, JSON.stringify({ project: admin.app().options.projectId, createdAt: new Date().toISOString(), docs: bag }));
  console.log('Documents per top-level collection (incl. subcollections):', perCol);
  console.log(`Total ${counter.n} docs -> ${file}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
