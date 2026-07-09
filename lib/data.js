export const LIVE_UPDATES = [
  { time: '2m ago', text: 'BREAKING: Bank of Japan holds interest rates steady at 0.5%, signals possible hike in September amid persistent inflation pressures.' },
  { time: '15m ago', text: 'ASEAN foreign ministers issue joint statement calling for immediate de-escalation of South China Sea maritime disputes.' },
  { time: '32m ago', text: 'Shanghai Composite Index surges 2.3% after Beijing announces new stimulus package targeting domestic consumption.' }
];

export const TRENDING_TOPICS = [
  'World Cup 2026', 'China GDP', 'ASEAN Summit', 'Nikkei Record', 'RBA Interest Rate', 'Singapore Fintech'
];

export const DEFAULT_ARTICLES = [
  {
    id: 'art-1',
    title: 'ASEAN Summit 2026: Leaders Forge Historic Agreement on Digital Economy Integration',
    excerpt: 'Southeast Asian leaders have signed a landmark pact to harmonize digital regulations across the bloc. The agreement paves the way for seamless cross-border data flows.',
    content: 'Leaders of the Association of Southeast Asian Nations concluded their 44th summit in Kuala Lumpur with a historic agreement that promises to reshape the region\'s digital landscape.',
    category: 'APAC',
    author: 'Sarah Chen',
    createdAt: '2026-06-17T08:00:00Z',
    image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80',
    tags: ['ASEAN', 'Digital Economy', 'Southeast Asia', 'Trade'],
    isBreaking: true,
    isFeatured: true,
    readTime: '6 min read'
  },
  {
    id: 'art-7',
    title: 'China\'s GDP Growth Surges to 5.8% as Stimulus Measures Fuel Consumer Spending',
    excerpt: 'China\'s economy expanded at its fastest pace in two years, driven by aggressive fiscal stimulus and a resurgent property market.',
    content: 'China\'s gross domestic product grew 5.8 percent year-on-year in the second quarter of 2026, beating market expectations.',
    category: 'Economy',
    author: 'Michael Zhang',
    createdAt: '2026-06-17T06:00:00Z',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    tags: ['China', 'GDP', 'Economic Growth', 'Stimulus'],
    isBreaking: false,
    isFeatured: true,
    readTime: '6 min read'
  },
  {
    id: 'art-12',
    title: 'Nikkei 225 Smashes All-Time Record, Closes Above 45,000 for First Time',
    excerpt: 'Japan\'s benchmark stock index surged past 45,000, driven by foreign investor inflows and a weaker yen boosting corporate earnings.',
    content: 'The Nikkei 225 shattered its previous all-time record on Tuesday, closing above the 45,000 mark for the first time in its 75-year history.',
    category: 'Finance',
    author: 'Takeshi Mori',
    createdAt: '2026-06-17T09:30:00Z',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    tags: ['Nikkei', 'Japan', 'Stock Market', 'Equities'],
    isBreaking: false,
    isFeatured: true,
    readTime: '5 min read'
  },
  {
    id: 'art-16',
    title: 'FIFA World Cup 2026: Japan and Australia Draw Powerhouse Groups in Historic Expanded Tournament',
    excerpt: 'The draw for the first 48-team World Cup has placed Japan in a group with Spain and Nigeria, while Australia faces Argentina and Egypt.',
    content: 'The FIFA World Cup 2026 draw ceremony in New York delivered dramatic pairings for Asia\'s representatives in what will be the first expanded 48-team tournament.',
    category: 'Sport',
    author: 'Tony Hartanto',
    createdAt: '2026-06-17T04:00:00Z',
    image: 'https://images.unsplash.com/photo-1518605368461-1ee7e53f1a0e?auto=format&fit=crop&w=800&q=80',
    tags: ['World Cup', 'FIFA', 'Football', 'Soccer'],
    isBreaking: false,
    isFeatured: false,
    readTime: '6 min read'
  },
  {
    id: 'art-20',
    title: 'Opinion: The New Asian Century Is Not a Prediction — It\'s Already Here',
    excerpt: 'Asia\'s share of global GDP has surpassed 45 percent for the first time. The implications for global governance, trade patterns, and cultural influence are profound and irreversible.',
    content: 'When historians look back at the 2020s, they will likely identify this period as the moment when Asia\'s economic dominance became irreversible.',
    category: 'Opinion',
    author: 'Professor Kishore Mahbubani',
    createdAt: '2026-06-16T09:00:00Z',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=80',
    tags: ['Opinion', 'Asia', 'Geopolitics', 'Global Economy'],
    isBreaking: false,
    isFeatured: false,
    readTime: '8 min read'
  }
];

export function getOptimizedImageUrl(url, width) {
  if (!url) return 'https://picsum.photos/seed/default/800/500';
  
  try {
    // 1. If it's a Pexels image
    if (url.includes('pexels.com/photos/')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}&fit=max&q=80`;
    }
    
    // 2. If it's an Unsplash image
    if (url.includes('images.unsplash.com/')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=${width}&q=80`;
    }

    // 3. If it's a Picsum image
    if (url.includes('picsum.photos/')) {
      const parts = url.split('/');
      if (parts.length >= 6) {
        parts[parts.length - 2] = width;
        parts[parts.length - 1] = Math.round(width * 0.625); // Maintain 8:5 ratio (800x500 is 1.6 ratio, so 0.625 height ratio)
        return parts.join('/');
      }
    }
  } catch (e) {
    console.error('Error optimizing image URL:', e);
  }
  
  return url;
}

export function getAuthorAvatar(authorName) {
  return '/favicon.png';
}
