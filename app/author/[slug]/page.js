import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { DEFAULT_ARTICLES, getOptimizedImageUrl, slugifyAuthor, getAuthorBio } from '../../../lib/data';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function getAllArticles() {
  const querySnapshot = await getDocs(collection(db, "articles"));
  let articles = [];
  if (querySnapshot.empty) {
    articles = DEFAULT_ARTICLES;
  } else {
    querySnapshot.forEach((doc) => articles.push({ id: doc.id, ...doc.data() }));
  }
  return articles;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const authors = new Set();
  articles.forEach(a => {
    if (a.author) authors.add(a.author);
  });
  return Array.from(authors).map(author => ({ slug: slugifyAuthor(author) }));
}

export async function generateMetadata({ params }) {
  const articles = await getAllArticles();
  const article = articles.find(a => slugifyAuthor(a.author) === params.slug);

  if (!article) {
    return { title: 'Author Not Found - NDNews' };
  }

  const { title } = getAuthorBio(article.author);
  const canonicalUrl = `https://nussadigital.co.id/author/${params.slug}`;

  return {
    title: `${article.author} - ${title} - NDNews`,
    description: `Articles and analysis by ${article.author}, ${title} at NDNews.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function AuthorPage({ params }) {
  const articles = await getAllArticles();
  const authorArticles = articles.filter(a => slugifyAuthor(a.author) === params.slug);

  if (authorArticles.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <p className="error-message">Author not found. Please return to the <Link href="/">homepage</Link>.</p>
      </div>
    );
  }

  const authorName = authorArticles[0].author;
  const { title, bio } = getAuthorBio(authorName);
  const sortedArticles = [...authorArticles].sort((a, b) => new Date(b.date) - new Date(a.date));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": authorName,
      "jobTitle": title,
      "description": bio,
      "url": `https://nussadigital.co.id/author/${params.slug}`,
      "worksFor": {
        "@type": "Organization",
        "name": "NDNews"
      }
    }
  };

  return (
    <main className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 style={{ fontSize: '36px', marginBottom: '4px', color: '#111827' }}>{authorName}</h1>
      <p style={{ fontSize: '18px', color: '#1e40af', fontWeight: 'bold', marginBottom: '20px' }}>{title}, NDNews</p>
      <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.7', marginBottom: '40px' }}>{bio}</p>

      <h2 className="section-header" style={{ marginBottom: '20px' }}>Articles by {authorName}</h2>
      <div>
        {sortedArticles.map(a => (
          <article className="news-card" key={`auth-${a.id}`} style={{ marginBottom: '20px' }}>
            <Link href={`/article/${a.id}`}>
              <img src={getOptimizedImageUrl(a.image, 400)} alt={a.title} loading="lazy" decoding="async" width={400} height={250} />
            </Link>
            <div className="card-body">
              <span className="card-category">{a.category.toUpperCase()}</span>
              <Link href={`/article/${a.id}`}><h3 className="card-title">{a.title}</h3></Link>
              <p className="card-excerpt">{a.excerpt}</p>
              <div className="card-meta">
                <span>{formatDate(a.date)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
