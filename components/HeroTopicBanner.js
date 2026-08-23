'use client';

import Link from 'next/link';
import { getOptimizedImageUrl } from '../lib/data';

export default function HeroTopicBanner({ mainArticle, trendingTopics = [] }) {
  if (!mainArticle) return null;

  return (
    <div className="cnn-hero-topic-wrapper">
      {/* 1. TOPIC LEAD HERO BANNER */}
      <div className="cnn-hero-banner-container">
        <div className="cnn-hero-banner-bg">
          <img 
            src={getOptimizedImageUrl(mainArticle.image, 1200)} 
            alt={mainArticle.title}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="cnn-hero-bg-img"
          />
          <div className="cnn-hero-gradient-overlay" />
        </div>

        <div className="cnn-hero-content-box">
          <div className="cnn-hero-top-badges">
            <span className="cnn-topic-pill">
              {mainArticle.category ? mainArticle.category.toUpperCase() : "TOP STORY"}
            </span>
            <Link href="/markets" className="cnn-live-markets-pill">
              <span className="pulsing-live-dot" />
              LIVE MARKETS
            </Link>
          </div>

          <Link href={`/article/${mainArticle.id}`} className="cnn-hero-title-link">
            <h1 className="cnn-hero-headline">{mainArticle.title}</h1>
          </Link>

          {mainArticle.excerpt && (
            <p className="cnn-hero-description">
              {mainArticle.excerpt}
            </p>
          )}

          <div className="cnn-hero-meta-row">
            <span className="cnn-hero-author">By {mainArticle.author}</span>
            <span className="cnn-hero-read-more">
              <Link href={`/article/${mainArticle.id}`}>Read Full Story →</Link>
            </span>
          </div>
        </div>
      </div>

      {/* 2. TRENDING TOPICS STRIP */}
      {trendingTopics.length > 0 && (
        <div className="cnn-trending-strip">
          <div className="trending-strip-inner">
            <span className="trending-strip-label">🔥 Trending:</span>
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
