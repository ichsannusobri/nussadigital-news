import Link from 'next/link';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEFAULT_ARTICLES, TRENDING_TOPICS, getAuthorAvatar } from '../lib/data';
import TimeAgo from '../components/TimeAgo';
import Pagination from '../components/Pagination';
import HeroBetaBanner from '../components/HeroBetaBanner';
import HeroTopicBanner from '../components/HeroTopicBanner';
import SectionHeader from '../components/SectionHeader';
import ArticleCardCompact from '../components/ArticleCardCompact';
import NewsletterBar from '../components/NewsletterBar';

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
  const q = query(collection(db, "articles"), orderBy("date", "desc"));
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
    let mode = 'auto';
    let manualTopics = [];
    if (trendingDoc.exists()) {
      mode = trendingDoc.data().mode || 'auto';
      manualTopics = trendingDoc.data().topics || [];
    }

    if (mode === 'auto') {
      const popularArticles = [...articles]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 6);

      dynamicTrending = popularArticles.map(art => {
        let name = '';
        if (art.tags && art.tags.length > 0) {
          const tag = art.tags[0];
          name = tag.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        } else {
          name = art.category;
        }
        return {
          id: art.id,
          name: name,
          url: `/article/${art.id}`
        };
      });
    } else {
      dynamicTrending = manualTopics.map(t => ({
        id: t.id || Math.random().toString(),
        name: t.name,
        url: `/category/${t.category.toLowerCase()}`
      }));
    }
  } catch (e) {
    console.error("Error fetching trending topics:", e);
  }

  if (dynamicTrending.length === 0) {
    dynamicTrending = TRENDING_TOPICS.map(t => ({ id: t, name: t, url: '/category/apac' }));
  }

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  // Pre-calculate editorial sets
  const homepageArticles = articles.slice(0, 35);
  const featuredArticles = homepageArticles.filter(a => a.isFeatured);
  
  // Hero Lead Article
  const mainArticle = featuredArticles[0] || articles[0];
  
  // Pool of articles excluding main lead
  const poolAfterMain = articles.filter(a => a.id !== mainArticle.id);
  
  // Latest News (first 8 for main column)
  const latestNews = poolAfterMain.slice(0, 8);
  
  // Sport articles
  const sportArticles = articles.filter(a => a.category?.toLowerCase() === 'sport').slice(0, 4);
  const sportHero = sportArticles[0];
  const sportSecondary = sportArticles.slice(1, 4);
  
  // Opinion articles
  const opinionArticles = articles.filter(a => a.category?.toLowerCase() === 'opinion').slice(0, 4);
  
  // Most Popular (Top 10 sorted by views)
  const mostPopular = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  
  // Explainer articles
  const explainers = articles.filter(a => a.category?.toLowerCase() === 'explainer').slice(0, 3);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NDNews",
    "url": "https://nussadigital.co.id",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nussadigital.co.id/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "NDNews",
    "url": "https://nussadigital.co.id",
    "logo": "https://nussadigital.co.id/favicon.png",
    "sameAs": [
      "https://www.linkedin.com/company/ndnews"
    ]
  };

  return (
    <main className="home-page cnn-layout-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <h1 className="sr-only">Latest APAC Economy, Finance & Sports Breaking News</h1>

      {/* 1. CNN-STYLE TOPIC HERO BANNER WITH INTEGRATED TRENDING STRIP */}
      <HeroTopicBanner mainArticle={mainArticle} trendingTopics={dynamicTrending} />

      {/* 2. MAIN 2-COLUMN HOMEPAGE GRID (MAIN 66% + STICKY SIDEBAR 33%) */}
      <div className="cnn-main-container">
        <div className="cnn-homepage-grid">
          
          {/* ================================================================= */}
          {/* LEFT MAIN COLUMN (~66%)                                           */}
          {/* ================================================================= */}
          <div className="cnn-main-column">
            
            {/* LATEST NEWS MODULE */}
            <section className="cnn-section-block">
              <SectionHeader 
                title="Latest News" 
                seeAllLink="/category/apac" 
                seeAllText="See All Latest →" 
              />
              <div className="cnn-latest-cards-list">
                {latestNews.map((art, idx) => (
                  <ArticleCardCompact 
                    key={`latest-${art.id}`} 
                    article={art} 
                    isFeatured={idx === 0} 
                  />
                ))}
              </div>
            </section>

            {/* SPORT MODULE */}
            {sportArticles.length > 0 && (
              <section className="cnn-section-block">
                <SectionHeader 
                  title="APAC Sport & Competitions" 
                  seeAllLink="/category/sport" 
                  seeAllText="See All Sport →" 
                />
                <div className="cnn-sport-layout">
                  {sportHero && (
                    <div className="cnn-sport-hero-card">
                      <ArticleCardCompact 
                        article={sportHero} 
                        isFeatured={true} 
                      />
                    </div>
                  )}
                  <div className="cnn-sport-secondary-grid">
                    {sportSecondary.map(art => (
                      <ArticleCardCompact 
                        key={`sp-${art.id}`} 
                        article={art} 
                        isFeatured={false} 
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* EXPLAINER MODULE */}
            {explainers.length > 0 && (
              <section className="cnn-section-block">
                <SectionHeader 
                  title="Deep Explainer & Regional Insights" 
                  seeAllLink="/category/explainer" 
                  seeAllText="See All Explainers →" 
                />
                <div className="cnn-explainer-grid">
                  {explainers.map(art => (
                    <ArticleCardCompact 
                      key={`exp-${art.id}`} 
                      article={art} 
                      isFeatured={false} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* PAGINATION */}
            <div className="cnn-pagination-block">
              <Pagination currentPage={1} totalPages={totalPages} basePath="/page" />
            </div>

          </div>

          {/* ================================================================= */}
          {/* RIGHT STICKY SIDEBAR (~33%)                                       */}
          {/* ================================================================= */}
          <aside className="cnn-sticky-sidebar">
            
            {/* 1. BUDGET AI BETA PROMO CARD */}
            <HeroBetaBanner />

            {/* 2. MOST POPULAR NUMBERED 1-10 MODULE (CNN STYLE) */}
            <div className="cnn-sidebar-widget cnn-widget-popular">
              <SectionHeader 
                title="Most Popular" 
                seeAllLink="/category/finance" 
                seeAllText="Top Read →" 
              />
              <div className="cnn-popular-list">
                {mostPopular.map((art, idx) => (
                  <Link href={`/article/${art.id}`} key={`pop-${art.id}`} className="cnn-popular-item">
                    <span className="cnn-popular-rank">{idx + 1}</span>
                    <div className="cnn-popular-info">
                      <span className="cnn-popular-cat-tag">{(art.category || 'News').toUpperCase()}</span>
                      <h4 className="cnn-popular-title">{truncateText(art.title, 75)}</h4>
                      <span className="cnn-popular-time"><TimeAgo date={art.date} /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. OPINION & ANALYSIS WIDGET */}
            {opinionArticles.length > 0 && (
              <div className="cnn-sidebar-widget cnn-widget-opinion">
                <SectionHeader 
                  title="Opinion & Analysis" 
                  seeAllLink="/category/opinion" 
                  seeAllText="See All →" 
                />
                <div className="cnn-opinion-list">
                  {opinionArticles.map(art => {
                    const avatarUrl = getAuthorAvatar(art.author);
                    return (
                      <Link href={`/article/${art.id}`} key={`op-${art.id}`} className="cnn-opinion-item">
                        <div className="cnn-opinion-avatar-wrap">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={art.author} className="cnn-opinion-avatar-img" />
                          ) : (
                            <div className="cnn-opinion-avatar-fallback">{getInitials(art.author)}</div>
                          )}
                        </div>
                        <div className="cnn-opinion-info">
                          <h4 className="cnn-opinion-title">{truncateText(art.title, 65)}</h4>
                          <span className="cnn-opinion-author-name">{art.author}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </aside>

        </div>
      </div>

      {/* 3. FULL-WIDTH NEWSLETTER SIGNUP BAR BEFORE FOOTER */}
      <NewsletterBar />
    </main>
  );
}
