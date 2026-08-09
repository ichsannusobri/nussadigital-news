// ============================================================================
// NDNews Portal — app.js
// Al Jazeera-style news portal focused on APAC: Economy, Finance, Sport
// All content in English
// ============================================================================

'use strict';

// ---------------------------------------------------------------------------
// Storage Keys
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'ndnews_articles_v3';
const COMMENTS_KEY = 'ndnews_comments';

// ---------------------------------------------------------------------------
// Live Updates Data
// ---------------------------------------------------------------------------
const LIVE_UPDATES = [
  { time: '2m ago', text: 'BREAKING: Bank of Japan holds interest rates steady at 0.5%, signals possible hike in September amid persistent inflation pressures.' },
  { time: '15m ago', text: 'ASEAN foreign ministers issue joint statement calling for immediate de-escalation of South China Sea maritime disputes.' },
  { time: '32m ago', text: 'Shanghai Composite Index surges 2.3% after Beijing announces new stimulus package targeting domestic consumption.' },
  { time: '1h ago', text: 'FIFA confirms Singapore will host two Group F matches during World Cup 2026, marking Southeast Asia\'s first World Cup venue.' },
  { time: '2h ago', text: 'India\'s Reliance Industries completes $4.2 billion acquisition of Southeast Asian logistics network, expanding regional footprint.' }
];

// ---------------------------------------------------------------------------
// Trending Topics
// ---------------------------------------------------------------------------
const TRENDING_TOPICS = [
  'World Cup 2026',
  'China GDP',
  'ASEAN Summit',
  'Nikkei Record',
  'RBA Interest Rate',
  'RCEP Trade',
  'Singapore Fintech',
  'Asian Games'
];

// ---------------------------------------------------------------------------
// Default Articles (24 articles, all English, APAC-focused)
// ---------------------------------------------------------------------------
const DEFAULT_ARTICLES = [
  // ── APAC ──────────────────────────────────────────────────────────────
  {
    id: 'art-1',
    title: 'ASEAN Summit 2026: Leaders Forge Historic Agreement on Digital Economy Integration',
    excerpt: 'Southeast Asian leaders have signed a landmark pact to harmonize digital regulations across the bloc. The agreement paves the way for seamless cross-border data flows and unified e-commerce standards.',
    content: 'Leaders of the Association of Southeast Asian Nations concluded their 44th summit in Kuala Lumpur with a historic agreement that promises to reshape the region\'s digital landscape. The Digital Economy Integration Framework, signed by all ten member states, establishes common standards for data governance, electronic payments, and cross-border e-commerce.\n\nThe agreement comes after three years of intense negotiations, during which member states had to reconcile vastly different approaches to data privacy, cybersecurity, and digital taxation. Under the new framework, businesses operating across ASEAN will benefit from a single set of digital regulations, reducing compliance costs by an estimated 40 percent.\n\nMalaysian Prime Minister Anwar Ibrahim, who chaired the summit, called the agreement "a watershed moment for Southeast Asia." He emphasized that the region\'s 700 million people would now have access to a unified digital marketplace rivaling those of China and the European Union.\n\nAnalysts note that the framework could attract significant foreign investment into the region\'s burgeoning tech sector, which has already seen record venture capital inflows in 2026. The agreement also includes provisions for digital skills training, with member states committing to upskill 50 million workers by 2030.\n\nImplementation is expected to begin in January 2027, with a phased rollout that prioritizes e-payments interoperability and mutual recognition of digital identities across borders.',
    category: 'APAC',
    author: 'Sarah Chen',
    authorAvatar: null,
    date: '2026-06-17T08:00:00Z',
    image: 'https://loremflickr.com/800/500/meeting,asia?lock=101',
    tags: ['ASEAN', 'Digital Economy', 'Southeast Asia', 'Trade'],
    isBreaking: true,
    isLive: false,
    isFeatured: true,
    views: 48200,
    readTime: '6 min read'
  },
  {
    id: 'art-2',
    title: 'RCEP Trade Deal Delivers $186 Billion Boost to Asia-Pacific Commerce in First Full Year',
    excerpt: 'New data reveals the Regional Comprehensive Economic Partnership has exceeded expectations, dramatically increasing intra-regional trade volumes. Tariff reductions on 90% of goods have reshaped supply chains.',
    content: 'The Regional Comprehensive Economic Partnership has generated $186 billion in additional trade among its 15 member nations during its first full year of implementation, according to a comprehensive report released by the ASEAN Secretariat. The figures far surpass initial projections of $120 billion.\n\nThe landmark trade agreement, which covers nearly a third of global GDP, has been particularly transformative for small and medium enterprises across the Asia-Pacific. Tariff eliminations on over 90 percent of traded goods have allowed businesses that previously operated only domestically to access markets spanning from New Zealand to Japan.\n\nChina and South Korea have emerged as the biggest beneficiaries in absolute terms, with bilateral trade between the two nations increasing by 23 percent. However, in relative terms, ASEAN\'s developing economies — particularly Vietnam, Cambodia, and Myanmar — have seen the most dramatic percentage gains.\n\n"RCEP has fundamentally altered the calculus for manufacturers considering where to locate their supply chains," said Dr. Rajesh Mehta, chief economist at the Asian Development Bank. "We\'re seeing a genuine rebalancing toward the Asia-Pacific."\n\nChallenges remain, however, particularly around rules of origin compliance and the harmonization of customs procedures. Several member states have also raised concerns about the agreement\'s impact on domestic agricultural sectors.',
    category: 'APAC',
    author: 'James Watanabe',
    authorAvatar: null,
    date: '2026-06-16T14:30:00Z',
    image: 'https://loremflickr.com/800/500/cargo,ship?lock=102',
    tags: ['RCEP', 'Trade', 'Asia-Pacific', 'Commerce'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 31500,
    readTime: '7 min read'
  },
  {
    id: 'art-3',
    title: 'South China Sea Tensions Escalate as Philippines and China Clash Over Second Thomas Shoal',
    excerpt: 'A confrontation between Philippine and Chinese coast guard vessels near Second Thomas Shoal has reignited fears of armed conflict in one of the world\'s most contested waterways.',
    content: 'Tensions in the South China Sea reached their highest point in years after Chinese coast guard vessels used water cannons against a Philippine resupply mission heading to Second Thomas Shoal on Tuesday. The incident injured two Philippine navy personnel and damaged a civilian supply boat.\n\nThe Philippine government summoned China\'s ambassador to Manila and filed a formal diplomatic protest, while President Ferdinand Marcos Jr. convened an emergency meeting of the National Security Council. "We will not be intimidated in our own waters," Marcos declared in a televised address.\n\nThe confrontation has drawn swift international reaction. The United States reaffirmed its "ironclad" commitment to the Philippines under the Mutual Defense Treaty, with the Pentagon confirming the deployment of additional naval assets to the region. Japan and Australia also issued statements expressing concern.\n\nBeijing, however, dismissed the Philippine claims and accused Manila of "deliberate provocations." Chinese Foreign Ministry spokesperson insisted that China holds "indisputable sovereignty" over the features in question.\n\nMaritime security experts warn that the escalating pattern of confrontations raises the risk of miscalculation. "Each incident ratchets up the pressure on both sides to respond more forcefully," said Professor Li Wei of the National University of Singapore. "The window for diplomatic resolution is narrowing."',
    category: 'APAC',
    author: 'Maria Santos',
    authorAvatar: null,
    date: '2026-06-17T10:15:00Z',
    image: 'https://loremflickr.com/800/500/navy,ship?lock=103',
    tags: ['South China Sea', 'Philippines', 'China', 'Security'],
    isBreaking: true,
    isLive: true,
    isFeatured: true,
    views: 45700,
    readTime: '6 min read'
  },
  {
    id: 'art-4',
    title: 'India Unveils Indo-Pacific Economic Corridor to Counter China\'s Belt and Road',
    excerpt: 'New Delhi has announced a $75 billion infrastructure initiative spanning from East Africa to Southeast Asia. The corridor aims to provide an alternative to Chinese-funded development projects.',
    content: 'India\'s Prime Minister unveiled the Indo-Pacific Economic Corridor (IPEC) at the G20 finance ministers\' meeting in Mumbai, a sweeping infrastructure initiative designed to strengthen connectivity across the Indian Ocean region and beyond.\n\nThe $75 billion program will fund ports, railways, digital infrastructure, and clean energy projects in partner nations stretching from Kenya and Tanzania on Africa\'s east coast through South and Southeast Asia. Unlike previous Indian development assistance, IPEC will leverage a mix of government funding, private sector investment, and multilateral development bank financing.\n\n"This is not about geopolitical competition — it is about providing choices," said India\'s External Affairs Minister during the launch ceremony. However, analysts widely view the initiative as New Delhi\'s most ambitious response to China\'s Belt and Road Initiative, which has come under increasing scrutiny over debt sustainability concerns.\n\nJapan, Australia, and France have already signaled their intention to co-invest in IPEC projects, while the United States has offered technical assistance. The first phase of projects, valued at $18 billion, will focus on port modernization in Sri Lanka, Bangladesh, and Vietnam.\n\nCritics point out that India\'s own infrastructure financing track record has been mixed, with several domestic projects running behind schedule and over budget. The government counters that IPEC\'s partnership model addresses many of these challenges.',
    category: 'APAC',
    author: 'Priya Sharma',
    authorAvatar: null,
    date: '2026-06-15T09:00:00Z',
    image: 'https://loremflickr.com/800/500/train,bridge?lock=104',
    tags: ['India', 'Indo-Pacific', 'Infrastructure', 'Belt and Road'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 27800,
    readTime: '7 min read'
  },
  {
    id: 'art-5',
    title: 'Jakarta Climate Summit Secures $50 Billion Green Finance Pledge for Asia-Pacific',
    excerpt: 'World leaders meeting in Jakarta have committed unprecedented funds to climate adaptation and renewable energy across the Asia-Pacific, the region most vulnerable to rising sea levels.',
    content: 'The Asia-Pacific Climate Action Summit concluded in Jakarta with participating nations and multilateral institutions pledging $50 billion in green finance over the next five years. The landmark commitment targets the world\'s most climate-vulnerable region, where rising seas and extreme weather events threaten hundreds of millions of people.\n\nIndonesian President Prabowo Subianto, who hosted the summit, secured commitments from 28 nations and 15 major financial institutions. The funds will support renewable energy transition, coastal protection infrastructure, and climate-resilient agriculture across the region.\n\n"Asia-Pacific nations did not create this crisis, but we are paying the highest price," Prabowo said in his closing address. "Today, the world has finally acknowledged that responsibility with meaningful financial commitments."\n\nThe pledges include $20 billion for renewable energy projects, $15 billion for climate adaptation infrastructure, and $15 billion for ecosystem restoration and sustainable agriculture. A new Asia-Pacific Green Investment Fund will be established to coordinate financing and ensure transparency.\n\nEnvironmental groups cautiously welcomed the pledges but warned that actual disbursement often falls far short of summit commitments. "The $50 billion figure sounds impressive, but the region actually needs $200 billion annually to meet its climate goals," said Greenpeace Southeast Asia director.',
    category: 'APAC',
    author: 'David Tan',
    authorAvatar: null,
    date: '2026-06-14T11:00:00Z',
    image: 'https://loremflickr.com/800/500/solar,city?lock=105',
    tags: ['Climate', 'Jakarta', 'Green Finance', 'Asia-Pacific'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 22300,
    readTime: '6 min read'
  },
  {
    id: 'art-6',
    title: 'Southeast Asia\'s Tech Hubs Challenge Silicon Valley with Record $45 Billion in VC Funding',
    excerpt: 'Singapore, Jakarta, and Ho Chi Minh City are attracting unprecedented venture capital as global investors bet on the region\'s digital transformation and its 400 million internet users.',
    content: 'Southeast Asia\'s technology ecosystem has reached an inflection point, with venture capital investments in the region hitting a record $45 billion in the first half of 2026 — a 67 percent increase over the same period last year. The surge has cemented the region\'s status as the world\'s fastest-growing tech investment destination.\n\nSingapore continues to dominate as the region\'s financial and tech hub, attracting $18 billion of the total. But the most dramatic growth has been in Indonesia and Vietnam, where a rapidly expanding middle class and accelerating digital adoption have created enormous market opportunities.\n\nKey sectors driving the boom include fintech, e-commerce logistics, healthtech, and artificial intelligence. Indonesian super-app GoTo announced a $2 billion AI investment, while Vietnamese semiconductor startup FPT Semiconductor raised $800 million in one of the region\'s largest-ever Series C rounds.\n\n"The narrative has completely shifted," said venture capitalist Mark Pang of Sequoia Capital Southeast Asia. "Five years ago, investors viewed the region as frontier. Today, it\'s core portfolio allocation."\n\nThe talent pipeline is also evolving rapidly. Regional universities are producing record numbers of computer science graduates, while reverse migration of engineers from Silicon Valley to their home countries has accelerated significantly since 2024.',
    category: 'APAC',
    author: 'Rachel Nguyen',
    authorAvatar: null,
    date: '2026-06-13T07:45:00Z',
    image: 'https://loremflickr.com/800/500/startup,office?lock=106',
    tags: ['Tech', 'Southeast Asia', 'Venture Capital', 'Startups'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 19400,
    readTime: '5 min read'
  },

  // ── Economy ───────────────────────────────────────────────────────────
  {
    id: 'art-7',
    title: 'China\'s GDP Growth Surges to 5.8% as Stimulus Measures Fuel Consumer Spending',
    excerpt: 'China\'s economy expanded at its fastest pace in two years, driven by aggressive fiscal stimulus and a resurgent property market. Analysts warn sustainability remains uncertain.',
    content: 'China\'s gross domestic product grew 5.8 percent year-on-year in the second quarter of 2026, beating market expectations of 5.2 percent and marking the strongest expansion since early 2024. The National Bureau of Statistics attributed the rebound primarily to robust consumer spending and a stabilizing real estate sector.\n\nRetail sales surged 8.1 percent, buoyed by government subsidies on electric vehicles, home appliances, and digital products. The property market, which had been a persistent drag on growth for over two years, showed signs of stabilization after Beijing introduced sweeping reforms including reduced mortgage rates and relaxed purchase restrictions in tier-one cities.\n\nIndustrial output rose 6.4 percent, driven by strong demand for green technology exports and continued expansion in the semiconductor sector. China\'s electric vehicle manufacturers reported record domestic and international sales, with exports to Southeast Asia more than doubling year-on-year.\n\nHowever, economists cautioned that the recovery remains uneven. Youth unemployment, while improved, still hovers above 15 percent, and deflationary pressures in the producer price index suggest underlying demand weakness. "The headline number is encouraging, but the quality of growth matters more than the quantity," said Nomura\'s chief China economist.\n\nLooking ahead, the government has signaled additional fiscal support in the second half of the year, including infrastructure spending and targeted support for the technology sector.',
    category: 'Economy',
    author: 'Michael Zhang',
    authorAvatar: null,
    date: '2026-06-17T06:00:00Z',
    image: 'https://loremflickr.com/800/500/shopping,mall?lock=107',
    tags: ['China', 'GDP', 'Economic Growth', 'Stimulus'],
    isBreaking: false,
    isLive: false,
    isFeatured: true,
    views: 42100,
    readTime: '6 min read'
  },
  {
    id: 'art-8',
    title: 'Asian Central Banks Hold Rates Amid Inflation Divergence Across the Region',
    excerpt: 'While Japan and South Korea face persistent inflation, Southeast Asian nations are seeing price pressures ease. The divergence is complicating monetary policy across the continent.',
    content: 'Central banks across Asia are grappling with an increasingly complex inflation landscape as price pressures diverge sharply between Northeast and Southeast Asian economies. This week saw rate decisions from six major Asian central banks, with all choosing to hold rates steady but for vastly different reasons.\n\nThe Bank of Japan maintained its benchmark rate at 0.5 percent despite core inflation running at 3.2 percent, citing the need to support wage growth and consumption. Markets widely expect a rate hike at the September meeting. South Korea\'s central bank similarly held at 3.25 percent, with Governor Rhee Chang-yong signaling that rates have likely peaked.\n\nIn contrast, Bank Indonesia, the Bangko Sentral ng Pilipinas, and Bank Negara Malaysia all held rates while pointing to declining inflation as justification for maintaining an easing bias. Indonesian inflation fell to 2.1 percent, well within the central bank\'s target range.\n\n"We\'re seeing a two-speed Asia," explained Dr. Tanaka Yuki of the Asian Development Bank Institute. "Economies with tighter labor markets and stronger currencies are fighting different battles than those still in recovery mode."\n\nThe divergence has significant implications for currency markets, with the yen weakening further against Southeast Asian currencies. The resulting competitive dynamics could reshape trade patterns across the region in the months ahead.',
    category: 'Economy',
    author: 'Akiko Tanaka',
    authorAvatar: null,
    date: '2026-06-16T12:00:00Z',
    image: 'https://loremflickr.com/800/500/bank,finance?lock=108',
    tags: ['Central Banks', 'Interest Rates', 'Inflation', 'Asia'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 28900,
    readTime: '7 min read'
  },
  {
    id: 'art-9',
    title: 'Global Supply Chains Accelerate Shift to Vietnam and India as China Costs Rise',
    excerpt: 'Multinational corporations are accelerating the diversification of their supply chains away from China. Vietnam and India are the biggest winners of the "China Plus One" strategy.',
    content: 'The reconfiguration of global supply chains away from China has entered a new phase, with multinational corporations significantly accelerating investments in Vietnam and India during the first half of 2026. Foreign direct investment into Vietnam surged 34 percent year-on-year, while India attracted a record $42 billion in manufacturing FDI.\n\nThe shift is being driven by a convergence of factors: rising labor costs in China, geopolitical risks highlighted by ongoing US-China trade tensions, and active courting by alternative host nations. Apple\'s decision to move 30 percent of iPhone production to India by 2027 has been a bellwether for the broader trend.\n\nVietnam has emerged as the preferred destination for electronics and textile manufacturers, with Samsung, Intel, and numerous Japanese firms expanding their presence. The country\'s membership in both RCEP and the CPTPP trade agreements gives it unique market access advantages.\n\nIndia, meanwhile, is attracting heavier industries including automotive, chemicals, and semiconductor fabrication. The Indian government\'s Production-Linked Incentive scheme has been instrumental, offering manufacturers billions in subsidies for meeting domestic production targets.\n\nHowever, both countries face significant infrastructure and regulatory challenges. "Moving supply chains sounds simple in a boardroom presentation," warned logistics consultant Amanda Lee of McKinsey. "The reality involves years of building supporting ecosystems, training workers, and navigating local regulations."',
    category: 'Economy',
    author: 'Daniel Park',
    authorAvatar: null,
    date: '2026-06-15T15:30:00Z',
    image: 'https://loremflickr.com/800/500/factory,asia?lock=109',
    tags: ['Supply Chain', 'Vietnam', 'India', 'Manufacturing'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 25600,
    readTime: '6 min read'
  },
  {
    id: 'art-10',
    title: 'Asia\'s Semiconductor Race Intensifies with $120 Billion in New Fab Investments',
    excerpt: 'Japan, South Korea, India, and Southeast Asian nations are pouring unprecedented capital into chip fabrication as the global semiconductor race reshapes industrial policy across Asia.',
    content: 'The Asia-Pacific semiconductor industry is undergoing its most significant transformation in decades, with governments and corporations announcing over $120 billion in new fabrication facility investments during the first half of 2026. The spending spree reflects both commercial opportunity and national security imperatives.\n\nJapan\'s Rapidus consortium, backed by $25 billion in government subsidies, broke ground on its advanced 2-nanometer chip facility in Hokkaido. South Korea\'s Samsung and SK Hynix jointly pledged $50 billion for next-generation memory and logic chip plants. Taiwan\'s TSMC confirmed plans for a second Japanese facility, adding to its growing presence outside Taiwan.\n\nThe most surprising developments have come from emerging players. India approved $15 billion in incentives for semiconductor manufacturing, attracting commitments from Micron, Tower Semiconductor, and the Tata Group. Vietnam signed a technology transfer agreement with South Korea to develop its own chip packaging and testing capabilities.\n\n"The semiconductor landscape in Asia is being completely redrawn," said semiconductor analyst Dr. Kim Soo-jin of KAIST. "Every nation now views chips as strategic infrastructure on par with energy and telecommunications."\n\nThe investments are expected to create over 500,000 high-skilled jobs across the region by 2030, though workforce availability remains a critical bottleneck. Universities across Asia are rapidly expanding their semiconductor engineering programs in response.',
    category: 'Economy',
    author: 'Kevin Liu',
    authorAvatar: null,
    date: '2026-06-14T08:30:00Z',
    image: 'https://loremflickr.com/800/500/microchip,tech?lock=110',
    tags: ['Semiconductor', 'Chips', 'Manufacturing', 'Technology'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 33200,
    readTime: '7 min read'
  },
  {
    id: 'art-11',
    title: 'Green Energy Investments in Asia Hit Record $280 Billion Amid Net-Zero Push',
    excerpt: 'Asia-Pacific nations poured a record $280 billion into renewable energy projects in the past year, with solar and offshore wind leading the charge toward net-zero emissions targets.',
    content: 'Clean energy investments across the Asia-Pacific region reached an unprecedented $280 billion in the 12 months ending June 2026, according to new data from BloombergNEF. The figure represents a 45 percent increase over the previous year and accounts for nearly half of all global green energy spending.\n\nChina continues to dominate, investing $165 billion primarily in solar manufacturing, onshore wind, and battery storage. However, the fastest growth rates are being recorded in India, Vietnam, and Indonesia, where government mandates and falling technology costs are driving rapid adoption.\n\nOffshore wind has emerged as a transformative technology for the region. Japan commissioned its first large-scale floating offshore wind farm, while South Korea and Taiwan both have projects exceeding 2 gigawatts under construction. Vietnam\'s ambitious plan to install 6 GW of offshore wind by 2030 has attracted major European developers.\n\nThe investment boom is creating significant employment opportunities. The International Renewable Energy Agency estimates that Asia-Pacific now accounts for 8 million of the world\'s 14 million renewable energy jobs, with the figure expected to reach 12 million by 2030.\n\nCritically, the region\'s green energy transition is being accompanied by investments in grid infrastructure and energy storage, addressing the intermittency challenges that have historically limited renewable penetration. Battery storage capacity across Asia-Pacific doubled in the past year.',
    category: 'Economy',
    author: 'Lisa Yamamoto',
    authorAvatar: null,
    date: '2026-06-12T10:00:00Z',
    image: 'https://loremflickr.com/800/500/wind,turbine?lock=111',
    tags: ['Green Energy', 'Renewable', 'Solar', 'Net Zero'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 18700,
    readTime: '6 min read'
  },

  // ── Finance ───────────────────────────────────────────────────────────
  {
    id: 'art-12',
    title: 'Nikkei 225 Smashes All-Time Record, Closes Above 45,000 for First Time',
    excerpt: 'Japan\'s benchmark stock index surged past 45,000, driven by foreign investor inflows and a weaker yen boosting corporate earnings. The rally marks a new era for Japanese equities.',
    content: 'The Nikkei 225 shattered its previous all-time record on Tuesday, closing above the 45,000 mark for the first time in its 75-year history. The benchmark Japanese equity index rose 2.1 percent to finish at 45,287, capping a remarkable 28 percent gain over the past twelve months.\n\nThe rally has been fueled by a confluence of favorable factors: a weaker yen boosting export earnings, corporate governance reforms attracting foreign capital, and Japan\'s emergence as a key beneficiary of the global semiconductor boom. Warren Buffett\'s Berkshire Hathaway recently increased its stakes in Japan\'s five major trading houses, providing additional impetus.\n\nForeign investors have poured a net $48 billion into Japanese equities in 2026, making it the world\'s most popular equity market for international capital flows. The Tokyo Stock Exchange\'s push for companies to improve shareholder returns through buybacks and dividend increases has been particularly effective.\n\n"Japan is no longer an afterthought — it\'s the main course," said Goldman Sachs\' chief Japan strategist. "The combination of corporate reform, currency competitiveness, and geopolitical positioning has created a structural bull case."\n\nHowever, some analysts warn that the rally may be overextended. Valuations for certain sectors have reached levels not seen since the late 1980s bubble, and a potential Bank of Japan rate hike could strengthen the yen and pressure export-dependent stocks.',
    category: 'Finance',
    author: 'Takeshi Mori',
    authorAvatar: null,
    date: '2026-06-17T09:30:00Z',
    image: 'https://loremflickr.com/800/500/stock,market?lock=112',
    tags: ['Nikkei', 'Japan', 'Stock Market', 'Equities'],
    isBreaking: false,
    isLive: false,
    isFeatured: true,
    views: 38500,
    readTime: '5 min read'
  },
  {
    id: 'art-13',
    title: 'Asian Forex Markets Roiled as Dollar Weakens Against Regional Currencies',
    excerpt: 'The US dollar fell to multi-month lows against Asian currencies following dovish Federal Reserve signals. The Thai baht, Korean won, and Indian rupee all posted significant gains.',
    content: 'Currency markets across Asia experienced significant volatility this week as the US dollar weakened sharply following Federal Reserve Chair Jerome Powell\'s dovish testimony to Congress. The Dollar Index fell 1.8 percent, its largest weekly decline in six months, sending ripples across Asian forex markets.\n\nThe Thai baht led regional gains, appreciating 2.3 percent against the dollar to its strongest level since 2022. The Korean won gained 1.9 percent, while the Indian rupee strengthened 1.4 percent. The Japanese yen, however, underperformed its regional peers, rising only 0.6 percent as the Bank of Japan\'s ultra-loose monetary policy continues to weigh on the currency.\n\nCentral banks across the region responded with measured interventions to prevent excessive currency appreciation that could harm export competitiveness. Bank of Thailand was reported to have sold baht in the market, while the Reserve Bank of India added to its foreign exchange reserves.\n\n"The dollar weakness is creating both opportunities and challenges for Asian economies," said forex strategist Anjali Desai of Standard Chartered. "Stronger currencies help contain imported inflation but can squeeze export margins."\n\nLooking ahead, markets are pricing in two Federal Reserve rate cuts by year-end, which could sustain pressure on the dollar and support further Asian currency appreciation. The divergence with Bank of Japan policy makes the yen a wild card in regional currency dynamics.',
    category: 'Finance',
    author: 'Robert Kim',
    authorAvatar: null,
    date: '2026-06-16T16:00:00Z',
    image: 'https://loremflickr.com/800/500/currency,exchange?lock=113',
    tags: ['Forex', 'Dollar', 'Asian Currencies', 'Central Banks'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 21700,
    readTime: '5 min read'
  },
  {
    id: 'art-14',
    title: 'Singapore Emerges as Asia\'s Crypto Regulation Model as Frameworks Take Shape',
    excerpt: 'Singapore\'s comprehensive cryptocurrency regulatory framework is being adopted as a template across Asia. The city-state has licensed 12 major exchanges while maintaining strict consumer protections.',
    content: 'Singapore has solidified its position as Asia\'s leading cryptocurrency regulatory hub, with the Monetary Authority of Singapore (MAS) granting licenses to 12 major digital asset exchanges under its comprehensive regulatory framework. The approach is now being studied by regulators across the region as a model for balancing innovation with consumer protection.\n\nThe MAS framework requires licensed exchanges to maintain segregated customer funds, implement robust anti-money laundering procedures, and meet strict capital adequacy requirements. Unlike more permissive regimes, Singapore also mandates real-time surveillance of trading activities to detect market manipulation.\n\nThe regulatory clarity has attracted significant institutional capital to Singapore\'s crypto ecosystem. DBS Bank, Southeast Asia\'s largest bank, reported that its digital asset exchange now handles $2 billion in monthly trading volume, primarily from institutional clients.\n\nJapan and Hong Kong have implemented similar frameworks, while South Korea and India are in advanced stages of developing their own comprehensive regulations. Thailand and the Philippines have taken a more cautious approach, restricting retail crypto trading while allowing institutional participation.\n\n"Singapore has proven that you can regulate crypto without killing innovation," said fintech researcher Dr. Chen Wei of NUS Business School. "The key insight is that clear rules actually attract more capital than regulatory ambiguity."',
    category: 'Finance',
    author: 'Amanda Patel',
    authorAvatar: null,
    date: '2026-06-15T13:00:00Z',
    image: 'https://loremflickr.com/800/500/crypto,bitcoin?lock=114',
    tags: ['Crypto', 'Singapore', 'Regulation', 'Fintech'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 24300,
    readTime: '5 min read'
  },
  {
    id: 'art-15',
    title: 'Asian IPO Market Surges with $38 Billion Raised in Biggest First-Half Since 2021',
    excerpt: 'Stock exchanges across Asia are hosting a wave of major listings as investor confidence returns. India and Southeast Asia lead the IPO boom with tech and consumer companies.',
    content: 'Asia\'s initial public offering market has roared back to life, with $38 billion raised across regional exchanges in the first half of 2026 — the strongest first-half performance since the 2021 boom. The resurgence reflects renewed investor appetite for growth stories in the world\'s fastest-expanding economic region.\n\nIndia\'s markets have been the standout performers, with the Bombay Stock Exchange hosting 85 IPOs worth $12 billion. The largest was renewable energy conglomerate Adani Green\'s subsidiary listing at $3.2 billion. Indonesia\'s stock exchange attracted $6 billion in new listings, while Hong Kong staged a recovery with $8 billion raised.\n\nTechnology companies dominate the listings, but consumer brands and healthcare firms are also drawing strong interest. Vietnamese electric vehicle maker VinFast\'s secondary listing in Singapore raised $2.1 billion, while Indonesian healthtech company Halodoc\'s IPO was 15 times oversubscribed.\n\nThe IPO pipeline for the second half remains robust, with over $25 billion in planned listings already in registration. Notable upcoming deals include a major Malaysian fintech platform and a South Korean AI chipmaker.\n\n"Asian capital markets have entered a sweet spot," said JPMorgan\'s head of Asia equity capital markets. "Strong economic growth, improving corporate governance, and deep retail investor participation are creating ideal conditions for listings."',
    category: 'Finance',
    author: 'Chris Lim',
    authorAvatar: null,
    date: '2026-06-13T11:30:00Z',
    image: 'https://loremflickr.com/800/500/ipo,finance?lock=115',
    tags: ['IPO', 'Stock Market', 'Asia', 'Capital Markets'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 20100,
    readTime: '6 min read'
  },

  // ── Sport ─────────────────────────────────────────────────────────────
  {
    id: 'art-16',
    title: 'FIFA World Cup 2026: Japan and Australia Draw Powerhouse Groups in Historic Expanded Tournament',
    excerpt: 'The draw for the first 48-team World Cup has placed Japan in a group with Spain and Nigeria, while Australia faces Argentina and Egypt. Asian nations eye deep tournament runs.',
    content: 'The FIFA World Cup 2026 draw ceremony in New York delivered dramatic pairings for Asia\'s representatives in what will be the first expanded 48-team tournament. The competition, co-hosted by the United States, Mexico, and Canada, will feature a record eight Asian Football Confederation teams.\n\nJapan, ranked 14th in the world and seen as genuine contenders, were drawn into Group F alongside Spain and Nigeria. Head coach Hajime Moriyasu expressed confidence, saying, "We have the quality and experience to advance from any group. Our players compete at the highest level in Europe."\n\nAustralia face a formidable challenge in Group H with Argentina and Egypt, while South Korea were handed a potentially favorable draw against Switzerland and Cameroon. Saudi Arabia, Iran, Qatar, Uzbekistan, and Indonesia — making their first World Cup appearance since 1938 — round out Asia\'s contingent.\n\nIndonesia\'s remarkable qualification story has captured global attention. The team, coached by Shin Tae-yong, completed a fairy-tale qualifying campaign to reach only their second World Cup. They were drawn against France and Canada in Group A.\n\nWith the tournament kicking off on June 11, 2026, at MetLife Stadium in New Jersey, anticipation across Asia is at fever pitch. FIFA projects that the expanded format could generate $11 billion in revenue, with Asian broadcasting rights already sold for a record $2.8 billion.',
    category: 'Sport',
    author: 'Tony Hartanto',
    authorAvatar: null,
    date: '2026-06-17T04:00:00Z',
    image: 'https://loremflickr.com/800/500/soccer,stadium?lock=116',
    tags: ['World Cup', 'FIFA', 'Football', 'Soccer'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 47300,
    readTime: '6 min read'
  },
  {
    id: 'art-17',
    title: 'Asian Games 2026: Nagoya Prepares to Host Largest-Ever Multi-Sport Event in Asia',
    excerpt: 'With 45 sports and over 10,000 athletes, the Nagoya Asian Games promises to showcase Asia\'s sporting prowess. Japan is investing $3 billion in state-of-the-art venues.',
    content: 'Nagoya is putting the finishing touches on preparations for the 20th Asian Games, set to open on September 19, 2026. The event will be the largest multi-sport competition in Asian history, featuring 45 sports, 481 events, and over 10,000 athletes from 45 nations and territories.\n\nJapan has invested $3 billion in venues and infrastructure, including a stunning new 60,000-seat Olympic Stadium, an aquatics center with a retractable roof, and a dedicated esports arena — reflecting the Games\' inclusion of competitive gaming as a medal sport for the first time.\n\nChina is expected to top the medal tally as usual, but host nation Japan is targeting a strong second-place finish. South Korea, India, and Uzbekistan are also expected to feature prominently. Indonesia has set an ambitious target of finishing in the top five, supported by a $500 million athlete development program.\n\nThe Games will also feature several demonstration sports including cricket T10 and drone racing, reflecting the OCA\'s efforts to attract younger audiences. Ticket sales have been strong, with 85 percent of sessions already sold out.\n\n"The Nagoya Asian Games will be a landmark event that demonstrates Asia\'s growing sporting infrastructure and talent," said OCA President Raja Randhir Singh. "The facilities Japan has built will serve as a model for future host cities."',
    category: 'Sport',
    author: 'Yuki Nakamura',
    authorAvatar: null,
    date: '2026-06-16T07:00:00Z',
    image: 'https://loremflickr.com/800/500/athletics,stadium?lock=117',
    tags: ['Asian Games', 'Nagoya', 'Multi-Sport', 'Japan'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 29400,
    readTime: '5 min read'
  },
  {
    id: 'art-18',
    title: 'India Clinch Dramatic Cricket World Cup Victory Over England at Wankhede Stadium',
    excerpt: 'Virat Kohli\'s century in his farewell match leads India to a thrilling 18-run victory in the Cricket World Cup final, completing a perfect unbeaten campaign.',
    content: 'India won the ICC Cricket World Cup in extraordinary fashion, defeating England by 18 runs in a pulsating final at Mumbai\'s Wankhede Stadium. The victory was crowned by a magnificent century from Virat Kohli, who had announced before the tournament that this would be his final World Cup appearance.\n\nKohli, batting at number three, scored 113 off 98 balls in an innings that will be remembered as one of the greatest in World Cup final history. His partnership of 164 with Shubman Gill propelled India to a formidable total of 312 for 7 from their 50 overs.\n\nEngland\'s reply started strongly, with captain Harry Brook scoring a rapid 78. But Indian spinner Kuldeep Yadav turned the match with a devastating spell of 4 for 38, dismantling England\'s middle order. Despite a valiant lower-order resistance led by Sam Curran (45 not out), England fell short at 294 all out.\n\n"This is for every Indian who has dreamed of this moment," an emotional Kohli said at the presentation ceremony, fighting back tears. "To finish like this, in Mumbai, in front of this crowd — there are no words."\n\nThe victory completed India\'s perfect run of 11 wins from 11 matches in the tournament and sparked celebrations across the country. An estimated 300 million viewers in India alone watched the final live, making it the most-watched cricket broadcast in history.',
    category: 'Sport',
    author: 'Rahul Dravid',
    authorAvatar: null,
    date: '2026-06-14T18:00:00Z',
    image: 'https://loremflickr.com/800/500/cricket,sport?lock=118',
    tags: ['Cricket', 'World Cup', 'India', 'England'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 41200,
    readTime: '5 min read'
  },
  {
    id: 'art-19',
    title: 'Formula 1: Singapore Grand Prix 2026 Unveils Extended Marina Bay Street Circuit',
    excerpt: 'Singapore has revealed a redesigned Marina Bay circuit with a new waterfront section, adding 1.2 km to the iconic night race course. Teams praise the technical challenge.',
    content: 'The Singapore Grand Prix organizing committee has unveiled a significantly redesigned Marina Bay Street Circuit for the 2026 edition of Formula 1\'s iconic night race. The extended layout adds 1.2 kilometers to the track, incorporating a spectacular new waterfront section along the Marina Reservoir.\n\nThe revised circuit, measuring 6.3 kilometers, features four new corners including a high-speed sweeper along the waterfront promenade that is expected to become one of the most visually dramatic sections on the F1 calendar. The changes are designed to improve overtaking opportunities, addressing a longstanding criticism of the original layout.\n\nRed Bull\'s Max Verstappen, who has won three of the last four Singapore races, described the new section as "incredibly exciting." Ferrari\'s Lewis Hamilton, competing in his second season with the Italian team, called it "the kind of challenge that reminds you why you love racing."\n\nThe Singapore race has long been one of F1\'s crown jewels, with its spectacular night setting against the city\'s illuminated skyline drawing television audiences of over 100 million. The 2026 event will also feature a new entertainment zone in the Padang area with capacity for 25,000 spectators.\n\nTicket prices for the October event range from $168 for general admission to $1,850 for premium hospitality packages. Organizers report that 70 percent of tickets have already been sold, with strong demand from across the Asia-Pacific region.',
    category: 'Sport',
    author: 'Nick Williams',
    authorAvatar: null,
    date: '2026-06-13T14:00:00Z',
    image: 'https://loremflickr.com/800/500/formula1,race?lock=119',
    tags: ['F1', 'Singapore GP', 'Formula 1', 'Motorsport'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 26800,
    readTime: '5 min read'
  },

  // ── Opinion ───────────────────────────────────────────────────────────
  {
    id: 'art-20',
    title: 'Opinion: The New Asian Century Is Not a Prediction — It\'s Already Here',
    excerpt: 'Asia\'s share of global GDP has surpassed 45 percent for the first time. The implications for global governance, trade patterns, and cultural influence are profound and irreversible.',
    content: 'When historians look back at the 2020s, they will likely identify this period as the moment when Asia\'s economic dominance became irreversible. The region\'s share of global GDP has quietly crossed the 45 percent threshold — a milestone that should fundamentally reshape how we think about global governance, trade architecture, and cultural influence.\n\nThis is not a projection or an aspiration. It is a statement of current reality. Asia is home to four of the world\'s ten largest economies, produces more than half of global manufactured goods, and is the epicenter of the technologies — from semiconductors to artificial intelligence to clean energy — that will define the coming decades.\n\nYet the institutions of global governance remain stubbornly anchored in a post-World War II framework that no longer reflects the distribution of economic and political power. Asia remains underrepresented in the UN Security Council, the IMF, and the World Bank. This institutional lag is not merely unfair — it is destabilizing.\n\nThe rise of RCEP, the expansion of the BRICS, and the growing assertiveness of middle powers like Indonesia and India are all responses to this institutional deficit. Asia is not waiting for permission to reshape the global order — it is building its own architecture.\n\nFor Western policymakers, the challenge is clear: adapt to a multipolar reality or risk irrelevance. The Asian Century is not coming. It is here.',
    category: 'Opinion',
    author: 'Professor Kishore Mahbubani',
    authorAvatar: null,
    date: '2026-06-16T09:00:00Z',
    image: 'https://loremflickr.com/800/500/cityscape,asia?lock=120',
    tags: ['Opinion', 'Asia', 'Geopolitics', 'Global Economy'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 35600,
    readTime: '8 min read'
  },
  {
    id: 'art-21',
    title: 'Opinion: Why the US-China Trade War Is Reshaping Asia\'s Economic Alliances',
    excerpt: 'As Washington and Beijing continue their economic rivalry, Southeast Asian nations are learning to play both sides. This strategic ambiguity may prove to be the region\'s greatest asset.',
    content: 'The enduring trade tensions between the United States and China have inadvertently created the most favorable strategic environment for Southeast Asian economies in decades. While commentators often frame the US-China rivalry as a zero-sum contest, the reality on the ground in ASEAN capitals tells a very different story.\n\nSoutheast Asian nations have become masters of strategic ambiguity, maintaining robust economic ties with both superpowers while avoiding the hard alignment that either would prefer. Indonesia imports Chinese high-speed rail technology while hosting joint military exercises with the United States. Vietnam manufactures for American tech giants while deepening energy cooperation with Chinese state firms.\n\nThis is not fence-sitting — it is sophisticated statecraft. ASEAN nations have learned from history that small and medium states suffer most when great powers demand exclusive loyalty. The current approach maximizes economic benefit while preserving strategic autonomy.\n\nThe data supports this strategy. ASEAN\'s collective GDP has grown faster than either the US or China over the past three years. Foreign direct investment into the region has doubled since 2020. The trade war, paradoxically, has been very good for Southeast Asia.\n\nThe question is whether this golden era of strategic ambiguity is sustainable. As US-China competition intensifies, the pressure on ASEAN nations to choose sides will grow. The region\'s leaders must prepare for the possibility that hedging becomes harder even as it remains essential.',
    category: 'Opinion',
    author: 'Dr. Dewi Fortuna Anwar',
    authorAvatar: null,
    date: '2026-06-14T09:30:00Z',
    image: 'https://loremflickr.com/800/500/cargo,container?lock=121',
    tags: ['Opinion', 'Trade War', 'US-China', 'ASEAN'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 31200,
    readTime: '7 min read'
  },

  // ── Explainer ─────────────────────────────────────────────────────────
  {
    id: 'art-22',
    title: 'Explainer: How RCEP Works and Why It Matters for Global Trade',
    excerpt: 'The Regional Comprehensive Economic Partnership is the world\'s largest trade agreement. Here\'s everything you need to know about how it works, who benefits, and what it means for the global economy.',
    content: 'The Regional Comprehensive Economic Partnership (RCEP) is the world\'s largest free trade agreement, covering 15 Asia-Pacific nations that together account for roughly 30 percent of global GDP and population. But what exactly does it do, and why should you care?\n\nAt its core, RCEP eliminates tariffs on over 90 percent of goods traded between member nations over a 20-year implementation period. This means that a Japanese car manufacturer can source components from South Korea, assemble them in Thailand, and sell the finished product in Australia — all with minimal tariff barriers.\n\nThe agreement\'s most innovative feature is its unified rules of origin system. Under previous bilateral trade agreements, companies had to navigate a "noodle bowl" of different rules for each country pair. RCEP simplifies this by creating a single set of rules that apply across all 15 members.\n\nRCEP also covers services trade, intellectual property, e-commerce, and government procurement, though these provisions are less ambitious than those in agreements like the CPTPP. Notably, RCEP does not include labor or environmental standards, a point of criticism from some trade experts.\n\nThe biggest beneficiaries are businesses in ASEAN\'s developing economies that previously faced high tariffs in markets like Japan and South Korea. For consumers, the agreement promises lower prices on a wide range of goods, from electronics to agricultural products, as competition increases and supply chains become more efficient.',
    category: 'Explainer',
    author: 'Sophie Anderson',
    authorAvatar: null,
    date: '2026-06-15T06:00:00Z',
    image: 'https://loremflickr.com/800/500/logistics,ship?lock=122',
    tags: ['RCEP', 'Trade', 'Explainer', 'Asia-Pacific'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 16500,
    readTime: '8 min read'
  },
  {
    id: 'art-23',
    title: 'Explainer: Understanding Central Bank Tools — From Interest Rates to Quantitative Easing',
    excerpt: 'Central banks wield enormous influence over economies, but their toolkit can be confusing. This guide explains the key instruments from conventional rate-setting to unconventional monetary policy.',
    content: 'Central banks are arguably the most powerful economic institutions in the world, yet the tools they use to influence economies remain poorly understood by most people. With Asian central banks making headlines for their divergent policy decisions, here is a guide to what they actually do and how.\n\nThe primary tool is the policy interest rate — the rate at which commercial banks can borrow from the central bank. When this rate goes up, borrowing becomes more expensive throughout the economy, cooling spending and investment. When it goes down, the opposite happens. This is how central banks fight inflation (higher rates) or stimulate growth (lower rates).\n\nBut what happens when interest rates are already near zero? Central banks then turn to "unconventional" tools. Quantitative easing (QE) involves the central bank purchasing government bonds and other assets, injecting money directly into the financial system. The Bank of Japan has been the most aggressive practitioner of QE in Asia.\n\nOther tools include forward guidance — communicating future policy intentions to influence market expectations — and yield curve control, where the central bank targets specific government bond yields rather than just the short-term rate.\n\nIn Asia, central banks also frequently intervene in foreign exchange markets to manage their currencies. Countries like Singapore use the exchange rate itself as their primary monetary policy tool, rather than interest rates. Understanding these differences is crucial for anyone investing or doing business in the region.',
    category: 'Explainer',
    author: 'Jonathan Wu',
    authorAvatar: null,
    date: '2026-06-12T08:00:00Z',
    image: 'https://loremflickr.com/800/500/vault,bank?lock=123',
    tags: ['Central Banks', 'Monetary Policy', 'Interest Rates', 'Explainer'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 14200,
    readTime: '9 min read'
  },
  {
    id: 'art-24',
    title: 'Explainer: The FIFA World Cup 2026 Format — Everything You Need to Know',
    excerpt: 'The 2026 World Cup features a brand-new 48-team format with significant changes to group stages and knockout rounds. Here\'s your complete guide to how the tournament works.',
    content: 'The 2026 FIFA World Cup will be the biggest in history, featuring 48 teams across three host nations — the United States, Mexico, and Canada. The expanded format brings major changes to how the tournament is structured, and it can be confusing. Here is your complete guide.\n\nThe 48 teams are divided into 12 groups of four, a change from the previous format of eight groups of four in a 32-team tournament. Each team plays three group matches. The top two from each group advance, along with the eight best third-placed teams, creating a 32-team knockout round.\n\nThis means the tournament will feature 104 matches in total, up from 64 in the previous format. The group stage runs for 18 days, followed by a knockout phase that includes a Round of 32, Round of 16, quarter-finals, semi-finals, and the final.\n\nThe Asia Football Confederation has eight representatives — the most in the confederation\'s World Cup history. Japan, Australia, South Korea, Saudi Arabia, Iran, Qatar, Uzbekistan, and Indonesia have all qualified. The expanded format has been praised for giving more nations the chance to compete on the world\'s biggest stage.\n\nCritics argue that the enlarged tournament dilutes quality and creates scheduling challenges. FIFA counters that the format maintains competitive integrity while making the World Cup more globally inclusive. The final will be held at MetLife Stadium in New Jersey on July 19, 2026.',
    category: 'Explainer',
    author: 'Alex Ferguson',
    authorAvatar: null,
    date: '2026-06-11T12:00:00Z',
    image: 'https://loremflickr.com/800/500/soccer,ball?lock=124',
    tags: ['World Cup', 'FIFA', 'Format', 'Explainer'],
    isBreaking: false,
    isLive: false,
    isFeatured: false,
    views: 22900,
    readTime: '6 min read'
  }
];

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

/**
 * Load articles from localStorage, seeding defaults if empty.
 * @returns {Array} Array of article objects
 */
/**
 * Global state for articles loaded from Firebase
 */
window.appArticles = [];

/**
 * Fetch all articles from Firebase Firestore
 * If empty, seeds with DEFAULT_ARTICLES.
 */
async function fetchArticlesFromFirebase() {
  const { collection, getDocs, setDoc, doc } = window.fsTools;
  const db = window.firebaseDB;
  
  try {
    const querySnapshot = await getDocs(collection(db, "articles"));
    let articles = [];
    querySnapshot.forEach((doc) => {
      articles.push(doc.data());
    });
    
    if (articles.length === 0) {
      console.warn('NDNews: Firebase is empty. Seeding defaults...');
      for (const a of DEFAULT_ARTICLES) {
        await setDoc(doc(db, "articles", a.id), a);
      }
      articles = [...DEFAULT_ARTICLES];
    }
    
    // Sort by date descending
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    window.appArticles = articles;
    return articles;
  } catch (e) {
    console.error('NDNews: Failed to load from Firebase. Using local fallback.', e);
    window.appArticles = [...DEFAULT_ARTICLES];
    return window.appArticles;
  }
}

function loadArticles() {
  return window.appArticles;
}

function saveArticles(articles) {
  // Deprecated: We now save individually to Firebase
}

function getArticleById(id) {
  const articles = loadArticles();
  return articles.find(a => a.id === id) || null;
}

function getArticlesByCategory(cat) {
  const articles = loadArticles();
  return articles.filter(a => a.category.toLowerCase() === cat.toLowerCase());
}

function searchArticles(query) {
  if (!query || !query.trim()) return loadArticles();
  const q = query.toLowerCase().trim();
  const articles = loadArticles();
  return articles.filter(a => {
    const inTitle = a.title.toLowerCase().includes(q);
    const inContent = a.content.toLowerCase().includes(q);
    const inExcerpt = a.excerpt.toLowerCase().includes(q);
    const inTags = a.tags && a.tags.some(t => t.toLowerCase().includes(q));
    return inTitle || inContent || inExcerpt || inTags;
  });
}

async function deleteArticle(id) {
  const { doc, deleteDoc } = window.fsTools;
  const db = window.firebaseDB;
  
  // Optimistically delete
  window.appArticles = window.appArticles.filter(a => a.id !== id);

  try {
    await deleteDoc(doc(db, "articles", id));
  } catch (e) {
    console.error('NDNews: Failed to delete article from Firebase', e);
  }
}

async function saveArticle(article) {
  const { doc, setDoc } = window.fsTools;
  const db = window.firebaseDB;
  
  // Optimistically update local cache
  const idx = window.appArticles.findIndex(a => a.id === article.id);
  if (idx !== -1) {
    window.appArticles[idx] = { ...window.appArticles[idx], ...article };
  } else {
    window.appArticles.unshift(article);
  }

  try {
    await setDoc(doc(db, "articles", article.id), article);
  } catch (e) {
    console.error('NDNews: Failed to save article to Firebase', e);
  }
}

async function incrementArticleViews(id) {
  const { doc, updateDoc, increment } = window.fsTools;
  const db = window.firebaseDB;
  
  // Optimistically update local cache
  const idx = window.appArticles.findIndex(a => a.id === id);
  if (idx !== -1) {
    window.appArticles[idx].views = (window.appArticles[idx].views || 0) + 1;
  }
  
  try {
    await updateDoc(doc(db, "articles", id), {
      views: increment(1)
    });
  } catch (e) {
    console.error('NDNews: Failed to increment views', e);
  }
}

/**
 * Get breaking news articles.
 * @returns {Array}
 */
function getBreakingNews() {
  return loadArticles().filter(a => a.isBreaking);
}

/**
 * Get the live article (first one flagged isLive).
 * @returns {Object|null}
 */
function getLiveArticle() {
  return loadArticles().find(a => a.isLive) || null;
}

/**
 * Get featured articles.
 * @returns {Array}
 */
function getFeaturedArticles() {
  return loadArticles().filter(a => a.isFeatured);
}

/**
 * Get top 10 most popular articles by views.
 * @returns {Array}
 */
function getMostPopular() {
  return loadArticles()
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}

/**
 * Get recent articles sorted by date descending.
 * @param {number} [limit=20]
 * @returns {Array}
 */
function getRecentArticles(limit = 20) {
  return loadArticles()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

// ============================================================================
// COMMENTS
// ============================================================================

/**
 * Load comments for a given article.
 * @param {string} articleId
 * @returns {Array}
 */
function loadComments(articleId) {
  try {
    const all = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
    return all[articleId] || [];
  } catch (e) {
    return [];
  }
}

/**
 * Save a comment for a given article.
 * @param {string} articleId
 * @param {{author: string, email: string, text: string}} comment
 */
function saveComment(articleId, comment) {
  try {
    const all = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
    if (!all[articleId]) all[articleId] = [];
    all[articleId].unshift({
      ...comment,
      id: 'cmt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      date: new Date().toISOString()
    });
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('NDNews: Failed to save comment.', e);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format an ISO date string to a readable format (e.g. "Jun 17, 2026").
 * @param {string} iso
 * @returns {string}
 */
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return iso;
  }
}

/**
 * Get initials from a name (first letter of first and last name).
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Truncate text to a maximum number of characters, appending '...' if truncated.
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
function truncateText(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

/**
 * Generate a unique article ID.
 * @returns {string}
 */
function generateId() {
  return 'art-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

/**
 * Create an ad placeholder HTML string.
 * @param {string} type - CSS class modifier (e.g. 'leaderboard', 'sidebar', 'banner')
 * @returns {string}
 */
function createAdPlaceholder(type) {
  let adSlot = type === 'leaderboard' ? '1234567890' : '0987654321';
  let adFormat = type === 'leaderboard' ? 'auto' : 'fluid';
  return `
    <div class="ad-container ad-${type}">
      <span style="font-size: 10px; color: #888; display: block; margin-bottom: 5px;">Advertisement</span>
      <ins class="adsbygoogle"
           style="display:block; text-align:center;"
           data-ad-client="ca-pub-0000000000000000"
           data-ad-slot="${adSlot}"
           data-ad-format="${adFormat}"
           data-full-width-responsive="true"></ins>
    </div>
  `;
}

/**
 * Safely get a DOM element by id; returns null with a console warning if missing.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
function getEl(id) {
  return document.getElementById(id);
}

/**
 * Escape HTML to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ============================================================================
// RENDERING — INDEX PAGE
// ============================================================================

/**
 * 1. Render trending bar.
 */
function renderTrendingBar() {
  const container = getEl('trending-container');
  if (!container) return;

  container.innerHTML = TRENDING_TOPICS.map(topic =>
    `<a href="category.html?search=${encodeURIComponent(topic)}" class="trending-link">${escapeHTML(topic)}</a>`
  ).join('');
}

/**
 * 2. Render hero section (3-column layout).
 */
function renderHeroSection() {
  const container = getEl('hero-container');
  if (!container) return;

  const articles = getRecentArticles(20);
  const featured = articles.filter(a => a.isFeatured);
  const mainArticle = featured[0] || articles[0];
  const midArticle = featured[1] || articles[1];
  const sidebarArticles = articles.slice(4, 9);

  if (!mainArticle) return;

  const mainHTML = `
    <div class="col-hero-main">
      <a href="article.html?id=${mainArticle.id}">
        <img src="${mainArticle.image}" alt="${escapeHTML(mainArticle.title)}">
        <div class="hero-overlay">
          <span class="hero-category">${escapeHTML(mainArticle.category.toUpperCase())}</span>
          <h2 class="hero-title">${escapeHTML(mainArticle.title)}</h2>
          <span class="hero-meta">${escapeHTML(mainArticle.author)} &bull; ${formatDate(mainArticle.date)}</span>
        </div>
      </a>
    </div>`;

  const midArticles = [
    featured[1] || articles[1],
    featured[2] || articles[2],
    featured[3] || articles[3]
  ].filter(Boolean);

  const midHTML = midArticles.length > 0 ? `
    <div class="col-hero-mid">
      ${midArticles.map(article => `
      <a href="article.html?id=${article.id}">
        <img src="${article.image}" alt="${escapeHTML(article.title)}">
        <div class="hero-overlay">
          <span class="hero-category">${escapeHTML(article.category.toUpperCase())}</span>
          <h3 class="hero-title">${escapeHTML(article.title)}</h3>
          <span class="hero-meta">${escapeHTML(article.author)} &bull; ${formatDate(article.date)}</span>
        </div>
      </a>`).join('')}
    </div>` : '';

  const sidebarItemsHTML = sidebarArticles.map(a => `
    <div class="sidebar-item">
      <img src="${a.image}" alt="${escapeHTML(a.title)}">
      <div class="item-body">
        <a href="article.html?id=${a.id}" class="item-title">${escapeHTML(truncateText(a.title, 80))}</a>
        <span class="item-meta">${escapeHTML(a.category)} &bull; ${formatDate(a.date)}</span>
      </div>
    </div>`).join('');

  const sidebarHTML = `
    <div class="col-hero-sidebar">
      <h4 class="sidebar-header">MUST READ</h4>
      ${sidebarItemsHTML}
    </div>`;

  container.innerHTML = mainHTML + midHTML + sidebarHTML;
}

/**
 * 3. Render breaking news banner.
 */
function renderBreakingNews() {
  const container = getEl('breaking-container');
  if (!container) return;

  const breakingArticles = getBreakingNews();
  if (!breakingArticles.length) {
    container.style.display = 'none';
    return;
  }

  container.style.display = '';
  container.innerHTML = breakingArticles.map(a => `
    <div class="section-wrapper">
      <span class="breaking-label">BREAKING</span>
      <a href="article.html?id=${a.id}" class="breaking-headline">${escapeHTML(a.title)}</a>
    </div>`).join('');
}

/**
 * 4. Render live updates feed.
 */
function renderLiveUpdates() {
  const container = getEl('live-updates-container');
  if (!container) return;

  container.innerHTML = LIVE_UPDATES.map(u => `
    <div class="live-update-item">
      <span class="update-time">${escapeHTML(u.time)}</span>
      <span class="update-text">${escapeHTML(u.text)}</span>
    </div>`).join('');
}

/**
 * 5. Render latest news cards.
 */
function renderLatestNews() {
  const container = getEl('latest-news-container');
  if (!container) return;

  const recent = getRecentArticles(20);
  // Skip the first 2 (used in hero)
  const articles = recent.slice(2, 12);

  container.innerHTML = articles.map(a => `
    <article class="news-card">
      <a href="article.html?id=${a.id}">
        <img src="${a.image}" alt="${escapeHTML(a.title)}">
      </a>
      <div class="card-body">
        <span class="card-category">${escapeHTML(a.category.toUpperCase())}</span>
        <a href="article.html?id=${a.id}"><h3 class="card-title">${escapeHTML(a.title)}</h3></a>
        <p class="card-excerpt">${escapeHTML(truncateText(a.excerpt, 150))}</p>
        <div class="card-meta">
          <span>${escapeHTML(a.author)}</span>
          <span>${formatDate(a.date)}</span>
        </div>
      </div>
    </article>`).join('');
}

/**
 * 6. Render opinion section.
 */
function renderOpinionSection() {
  const container = getEl('opinion-container');
  if (!container) return;

  const opinions = getArticlesByCategory('Opinion');
  if (!opinions.length) {
    container.innerHTML = '<p>No opinion pieces available.</p>';
    return;
  }

  container.innerHTML = opinions.map(a => `
    <div class="opinion-item">
      <div class="opinion-avatar">${getInitials(a.author)}</div>
      <div class="opinion-body">
        <a href="article.html?id=${a.id}"><h4 class="opinion-title">${escapeHTML(a.title)}</h4></a>
        <span class="opinion-author">${escapeHTML(a.author)}</span>
      </div>
    </div>`).join('');
}

/**
 * 7. Render story carousel.
 */
function renderStoryCarousel() {
  const container = getEl('story-carousel-container');
  if (!container) return;

  const articles = getRecentArticles(12);

  container.innerHTML = articles.map((a, i) => `
    <div class="story-card">
      <a href="article.html?id=${a.id}">
        <img src="${a.image}" alt="${escapeHTML(a.title)}">
        <div class="story-overlay">
          <span class="story-title">${escapeHTML(truncateText(a.title, 50))}</span>
        </div>
      </a>
    </div>`).join('');
}

/**
 * 8. Render sport section.
 */
function renderSportSection() {
  const container = getEl('sport-section-container');
  if (!container) return;

  const sports = getArticlesByCategory('Sport');
  if (!sports.length) {
    container.innerHTML = '<p>No sport articles available.</p>';
    return;
  }

  const hero = sports[0];
  const rest = sports.slice(1);

  const heroHTML = `
    <div class="sport-hero">
      <a href="article.html?id=${hero.id}">
        <img src="${hero.image}" alt="${escapeHTML(hero.title)}">
        <div class="sport-overlay">
          <span class="sport-category">SPORT</span>
          <h3 class="sport-title">${escapeHTML(hero.title)}</h3>
        </div>
      </a>
    </div>`;

  const restHTML = rest.map(a => `
    <article class="sport-article">
      <img src="${a.image}" alt="${escapeHTML(a.title)}">
      <div>
        <a href="article.html?id=${a.id}"><h4>${escapeHTML(a.title)}</h4></a>
        <span class="card-meta">${escapeHTML(a.author)} &bull; ${formatDate(a.date)}</span>
      </div>
    </article>`).join('');

  container.innerHTML = heroHTML + restHTML;
}

/**
 * 9. Render most popular sidebar.
 */
function renderMostPopular() {
  const container = getEl('most-popular-container');
  if (!container) return;

  const popular = getMostPopular();
  container.innerHTML = popular.map((a, i) => `
    <div class="popular-item">
      <span class="popular-number">${i + 1}</span>
      <a href="article.html?id=${a.id}" class="popular-title">${escapeHTML(truncateText(a.title, 80))}</a>
    </div>`).join('');
}

/**
 * 10. Render explainer section.
 */
function renderExplainerSection() {
  const container = getEl('explainer-container');
  if (!container) return;

  const explainers = getArticlesByCategory('Explainer');
  if (!explainers.length) {
    container.innerHTML = '<p>No explainers available.</p>';
    return;
  }

  container.innerHTML = explainers.map(a => `
    <div class="explainer-card">
      <div>
        <span class="explainer-label">EXPLAINER</span>
        <h3 class="explainer-title">${escapeHTML(a.title)}</h3>
        <p class="explainer-subtitle">${escapeHTML(truncateText(a.excerpt, 120))}</p>
      </div>
      <img src="${a.image}" alt="${escapeHTML(a.title)}">
    </div>`).join('');
}

/**
 * 11. Render featured section.
 */
function renderFeaturedSection() {
  const container = getEl('featured-container');
  if (!container) return;

  const featured = getFeaturedArticles();
  if (!featured.length) return;

  container.innerHTML = featured.map(a => `
    <div class="featured-card">
      <a href="article.html?id=${a.id}">
        <img src="${a.image}" alt="${escapeHTML(a.title)}">
        <div class="card-body">
          <span class="card-category">${escapeHTML(a.category.toUpperCase())}</span>
          <h3 class="card-title">${escapeHTML(a.title)}</h3>
          <span class="card-meta">${escapeHTML(a.author)} &bull; ${formatDate(a.date)}</span>
        </div>
      </a>
    </div>`).join('');
}

/**
 * 12. Wire up newsletter form.
 */
function renderNewsletter() {
  const form = getEl('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      alert('Thank you for subscribing!');
      emailInput.value = '';
    }
  });
}

// ============================================================================
// RENDERING — ARTICLE PAGE
// ============================================================================

/**
 * 13. Render article detail page.
 */
function renderArticleDetail() {
  const container = getEl('article-detail-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');
  if (!articleId) {
    container.innerHTML = '<p class="error-message">Article not found. Please return to the <a href="index.html">homepage</a>.</p>';
    return;
  }

  const article = getArticleById(articleId);
  if (!article) {
    container.innerHTML = '<p class="error-message">Article not found. Please return to the <a href="index.html">homepage</a>.</p>';
    return;
  }

  // Update page title
  document.title = `${article.title} — NDNews`;

  // Update meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', article.excerpt);
  }

  // Update breadcrumb category
  const breadcrumbCat = getEl('article-category');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = article.category;
    breadcrumbCat.href = `category.html?cat=${encodeURIComponent(article.category)}`;
  }

  // Build article body paragraphs with ad injected in middle
  const paragraphs = article.content.split('\n\n');
  const midPoint = Math.floor(paragraphs.length / 2);
  let bodyHTML = '';
  paragraphs.forEach((p, i) => {
    bodyHTML += `<p>${escapeHTML(p)}</p>\n`;
    if (i === midPoint - 1) {
      bodyHTML += createAdPlaceholder('leaderboard') + '\n';
    }
  });

  // Tags
  const tagsHTML = (article.tags || []).map(tag =>
    `<a href="category.html?search=${encodeURIComponent(tag)}" class="article-tag">#${escapeHTML(tag)}</a>`
  ).join('');

  // Share buttons
  const shareURL = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(article.title);

  container.innerHTML = `
    <span class="article-category">${escapeHTML(article.category.toUpperCase())}</span>
    <h1 class="article-title">${escapeHTML(article.title)}</h1>
    <div class="article-meta">
      <div class="article-author-avatar">${getInitials(article.author)}</div>
      <div>
        <span class="article-author-name">${escapeHTML(article.author)}</span>
        <span class="article-date">${formatDate(article.date)}</span>
        <span class="article-read-time">${escapeHTML(article.readTime)}</span>
      </div>
    </div>
    <img class="article-hero-img" src="${article.image}" alt="${escapeHTML(article.title)}">
    <div class="article-body">
      ${bodyHTML}
    </div>
    <div class="article-tags">
      ${tagsHTML}
    </div>
    <div class="share-buttons">
      <button class="share-btn" onclick="window.open('https://twitter.com/intent/tweet?url=${shareURL}&text=${shareTitle}','_blank','width=600,height=400')">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        Share
      </button>
      <button class="share-btn" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${shareURL}','_blank','width=600,height=400')">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Share
      </button>
      <button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!'))">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M13.723 18.654l-3.61 3.609c-2.316 2.315-6.063 2.315-8.378 0-2.315-2.316-2.315-6.062 0-8.377l3.609-3.61 1.772 1.772-3.61 3.609c-1.34 1.34-1.34 3.494 0 4.834 1.34 1.34 3.494 1.34 4.834 0l3.61-3.609 1.773 1.772zM10.277 5.346l3.61-3.609c2.316-2.315 6.062-2.315 8.377 0 2.316 2.316 2.316 6.062 0 8.377l-3.609 3.61-1.772-1.772 3.609-3.61c1.34-1.34 1.34-3.494 0-4.834-1.34-1.34-3.494-1.34-4.834 0l-3.61 3.609-1.771-1.771zM14.83 7.758l1.414 1.414-7.071 7.071-1.414-1.414 7.071-7.071z"/></svg>
        Copy Link
      </button>
    </div>`;

  // Inject SEO metadata
  injectMetaTags(
    article.title, 
    article.excerpt, 
    window.location.href, 
    article.image, 
    'article', 
    (article.tags || []).join(', ')
  );

  // Increment view counter
  incrementArticleViews(articleId);

  // Inject structured data
  injectStructuredData(article);
}

/**
 * 14. Render comments section.
 */
function renderComments() {
  const container = getEl('comments-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');
  if (!articleId) return;

  const comments = loadComments(articleId);

  const commentsListHTML = comments.length
    ? comments.map(c => `
        <div class="comment-card">
          <div class="comment-avatar">${getInitials(c.author)}</div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">${escapeHTML(c.author)}</span>
              <span class="comment-date">${formatDate(c.date)}</span>
            </div>
            <p class="comment-text">${escapeHTML(c.text)}</p>
          </div>
        </div>`).join('')
    : '<p class="no-comments">Be the first to comment on this article.</p>';

  container.innerHTML = `
    <form class="comment-form" onsubmit="submitComment(event)">
      <textarea placeholder="Share your thoughts..." required></textarea>
      <div class="comment-form-row">
        <input type="text" placeholder="Your name" required>
        <input type="email" placeholder="Your email" required>
        <button type="submit" class="comment-submit-btn">Post Comment</button>
      </div>
    </form>
    <div class="comments-list">
      ${commentsListHTML}
    </div>`;
}

/**
 * Handle comment form submission (global function for inline handler).
 * @param {Event} e
 */
function submitComment(e) {
  e.preventDefault();
  const form = e.target;
  const textarea = form.querySelector('textarea');
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');

  if (!textarea.value.trim() || !nameInput.value.trim() || !emailInput.value.trim()) return;

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');
  if (!articleId) return;

  saveComment(articleId, {
    author: nameInput.value.trim(),
    email: emailInput.value.trim(),
    text: textarea.value.trim()
  });

  // Re-render comments
  renderComments();
}

/**
 * 15. Render related articles.
 */
function renderRelatedArticles() {
  const container = getEl('related-articles-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');
  if (!articleId) return;

  const article = getArticleById(articleId);
  if (!article) return;

  const related = getArticlesByCategory(article.category)
    .filter(a => a.id !== articleId)
    .slice(0, 5);

  if (!related.length) {
    container.innerHTML = '<p>No related articles found.</p>';
    return;
  }

  container.innerHTML = related.map(a => `
    <div class="related-item">
      <img src="${a.image}" alt="${escapeHTML(a.title)}">
      <div>
        <a href="article.html?id=${a.id}" class="related-title">${escapeHTML(a.title)}</a>
        <span class="card-meta">${formatDate(a.date)}</span>
      </div>
    </div>`).join('');
}

/**
 * 16. Inject JSON-LD structured data for SEO.
 * @param {Object} article
 */
function injectStructuredData(article) {
  const el = getEl('structured-data');
  if (!el) {
    // Create a script element if not present
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    document.head.appendChild(script);
    script.textContent = buildStructuredJSON(article);
  } else {
    el.textContent = buildStructuredJSON(article);
  }
}

function buildStructuredJSON(article) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.excerpt,
    'image': article.image,
    'datePublished': article.date,
    'dateModified': article.date,
    'author': {
      '@type': 'Person',
      'name': article.author
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'NDNews',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://ndnews.com/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': window.location.href
    },
    'keywords': (article.tags || []).join(', ')
  });
}

/**
 * Inject HTML meta tags dynamically for SEO.
 */
function injectMetaTags(title, desc, url, image, type = 'website', keywords = '') {
  document.title = title + ' - NDNews';
  
  const setMeta = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (tag && content) tag.setAttribute('content', content);
  };
  const setMetaProp = (prop, content) => {
    let tag = document.querySelector(`meta[property="${prop}"]`);
    if (tag && content) tag.setAttribute('content', content);
  };

  setMeta('description', desc);
  if (keywords) setMeta('keywords', keywords);
  
  setMetaProp('og:title', title);
  setMetaProp('og:description', desc);
  setMetaProp('og:url', url);
  if (image) setMetaProp('og:image', image);
  setMetaProp('og:type', type);
  
  setMeta('twitter:title', title);
  setMeta('twitter:description', desc);
  if (image) setMeta('twitter:image', image);
}

// ============================================================================
// RENDERING — CATEGORY PAGE
// ============================================================================

/**
 * 17. Render category / search results page.
 */
function renderCategoryPage() {
  const titleEl = getEl('category-title');
  const descEl = getEl('category-desc');
  const container = getEl('category-container');
  const popularContainer = getEl('most-popular-container');

  const params = new URLSearchParams(window.location.search);
  const category = params.get('cat');
  const searchQuery = params.get('search');

  let articles = [];
  let pageTitle = 'All Articles';
  let pageDesc = 'Browse the latest news and analysis from across the Asia-Pacific region.';

  if (category) {
    articles = getArticlesByCategory(category);
    pageTitle = category;
    const descriptions = {
      'apac': 'Comprehensive coverage of geopolitics, diplomacy, and regional developments across the Asia-Pacific.',
      'economy': 'In-depth analysis of economic trends, trade policies, and market forces shaping the region.',
      'finance': 'Breaking financial news, market analysis, and investment insights from Asian markets.',
      'sport': 'The latest scores, results, and stories from the world of APAC sports.',
      'opinion': 'Expert commentary and analysis on the issues that matter most in the Asia-Pacific.',
      'explainer': 'Clear, accessible guides to complex topics in economics, finance, and geopolitics.'
    };
    pageDesc = descriptions[category.toLowerCase()] || pageDesc;
  } else if (searchQuery) {
    articles = searchArticles(searchQuery);
    pageTitle = `Search: "${searchQuery}"`;
    pageDesc = `Found ${articles.length} article${articles.length !== 1 ? 's' : ''} matching "${searchQuery}".`;
  } else {
    articles = getRecentArticles(50);
  }

  // Sort by date desc
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Update title and description
  if (titleEl)  titleEl.textContent = pageTitle;
  if (descEl) descEl.textContent = pageDesc;

  injectMetaTags(
    pageTitle + (category ? ' News' : ''), 
    pageDesc, 
    window.location.href, 
    '', 
    'website', 
    category ? category + ', news, asia, finance' : 'news, asia, finance'
  );
  document.title = `${pageTitle} — NDNews`;

  // Render articles
  if (container) {
    if (!articles.length) {
      container.innerHTML = '<p class="no-results">No articles found. Try a different search or browse our <a href="index.html">homepage</a>.</p>';
    } else {
      container.innerHTML = articles.map(a => `
        <article class="news-card">
          <a href="article.html?id=${a.id}">
            <img src="${a.image}" alt="${escapeHTML(a.title)}">
          </a>
          <div class="card-body">
            <span class="card-category">${escapeHTML(a.category.toUpperCase())}</span>
            <a href="article.html?id=${a.id}"><h3 class="card-title">${escapeHTML(a.title)}</h3></a>
            <p class="card-excerpt">${escapeHTML(truncateText(a.excerpt, 180))}</p>
            <div class="card-meta">
              <span>${escapeHTML(a.author)}</span>
              <span>${formatDate(a.date)}</span>
              <span>${escapeHTML(a.readTime)}</span>
            </div>
          </div>
        </article>`).join('');
    }
  }

  // Render most popular sidebar
  if (popularContainer) {
    renderMostPopular();
  }
}

// ============================================================================
// PAGE ROUTER — FIREBASE READY
// ============================================================================

window.addEventListener('firebase-ready', async function () {
  // Wait for Firebase to sync articles into global state
  await fetchArticlesFromFirebase();

  // INDEX PAGE
  if (document.getElementById('hero-container')) {
    renderTrendingBar();
    renderHeroSection();
    renderBreakingNews();
    renderLiveUpdates();
    renderLatestNews();
    renderOpinionSection();
    renderStoryCarousel();
    renderSportSection();
    renderMostPopular();
    renderExplainerSection();
    renderFeaturedSection();
    renderNewsletter();
  }

  // ARTICLE PAGE
  if (document.getElementById('article-detail-container')) {
    renderArticleDetail();
    renderComments();
    renderRelatedArticles();
  }

  // CATEGORY PAGE
  if (document.getElementById('category-container')) {
    renderCategoryPage();
  }

  // DASHBOARD PAGE (Creator Studio)
  if (document.getElementById('dashboard-articles')) {
    if (typeof renderArticlesTable === 'function') {
      renderArticlesTable();
    }
  }
});
