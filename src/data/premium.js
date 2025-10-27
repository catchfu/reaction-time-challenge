/**
 * Premium subscription plans and features
 */

export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Premium Monthly',
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    description: 'Full access to all premium features',
    features: [
      'All game variants',
      'Advanced analytics',
      'Unlimited history',
      'Data export',
      'Custom themes',
      'Priority support'
    ],
    popular: false
  },
  yearly: {
    id: 'yearly',
    name: 'Premium Yearly',
    price: 29.99,
    currency: 'USD',
    interval: 'year',
    originalPrice: 59.88,
    savings: 50,
    description: 'Best value - Save 50%',
    features: [
      'All game variants',
      'Advanced analytics',
      'Unlimited history',
      'Data export',
      'Custom themes',
      'Priority support',
      'Exclusive tournaments'
    ],
    popular: true
  },
  lifetime: {
    id: 'lifetime',
    name: 'Premium Lifetime',
    price: 99.99,
    currency: 'USD',
    interval: 'lifetime',
    description: 'One-time payment, lifetime access',
    features: [
      'All game variants forever',
      'Advanced analytics forever',
      'Unlimited history',
      'Data export',
      'All themes',
      'Priority support',
      'Exclusive tournaments',
      'Future features included'
    ],
    popular: false
  }
};

export const PREMIUM_FEATURES = {
  // Game Features
  gameVariants: {
    name: 'Exclusive Game Variants',
    description: 'Access to Double, Sequence, Speed Ramp, Distraction modes',
    icon: '🎮',
    gated: true
  },

  // Analytics
  unlimitedHistory: {
    name: 'Unlimited History',
    description: 'Keep all your game sessions, not just the last 100',
    icon: '📊',
    gated: true
  },

  advancedAnalytics: {
    name: 'Advanced Analytics',
    description: 'Detailed performance breakdowns and insights',
    icon: '📈',
    gated: true
  },

  // Customization
  customThemes: {
    name: 'Custom Themes',
    description: 'Personalize your game with premium themes',
    icon: '🎨',
    gated: true
  },

  // Export
  advancedExport: {
    name: 'Advanced Export',
    description: 'Export to PDF, generate shareable reports',
    icon: '📤',
    gated: true
  },

  // Tournaments
  tournaments: {
    name: 'Exclusive Tournaments',
    description: 'Join premium-only competitions with prizes',
    icon: '🏆',
    gated: true
  },

  // Support
  prioritySupport: {
    name: 'Priority Support',
    description: 'Get help from our team first',
    icon: '⭐',
    gated: true
  },

  // Non-gated features
  basicAnalytics: {
    name: 'Basic Analytics',
    description: 'View your recent performance',
    icon: '📊',
    gated: false
  },

  achievements: {
    name: 'Achievement System',
    description: 'Unlock badges and track progress',
    icon: '🏅',
    gated: false
  }
};

export const FREE_FEATURES = [
  'Basic game modes (Beginner, Standard, Advanced, Expert)',
  'Session statistics (average, best, worst)',
  'Personal best tracking',
  'Basic achievements',
  'Limited history (last 100 sessions)',
  'Standard export (JSON, basic CSV)'
];

export const PREMIUM_FEATURES_LIST = [
  'All game variants (Double, Sequence, Speed Ramp, Distraction)',
  'Unlimited game history',
  'Advanced analytics dashboard',
  'Custom color themes',
  'Advanced export options (PDF, detailed reports)',
  'Exclusive tournaments and competitions',
  'Priority customer support',
  'Future features included'
];

export const PRICING_LABELS = {
  monthly: {
    period: '/month',
    badge: null
  },
  yearly: {
    period: '/year',
    badge: 'Save 50%'
  },
  lifetime: {
    period: '',
    badge: 'Best Value'
  }
};

export const FREE_TRIAL_DAYS = 7;

export const ADS_CONFIG = {
  enabled: !localStorage.getItem('rtc_premium_status'), // Disabled for premium users
  frequency: 3, // Show ad after every 3 games
  positions: {
    landing: {
      enabled: true,
      position: 'bottom-banner'
    },
    game: {
      enabled: false // Never show ads during gameplay
    },
    results: {
      enabled: true,
      position: 'after-results'
    }
  },
  formats: {
    banner: {
      width: 320,
      height: 50
    },
    interstitial: {
      width: 800,
      height: 600
    }
  }
};
