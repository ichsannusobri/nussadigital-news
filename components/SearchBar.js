'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
      setQuery('');
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className={`search-form ${isExpanded ? 'expanded' : ''}`}>
        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          autoFocus={isExpanded}
          onBlur={() => {
            if (!query.trim()) setIsExpanded(false);
          }}
        />
        <button 
          type="button" 
          className="search-btn" 
          aria-label="Search"
          onClick={() => {
            if (isExpanded && query.trim()) {
              handleSearch(new Event('submit'));
            } else {
              setIsExpanded(!isExpanded);
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </form>
    </div>
  );
}
