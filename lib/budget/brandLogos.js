// Brand Logos and Household Stock Icon Mapper for Wallos UI

export const BRAND_LOGOS = {
  netflix: {
    name: 'Netflix',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/netflix.png',
    bg: '#000000',
    color: '#E50914'
  },
  spotify: {
    name: 'Spotify',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/spotify.png',
    bg: '#121212',
    color: '#1DB954'
  },
  youtube: {
    name: 'YouTube Premium',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/youtube.png',
    bg: '#FFFFFF',
    color: '#FF0000'
  },
  google: {
    name: 'Google One',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/google-drive.png',
    bg: '#FFFFFF',
    color: '#4285F4'
  },
  disney: {
    name: 'Disney+',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/disney-plus.png',
    bg: '#113CCF',
    color: '#FFFFFF'
  },
  icloud: {
    name: 'iCloud / Apple',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/apple.png',
    bg: '#F5F5F7',
    color: '#000000'
  },
  cloudflare: {
    name: 'Cloudflare',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/cloudflare.png',
    bg: '#F38020',
    color: '#FFFFFF'
  },
  amazon: {
    name: 'Amazon Prime',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/amazon-prime.png',
    bg: '#00A8E1',
    color: '#FFFFFF'
  },
  duolingo: {
    name: 'Duolingo',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/duolingo.png',
    bg: '#58CC02',
    color: '#FFFFFF'
  },
  chatgpt: {
    name: 'ChatGPT Plus',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/openai.png',
    bg: '#10A37F',
    color: '#FFFFFF'
  },
  indihome: {
    name: 'IndiHome Broadband',
    logo: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/adguard-home.png',
    bg: '#EE2E24',
    color: '#FFFFFF'
  }
};

/**
 * Household Category Default Stock SVG Icons
 */
export const CATEGORY_ICONS = {
  Housing: { icon: '🏠', color: '#D97706', bg: '#FEF3C7' },
  Groceries: { icon: '🛒', color: '#10B981', bg: '#D1FAE5' },
  Utilities: { icon: '⚡', color: '#F59E0B', bg: '#FEF3C7' },
  Subscriptions: { icon: '📺', color: '#8B5CF6', bg: '#EDE9FE' },
  Transport: { icon: '⛽', color: '#3B82F6', bg: '#DBEAFE' },
  Insurance: { icon: '🛡️', color: '#EC4899', bg: '#FCE7F3' },
  Healthcare: { icon: '🏥', color: '#EF4444', bg: '#FEE2E2' },
  Education: { icon: '🎓', color: '#6366F1', bg: '#E0E7FF' },
  Entertainment: { icon: '🎮', color: '#14B8A6', bg: '#CCFBF1' },
  Savings: { icon: '🏦', color: '#059669', bg: '#D1FAE5' }
};

/**
 * Get matching brand logo or category stock icon for an expense
 */
export function getExpenseLogoInfo(name = '', category = 'Housing') {
  const lower = name.toLowerCase();

  if (lower.includes('netflix')) return { type: 'brand', ...BRAND_LOGOS.netflix };
  if (lower.includes('spotify')) return { type: 'brand', ...BRAND_LOGOS.spotify };
  if (lower.includes('youtube')) return { type: 'brand', ...BRAND_LOGOS.youtube };
  if (lower.includes('google')) return { type: 'brand', ...BRAND_LOGOS.google };
  if (lower.includes('disney')) return { type: 'brand', ...BRAND_LOGOS.disney };
  if (lower.includes('icloud') || lower.includes('apple')) return { type: 'brand', ...BRAND_LOGOS.icloud };
  if (lower.includes('cloudflare')) return { type: 'brand', ...BRAND_LOGOS.cloudflare };
  if (lower.includes('amazon') || lower.includes('prime')) return { type: 'brand', ...BRAND_LOGOS.amazon };
  if (lower.includes('duolingo')) return { type: 'brand', ...BRAND_LOGOS.duolingo };
  if (lower.includes('chatgpt') || lower.includes('openai')) return { type: 'brand', ...BRAND_LOGOS.chatgpt };

  // Category Fallback Stock Icon
  const catInfo = CATEGORY_ICONS[category] || CATEGORY_ICONS.Housing;
  return {
    type: 'stock',
    icon: catInfo.icon,
    color: catInfo.color,
    bg: catInfo.bg
  };
}

/**
 * Payment method logo pill mapper
 */
export function getPaymentBadge(method = '') {
  const lower = method.toLowerCase();
  if (lower.includes('paypal')) return { name: 'PayPal', bg: '#003087', color: '#fff', text: 'PayPal' };
  if (lower.includes('apple')) return { name: 'Apple Pay', bg: '#000000', color: '#fff', text: ' Pay' };
  if (lower.includes('credit')) return { name: 'Credit Card', bg: '#1A1F71', color: '#fff', text: '💳 Card' };
  if (lower.includes('debit')) return { name: 'Debit Card', bg: '#0F766E', color: '#fff', text: '💳 Debit' };
  if (lower.includes('autopay')) return { name: 'Autopay', bg: '#4338CA', color: '#fff', text: '🔄 Auto' };
  if (lower.includes('qris') || lower.includes('wallet')) return { name: 'QRIS', bg: '#DC2626', color: '#fff', text: '📱 QRIS' };
  return { name: 'Bank Transfer', bg: '#374151', color: '#fff', text: '🏦 Bank' };
}
