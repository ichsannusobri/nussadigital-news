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
          🔍
        </button>
      </form>
    </div>
  );
}
