'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ArticleRedirector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      // Redirect old ?id= format to the new SEO-friendly /[slug] format
      router.replace(`/article/${id}`);
    } else {
      // If no ID is provided, go back to home
      router.replace('/');
    }
  }, [router, searchParams]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', fontFamily: 'sans-serif' }}>
      <p>Redirecting to article...</p>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px', fontFamily: 'sans-serif' }}>Loading...</div>}>
      <ArticleRedirector />
    </Suspense>
  );
}
