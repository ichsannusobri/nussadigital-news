import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import Header from '../components/Header';
import CookieConsent from '../components/CookieConsent';

export const metadata = {
  metadataBase: new URL('https://nussadigital.co.id'),
  title: 'NDNews - APAC Economy, Finance & Sports News',
  description: 'NDNews delivers breaking news, in-depth analysis and coverage of economy, finance and sports across Asia-Pacific. Your trusted APAC news source.',
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
    description: 'NDNews delivers breaking news, in-depth analysis and coverage of economy, finance and sports across Asia-Pacific. Your trusted APAC news source.',
    url: 'https://nussadigital.co.id',
    siteName: 'NDNews',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'NDNews - APAC Economy, Finance & Sports News',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NDNews - APAC Economy, Finance & Sports News',
    description: 'NDNews delivers breaking news, in-depth analysis and coverage of economy, finance and sports across Asia-Pacific. Your trusted APAC news source.',
    images: ['/og-home.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          img { max-width: 100%; height: auto; }
          .header-logo-img { height: 28px !important; width: auto !important; max-height: 28px !important; object-fit: contain !important; }
        `}</style>
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B5Q5GW1QX0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B5Q5GW1QX0');
          `}
        </Script>
        
        <span className="sr-only">NDNews - Latest APAC Economy, Finance & Sports News</span>

        <Header />

        {children}

        <CookieConsent />

        {/* CNN-INSPIRED COMPREHENSIVE FOOTER */}
        <footer className="main-footer">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-col footer-brand-col">
                <Link href="/" className="logo footer-logo">
                  <img src="/favicon.png" alt="ND" className="header-logo-img" style={{ height: '32px', width: 'auto' }} />
                  ND<span>News</span>
                </Link>
                <p className="footer-desc">
                  Your trusted digital news portal for breaking news, business, macroeconomic analysis, and sports across the Asia-Pacific region.
                </p>
                <div className="footer-social-row">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="X (Twitter)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34m1.39 9.74v-8.37H5.07v8.37h2.78z"/></svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 16.81 22 12 22 12s0-4.81-.42-4.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                  </a>
                  <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="RSS Feed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 17.82a2.18 2.18 0 1 1 0-4.36 2.18 2.18 0 0 1 0 4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-3.34A12.22 12.22 0 0 0 4 7.78V4.44zm0 6.66A8.9 8.9 0 0 1 12.9 20H9.56A5.56 5.56 0 0 0 4 14.44V11.1z"/></svg>
                  </a>
                </div>
              </div>

              <div className="footer-col">
                <h3>Sections</h3>
                <Link href="/category/apac">APAC News</Link>
                <Link href="/category/economy">Economy & Growth</Link>
                <Link href="/category/finance">Finance & Markets</Link>
                <Link href="/category/sport">APAC Sport</Link>
                <Link href="/category/opinion">Opinion & Analysis</Link>
                <Link href="/category/explainer">Deep Explainers</Link>
              </div>

              <div className="footer-col">
                <h3>Special Features</h3>
                <Link href="/budget" style={{ color: '#F59E0B', fontWeight: '700' }}>Budget AI Advisor (Beta)</Link>
                <Link href="/markets" style={{ color: '#3B82F6', fontWeight: '700' }}>Live Financial Markets</Link>
                <Link href="/archive">Complete News Archive</Link>
                <Link href="/feed.xml">RSS News Feed</Link>
              </div>

              <div className="footer-col">
                <h3>Company</h3>
                <Link href="/about">About NDNews</Link>
                <Link href="/contact">Contact Editorial</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Use</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Nussa Digital News (NDNews). All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
