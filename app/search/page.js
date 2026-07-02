import { Suspense } from 'react';
import ClientSearch from './ClientSearch';

export const metadata = {
  title: 'Search - NDNews',
  description: 'Search for the latest news across the Asia-Pacific region.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <main className="search-page-container">
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 20px' }}><h3>Loading search...</h3></div>}>
        <ClientSearch />
      </Suspense>
    </main>
  );
}
