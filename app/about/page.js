export const metadata = {
  title: 'About Us & Editorial Standards - NDNews',
  description: 'Learn about NDNews, our editorial mission, fact-checking standards, and our expert coverage of Economy, Finance, and Sports in the Asia-Pacific region.',
  alternates: {
    canonical: 'https://nussadigital.co.id/about',
  },
};

export default function AboutPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '42px', marginBottom: '10px', color: '#111827'}}>About NDNews</h1>
      <p style={{fontSize: '20px', color: '#64748b', marginBottom: '40px'}}>Uncompromising Journalism for the Asia-Pacific.</p>
      
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p>Welcome to <strong>NDNews (Nussa Digital News)</strong>, an independent digital media organization dedicated to providing high-quality, breaking journalism across the Asia-Pacific (APAC) region.</p>
        
        <h2 style={{marginTop: '40px', color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>Our Mission & Vision</h2>
        <p>Our mission is to empower decision-makers and the general public by delivering factual, unbiased, and in-depth reporting on the events that shape our world. We specialize in comprehensive coverage of the <strong>Economy, Global Finance, and major Sporting events</strong>. We envision a society that is well-informed and resilient against misinformation.</p>

        <h2 style={{marginTop: '40px', color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>Editorial & Fact-Checking Standards</h2>
        <p>At NDNews, we adhere to the highest standards of journalistic integrity:</p>
        <ul style={{marginLeft: '20px'}}>
          <li><strong>Accuracy & Verification:</strong> Every article undergoes a rigorous fact-checking process by our senior editors before publication. We rely on primary sources and verified data.</li>
          <li><strong>Independence:</strong> Our editorial decisions are completely independent of our advertisers, sponsors, and investors.</li>
          <li><strong>Corrections Policy:</strong> If we make a mistake, we correct it promptly and transparently, updating the article with an editor's note detailing the correction.</li>
        </ul>

        <h2 style={{marginTop: '40px', color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>The Editorial Board</h2>
        <p>We are a diverse group of seasoned editors, financial analysts, and sports correspondents. Based across key hubs in the Asia-Pacific, our reporters have their fingers on the pulse of the region.</p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px'}}>
          <div style={{background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <h3 style={{margin: '0 0 5px 0', fontSize: '18px'}}>Ichsan Nusobri</h3>
            <p style={{margin: 0, fontSize: '14px', color: '#64748b'}}>Editor-in-Chief</p>
          </div>
          <div style={{background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <h3 style={{margin: '0 0 5px 0', fontSize: '18px'}}>Sarah Lin</h3>
            <p style={{margin: 0, fontSize: '14px', color: '#64748b'}}>Senior Finance Correspondent</p>
          </div>
          <div style={{background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <h3 style={{margin: '0 0 5px 0', fontSize: '18px'}}>David Sharma</h3>
            <p style={{margin: 0, fontSize: '14px', color: '#64748b'}}>Head of Sports</p>
          </div>
        </div>

        <h2 style={{marginTop: '40px', color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>Corporate Headquarters</h2>
        <p>
          <strong>NDNews Media Group</strong><br/>
          Menara Nussa, Lt. 12<br/>
          Jakarta Pusat, DKI Jakarta 10220<br/>
          Indonesia<br/>
        </p>
      </div>
    </main>
  );
}
