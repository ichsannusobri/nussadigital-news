export const metadata = {
  title: 'About Us - NDNews',
  description: 'Learn about NDNews, our editorial mission, and our coverage of Economy, Finance, and Sports in the Asia-Pacific region.',
};

export default function AboutPage() {
  return (
    <main className="container" style={{padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh'}}>
      <h1 style={{fontSize: '36px', marginBottom: '20px'}}>About NDNews</h1>
      <div style={{lineHeight: '1.8', fontSize: '18px', color: '#333'}}>
        <p>Welcome to <strong>NDNews (Nussa Digital News)</strong>, your premier destination for high-quality, breaking journalism across the Asia-Pacific (APAC) region.</p>
        <h2 style={{marginTop: '30px'}}>Our Mission</h2>
        <p>Our mission is to deliver factual, unbiased, and in-depth reporting on the events that shape our world. We specialize in comprehensive coverage of the Economy, Global Finance, and major Sporting events, providing our readers with the critical context they need to understand complex regional dynamics.</p>
        <h2 style={{marginTop: '30px'}}>Editorial Standards</h2>
        <p>At NDNews, we adhere to the highest standards of journalistic integrity. We believe in transparency, factual accuracy, and accountability. Our dedicated team of expert journalists and contributors work around the clock to ensure that the news we deliver is not just fast, but thoroughly verified.</p>
        <h2 style={{marginTop: '30px'}}>Our Team</h2>
        <p>We are a diverse group of seasoned editors, financial analysts, and sports enthusiasts. Based across key hubs in the Asia-Pacific, our reporters have their fingers on the pulse of the region, ensuring you never miss a beat.</p>
      </div>
    </main>
  );
}
