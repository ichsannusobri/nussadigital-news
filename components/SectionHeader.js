'use client';

import Link from 'next/link';

export default function SectionHeader({ title, seeAllLink, seeAllText = "See All →", badge }) {
  return (
    <div className="cnn-section-header">
      <div className="section-title-wrap">
        <h2 className="section-title-text">{title}</h2>
        {badge && <span className="section-header-badge">{badge}</span>}
      </div>
      {seeAllLink && (
        <Link href={seeAllLink} className="section-see-all-link">
          {seeAllText}
        </Link>
      )}
    </div>
  );
}
