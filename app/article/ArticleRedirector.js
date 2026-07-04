'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ArticleRedirector() {
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
