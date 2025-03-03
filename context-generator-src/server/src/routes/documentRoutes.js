const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const documentController = require('../controllers/documentController');
// Middleware for authentication
const auth = require('../middleware/auth');

// Public routes (no authentication required)
// Generate new context document
router.post('/generate', documentController.generateDocument);

// Export a document (works with both saved and unsaved documents)
router.post('/export/:id', documentController.exportDocument);

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