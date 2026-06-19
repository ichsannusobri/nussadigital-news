"use client";
import { useEffect } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ViewCounter({ articleId }) {
  useEffect(() => {
    if (!articleId) return;
    
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
