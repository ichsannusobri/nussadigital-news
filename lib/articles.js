// Single data-access layer for build-time (static export) pages.
//
// Before: every page/metadata/staticParams call ran its own full Firestore
// collection scan (article pages alone did 3 reads x N articles = O(N^2)).
// Now each build worker fetches the collection once and reuses it.
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { normalizeAuthor } from './data';

let cache = null;

function toTime(v) {
  const t = v ? new Date(v).getTime() : NaN;
  return Number.isNaN(t) ? 0 : t;
}

export function getAllArticles() {
  if (!cache) {
    cache = (async () => {
      const snap = await getDocs(collection(db, 'articles'));
      const list = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          ...data,
          id: d.id,
          author: normalizeAuthor(data.author),
          category: String(data.category || 'News').trim(),
        });
      });
      if (list.length === 0) {
        throw new Error(
          '[build] Firestore returned 0 articles. Aborting build so no placeholder content is published.'
        );
      }
      // Newest first; articles without a date go last.
      list.sort((a, b) => toTime(b.date) - toTime(a.date));
      return list;
    })().catch((err) => {
      cache = null;
      throw err;
    });
  }
  return cache;
}

export async function getArticleById(id) {
  const all = await getAllArticles();
  return all.find((a) => a.id === id) || null;
}

export async function getArticlesByCategory(slug) {
  const all = await getAllArticles();
  return all.filter((a) => a.category.toLowerCase() === String(slug).toLowerCase());
}

export async function getCategoryStats() {
  const all = await getAllArticles();
  const stats = {};
  for (const a of all) {
    const cat = a.category.toLowerCase();
    if (!stats[cat]) stats[cat] = { count: 0, latestDate: null };
    stats[cat].count++;
    const d = a.date ? new Date(a.date) : null;
    if (d && (!stats[cat].latestDate || d > stats[cat].latestDate)) stats[cat].latestDate = d;
  }
  return stats;
}
