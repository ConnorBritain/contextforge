const AIServiceFactory = require('../services/aiServiceFactory');
const PromptBuilder = require('../utils/promptBuilder');
const DocumentProcessor = require('../utils/documentProcessor');

/**
 * Generate a context document based on form data
 */
exports.generateContext = async (req, res) => {
  try {
    const { contextType, formData } = req.body;
    
    if (!contextType || !formData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: contextType or formData'
      });
    }
    
    // Build the appropriate prompt
    const prompt = PromptBuilder.buildPrompt(contextType, formData);
    
    // Get the configured AI service
    const aiService = AIServiceFactory.getService();
    
    // Generate the document
    const rawResponse = await aiService.generateContent(prompt);
    
    // Process the response into a structured document
    const processedDocument = DocumentProcessor.processResponse(
      rawResponse, 
      contextType
    );
    
    res.status(200).json({
      success: true,
      context: processedDocument
    });
  } catch (error) {
    console.error('Context generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during context generation'
    });
  }
};