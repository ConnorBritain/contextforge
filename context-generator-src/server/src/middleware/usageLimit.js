/**
 * Middleware to check and enforce usage limits based on Firestore user data
 */
const userService = require('../services/userService');
// Import both ForbiddenError (for general access denial) and UsageLimitError (for specific limits)
const { ForbiddenError, UsageLimitError } = require('./errorHandler');

/**
 * Check if the user has reached their usage limits (tokens, documents)
 * or if their account/subscription is inactive/expired.
 */
const checkUsageLimit = async (req, res, next) => {
  try {
    // Assume auth middleware runs before this, providing req.user
    const userId = req.user?.id;

    // Allow unauthenticated requests (if applicable to the route) or admin users to bypass
    // Note: Specific routes might still require authentication via the `auth` middleware itself.
    // This middleware focuses *only* on usage limits *if* a user context exists.
    if (!userId || req.user.role === 'admin') {
      return next();
    }

    // Fetch the current usage status and limits for the user
    // This also handles potential usage resets (e.g., monthly rollover)
    const usageStatus = await userService.checkUsageLimits(userId);

    // Check if the user's account/subscription allows service usage
    // `canUseService` combines checks for active subscription and non-expiration
    if (!usageStatus.canUseService) {
        let reason = 'Account is inactive or subscription has expired.';
        // Provide more specific reason if expired
        if (usageStatus.isExpired) {
            reason = 'Your subscription has expired. Please renew to continue.';
        }
        // Use ForbiddenError here as it's a general access denial, not just a limit exceeded
        return next(new ForbiddenError(reason));
    }

    // Check token limit - Note: This is a pre-check. Actual token consumption happens later.
    // This check might be less useful here unless limits are very low or usage is predictable.
    // Consider removing this specific check if generateDocument handles it robustly.
    // if (usageStatus.isTokenLimitReached) {
    //   return next(new UsageLimitError(
    //     `Monthly token limit reached (${usageStatus.tokenCount}/${usageStatus.tokenLimit}). Please upgrade or wait for reset.`
    //   ));
    // }

    // Check document generation limit - This is a more reliable pre-check.
    if (usageStatus.isDocLimitReached) {
      return next(new UsageLimitError(
        `Monthly document generation limit reached (${usageStatus.docsGenerated}/${usageStatus.docsLimit}). Please upgrade or wait for reset.`
      ));
    }

    // Optional: Attach fetched usage data or user data to the request if needed by subsequent handlers
    // req.usageStatus = usageStatus; // Could attach the whole status object
    req.userData = usageStatus.userData; // Keep attaching userData as before

    // If all checks pass, proceed to the next middleware or route handler
    next();

  } catch (error) {
    // Handle errors during the usage check itself
    console.error(`Error in usage limit middleware for user ${req.user?.id}:`, error);

    // Pass specific errors (like UsageLimitError from userService if thrown there)
    if (error instanceof UsageLimitError || error instanceof ForbiddenError) {
        next(error);
    } else {
        // Generic error for unexpected issues during the check
        next(new Error('An error occurred while verifying usage limits.'));
    }
  }
};

module.exports = checkUsageLimit;
