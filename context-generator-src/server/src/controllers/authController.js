const User = require('../models/User');
const { validationResult } = require('express-validator');
const { 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError 
} = require('../middleware/errorHandler');

/**
 * Authentication controller for user registration, login, and profile management
 */
class AuthController {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Validation failed', { errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('User already exists', { email });
      }

      // Create new user
      user = new User({
        name,
        email,
        password
      });

      await user.save();

      // Generate JWT token
      const token = user.generateAuthToken();

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error registering user:', error);
      next(error);
    }
  }

  /**
   * Login a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Validation failed', { errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Generate JWT token
      const token = user.generateAuthToken();

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
      next(error);
    }
  }

  /**
   * Get the current user's profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      next(error);
    }
  }

  /**
   * Update the current user's profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateProfile(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Validation failed', { errors: errors.array() });
      }

      const { name, email } = req.body;
      
      // Find and update the user
      const user = await User.findById(req.user.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Update user properties
      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      next(error);
    }
  }
}

module.exports = AuthController;