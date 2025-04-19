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
  // Fixed: Removed the unused state variable '_'
  const [, setSelectedPlan] = useState(null);
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
          // Ensure the error object is passed correctly
          error: err instanceof Error ? err : new Error(String(err))
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Handle plan change
  const handleUpgrade = async (planId) => { // Renamed parameter for clarity
    try {
      setUpgrading(true);
      setError(null);
      
      // Update subscription
      await authService.updateSubscription(planId);
      
      // Reload subscription data
      const subscriptionResponse = await authService.getCurrentSubscription();
      setSubscriptionData(subscriptionResponse);
      
      setSelectedPlan(null); // Reset selected plan (if this state was used for UI selection)
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      setError({
        message: 'Failed to upgrade subscription',
        error: err instanceof Error ? err : new Error(String(err)),
        canRetry: true // Allow retry for upgrade attempts
      });
    } finally {
      setUpgrading(false);
    }
  };

  // Handle subscription cancellation
  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        setUpgrading(true); // Reuse upgrading state for loading indicator
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
          error: err instanceof Error ? err : new Error(String(err))
        });
      } finally {
        setUpgrading(false);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        // Add check for invalid date
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Invalid Date';
    }
  };

  // --- Render Logic ---

  if (loading) {
    return <LoadingSpinner message="Loading subscription data..." />;
  }

  // Improved error display with retry option
  if (error && !subscriptionData) { // Show error prominently if main data load failed
    return (
        <div className="page-container">
            <h1>Subscription Dashboard</h1>
            <ErrorMessage 
                title="Error Loading Data"
                message={error.message} 
                error={error.error} // Pass the actual error object if available
                canRetry={error.canRetry}
                onRetry={() => window.location.reload()} // Simple retry by reload
            />
        </div>
    );
  }

  if (!subscriptionData || !plans) {
    return (
      <div className="page-container">
        <h1>Subscription Dashboard</h1>
        <p>No subscription data available or plans could not be loaded.</p>
      </div>
    );
  }

  // Safely access nested properties
  const subscription = subscriptionData?.subscription || {};
  const usage = subscriptionData?.usage || {};
  const currentPlanId = subscription.plan || 'free'; // Default to 'free' if plan ID is missing
  const currentPlanDetails = plans[currentPlanId] || { name: 'Unknown', features: [], price: 0, tokenAllowance: 0, documentLimit: 0 }; // Fallback plan details

  // Calculate percentages safely
  const tokenPercentUsed = usage.tokenAllowance > 0 ? Math.round((usage.tokenCount / usage.tokenAllowance) * 100) : 0;
  const documentPercentUsed = usage.documentLimit > 0 ? Math.round((usage.documentsGenerated / usage.documentLimit) * 100) : 0;


  return (
    <div className="page-container usage-dashboard-page"> {/* Added specific class */}
      <h1>Subscription Dashboard</h1>

      {/* Display general errors that occur during actions like upgrade/cancel */} 
      {error && (
        <ErrorMessage 
          title="Subscription Update Error"
          message={error.message} 
          error={error.error}
          canRetry={error.canRetry}
          onRetry={() => handleUpgrade(currentPlanId)} // Example: Retry last upgrade attempt
        />
      )}
      
      {upgrading && <LoadingSpinner message="Processing subscription update..." />}
      
      <div className="dashboard-grid"> {/* Changed container class for layout */}

        {/* Current Plan Section */}
        <div className="dashboard-card current-plan-card"> {/* Use card styling */}
          <h2>Current Plan: {currentPlanDetails.name}</h2>
          <div className="subscription-details">
            <p><strong>Status:</strong> {subscription.active ? 'Active' : 'Inactive'}</p>
            <p><strong>{subscription.active ? 'Renews on:' : 'Ended on:'}</strong> {formatDate(subscription.endDate)}</p>
            {subscription.active && <p><strong>Days Remaining:</strong> {subscription.daysRemaining ?? 'N/A'}</p>}
            <p><strong>Monthly Price:</strong> ${currentPlanDetails.price}</p>
          </div>
          
          <h3>Plan Features</h3>
          <ul className="feature-list">
            {currentPlanDetails.features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          {subscription.active && currentPlanId !== 'free' && ( // Allow cancel only for paid active plans
            <button 
              className="button button-danger button-small" // More specific button classes
              onClick={handleCancel}
              disabled={upgrading}
            >
              Cancel Subscription
            </button>
          )}
        </div>
        
        {/* Usage Statistics Section */}
        <div className="dashboard-card usage-card"> {/* Use card styling */}
          <h2>Usage Statistics</h2>
          <div className="usage-stats">
            <div className="usage-stat">
              <h4>AI Tokens</h4>
              <div className="usage-bar">
                <div 
                  className="usage-progress" 
                  style={{ width: `${tokenPercentUsed}%` }}
                  title={`${tokenPercentUsed}% Used`}
                ></div>
              </div>
              <p>{(usage.tokenCount || 0).toLocaleString()} / {(usage.tokenAllowance || 0).toLocaleString()} used</p>
            </div>
            
            <div className="usage-stat">
              <h4>Documents Generated</h4>
              <div className="usage-bar">
                <div 
                  className="usage-progress"
                  style={{ width: `${documentPercentUsed}%` }}
                  title={`${documentPercentUsed}% Used`}
                ></div>
              </div>
              <p>{usage.documentsGenerated || 0} / {usage.documentLimit === Infinity ? 'Unlimited' : (usage.documentLimit || 0)} used</p>
            </div>
            
            <p><strong>Next Reset Date:</strong> {formatDate(usage.resetDate)}</p>
          </div>
        </div>
        
        {/* Available Plans Section */}
        <div className="dashboard-card plans-card"> {/* Use card styling */}
          <h2>Available Plans</h2>
          <div className="plans-grid">
            {Object.entries(plans).map(([planId, plan]) => (
              <div 
                key={planId}
                className={`plan-card ${planId === currentPlanId ? 'current-plan' : ''}`}
              >
                <h3>{plan.name}</h3>
                <p className="plan-price">${plan.price}<span>/month</span></p>
                <ul className="plan-features">
                  {/* Show key limits prominently */}
                  <li><strong>{(plan.tokenAllowance || 0).toLocaleString()}</strong> Tokens</li>
                  <li><strong>{plan.documentLimit === Infinity ? 'Unlimited' : (plan.documentLimit || 0)}</strong> Documents</li>
                  {/* Display first few features */}
                  {plan.features?.slice(0, 3).map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                
                {planId !== currentPlanId ? (
                  <button 
                    className="button button-primary button-small" // Use consistent button style
                    onClick={() => handleUpgrade(planId)}
                    disabled={upgrading}
                  >
                    {plan.price > currentPlanDetails.price ? 'Upgrade' : 'Switch Plan'}
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
