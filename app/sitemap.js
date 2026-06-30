import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default async function sitemap() {
  const baseUrl = 'https://nussadigital.co.id';

  // Fetch all articles
  const querySnapshot = await getDocs(collection(db, "articles"));
  const articles = [];
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
  });

  const articleUrls = articles.filter(a => a.id).map(article => ({
    url: `${baseUrl}/article/${article.id}`,
    lastModified: article.createdAt ? new Date(article.createdAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categories = ['apac', 'economy', 'finance', 'sport', 'opinion'];
  const categoryUrls = categories.map(cat => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ];

  return [...staticPages, ...categoryUrls, ...articleUrls];
}
