const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore'); // Import Firestore
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') }); // Adjusted path assuming .env is at root

let db; // Variable to hold the Firestore instance

/**
 * Initialize Firebase Admin SDK and Firestore
 * Uses environment variables for configuration
 */
const initializeFirebase = () => {
  // Check if already initialized
  if (admin.apps.length > 0) {
    db = getFirestore(); // Get Firestore instance if admin is already initialized
    return { admin, db };
  }

  let app;
  // Use service account or environment variables
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // If GOOGLE_APPLICATION_CREDENTIALS is set (common in Cloud Functions/Run),
      // initializeApp() will automatically use it.
      console.log('Initializing Firebase Admin with Application Default Credentials...');
      app = admin.initializeApp({
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // Try to parse the JSON string from environment variable
      console.log('Initializing Firebase Admin with FIREBASE_SERVICE_ACCOUNT env var...');
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
    } catch (error) {
      console.error('Error initializing Firebase Admin with service account JSON, falling back:', error);
      app = fallbackInitialization(); // Use fallback
    }
  } else {
    console.log('No service account found, attempting fallback initialization...');
    app = fallbackInitialization(); // Use fallback
  }

  if (app) {
    console.log('Firebase Admin Initialized.');
    db = getFirestore(app); // Get Firestore instance from the initialized app
    console.log('Firestore Initialized.');
  } else {
     console.error('Firebase Admin initialization failed.');
     // Set db to null or handle error appropriately
     db = null;
  }


  return { admin, db }; // Return both admin and db
};

// Fallback initialization mainly for local dev or specific environments
function fallbackInitialization() {
  // Attempt initialization without explicit credentials
  // This might work in some environments (like local emulator) or fail
  try {
     console.log('Attempting Firebase Admin fallback initialization...');
     // Provide projectId if available, helps in some cases
     const initOptions = {
        databaseURL: process.env.FIREBASE_DATABASE_URL
     };
     if (process.env.FIREBASE_PROJECT_ID) {
        initOptions.projectId = process.env.FIREBASE_PROJECT_ID;
        console.log(`Using Project ID: ${initOptions.projectId}`);
     } else {
        console.warn('FIREBASE_PROJECT_ID not set for fallback initialization.');
     }
     return admin.initializeApp(initOptions);
  } catch(fallbackError){
      console.error('Fallback Firebase Admin initialization failed:', fallbackError);
      // Consider throwing error or returning a null app object depending on requirements
      return null;
  }
}

// Initialize and export Firebase Admin and Firestore
const { admin: firebaseAdmin, db: firestoreDb } = initializeFirebase();

// Check if initialization was successful before exporting
if (!firebaseAdmin || !firestoreDb) {
  console.error("Failed to initialize Firebase Admin or Firestore. Application might not function correctly.");
  // Optionally throw an error to halt application startup
  // throw new Error("Firebase initialization failed.");
}

module.exports = { firebaseAdmin, firestoreDb }; // Export both
