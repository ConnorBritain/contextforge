const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const documentController = require('../controllers/documentController');
// Middleware
const auth = require('../middleware/auth');
const checkUsageLimit = require('../middleware/usageLimit');

// Public routes (authentication optional but tracked if provided)
// Generate new context document
router.post('/generate', auth, checkUsageLimit, documentController.generateDocument);

// Export a document (works with both saved and unsaved documents)
router.post('/export/:id', auth, documentController.exportDocument);

// Routes requiring authentication
// Get all documents for the current user
router.get('/', auth, documentController.getUserDocuments);

// Get a specific document by ID
router.get('/:id', auth, documentController.getDocumentById);

// Delete a document
router.delete('/:id', auth, documentController.deleteDocument);

// Export a saved document by ID
router.get('/:id/export', auth, documentController.exportDocument);

module.exports = router;