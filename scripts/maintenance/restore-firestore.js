/**
 * Restore documents from a backup made by backup-firestore.js.
 *   node scripts/maintenance/restore-firestore.js --file=<backup.json> [--prefix=articles/] [--write]
 * Dry run by default. --prefix limits the restore to paths starting with it.
 * Existing documents with the same path are overwritten.
 */
const fs = require('fs');
const { db } = require('./_admin');
const { Timestamp, GeoPoint } = require('firebase-admin/firestore');

const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').slice(k.length + 3);
const file = arg('file'); const prefix = arg('prefix'); const WRITE = process.argv.includes('--write');
if (!file) { console.error('Usage: --file=<backup.json> [--prefix=...] [--write]'); process.exit(1); }

function dec(v) {
  if (Array.isArray(v)) return v.map(dec);
  if (v && typeof v === 'object') {
    if ('__ts' in v) return Timestamp.fromDate(new Date(v.__ts));
    if ('__geo' in v) return new GeoPoint(v.__geo[0], v.__geo[1]);
    if ('__ref' in v) return db.doc(v.__ref);
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, dec(x)]));
  }
  return v;
}

(async () => {
  const { docs } = JSON.parse(fs.readFileSync(file, 'utf8'));
  const paths = Object.keys(docs).filter((p) => !prefix || p.startsWith(prefix));
  console.log(`${WRITE ? 'RESTORING' : 'DRY RUN'}: ${paths.length} docs${prefix ? ` under ${prefix}` : ''}`);
  let batch = db.batch(); let n = 0;
  for (const p of paths) {
    batch.set(db.doc(p), dec(docs[p])); n++;
    if (n % 400 === 0) { if (WRITE) await batch.commit(); batch = db.batch(); }
  }
  if (WRITE) await batch.commit();
  console.log(WRITE ? 'Done.' : 'Dry run only. Add --write to apply.');
})().catch((e) => { console.error(e.message); process.exit(1); });
