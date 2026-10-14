import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'What information NDNews collects when you visit, how analytics and Google advertising cookies are used, and how to contact us about your data.',
  alternates: {
    canonical: 'https://nussadigital.co.id/privacy',
  },
};

const h2 = { marginTop: '30px', color: '#111827' };

export default function PrivacyPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '42px', marginBottom: '10px', color: '#111827'}}>Privacy Policy</h1>
      <p style={{fontSize: '16px', color: '#64748b', marginBottom: '40px'}}><em>Last updated: 14 October 2026</em></p>

      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p>This policy explains what information is collected when you visit <strong>NDNews</strong> (nussadigital.co.id), how it is used, and how to contact us about it. NDNews is published by PT Nussa Digital Solusi, Bandar Lampung, Indonesia. We handle personal data in line with Indonesia&apos;s Personal Data Protection Law (Law No. 27 of 2022).</p>

        <h2 style={h2}>1. What we collect</h2>
        <p>NDNews is a news website. We do not offer user accounts, comments or a newsletter, and you do not need to register or give us any personal details to read our articles.</p>
        <ul style={{marginLeft: '20px'}}>
          <li><strong>Technical data.</strong> When you load a page, our hosting and content delivery provider, Cloudflare, processes standard technical information such as your IP address, browser type and the page requested, so that the site can be delivered and protected from abuse.</li>
          <li><strong>Analytics.</strong> We use Google Analytics to see which pages are read and how visitors find us, for example pages viewed, device and browser type, approximate location and the referring website. Google Analytics uses cookies or similar identifiers.</li>
          <li><strong>Emails you send us.</strong> If you email us, for example to report an error, we receive your email address and your message and use them only to reply and to deal with your request.</li>
        </ul>

        <h2 style={h2}>2. Advertising and cookies</h2>
        <p>NDNews may show ads served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to this site and/or other sites on the internet.</p>
        <ul style={{marginLeft: '20px'}}>
          <li>You can opt out of personalised advertising in <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, or opt out of some third-party vendors&apos; use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</li>
          <li>Google explains how it uses information from sites that use its services at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>, and how it uses advertising cookies at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/ads</a>.</li>
          <li>You can also block or delete cookies in your browser settings. The site still works without them.</li>
        </ul>

        <h2 style={h2}>3. How we use information</h2>
        <p>We use the information above to run and secure the website, to understand which articles are useful to readers, to show ads that help fund the site, and to answer messages. We do not sell personal data.</p>

        <h2 style={h2}>4. Who else receives it</h2>
        <p>Information is processed by the service providers named above (Cloudflare for hosting and delivery, Google for analytics and advertising) under their own privacy policies. We may also disclose information where the law requires it.</p>

        <h2 style={h2}>5. Your rights</h2>
        <p>Under Indonesia&apos;s Personal Data Protection Law you can ask us for access to personal data we hold about you, ask us to correct or delete it, and withdraw consent you have given. To make a request, email <a href="mailto:support@nussadigital.co.id">support@nussadigital.co.id</a>. For data held by Google or Cloudflare, you can also use the tools those companies provide.</p>

        <h2 style={h2}>6. Children</h2>
        <p>NDNews is a general news website and is not directed at children. We do not knowingly collect personal data from children. If you believe a child has sent us personal data, please contact us and we will delete it.</p>

        <h2 style={h2}>7. Changes to this policy</h2>
        <p>If we change this policy, we will update it on this page and change the date at the top.</p>

        <h2 style={h2}>8. Contact</h2>
        <p>Questions about this policy or your data: <a href="mailto:support@nussadigital.co.id">support@nussadigital.co.id</a>. Publisher: PT Nussa Digital Solusi, Bandar Lampung, Lampung, Indonesia. See also our <Link href="/terms">Terms of Use</Link> and <Link href="/contact">Contact</Link> page.</p>
      </div>
    </main>
  );
}
