import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { BrowsePage } from './components/BrowsePage';
import { CategoryDetailPage } from './components/CategoryDetailPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { WhiteLabelPage } from './components/WhiteLabelPage';
import { CompanyDetail } from './components/CompanyDetail';
import { AuthModal } from './components/AuthModal';
import { BottomNavigation } from './components/BottomNavigation';

export type Company = {
  id: string;
  name: string;
  category: string;
  score: number;
  status: 'support' | 'boycott' | 'neutral';
  logo?: string;
  description?: string;
  website?: string;
  politicalInfo: {
    donations: Array<{ recipient: string; amount: string; year: string }>;
    lobbying: Array<{ issue: string; amount: string; year: string }>;
    statements: string[];
    score: number;
  };
};

export type UserSpending = {
  companyId: string;
  categoryId: string;
  amount: number;
  date: string;
  companyName: string;
};

export type Notification = {
  id: string;
  companyId: string;
  companyName: string;
  categoryId: string;
  oldScore: number;
  newScore: number;
  date: string;
  reason: string;
  trend: 'up' | 'down';
  newsUrl?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  companies: Company[];
  userScore?: number;
  userStores?: string[]; // User-added store IDs for this category
};

export type WhiteLabelSettings = {
  mantra: string;
  template: 'modern' | 'classic' | 'minimal';
  title: string;
  color: string;
  logo?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  overallScore: number;
  isGuest: boolean;
  categoryScores: { [categoryId: string]: number };
  userSpending: UserSpending[];
  categoryVisibility: { [categoryId: string]: boolean };
  categoryOrder: string[];
  notifications: Notification[];
  whiteLabelSettings: WhiteLabelSettings;
  preferences: {
    labels: string[];
    values: string[];
    logos: string[];
    mantras: string[];
  };
};

// Mock categories with companies
const mockCategories: Category[] = [
  {
    id: 'grocery',
    name: 'Grocery Shopping',
    icon: '🛒',
    companies: [
      {
        id: 'whole-foods',
        name: 'Whole Foods Market',
        category: 'grocery',
        score: 72,
        status: 'support',
        description: 'Organic and natural foods supermarket chain',
        politicalInfo: {
          donations: [
            { recipient: 'Environmental Defense Fund', amount: '$500,000', year: '2024' },
            { recipient: 'Worker Rights Coalition', amount: '$250,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Organic farming standards', amount: '$150,000', year: '2024' }
          ],
          statements: ['Committed to carbon neutrality by 2030', 'Supports fair labor practices'],
          score: 72
        }
      },
      {
        id: 'walmart',
        name: 'Walmart',
        category: 'grocery',
        score: 35,
        status: 'boycott',
        description: 'Multinational retail corporation',
        politicalInfo: {
          donations: [
            { recipient: 'Anti-union PACs', amount: '$2,500,000', year: '2024' },
            { recipient: 'Conservative political groups', amount: '$1,800,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Against minimum wage increase', amount: '$3,200,000', year: '2024' },
            { issue: 'Environmental regulation rollbacks', amount: '$1,500,000', year: '2024' }
          ],
          statements: ['Opposes union organizing efforts', 'Lobbied against paid sick leave'],
          score: 35
        }
      },
      {
        id: 'trader-joes',
        name: "Trader Joe's",
        category: 'grocery',
        score: 68,
        status: 'support',
        description: 'Specialty grocery store chain',
        politicalInfo: {
          donations: [
            { recipient: 'Local food banks', amount: '$400,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Supports sustainable sourcing', 'Committed to employee welfare'],
          score: 68
        }
      },
      {
        id: 'kroger',
        name: 'Kroger',
        category: 'grocery',
        score: 45,
        status: 'neutral',
        description: 'American retail company',
        politicalInfo: {
          donations: [
            { recipient: 'Mixed political contributions', amount: '$1,200,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Food safety regulations', amount: '$800,000', year: '2024' }
          ],
          statements: ['Mixed record on labor relations'],
          score: 45
        }
      }
    ]
  },
  {
    id: 'streaming',
    name: 'Streaming Services',
    icon: '📺',
    companies: [
      {
        id: 'netflix',
        name: 'Netflix',
        category: 'streaming',
        score: 58,
        status: 'neutral',
        description: 'Streaming entertainment service',
        politicalInfo: {
          donations: [
            { recipient: 'Democratic campaigns', amount: '$800,000', year: '2024' },
            { recipient: 'LGBTQ+ advocacy groups', amount: '$500,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Net neutrality', amount: '$600,000', year: '2024' }
          ],
          statements: ['Supports diversity and inclusion', 'Advocates for net neutrality'],
          score: 58
        }
      },
      {
        id: 'disney-plus',
        name: 'Disney+',
        category: 'streaming',
        score: 42,
        status: 'neutral',
        description: 'Disney streaming platform',
        politicalInfo: {
          donations: [
            { recipient: 'Both political parties', amount: '$2,100,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Copyright extension', amount: '$1,800,000', year: '2024' }
          ],
          statements: ['Mixed political stance', 'Focus on family content'],
          score: 42
        }
      },
      {
        id: 'hulu',
        name: 'Hulu',
        category: 'streaming',
        score: 55,
        status: 'neutral',
        description: 'Streaming service with live TV',
        politicalInfo: {
          donations: [
            { recipient: 'Media advocacy groups', amount: '$300,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Supports content creator rights'],
          score: 55
        }
      }
    ]
  },
  {
    id: 'banking',
    name: 'Banking',
    icon: '🏦',
    companies: [
      {
        id: 'chase',
        name: 'JPMorgan Chase',
        category: 'banking',
        score: 28,
        status: 'boycott',
        description: 'Major American banking institution',
        politicalInfo: {
          donations: [
            { recipient: 'Republican PACs', amount: '$5,200,000', year: '2024' },
            { recipient: 'Democratic PACs', amount: '$3,800,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Financial deregulation', amount: '$8,500,000', year: '2024' },
            { issue: 'Against consumer protections', amount: '$3,200,000', year: '2024' }
          ],
          statements: ['Lobbied against climate disclosure requirements', 'Opposes financial transaction tax'],
          score: 28
        }
      },
      {
        id: 'aspiration',
        name: 'Aspiration',
        category: 'banking',
        score: 85,
        status: 'support',
        description: 'Sustainable and ethical banking',
        politicalInfo: {
          donations: [
            { recipient: 'Environmental groups', amount: '$1,000,000', year: '2024' },
            { recipient: 'Social justice organizations', amount: '$750,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Climate action advocacy', amount: '$400,000', year: '2024' }
          ],
          statements: ['Divests from fossil fuels', 'Plants trees with every purchase', 'B-Corp certified'],
          score: 85
        }
      },
      {
        id: 'bank-of-america',
        name: 'Bank of America',
        category: 'banking',
        score: 32,
        status: 'boycott',
        description: 'Major American banking corporation',
        politicalInfo: {
          donations: [
            { recipient: 'Political PACs (mixed)', amount: '$6,500,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Financial regulation reform', amount: '$7,200,000', year: '2024' }
          ],
          statements: ['Significant fossil fuel financing', 'Mixed labor relations record'],
          score: 32
        }
      }
    ]
  },
  {
    id: 'apparel',
    name: 'Clothes Shopping',
    icon: '👕',
    companies: [
      {
        id: 'patagonia',
        name: 'Patagonia',
        category: 'apparel',
        score: 92,
        status: 'support',
        description: 'Outdoor clothing and gear company',
        politicalInfo: {
          donations: [
            { recipient: 'Environmental nonprofits', amount: '$10,000,000', year: '2024' },
            { recipient: 'Grassroots activism', amount: '$5,000,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Public lands protection', amount: '$800,000', year: '2024' }
          ],
          statements: ['1% for the Planet member', 'Fair Trade Certified', 'B-Corp certified', 'Donates 100% of profits to climate action'],
          score: 92
        }
      },
      {
        id: 'nike',
        name: 'Nike',
        category: 'apparel',
        score: 48,
        status: 'neutral',
        description: 'Athletic footwear and apparel',
        politicalInfo: {
          donations: [
            { recipient: 'Social justice initiatives', amount: '$1,200,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Trade agreements', amount: '$2,100,000', year: '2024' }
          ],
          statements: ['Improved labor practices', 'History of sweatshop controversies'],
          score: 48
        }
      },
      {
        id: 'gap',
        name: 'Gap Inc.',
        category: 'apparel',
        score: 52,
        status: 'neutral',
        description: 'American clothing and accessories retailer',
        politicalInfo: {
          donations: [
            { recipient: 'Various political groups', amount: '$800,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Committed to sustainable sourcing', 'Working on supply chain transparency'],
          score: 52
        }
      }
    ]
  },
  {
    id: 'online-retail',
    name: 'Online Retailers',
    icon: '📦',
    companies: [
      {
        id: 'amazon',
        name: 'Amazon',
        category: 'online-retail',
        score: 22,
        status: 'boycott',
        description: 'E-commerce and cloud computing giant',
        politicalInfo: {
          donations: [
            { recipient: 'Political PACs (both parties)', amount: '$4,200,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Anti-union campaigns', amount: '$14,200,000', year: '2024' },
            { issue: 'Against corporate tax increases', amount: '$8,500,000', year: '2024' },
            { issue: 'Labor law reform opposition', amount: '$6,300,000', year: '2024' }
          ],
          statements: ['Aggressive anti-union stance', 'Controversial workplace conditions', 'Minimal effective tax rate'],
          score: 22
        }
      },
      {
        id: 'etsy',
        name: 'Etsy',
        category: 'online-retail',
        score: 76,
        status: 'support',
        description: 'E-commerce focused on handmade and vintage items',
        politicalInfo: {
          donations: [
            { recipient: 'Small business advocacy', amount: '$500,000', year: '2024' },
            { recipient: 'Progressive causes', amount: '$300,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Small business protection', amount: '$200,000', year: '2024' }
          ],
          statements: ['B-Corp certified', 'Supports independent creators', 'Carbon neutral shipping'],
          score: 76
        }
      },
      {
        id: 'ebay',
        name: 'eBay',
        category: 'online-retail',
        score: 54,
        status: 'neutral',
        description: 'Online marketplace and auction site',
        politicalInfo: {
          donations: [
            { recipient: 'Mixed political contributions', amount: '$1,500,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Internet commerce regulations', amount: '$900,000', year: '2024' }
          ],
          statements: ['Supports small sellers', 'Mixed environmental record'],
          score: 54
        }
      }
    ]
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: '🍔',
    companies: [
      {
        id: 'chipotle',
        name: 'Chipotle',
        category: 'restaurants',
        score: 64,
        status: 'support',
        description: 'Mexican-inspired fast casual restaurant',
        politicalInfo: {
          donations: [
            { recipient: 'Sustainable agriculture groups', amount: '$600,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Food with integrity mission', 'Supports local farmers', 'No antibiotics in meat'],
          score: 64
        }
      },
      {
        id: 'chick-fil-a',
        name: 'Chick-fil-A',
        category: 'restaurants',
        score: 18,
        status: 'boycott',
        description: 'Fast food chicken restaurant chain',
        politicalInfo: {
          donations: [
            { recipient: 'Conservative Christian groups', amount: '$1,800,000', year: '2024' },
            { recipient: 'Anti-LGBTQ+ organizations', amount: '$900,000', year: '2023' }
          ],
          lobbying: [
            { issue: 'Religious liberty laws', amount: '$500,000', year: '2024' }
          ],
          statements: ['History of donations to anti-LGBTQ+ groups', 'Conservative political stance'],
          score: 18
        }
      },
      {
        id: 'panera',
        name: 'Panera Bread',
        category: 'restaurants',
        score: 61,
        status: 'support',
        description: 'Bakery-café chain',
        politicalInfo: {
          donations: [
            { recipient: 'Food security initiatives', amount: '$400,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Clean food commitment', 'No artificial additives', 'Food donation program'],
          score: 61
        }
      }
    ]
  },
  {
    id: 'coffee',
    name: 'Coffee Shops',
    icon: '☕',
    companies: [
      {
        id: 'starbucks',
        name: 'Starbucks',
        category: 'coffee',
        score: 44,
        status: 'neutral',
        description: 'Global coffeehouse chain',
        politicalInfo: {
          donations: [
            { recipient: 'Mixed political contributions', amount: '$1,200,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Anti-union activities', amount: '$2,500,000', year: '2024' }
          ],
          statements: ['Aggressive anti-union stance', 'Diversity initiatives', 'Mixed labor practices'],
          score: 44
        }
      },
      {
        id: 'blue-bottle',
        name: 'Blue Bottle Coffee',
        category: 'coffee',
        score: 71,
        status: 'support',
        description: 'Specialty coffee roaster',
        politicalInfo: {
          donations: [
            { recipient: 'Sustainable farming initiatives', amount: '$300,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Direct trade with farmers', 'Organic certification', 'B-Corp certified'],
          score: 71
        }
      },
      {
        id: 'dunkin',
        name: 'Dunkin',
        category: 'coffee',
        score: 38,
        status: 'neutral',
        description: 'Coffee and donut chain',
        politicalInfo: {
          donations: [
            { recipient: 'Various PACs', amount: '$800,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Franchise model with variable labor practices'],
          score: 38
        }
      }
    ]
  },
  {
    id: 'hardware',
    name: 'Hardware Stores',
    icon: '🔨',
    companies: [
      {
        id: 'home-depot',
        name: 'Home Depot',
        category: 'hardware',
        score: 36,
        status: 'neutral',
        description: 'Home improvement retailer',
        politicalInfo: {
          donations: [
            { recipient: 'Republican PACs', amount: '$3,200,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Labor regulations', amount: '$1,800,000', year: '2024' }
          ],
          statements: ['History of conservative donations', 'Mixed environmental record'],
          score: 36
        }
      },
      {
        id: 'lowes',
        name: "Lowe's",
        category: 'hardware',
        score: 42,
        status: 'neutral',
        description: 'Home improvement chain',
        politicalInfo: {
          donations: [
            { recipient: 'Bipartisan contributions', amount: '$2,100,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Building codes and regulations', amount: '$1,200,000', year: '2024' }
          ],
          statements: ['Veteran hiring initiatives', 'Energy efficiency programs'],
          score: 42
        }
      },
      {
        id: 'ace-hardware',
        name: 'Ace Hardware',
        category: 'hardware',
        score: 68,
        status: 'support',
        description: 'Cooperative of locally owned hardware stores',
        politicalInfo: {
          donations: [
            { recipient: 'Small business advocacy', amount: '$400,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Locally owned cooperative model', 'Community focused', 'Supports independent retailers'],
          score: 68
        }
      }
    ]
  },
  {
    id: 'gas',
    name: 'Gas Stations',
    icon: '⛽',
    companies: [
      {
        id: 'exxon',
        name: 'ExxonMobil',
        category: 'gas',
        score: 15,
        status: 'boycott',
        description: 'Major oil and gas corporation',
        politicalInfo: {
          donations: [
            { recipient: 'Climate denial organizations', amount: '$5,000,000', year: '2024' },
            { recipient: 'Republican PACs', amount: '$8,200,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Against climate legislation', amount: '$12,500,000', year: '2024' },
            { issue: 'Fossil fuel subsidies', amount: '$9,300,000', year: '2024' }
          ],
          statements: ['History of climate denial', 'Significant carbon emissions', 'Lobbies against renewable energy'],
          score: 15
        }
      },
      {
        id: 'shell',
        name: 'Shell',
        category: 'gas',
        score: 25,
        status: 'boycott',
        description: 'Global energy company',
        politicalInfo: {
          donations: [
            { recipient: 'Various political groups', amount: '$6,500,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Energy policy', amount: '$10,200,000', year: '2024' }
          ],
          statements: ['Renewable energy investments (minimal)', 'Continued fossil fuel expansion'],
          score: 25
        }
      },
      {
        id: 'costco-gas',
        name: 'Costco Gas',
        category: 'gas',
        score: 58,
        status: 'neutral',
        description: 'Costco warehouse gas stations',
        politicalInfo: {
          donations: [
            { recipient: 'Employee advocacy groups', amount: '$800,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Fair wages for employees', 'Member-focused pricing'],
          score: 58
        }
      }
    ]
  },
  {
    id: 'telecom',
    name: 'Phone/Internet',
    icon: '📱',
    companies: [
      {
        id: 'verizon',
        name: 'Verizon',
        category: 'telecom',
        score: 34,
        status: 'neutral',
        description: 'Telecommunications company',
        politicalInfo: {
          donations: [
            { recipient: 'Political PACs (mixed)', amount: '$5,200,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Against net neutrality', amount: '$6,800,000', year: '2024' },
            { issue: 'Telecommunications regulation', amount: '$4,200,000', year: '2024' }
          ],
          statements: ['Opposes net neutrality', 'Data privacy concerns'],
          score: 34
        }
      },
      {
        id: 'att',
        name: 'AT&T',
        category: 'telecom',
        score: 29,
        status: 'boycott',
        description: 'Telecommunications corporation',
        politicalInfo: {
          donations: [
            { recipient: 'Republican PACs', amount: '$4,800,000', year: '2024' },
            { recipient: 'Democratic PACs', amount: '$2,100,000', year: '2024' }
          ],
          lobbying: [
            { issue: 'Media consolidation', amount: '$8,200,000', year: '2024' },
            { issue: 'Against consumer protections', amount: '$3,500,000', year: '2024' }
          ],
          statements: ['Significant conservative donations', 'Lobbies against consumer privacy'],
          score: 29
        }
      },
      {
        id: 't-mobile',
        name: 'T-Mobile',
        category: 'telecom',
        score: 52,
        status: 'neutral',
        description: 'Wireless network provider',
        politicalInfo: {
          donations: [
            { recipient: 'Bipartisan contributions', amount: '$2,800,000', year: '2024' }
          ],
          lobbying: [
            { issue: '5G infrastructure', amount: '$2,100,000', year: '2024' }
          ],
          statements: ['Consumer-friendly pricing', 'Mixed record on privacy'],
          score: 52
        }
      }
    ]
  },
  {
    id: 'auto',
    name: 'Auto Services',
    icon: '🚗',
    companies: [
      {
        id: 'jiffy-lube',
        name: 'Jiffy Lube',
        category: 'auto',
        score: 41,
        status: 'neutral',
        description: 'Oil change and automotive service',
        politicalInfo: {
          donations: [
            { recipient: 'Various PACs', amount: '$600,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Franchise model', 'Standard automotive practices'],
          score: 41
        }
      },
      {
        id: 'pep-boys',
        name: 'Pep Boys',
        category: 'auto',
        score: 46,
        status: 'neutral',
        description: 'Automotive aftermarket service',
        politicalInfo: {
          donations: [
            { recipient: 'Mixed contributions', amount: '$400,000', year: '2024' }
          ],
          lobbying: [],
          statements: ['Community involvement programs'],
          score: 46
        }
      },
      {
        id: 'local-mechanic',
        name: 'Local Independent Mechanics',
        category: 'auto',
        score: 75,
        status: 'support',
        description: 'Small business auto repair shops',
        politicalInfo: {
          donations: [],
          lobbying: [],
          statements: ['Supports local economy', 'Small business ownership', 'Community focused'],
          score: 75
        }
      }
    ]
  }
];

// Mock notifications based on AI analysis of world events
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    companyId: 'starbucks',
    companyName: 'Starbucks',
    categoryId: 'coffee',
    oldScore: 48,
    newScore: 44,
    date: '2025-10-15',
    reason: 'Increased anti-union spending following labor disputes in multiple states',
    trend: 'down',
    newsUrl: 'https://www.reuters.com/business/retail-consumer/starbucks-union-labor-2025'
  },
  {
    id: 'notif-2',
    companyId: 'patagonia',
    companyName: 'Patagonia',
    categoryId: 'apparel',
    oldScore: 90,
    newScore: 92,
    date: '2025-10-14',
    reason: 'Announced additional $5M donation to climate action organizations',
    trend: 'up',
    newsUrl: 'https://www.patagonia.com/actionworks/campaigns/climate-commitment'
  },
  {
    id: 'notif-3',
    companyId: 'amazon',
    companyName: 'Amazon',
    categoryId: 'online-retail',
    oldScore: 25,
    newScore: 22,
    date: '2025-10-13',
    reason: 'Renewed opposition to unionization efforts in warehouse facilities',
    trend: 'down',
    newsUrl: 'https://www.theguardian.com/technology/amazon-union-warehouse'
  }
];

const mockUser: User = {
  id: '1',
  name: 'JohnDoe',
  email: 'john@example.com',
  overallScore: 67,
  isGuest: false,
  categoryScores: {
    'grocery': 72,
    'streaming': 58,
    'banking': 85,
    'apparel': 92,
    'online-retail': 76,
    'restaurants': 64,
    'coffee': 71,
    'hardware': 68,
    'gas': 58,
    'telecom': 52,
    'auto': 75
  },
  userSpending: [
    { companyId: 'whole-foods', categoryId: 'grocery', amount: 2450, date: '2025-09-30', companyName: 'Whole Foods Market' },
    { companyId: 'trader-joes', categoryId: 'grocery', amount: 1800, date: '2025-09-28', companyName: "Trader Joe's" },
    { companyId: 'kroger', categoryId: 'grocery', amount: 950, date: '2025-09-15', companyName: 'Kroger' },
    { companyId: 'aspiration', categoryId: 'banking', amount: 5000, date: '2025-09-25', companyName: 'Aspiration' },
    { companyId: 'patagonia', categoryId: 'apparel', amount: 380, date: '2025-09-20', companyName: 'Patagonia' },
    { companyId: 'blue-bottle', categoryId: 'coffee', amount: 185, date: '2025-10-10', companyName: 'Blue Bottle Coffee' },
    { companyId: 'starbucks', categoryId: 'coffee', amount: 145, date: '2025-10-08', companyName: 'Starbucks' },
    { companyId: 'dunkin', categoryId: 'coffee', amount: 95, date: '2025-10-05', companyName: 'Dunkin' },
    { companyId: 'ace-hardware', categoryId: 'hardware', amount: 220, date: '2025-09-18', companyName: 'Ace Hardware' },
    { companyId: 'etsy', categoryId: 'online-retail', amount: 450, date: '2025-09-22', companyName: 'Etsy' },
  ],
  categoryVisibility: {
    'grocery': true,
    'streaming': true,
    'banking': true,
    'apparel': true,
    'online-retail': true,
    'restaurants': true,
    'coffee': true,
    'hardware': true,
    'gas': true,
    'telecom': true,
    'auto': true
  },
  categoryOrder: ['grocery', 'coffee', 'banking', 'apparel', 'online-retail', 'restaurants', 'hardware', 'gas', 'telecom', 'auto', 'streaming'],
  notifications: mockNotifications,
  whiteLabelSettings: {
    mantra: 'Shop your politics. Spend your values.',
    template: 'modern',
    title: 'My Political Shopping',
    color: '#14b8a6'
  },
  preferences: {
    labels: ['Eco-Friendly', 'Fair Trade', 'Local'],
    values: ['Environmental', 'Workers Rights', 'Social Justice'],
    logos: ['Certified B-Corp', 'Rainforest Alliance'],
    mantras: ['Shop consciously', 'Vote with your wallet']
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'browse' | 'white-label' | 'profile' | 'settings'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  useEffect(() => {
    // Show auth modal on first load (login is default)
    setShowAuthModal(true);
  }, []);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser({
      ...mockUser,
      ...userData,
      isGuest: false
    });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setSelectedCategory(null);
    setSelectedCompany(null);
    setShowAuthModal(true);
  };

  const updateUserPreferences = (preferences: User['preferences']) => {
    if (user) {
      setUser({ ...user, preferences });
    }
  };

  const updateWhiteLabelSettings = (settings: WhiteLabelSettings) => {
    if (user) {
      setUser({ ...user, whiteLabelSettings: settings });
    }
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    if (user) {
      setUser({
        ...user,
        categoryVisibility: {
          ...user.categoryVisibility,
          [categoryId]: !user.categoryVisibility[categoryId]
        }
      });
    }
  };

  const updateCategoryOrder = (newOrder: string[]) => {
    if (user) {
      setUser({ ...user, categoryOrder: newOrder });
    }
  };

  const addStoreToCategory = (categoryId: string, companyId: string) => {
    // Add company ID to user's stores for this category
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              userStores: [...(cat.userStores || []), companyId]
            }
          : cat
      )
    );
  };

  const removeStoreFromCategory = (categoryId: string, storeId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              companies: cat.companies.filter(c => c.id !== storeId),
              userStores: (cat.userStores || []).filter(id => id !== storeId)
            }
          : cat
      )
    );
  };

  const renderCurrentPage = () => {
    // Require login to access any content
    if (!user) {
      return null;
    }

    // Show category detail if a category is selected
    if (selectedCategory) {
      return (
        <CategoryDetailPage
          category={selectedCategory}
          user={user}
          onBack={() => setSelectedCategory(null)}
          onCompanySelect={setSelectedCompany}
          onLogin={() => setShowAuthModal(true)}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            user={user}
            categories={categories}
            onCompanySelect={setSelectedCompany}
            onCategorySelect={setSelectedCategory}
            onToggleCategoryVisibility={toggleCategoryVisibility}
          />
        );
      case 'browse':
        return (
          <BrowsePage
            categories={categories}
            user={user}
            onCompanySelect={setSelectedCompany}
            onAddStore={addStoreToCategory}
            onRemoveStore={removeStoreFromCategory}
            onUpdateCategoryOrder={updateCategoryOrder}
          />
        );
      case 'white-label':
        return (
          <WhiteLabelPage
            user={user}
            onUpdateSettings={updateWhiteLabelSettings}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            user={user}
            categories={categories}
            onLogin={() => setShowAuthModal(true)}
            onCompanySelect={setSelectedCompany}
            onCategorySelect={setSelectedCategory}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            user={user}
            onUpdatePreferences={updateUserPreferences}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {/* Auth Modal - Must be logged in to access app */}
      {!user ? (
        <AuthModal
          onLogin={handleLogin}
          onClose={() => {}}
        />
      ) : (
        <>
          {/* Main Content */}
          <div className="pb-20">
            {renderCurrentPage()}
          </div>

          {/* Company Detail Modal */}
          {selectedCompany && (
            <CompanyDetail
              company={selectedCompany}
              onClose={() => setSelectedCompany(null)}
              allCompanies={categories.flatMap(c => c.companies)}
              onCompanySelect={setSelectedCompany}
            />
          )}

          {/* Bottom Navigation */}
          <BottomNavigation
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
