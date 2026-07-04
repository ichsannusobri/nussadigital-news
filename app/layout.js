import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import ThemeToggle from '../components/ThemeToggle';
import SearchBar from '../components/SearchBar';

export const metadata = {
  metadataBase: new URL('https://nussadigital.co.id'),
  title: 'NDNews - APAC Economy, Finance & Sports News',
  description: 'NDNews delivers the latest breaking news, in-depth analysis and coverage of economy, finance and sports across the Asia-Pacific region.',
  icons: {
    icon: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    title: 'NDNews - APAC Economy, Finance & Sports News',
    description: 'NDNews delivers the latest breaking news, in-depth analysis and coverage of economy, finance and sports across the Asia-Pacific region.',
    url: 'https://nussadigital.co.id',
    siteName: 'NDNews',
    images: [
      {
        url: '/favicon.png', // Will fallback to actual images on article pages
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NDNews - APAC Economy, Finance & Sports News',
    description: 'NDNews delivers the latest breaking news, in-depth analysis and coverage of economy, finance and sports across the Asia-Pacific region.',
    images: ['/favicon.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2449102925093409"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var localTheme = window.localStorage.getItem('theme');
                  var sysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (localTheme === 'dark' || (!localTheme && sysTheme)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {/* SR-only Site Title */}
        <span className="sr-only">NDNews - Latest APAC Economy, Finance & Sports News</span>

        <header className="main-header">
          <div className="header-container">
            <div className="header-left">
              <button className="mobile-menu-btn" aria-label="Toggle menu">☰</button>
              <Link href="/" className="logo">
                <img src="/favicon.png" alt="ND" className="header-logo-img" />
                ND<span>News</span>
              </Link>
            </div>
            <nav className="main-nav">
              <Link href="/">Home</Link>
              <Link href="/markets" style={{ color: 'var(--brand-primary)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                MARKETS
              </Link>
              <Link href="/category/apac">APAC</Link>
              <Link href="/category/economy">Economy</Link>
              <Link href="/category/finance">Finance</Link>
              <Link href="/category/sport">Sport</Link>
              <Link href="/category/opinion">Opinion</Link>
            </nav>
            <div className="header-right">
              <ThemeToggle />
              <SearchBar />
            </div>
          </div>
        </header>

        {children}

        <footer className="main-footer">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-col">
                <Link href="/" className="logo" style={{fontSize: '2rem', marginBottom: '1rem', display: 'block'}}>ND<span style={{fontWeight: 400}}>News</span></Link>
                <p>Your trusted source for breaking news, in-depth analysis, and exclusive coverage across the Asia-Pacific region.</p>
              </div>

              <div className="footer-col">
                <h3>Sections</h3>
                <Link href="/category/apac">APAC</Link>
                <Link href="/category/economy">Economy</Link>
                <Link href="/category/finance">Finance</Link>
                <Link href="/category/sport">Sport</Link>
                <Link href="/category/opinion">Opinion</Link>
              </div>
              <div className="footer-col">
                <h3>About Us</h3>
                <Link href="/about">About NDNews</Link>
                <Link href="/contact">Contact Us</Link>
                <Link href="/terms">Terms of Use</Link>
                <Link href="/privacy">Privacy Policy</Link>
              </div>
              <div className="footer-col">
                <h3>Network</h3>
                <Link href="/archive">News Archive</Link>
                <Link href="/category/opinion">Opinions & Analysis</Link>
                <Link href="/category/economy">Economy Insights</Link>
                <Link href="/category/sport">Sport Highlights</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Nussa Digital News. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
