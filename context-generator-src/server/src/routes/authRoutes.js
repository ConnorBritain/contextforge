const express = require('express');
const { check } = require('express-validator');
const passport = require('passport');
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');
const config = require('../config/default');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], AuthController.login);

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
 * @route   GET /api/auth/google
 * @desc    Authenticate with Google OAuth
 * @access  Public
 */
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${config.clientUrl}/login?error=google-auth-failed` 
  }),
  AuthController.googleAuthCallback
);

module.exports = router;