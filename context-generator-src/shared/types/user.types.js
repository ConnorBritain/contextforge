/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} createdAt - Creation date
 * @property {string} updatedAt - Last update date
 * @property {string} role - User role (admin, user)
 * @property {string} subscription - Subscription plan (free, basic, premium)
 * @property {boolean} active - Whether the user is active
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - Unique identifier
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} createdAt - Creation date
 * @property {Object} subscription - Subscription details
 * @property {Object} usage - Usage details
 */

/**
 * @typedef {Object} UserSubscription
 * @property {string} plan - Subscription plan (free, basic, premium)
 * @property {string} status - Subscription status (active, cancelled, expired)
 * @property {string} startDate - Start date
 * @property {string} endDate - End date
 * @property {number} price - Subscription price
 * @property {Object} features - Subscription features
 */

/**
 * @typedef {Object} UserUsage
 * @property {number} documentsGenerated - Number of documents generated
 * @property {number} documentLimit - Document generation limit
 * @property {number} tokensUsed - Number of tokens used
 * @property {number} tokenLimit - Token usage limit
 * @property {string} resetDate - Date when usage counters reset
 */

module.exports = {}; // Export is needed for JSDoc types to be recognized