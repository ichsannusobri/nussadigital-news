'use client';

import { useState } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ClientNewsFeed({ lastArticleDate }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const loadMoreArticles = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      let q;
      if (lastDoc) {
        // If we already loaded some client-side articles, start after the last one we fetched
        q = query(
          collection(db, "articles"),
          orderBy("date", "desc"),
          startAfter(lastDoc),
          limit(6)
        );
      } else {
        // First client-side load: we need to fetch starting AFTER the last statically rendered article
        // Since we only have the date string from the static prop, we must use a where/orderBy trick 
        // or just fetch by date. Firestore startAfter can accept the raw value if ordered by it.
        q = query(
          collection(db, "articles"),
          orderBy("date", "desc"),
          startAfter(lastArticleDate),
          limit(6)
        );
      }

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setHasMore(false);
      } else {
        const newArticles = [];
        querySnapshot.forEach((doc) => {
          newArticles.push({ id: doc.id, ...doc.data() });
        });
        
        setArticles(prev => [...prev, ...newArticles]);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        
        if (newArticles.length < 6) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMore && articles.length === 0) return null;

  return (
    <div className="client-news-feed">
      {articles.length > 0 && (
        <div className="featured-grid" id="more-news-container">
          {articles.map((a) => (
            <div className="featured-card" key={`more-${a.id}`}>
              <Link href={`/article/${a.id}`}>
                <img src={a.image} alt={a.title} loading="lazy" decoding="async" width={800} height={500} />
                <div className="card-body">
                  <span className="card-category">{(a.category || '').toUpperCase()}</span>
                  <h3 className="card-title">{a.title}</h3>
                  <span className="card-meta">{a.author} &bull; {formatDate(a.date)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
          <button 
            onClick={loadMoreArticles} 
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#111827',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Loading...' : 'Load More News'}
          </button>
        </div>
      )}
    </div>
  );
}
