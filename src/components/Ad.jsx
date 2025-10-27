import React, { useState, useEffect } from 'react';
import { ADS_CONFIG } from '../data/premium';
import { usePremium } from '../context/PremiumContext';

const Ad = ({ position = 'bottom', onClose, className = '' }) => {
  const { isPremium } = usePremium();
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }

  useEffect(() => {
    if (!ADS_CONFIG.enabled) return;

    // Show ad after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isVisible || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, countdown]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleClick = () => {
    // In a real app, this would track ad clicks for revenue
    console.log('Ad clicked!');
    alert('In a real app, this would navigate to the advertiser\'s website.');
  };

  const handleWatchAd = () => {
    // Simulate watching an ad for rewards
    alert('In a real app, this would play a video ad. After completion, you would receive a reward.');
  };

  if (!isVisible || !ADS_CONFIG.enabled) {
    return null;
  }

  if (position === 'interstitial') {
    return (
      <div className={`ad-overlay ${className}`}>
        <div className="ad-interstitial">
          <button className="ad-close" onClick={handleClose}>
            ✕ ({countdown}s)
          </button>
          <div className="ad-content" onClick={handleClick}>
            <div className="ad-placeholder">
              <div className="ad-label">Advertisement</div>
              <div className="ad-body">
                <h3>🎮 Try Premium!</h3>
                <p>Remove ads and unlock all features</p>
                <button className="ad-cta" onClick={(e) => {
                  e.stopPropagation();
                  handleWatchAd();
                }}>
                  Watch Ad for Reward
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (position === 'rewarded') {
    return (
      <div className={`rewarded-ad ${className}`}>
        <div className="rewarded-ad-content">
          <div className="rewarded-ad-icon">🎁</div>
          <div className="rewarded-ad-text">
            <strong>Watch Ad for Bonus</strong>
            <div>Get +1 game or +50 XP</div>
          </div>
          <button className="rewarded-ad-button" onClick={handleWatchAd}>
            Watch Ad
          </button>
        </div>
      </div>
    );
  }

  // Banner ad
  return (
    <div className={`ad-banner ${className}`}>
      <button className="ad-skip" onClick={handleClose}>
        ✕
      </button>
      <div className="ad-banner-content" onClick={handleClick}>
        <div className="ad-banner-text">
          <strong>Upgrade to Premium</strong>
          <span>Remove ads • Unlock all features</span>
        </div>
        <button className="ad-banner-cta" onClick={(e) => {
          e.stopPropagation();
          handleWatchAd();
        }}>
          Watch Ad
        </button>
      </div>
    </div>
  );
};

export default Ad;
