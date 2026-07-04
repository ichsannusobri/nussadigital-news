export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard.html'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'Claude-Web', 'anthropic-ai', 'OAI-SearchBot'],
        allow: '/',
        disallow: ['/dashboard.html'],
      }
    ],
    sitemap: 'https://nussadigital.co.id/sitemap.xml',
  }
}
