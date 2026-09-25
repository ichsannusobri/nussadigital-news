/**
 * Budget AI shutdown: purge user data (Firestore `budget_users` + Firebase Auth users).
 *
 *   node scripts/maintenance/budget-data-purge.js            (dry run: prints COUNTS only)
 *   node scripts/maintenance/budget-data-purge.js --write    (irreversible delete)
 *
 * This deletes personal financial data. Prerequisites (see docs/RENCANA-PEMBERSIHAN-KONTEN.md):
 *   1. Business decision + notice to users (with export window) has been completed.
 *   2. A `gcloud firestore export` backup exists in a restricted bucket with a retention date.
 *   3. Confirm the admin dashboard does NOT rely on Firebase Auth users (it currently does not).
 * The script never prints emails, names, or expense content.
 */
const { admin, db } = require('./_admin');
const WRITE = process.argv.includes('--write');

// Admin accounts (custom claim admin=true) are kept: the dashboard needs them.
async function listNonAdminUids() {
  const uids = []; let token;
  do {
    const res = await admin.auth().listUsers(1000, token);
    res.users.forEach((u) => { if (!(u.customClaims && u.customClaims.admin === true)) uids.push(u.uid); });
    token = res.pageToken;
  } while (token);
  return uids;
}

async function deleteAuthUsers(uids) {
  let deleted = 0;
  for (let i = 0; i < uids.length; i += 1000) {
    const r = await admin.auth().deleteUsers(uids.slice(i, i + 1000));
    deleted += r.successCount;
    if (r.failureCount) console.log(`Auth delete failures: ${r.failureCount}`);
  }
  return deleted;
}

(async () => {
  const users = await db.collection('budget_users').listDocuments();
  const uids = await listNonAdminUids();
  console.log(`=== BUDGET AI DATA PURGE | ${WRITE ? 'WRITE MODE' : 'DRY RUN'} ===`);
  console.log(`budget_users documents (incl. subcollections): ${users.length}`);
  console.log(`Firebase Auth users to delete (non-admin): ${uids.length}`);
  if (!WRITE) { console.log('\nDry run only. Nothing deleted.'); return; }

  await db.recursiveDelete(db.collection('budget_users'));
  const deleted = await deleteAuthUsers(uids);
  console.log(`Deleted budget_users recursively. Deleted ${deleted} Auth users.`);
})().catch((e) => { console.error(e); process.exit(1); });
