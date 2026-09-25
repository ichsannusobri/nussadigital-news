/**
 * Stage or publish a reviewed Markdown draft (docs/drafts/*.md with YAML-like frontmatter).
 *
 *   node scripts/maintenance/publish-draft.js docs/drafts/01-x.md --stage              # -> article_drafts/{slug} (not public)
 *   node scripts/maintenance/publish-draft.js docs/drafts/01-x.md --publish            # dry run
 *   node scripts/maintenance/publish-draft.js docs/drafts/01-x.md --publish --write    # -> articles/{slug}
 *
 * On --publish --write, if frontmatter has `replaces: <oldId>`:
 *   - the old article is moved to `articles_archive` (status "replaced")
 *   - a 301 "/article/<oldId> /article/<slug>" line is appended to public/_redirects
 * A rebuild/deploy is still needed for the change to go live.
 */
const fs = require('fs');
const path = require('path');
const { admin, db } = require('./_admin');

const file = process.argv[2];
const STAGE = process.argv.includes('--stage');
const PUBLISH = process.argv.includes('--publish');
const WRITE = process.argv.includes('--write');
if (!file || (!STAGE && !PUBLISH)) {
  console.error('Usage: <draft.md> --stage | --publish [--write]');
  process.exit(1);
}

function parse(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error('Missing frontmatter');
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    else v = v.replace(/^"(.*)"$/, '$1');
    meta[kv[1]] = v;
  }
  return { meta, content: m[2].trim() + '\n' };
}

(async () => {
  const repo = path.join(__dirname, '..', '..');
  const { meta, content } = parse(fs.readFileSync(path.resolve(file), 'utf8'));
  for (const k of ['slug', 'title', 'excerpt', 'category', 'author']) if (!meta[k]) throw new Error(`frontmatter "${k}" missing`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(meta.slug)) throw new Error('slug must be lowercase-hyphenated');

  const words = content.split(/\s+/).filter(Boolean).length;
  const extLinks = new Set((content.match(/\]\((https?:\/\/[^)\s]+)\)/g) || []).map((l) => l.slice(2, -1))).size;
  console.log(`Draft "${meta.title}" | ${words} words | ${extLinks} external source links`);
  if (words < 800 || extLinks < 3) throw new Error('Editorial minimum not met (>=800 words, >=3 source links)');

  const now = new Date().toISOString();
  const doc = {
    id: meta.slug,
    title: meta.title,
    excerpt: meta.excerpt,
    content,
    category: meta.category,
    author: meta.author,
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    image: meta.image || null,
    imageCredit: meta.imageCredit || null,
    readTime: `${Math.max(1, Math.round(words / 220))} min read`,
    isBreaking: false,
    isFeatured: false,
    isLive: false,
    views: 0,
    aiAssisted: true,
    replaces: meta.replaces || null,
  };

  if (STAGE) {
    await db.collection('article_drafts').doc(meta.slug).set({ ...doc, stagedAt: now, status: 'in_review' });
    console.log(`Staged -> article_drafts/${meta.slug} (not public)`);
    return;
  }

  const target = db.collection('articles').doc(meta.slug);
  if ((await target.get()).exists) throw new Error(`articles/${meta.slug} already exists`);
  let old = null;
  if (meta.replaces) {
    const snap = await db.collection('articles').doc(meta.replaces).get();
    old = snap.exists ? snap : null;
    console.log(`Replaces ${meta.replaces}: ${old ? 'found, will archive + 301' : 'not in articles (redirect only)'}`);
  }
  if (!WRITE) { console.log('Dry run. Add --write to publish.'); return; }

  const batch = db.batch();
  batch.set(target, { ...doc, date: now, updatedAt: now });
  if (old) {
    batch.set(db.collection('articles_archive').doc(meta.replaces), {
      ...old.data(),
      _cleanup: { action: 'replaced', replacedBy: meta.slug, status: 'replaced', at: admin.firestore.FieldValue.serverTimestamp() },
    });
    batch.delete(old.ref);
  }
  batch.delete(db.collection('article_drafts').doc(meta.slug));
  await batch.commit();

  if (meta.replaces) {
    const rp = path.join(repo, 'public', '_redirects');
    const line = `/article/${meta.replaces} /article/${meta.slug} 301`;
    const cur = fs.readFileSync(rp, 'utf8');
    if (!cur.includes(line)) fs.writeFileSync(rp, cur.replace(/\s*$/, '\n') + line + '\n');
  }
  console.log(`Published -> articles/${meta.slug}. Rebuild & deploy to go live.`);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
