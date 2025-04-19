const userService = require('../services/userService'); // Use Firestore service
const logger = require("firebase-functions/logger"); // Use Firebase logger
const { FieldValue } = require("firebase-admin/firestore"); // Import FieldValue

// Define subscription plans (keep locally for now)
// TODO: Consider moving to Firestore config or Firebase Remote Config if dynamic management is needed
const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    tokenAllowance: 50000,
    documentLimit: 5,
    features: ['Basic document generation', 'Standard templates', 'Export to Markdown']
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    tokenAllowance: 200000,
    documentLimit: 20,
    features: ['All Free features', 'Export to HTML and Text', 'Email support']
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 19.99,
    tokenAllowance: 500000,
    documentLimit: 50,
    features: ['All Basic features', 'Priority support', 'Custom templates']
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    tokenAllowance: 1000000,
    documentLimit: 100, // Or Infinity? Decide based on plan definition
    features: ['All Professional features', 'Dedicated support', 'Advanced customization']
  }
};

/**
 * Get all available subscription plans
 */
const getPlans = async (req, res) => {
  try {
    // No auth needed typically to view plans, but route requires it currently
    logger.log(`getPlans: Fetching available plans for user ${req.user?.id}`);
    res.status(200).json({
      success: true,
      plans: SUBSCRIPTION_PLANS // Return the predefined plans object
    });
  } catch (error) {
    logger.error(`getPlans: Error fetching plans:`, error);
    res.status(500).send({ error: 'Internal Server Error: Could not fetch plans.' });
  }
};

/**
 * Get user's current subscription details and usage
 */
const getCurrent = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      // This case should ideally be caught by middleware, but double-check
      logger.warn('getCurrent: Unauthorized - req.user.id missing.');
      return res.status(401).send({ error: 'Unauthorized: User ID not found.' });
    }

    logger.log(`getCurrent: Fetching subscription/usage for user ${userId}`);
    // User data should already be attached to req.user by the middleware
    const user = req.user;

    // Calculate days remaining (handle potential Firestore Timestamps)
    let daysRemaining = null;
    const endDateTimestamp = user.subscription?.endDate;
    if (endDateTimestamp && typeof endDateTimestamp.toDate === 'function') { // Check if it's a Firestore Timestamp
        const now = new Date();
        const endDate = endDateTimestamp.toDate();
        // Ensure end date is in the future before calculating difference
        if (endDate > now) {
            daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        } else {
            daysRemaining = 0; // Or handle expired state differently
        }
    }

    // Get current plan details, default to 'free' if not found
    const currentPlanId = user.subscription?.plan || 'free';
    const planDetails = SUBSCRIPTION_PLANS[currentPlanId] || SUBSCRIPTION_PLANS.free;

    // Format usage details, providing defaults if parts are missing
    const usage = user.usage || {};
    const documentsUsage = usage.documents || {};
    const tokenAllowance = usage.monthlyAllowance ?? planDetails.tokenAllowance ?? 0;
    const documentLimit = documentsUsage.limit ?? planDetails.documentLimit ?? 0;
    const tokenCount = usage.tokenCount ?? 0;
    const documentsGenerated = documentsUsage.generated ?? 0;

    const tokenPercentUsed = tokenAllowance > 0 ? Math.round((tokenCount / tokenAllowance) * 100) : 0;
    // Handle potential Infinity limit
    const documentPercentUsed = documentLimit > 0 && documentLimit !== Infinity
        ? Math.round((documentsGenerated / documentLimit) * 100)
        : 0; // Treat Infinity limit as 0% used for percentage display


    res.status(200).json({
      success: true,
      subscription: {
        plan: currentPlanId,
        planName: planDetails.name,
        active: user.subscription?.active ?? false,
        // Convert Timestamps to ISO strings or millis for client
        startDate: user.subscription?.startDate?.toDate?.().toISOString() || null,
        endDate: user.subscription?.endDate?.toDate?.().toISOString() || null,
        daysRemaining: daysRemaining,
        price: planDetails.price,
        features: planDetails.features
      },
      usage: {
        tokenCount: tokenCount,
        tokenAllowance: tokenAllowance,
        tokenPercentUsed: tokenPercentUsed,
        documentsGenerated: documentsGenerated,
        documentLimit: documentLimit,
        documentPercentUsed: documentPercentUsed,
        // Convert Timestamp to ISO string or millis
        resetDate: usage.resetDate?.toDate?.().toISOString() || null
      }
    });
  } catch (error) {
    logger.error(`getCurrent: Error fetching subscription for user ${req.user?.id}:`, error);
    res.status(500).send({ error: 'Internal Server Error: Could not retrieve subscription details.' });
  }
};

/**
 * Update user's subscription (simplified without payment)
 */
const updateSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('updateSubscription: Unauthorized - req.user.id missing.');
      return res.status(401).send({ error: 'Unauthorized: User ID not found.' });
    }

    const { plan: newPlanId } = req.body;

    if (!newPlanId || !SUBSCRIPTION_PLANS[newPlanId]) {
      logger.warn(`updateSubscription: Bad Request for user ${userId} - Invalid plan ID: ${newPlanId}`);
      return res.status(400).send({ error: 'Bad Request: Invalid subscription plan specified.' });
    }

    const newPlanDetails = SUBSCRIPTION_PLANS[newPlanId];

    // In a real app, integrate with Stripe/payment gateway here BEFORE updating Firestore

    logger.log(`updateSubscription: User ${userId} attempting to switch to plan ${newPlanId}`);

    // Prepare update payload for Firestore
    const now = new Date();
    const endDate = new Date(now);
    // Set end date based on billing cycle (e.g., 1 month from now)
    endDate.setMonth(now.getMonth() + 1);
    // TODO: Handle pro-rating, existing end dates, etc. in a real scenario

    const updatePayload = {
      'subscription.plan': newPlanId,
      'subscription.startDate': FieldValue.serverTimestamp(), // Use server timestamp for consistency
      'subscription.endDate': admin.firestore.Timestamp.fromDate(endDate), // Convert Date to Firestore Timestamp
      'subscription.active': true, // Activate the new plan
      'usage.monthlyAllowance': newPlanDetails.tokenAllowance,
      'usage.documents.limit': newPlanDetails.documentLimit,
      // Optionally reset usage counts upon plan change, or keep existing usage
      // 'usage.tokenCount': 0,
      // 'usage.documents.generated': 0,
      'usage.resetDate': admin.firestore.Timestamp.fromDate(endDate), // Reset usage on the same cycle as subscription end
      'updatedAt': FieldValue.serverTimestamp()
    };

    // Update user document using userService
    await userService.updateUser(userId, updatePayload);
    logger.log(`updateSubscription: User ${userId} successfully switched to plan ${newPlanId}`);

    // Fetch updated user data to return
    const updatedUser = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      message: `Successfully switched to ${newPlanDetails.name} plan`,
      subscription: updatedUser.subscription // Return updated subscription details
    });
  } catch (error) {
    logger.error(`updateSubscription: Error updating subscription for user ${req.user?.id}:`, error);
    res.status(500).send({ error: 'Internal Server Error: Could not update subscription.' });
  }
};

/**
 * Cancel user's subscription (marks as inactive, effective at end date)
 */
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('cancelSubscription: Unauthorized - req.user.id missing.');
      return res.status(401).send({ error: 'Unauthorized: User ID not found.' });
    }

    logger.log(`cancelSubscription: User ${userId} attempting to cancel subscription.`);

    // Prepare update payload
    const updatePayload = {
      'subscription.active': false, // Mark as inactive
      'updatedAt': FieldValue.serverTimestamp()
      // Note: The subscription will remain until its original endDate
      // Real cancellation might involve talking to Stripe API etc.
    };

    await userService.updateUser(userId, updatePayload);
    logger.log(`cancelSubscription: User ${userId} successfully marked subscription as inactive.`);

    res.status(200).json({
      success: true,
      message: 'Subscription successfully canceled',
      note: 'Your plan benefits will remain active until the end of the current billing period.'
    });
  } catch (error) {
    logger.error(`cancelSubscription: Error cancelling subscription for user ${req.user?.id}:`, error);
    res.status(500).send({ error: 'Internal Server Error: Could not cancel subscription.' });
  }
};


module.exports = {
  getPlans, // Aligned name
  getCurrent, // Aligned name
  updateSubscription, // Name was already aligned
  cancelSubscription, // Name was already aligned
};
