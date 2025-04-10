const { firebaseAdmin, firestoreDb } = require('../services/firebaseAdmin');
const { FieldValue } = firebaseAdmin.firestore;
const aiServiceFactory = require('../services/aiServiceFactory');
const userService = require('../services/userService'); // Use the Firestore-based user service
const DocumentProcessor = require('../utils/documentProcessor');
const DocumentExporter = require('../utils/documentExporter');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError, // Add ForbiddenError for auth checks
  AIServiceError,
  UsageLimitError // Add error for usage limits
} = require('../middleware/errorHandler');

// Ensure firestoreDb is initialized
if (!firestoreDb) {
  throw new Error("Firestore is not initialized. Check Firebase Admin setup.");
}

const documentsCollection = firestoreDb.collection('documents');

/**
 * Document controller for handling document generation and management using Firestore
 */
class DocumentController {
  /**
   * Generate a new document based on form data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Object} next - Express next middleware function
   */
  static async generateDocument(req, res, next) {
    try {
      const { formData, contextType, aiProvider = 'anthropic' } = req.body;
      const userId = req.user?.id; // Get user ID from authenticated request

      if (!userId) {
        // Should be caught by auth middleware, but double-check
        return next(new ForbiddenError('Authentication required to generate documents.'));
      }

      if (!formData || !contextType) {
        return next(new BadRequestError('Missing required fields: formData and contextType are required.', { formData: !formData, contextType: !contextType }));
      }

      // --- Check Usage Limits BEFORE calling AI ---
      try {
          const usageStatus = await userService.checkUsageLimits(userId);
          if (!usageStatus.canUseService) {
              throw new UsageLimitError('Account inactive or subscription expired.');
          }
          // Check document limits specifically (token limits are harder to pre-check accurately)
          if (usageStatus.isDocLimitReached) {
              throw new UsageLimitError(`Document limit reached (${usageStatus.docsGenerated}/${usageStatus.docsLimit}).`);
          }
          console.log(`Usage check passed for user ${userId}`);
      } catch (usageError) {
          console.warn(`Usage limit check failed for user ${userId}: ${usageError.message}`);
          // Propagate specific usage errors
          return next(usageError instanceof UsageLimitError ? usageError : new Error('Failed to verify usage limits.'));
      }
      // --- End Usage Check ---


      // Get the appropriate AI service
      const aiService = aiServiceFactory.getService(aiProvider);

      // Generate content using the AI service
      let response;
      let estimatedTokens = 0; // Placeholder for token count
      try {
          response = await aiService.generateContextDocument(formData, contextType);
          // TODO: Ideally, the aiService response includes token usage
          // estimatedTokens = response.tokenUsage || calculateEstimatedTokens(formData, response);
          console.log(`AI generated response for ${contextType} for user ${userId}`);
      } catch (aiError) {
          console.error(`AI service error for user ${userId}:`, aiError);
          return next(new AIServiceError('AI service failed to generate document content.', { originalError: aiError.message }));
      }


      // Process the raw response
      const processedDocument = DocumentProcessor.processResponse(response, contextType);

      // Prepare document data for Firestore
      const newDocumentData = {
        ownerId: userId, // Link document to the user
        title: processedDocument.title || `${contextType} Document`,
        type: contextType,
        // Store the structured content directly
        content: {
            sections: processedDocument.sections || [],
            // Add any other top-level fields from processedDocument if needed
        },
        aiProvider: aiProvider,
        // TODO: Store actual token usage if available
        tokensUsed: estimatedTokens, // Placeholder
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      // Save the document to Firestore
      const docRef = await documentsCollection.add(newDocumentData);
      console.log(`Document saved to Firestore with ID: ${docRef.id} for user ${userId}`);

      // --- Update User Usage AFTER successful generation and save ---
      try {
          // Increment document count
          await userService.incrementDocumentCount(userId);
          // Update token usage (use estimatedTokens for now)
          if (estimatedTokens > 0) {
              await userService.updateTokenUsage(userId, estimatedTokens);
          }
           console.log(`Usage updated for user ${userId} after document generation.`);
      } catch (updateError) {
          // Log the error but don't fail the request, as the document was created
          console.error(`Failed to update usage stats for user ${userId} after document creation (ID: ${docRef.id}):`, updateError);
      }
      // --- End Usage Update ---

      // Return the created document data, including its new ID
      res.status(201).json({ id: docRef.id, ...newDocumentData, createdAt: new Date() /* Approximate client time */ });

    } catch (error) {
      // Catch any unexpected errors during the process
      console.error('Unexpected error in generateDocument:', error);
      // Ensure specific errors are passed correctly
      if (error instanceof BadRequestError || error instanceof ForbiddenError || error instanceof AIServiceError || error instanceof UsageLimitError || error instanceof NotFoundError) {
        next(error);
      } else {
        // Generic server error for anything else
        next(new Error('An internal server error occurred while generating the document.'));
      }
    }
  }

  /**
   * Get all documents for the authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Object} next - Express next middleware function
   */
  static async getUserDocuments(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new ForbiddenError('Authentication required to view documents.'));
      }

      const snapshot = await documentsCollection
        .where('ownerId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot.empty) {
        return res.json([]); // Return empty array if no documents found
      }

      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Timestamps to ISO strings or Date objects if needed by client
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : null,
        updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate().toISOString() : null,
      }));

      res.json(documents);
    } catch (error) {
      console.error(`Error fetching documents for user ${req.user?.id}:`, error);
      next(new Error('An internal server error occurred while fetching documents.'));
    }
  }

  /**
   * Get a specific document by ID, ensuring ownership
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Object} next - Express next middleware function
   */
  static async getDocumentById(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id: docId } = req.params;

      if (!userId) {
        return next(new ForbiddenError('Authentication required.'));
      }
      if (!docId) {
           return next(new BadRequestError('Document ID is required.'));
      }

      const docRef = documentsCollection.doc(docId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return next(new NotFoundError('Document not found.', { id: docId }));
      }

      const document = docSnap.data();

      // Verify ownership
      if (document.ownerId !== userId) {
        return next(new ForbiddenError('You do not have permission to access this document.', { id: docId }));
      }

      res.json({
          id: docSnap.id,
          ...document,
          // Convert Timestamps if needed
          createdAt: document.createdAt?.toDate ? document.createdAt.toDate().toISOString() : null,
          updatedAt: document.updatedAt?.toDate ? document.updatedAt.toDate().toISOString() : null,
      });
    } catch (error) {
      console.error(`Error fetching document ${req.params.id} for user ${req.user?.id}:`, error);
      // Handle potential Firestore errors (e.g., invalid ID format)
      if (error.message.includes('document path')) {
          next(new BadRequestError('Invalid document ID format.', { id: req.params.id }));
      } else {
         next(new Error('An internal server error occurred while fetching the document.'));
      }
    }
  }

  /**
   * Export a document to a specified format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Object} next - Express next middleware function
   */
  static async exportDocument(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { format = 'markdown' } = req.query;

       if (!userId && id !== 'current') { // Allow unauthenticated for 'current' if body provided
           return next(new ForbiddenError('Authentication required to export saved documents.'));
       }

      // Validate format
      const allowedFormats = ['markdown', 'html', 'text'];
      if (!allowedFormats.includes(format)) {
        return next(new BadRequestError('Invalid export format.', { format, allowedFormats }));
      }

      let documentContent; // This should be the structured content (like processedDocument)

      if (id === 'current') {
        // For unsaved documents sent directly in the request body
        documentContent = req.body.document?.content; // Expecting { document: { content: { sections: [...] } } }
        if (!documentContent || !documentContent.sections) {
          return next(new BadRequestError('Valid document content (with sections) is required in the request body for 'current' export.'));
        }
         console.log(`Exporting 'current' document provided in body for format: ${format}`);
      } else {
        // For saved documents, fetch from Firestore and verify ownership
        if (!userId) return next(new ForbiddenError('Authentication required.')); // Re-check auth for saved docs

        const docRef = documentsCollection.doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
          return next(new NotFoundError('Document not found.', { id }));
        }

        const savedDoc = docSnap.data();
        if (savedDoc.ownerId !== userId) {
          return next(new ForbiddenError('You do not have permission to export this document.', { id }));
        }
        documentContent = savedDoc.content; // Get the content object stored in Firestore
        console.log(`Exporting saved document ID: ${id} for user ${userId} to format: ${format}`);
      }

      // Convert the structured content to the requested format
      let exportContent;
      let contentType;
      // Use a generic title or one from the content if available
      let title = documentContent.title || 'document';
      let fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'markdown':
          exportContent = DocumentExporter.toMarkdown(documentContent); // Pass the structured content
          contentType = 'text/markdown; charset=utf-8';
          fileName += `.${DocumentExporter.getFileExtension('markdown')}`;
          break;
        case 'html':
          exportContent = DocumentExporter.toHTML(documentContent); // Pass the structured content
          contentType = 'text/html; charset=utf-8';
          fileName += `.${DocumentExporter.getFileExtension('html')}`;
          break;
        case 'text':
        default:
          exportContent = DocumentExporter.toPlainText(documentContent); // Pass the structured content
          contentType = 'text/plain; charset=utf-8';
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
       if (error instanceof BadRequestError || error instanceof ForbiddenError || error instanceof NotFoundError) {
        next(error);
      } else {
        next(new Error('An internal server error occurred during document export.'));
      }
    }
  }


  /**
   * Delete a document by ID, ensuring ownership
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Object} next - Express next middleware function
   */
  static async deleteDocument(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id: docId } = req.params;

      if (!userId) {
        return next(new ForbiddenError('Authentication required.'));
      }
       if (!docId) {
           return next(new BadRequestError('Document ID is required.'));
       }

      const docRef = documentsCollection.doc(docId);
      const docSnap = await docRef.get(); // Get doc first to check ownership

      if (!docSnap.exists) {
        return next(new NotFoundError('Document not found.', { id: docId }));
      }

      const document = docSnap.data();
      if (document.ownerId !== userId) {
        return next(new ForbiddenError('You do not have permission to delete this document.', { id: docId }));
      }

      // Ownership verified, proceed with delete
      await docRef.delete();
      console.log(`Document deleted from Firestore with ID: ${docId} by user ${userId}`);

      // Optional: Update user stats (e.g., decrement count) if needed
      // try {
      //   await userService.decrementDocumentCount(userId); // Example if needed
      // } catch (statError) {
      //   console.error(`Failed to update user stats after deleting doc ${docId}:`, statError);
      // }

      res.status(200).json({ message: 'Document deleted successfully' }); // Use 200 OK or 204 No Content

    } catch (error) {
      console.error(`Error deleting document ${req.params.id} for user ${req.user?.id}:`, error);
       if (error instanceof BadRequestError || error instanceof ForbiddenError || error instanceof NotFoundError) {
        next(error);
       } else if (error.message.includes('document path')) {
           next(new BadRequestError('Invalid document ID format.', { id: req.params.id }));
       } else {
         next(new Error('An internal server error occurred while deleting the document.'));
       }
    }
  }
}

module.exports = DocumentController;
