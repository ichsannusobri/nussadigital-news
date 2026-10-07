import Link from 'next/link';

export const metadata = {
  title: 'Corrections',
  description: 'How to report an error to NDNews and how we correct and update our articles.',
  alternates: {
    canonical: 'https://nussadigital.co.id/corrections',
  },
};

const h2 = { marginTop: '40px', color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' };

export default function CorrectionsPage() {
  return (
    <main className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '10px', color: '#111827' }}>Corrections</h1>
      <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '40px' }}>If we get something wrong, we want to know, and we will fix it openly.</p>

      <div style={{ lineHeight: '1.8', fontSize: '18px', color: '#333' }}>
        <h2 style={h2}>How to report an error</h2>
        <p>Email <a href="mailto:editorial@nussadigital.co.id"><strong>editorial@nussadigital.co.id</strong></a> with:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>the link to the article,</li>
          <li>the sentence or figure you think is wrong, and</li>
          <li>a source that shows the correct information, if you have one.</li>
        </ul>
        <p>We aim to review every report within two working days.</p>

        <h2 style={h2}>What we do</h2>
        <ul style={{ marginLeft: '20px' }}>
          <li><strong>Factual errors</strong> (a wrong number, date, name, title or quote): we correct the article and add a dated note at the end saying what was changed.</li>
          <li><strong>Updates</strong> (new information after publication): we update the article and say when and what was added.</li>
          <li><strong>Minor fixes</strong> (spelling, grammar or formatting that does not change meaning): we fix them without a note.</li>
          <li><strong>Serious errors</strong> that undermine the main point of an article: we correct it prominently or, in rare cases, remove the article and explain why on this page.</li>
        </ul>

        <h2 style={h2}>Our standards</h2>
        <p>Our rules on sources, quotes, AI-assisted research and editor approval are set out in our <Link href="/editorial-policy">Editorial Policy</Link>.</p>
      </div>
    </main>
  );
}
