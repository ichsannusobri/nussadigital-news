'use client';

import { useState } from 'react';

export default function NewsletterBar() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="cnn-newsletter-bar">
      <div className="newsletter-bar-container">
        <div className="newsletter-bar-left">
          <span className="newsletter-badge">STAY INFORMED</span>
          <h3>Subscribe to NDNews Morning Briefing</h3>
          <p>Get essential APAC economic, financial, and market insights delivered to your inbox every morning.</p>
        </div>
        
        {subscribed ? (
          <div className="newsletter-success-box" style={{ background: '#065F46', color: '#34D399', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem' }}>
            ✓ Thank you for subscribing! Check your inbox soon.
          </div>
        ) : (
          <form className="newsletter-bar-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="newsletter-bar-input" 
            />
            <button type="submit" className="newsletter-bar-btn">Subscribe Free</button>
          </form>
        )}
      </div>
    </section>
  );
}
