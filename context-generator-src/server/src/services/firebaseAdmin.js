const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Check if Firebase is already initialized to prevent multiple initializations
if (!admin.apps.length) {
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
      admin.initializeApp();
    }
  } else {
    // Use application default credentials
    admin.initializeApp();
  }
}

module.exports = admin;