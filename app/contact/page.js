export const metadata = {
  title: 'Contact Us - NDNews',
  description: 'Get in touch with the NDNews editorial team, report issues, or inquire about advertising and partnerships.',
  alternates: {
    canonical: 'https://nussadigital.co.id/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '36px', marginBottom: '20px'}}>Contact Us</h1>
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p>We welcome feedback, news tips, and inquiries from our readers and partners.</p>
        
        <h2 style={{marginTop: '30px'}}>General Inquiries</h2>
        <p>For general questions about NDNews, please email us at:<br/>
        <strong>info@nussadigital.co.id</strong></p>

        <h2 style={{marginTop: '30px'}}>Editorial & News Tips</h2>
        <p>Do you have a breaking news tip or a story you'd like us to cover? Reach out to our news desk at:<br/>
        <strong>editorial@nussadigital.co.id</strong></p>

        <h2 style={{marginTop: '30px'}}>Advertising & Partnerships</h2>
        <p>For advertising opportunities, sponsorships, and business partnerships, please contact our commercial team:<br/>
        <strong>ads@nussadigital.co.id</strong></p>

        <h2 style={{marginTop: '30px'}}>Office Location</h2>
        <p>
          NDNews Headquarters<br/>
          Jakarta, Indonesia<br/>
          (Operating across the APAC region)
        </p>
      </div>
    </main>
  );
}
