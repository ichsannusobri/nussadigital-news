import Link from 'next/link';

export const metadata = {
  title: 'Editorial Policy',
  description: 'How NDNews chooses, researches, checks, approves and corrects its articles, including how we use AI tools.',
  alternates: {
    canonical: 'https://nussadigital.co.id/editorial-policy',
  },
};

const h2 = { marginTop: '40px', color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' };

export default function EditorialPolicyPage() {
  return (
    <main className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '10px', color: '#111827' }}>Editorial Policy</h1>
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px' }}>Last updated: 7 October 2026</p>

      <div style={{ lineHeight: '1.8', fontSize: '18px', color: '#333' }}>
        <p>This page explains how NDNews decides what to publish, how articles are researched and checked, how we use AI tools, and how we correct mistakes. It applies to everything we publish.</p>

        <h2 style={h2}>1. What we publish</h2>
        <p>We cover the economy, financial markets, public policy and sport in Southeast Asia and the wider Asia-Pacific. We focus on stories where we can add something useful for readers in the region: context, data, an explanation of what a decision means, or a clear summary of what is known and what is not.</p>

        <h2 style={h2}>2. Sources</h2>
        <ul style={{ marginLeft: '20px' }}>
          <li>Every factual claim must be supported by a source, and we link to it in the article.</li>
          <li>We prefer primary sources: central banks, ministries, statistics agencies, regulators, courts, company filings and official statements. We use established news organisations for reporting we cannot check directly, and we name them.</li>
          <li>When sources disagree, we say so and attribute each figure rather than picking one silently.</li>
          <li>Forecasts and analysts&apos; targets are presented as forecasts, with the name of the organisation and the date.</li>
        </ul>

        <h2 style={h2}>3. Quotes and translations</h2>
        <ul style={{ marginLeft: '20px' }}>
          <li>We only quote words that a named person or organisation actually said or published, and we link to where they said it.</li>
          <li>When we translate a quote, usually from Bahasa Indonesia, we mark it &quot;(NDNews translation)&quot;.</li>
          <li>We never invent quotes, experts, studies, people or data.</li>
        </ul>

        <h2 style={h2}>4. How we use AI tools</h2>
        <p>NDNews uses AI tools to help gather sources, summarise documents and prepare drafts. Because these tools can make mistakes, they are never the final step:</p>
        <ol style={{ marginLeft: '20px' }}>
          <li><strong>Research and draft.</strong> Sources are collected and a draft is written with a link for each fact.</li>
          <li><strong>Independent check.</strong> A separate checking pass compares numbers, dates, names, titles and quotes against the sources and lists anything that is wrong, out of date or unsupported. Required corrections are made before the article moves on.</li>
          <li><strong>Editor approval.</strong> The editor reviews the article and approves it before publication. Nothing is published automatically.</li>
        </ol>
        <p>Each article says at the end that it was researched with AI assistance and reviewed by the editorial team. Photos are clearly labelled as illustrative stock images; we do not publish AI-generated images as news photos.</p>

        <h2 style={h2}>5. Accuracy, fairness and balance</h2>
        <ul style={{ marginLeft: '20px' }}>
          <li>On political and contested issues, we report the main positions fairly and attribute them. NDNews does not endorse parties or candidates.</li>
          <li>People accused of wrongdoing are presumed innocent unless a court finds otherwise. We report what authorities have formally done, not rumours, and we avoid naming private individuals.</li>
          <li>Headlines must match the article. We do not use misleading or clickbait headlines.</li>
        </ul>

        <h2 style={h2}>6. Financial content</h2>
        <p>Articles about markets, currencies, interest rates and personal finance are general information, not financial advice. We do not recommend buying or selling any investment, and analysts&apos; forecasts we report are not our own predictions.</p>

        <h2 style={h2}>7. Corrections and updates</h2>
        <p>When we find or are told about a factual error, we correct it as soon as we can and add a note to the article explaining what changed. When a story develops, we update it and say so. Readers can report errors to <a href="mailto:editorial@nussadigital.co.id">editorial@nussadigital.co.id</a>. Details are on our <Link href="/corrections">Corrections</Link> page.</p>

        <h2 style={h2}>8. Independence</h2>
        <p>Advertisers and partners have no say over what we publish. Any sponsored content will be clearly labelled as such.</p>

        <h2 style={h2}>9. Responsibility</h2>
        <p>The editor responsible for NDNews is <Link href="/about#editor">Ichsan N</Link>, Founder and Editor-in-Chief. NDNews is published by PT Nussa Digital Solusi, Indonesia. See <Link href="/about">About NDNews</Link>.</p>
      </div>
    </main>
  );
}
