import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, basePath }) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page) => {
    if (page === 1) return basePath === '/page' ? '/' : basePath;
    return basePath === '/page' ? `/page/${page}` : `${basePath}/page/${page}`;
  };

  const renderPageLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      links.push(
        <Link key="1" href={getPageUrl(1)} className="pagination-link">1</Link>
      );
      if (startPage > 2) {
        links.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <Link 
          key={i} 
          href={getPageUrl(i)} 
          className={`pagination-link ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </Link>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        links.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      links.push(
        <Link key={totalPages} href={getPageUrl(totalPages)} className="pagination-link">{totalPages}</Link>
      );
    }

    return links;
  };

  return (
    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '40px 0' }}>
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)} className="pagination-button" style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '4px', textDecoration: 'none', color: '#1e293b' }}>
          &laquo; Prev
        </Link>
      ) : (
        <span className="pagination-button disabled" style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#cbd5e1', cursor: 'not-allowed' }}>
          &laquo; Prev
        </span>
      )}
      
      <div className="pagination-numbers" style={{ display: 'flex', gap: '5px' }}>
        {renderPageLinks()}
      </div>

      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)} className="pagination-button" style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '4px', textDecoration: 'none', color: '#1e293b' }}>
          Next &raquo;
        </Link>
      ) : (
        <span className="pagination-button disabled" style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#cbd5e1', cursor: 'not-allowed' }}>
          Next &raquo;
        </span>
      )}
      <style>{`
        .pagination-link { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 4px; text-decoration: none; color: #1e293b; }
        .pagination-link.active { background-color: #0f172a; color: white; border-color: #0f172a; }
        .pagination-link:hover:not(.active) { background-color: #f1f5f9; }
        .pagination-ellipsis { padding: 8px; color: #94a3b8; }
      `}</style>
    </div>
  );
}
