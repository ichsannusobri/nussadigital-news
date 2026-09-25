export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/dashboard.html', '/search'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'Claude-Web', 'anthropic-ai', 'OAI-SearchBot'],
        allow: '/',
        disallow: ['/dashboard', '/dashboard.html', '/search'],
      }
    ],
    sitemap: ['https://nussadigital.co.id/sitemap.xml', 'https://nussadigital.co.id/news-sitemap.xml'],
  }
}
