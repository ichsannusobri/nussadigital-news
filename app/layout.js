import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import Header from '../components/Header';
import CookieConsent from '../components/CookieConsent';

export const metadata = {
  metadataBase: new URL('https://nussadigital.co.id'),
  title: {
    default: 'NDNews - APAC Economy, Finance & Sports News',
    template: '%s | NDNews',
  },
  description: 'NDNews delivers breaking news, in-depth analysis and coverage of economy, finance and sports across Asia-Pacific. Your trusted APAC news source.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    types: { 'application/rss+xml': 'https://nussadigital.co.id/feed.xml' },
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

const SITE_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': 'https://nussadigital.co.id/#organization',
    name: 'NDNews (Nussa Digital News)',
    url: 'https://nussadigital.co.id',
    logo: { '@type': 'ImageObject', url: 'https://nussadigital.co.id/favicon.png' },
    parentOrganization: { '@type': 'Organization', name: 'PT Nussa Digital Solusi' },
    publishingPrinciples: 'https://nussadigital.co.id/about',
    // TODO: add real official social profile URLs here (sameAs) once they exist.
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://nussadigital.co.id/#website',
    name: 'NDNews',
    url: 'https://nussadigital.co.id',
    inLanguage: 'en',
    publisher: { '@id': 'https://nussadigital.co.id/#organization' },
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2449102925093409"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSONLD) }}
        />
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
