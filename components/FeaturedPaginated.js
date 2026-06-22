'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FeaturedPaginated({ articles }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  if (!articles || articles.length === 0) return null;

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Optional: Smooth scroll to the top of the featured section
    const element = document.getElementById('featured-container');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="featured-grid" id="featured-container">
        {currentArticles.map((a) => (
          <div className="featured-card" key={`feat-${a.id}`}>
            <Link href={`/article/${a.id}`}>
              <img src={a.image} alt={a.title} loading="lazy" width={800} height={500} />
              <div className="card-body">
                <span className="card-category">{(a.category || '').toUpperCase()}</span>
                <h3 className="card-title">{a.title}</h3>
                <span className="card-meta">{a.author} &bull; {formatDate(a.date)}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="pagination-btn"
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
