'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { DEFAULT_ARTICLES } from '../../lib/data';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ClientSearch() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndFilter() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        let articles = [];
        if (querySnapshot.empty) {
          articles = DEFAULT_ARTICLES;
        } else {
          querySnapshot.forEach((doc) => {
            articles.push({ id: doc.id, ...doc.data() });
          });
        }

        const queryLower = q.toLowerCase();
        const filtered = articles.filter(a => 
          (a.title && a.title.toLowerCase().includes(queryLower)) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(queryLower)) ||
          (a.category && a.category.toLowerCase().includes(queryLower))
        );

        setResults(filtered);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    }

    if (q) {
      fetchAndFilter();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [q]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3>Searching for &quot;{q}&quot;...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>Search Results</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Showing {results.length} result(s) for <strong>&quot;{q}&quot;</strong>
      </p>

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h3>No articles found matching your query.</h3>
          <p>Try using different keywords or browsing our categories.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {results.map(a => (
            <Link href={`/article/${a.id}`} key={`search-${a.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ position: 'relative', height: '200px', marginBottom: '1rem' }}>
                <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#D97706', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {a.category.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', lineHeight: '1.4' }}>{a.title}</h3>
                <p style={{ margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>{a.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.8rem' }}>
                  <span>{a.author}</span>
                  <span>{formatDate(a.date)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
