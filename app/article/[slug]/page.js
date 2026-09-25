import Link from 'next/link';
import { marked } from 'marked';
import { getAllArticles, getArticleById } from '../../../lib/articles';
import { getOptimizedImageUrl, getAuthorAvatar, slugifyAuthor, SITE_URL } from '../../../lib/data';
import ViewCounter from '../../../components/ViewCounter';
import ShareButtons from '../../../components/ShareButtons';

// Only pre-rendered article IDs exist; unknown slugs return a real 404.
export const dynamicParams = false;

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toIso(v) {
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString() : undefined;
}

function plainExcerpt(article, max = 160) {
  const src = (article.excerpt || article.content || '')
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (src.length <= max) return src;
  const cut = src.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).trim() + '…';
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }) {
  const article = await getArticleById(params.slug);
  if (!article) return { title: 'Article Not Found', robots: { index: false } };

  const description = plainExcerpt(article);
  const canonicalUrl = `${SITE_URL}/article/${article.id}`;
  const image = article.image || '/og-home.png';

  return {
    // Full headline; the layout template appends "| NDNews".
    // Google truncates visually on its own — hard-cutting titles with "..." hurts CTR.
    title: article.title,
    description,
    alternates: { canonical: canonicalUrl },
    authors: [{ name: article.author, url: `${SITE_URL}/author/${slugifyAuthor(article.author)}` }],
    keywords: article.tags || undefined,
    openGraph: {
      type: 'article',
      siteName: 'NDNews',
      title: article.title,
      description,
      url: canonicalUrl,
      publishedTime: toIso(article.date),
      modifiedTime: toIso(article.updatedAt || article.date),
      section: article.category,
      tags: article.tags || undefined,
      images: [{ url: image, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }) {
  const article = await getArticleById(params.slug);

  if (!article) {
    return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><p className="error-message">Article not found. Please return to the <Link href="/">homepage</Link>.</p></div>;
  }

  const allArticles = await getAllArticles();
  const catSlug = article.category.toLowerCase();

  // Related: same category first, then shared tags, never the article itself.
  const tagSet = new Set((article.tags || []).map((t) => String(t).toLowerCase()));
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .map((a) => {
      let score = a.category.toLowerCase() === catSlug ? 2 : 0;
      (a.tags || []).forEach((t) => { if (tagSet.has(String(t).toLowerCase())) score += 1; });
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 5)
    .map((x) => x.a);

  const wordCount = (article.content || '').trim().split(/\s+/).filter(Boolean).length;
  const authorSlug = slugifyAuthor(article.author);
  const canonicalUrl = `${SITE_URL}/article/${article.id}`;
  const published = toIso(article.date);
  const modified = toIso(article.updatedAt || article.date);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": plainExcerpt(article),
      "image": [article.image || `${SITE_URL}/og-home.png`],
      "datePublished": published,
      "dateModified": modified,
      "wordCount": wordCount,
      "articleSection": article.category,
      "keywords": (article.tags || []).join(', ') || undefined,
      "inLanguage": "en",
      "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
      "author": [{
        "@type": article.author.startsWith('NDNews') ? "Organization" : "Person",
        "name": article.author,
        "url": `${SITE_URL}/author/${authorSlug}`
      }],
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": "NDNews",
        "url": SITE_URL,
        "logo": { "@type": "ImageObject", "url": `${SITE_URL}/favicon.png` }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": article.category, "item": `${SITE_URL}/category/${catSlug}` },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": canonicalUrl }
      ]
    }
  ];

  const finalHtml = marked.parse(article.content || '');
  const showUpdated = modified && published && modified.slice(0, 10) !== published.slice(0, 10);

  return (
    <main>
      <ViewCounter articleId={article.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> &gt; <Link href={`/category/${catSlug}`} id="article-category">{article.category}</Link>
      </nav>

      <section className="article-section">
          <div className="article-grid">
              <article className="article-main" id="article-detail-container">
                  <span className="article-category">{article.category.toUpperCase()}</span>
                  <h1 className="article-title">{article.title}</h1>
                  <div className="article-meta">
                    <img src={getAuthorAvatar(article.author)} alt="" aria-hidden="true" className="article-author-avatar" width={40} height={40} style={{ objectFit: 'cover' }} />
                    <div>
                      <Link href={`/author/${authorSlug}`} className="article-author-name" rel="author">{article.author}</Link>
                      <span style={{ margin: '0 8px', color: '#9ca3af' }}>&bull;</span>
                      <time className="article-date" dateTime={published}>{formatDate(article.date)}</time>
                      {showUpdated && (
                        <>
                          <span style={{ margin: '0 8px', color: '#9ca3af' }}>&bull;</span>
                          <span className="article-date">Updated <time dateTime={modified}>{formatDate(article.updatedAt)}</time></span>
                        </>
                      )}
                      <span style={{ margin: '0 8px', color: '#9ca3af' }}>&bull;</span>
                      <span className="article-read-time">{article.readTime || `${Math.max(1, Math.round(wordCount / 220))} min read`}</span>
                    </div>
                  </div>
                  <img className="article-hero-img" src={getOptimizedImageUrl(article.image, 800)} alt={article.imageAlt || article.title} fetchPriority="high" loading="eager" decoding="async" width={800} height={500} referrerPolicy="no-referrer" />
                  {article.imageCredit && <p className="article-image-credit" style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>{article.imageCredit}</p>}

                  <div className="article-body markdown-body" dangerouslySetInnerHTML={{ __html: finalHtml }} />

                  {(article.tags || []).length > 0 && (
                    <div className="article-tags">
                      {article.tags.map(tag => (
                        <span className="article-tag" key={tag}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <ShareButtons url={canonicalUrl} title={article.title} />
              </article>
              <aside className="article-sidebar">
                  <div className="sidebar-section">
                      <h2 className="section-header">Related Articles</h2>
                      <div id="related-articles-container">
                        {relatedArticles.length === 0 ? (
                          <p>More stories in <Link href={`/category/${catSlug}`}>{article.category}</Link>.</p>
                        ) : relatedArticles.map(a => (
                          <div className="related-item" key={`rel-${a.id}`}>
                            <img src={getOptimizedImageUrl(a.image, 150)} alt="" aria-hidden="true" loading="lazy" decoding="async" width={150} height={94} />
                            <div>
                              <Link href={`/article/${a.id}`} className="related-title">{a.title}</Link>
                              <span className="card-meta">{formatDate(a.date)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>
              </aside>
          </div>
      </section>
    </main>
  );
}
