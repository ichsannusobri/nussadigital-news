import Link from 'next/link';
import data from '../../../data/central-bank-rates.json';
import { SITE_URL } from '../../../lib/data';

const PAGE_URL = `${SITE_URL}/markets/central-bank-rates`;

function fmtDate(v) {
  if (!v) return 'Not announced';
  const d = new Date(`${v}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
const fmtRate = (r) => (r === null || r === undefined ? '—' : `${r.toFixed(2)}%`);
const TREND = {
  tightening: { label: 'Tightened in 2026', color: '#B91C1C', bg: 'rgba(185,28,28,0.08)' },
  easing: { label: 'Eased in 2026', color: '#047857', bg: 'rgba(4,120,87,0.08)' },
  unchanged: { label: 'No change in 2026', color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
};

export const metadata = {
  title: 'Asia-Pacific Central Bank Interest Rates Tracker',
  description: `Current policy rates for Bank Indonesia, Bank of Japan, PBoC, RBA, Bank of Korea, RBI, BNM, BOT, BSP and MAS — last decision, last change and next meeting. Updated ${fmtDate(data.updatedAt)}.`,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: 'APAC Central Bank Rates Tracker | NDNews', url: PAGE_URL, type: 'website' },
};

export default function CentralBankRatesPage() {
  const banks = data.banks;
  const count = (t) => banks.filter((b) => b.trend2026 === t).length;
  const upcoming = [...banks].filter((b) => b.nextMeeting && b.nextMeeting >= data.updatedAt).sort((a, b) => a.nextMeeting.localeCompare(b.nextMeeting));

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Markets', item: `${SITE_URL}/markets` },
        { '@type': 'ListItem', position: 3, name: 'Central Bank Rates', item: PAGE_URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'Asia-Pacific central bank policy rates',
      description: 'Current policy interest rates, latest decisions and next scheduled meetings for major Asia-Pacific central banks, compiled from official central bank publications.',
      url: PAGE_URL,
      dateModified: data.updatedAt,
      creator: { '@type': 'NewsMediaOrganization', name: 'NDNews', url: SITE_URL },
      isAccessibleForFree: true,
    },
  ];

  const th = { textAlign: 'left', padding: '10px 12px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--clr-text-secondary, #6B7280)', borderBottom: '2px solid var(--clr-border, #E5E7EB)', whiteSpace: 'nowrap' };
  const td = { padding: '12px', borderBottom: '1px solid var(--clr-border, #E5E7EB)', verticalAlign: 'top', fontSize: '0.9rem' };

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 48px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ padding: 0, marginBottom: 12 }}>
        <Link href="/">Home</Link> &gt; <Link href="/markets">Markets</Link> &gt; Central Bank Rates
      </nav>

      <p style={{ color: '#D97706', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.5px', margin: 0 }}>RATES TRACKER</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', margin: '6px 0 8px' }}>Asia-Pacific Central Bank Interest Rates</h1>
      <p style={{ color: 'var(--clr-text-secondary, #6B7280)', margin: '0 0 20px', maxWidth: 760 }}>
        Where the region&apos;s main central banks stand, what they did at their latest meeting and when they decide next.
        Figures are compiled from official central bank publications. <strong>Last updated {fmtDate(data.updatedAt)}.</strong>
      </p>

      {/* Summary */}
      <section aria-label="2026 policy direction" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {['tightening', 'easing', 'unchanged'].map((t) => (
          <div key={t} style={{ background: TREND[t].bg, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: TREND[t].color, lineHeight: 1 }}>{count(t)}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 4 }}>{TREND[t].label}</div>
          </div>
        ))}
      </section>

      {/* Table */}
      <section aria-label="Policy rates table">
        <div style={{ overflowX: 'auto', border: '1px solid var(--clr-border, #E5E7EB)', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr>
                <th style={th}>Central bank</th>
                <th style={th}>Policy rate</th>
                <th style={th}>Latest decision</th>
                <th style={th}>Last change</th>
                <th style={th}>Next decision</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((b) => (
                <tr key={b.slug} id={b.slug}>
                  <td style={td}>
                    <div style={{ fontWeight: 700 }}><span aria-hidden="true">{b.flag}</span> {b.bank} ({b.short})</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary, #6B7280)' }}>{b.rateName}</div>
                  </td>
                  <td style={{ ...td, fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                    {fmtRate(b.rate)}
                    {b.secondary && <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--clr-text-secondary, #6B7280)', whiteSpace: 'normal' }}>{b.secondary}</div>}
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{b.lastDecision}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary, #6B7280)' }}>{fmtDate(b.lastDecisionDate)}</div>
                  </td>
                  <td style={td}>
                    <div>{b.lastChange}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary, #6B7280)' }}>{fmtDate(b.lastChangeDate)}</div>
                  </td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{fmtDate(b.nextMeeting)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-secondary, #6B7280)', marginTop: 8 }}>
          &ldquo;Not announced&rdquo; means the date has not been confirmed in an official schedule. MAS sets policy through the Singapore dollar exchange-rate band rather than an interest rate.
        </p>
      </section>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Upcoming decisions</h2>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
            {upcoming.map((b) => (
              <li key={b.slug}><strong>{fmtDate(b.nextMeeting)}</strong> — {b.bank} ({b.short}), currently {fmtRate(b.rate)}</li>
            ))}
          </ol>
        </section>
      )}

      {/* Bank notes */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Bank by bank</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          {banks.map((b) => (
            <article key={b.slug} style={{ border: '1px solid var(--clr-border, #E5E7EB)', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>{b.flag} {b.bank}</h3>
                <span style={{ fontWeight: 800 }}>{fmtRate(b.rate)}</span>
              </div>
              <span style={{ display: 'inline-block', marginTop: 6, fontSize: '0.72rem', fontWeight: 700, color: TREND[b.trend2026].color, background: TREND[b.trend2026].bg, padding: '2px 8px', borderRadius: 999 }}>
                {TREND[b.trend2026].label}
              </span>
              <p style={{ fontSize: '0.88rem', margin: '10px 0' }}>{b.context}</p>
              {b.article && <p style={{ margin: '0 0 8px', fontSize: '0.85rem' }}><Link href={b.article} style={{ color: '#D97706', fontWeight: 700 }}>Read our analysis →</Link></p>}
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--clr-text-secondary, #6B7280)' }}>
                Source:{' '}
                {b.sources.map((s, i) => (
                  <span key={s}>{i > 0 && ', '}<a href={s} target="_blank" rel="noopener noreferrer">{new URL(s).hostname.replace(/^www\./, '')}</a></span>
                ))}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Explainer */}
      <section style={{ marginTop: 32, maxWidth: 760 }}>
        <h2 style={{ fontSize: '1.3rem' }}>How to read this tracker</h2>
        <p>A central bank&apos;s policy rate sets the base cost of short-term money in its economy. Banks price deposits, business loans and mortgages off it, usually with a lag. When a central bank raises its rate (&ldquo;tightening&rdquo;), borrowing tends to become more expensive and the currency often gains support. When it cuts (&ldquo;easing&rdquo;), the reverse tends to happen.</p>
        <p>Rates are not directly comparable across countries. Each reflects local inflation, growth and currency conditions. Differences between them also influence capital flows: a wider gap between US and Asian rates can put pressure on regional currencies. Bank Indonesia, for example, cited rupiah stability when it raised rates in 2026.</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-secondary, #6B7280)' }}>This tracker is updated by the NDNews desk after each official decision. It is general information, not financial advice. Always check the central bank&apos;s own release for the authoritative figure.</p>
      </section>
    </main>
  );
}
