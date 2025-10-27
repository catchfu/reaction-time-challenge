import React, { createContext, useContext, useState, useEffect } from 'react';

const PremiumContext = createContext();

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider');
  }
  return context;
};

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(null); // monthly, yearly, lifetime
  const [expiresAt, setExpiresAt] = useState(null);
  const [isTrialActive, setIsTrialActive] = useState(false);

  useEffect(() => {
    // Load premium status from localStorage
    const premiumStatus = localStorage.getItem('rtc_premium_status');
    if (premiumStatus) {
      const status = JSON.parse(premiumStatus);
      setIsPremium(status.isPremium || false);
      setSubscriptionType(status.subscriptionType || null);
      setExpiresAt(status.expiresAt ? new Date(status.expiresAt) : null);
      setIsTrialActive(status.isTrialActive || false);
    }
  }, []);

  const activatePremium = (type = 'monthly', trialDays = 7) => {
    const now = new Date();
    const expires = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);

    setIsPremium(true);
    setSubscriptionType(type);
    setExpiresAt(expires);
    setIsTrialActive(true);

    localStorage.setItem('rtc_premium_status', JSON.stringify({
      isPremium: true,
      subscriptionType: type,
      expiresAt: expires.toISOString(),
      isTrialActive: true,
      activatedAt: now.toISOString()
    }));
  };

  const purchaseSubscription = (type) => {
    const now = new Date();
    let expires;

    if (type === 'monthly') {
      expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (type === 'yearly') {
      expires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else if (type === 'lifetime') {
      expires = null;
    }

    setIsPremium(true);
    setSubscriptionType(type);
    setExpiresAt(expires);
    setIsTrialActive(false);

    localStorage.setItem('rtc_premium_status', JSON.stringify({
      isPremium: true,
      subscriptionType: type,
      expiresAt: expires ? expires.toISOString() : null,
      isTrialActive: false,
      activatedAt: now.toISOString()
    }));
  };

  const cancelSubscription = () => {
    setIsPremium(false);
    setSubscriptionType(null);
    setExpiresAt(null);
    setIsTrialActive(false);

    localStorage.removeItem('rtc_premium_status');
  };

  const checkPremiumStatus = () => {
    if (!isPremium) return false;

    if (isTrialActive && expiresAt) {
      if (new Date() > expiresAt) {
        // Trial expired
        cancelSubscription();
        return false;
      }
    }

    if (subscriptionType !== 'lifetime' && expiresAt) {
      if (new Date() > expiresAt) {
        // Subscription expired
        cancelSubscription();
        return false;
      }
    }

    return true;
  };

  const getDaysRemaining = () => {
    if (!expiresAt) return null;
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const value = {
    isPremium,
    subscriptionType,
    expiresAt,
    isTrialActive,
    activatePremium,
    purchaseSubscription,
    cancelSubscription,
    checkPremiumStatus,
    getDaysRemaining
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
};
