const admin = require('firebase-admin');
const config = require('config');

let db;

const initializeFirestore = () => {
  if (!db) {
    // Initialize the Admin SDK only if it hasn't been initialized yet.
    // It will automatically use GOOGLE_APPLICATION_CREDENTIALS environment variable
    // if it's set and valid.
    if (admin.apps.length === 0) {
        admin.initializeApp({
            // If projectId is not set in config, SDK tries to find it from the environment.
            // Ensure FIREBASE_PROJECT_ID is set or add it to your config files.
            projectId: config.get('firebase.projectId')
        });
    }
    db = admin.firestore();
    console.log('Firestore initialized successfully.');
  }
  return db;
};

const getFirestore = () => {
  if (!db) {
    return initializeFirestore();
  }
  return db;
};

/**
 * Saves wizard data to Firestore.
 * @param {string} userId - The user's unique ID.
 * @param {string} wizardId - A unique ID for the wizard session/data.
 * @param {object} payload - The wizard data payload to save.
 * @returns {Promise<admin.firestore.DocumentReference>} The Firestore document reference.
 */
const saveWizard = async (userId, wizardId, payload) => {
  const db = getFirestore();
  const docId = `${userId}_${wizardId}`; // Combine userId and wizardId for a unique document ID
  const docRef = db.collection('wizardResponses').doc(docId);

  // Add userId to the payload to enforce security rules
  const dataToSave = {
      ...payload,
      userId: userId, // Ensure userId is part of the document data
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await docRef.set(dataToSave, { merge: true }); // Use set with merge to handle potential overwrites/updates
    console.log(`Wizard data saved successfully for docId: ${docId}`);
    return docRef;
  } catch (error) {
    console.error(`Error saving wizard data for docId ${docId}:`, error);
    throw new Error('Failed to save wizard data.');
  }
};

module.exports = {
  initializeFirestore,
  getFirestore,
  saveWizard,
};
