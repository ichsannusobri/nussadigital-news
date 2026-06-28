import Link from 'next/link';
import { collection, getDocs, query, orderBy, doc, getDoc, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEFAULT_ARTICLES, TRENDING_TOPICS } from '../lib/data';
import TimeAgo from '../components/TimeAgo';
import FeaturedPaginated from '../components/FeaturedPaginated';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncateText(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const metadata = {
  title: 'NDNews - Breaking News, APAC Economy, Finance & Sports',
  description: 'Your trusted source for the latest news in business, economy, and sports across the Asia-Pacific region.',
  alternates: {
    canonical: 'https://nussadigital.co.id',
  },
};

export default async function HomePage() {
  const q = query(collection(db, "articles"), orderBy("date", "desc"), limit(25));
  const querySnapshot = await getDocs(q);
  let articles = [];
  querySnapshot.forEach((doc) => {
    articles.push({ id: doc.id, ...doc.data() });
  });

  if (articles.length === 0) {
    articles = DEFAULT_ARTICLES;
  }

  // Fetch dynamic trending topics
  let dynamicTrending = [];
  try {
    const trendingDoc = await getDoc(doc(db, "settings", "trending"));
    if (trendingDoc.exists()) {
      dynamicTrending = trendingDoc.data().topics || [];
    }
  } catch (e) {
    console.error("Error fetching trending topics:", e);
  }

  if (dynamicTrending.length === 0) {
    dynamicTrending = TRENDING_TOPICS.map(t => ({ id: t, name: t, category: 'apac' }));
  }

  // Pre-calculate subsets
  const breakingArticles = articles.filter(a => a.isBreaking);
  const featured = articles.filter(a => a.isFeatured);
  
  // Hero
  const mainArticle = featured[0] || articles[0];
  const midArticles = [
    featured[1] || articles[1],
    featured[2] || articles[2],
    featured[3] || articles[3]
  ].filter(Boolean);
  
  const pinnedArticles = articles.filter(a => a.isPinned);
  const unpinnedSidebar = articles.filter(a => !a.isPinned).slice(4, 9);
  const sidebarArticles = [...pinnedArticles, ...unpinnedSidebar];
  
  // Latest News (skip first 2 logically, but let's just use recent ones)
  const latestArticles = articles.slice(2, 12);
  
  // Opinions
  const opinionArticles = articles.filter(a => a.category.toLowerCase() === 'opinion');
  
  // Carousel
  const carouselArticles = articles.slice(0, 12);
  
  // Sport
  const sportArticles = articles.filter(a => a.category.toLowerCase() === 'sport');
  const sportHero = sportArticles[0];
  const sportRest = sportArticles.slice(1, 4); // Take a few
  
  // Most Popular
  const mostPopular = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  
  // Explainer
  const explainers = articles.filter(a => a.category.toLowerCase() === 'explainer');
  
  // Featured Section (bottom)
  const bottomFeatured = featured.length > 0 ? featured : articles.slice(0, 4);

  return (
    <main className="home-page">
      <h1 className="sr-only">NDNews - Latest APAC Economy, Finance & Sports News</h1>

      {/* 2. TRENDING BAR */}
      <div className="trending-bar">
        <div className="trending-container">
            <span className="trending-label">🔥 Trending</span>
            <div className="trending-links" id="trending-container">
                {dynamicTrending.map(topic => (
                  <Link key={topic.id} href={`/category/${topic.category.toLowerCase()}`} className="trending-link">{topic.name}</Link>
                ))}
            </div>
        </div>
      </div>

      {/* 3. HERO ZONE */}
      <section className="hero-zone">
        <div className="hero-container" id="hero-container">
          {mainArticle && (
            <div className="alj-main-col">
              <Link href={`/article/${mainArticle.id}`} className="alj-main-image-wrapper">
                <img src={mainArticle.image} alt={mainArticle.title} loading="lazy" decoding="async" width={800} height={500} />
                <div className="alj-main-title-box">
                  <h2>{mainArticle.title}</h2>
                </div>
              </Link>
              <ul className="alj-timeline">
                {articles.slice(1, 5).map((a, i) => (
                  <li className="alj-timeline-item" key={`tl-${a.id}`}>
                    <span className="alj-bullet"></span>
                    <TimeAgo date={a.date} />
                    <Link href={`/article/${a.id}`}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {midArticles.length > 0 && (
            <div className="alj-mid-col">
              <div className="alj-mid-top">
                <Link href={`/article/${midArticles[0].id}`}>
                  <img src={midArticles[0].image} alt={midArticles[0].title} loading="lazy" decoding="async" width={800} height={500} />
                  <h3>{midArticles[0].title}</h3>
                </Link>
              </div>
              <div className="alj-mid-list">
                {midArticles.slice(1).map(a => (
                  <Link href={`/article/${a.id}`} className="alj-mid-card" key={`hm-${a.id}`}>
                    <h4>{a.title}</h4>
                    <img src={a.image} alt={a.title} loading="lazy" decoding="async" width={800} height={500} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="alj-sidebar-col">
            <div className="alj-sidebar-section">
              <h4 className="alj-sidebar-header">WORLD CUP 2026</h4>
              {sportArticles.slice(0, 3).map(a => (
                <Link href={`/article/${a.id}`} className="alj-sidebar-item" key={`wc-${a.id}`}>
                  <div style={{flex: 1}}>
                    <span className="item-title">{truncateText(a.title, 80)}</span>
                  </div>
                  <img src={a.image} alt={a.title} loading="lazy" decoding="async" width={800} height={500} />
                </Link>
              ))}
            </div>
            
            <div className="alj-sidebar-section">
              <h4 className="alj-sidebar-header">MUST READ</h4>
              {sidebarArticles.slice(0, 2).map(a => (
                <Link href={`/article/${a.id}`} className="alj-sidebar-item" key={`mr-${a.id}`}>
                  <div style={{flex: 1}}>
                    <span className="item-title">{truncateText(a.title, 80)}</span>
                  </div>
                  <img src={a.image} alt={a.title} loading="lazy" decoding="async" width={800} height={500} />
                </Link>
              ))}
            </div>

            <div className="alj-sidebar-section">
              <h4 className="alj-sidebar-header">OPINION</h4>
              {opinionArticles.slice(0, 1).map(a => (
                <Link href={`/article/${a.id}`} className="alj-opinion-card" key={`op-${a.id}`}>
                  <img src={a.image} alt={a.author} loading="lazy" decoding="async" width={800} height={500} />
                  <span className="item-title">{truncateText(a.title, 60)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. AD BANNER */}
      <div className="ad-container ad-leaderboard">
          <span style={{fontSize: '10px', color: '#888', display: 'block', marginBottom: '5px'}}>Advertisement</span>
          <ins className="adsbygoogle"
               style={{display:'block', textAlign:'center'}}
               data-ad-client="ca-pub-2449102925093409"
               data-ad-slot="1234567890"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
      </div>

      {/* 5. BREAKING NEWS BANNER */}
      {breakingArticles.length > 0 && (
        <section className="breaking-banner" id="breaking-container">
          {breakingArticles.map(a => (
            <div className="section-wrapper" key={`break-${a.id}`}>
              <span className="breaking-label">BREAKING</span>
              <Link href={`/article/${a.id}`} className="breaking-headline">{a.title}</Link>
            </div>
          ))}
        </section>
      )}

      {/* 7. MAIN CONTENT + SIDEBAR */}
      <section className="content-section">
          <div className="content-grid">
              <main className="content-main">
                  <h2 className="section-header">Latest News</h2>
                  <div id="latest-news-container">
                    {latestArticles.map(a => (
                      <article className="news-card" key={`latest-${a.id}`}>
                        <Link href={`/article/${a.id}`}>
                          <img src={a.image} alt={a.title} loading="lazy" decoding="async" width={800} height={500} />
                        </Link>
                        <div className="card-body">
                          <span className="card-category">{a.category.toUpperCase()}</span>
                          <Link href={`/article/${a.id}`}><h3 className="card-title">{a.title}</h3></Link>
                          <p className="card-excerpt">{truncateText(a.excerpt, 150)}</p>
                          <div className="card-meta">
                            <span>{a.author}</span>
                            <span>{formatDate(a.date)}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
              </main>
              <aside className="content-sidebar">
          {opinionArticles.length > 0 && (
            <div className="sidebar-section">
              <h3 className="section-header">Opinion</h3>
              <div id="opinion-container">
                {opinionArticles.map(a => (
                  <article className="opinion-item" key={`op-${a.id}`}>
                    <div className="opinion-avatar">{getInitials(a.author)}</div>
                    <div className="opinion-body">
                      <Link href={`/article/${a.id}`} className="opinion-title">{a.title}</Link>
                      <span className="opinion-author">{a.author}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

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

      {/* 8. STORY CAROUSEL */}
      <section className="story-carousel-section">
          <div className="section-wrapper">
              <h2 className="section-header">Stories</h2>
              <div className="carousel-wrapper">
                  <button className="carousel-btn carousel-prev">‹</button>
                  <div className="carousel-track" id="story-carousel-container">
                      {carouselArticles.map((a, i) => (
                        <div className="story-card" key={`story-${a.id}`}>
                          <Link href={`/article/${a.id}`}>
                            <img src={a.image} alt={a.title} loading="lazy" decoding="async" width={800} height={500} />
                            <div className="story-overlay">
                              <span className="story-title">{truncateText(a.title, 50)}</span>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>
                  <button className="carousel-btn carousel-next">›</button>
              </div>
          </div>
      </section>

      {/* 9. AD BANNER */}
      <div className="ad-container ad-leaderboard">
          <span>Advertisement</span>
      </div>

      {/* 10. SPORT SECTION + MOST POPULAR */}
      {sportArticles.length > 0 && (
      <section className="sport-section">
        <div className="sport-grid">
          <div className="sport-main">
            <h2 className="section-header">Sport</h2>
            <div id="sport-section-container">
              {sportHero && (
                <div className="sport-hero">
                  <Link href={`/article/${sportHero.id}`}>
                    <img src={sportHero.image} alt={sportHero.title} loading="lazy" decoding="async" width={800} height={500} />
                    <div className="sport-overlay">
                      <span className="sport-category">{sportHero.category.toUpperCase()}</span>
                      <h3 className="sport-title">{sportHero.title}</h3>
                    </div>
                  </Link>
                </div>
              )}
              {sportRest.map(a => (
                <article className="sport-article" key={`sp-${a.id}`}>
                  <img src={a.image} alt={a.title} loading="lazy" decoding="async" width={800} height={500} />
                  <div>
                    <Link href={`/article/${a.id}`}><h4>{a.title}</h4></Link>
                    <span className="card-meta">{a.author} &bull; {formatDate(a.date)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
          
          <div className="most-popular">
            <h2 className="section-header">Most Popular</h2>
            <div id="most-popular-container">
              {mostPopular.map((a, i) => (
                <div className="popular-item" key={`pop-${a.id}`}>
                  <span className="popular-number">{i + 1}</span>
                  <Link href={`/article/${a.id}`} className="popular-title">{truncateText(a.title, 80)}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 11. EXPLAINER SECTION */}
      <section className="explainer-section">
          <div className="section-wrapper">
              <h2 className="section-header">Explainer</h2>
              <div id="explainer-container">
                  {explainers.length === 0 ? <p>No explainers available.</p> : explainers.map(a => (
                    <div className="explainer-card" key={`exp-${a.id}`}>
                      <div>
                        <span className="explainer-label">EXPLAINER</span>
                        <h3 className="explainer-title">{a.title}</h3>
                        <p className="explainer-subtitle">{truncateText(a.excerpt, 120)}</p>
                      </div>
                      <img src={a.image} alt={a.title} loading="lazy" decoding="async" width={800} height={500} />
                    </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 12. NEWSLETTER SIGNUP */}
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

      {/* 13. FEATURED SECTION */}
      <section className="featured-section">
          <div className="section-wrapper">
              <h2 className="section-header">Featured</h2>
              <FeaturedPaginated articles={bottomFeatured} />
          </div>
      </section>
    </main>
  );
}
