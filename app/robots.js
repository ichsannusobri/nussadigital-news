export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'Claude-Web', 'anthropic-ai', 'OAI-SearchBot'],
        allow: '/',
      }
    ],
    sitemap: 'https://nussadigital.co.id/sitemap.xml',
  }
}
