const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// Get all available subscription plans
router.get('/plans', subscriptionController.getSubscriptionPlans);

// Protected routes (require authentication)
// Get current user's subscription info
router.get('/current', auth, subscriptionController.getCurrentSubscription);

// Update subscription (upgrade/downgrade)
router.post('/update', auth, subscriptionController.updateSubscription);

// Cancel subscription
router.post('/cancel', auth, subscriptionController.cancelSubscription);

module.exports = router;