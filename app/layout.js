import './globals.css';
import Link from 'next/link';

export const metadata = {
  metadataBase: new URL('https://nussadigital.co.id'),
  title: 'NDNews - APAC Economy, Finance & Sports News',
  description: 'NDNews delivers the latest breaking news, in-depth analysis and coverage of economy, finance and sports across the Asia-Pacific region.',
  icons: {
    icon: '/favicon.png',
  },
  alternates: {
    canonical: '/',
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
    <html lang="en">
      <body>
        {/* SEO H1 Tag */}
        <h1 className="sr-only">NDNews - Latest APAC Economy, Finance & Sports News</h1>

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
              <Link href="/category/apac">APAC</Link>
              <Link href="/category/economy">Economy</Link>
              <Link href="/category/finance">Finance</Link>
              <Link href="/category/sport">Sport</Link>
              <Link href="/category/opinion">Opinion</Link>
            </nav>
            <div className="header-right">
              <button className="search-btn" aria-label="Search">🔍</button>
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
                <div className="social-links">
                  <a href="https://x.com/nussadigital" aria-label="X (Twitter)">𝕏</a>
                  <a href="https://facebook.com/nussadigital" aria-label="Facebook">f</a>
                  <a href="https://youtube.com/nussadigital" aria-label="YouTube">▶</a>
                  <a href="https://instagram.com/nussadigital" aria-label="Instagram">📸</a>
                </div>
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
                <Link href="/category/opinion">Opinions & Analysis</Link>
                <a href="#">Newsletters</a>
                <a href="#">Podcasts</a>
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
