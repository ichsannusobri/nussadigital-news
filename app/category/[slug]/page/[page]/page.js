import Link from 'next/link';
import { getAllArticles, getCategoryStats } from '../../../../../lib/articles';
import { getOptimizedImageUrl } from '../../../../../lib/data';
import Pagination from '../../../../../components/Pagination';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

const ITEMS_PER_PAGE = 12;

export const dynamicParams = false;

export async function generateStaticParams() {
  const stats = await getCategoryStats();
  const paths = [];
  for (const [slug, { count }] of Object.entries(stats)) {
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    for (let i = 2; i <= totalPages; i++) paths.push({ slug, page: String(i) });
  }
  return paths;
}

export async function generateMetadata({ params }) {
  const catName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  const currentPage = parseInt(params.page);
  
  let articles = await getAllArticles();

  let categoryArticles = articles.filter(a => a.category && a.category.toLowerCase() === params.slug.toLowerCase());
  const totalPages = Math.ceil(categoryArticles.length / ITEMS_PER_PAGE);
  const isEmpty = currentPage > totalPages || categoryArticles.length === 0;

  return {
    title: `${catName} News - Page ${params.page}`,
    description: `Latest news and updates on ${catName} - Page ${params.page}.`,
    alternates: {
      canonical: `https://nussadigital.co.id/category/${params.slug}/page/${params.page}`,
    },
    robots: {
      index: !isEmpty,
      follow: true,
    }
  };
}

export default async function CategoryPaginatedPage({ params }) {
  const currentPage = parseInt(params.page);
  
  let articles = await getAllArticles();

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
                  <img src={getOptimizedImageUrl(article.image, 400)} alt={article.title} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} loading="lazy" decoding="async" width={400} height={250} />
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
        </aside>
      </div>
    </main>
  );
}
