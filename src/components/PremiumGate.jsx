import React from 'react';
import { PREMIUM_FEATURES } from '../data/premium';

const PremiumGate = ({ feature, onUpgrade, onClose }) => {
  const featureData = PREMIUM_FEATURES[feature] || {
    name: 'Premium Feature',
    description: 'This feature requires a premium subscription',
    icon: '✨',
    gated: true
  };

  if (!featureData.gated) {
    return null;
  }

  return (
    <div className="premium-gate-overlay">
      <div className="premium-gate-content">
        <button className="close-button" onClick={onClose}>✕</button>

        <div className="premium-gate-icon">{featureData.icon}</div>
        <h2 className="premium-gate-title">Premium Feature</h2>
        <p className="premium-gate-description">
          {featureData.description}
        </p>

        <div className="premium-benefits">
          <h3>✨ Premium Includes:</h3>
          <ul className="benefits-list">
            <li>✓ All game variants</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Unlimited history</li>
            <li>✓ Custom themes</li>
            <li>✓ Priority support</li>
          </ul>
        </div>

        <div className="premium-cta">
          <button className="upgrade-button" onClick={onUpgrade}>
            ✨ Upgrade to Premium
          </button>
          <div className="trial-info">
            🎁 Start with a 7-day free trial
          </div>
        </div>

        <div className="premium-pricing">
          <div className="pricing-option">
            <div className="price">$4.99<span>/month</span></div>
            <div className="period">Monthly</div>
          </div>
          <div className="pricing-option popular">
            <div className="price">$2.50<span>/month</span></div>
            <div className="period">Yearly (Save 50%)</div>
            <div className="savings-badge">Best Value</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;
