const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const documentController = require('../controllers/documentController');
// Middleware would go here in a more complete implementation
// const { authenticate } = require('../middleware/auth');

// Generate new context document
router.post('/generate', aiController.generateContext);

// In a more complete implementation, these would require authentication
// router.get('/', documentController.getDocuments);
// router.get('/:id', documentController.getDocumentById);
// router.post('/', documentController.createDocument);
// router.put('/:id', documentController.updateDocument);
// router.delete('/:id', documentController.deleteDocument);

module.exports = router;