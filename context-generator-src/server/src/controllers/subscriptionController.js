/**
 * Controller for subscription management
 */
const User = require('../models/User');
const { NotFoundError, BadRequestError } = require('../middleware/errorHandler');

// Define subscription plans
const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    tokenAllowance: 50000,
    documentLimit: 5,
    features: ['Basic document generation', 'Standard templates', 'Export to Markdown']
  },
  basic: {
    name: 'Basic',
    price: 9.99,
    tokenAllowance: 200000,
    documentLimit: 20,
    features: ['All Free features', 'Export to HTML and Text', 'Email support']
  },
  professional: {
    name: 'Professional',
    price: 19.99,
    tokenAllowance: 500000,
    documentLimit: 50,
    features: ['All Basic features', 'Priority support', 'Custom templates']
  },
  enterprise: {
    name: 'Enterprise',
    price: 49.99,
    tokenAllowance: 1000000,
    documentLimit: 100,
    features: ['All Professional features', 'Dedicated support', 'Advanced customization']
  }
};

/**
 * Get all available subscription plans
 */
exports.getSubscriptionPlans = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      plans: SUBSCRIPTION_PLANS
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's current subscription details
 */
exports.getCurrentSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Calculate days until subscription renewal/expiration
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    // Get current plan details
    const planDetails = SUBSCRIPTION_PLANS[user.subscription.plan] || SUBSCRIPTION_PLANS.free;

    res.status(200).json({
      success: true,
      subscription: {
        plan: user.subscription.plan,
        planName: planDetails.name,
        active: user.subscription.active,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate,
        daysRemaining: daysRemaining,
        price: planDetails.price,
        features: planDetails.features
      },
      usage: {
        tokenCount: user.usage.tokenCount,
        tokenAllowance: user.usage.monthlyAllowance,
        tokenPercentUsed: Math.round((user.usage.tokenCount / user.usage.monthlyAllowance) * 100),
        documentsGenerated: user.usage.documents.generated,
        documentLimit: user.usage.documents.limit,
        documentPercentUsed: Math.round((user.usage.documents.generated / user.usage.documents.limit) * 100),
        resetDate: user.usage.resetDate
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user's subscription (simplified without payment)
 */
exports.updateSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    
    if (!plan || !SUBSCRIPTION_PLANS[plan]) {
      throw new BadRequestError('Invalid subscription plan');
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // In a real app, we'd process payment here
    // For this demo, we'll just update the subscription
    
    // Set new plan details
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(now.getMonth() + 1);
    
    user.subscription = {
      plan: plan,
      startDate: now,
      endDate: endDate,
      active: true
    };
    
    // Update usage limits based on the plan
    user.usage.monthlyAllowance = SUBSCRIPTION_PLANS[plan].tokenAllowance;
    user.usage.documents.limit = SUBSCRIPTION_PLANS[plan].documentLimit;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${SUBSCRIPTION_PLANS[plan].name} plan`,
      subscription: user.subscription
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel user's subscription
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Set subscription to inactive (will expire at end date)
    user.subscription.active = false;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Subscription successfully canceled',
      note: 'Your subscription will remain active until the end date'
    });
  } catch (error) {
    next(error);
  }
};