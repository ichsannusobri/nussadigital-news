export const metadata = {
  title: 'Privacy Policy - NDNews',
  description: 'Read the comprehensive privacy policy of NDNews, detailing our data collection, GDPR compliance, and advertising cookies.',
  alternates: {
    canonical: 'https://nussadigital.co.id/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '42px', marginBottom: '10px', color: '#111827'}}>Privacy Policy</h1>
      <p style={{fontSize: '16px', color: '#64748b', marginBottom: '40px'}}><em>Last Updated & Effective: July 2026</em></p>
      
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p>At <strong>NDNews (Nussa Digital News)</strong>, we prioritize the privacy and security of our visitors. This Privacy Policy document contains detailed information on the types of personal data that is collected and recorded by NDNews and how we use it, in compliance with international privacy standards including the GDPR and CCPA.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>1. Information We Collect</h2>
        <p>We collect information to provide better services to all our users. We may collect personal identification information from Users in various ways, including, but not limited to, when Users visit our site, subscribe to the newsletter, and fill out forms. The types of data we collect include:</p>
        <ul style={{marginLeft: '20px'}}>
          <li><strong>Log Data:</strong> Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</li>
          <li><strong>Personal Data:</strong> Name and email address (only when voluntarily submitted via newsletter or contact forms).</li>
        </ul>

        <h2 style={{marginTop: '30px', color: '#111827'}}>2. Advertising, Cookies & Google AdSense</h2>
        <p>NDNews uses "cookies" to store information about visitors' preferences, and the pages on the website that the visitor accessed or visited. This information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
        <p><strong>Google DoubleClick DART Cookie:</strong><br/>
        Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to nussadigital.co.id and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" style={{color: '#1e40af'}}>https://policies.google.com/technologies/ads</a></p>
        <p><strong>Third-Party Ad Servers:</strong><br/>
        Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on NDNews. They automatically receive your IP address when this occurs. NDNews has no access to or control over these cookies that are used by third-party advertisers.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>3. GDPR Data Protection Rights</h2>
        <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
        <ul style={{marginLeft: '20px'}}>
          <li>The right to access – You have the right to request copies of your personal data.</li>
          <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
          <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
        </ul>

        <h2 style={{marginTop: '30px', color: '#111827'}}>4. Children's Information</h2>
        <p>Another part of our priority is adding protection for children while using the internet. NDNews does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>

        <h2 style={{marginTop: '30px', color: '#111827'}}>5. Contacting Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact our Data Protection Officer at:<br/>
        <strong>privacy@nussadigital.co.id</strong></p>
      </div>
    </main>
  );
}
