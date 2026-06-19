export const metadata = {
  title: 'Terms of Use - NDNews',
  description: 'Terms of Use and Conditions for accessing and using NDNews.',
};

export default function TermsPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '36px', marginBottom: '20px'}}>Terms of Use</h1>
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p><em>Last Updated: June 2026</em></p>
        <p>Welcome to NDNews. By accessing or using our website (nussadigital.co.id), you agree to comply with and be bound by these Terms of Use.</p>

        <h2 style={{marginTop: '30px'}}>1. Acceptance of Terms</h2>
        <p>By using this site, you signify your acceptance of these terms. If you do not agree to these terms, please do not use our site.</p>

        <h2 style={{marginTop: '30px'}}>2. Intellectual Property</h2>
        <p>All content published on NDNews, including articles, images, graphics, logos, and software, is the property of NDNews or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or transmit any content without prior written permission.</p>

        <h2 style={{marginTop: '30px'}}>3. Disclaimer of Warranties</h2>
        <p>The content on NDNews is provided "as is" for general information purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information contained on the website.</p>
        <p><strong>Specifically for Finance and Economy sections:</strong> Content does not constitute financial advice. Any reliance you place on such information is strictly at your own risk.</p>

        <h2 style={{marginTop: '30px'}}>4. External Links</h2>
        <p>Through this website, you are able to link to other websites which are not under the control of NDNews. We have no control over the nature, content, and availability of those sites.</p>

        <h2 style={{marginTop: '30px'}}>5. Changes to Terms</h2>
        <p>NDNews reserves the right to modify these Terms of Use at any time. Your continued use of the site after changes are posted constitutes your acceptance of the amended terms.</p>
      </div>
    </main>
  );
}
