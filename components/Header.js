'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
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
          <Link href="/" onClick={closeMenu}>Home</Link>
          
          <Link href="/budget" onClick={closeMenu} className="nav-budget-ai-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span className="nav-ai-title">BUDGET AI</span>
            <span className="nav-beta-badge">BETA</span>
          </Link>

          <Link href="/markets" onClick={closeMenu} style={{ color: 'var(--brand-primary)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            MARKETS
          </Link>
          <Link href="/category/apac" onClick={closeMenu}>APAC</Link>
          <Link href="/category/economy" onClick={closeMenu}>Economy</Link>
          <Link href="/category/finance" onClick={closeMenu}>Finance</Link>
          <Link href="/category/sport" onClick={closeMenu}>Sport</Link>
          <Link href="/category/opinion" onClick={closeMenu}>Opinion</Link>
        </nav>
        <div className="header-right">
          <ThemeToggle />
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
