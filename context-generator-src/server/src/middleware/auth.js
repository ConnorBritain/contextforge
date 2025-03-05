const admin = require('../services/firebaseAdmin');

/**
 * Middleware to authenticate and authorize requests using Firebase ID tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = async function(req, res, next) {
  // Get token from Authorization header (Bearer token)
  const authHeader = req.header('Authorization');
  
  // In development mode, allow requests without authentication
  if (process.env.NODE_ENV !== 'production' && process.env.FIREBASE_AUTH_REQUIRED !== 'true') {
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
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Extract the token
  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Add user from Firebase to request
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || '',
      role: decodedToken.role || 'user'
    };
    
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};