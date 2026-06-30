export const metadata = {
  title: 'Contact Us - NDNews',
  description: 'Get in touch with the NDNews editorial team, report issues, or inquire about advertising, press, and partnerships.',
  alternates: {
    canonical: 'https://nussadigital.co.id/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '42px', marginBottom: '10px', color: '#111827'}}>Contact Us</h1>
      <p style={{fontSize: '20px', color: '#64748b', marginBottom: '40px'}}>We value our readers and partners. Here is how you can reach us.</p>
      
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px'}}>
          <div style={{background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <h2 style={{marginTop: 0, color: '#0f172a', fontSize: '22px'}}>Editorial Desk & News Tips</h2>
            <p style={{fontSize: '16px'}}>Have a breaking news tip, press release, or want to report an error in our reporting?</p>
            <p style={{fontSize: '16px', fontWeight: 'bold', color: '#1e40af'}}>editorial@nussadigital.co.id</p>
          </div>

          <div style={{background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <h2 style={{marginTop: 0, color: '#0f172a', fontSize: '22px'}}>Advertising & Commercial</h2>
            <p style={{fontSize: '16px'}}>For sponsorships, programmatic advertising inquiries, and custom media solutions.</p>
            <p style={{fontSize: '16px', fontWeight: 'bold', color: '#1e40af'}}>ads@nussadigital.co.id</p>
          </div>
          
          <div style={{background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <h2 style={{marginTop: 0, color: '#0f172a', fontSize: '22px'}}>Careers & HR</h2>
            <p style={{fontSize: '16px'}}>Interested in joining our team of journalists and analysts?</p>
            <p style={{fontSize: '16px', fontWeight: 'bold', color: '#1e40af'}}>careers@nussadigital.co.id</p>
          </div>

          <div style={{background: '#f8fafc', padding: '25px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <h2 style={{marginTop: 0, color: '#0f172a', fontSize: '22px'}}>General Support</h2>
            <p style={{fontSize: '16px'}}>For all other inquiries, website issues, or general feedback.</p>
            <p style={{fontSize: '16px', fontWeight: 'bold', color: '#1e40af'}}>support@nussadigital.co.id</p>
          </div>
        </div>

        <h2 style={{marginTop: '40px', color: '#111827', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px'}}>Office Location & Hours</h2>
        <p>
          <strong>NDNews Headquarters</strong><br/>
          Menara Nussa, Lt. 12<br/>
          Jakarta Pusat, DKI Jakarta 10220<br/>
          Indonesia
        </p>
        <p>
          <strong>Phone:</strong> +62 21 555 0199<br/>
          <strong>Business Hours:</strong> Monday - Friday, 09:00 - 17:00 (WIB)
        </p>

      </div>
    </main>
  );
}
