import Link from 'next/link';
import { getOptimizedImageUrl } from '../lib/data';
import TimeAgo from './TimeAgo';

// Homepage lead grid: one lead story (left, 50%) and two latest stories
// stacked on the right (25% each). Server-rendered; no client JS needed.

function Card({ article, variant }) {
  const isLead = variant === 'lead';
  return (
    <article className={`hg-card ${isLead ? 'hg-lead' : 'hg-side'}`}>
      <Link href={`/article/${article.id}`} className="hg-link" aria-label={article.title}>
        <img
          src={getOptimizedImageUrl(article.image, isLead ? 1100 : 640)}
          alt=""
          aria-hidden="true"
          className="hg-img"
          loading={isLead ? 'eager' : 'lazy'}
          fetchPriority={isLead ? 'high' : 'auto'}
          decoding="async"
          width={isLead ? 1100 : 640}
          height={isLead ? 688 : 400}
        />
        <div className="hg-shade" />
        <div className="hg-body">
          <span className="hg-pill">{(article.category || 'News').toUpperCase()}</span>
          {isLead ? (
            <h2 className="hg-title hg-title-lead">{article.title}</h2>
          ) : (
            <h3 className="hg-title hg-title-side">{article.title}</h3>
          )}
          {isLead && article.excerpt && <p className="hg-excerpt">{article.excerpt}</p>}
          <div className="hg-meta">
            {isLead && <span>By {article.author}</span>}
            {isLead && <span aria-hidden="true">·</span>}
            <TimeAgo date={article.date} />
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function HeroTopicBanner({ mainArticle, sideArticles = [], trendingTopics = [] }) {
  if (!mainArticle) return null;
  const sides = sideArticles.slice(0, 2);

  return (
    <div className="cnn-hero-topic-wrapper">
      <section className="hg-grid" aria-label="Top stories">
        <Card article={mainArticle} variant="lead" />
        {sides.map((a) => <Card key={a.id} article={a} variant="side" />)}
      </section>

      {trendingTopics.length > 0 && (
        <div className="cnn-trending-strip">
          <div className="trending-strip-inner">
            <span className="trending-strip-label">Trending:</span>
            <div className="trending-strip-scroll">
              {trendingTopics.map(topic => (
                <Link key={topic.id} href={topic.url} className="trending-strip-item">
                  #{topic.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
