const firestoreService = require('../services/firestoreService');
const logger = require("firebase-functions/logger"); // Use Firebase logger

// --- Controller for saving a wizard draft ---
const saveDraft = async (req, res) => {
  try {
    // Get user ID from the authenticated user record attached by middleware
    const userId = req.user?.id; // Assuming 'id' is the field name for UID in your Firestore user doc
    if (!userId) {
      logger.warn('saveDraft: Unauthorized - req.user.id missing.');
      return res.status(401).send({ error: 'Unauthorized: User ID not found.' });
    }

    const payload = req.body;
    // Ensure payload contains necessary fields, especially an ID for editing/saving
    // The client currently generates an ID if one isn't provided (initialData.id or Date.now())
    const wizardId = payload?.id;
    if (!payload || !wizardId) {
      logger.warn(`saveDraft: Bad Request for user ${userId} - Missing payload or payload.id.`);
      return res.status(400).send({ error: 'Bad Request: Missing payload or wizard ID (payload.id).' });
    }
    
    // Add/ensure userId is part of the data being saved
    const dataToSave = {
      ...payload,
      userId: userId // Ensure the userId is stored in the document
    };

    // Call the service to save the data
    const result = await firestoreService.saveWizard(userId, wizardId, dataToSave);
    logger.log(`saveDraft: User ${userId} saved draft ${result.id}`);

    // Respond with the composite document ID
    res.status(201).json({
        message: 'Wizard draft saved successfully.',
        documentId: result.id // Use the composite ID returned by the service
    });

  } catch (error) {
    logger.error(`saveDraft: Error saving wizard data for user ${req.user?.id}:`, error);
    // Send a generic server error response
    res.status(500).send({ error: 'Internal Server Error: Could not save wizard draft.' });
  }
};

// --- Controller for listing wizard drafts ---
const getDrafts = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('getDrafts: Unauthorized - req.user.id missing.');
      return res.status(401).send({ error: 'Unauthorized: User ID not found.' });
    }

    logger.log(`getDrafts: Fetching drafts for user ${userId}`);
    const drafts = await firestoreService.listWizards(userId);

    res.status(200).json({
        success: true,
        drafts: drafts || [] // Return empty array if null/undefined
    });

  } catch (error) {
    logger.error(`getDrafts: Error listing wizard drafts for user ${req.user?.id}:`, error);
    res.status(500).send({ error: 'Internal Server Error: Could not retrieve drafts.' });
  }
};

// --- Controller for deleting a wizard draft ---
// Note: Route in index.js is /wizard/delete/:docId
const deleteDraft = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('deleteDraft: Unauthorized - req.user.id missing.');
      return res.status(401).send({ error: 'Unauthorized: User ID not found.' });
    }

    const { docId } = req.params; // Get the composite ID from the route parameter
    if (!docId) {
      logger.warn(`deleteDraft: Bad Request for user ${userId} - Missing document ID.`);
      return res.status(400).send({ error: 'Bad Request: Missing document ID in URL path.' });
    }

    // Basic permission check (service layer should also enforce)
    if (!docId.startsWith(userId + '_')) {
        logger.warn(`deleteDraft: Forbidden - User ${userId} attempted action on mismatched docId ${docId}`);
        return res.status(403).send({ error: 'Forbidden: Permission denied or document not found.' });
    }

    logger.log(`deleteDraft: User ${userId} attempting to delete draft ${docId}`);
    await firestoreService.deleteWizard(userId, docId);
    logger.log(`deleteDraft: User ${userId} successfully deleted draft ${docId}`);

    res.status(200).json({
        success: true,
        message: `Wizard draft ${docId} deleted successfully.`
    });

  } catch (error) {
    logger.error(`deleteDraft: Error deleting wizard draft ${req.params.docId} for user ${req.user?.id}:`, error);
    // Handle specific errors like permission denied from the service layer if needed
    if (error.message.includes('Permission denied') || error.message.includes('not found')) {
        return res.status(403).send({ error: 'Forbidden: Permission denied or document not found.' });
    }
    res.status(500).send({ error: 'Internal Server Error: Could not delete draft.' });
  }
};


module.exports = {
  saveDraft, // Aligned name
  getDrafts, // Aligned name
  deleteDraft, // Name was already aligned
};
