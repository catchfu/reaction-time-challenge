import React from 'react';
import { usePremium } from '../context/PremiumContext';
import { SUBSCRIPTION_PLANS } from '../data/premium';

const SubscriptionManagement = ({ onClose }) => {
  const {
    isPremium,
    subscriptionType,
    expiresAt,
    isTrialActive,
    getDaysRemaining,
    cancelSubscription
  } = usePremium();

  const daysRemaining = getDaysRemaining();

  if (!isPremium) {
    return (
      <div className="subscription-modal">
        <div className="subscription-modal-content">
          <div className="subscription-header">
            <h2>⚠️ No Active Subscription</h2>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
          <p>You don't have an active premium subscription.</p>
          <button onClick={onClose} className="button-primary">Close</button>
        </div>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS[subscriptionType];

  return (
    <div className="subscription-modal">
      <div className="subscription-modal-content">
        <div className="subscription-header">
          <h2>✨ Premium Subscription</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="subscription-status">
          <div className="status-badge active">
            <span className="status-icon">✓</span>
            Active Subscription
          </div>
          {isTrialActive && (
            <div className="trial-badge">
              🎁 Free Trial - {daysRemaining} days remaining
            </div>
          )}
        </div>

        <div className="current-plan">
          <h3>Current Plan</h3>
          <div className="plan-details">
            <div className="plan-name">{currentPlan.name}</div>
            <div className="plan-price">
              ${currentPlan.price}
              <span className="period">
                {subscriptionType === 'lifetime' ? '' : `/${currentPlan.interval}`}
              </span>
            </div>
            {expiresAt && (
              <div className="expires-at">
                {subscriptionType === 'lifetime'
                  ? 'Never expires'
                  : `Renews on ${new Date(expiresAt).toLocaleDateString()}`}
              </div>
            )}
          </div>
        </div>

        <div className="usage-stats">
          <h3>Usage Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">
                {localStorage.getItem('rtc_game_sessions_v1')
                  ? JSON.parse(localStorage.getItem('rtc_game_sessions_v1')).length
                  : 0}
              </div>
              <div className="stat-label">Games Played</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {localStorage.getItem('rtc_premium_status')
                  ? Math.ceil((new Date() - new Date(JSON.parse(localStorage.getItem('rtc_premium_status')).activatedAt)) / (1000 * 60 * 60 * 24))
                  : 0}
              </div>
              <div className="stat-label">Days as Premium</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {localStorage.getItem('rtc_achievements_v1')
                  ? JSON.parse(localStorage.getItem('rtc_achievements_v1')).length
                  : 0}
              </div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
        </div>

        <div className="premium-features-active">
          <h3>Your Premium Features</h3>
          <div className="features-list">
            <div className="feature-item active">
              <span className="check-icon">✓</span>
              All game variants unlocked
            </div>
            <div className="feature-item active">
              <span className="check-icon">✓</span>
              Unlimited game history
            </div>
            <div className="feature-item active">
              <span className="check-icon">✓</span>
              Advanced analytics
            </div>
            <div className="feature-item active">
              <span className="check-icon">✓</span>
              Ad-free experience
            </div>
            <div className="feature-item active">
              <span className="check-icon">✓</span>
              Custom themes
            </div>
            <div className="feature-item active">
              <span className="check-icon">✓</span>
              Priority support
            </div>
          </div>
        </div>

        {!isTrialActive && (
          <div className="billing-section">
            <h3>Billing</h3>
            <div className="billing-info">
              <div className="next-billing">
                <div className="label">Next Billing Date:</div>
                <div className="value">
                  {subscriptionType === 'lifetime'
                    ? 'N/A (Lifetime)'
                    : new Date(expiresAt).toLocaleDateString()}
                </div>
              </div>
              <div className="billing-amount">
                <div className="label">Amount:</div>
                <div className="value">${currentPlan.price} {subscriptionType === 'lifetime' ? '' : `per ${currentPlan.interval}`}</div>
              </div>
            </div>

            <button className="cancel-button" onClick={() => {
              if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
                cancelSubscription();
                alert('Subscription cancelled. You will retain access until ' + new Date(expiresAt).toLocaleDateString());
                onClose();
              }
            }}>
              Cancel Subscription
            </button>
          </div>
        )}

        <div className="support-section">
          <h3>Need Help?</h3>
          <p>Contact our support team for any questions about your subscription.</p>
          <button className="support-button">
            📧 Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
