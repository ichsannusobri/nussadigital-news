/**
 * Content cleanup driven by docs/content-cleanup-manifest.json
 *
 *   node scripts/maintenance/content-cleanup.js --phase=1              (dry run)
 *   node scripts/maintenance/content-cleanup.js --phase=1 --write      (apply)
 *   node scripts/maintenance/content-cleanup.js --phase=1 --rollback --write
 *
 * phase 1 = action "delete"  -> doc copied to `articles_deleted_backup` then removed from `articles`
 * phase 2 = action "archive" -> doc copied to `articles_archive` (status needs_rewrite) then removed from `articles`
 *
 * Safety:
 *  - Dry run by default. Nothing is written without --write.
 *  - Every doc is copied BEFORE it is removed (same batch, atomic per batch).
 *  - Title in Firestore must match the manifest, otherwise the doc is skipped.
 *  - A JSON log is written to docs/cleanup-logs/.
 *  - Take a full `gcloud firestore export` first (see docs/RENCANA-PEMBERSIHAN-KONTEN.md).
 */
const fs = require('fs');
const path = require('path');
const { admin, db } = require('./_admin');

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v === undefined ? true : v];
}));
const PHASE = Number(args.phase);
const WRITE = Boolean(args.write);
const ROLLBACK = Boolean(args.rollback);

if (![1, 2].includes(PHASE)) {
  console.error('Usage: --phase=1|2 [--write] [--rollback]');
  process.exit(1);
}

const manifestPath = path.join(__dirname, '..', '..', 'docs', 'content-cleanup-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const items = manifest.articles.filter((a) => a.phase === PHASE);
const TARGET = PHASE === 1 ? 'articles_deleted_backup' : 'articles_archive';

async function run() {
  console.log(`=== CONTENT CLEANUP phase ${PHASE} | ${ROLLBACK ? 'ROLLBACK' : 'APPLY'} | ${WRITE ? 'WRITE MODE' : 'DRY RUN'} ===`);
  console.log(`Manifest items: ${items.length} -> target collection: ${TARGET}\n`);

  const log = [];
  let batch = db.batch();
  let ops = 0;
  const flush = async () => {
    if (WRITE && ops > 0) await batch.commit();
    batch = db.batch();
    ops = 0;
  };

  for (const item of items) {
    const src = db.collection(ROLLBACK ? TARGET : 'articles').doc(item.id);
    const dst = db.collection(ROLLBACK ? 'articles' : TARGET).doc(item.id);
    const snap = await src.get();

    if (!snap.exists) {
      console.log(`SKIP  ${item.id}  (not found in ${src.parent.id})`);
      log.push({ id: item.id, result: 'not_found' });
      continue;
    }
    const data = snap.data();
    if (!ROLLBACK && (data.title || '').trim() !== item.title.trim()) {
      console.log(`SKIP  ${item.id}  (title changed since manifest was generated - review manually)`);
      log.push({ id: item.id, result: 'title_mismatch' });
      continue;
    }

    let payload = data;
    if (ROLLBACK) {
      const { _cleanup, ...rest } = data;
      payload = rest;
    } else {
      payload = {
        ...data,
        _cleanup: {
          action: item.action,
          reason: item.reason,
          phase: PHASE,
          rewrite_priority: item.rewrite_priority ?? null,
          status: PHASE === 2 ? 'needs_rewrite' : 'deleted',
          at: admin.firestore.FieldValue.serverTimestamp(),
        },
      };
    }

    console.log(`${WRITE ? 'DO  ' : 'WOULD'} ${ROLLBACK ? 'restore' : item.action.padEnd(7)} ${item.id}  "${item.title.slice(0, 70)}"`);
    batch.set(dst, payload);
    batch.delete(src);
    ops += 2;
    log.push({ id: item.id, result: WRITE ? 'done' : 'dry_run' });
    if (ops >= 400) await flush();
  }
  await flush();

  // Report docs still in `articles` that the manifest does not know about.
  if (!ROLLBACK) {
    const known = new Set(manifest.articles.map((a) => a.id));
    const all = await db.collection('articles').select('title').get();
    const unknown = all.docs.filter((d) => !known.has(d.id));
    if (unknown.length) {
      console.log(`\nNOTE: ${unknown.length} doc(s) in "articles" are not in the manifest (untouched):`);
      unknown.forEach((d) => console.log(`   - ${d.id}  "${(d.get('title') || '').slice(0, 70)}"`));
    }
  }

  const logDir = path.join(__dirname, '..', '..', 'docs', 'cleanup-logs');
  fs.mkdirSync(logDir, { recursive: true });
  const logFile = path.join(logDir, `phase${PHASE}-${ROLLBACK ? 'rollback' : 'apply'}-${WRITE ? 'write' : 'dry'}-${Date.now()}.json`);
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
  console.log(`\nLog: ${path.relative(process.cwd(), logFile)}`);
  if (!WRITE) console.log('Dry run only. Re-run with --write to apply.');
}

run().catch((e) => { console.error(e); process.exit(1); });
