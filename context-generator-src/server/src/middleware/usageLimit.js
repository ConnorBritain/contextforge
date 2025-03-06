/**
 * Middleware to check and enforce usage limits with Firebase
 */
const userService = require('../services/userService');
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
    
    const usageData = await userService.checkUsageLimits(req.user.id);
    
    // Check if subscription is active
    if (!usageData.isActive) {
      throw new ForbiddenError('Your subscription is inactive. Please renew your subscription.');
    }
    
    // Check if subscription has expired
    if (usageData.isExpired) {
      await userService.updateUser(req.user.id, {
        'subscription.active': false
      });
      throw new ForbiddenError('Your subscription has expired. Please renew your subscription.');
    }
    
    // Check token limit
    if (usageData.isTokenLimitReached) {
      throw new ForbiddenError(
        'Monthly token limit reached. Please upgrade your plan for additional tokens.'
      );
    }
    
    // Check document limit
    if (usageData.isDocLimitReached) {
      throw new ForbiddenError(
        'Monthly document generation limit reached. Please upgrade your plan for additional documents.'
      );
    }
    
    // Store user data in request for later usage
    req.userData = usageData.userData;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkUsageLimit;