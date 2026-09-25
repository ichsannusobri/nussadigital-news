/**
 * Grant or revoke the dashboard admin claim.
 *   node scripts/maintenance/set-admin.js --email=you@example.com            (grant)
 *   node scripts/maintenance/set-admin.js --email=you@example.com --revoke
 * The account must have signed in to /dashboard once (so the Auth user exists).
 */
const { admin } = require('./_admin');
const email = (process.argv.find((a) => a.startsWith('--email=')) || '').split('=')[1];
const revoke = process.argv.includes('--revoke');
if (!email) { console.error('Usage: --email=<address> [--revoke]'); process.exit(1); }
(async () => {
  const u = await admin.auth().getUserByEmail(email);
  const claims = { ...(u.customClaims || {}) };
  if (revoke) delete claims.admin; else claims.admin = true;
  await admin.auth().setCustomUserClaims(u.uid, claims);
  console.log(`${revoke ? 'Revoked' : 'Granted'} admin for ${email}. Sign out and in again on /dashboard.`);
})().catch((e) => { console.error(e.message); process.exit(1); });
