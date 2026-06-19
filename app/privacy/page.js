export const metadata = {
  title: 'Privacy Policy - NDNews',
  description: 'Privacy Policy describing how NDNews collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '36px', marginBottom: '20px'}}>Privacy Policy</h1>
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p><em>Last Updated: June 2026</em></p>
        <p>At NDNews, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>

        <h2 style={{marginTop: '30px'}}>1. Information We Collect</h2>
        <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, subscribe to the newsletter, fill out a form, and in connection with other activities, services, features, or resources we make available on our Site. We may also collect non-personal identification information (such as browser name, type of computer, and technical information about means of connection to our Site).</p>

        <h2 style={{marginTop: '30px'}}>2. Web Browser Cookies & AdSense</h2>
        <p>Our Site may use "cookies" to enhance User experience. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</p>
        <p>Users may opt-out of personalized advertising by visiting Google's <a href="https://myadcenter.google.com/">Ads Settings</a>.</p>

        <h2 style={{marginTop: '30px'}}>3. How We Use Collected Information</h2>
        <p>NDNews may collect and use Users' personal information for the following purposes:</p>
        <ul>
          <li>To improve our Site: We may use feedback you provide to improve our products and services.</li>
          <li>To send periodic emails: We may use the email address to respond to inquiries, questions, and/or other requests.</li>
          <li>To personalize user experience: We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li>
        </ul>

        <h2 style={{marginTop: '30px'}}>4. How We Protect Your Information</h2>
        <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.</p>

        <h2 style={{marginTop: '30px'}}>5. Contacting Us</h2>
        <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at <strong>privacy@nussadigital.co.id</strong>.</p>
      </div>
    </main>
  );
}
