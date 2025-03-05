const admin = require('firebase-admin');
require('dotenv').config();

/**
 * Initialize Firebase Admin SDK
 * Uses environment variables for configuration
 */
const initializeFirebaseAdmin = () => {
  // Check if already initialized
  if (admin.apps.length > 0) {
    return admin;
  }

  // If running in a development environment without credentials
  // you can initialize with a minimal configuration
  if (process.env.NODE_ENV !== 'production') {
    admin.initializeApp({
      // This will use the service account credentials from the environment
      // or the Application Default Credentials if running on Google Cloud
      projectId: process.env.FIREBASE_PROJECT_ID || 'contextforge'
    });
    return admin;
  }

  // In production, initialize with full credentials
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace newlines in the private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });

  return admin;
};

// Initialize and export Firebase Admin
const firebaseAdmin = initializeFirebaseAdmin();
module.exports = firebaseAdmin;