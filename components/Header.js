'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

import { getOptimizedImageUrl } from '../lib/data';

export default function Header({ menu = { categories: [], popularTopics: [] } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchInputRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    setExpandedMobileCat(null);
  };

  const handleOpenSearch = () => {
    setShowSearchOverlay(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchOverlay(false);
      setSearchQuery('');
    }
  };

  // Close search on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSearchOverlay(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="main-header">
        <div className="header-container">
          <div className="header-left">
            <button 
              className="mobile-menu-btn" 
              aria-label="Toggle menu"
              onClick={toggleMenu}
              style={{ fontSize: '1.5rem', background: 'none', border: 'none', color: 'var(--clr-text-primary)', cursor: 'pointer' }}
            >
              {isOpen ? '✕' : '☰'}
            </button>
            <Link href="/" className="logo" onClick={closeMenu}>
              <img src="/favicon.png" alt="ND" className="header-logo-img" style={{ height: '28px', width: 'auto', maxHeight: '28px', objectFit: 'contain' }} />
              ND<span>News</span>
            </Link>
          </div>

          <nav className={`main-nav ${isOpen ? 'mobile-open' : ''}`}>
            <Link href="/" onClick={closeMenu} className="nav-item-link">Home</Link>
            
            {/* MEGA MENU CATEGORIES */}
            {menu.categories.map((catData) => {
              const catKey = catData.key;
              const isHovered = activeDropdown === catKey;
              const isMobileExpanded = expandedMobileCat === catKey;

              return (
                <div 
                  key={catKey}
                  className={`nav-mega-item ${isHovered ? 'active' : ''}`}
                  onMouseEnter={() => setActiveDropdown(catKey)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="nav-cat-header-row">
                    <Link 
                      href={`/category/${catKey}`} 
                      onClick={closeMenu}
                      className="nav-item-link"
                    >
                      {catData.title}
                    </Link>
                    <button 
                      className="mobile-accordion-toggle"
                      onClick={() => setExpandedMobileCat(isMobileExpanded ? null : catKey)}
                      aria-label={`Toggle ${catData.title} submenu`}
                    >
                      {isMobileExpanded ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* DESKTOP MEGA MENU DROPDOWN */}
                  <div className={`mega-menu-dropdown ${isHovered ? 'visible' : ''}`}>
                    <div className="mega-menu-container">
                      {/* Left: topics derived from real article tags */}
                      <div className="mega-subcats-col">
                        <span className="mega-col-title">Topics</span>
                        <ul className="mega-subcats-list">
                          {catData.topics.map(t => (
                            <li key={t}>
                              <Link href={`/search?q=${encodeURIComponent(t)}`} onClick={closeMenu} className="mega-subcat-link">
                                {t}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link href={`/category/${catKey}`} onClick={closeMenu} className="mega-view-all-link">
                          All {catData.title} News →
                        </Link>
                      </div>

                      {/* Right: LATEST 3 Articles */}
                      <div className="mega-latest-col">
                        <span className="mega-col-title">LATEST {catData.title.toUpperCase()}</span>
                        <div className="mega-latest-grid">
                          {catData.articles.length === 0 && (
                            <p className="mega-empty">New stories coming soon.</p>
                          )}
                          {catData.articles.map(art => (
                            <Link 
                              key={art.id} 
                              href={`/article/${art.id}`} 
                              onClick={closeMenu}
                              className="mega-latest-card"
                            >
                              <img src={getOptimizedImageUrl(art.image, 120)} alt="" aria-hidden="true" className="mega-card-thumb" loading="lazy" width={60} height={45} />
                              <div className="mega-card-info">
                                <h4 className="mega-card-title">{art.title}</h4>
                                <span className="mega-card-date">{art.date}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MOBILE ACCORDION DRAWER */}
                  {isMobileExpanded && (
                    <div className="mobile-subnav-drawer">
                      {catData.articles.map(art => (
                        <Link key={art.id} href={`/article/${art.id}`} onClick={closeMenu} className="mobile-subcat-link">
                          • {art.title}
                        </Link>
                      ))}
                      <Link href={`/category/${catKey}`} onClick={closeMenu} className="mobile-subcat-link">
                        All {catData.title} News →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

            {/* MARKETS LINK */}
            <Link href="/markets" onClick={closeMenu} style={{ color: 'var(--brand-primary)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              MARKETS
            </Link>
          </nav>

          <div className="header-right">
            <ThemeToggle />
            <button 
              onClick={handleOpenSearch} 
              className="btn-header-search-icon" 
              aria-label="Open search overlay"
              title="Search News"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* PERSISTENT SEARCH OVERLAY MODAL */}
      {showSearchOverlay && (
        <div className="cnn-search-overlay" onClick={() => setShowSearchOverlay(false)}>
          <div className="cnn-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cnn-search-modal-header">
              <span className="search-modal-label">Search NDNews Portal</span>
              <button onClick={() => setShowSearchOverlay(false)} className="btn-close-search">✕</button>
            </div>

            <form onSubmit={handleSearchSubmit} className="cnn-search-form">
              <div className="cnn-search-input-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-modal-icon">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type topic, keyword, country, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="cnn-search-input"
                />
              </div>
              <button type="submit" className="btn-search-submit">Search</button>
            </form>

            <div className="cnn-search-quick-tags">
              <span className="quick-tags-label">Popular topics:</span>
              {menu.popularTopics.map(t => (
                <button key={t} type="button" onClick={() => { setSearchQuery(t); }} className="tag-pill">{t}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
