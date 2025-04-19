const firestoreService = require('../services/firestoreService');
const { UnauthorizedError, BadRequestError } = require('../middleware/errorHandler');

const save = async (req, res, next) => {
  try {
    const userId = req.auth?.uid;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized: No user ID found in token.'));
    }

    const payload = req.body;
    const wizardId = payload?.id;
    if (!payload || !wizardId) {
      return next(new BadRequestError('Bad Request: Missing payload or wizard ID (payload.id).'));
    }

    // Pass userId, wizardId, and the full payload to the service
    const result = await firestoreService.saveWizard(userId, wizardId, payload);

    // Respond with the composite document ID used in Firestore
    res.status(201).json({ 
        message: 'Wizard data saved successfully.', 
        documentId: result.id // Use the composite ID returned by the service
    });
  } catch (error) {
    console.error('Error saving wizard data:', error);
    next(error); // Pass error to the centralized error handler
  }
};

const list = async (req, res, next) => {
  try {
    const userId = req.auth?.uid;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized: No user ID found in token.'));
    }

    // Optional: Add query parameters for pagination/sorting later if needed
    // const options = { 
    //     limit: parseInt(req.query.limit) || 10,
    //     orderBy: req.query.orderBy || 'updatedAt',
    //     direction: req.query.direction || 'desc'
    // };
    
    const drafts = await firestoreService.listWizards(userId);

    res.status(200).json({ 
        success: true, 
        drafts: drafts 
    });

  } catch (error) {
    console.error('Error listing wizard drafts:', error);
    next(error);
  }
};

const deleteDraft = async (req, res, next) => {
  try {
    const userId = req.auth?.uid;
    if (!userId) {
      return next(new UnauthorizedError('Unauthorized: No user ID found in token.'));
    }

    const { docId } = req.params; // Get the composite ID from the route parameter
    if (!docId) {
      return next(new BadRequestError('Bad Request: Missing document ID in URL path.'));
    }

    // Ensure the docId belongs to the user (service layer also checks)
    if (!docId.startsWith(userId + '_')) {
        console.warn(`User ${userId} attempted action on mismatched docId ${docId}`);
        // Return 403 Forbidden or 404 Not Found depending on desired behavior
        return next(new UnauthorizedError('Permission denied or document not found.')); 
    }

    await firestoreService.deleteWizard(userId, docId);

    res.status(200).json({ 
        success: true, 
        message: `Wizard draft ${docId} deleted successfully.` 
    });

  } catch (error) {
    console.error(`Error deleting wizard draft ${req.params.docId}:`, error);
    // Handle specific errors like permission denied from the service layer
    if (error.message.includes('Permission denied')) {
        return next(new UnauthorizedError('Permission denied to delete this document.'));
    }
    next(error); // Pass other errors to the centralized handler
  }
};


module.exports = {
  save,
  list,
  deleteDraft,
};
