"use client";
import { useEffect } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ViewCounter({ articleId }) {
  useEffect(() => {
    if (!articleId) return;

    // 1. Skip if the client is a search engine bot, crawler, or performance test tool
    const isBot = /bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex|lighthouse/i.test(navigator.userAgent);
    if (isBot) return;
    
    try {
      // 2. Throttle view counts to once per 24 hours per user session using localStorage
      const storageKey = `ndnews_viewed_${articleId}`;
      const lastViewed = localStorage.getItem(storageKey);
      const now = Date.now();
      
      if (lastViewed && now - parseInt(lastViewed) < 86400000) {
        return; // Already counted in the last 24 hours
      }
      
      localStorage.setItem(storageKey, now.toString());
    } catch (e) {
      // Fallback if localStorage is disabled/unavailable in browser
      console.warn("localStorage not available, proceeding without throttle.", e);
    }
    
    // Increment the views count in Firebase
    const docRef = doc(db, 'articles', articleId);
    updateDoc(docRef, {
      views: increment(1)
    }).catch(err => {
      console.error("Failed to increment view count:", err);
    });
  }, [articleId]);

  return null;
}
