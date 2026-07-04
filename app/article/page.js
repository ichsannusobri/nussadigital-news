import { Suspense } from 'react';
import ArticleRedirector from './ArticleRedirector';

export const metadata = {
  title: 'Redirecting to article... | NDNews',
  description: 'Redirecting you to the latest article on NDNews.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ArticleRedirectPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px', fontFamily: 'sans-serif' }}>Loading...</div>}>
      <ArticleRedirector />
    </Suspense>
  );
}
