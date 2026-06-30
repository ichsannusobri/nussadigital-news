export const metadata = {
  title: 'Terms of Service - NDNews',
  description: 'Terms of Service, intellectual property rights, and user agreements for accessing and using the NDNews portal.',
  alternates: {
    canonical: 'https://nussadigital.co.id/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '42px', marginBottom: '10px', color: '#111827'}}>Terms of Use</h1>
      <p style={{fontSize: '16px', color: '#64748b', marginBottom: '40px'}}><em>Last Updated & Effective: July 2026</em></p>
      
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p>Welcome to <strong>NDNews</strong>. By accessing or using our website (nussadigital.co.id), you agree to comply with and be bound by the following Terms of Use. Please review them carefully.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>1. Acceptance of Terms</h2>
        <p>By using this site, you signify your irrevocable acceptance of these terms. If you do not agree to these terms, please refrain from using our site and services.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>2. Intellectual Property Rights</h2>
        <p>All editorial content, information, photographs, illustrations, artwork and other graphic materials, and names, logos and trade marks on the NDNews website are protected by copyright laws and/or other laws and/or international treaties, and belong to us and/or our suppliers.</p>
        <p>These works, logos, graphics, sounds or images may not be copied, reproduced, retransmitted, distributed, disseminated, sold, published, broadcasted or circulated whether in whole or in part, unless expressly permitted by us and/or our suppliers.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>3. Disclaimer of Warranties & Liability</h2>
        <p>The content on NDNews is provided "as is" and on an "as available" basis for general information purposes only.</p>
        <p><strong>Financial & Economic Content Disclaimer:</strong><br/>
        Any articles, market data, and economic insights published on NDNews do NOT constitute financial, investment, or trading advice. NDNews and its journalists are not licensed financial advisors. Any reliance you place on such information is strictly at your own risk. NDNews will not be liable for any losses or damages incurred in connection with the use of our website.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>4. User-Generated Content</h2>
        <p>If you post comments or submit content to our platform, you grant NDNews a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, and modify that content. You agree not to submit content that is illegal, defamatory, abusive, or infringes on third-party rights.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>5. Third-Party Links & Advertising</h2>
        <p>Our website may contain links to third-party web sites or services that are not owned or controlled by NDNews (including advertisements served by Google AdSense). We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>6. Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions.</p>
      </div>
    </main>
  );
}
