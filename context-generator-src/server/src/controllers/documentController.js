const aiServiceFactory = require('../services/aiServiceFactory');
const DocumentProcessor = require('../utils/documentProcessor');
const DocumentExporter = require('../utils/documentExporter');
const Document = require('../models/Document');
const { 
  BadRequestError, 
  NotFoundError, 
  AIServiceError 
} = require('../middleware/errorHandler');

/**
 * Document controller for handling document generation and management
 */
class DocumentController {
  /**
   * Generate a new document based on form data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async generateDocument(req, res, next) {
    try {
      const { formData, contextType, aiProvider = 'anthropic' } = req.body;
      
      if (!formData || !contextType) {
        throw new BadRequestError('Missing required fields', { formData: !formData, contextType: !contextType });
      }
      
      // Get the appropriate AI service
      const aiService = aiServiceFactory.getService(aiProvider);
      
      // Generate content using the AI service
      const response = await aiService.generateContextDocument(formData, contextType);
      
      // Process the raw response
      const processedDocument = DocumentProcessor.processResponse(response, contextType);
      
      // If user is authenticated, save the document
      if (req.user) {
        const newDocument = new Document({
          userId: req.user.id,
          title: processedDocument.title || `${contextType} Document`,
          type: contextType,
          content: processedDocument,
          createdAt: new Date()
        });
        
        await newDocument.save();
        processedDocument.id = newDocument._id;
      }
      
      res.json(processedDocument);
    } catch (error) {
      console.error('Error generating document:', error);
      
      // Convert to appropriate error type if not already
      if (error.name === 'AIError' || error.message.includes('AI')) {
        next(new AIServiceError('AI service failed to generate document', { originalError: error.message }));
      } else {
        next(error);
      }
    }
  }
  
  /**
   * Get all documents for the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getUserDocuments(req, res, next) {
    try {
      const documents = await Document.find({ userId: req.user.id })
        .sort({ createdAt: -1 });
      
      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      next(error);
    }
  }
  
  /**
   * Get a specific document by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getDocumentById(req, res, next) {
    try {
      const document = await Document.findOne({
        _id: req.params.id,
        userId: req.user.id
      });
      
      if (!document) {
        throw new NotFoundError('Document not found', { id: req.params.id });
      }
      
      res.json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      next(error);
    }
  }
  
  /**
   * Export a document to a specified format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async exportDocument(req, res, next) {
    try {
      const { id } = req.params;
      const { format = 'markdown' } = req.query;
      
      // Validate format
      const allowedFormats = ['markdown', 'html', 'text'];
      if (!allowedFormats.includes(format)) {
        throw new BadRequestError('Invalid export format', { format, allowedFormats });
      }
      
      // Get document - either from DB or from request body for unsaved documents
      let document;
      
      if (id === 'current') {
        // For unsaved documents sent in request body
        document = req.body.document;
        if (!document) {
          throw new BadRequestError('Document data is required for export');
        }
      } else {
        // For saved documents
        document = await Document.findOne({
          _id: id,
          userId: req.user ? req.user.id : null
        });
        
        if (!document) {
          throw new NotFoundError('Document not found', { id });
        }
        
        // Extract content from document model
        document = document.content;
      }
      
      // Convert to requested format
      let exportContent;
      let contentType;
      let fileName = `${document.title || document.type}-${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'markdown':
          exportContent = DocumentExporter.toMarkdown(document);
          contentType = 'text/markdown';
          fileName += `.${DocumentExporter.getFileExtension('markdown')}`;
          break;
        case 'html':
          exportContent = DocumentExporter.toHTML(document);
          contentType = 'text/html';
          fileName += `.${DocumentExporter.getFileExtension('html')}`;
          break;
        case 'text':
        default:
          exportContent = DocumentExporter.toPlainText(document);
          contentType = 'text/plain';
          fileName += `.${DocumentExporter.getFileExtension('text')}`;
          break;
      }
      
      // Set headers for file download
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      
      // Send the file content
      res.send(exportContent);
    } catch (error) {
      console.error('Error exporting document:', error);
      next(error);
    }
  }
  
  /**
   * Delete a document
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteDocument(req, res, next) {
    try {
      const result = await Document.deleteOne({
        _id: req.params.id,
        userId: req.user.id
      });
      
      if (result.deletedCount === 0) {
        throw new NotFoundError('Document not found or not authorized to delete', { id: req.params.id });
      }
      
      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      next(error);
    }
  }
}

module.exports = DocumentController;