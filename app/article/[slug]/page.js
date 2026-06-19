import Link from 'next/link';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { DEFAULT_ARTICLES } from '../../../lib/data';
import ViewCounter from '../../../components/ViewCounter';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function truncateText(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, "articles"));
  let ids = [];
  if (querySnapshot.empty) {
    ids = DEFAULT_ARTICLES.map(a => a.id);
  } else {
    querySnapshot.forEach((doc) => {
      ids.push(doc.id);
    });
  }

  return ids.map((id) => ({
    slug: id,
  }));
}

export async function generateMetadata({ params }) {
  const docRef = doc(db, "articles", params.slug);
  const docSnap = await getDoc(docRef);
  
  let article;
  if (docSnap.exists()) {
    article = docSnap.data();
  } else {
    article = DEFAULT_ARTICLES.find(a => a.id === params.slug);
  }

  if (!article) {
    return { title: 'Article Not Found - NDNews' };
  }

  return {
    title: `${article.title} — NDNews`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} - NDNews`,
      description: article.excerpt,
      url: `https://nussadigital.co.id/article/${params.slug}`,
      images: [
        {
          url: article.image,
          width: 800,
          height: 500,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }) {
  const docRef = doc(db, "articles", params.slug);
  const docSnap = await getDoc(docRef);
  
  let article;
  if (docSnap.exists()) {
    article = { id: docSnap.id, ...docSnap.data() };
  } else {
    article = DEFAULT_ARTICLES.find(a => a.id === params.slug);
  }
  
  if (!article) {
    return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><p className="error-message">Article not found. Please return to the <Link href="/">homepage</Link>.</p></div>;
  }

  // Fetch all articles for sidebar related
  const allSnap = await getDocs(collection(db, "articles"));
  let allArticles = [];
  if (allSnap.empty) {
    allArticles = DEFAULT_ARTICLES;
  } else {
    allSnap.forEach(d => allArticles.push({ id: d.id, ...d.data() }));
  }

  const relatedArticles = allArticles
    .filter(a => a.category.toLowerCase() === article.category.toLowerCase() && a.id !== article.id)
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.image],
    "datePublished": article.date,
    "dateModified": article.date,
    "author": [{
      "@type": "Person",
      "name": article.author,
      "url": "https://nussadigital.co.id/about"
    }]
  };

  // Build article body paragraphs with ad injected in middle
  const paragraphs = article.content.split('\n\n');
  const midPoint = Math.floor(paragraphs.length / 2);

  return (
    <main>
      <ViewCounter articleId={article.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 2. BREADCRUMB */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> &gt; <Link href={`/category/${article.category.toLowerCase()}`} id="article-category">{article.category}</Link>
      </nav>

      {/* 3. ARTICLE CONTENT + SIDEBAR */}
      <section className="article-section">
          <div className="article-grid">
              <article className="article-main" id="article-detail-container">
                  <span className="article-category">{article.category.toUpperCase()}</span>
                  <h1 className="article-title">{article.title}</h1>
                  <div className="article-meta">
                    <div className="article-author-avatar">{getInitials(article.author)}</div>
                    <div>
                      <span className="article-author-name">{article.author}</span>
                      <span className="article-date">{formatDate(article.date)}</span>
                      <span className="article-read-time">{article.readTime || '5 min read'}</span>
                    </div>
                  </div>
                  <img className="article-hero-img" src={article.image} alt={article.title} loading="lazy" width={800} height={500} />
                  
                  <div className="article-body">
                    {paragraphs.map((p, i) => (
                      <div key={i}>
                        <p>{p}</p>
                        {i === midPoint - 1 && (
                          <div className="ad-container ad-leaderboard">
                            <span style={{fontSize: '10px', color: '#888', display: 'block', marginBottom: '5px'}}>Advertisement</span>
                            <ins className="adsbygoogle"
                                 style={{display:'block', textAlign:'center'}}
                                 data-ad-client="ca-pub-2449102925093409"
                                 data-ad-slot="1234567890"
                                 data-ad-format="auto"
                                 data-full-width-responsive="true"></ins>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="article-tags">
                    {(article.tags || []).map(tag => (
                      <Link href={`/category.html?search=${encodeURIComponent(tag)}`} className="article-tag" key={tag}>#{tag}</Link>
                    ))}
                  </div>

                  <div className="share-buttons">
                    <button className="share-btn" onClick="window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent(window.location.href)+'&text='+encodeURIComponent(document.title),'_blank','width=600,height=400')">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Share
                    </button>
                    <button className="share-btn" onClick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href),'_blank','width=600,height=400')">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Share
                    </button>
                    <button className="share-btn" onClick="navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!'))">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M13.723 18.654l-3.61 3.609c-2.316 2.315-6.063 2.315-8.378 0-2.315-2.316-2.315-6.062 0-8.377l3.609-3.61 1.772 1.772-3.61 3.609c-1.34 1.34-1.34 3.494 0 4.834 1.34 1.34 3.494 1.34 4.834 0l3.61-3.609 1.773 1.772zM10.277 5.346l3.61-3.609c2.316-2.315 6.062-2.315 8.377 0 2.316 2.316 2.316 6.062 0 8.377l-3.609 3.61-1.772-1.772 3.609-3.61c1.34-1.34 1.34-3.494 0-4.834-1.34-1.34-3.494-1.34-4.834 0l-3.61 3.609-1.771-1.771zM14.83 7.758l1.414 1.414-7.071 7.071-1.414-1.414 7.071-7.071z"/></svg>
                      Copy Link
                    </button>
                  </div>
              </article>
              <aside className="article-sidebar">
                  <div className="ad-container ad-sidebar">
                      <span style={{fontSize: '10px', color: '#888', display: 'block', marginBottom: '5px'}}>Advertisement</span>
                      <ins className="adsbygoogle"
                           style={{display:'block', textAlign:'center'}}
                           data-ad-client="ca-pub-2449102925093409"
                           data-ad-slot="0987654321"
                           data-ad-format="fluid"
                           data-full-width-responsive="true"></ins>
                  </div>
                  <div className="sidebar-section">
                      <h3 className="section-header">Related Articles</h3>
                      <div id="related-articles-container">
                        {relatedArticles.length === 0 ? <p>No related articles found.</p> : relatedArticles.map(a => (
                          <div className="related-item" key={`rel-${a.id}`}>
                            <img src={a.image} alt={a.title} loading="lazy" width={800} height={500} />
                            <div>
                              <Link href={`/article/${a.id}`} className="related-title">{a.title}</Link>
                              <span className="card-meta">{formatDate(a.date)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>
                  <div className="ad-container ad-sidebar">
                      <span style={{fontSize: '10px', color: '#888', display: 'block', marginBottom: '5px'}}>Advertisement</span>
                      <ins className="adsbygoogle"
                           style={{display:'block', textAlign:'center'}}
                           data-ad-client="ca-pub-2449102925093409"
                           data-ad-slot="0987654321"
                           data-ad-format="fluid"
                           data-full-width-responsive="true"></ins>
                  </div>
              </aside>
          </div>
      </section>

      {/* 4. COMMENTS SECTION */}
      <section className="comments-section">
          <div className="section-wrapper">
              <h2 className="section-header">Comments</h2>
              <div id="comments-container">
                <form className="comment-form" id="comment-form">
                  <h4>Leave a comment</h4>
                  <input type="text" id="comment-name" placeholder="Your Name" required />
                  <input type="email" id="comment-email" placeholder="Your Email (will not be published)" required />
                  <textarea id="comment-text" rows="4" placeholder="Share your thoughts..." required></textarea>
                  <button type="submit" className="btn-primary">Post Comment</button>
                </form>
                <div className="comments-list" id="comments-list">
                  <p>Be the first to comment on this article.</p>
                </div>
              </div>
          </div>
      </section>

      {/* 5. NEWSLETTER SIGNUP */}
      <section className="newsletter-section">
          <div className="newsletter-card">
              <h2>Sign up for Breaking News Alerts</h2>
              <p>Get the latest breaking news delivered straight to your inbox.</p>
              <form className="newsletter-form" id="newsletter-form" action="#">
                  <input type="email" placeholder="Enter your email address" required />
                  <button type="submit">Subscribe</button>
              </form>
          </div>
      </section>
    </main>
  );
}
