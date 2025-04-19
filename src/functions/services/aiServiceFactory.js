const OpenAIService = require('./openaiService');
const AnthropicService = require('./anthropicService');
const MockAiService = require('./mockAiService');
const config = require('../config/default');

/**
 * Factory class to get the appropriate AI service based on configuration or request
 */
class AIServiceFactory {
  /**
   * Get AI service instance based on provider
   * @param {string} providerOverride - Optional provider override
   * @returns {Object} - AI service instance
   */
  static getService(providerOverride) {
    // Use override if provided, otherwise use config
    const provider = (providerOverride || config.aiProvider || 'mock').toLowerCase();
    
    switch (provider) {
      case 'openai':
        return new OpenAIService(config.openai?.apiKey);
      case 'anthropic':
        return new AnthropicService(config.anthropic?.apiKey);
      case 'mock':
        return new MockAiService();
      default:
        // Default to mock service for development
        console.warn(`Provider "${provider}" not recognized, using mock service instead`);
        return new MockAiService();
    }
  }
  
  /**
   * Check if we're in development/test mode and should use mock
   * @returns {boolean} - True if we should use mock service
   */
  static shouldUseMock() {
    const environment = process.env.NODE_ENV || 'development';
    return environment !== 'production' || !config.useRealAI;
  }
  
  /**
   * Get the appropriate service based on environment
   * @param {string} providerOverride - Optional provider override
   * @returns {Object} - AI service instance
   */
  static getServiceForEnvironment(providerOverride) {
    if (this.shouldUseMock()) {
      return new MockAiService();
    }
    
    return this.getService(providerOverride);
  }
}

module.exports = AIServiceFactory;