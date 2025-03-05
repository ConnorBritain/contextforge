const { validationResult } = require('express-validator');
const { 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError 
} = require('../middleware/errorHandler');
const userService = require('../services/userService');
const admin = require('../services/firebaseAdmin');

/**
 * Authentication controller for Firebase Auth integration
 * Handles user profile management, not authentication (handled by Firebase client SDK)
 */
class AuthController {
  /**
   * Get the current user's profile from Firestore
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getProfile(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      
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
   * Update the current user's profile in Firestore
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
      const updates = {};
      
      if (name) updates.name = name;
      
      // Update the user in Firestore
      const updatedUser = await userService.updateUser(req.user.id, updates);
      
      // If email is changed, update it in Firebase Auth (requires re-authentication)
      if (email && email !== req.user.email) {
        // We only update email in Firestore, not Firebase Auth
        // Client-side should handle email change in Firebase Auth directly
        updates.email = email;
        await userService.updateUser(req.user.id, { email });
      }

      res.json({
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      next(error);
    }
  }
  
  /**
   * Admin-only: Get user by ID
   * @param {Object} req - Express request object 
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getUserById(req, res, next) {
    try {
      // Check if requesting user is admin
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError('Not authorized to access this resource');
      }
      
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      
      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      next(error);
    }
  }
  
  /**
   * Admin-only: Update user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateUserById(req, res, next) {
    try {
      // Check if requesting user is admin
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError('Not authorized to access this resource');
      }
      
      const { userId } = req.params;
      const updatedUser = await userService.updateUser(userId, req.body);
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user by ID:', error);
      next(error);
    }
  }
}

module.exports = AuthController;