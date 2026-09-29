import Link from 'next/link';
import snapshot from '../data/market-snapshot.json';

// Server-rendered market summary strip (no third-party scripts).
// Data comes from data/market-snapshot.json, updated each trading day after the Asia close.
// Item flags: static (policy rate), closed (market holiday: last close shown), pending, intraday.

function fmt(item) {
  if (item.value === null || item.value === undefined) return '—';
  const n = Number(item.value).toLocaleString('en-US', {
    minimumFractionDigits: item.decimals ?? 2,
    maximumFractionDigits: item.decimals ?? 2,
  });
  return `${item.prefix || ''}${n}${item.suffix || ''}`;
}

function Item({ item }) {
  const up = (item.changePct ?? 0) > 0;
  const down = (item.changePct ?? 0) < 0;
  const color = up ? '#15803D' : down ? '#B91C1C' : 'var(--clr-text-secondary, #6B7280)';
  return (
    <span className="mts-item">
      <span className="mts-name">{item.name}</span>
      <span className="mts-value">{fmt(item)}</span>
      {item.static ? (
        <span className="mts-chg" style={{ color: 'var(--clr-text-secondary, #6B7280)' }}>policy</span>
      ) : item.closed ? (
        <span className="mts-chg" style={{ color: 'var(--clr-text-secondary, #6B7280)' }}>closed</span>
      ) : item.pending ? (
        <span className="mts-chg" style={{ color: 'var(--clr-text-secondary, #6B7280)' }}>updating</span>
      ) : (
        <span className="mts-chg" style={{ color }}>
          {up ? '▲' : down ? '▼' : '■'} {Math.abs(item.changePct).toFixed(2)}%{item.intraday ? '*' : ''}
        </span>
      )}
    </span>
  );
}

export default function MarketTickerStrip() {
  const items = snapshot.items;
  const d = new Date(snapshot.updatedAt);
  const stamp = d.toLocaleString('en-GB', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  return (
    <section className="mts" aria-label="Market summary">
      <Link href="/markets" className="mts-link" aria-label="Open NDNews Markets for details">
        <div className="mts-meta">
          <span className="mts-badge">MARKETS</span>
          <span className="mts-stamp">{snapshot.session} · {stamp} WIB</span>
        </div>
        <div className="mts-viewport">
          <div className="mts-track">
            {items.map((it) => <Item key={`a-${it.name}`} item={it} />)}
            <span className="mts-sep" aria-hidden="true" />
            {items.map((it) => <Item key={`b-${it.name}`} item={it} />)}
          </div>
        </div>
        <span className="mts-cta">Details →</span>
      </Link>
      <p className="mts-foot">Closing levels compiled by NDNews from exchange and news-agency data; * intraday. Not investment advice.</p>
    </section>
  );
}
