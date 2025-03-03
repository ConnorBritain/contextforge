/**
 * Middleware to check and enforce usage limits
 */
const User = require('../models/User');
const { ForbiddenError } = require('./errorHandler');

/**
 * Check if the user has reached their token or document limit
 * Also resets usage counters if past the reset date
 */
const checkUsageLimit = async (req, res, next) => {
  try {
    // Skip check if no user (anonymous) or admin users
    if (!req.user || req.user.role === 'admin') {
      return next();
    }

    // Get the full user object with usage data
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ForbiddenError('User not found');
    }

    // Check if subscription is active
    if (!user.subscription.active) {
      throw new ForbiddenError('Your subscription is inactive. Please renew your subscription.');
    }

    // Check if subscription has expired
    const now = new Date();
    if (now > user.subscription.endDate) {
      // Only enforce for paid plans, free plans don't expire but reset usage
      if (user.subscription.plan !== 'free') {
        user.subscription.active = false;
        await user.save();
        throw new ForbiddenError('Your subscription has expired. Please renew your subscription.');
      }
    }

    // Check and reset usage if necessary
    await user.checkAndResetUsage();

    // Check token limit
    if (user.hasReachedTokenLimit()) {
      throw new ForbiddenError(
        'Monthly token limit reached. Please upgrade your plan for additional tokens.'
      );
    }

    // Check document limit
    if (user.hasReachedDocumentLimit()) {
      throw new ForbiddenError(
        'Monthly document generation limit reached. Please upgrade your plan for additional documents.'
      );
    }

    // Store user in request for later token usage update
    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkUsageLimit;