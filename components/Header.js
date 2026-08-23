'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const MEGA_MENU_DATA = {
  apac: {
    title: 'APAC',
    subcategories: [
      { name: 'Southeast Asia', url: '/category/apac?sub=southeast-asia' },
      { name: 'East Asia', url: '/category/apac?sub=east-asia' },
      { name: 'Geopolitics', url: '/category/apac?sub=geopolitics' },
      { name: 'Trade & Supply Chain', url: '/category/apac?sub=trade' }
    ],
    articles: [
      {
        id: 'art-1',
        title: 'ASEAN Summit 2026: Leaders Forge Historic Agreement on Digital Economy',
        date: 'Jun 17, 2026',
        image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-2',
        title: 'South China Sea Tensions Rise as Maritime Patrols Intensify',
        date: 'Jun 16, 2026',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-3',
        title: 'India-Pacific Security Dialogue Opens in New Delhi with Focus on Tech',
        date: 'Jun 15, 2026',
        image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=120&q=80'
      }
    ]
  },
  economy: {
    title: 'Economy',
    subcategories: [
      { name: 'Macro Economy', url: '/category/economy?sub=macro' },
      { name: 'Trade Deals', url: '/category/economy?sub=trade' },
      { name: 'Inflation & Rates', url: '/category/economy?sub=inflation' },
      { name: 'Real Estate', url: '/category/economy?sub=property' }
    ],
    articles: [
      {
        id: 'art-7',
        title: "China's GDP Growth Surges to 5.8% as Stimulus Measures Fuel Spending",
        date: 'Jun 17, 2026',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-8',
        title: 'Bank of Indonesia Holds Benchmark Rate at 6.00% to Defend Rupiah',
        date: 'Jun 16, 2026',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-9',
        title: 'Southeast Asia Semiconductor Boom Accelerates with Multi-Billion Inflows',
        date: 'Jun 15, 2026',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80'
      }
    ]
  },
  finance: {
    title: 'Finance',
    subcategories: [
      { name: 'Markets & Stocks', url: '/markets' },
      { name: 'Banking & Fintech', url: '/category/finance?sub=fintech' },
      { name: 'Forex & Currencies', url: '/category/finance?sub=forex' },
      { name: 'Digital Assets', url: '/category/finance?sub=crypto' }
    ],
    articles: [
      {
        id: 'art-12',
        title: 'Nikkei 225 Smashes All-Time Record, Closes Above 45,000',
        date: 'Jun 17, 2026',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-13',
        title: 'Singapore Monetary Authority Unveils Comprehensive Green Finance Rulebook',
        date: 'Jun 16, 2026',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-14',
        title: 'Asian Central Banks Step Up Exploration of Cross-Border Wholesale CBDCs',
        date: 'Jun 15, 2026',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80'
      }
    ]
  },
  sport: {
    title: 'Sport',
    subcategories: [
      { name: 'World Cup 2026', url: '/category/sport?sub=world-cup' },
      { name: 'Football', url: '/category/sport?sub=football' },
      { name: 'Badminton', url: '/category/sport?sub=badminton' },
      { name: 'Motorsport & F1', url: '/category/sport?sub=f1' }
    ],
    articles: [
      {
        id: 'art-16',
        title: 'FIFA World Cup 2026: Japan and Australia Draw Powerhouse Groups',
        date: 'Jun 17, 2026',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-17',
        title: 'Indonesia Open 2026: Ginting Advances to Quarter-Finals in Thrilling Match',
        date: 'Jun 16, 2026',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-18',
        title: 'Formula 1 Singapore GP 2026 Sells Out in Record Time for Night Race',
        date: 'Jun 15, 2026',
        image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=120&q=80'
      }
    ]
  },
  opinion: {
    title: 'Opinion',
    subcategories: [
      { name: 'Editorials', url: '/category/opinion?sub=editorials' },
      { name: 'Expert Columns', url: '/category/opinion?sub=columns' },
      { name: 'Economic Analysis', url: '/category/opinion?sub=analysis' }
    ],
    articles: [
      {
        id: 'art-20',
        title: "The Geopolitics of Semiconductors: Why Southeast Asia is Winning the Fab Race",
        date: 'Jun 17, 2026',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-21',
        title: "Navigating the Dollar's New Era: What Asian Central Banks Must Do Next",
        date: 'Jun 16, 2026',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80'
      },
      {
        id: 'art-22',
        title: "RCEP's Fifth Anniversary: A Quiet Transformation of Asian Commerce",
        date: 'Jun 15, 2026',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80'
      }
    ]
  }
};

export default function Header() {
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
            {Object.keys(MEGA_MENU_DATA).map((catKey) => {
              const catData = MEGA_MENU_DATA[catKey];
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
                      {/* Left: Sub-categories */}
                      <div className="mega-subcats-col">
                        <span className="mega-col-title">Subcategories</span>
                        <ul className="mega-subcats-list">
                          {catData.subcategories.map(sub => (
                            <li key={sub.name}>
                              <Link href={sub.url} onClick={closeMenu} className="mega-subcat-link">
                                {sub.name}
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
                          {catData.articles.map(art => (
                            <Link 
                              key={art.id} 
                              href={`/article/${art.id}`} 
                              onClick={closeMenu}
                              className="mega-latest-card"
                            >
                              <img src={art.image} alt={art.title} className="mega-card-thumb" />
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
                      {catData.subcategories.map(sub => (
                        <Link key={sub.name} href={sub.url} onClick={closeMenu} className="mobile-subcat-link">
                          • {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* BUDGET AI BETA LINK */}
            <Link href="/budget" onClick={closeMenu} className="nav-budget-ai-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span className="nav-ai-title">BUDGET AI</span>
              <span className="nav-beta-badge">BETA</span>
            </Link>

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
              <span className="quick-tags-label">Popular searches:</span>
              <button type="button" onClick={() => { setSearchQuery('World Cup'); }} className="tag-pill">World Cup 2026</button>
              <button type="button" onClick={() => { setSearchQuery('ASEAN'); }} className="tag-pill">ASEAN Summit</button>
              <button type="button" onClick={() => { setSearchQuery('Nikkei'); }} className="tag-pill">Nikkei 225</button>
              <button type="button" onClick={() => { setSearchQuery('China GDP'); }} className="tag-pill">China GDP</button>
              <button type="button" onClick={() => { setSearchQuery('Semiconductor'); }} className="tag-pill">Semiconductor</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
