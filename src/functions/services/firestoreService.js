const admin = require('firebase-admin');
const config = require('config');

let db;

const initializeFirestore = () => {
  if (!db) {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: config.has('firebase.projectId') ? config.get('firebase.projectId') : undefined,
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
 * @param {string} wizardId - A unique ID for the wizard session/data (part of payload.id).
 * @param {object} payload - The wizard data payload to save.
 * @returns {Promise<admin.firestore.DocumentReference>} The Firestore document reference.
 */
const saveWizard = async (userId, wizardId, payload) => {
  const db = getFirestore();
  const docId = `${userId}_${wizardId}`;
  const docRef = db.collection('wizardResponses').doc(docId);

  const dataToSave = {
    ...payload,
    userId: userId,
    // Ensure `id` within the payload matches wizardId if used separately
    id: wizardId, 
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await docRef.set(dataToSave, { merge: true });
    console.log(`Wizard data saved successfully for docId: ${docId}`);
    // Return the composite ID used for the document
    return { id: docId, ref: docRef }; 
  } catch (error) {
    console.error(`Error saving wizard data for docId ${docId}:`, error);
    throw new Error('Failed to save wizard data.');
  }
};

/**
 * Retrieves wizard data from Firestore using the composite docId.
 * @param {string} userId - The user's unique ID (for verification).
 * @param {string} docId - The composite document ID (e.g., userId_wizardId).
 * @returns {Promise<object|null>} The wizard data document or null if not found/unauthorized.
 */
const getWizardByDocId = async (userId, docId) => {
  const db = getFirestore();
  const docRef = db.collection('wizardResponses').doc(docId);

  try {
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      // Security check: Verify the userId stored in the document matches the requesting user
      if (data.userId === userId) {
        console.log(`Wizard data retrieved successfully for docId: ${docId}`);
        // Ensure the document data includes the composite ID
        return { ...data, docId: docSnap.id }; 
      } else {
        console.warn(`Attempt to access document ${docId} by unauthorized user ${userId}.`);
        return null; // Unauthorized access attempt
      }
    } else {
      console.log(`No wizard document found for docId: ${docId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving wizard data for docId ${docId}:`, error);
    throw new Error('Failed to retrieve wizard data.');
  }
};


/**
 * Lists all wizard drafts for a specific user.
 * @param {string} userId - The user's unique ID.
 * @param {object} options - Query options (e.g., limit, orderBy).
 * @returns {Promise<Array<object>>} An array of wizard draft documents.
 */
const listWizards = async (userId, options = { orderBy: 'updatedAt', direction: 'desc' }) => {
  const db = getFirestore();
  const wizardsRef = db.collection('wizardResponses');
  const query = wizardsRef
                  .where('userId', '==', userId)
                  .orderBy(options.orderBy || 'updatedAt', options.direction || 'desc');

  try {
    const snapshot = await query.get();
    const drafts = [];
    snapshot.forEach(doc => {
        // Include the composite document ID along with the data
        drafts.push({ ...doc.data(), docId: doc.id });
    });
    console.log(`Found ${drafts.length} wizard drafts for user ${userId}.`);
    return drafts;
  } catch (error) {
    console.error(`Error listing wizard drafts for user ${userId}:`, error);
    throw new Error('Failed to list wizard drafts.');
  }
};

/**
 * Deletes a specific wizard draft.
 * @param {string} userId - The user's unique ID (for verification).
 * @param {string} docId - The composite document ID (e.g., userId_wizardId).
 * @returns {Promise<void>} A promise that resolves when deletion is complete.
 */
const deleteWizard = async (userId, docId) => {
  const db = getFirestore();
  const docRef = db.collection('wizardResponses').doc(docId);

  try {
    // Optional: Verify ownership before deleting (though rules should enforce this)
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      console.warn(`Wizard document ${docId} not found for deletion.`);
      // Can choose to throw NotFoundError or just return successfully
      return; 
    }
    const data = docSnap.data();
    if (data.userId !== userId) {
      console.error(`User ${userId} attempted to delete unauthorized document ${docId}.`);
      throw new Error('Permission denied to delete this document.'); // Or specific auth error
    }

    // Perform the delete
    await docRef.delete();
    console.log(`Wizard document ${docId} deleted successfully by user ${userId}.`);
  } catch (error) {
    // Don't obscure permission errors
    if (error.message.includes('Permission denied')) {
        throw error;
    }
    console.error(`Error deleting wizard document ${docId}:`, error);
    throw new Error('Failed to delete wizard draft.');
  }
};

module.exports = {
  initializeFirestore,
  getFirestore,
  saveWizard,
  getWizardByDocId, // Renamed for clarity (was getWizard)
  listWizards,      // New function
  deleteWizard,     // New function
};
