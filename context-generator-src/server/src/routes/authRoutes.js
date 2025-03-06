const express = require('express');
const { check } = require('express-validator');
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', auth, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
  auth,
  check('name', 'Name is required').optional(),
  check('email', 'Please include a valid email').optional().isEmail()
], AuthController.updateProfile);

/**
 * @route   GET /api/auth/users/:userId
 * @desc    Get user by ID (admin only)
 * @access  Private/Admin
 */
router.get('/users/:userId', auth, AuthController.getUserById);

/**
 * @route   PUT /api/auth/users/:userId
 * @desc    Update user by ID (admin only)
 * @access  Private/Admin
 */
router.put('/users/:userId', auth, AuthController.updateUserById);

module.exports = router;