"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isClient, setIsClient] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const consent = localStorage.getItem('ndnews_cookie_consent');
    if (consent) {
      setHasConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ndnews_cookie_consent', 'accepted');
    setHasConsent(true);
  };

  const handleDecline = () => {
    localStorage.setItem('ndnews_cookie_consent', 'declined');
    setHasConsent(true);
  };

  if (isClient && hasConsent) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-content">
        <div className="cookie-consent-text">
          <p>
            We use cookies to enhance your experience, analyze site traffic, and serve personalized advertisements through Google AdSense. 
            By clicking &quot;Accept All&quot;, you consent to our use of cookies. Read our <Link href="/privacy">Privacy Policy</Link> for details.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button onClick={handleDecline} className="btn-cookie-secondary">
            Decline
          </button>
          <button onClick={handleAccept} className="btn-cookie-primary">
            Accept All
          </button>
        </div>
      </div>
      <style jsx global>{`
        .cookie-consent-banner {
          position: fixed;
          bottom: 20px;
          right: 20px;
          max-width: 450px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 20px;
          z-index: 9999;
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        [data-theme='dark'] .cookie-consent-banner {
          background: rgba(17, 24, 39, 0.95);
          border-color: #374151;
          color: #f3f4f6;
        }

        .cookie-consent-content {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .cookie-consent-text p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          color: #4b5563;
        }

        [data-theme='dark'] .cookie-consent-text p {
          color: #9ca3af;
        }

        .cookie-consent-text a {
          color: #d97706;
          text-decoration: underline;
          font-weight: 500;
        }

        .cookie-consent-text a:hover {
          color: #b45309;
        }

        .cookie-consent-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-cookie-primary {
          background: #d97706;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }

        .btn-cookie-primary:hover {
          background: #b45309;
          transform: translateY(-1px);
        }

        .btn-cookie-secondary {
          background: transparent;
          color: #4b5563;
          border: 1px solid #d1d5db;
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        [data-theme='dark'] .btn-cookie-secondary {
          color: #d1d5db;
          border-color: #4b5563;
        }

        .btn-cookie-secondary:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        [data-theme='dark'] .btn-cookie-secondary:hover {
          background: #1f2937;
          border-color: #6b7280;
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .cookie-consent-banner {
            bottom: 10px;
            left: 10px;
            right: 10px;
            max-width: none;
            border-radius: 8px;
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
