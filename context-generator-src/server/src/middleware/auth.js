// Import the initialized Firebase Admin instance AND the userService
const { firebaseAdmin, firestoreDb } = require('../services/firebaseAdmin'); // Use firebaseAdmin for auth()
const userService = require('../services/userService');
const { UnauthorizedError } = require('./errorHandler'); // Use consistent error type

/**
 * Middleware to authenticate requests using Firebase ID tokens AND
 * ensure a corresponding user document exists in Firestore.
 * Attaches the Firestore user document to req.user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = async function(req, res, next) {
  // Get token from Authorization header (Bearer token)
  const authHeader = req.header('Authorization');

  // In development/testing when auth is not required, create a mock Firestore user entry if needed
  if (process.env.NODE_ENV !== 'production' && process.env.FIREBASE_AUTH_REQUIRED !== 'true') {
    const mockUserId = 'mock-user-1';
    try {
        let mockUser = await userService.getUserById(mockUserId);
        if (!mockUser) {
            console.log('Creating mock user in Firestore for development...');
            // Use firebaseAdmin.firestore.FieldValue for serverTimestamp
            const { FieldValue } = firebaseAdmin.firestore;
            mockUser = await userService.setUser(mockUserId, {
                email: 'demo@example.com',
                name: 'Demo User',
                role: 'user', // Default role
                // Initialize default usage/subscription if needed for tests
                usage: { tokenCount: 0, documents: { generated: 0, limit: 5 }, monthlyAllowance: 50000, resetDate: null },
                subscription: { plan: 'free', active: true, startDate: FieldValue.serverTimestamp() },
                createdAt: FieldValue.serverTimestamp(), // Add createdAt on creation
                updatedAt: FieldValue.serverTimestamp()
            });
        }
        req.user = mockUser; // Attach the full mock user profile from Firestore
        return next();
    } catch (devError) {
         console.error("Error handling mock user for development:", devError);
         // Fallback to basic mock user if Firestore interaction fails in dev
         req.user = { id: mockUserId, email: 'demo@example.com', name: 'Demo User', role: 'user' };
         return next();
         // Or stricter: return next(new Error('Failed to setup mock user for development'));
    }
  }

  // Check if token exists and has the correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Use UnauthorizedError for consistency
    return next(new UnauthorizedError('Authorization header missing or invalid. Bearer token required.'));
  }

  // Extract the token
  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify the Firebase ID token using the admin instance
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // --- Firestore User Sync ---
    let userRecord = await userService.getUserById(userId);
    // Use firebaseAdmin.firestore.FieldValue for serverTimestamp
    const { FieldValue } = firebaseAdmin.firestore;

    if (!userRecord) {
      // User exists in Firebase Auth but not in Firestore DB yet. Create them.
      console.log(`User ${userId} not found in Firestore. Creating profile...`);
      const newUserPayload = {
        email: decodedToken.email,
        name: decodedToken.name || '', // Use name from token if available
        // Set default role, usage, subscription status etc.
        role: decodedToken.role || 'user', // Assign default role
        // Initialize default usage/subscription structure
        usage: {
             tokenCount: 0,
             documents: { generated: 0, limit: 5 }, // Example free tier limits
             monthlyAllowance: 50000, // Example free tier tokens
             resetDate: null // Will be set by checkUsageLimits on first check
        },
        subscription: {
            plan: 'free', // Default to free plan
            active: true,
            startDate: FieldValue.serverTimestamp()
        },
        // Store other relevant info from token if needed
        authProvider: decodedToken.firebase.sign_in_provider,
        lastLoginAt: FieldValue.serverTimestamp(), // Set last login on creation
        createdAt: FieldValue.serverTimestamp(), // Set createdAt
        updatedAt: FieldValue.serverTimestamp() // Set updatedAt
      };
      userRecord = await userService.setUser(userId, newUserPayload);
      console.log(`User profile created in Firestore for ${userId}`);
    } else {
       // User exists, maybe update last login time
        try {
            await userService.updateUser(userId, {
                 lastLoginAt: FieldValue.serverTimestamp(),
                 // Optionally update name/email from token if they differ?
                 // name: decodedToken.name || userRecord.name, 
                 // email: decodedToken.email || userRecord.email 
             });
             // Refetch user record after update to ensure req.user has latest data
             userRecord = await userService.getUserById(userId);
        } catch(updateError){
             console.warn(`Failed to update lastLoginAt for user ${userId}:`, updateError.message);
             // Non-critical error, continue request processing with existing userRecord
        }
    }

    // Attach the full user profile *from Firestore* to the request object
    // Ensure userRecord is not null before assigning
    if (!userRecord) {
        console.error(`Failed to get or create user record for user ${userId} after Firestore sync.`);
        return next(new Error('Failed to retrieve user profile during authentication.'));
    }
    req.user = userRecord;
    // --- End Firestore User Sync ---

    next(); // Proceed to the next middleware/route handler

  } catch (err) {
    console.error('Token verification or user sync error:', err);
     // Differentiate between invalid token and other errors
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error' || err.code?.startsWith('auth/')) {
         next(new UnauthorizedError('Invalid or expired authentication token. Please log in again.', { code: err.code }));
    } else {
        // Handle potential errors from userService (setUser, getUserById) or other issues
        next(new Error('An internal error occurred during authentication processing.'));
    }
  }
};