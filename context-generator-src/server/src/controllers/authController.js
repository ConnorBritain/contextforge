const { validationResult } = require('express-validator');
const { 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError 
} = require('../middleware/errorHandler');

// Use mockDataService for development or User model for production
let dataService;
if (process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true') {
  const User = require('../models/User');
  dataService = User;
} else {
  // Use the mock data service for development without MongoDB
  dataService = require('../services/mockDataService');
}

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
      
      let user;
      let token = "mock-auth-token-for-development";
      
      if (process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true') {
        // Production mode with MongoDB
        // Check if user exists
        user = await dataService.findOne({ email });
        if (!user) {
          throw new UnauthorizedError('Invalid credentials');
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new UnauthorizedError('Invalid credentials');
        }
        
        // Generate JWT token
        token = user.generateAuthToken();
      } else {
        // Development mode with mock data
        user = await dataService.authenticate(email, password);
        if (!user) {
          throw new UnauthorizedError('Invalid credentials');
        }
      }

      res.json({
        token,
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
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
      let user;
      
      if (process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true') {
        user = await dataService.findById(req.user.id).select('-password');
      } else {
        user = await dataService.getUserById(req.user.id);
      }
      
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
      
      let user;
      
      if (process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true') {
        // Find and update the user using MongoDB
        user = await dataService.findById(req.user.id);
        if (!user) {
          throw new NotFoundError('User not found');
        }

        // Update user properties
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
      } else {
        // Update user in mock service
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        
        user = await dataService.updateUser(req.user.id, updates);
        if (!user) {
          throw new NotFoundError('User not found');
        }
      }

      res.json({
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      next(error);
    }
  }
}

module.exports = AuthController;