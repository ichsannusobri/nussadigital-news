import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEFAULT_ARTICLES } from '../lib/data';

const ITEMS_PER_PAGE = 12;

export default async function sitemap() {
  const baseUrl = 'https://nussadigital.co.id';

  // 1. Fetch all articles ordered by date descending
  const q = query(collection(db, "articles"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  
  let articles = [];
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
  });

  if (articles.length === 0) {
    articles = DEFAULT_ARTICLES;
  }

  // 2. Determine Global Latest Date (for Homepage and Archive)
  const fallbackDate = new Date();
  const globalLatestDate = articles.length > 0 && articles[0].date 
    ? new Date(articles[0].date) 
    : fallbackDate;

  // 3. Determine Latest Date Per Category & Count Articles
  const categoryStats = {};
  articles.forEach(article => {
    if (article.category) {
      const cat = article.category.toLowerCase();
      if (!categoryStats[cat]) {
        categoryStats[cat] = {
          count: 0,
          latestDate: null
        };
      }
      categoryStats[cat].count++;
      
      const articleDate = article.date ? new Date(article.date) : fallbackDate;
      if (!categoryStats[cat].latestDate || articleDate > categoryStats[cat].latestDate) {
        categoryStats[cat].latestDate = articleDate;
      }
    }
  });

  // 4. Generate Core Static Pages
  const corePages = [
    {
      url: `${baseUrl}`,
      lastModified: globalLatestDate,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/markets`,
      lastModified: globalLatestDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: globalLatestDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Trust pages with hardcoded static dates
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-07-01'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-07-01'),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-07-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-07-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ];

  // 5. Generate Article URLs
  const articleUrls = articles.map(article => ({
    url: `${baseUrl}/article/${article.id}`,
    lastModified: article.date ? new Date(article.date) : (article.createdAt ? new Date(article.createdAt) : fallbackDate),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 6. Generate Category Main Pages
  const categoryUrls = Object.entries(categoryStats).map(([cat, stats]) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: stats.latestDate || fallbackDate,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // 7. Generate Pagination URLs (Homepage)
  const paginationUrls = [];
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  for (let i = 2; i <= totalPages; i++) {
    paginationUrls.push({
      url: `${baseUrl}/page/${i}`,
      lastModified: globalLatestDate,
      changeFrequency: 'daily',
      priority: 0.6,
    });
  }

  // 8. Generate Pagination URLs (Categories)
  const categoryPaginationUrls = [];
  for (const [cat, stats] of Object.entries(categoryStats)) {
    const catTotalPages = Math.ceil(stats.count / ITEMS_PER_PAGE);
    for (let i = 2; i <= catTotalPages; i++) {
      categoryPaginationUrls.push({
        url: `${baseUrl}/category/${cat}/page/${i}`,
        lastModified: stats.latestDate || fallbackDate,
        changeFrequency: 'weekly', // older pages change less frequently
        priority: 0.5,
      });
    }
  }

  // Combine and return all URLs
  return [
    ...corePages,
    ...categoryUrls,
    ...articleUrls,
    ...paginationUrls,
    ...categoryPaginationUrls
  ];
}
