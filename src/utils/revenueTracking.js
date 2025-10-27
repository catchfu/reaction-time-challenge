import { SUBSCRIPTION_PLANS } from '../data/premium';

/**
 * Track revenue events
 */
export const trackRevenueEvent = (eventType, data = {}) => {
  const event = {
    type: eventType,
    timestamp: new Date().toISOString(),
    data
  };

  // In a real app, this would send to analytics service (Mixpanel, Amplitude, etc.)
  console.log('Revenue Event:', event);

  // Store locally for demo purposes
  const events = JSON.parse(localStorage.getItem('rtc_revenue_events') || '[]');
  events.push(event);

  // Keep only last 1000 events
  if (events.length > 1000) {
    events.splice(0, events.length - 1000);
  }

  localStorage.setItem('rtc_revenue_events', JSON.stringify(events));
};

/**
 * Track subscription attempt
 */
export const trackSubscriptionAttempt = (planId, method = 'modal') => {
  const plan = SUBSCRIPTION_PLANS[planId];
  trackRevenueEvent('subscription_attempted', {
    planId,
    planName: plan.name,
    price: plan.price,
    interval: plan.interval,
    method
  });
};

/**
 * Track successful subscription
 */
export const trackSubscriptionSuccess = (planId, subscriptionId, isTrial = false) => {
  const plan = SUBSCRIPTION_PLANS[planId];
  const revenue = plan.price;

  trackRevenueEvent('subscription_successful', {
    planId,
    planName: plan.name,
    revenue,
    currency: plan.currency,
    interval: plan.interval,
    subscriptionId,
    isTrial
  });

  // Update revenue summary
  updateRevenueSummary('subscription', revenue);
};

/**
 * Track trial activation
 */
export const trackTrialActivation = (planId, days) => {
  trackRevenueEvent('trial_activated', {
    planId,
    planName: SUBSCRIPTION_PLANS[planId].name,
    trialDays: days
  });
};

/**
 * Track ad view
 */
export const trackAdView = (adType, position) => {
  trackRevenueEvent('ad_viewed', {
    adType,
    position,
    timestamp: Date.now()
  });

  updateRevenueSummary('ad', 0); // Track impressions
};

/**
 * Track ad click
 */
export const trackAdClick = (adType, position) => {
  trackRevenueEvent('ad_clicked', {
    adType,
    position
  });
};

/**
 * Track purchase
 */
export const trackPurchase = (productId, price, currency = 'USD') => {
  trackRevenueEvent('purchase_made', {
    productId,
    price,
    currency,
    revenue: price
  });

  updateRevenueSummary('purchase', price);
};

/**
 * Update revenue summary
 */
const updateRevenueSummary = (type, amount) => {
  const summary = JSON.parse(localStorage.getItem('rtc_revenue_summary') || '{}');

  if (!summary.total) {
    summary.total = 0;
    summary.subscriptions = 0;
    summary.ads = 0;
    summary.purchases = 0;
    summary.totalTransactions = 0;
  }

  summary.total += amount;
  summary.totalTransactions += 1;

  switch (type) {
    case 'subscription':
      summary.subscriptions += amount;
      break;
    case 'ad':
      summary.ads += amount; // eCPM based
      break;
    case 'purchase':
      summary.purchases += amount;
      break;
    default:
      break;
  }

  summary.lastUpdated = new Date().toISOString();

  localStorage.setItem('rtc_revenue_summary', JSON.stringify(summary));
};

/**
 * Get revenue summary
 */
export const getRevenueSummary = () => {
  return JSON.parse(localStorage.getItem('rtc_revenue_summary') || '{"total":0,"subscriptions":0,"ads":0,"purchases":0,"totalTransactions":0}');
};

/**
 * Calculate LTV (Lifetime Value)
 */
export const calculateLTV = () => {
  const summary = getRevenueSummary();
  const events = JSON.parse(localStorage.getItem('rtc_revenue_events') || '[]');

  const subscriptions = events.filter(e => e.type === 'subscription_successful');
  const uniqueUsers = new Set(subscriptions.map(e => e.data.subscriptionId));

  if (uniqueUsers.size === 0) return 0;

  return summary.total / uniqueUsers.size;
};

/**
 * Calculate conversion rate
 */
export const calculateConversionRate = () => {
  const events = JSON.parse(localStorage.getItem('rtc_revenue_events') || '[]');

  const attempts = events.filter(e => e.type === 'subscription_attempted').length;
  const successes = events.filter(e => e.type === 'subscription_successful').length;

  if (attempts === 0) return 0;

  return (successes / attempts) * 100;
};

/**
 * Get MRR (Monthly Recurring Revenue)
 */
export const getMRR = () => {
  const events = JSON.parse(localStorage.getItem('rtc_revenue_events') || '[]');
  const subscriptions = events.filter(e => e.type === 'subscription_successful');

  let mrr = 0;

  subscriptions.forEach(sub => {
    const plan = SUBSCRIPTION_PLANS[sub.data.planId];
    if (plan.interval === 'month') {
      mrr += plan.price;
    } else if (plan.interval === 'year') {
      mrr += plan.price / 12;
    }
    // Lifetime plans don't contribute to MRR
  });

  return mrr;
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = (featureName) => {
  const usage = JSON.parse(localStorage.getItem('rtc_feature_usage') || '{}');

  if (!usage[featureName]) {
    usage[featureName] = {
      count: 0,
      lastUsed: null,
      uniqueUsers: 0
    };
  }

  usage[featureName].count += 1;
  usage[featureName].lastUsed = new Date().toISOString();

  localStorage.setItem('rtc_feature_usage', JSON.stringify(usage));

  trackRevenueEvent('feature_used', {
    featureName
  });
};

/**
 * Get most popular features
 */
export const getMostPopularFeatures = () => {
  const usage = JSON.parse(localStorage.getItem('rtc_feature_usage') || '{}');

  return Object.entries(usage)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

/**
 * Track user engagement
 */
export const trackEngagement = (action, sessionDuration = 0) => {
  trackRevenueEvent('user_engagement', {
    action,
    sessionDuration,
    timestamp: Date.now()
  });
};

/**
 * Generate revenue report
 */
export const generateRevenueReport = () => {
  const summary = getRevenueSummary();
  const ltv = calculateLTV();
  const conversionRate = calculateConversionRate();
  const mrr = getMRR();

  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    metrics: {
      ltv,
      conversionRate,
      mrr
    },
    projections: {
      // Simple projection based on current MRR
      nextMonthMRR: mrr * 1.1, // Assuming 10% growth
      nextQuarterMRR: mrr * 1.33,
      nextYearMRR: mrr * 1.5
    }
  };

  return report;
};

/**
 * Export revenue data
 */
export const exportRevenueData = () => {
  const events = JSON.parse(localStorage.getItem('rtc_revenue_events') || '[]');
  const summary = getRevenueSummary();
  const report = generateRevenueReport();

  return {
    events,
    summary,
    report
  };
};
