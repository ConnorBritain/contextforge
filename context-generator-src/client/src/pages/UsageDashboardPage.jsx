import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Dashboard displaying user's subscription and usage information
 */
const UsageDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [plans, setPlans] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [_, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  // Load subscription data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load subscription plans
        const plansResponse = await authService.getSubscriptionPlans();
        setPlans(plansResponse.plans);

        if (authService.isAuthenticated()) {
          // Load user's subscription details
          const subscriptionResponse = await authService.getCurrentSubscription();
          setSubscriptionData(subscriptionResponse);
        } else {
          // Redirect to login if not authenticated
          navigate('/login', { state: { from: '/usage' } });
        }
      } catch (err) {
        console.error('Error loading subscription data:', err);
        setError({
          message: 'Failed to load subscription data',
          error: err
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Handle plan change
  const handleUpgrade = async (plan) => {
    try {
      setUpgrading(true);
      setError(null);
      
      // Update subscription
      await authService.updateSubscription(plan);
      
      // Reload subscription data
      const subscriptionResponse = await authService.getCurrentSubscription();
      setSubscriptionData(subscriptionResponse);
      
      setSelectedPlan(null);
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      setError({
        message: 'Failed to upgrade subscription',
        error: err,
        canRetry: true
      });
    } finally {
      setUpgrading(false);
    }
  };

  // Handle subscription cancellation
  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        setUpgrading(true);
        setError(null);
        
        // Cancel subscription
        await authService.cancelSubscription();
        
        // Reload subscription data
        const subscriptionResponse = await authService.getCurrentSubscription();
        setSubscriptionData(subscriptionResponse);
      } catch (err) {
        console.error('Error cancelling subscription:', err);
        setError({
          message: 'Failed to cancel subscription',
          error: err
        });
      } finally {
        setUpgrading(false);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading subscription data..." />;
  }

  if (!subscriptionData || !plans) {
    return (
      <div className="page-container">
        <h1>Subscription Dashboard</h1>
        {error && (
          <ErrorMessage 
            message={error.message} 
            error={error.error} 
            canRetry={error.canRetry}
            onRetry={() => window.location.reload()}
          />
        )}
        <p>No subscription data available.</p>
      </div>
    );
  }

  const { subscription, usage } = subscriptionData;
  const currentPlanDetails = plans[subscription.plan];

  return (
    <div className="page-container">
      <h1>Subscription Dashboard</h1>
      
      {error && (
        <ErrorMessage 
          message={error.message} 
          error={error.error}
          canRetry={error.canRetry}
          onRetry={() => window.location.reload()}
        />
      )}
      
      {upgrading && <LoadingSpinner message="Processing subscription update..." />}
      
      <div className="dashboard-container">
        <div className="dashboard-section">
          <h2>Current Plan: {subscription.planName}</h2>
          <div className="subscription-details">
            <p><strong>Status:</strong> {subscription.active ? 'Active' : 'Inactive'}</p>
            <p><strong>Renewal Date:</strong> {formatDate(subscription.endDate)}</p>
            <p><strong>Days Remaining:</strong> {subscription.daysRemaining}</p>
            <p><strong>Monthly Price:</strong> ${subscription.price}</p>
          </div>
          
          <h3>Plan Features</h3>
          <ul className="feature-list">
            {currentPlanDetails.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          {subscription.active && (
            <button 
              className="cancel-button"
              onClick={handleCancel}
              disabled={upgrading}
            >
              Cancel Subscription
            </button>
          )}
        </div>
        
        <div className="dashboard-section">
          <h2>Usage Statistics</h2>
          <div className="usage-stats">
            <div className="usage-stat">
              <h3>AI Tokens</h3>
              <div className="usage-bar">
                <div 
                  className="usage-progress" 
                  style={{ width: `${usage.tokenPercentUsed}%` }}
                ></div>
              </div>
              <p>{usage.tokenCount.toLocaleString()} / {usage.tokenAllowance.toLocaleString()} tokens used ({usage.tokenPercentUsed}%)</p>
            </div>
            
            <div className="usage-stat">
              <h3>Documents Generated</h3>
              <div className="usage-bar">
                <div 
                  className="usage-progress"
                  style={{ width: `${usage.documentPercentUsed}%` }}
                ></div>
              </div>
              <p>{usage.documentsGenerated} / {usage.documentLimit} documents ({usage.documentPercentUsed}%)</p>
            </div>
            
            <p><strong>Next Reset Date:</strong> {formatDate(usage.resetDate)}</p>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Available Plans</h2>
          <div className="plans-grid">
            {Object.entries(plans).map(([planId, plan]) => (
              <div 
                key={planId}
                className={`plan-card ${planId === subscription.plan ? 'current-plan' : ''}`}
              >
                <h3>{plan.name}</h3>
                <p className="plan-price">${plan.price}<span>/month</span></p>
                <ul className="plan-features">
                  <li><strong>{plan.tokenAllowance.toLocaleString()}</strong> Tokens</li>
                  <li><strong>{plan.documentLimit}</strong> Documents</li>
                  {plan.features.slice(0, 3).map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                
                {planId !== subscription.plan ? (
                  <button 
                    className="plan-button"
                    onClick={() => handleUpgrade(planId)}
                    disabled={upgrading}
                  >
                    {plan.price > subscription.price ? 'Upgrade' : 'Downgrade'}
                  </button>
                ) : (
                  <div className="current-plan-marker">Current Plan</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageDashboardPage;