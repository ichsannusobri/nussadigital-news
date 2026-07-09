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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2449102925093409"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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

        <Header />

        {children}

        <CookieConsent />

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
