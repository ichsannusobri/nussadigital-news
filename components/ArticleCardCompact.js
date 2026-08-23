'use client';

import Link from 'next/link';
import { getOptimizedImageUrl } from '../lib/data';

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

export default function ArticleCardCompact({ article, isFeatured = false }) {
  if (!article) return null;

  const categoryName = article.category || 'General';
  const categoryLower = categoryName.toLowerCase();

  return (
    <article className={`cnn-article-card ${isFeatured ? 'cnn-card-featured' : 'cnn-card-compact'}`}>
      <Link href={`/article/${article.id}`} className="cnn-card-img-link">
        <img 
          src={getOptimizedImageUrl(article.image, isFeatured ? 500 : 240)} 
          alt={article.title}
          loading="lazy"
          decoding="async"
          className="cnn-card-img"
          width={isFeatured ? 500 : 240}
          height={isFeatured ? 312 : 160}
        />
      </Link>
      
      <div className="cnn-card-content">
        <div className="cnn-card-category-row">
          <span className={`cnn-category-pill cat-pill-${categoryLower}`}>
            {categoryName.toUpperCase()}
          </span>
        </div>

        <Link href={`/article/${article.id}`} className="cnn-card-title-link">
          <h3 className="cnn-card-title">
            {article.title}
          </h3>
        </Link>

        {isFeatured && article.excerpt && (
          <p className="cnn-card-excerpt">
            {truncateText(article.excerpt, 130)}
          </p>
        )}

        <div className="cnn-card-meta">
          <span className="cnn-meta-author">{article.author}</span>
          <span className="cnn-meta-dot">•</span>
          <span className="cnn-meta-date">{formatDate(article.date)}</span>
        </div>
      </div>
    </article>
  );
}
