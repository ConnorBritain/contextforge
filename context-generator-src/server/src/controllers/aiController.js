const AIServiceFactory = require('../services/aiServiceFactory');
const PromptBuilder = require('../utils/promptBuilder');
const DocumentProcessor = require('../utils/documentProcessor');
const { BadRequestError } = require('../middleware/errorHandler');
const userService = require('../services/userService');

/**
 * Generate a context document based on directly provided form data.
 * NOTE: This route might be deprecated or less used now that Cloud Functions handle generation from saved drafts.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.generateContext = async (req, res, next) => {
  console.warn('Direct /api/generate/context called. Consider using the Firestore-triggered Cloud Function flow.');
  try {
    const { contextType, formData } = req.body;
    
    if (!contextType || !formData) {
      return next(new BadRequestError('Missing required parameters: contextType or formData'));
    }
    
    // Build the prompt (assumes non-chunking)
    const prompt = PromptBuilder.buildPrompt(contextType, formData);
    
    // Get AI service (uses server's config)
    const aiService = AIServiceFactory.getService();
    
    // Generate the document in one go
    const responseData = await aiService.generateContent(prompt);
    
    // Process the response
    const processedDocument = DocumentProcessor.processResponse(
      responseData.content,
      contextType
    );
    
    // Update token usage (if user is authenticated)
    if (req.auth && req.userData) {
      await userService.updateTokenUsage(req.auth.uid, responseData.tokensUsed);
      await userService.incrementDocumentCount(req.auth.uid);
      
      // Add usage info to the response
      const userData = req.userData;
      processedDocument.usage = {
        tokensUsed: responseData.tokensUsed,
        currentMonthUsage: userData.usage?.tokenCount || 0,
        monthlyAllowance: userData.usage?.monthlyAllowance || 50000,
        documentsGenerated: userData.usage?.documents?.generated || 0,
        documentLimit: userData.usage?.documents?.limit || 5,
        resetDate: userData.usage?.resetDate
      };
    }
    
    res.status(200).json({
      success: true,
      context: processedDocument
    });
  } catch (error) {
    console.error('Direct context generation error:', error);
    next(error);
  }
};

// Removed generateContextDoc function as it's now handled by Cloud Function

