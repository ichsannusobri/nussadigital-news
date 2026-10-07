import Link from 'next/link';

export const metadata = {
  title: 'About NDNews',
  description: 'Who we are, what we cover, how NDNews articles are researched, checked and approved, and who is responsible for our journalism.',
  alternates: {
    canonical: 'https://nussadigital.co.id/about',
  },
};

const h2 = { marginTop: '40px', color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' };

export default function AboutPage() {
  return (
    <main className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '10px', color: '#111827' }}>About NDNews</h1>
      <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '40px' }}>Sourced news and explainers on the Asia-Pacific economy, markets and sport.</p>

      <div style={{ lineHeight: '1.8', fontSize: '18px', color: '#333' }}>
        <p><strong>NDNews (Nussa Digital News)</strong> is a small, independent English-language news site based in Indonesia. We publish news, explainers and data pages about the economy, financial markets, policy and sport across Southeast Asia and the wider Asia-Pacific, written for readers in Indonesia and the region.</p>

        <h2 style={h2}>What we cover</h2>
        <ul style={{ marginLeft: '20px' }}>
          <li><strong>Economy and policy:</strong> growth, inflation, budgets and government programmes, with an Indonesian and ASEAN perspective.</li>
          <li><strong>Finance and markets:</strong> central banks, currencies and stock markets, including our <Link href="/markets/central-bank-rates">APAC central bank rates tracker</Link> and a daily market snapshot.</li>
          <li><strong>Asia-Pacific news:</strong> the stories that matter to readers in the region, from Singapore to Australia.</li>
          <li><strong>Sport:</strong> regional football and major events involving Asian teams and athletes.</li>
        </ul>

        <h2 style={h2}>How we work</h2>
        <p>Every article links to the sources behind its facts, with official and primary sources first. We use AI tools to help with research and drafting, and we say so at the end of each article. A separate checking pass compares figures, dates and quotes against the sources, and the editor reviews and approves every article before it is published. Our full rules are in our <Link href="/editorial-policy">Editorial Policy</Link>.</p>
        <p>If we get something wrong, we fix it and say what changed. See our <Link href="/corrections">Corrections</Link> page to report an error.</p>

        <h2 style={h2}>Who is responsible</h2>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
          <h3 id="editor" style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Ichsan N</h3>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Founder and Editor-in-Chief</p>
          <p style={{ margin: 0, fontSize: '16px' }}>Responsible for NDNews editorial standards. He reviews and approves every article before publication. Articles published as &quot;NDNews Editorial Team&quot; are prepared by the newsroom and approved by the editor.</p>
        </div>

        <h2 style={h2}>Publisher</h2>
        <p>
          NDNews is published by <strong>PT Nussa Digital Solusi</strong><br />
          Bandar Lampung, Lampung, Indonesia
        </p>
        <p>Contact: <a href="mailto:editorial@nussadigital.co.id">editorial@nussadigital.co.id</a>. More options are on our <Link href="/contact">Contact</Link> page.</p>

        <h2 style={h2}>Independence and advertising</h2>
        <p>Editorial decisions are made independently of advertisers. If we ever publish sponsored content, it will be clearly labelled. NDNews does not provide financial advice; market and finance articles are general information only.</p>
      </div>
    </main>
  );
}
