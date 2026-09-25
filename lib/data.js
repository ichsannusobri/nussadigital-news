// Shared, content-agnostic helpers.
//
// NOTE: Placeholder/demo articles, fake "live updates" and invented author
// bios were intentionally removed. Publishing fabricated content (or content
// attributed to real people who did not write it) is a direct cause of
// AdSense "Low value content" rejections and a Google spam-policy risk.
// If Firestore returns no articles the build now fails (see lib/articles.js)
// instead of silently shipping demo content.

export const SITE_URL = 'https://nussadigital.co.id';
export const SITE_NAME = 'NDNews';

// Default navigation topics used when no trending data is available.
export const FALLBACK_TOPICS = [
  { id: 'economy', name: 'Economy', url: '/category/economy' },
  { id: 'finance', name: 'Finance & Markets', url: '/category/finance' },
  { id: 'apac', name: 'APAC', url: '/category/apac' },
  { id: 'sport', name: 'Sport', url: '/category/sport' },
  { id: 'explainer', name: 'Explainers', url: '/category/explainer' },
];

// Map inconsistent bylines stored in Firestore to one canonical name so each
// author has exactly one author page (avoids duplicate/thin author URLs).
// Fix the source data in Firestore too; this is a safety net.
const AUTHOR_ALIASES = {
  'ichsan n': 'Ichsan N',
  'ichsan nusobri': 'Ichsan N',
  'filza sya': 'Filza Syah',
  'filza syah': 'Filza Syah',
  'ndnews sportteam': 'NDNews Sport Team',
  'ndnews sport team': 'NDNews Sport Team',
};

export function normalizeAuthor(name) {
  if (!name || !String(name).trim()) return 'NDNews Editorial Team';
  const clean = String(name).replace(/\s+/g, ' ').trim();
  return AUTHOR_ALIASES[clean.toLowerCase()] || clean;
}

// Only real bylines. Anything not listed falls back to a neutral bio.
// Do NOT add invented credentials here.
export const AUTHOR_BIOS = {
  'Ichsan N': {
    title: 'Editor-in-Chief',
    bio: 'Ichsan N is the Editor-in-Chief of NDNews, overseeing editorial standards and coverage of economy, finance and sport across the Asia-Pacific.',
  },
  'NDNews Editorial Team': {
    title: 'Editorial Desk',
    bio: 'Articles published under the NDNews Editorial Team byline are researched, written and reviewed collectively by the NDNews newsroom.',
  },
  'NDNews Sport Team': {
    title: 'Sport Desk',
    bio: 'The NDNews Sport Team covers football and major sporting events across the Asia-Pacific.',
  },
  'NDNews Desk': {
    title: 'News Desk',
    bio: 'Short news updates compiled and reviewed by the NDNews news desk.',
  },
};

export function slugifyAuthor(name) {
  return normalizeAuthor(name)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function getAuthorBio(authorName) {
  const name = normalizeAuthor(authorName);
  if (AUTHOR_BIOS[name]) return AUTHOR_BIOS[name];
  return {
    title: 'Contributor',
    bio: `${name} writes for NDNews, covering economy, finance and sport across the Asia-Pacific.`,
  };
}

export function getOptimizedImageUrl(url, width) {
  if (!url) return '/og-home.png';

  try {
    if (url.includes('pexels.com/photos/')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}&fit=max&q=80`;
    }
    if (url.includes('images.unsplash.com/')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=${width}&q=80`;
    }
    if (url.includes('picsum.photos/')) {
      const parts = url.split('/');
      if (parts.length >= 6) {
        parts[parts.length - 2] = width;
        parts[parts.length - 1] = Math.round(width * 0.625);
        return parts.join('/');
      }
    }
  } catch (e) {
    console.error('Error optimizing image URL:', e);
  }
  return url;
}

export function getAuthorAvatar() {
  return '/favicon.png';
}
