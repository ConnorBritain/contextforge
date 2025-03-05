const AIServiceFactory = require('../services/aiServiceFactory');
const PromptBuilder = require('../utils/promptBuilder');
const DocumentProcessor = require('../utils/documentProcessor');
const { BadRequestError } = require('../middleware/errorHandler');
const userService = require('../services/userService');

/**
 * Generate a context document based on form data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.generateContext = async (req, res, next) => {
  try {
    const { contextType, formData } = req.body;
    
    if (!contextType || !formData) {
      throw new BadRequestError('Missing required parameters: contextType or formData');
    }
    
    // Build the appropriate prompt
    const prompt = PromptBuilder.buildPrompt(contextType, formData);
    
    // Get the configured AI service
    const aiService = AIServiceFactory.getService();
    
    // Generate the document
    const responseData = await aiService.generateContent(prompt);
    
    // Process the response into a structured document
    const processedDocument = DocumentProcessor.processResponse(
      responseData.content, 
      contextType
    );
    
    // If authenticated, update token usage with Firebase
    if (req.user && req.userData) {
      await userService.updateTokenUsage(req.user.id, responseData.tokensUsed);
      await userService.incrementDocumentCount(req.user.id);
      
      // Add usage information to the response
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
    console.error('Context generation error:', error);
    next(error);
  }
};