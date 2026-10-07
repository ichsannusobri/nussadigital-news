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

// Navigation data for the header mega menu, built from real published articles.
const NAV_CATEGORIES = [
  { key: 'apac', title: 'APAC' },
  { key: 'economy', title: 'Economy' },
  { key: 'finance', title: 'Finance' },
  { key: 'sport', title: 'Sport' },
  { key: 'opinion', title: 'Opinion' },
];

function formatShortDate(v) {
  const d = v ? new Date(v) : null;
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function topTags(list, n) {
  const count = new Map();
  for (const a of list) {
    for (const t of a.tags || []) {
      const tag = String(t).trim();
      if (!tag || tag.length > 32) continue;
      count.set(tag, (count.get(tag) || 0) + 1);
    }
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([t]) => t);
}

export async function getNavMenuData() {
  const all = await getAllArticles();
  const categories = NAV_CATEGORIES.map(({ key, title }) => {
    const inCat = all.filter((a) => a.category.toLowerCase() === key);
    return {
      key,
      title,
      count: inCat.length,
      topics: topTags(inCat.slice(0, 30), 5),
      articles: inCat.slice(0, 3).map((a) => ({
        id: a.id,
        title: a.title,
        date: formatShortDate(a.date),
        image: a.image || null,
      })),
    };
  });
  // Hide sections that currently have no published articles (avoids links to empty or 404 pages).
  return { categories: categories.filter((c) => c.count > 0), popularTopics: topTags(all.slice(0, 15), 5) };
}
