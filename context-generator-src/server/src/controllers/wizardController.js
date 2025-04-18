const firestoreService = require('../services/firestoreService');

const save = async (req, res, next) => {
  try {
    // Assuming JWT middleware has verified the token and attached user info to req.auth
    const userId = req.auth?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found in token.' });
    }

    const payload = req.body;
    // Simple validation to ensure payload and ID exist
    if (!payload || !payload.id) {
        return res.status(400).json({ message: 'Bad Request: Missing payload or wizard ID.' });
    }
    const wizardId = payload.id;

    const docRef = await firestoreService.saveWizard(userId, wizardId, payload);

    // Respond with the document ID or a success message
    res.status(201).json({ message: 'Wizard data saved successfully.', documentId: docRef.id });
  } catch (error) {
    console.error('Error saving wizard data:', error);
    // Pass error to the centralized error handler
    next(error);
  }
};

module.exports = {
  save,
};
