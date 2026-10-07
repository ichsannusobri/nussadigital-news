import Link from 'next/link';

export const metadata = {
  title: 'Contact Us',
  description: 'Contact the NDNews editorial team to report an error, send a news tip, or ask about advertising and partnerships.',
  alternates: {
    canonical: 'https://nussadigital.co.id/contact',
  },
};

const card = { background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0' };
const h2 = { fontSize: '20px', margin: '0 0 10px 0', color: '#111827' };

export default function ContactPage() {
  return (
    <main className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '10px', color: '#111827' }}>Contact Us</h1>
      <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '40px' }}>We read every message. Here is how to reach us.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', lineHeight: '1.7', fontSize: '17px', color: '#333' }}>
        <div style={card}>
          <h2 style={h2}>Editorial, corrections and news tips</h2>
          <p>Spotted an error, or have a story we should look at? Please include the article link.</p>
          <p><a href="mailto:editorial@nussadigital.co.id"><strong>editorial@nussadigital.co.id</strong></a></p>
          <p style={{ fontSize: '15px' }}>How we handle corrections: <Link href="/corrections">Corrections</Link>.</p>
        </div>
        <div style={card}>
          <h2 style={h2}>Advertising and partnerships</h2>
          <p>For advertising and partnership enquiries.</p>
          <p><a href="mailto:ads@nussadigital.co.id"><strong>ads@nussadigital.co.id</strong></a></p>
        </div>
        <div style={card}>
          <h2 style={h2}>General support</h2>
          <p>Website problems, feedback and all other questions.</p>
          <p><a href="mailto:support@nussadigital.co.id"><strong>support@nussadigital.co.id</strong></a></p>
        </div>
      </div>

      <div style={{ lineHeight: '1.8', fontSize: '18px', color: '#333', marginTop: '40px' }}>
        <h2 style={{ color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Publisher</h2>
        <p>
          <strong>PT Nussa Digital Solusi</strong><br />
          Bandar Lampung, Lampung, Indonesia
        </p>
        <p>We usually reply within two working days (Monday to Friday, Western Indonesia Time).</p>
      </div>
    </main>
  );
}
