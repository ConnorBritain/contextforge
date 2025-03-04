const jwt = require('jsonwebtoken');
const config = require('../config/default');

/**
 * Middleware to authenticate and authorize requests using JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // In development mode without MongoDB, allow requests without authentication
  // or with a mock token for testing
  if (!(process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true')) {
    // For development, use mock user
    req.user = {
      id: 'mock-user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user'
    };
    return next();
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Add user from payload to request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};