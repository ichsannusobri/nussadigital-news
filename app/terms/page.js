export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of use for the NDNews website: copyright, reuse of our articles, financial-content disclaimer, third-party ads and governing law.',
  alternates: {
    canonical: 'https://nussadigital.co.id/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '42px', marginBottom: '10px', color: '#111827'}}>Terms of Use</h1>
      <p style={{fontSize: '16px', color: '#64748b', marginBottom: '40px'}}><em>Last updated: 14 October 2026</em></p>
      
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p>Welcome to <strong>NDNews</strong>. By accessing or using our website (nussadigital.co.id), you agree to comply with and be bound by the following Terms of Use. Please review them carefully.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>1. Acceptance of Terms</h2>
        <p>By using this site, you signify your irrevocable acceptance of these terms. If you do not agree to these terms, please refrain from using our site and services.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>2. Intellectual Property Rights</h2>
        <p>Original articles, graphics and data pages on NDNews are owned by PT Nussa Digital Solusi and protected by copyright. Photos are stock images used under the licence of their provider and are credited under each image. Quoted material and linked sources belong to their respective owners.</p>
        <p>You may share links to our articles and quote short extracts with a link back to the original. Please do not republish full articles or our data pages without our written permission.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>3. Disclaimer of Warranties & Liability</h2>
        <p>The content on NDNews is provided "as is" and on an "as available" basis for general information purposes only.</p>
        <p><strong>Financial & Economic Content Disclaimer:</strong><br/>
        Any articles, market data, and economic insights published on NDNews do NOT constitute financial, investment, or trading advice. NDNews and its journalists are not licensed financial advisors. Any reliance you place on such information is strictly at your own risk. NDNews will not be liable for any losses or damages incurred in connection with the use of our website.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>4. Messages You Send Us</h2>
        <p>NDNews does not host comments or user accounts. If you send us a news tip, a correction request or other material by email, you allow us to use it to check, correct or report on a story. How we handle your email address is explained in our <a href="/privacy">Privacy Policy</a>.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>5. Third-Party Links & Advertising</h2>
        <p>Our website may contain links to third-party web sites or services that are not owned or controlled by NDNews (including advertisements served by Google AdSense). We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>6. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>7. Contact</h2>
        <p>Questions about these terms: <a href="mailto:support@nussadigital.co.id">support@nussadigital.co.id</a>. NDNews is published by PT Nussa Digital Solusi, Bandar Lampung, Indonesia.</p>
      </div>
    </main>
  );
}
