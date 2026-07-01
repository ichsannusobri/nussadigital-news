import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { DEFAULT_ARTICLES } from '../../../../../lib/data';
import Pagination from '../../../../../components/Pagination';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

const ITEMS_PER_PAGE = 12;

export async function generateStaticParams() {
  const q = query(collection(db, "articles"));
  const querySnapshot = await getDocs(q);
  
  let allArticles = [];
  if (querySnapshot.empty) {
    allArticles = DEFAULT_ARTICLES;
  } else {
    querySnapshot.forEach((doc) => {
      allArticles.push({ id: doc.id, ...doc.data() });
    });
  }

  // Group by category
  const categoryMap = {};
  allArticles.forEach(article => {
    if (article.category) {
      const cat = article.category.toLowerCase();
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat]++;
    }
  });

  let paths = [];
  for (const [slug, count] of Object.entries(categoryMap)) {
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    for (let i = 2; i <= totalPages; i++) {
      paths.push({ slug: slug, page: i.toString() });
    }
  }

  return paths;
}

export async function generateMetadata({ params }) {
  const catName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return {
    title: `${catName} News - Page ${params.page} | NDNews`,
    description: `Latest news and updates on ${catName} - Page ${params.page}.`,
    alternates: {
      canonical: `https://nussadigital.co.id/category/${params.slug}/page/${params.page}`,
    },
  };
}

export default async function CategoryPaginatedPage({ params }) {
  const currentPage = parseInt(params.page);
  
  const q = query(collection(db, "articles"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  
  let articles = [];
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
  });

  if (articles.length === 0) {
    articles = DEFAULT_ARTICLES;
  }

  // Filter by category
  let categoryArticles = articles.filter(a => a.category && a.category.toLowerCase() === params.slug.toLowerCase());

  const totalPages = Math.ceil(categoryArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageArticles = categoryArticles.slice(startIndex, endIndex);
  const catName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <main>
      <div className="category-header-banner" style={{backgroundColor: '#111827', color: '#fff', padding: '60px 20px', textAlign: 'center'}}>
        <h1 style={{fontSize: '40px', margin: '0 0 10px 0', textTransform: 'uppercase'}}>{catName}</h1>
        <p style={{fontSize: '18px', margin: '0', opacity: 0.9}}>Latest {catName} News - Page {currentPage}</p>
      </div>

      <div className="container" style={{display: 'flex', gap: '30px', marginTop: '40px', marginBottom: '60px', padding: '0 20px'}}>
        <div style={{flex: 1}}>
          {pageArticles.map((article) => (
            <article key={article.id} className="category-article" style={{display: 'flex', gap: '20px', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #e2e8f0'}}>
              <div style={{width: '300px', height: '200px', flexShrink: 0}}>
                <Link href={`/article/${article.id}`}>
                  <img src={article.image} alt={article.title} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} loading="lazy" decoding="async" />
                </Link>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <h2 style={{fontSize: '1.4rem', margin: '0 0 10px 0', lineHeight: '1.3'}}>
                  <Link href={`/article/${article.id}`} style={{color: '#0f172a', textDecoration: 'none'}}>
                    {article.title}
                  </Link>
                </h2>
                <p style={{color: '#64748b', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 15px 0'}}>
                  {article.excerpt}
                </p>
                <div style={{fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                  {formatDate(article.date)}
                </div>
              </div>
            </article>
          ))}

          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/category/${params.slug}`} />
        </div>
        
        <aside style={{width: '300px', flexShrink: 0}}>
          <div className="ad-container ad-sidebar" style={{position: 'sticky', top: '100px'}}>
            <span style={{fontSize: '10px', color: '#888', display: 'block', marginBottom: '5px'}}>Advertisement</span>
            <ins className="adsbygoogle"
                 style={{display:'block'}}
                 data-ad-client="ca-pub-2449102925093409"
                 data-ad-slot="1234567890"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </aside>
      </div>
    </main>
  );
}
