import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS, FREE_TRIAL_DAYS, PREMIUM_FEATURES_LIST } from '../data/premium';
import { usePremium } from '../context/PremiumContext';

const SubscriptionModal = ({ onClose, onStartTrial }) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const { activatePremium, purchaseSubscription } = usePremium();

  const handleStartTrial = () => {
    activatePremium('monthly', FREE_TRIAL_DAYS);
    onStartTrial?.();
    onClose();
  };

  const handlePurchase = (planId) => {
    purchaseSubscription(planId);
    // In a real app, this would integrate with Stripe/PayPal
    alert(`Purchase initiated for ${SUBSCRIPTION_PLANS[planId].name}\n\nIn a real app, this would redirect to payment processor.`);
    onClose();
  };

  return (
    <div className="subscription-modal">
      <div className="subscription-modal-content">
        <div className="subscription-header">
          <h2>✨ Upgrade to Premium</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {/* Trial Banner */}
        <div className="trial-banner">
          <div className="trial-icon">🎁</div>
          <div className="trial-text">
            <strong>Start Your {FREE_TRIAL_DAYS}-Day Free Trial</strong>
            <div>No credit card required • Cancel anytime</div>
          </div>
          <button className="trial-button" onClick={handleStartTrial}>
            Start Free Trial
          </button>
        </div>

        {/* Plans */}
        <div className="plans-grid">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}

              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">
                    {plan.id === 'lifetime' ? '' : `/${plan.interval}`}
                  </span>
                </div>
                {plan.originalPrice && (
                  <div className="plan-savings">
                    Save ${plan.savings} ({plan.savings}% off)
                  </div>
                )}
                {plan.description && (
                  <div className="plan-description">{plan.description}</div>
                )}
              </div>

              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="plan-feature">
                    <span className="check-icon">✓</span>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                className="plan-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchase(plan.id);
                }}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* What's Included */}
        <div className="included-section">
          <h3>✨ What's Included in Premium</h3>
          <div className="features-list">
            {PREMIUM_FEATURES_LIST.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">⭐</span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>

          <div className="faq-item">
            <div className="faq-question">Can I cancel anytime?</div>
            <div className="faq-answer">Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</div>
          </div>

          <div className="faq-item">
            <div className="faq-question">Do you offer refunds?</div>
            <div className="faq-answer">We offer a 30-day money-back guarantee for all paid plans. No questions asked.</div>
          </div>

          <div className="faq-item">
            <div className="faq-question">What happens after the free trial?</div>
            <div className="faq-answer">Your trial will automatically convert to a monthly subscription. You can cancel anytime before the trial ends to avoid charges.</div>
          </div>

          <div className="faq-item">
            <div className="faq-question">Is my data secure?</div>
            <div className="faq-answer">Absolutely. All your game data is stored securely. We never share your personal information with third parties.</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <div className="trust-text">
              <strong>Secure Payment</strong>
              <div>256-bit SSL encryption</div>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">💯</span>
            <div className="trust-text">
              <strong>Money-Back Guarantee</strong>
              <div>30-day refund policy</div>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon">📱</span>
            <div className="trust-text">
              <strong>Cancel Anytime</strong>
              <div>No cancellation fees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
