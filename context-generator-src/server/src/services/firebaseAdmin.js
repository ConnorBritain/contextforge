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

  // Use service account or environment variables
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // Try to parse the JSON string from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } catch (error) {
      console.error('Error initializing Firebase Admin with service account:', error);
      // Fallback to application default credentials
      fallbackInitialization();
    }
  } else {
    fallbackInitialization();
  }

  return admin;
};

// Fallback initialization based on environment
function fallbackInitialization() {
  // If running in a development environment without credentials
  // you can initialize with a minimal configuration
  if (process.env.NODE_ENV !== 'production') {
    admin.initializeApp({
      // This will use the service account credentials from the environment
      // or the Application Default Credentials if running on Google Cloud
      projectId: process.env.FIREBASE_PROJECT_ID || 'contextforge'
    });
    return;
  }

  // In production, initialize with available credentials
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace newlines in the private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

// Initialize and export Firebase Admin
const firebaseAdmin = initializeFirebaseAdmin();
module.exports = firebaseAdmin;