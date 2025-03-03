const OpenAIService = require('./openaiService');
const AnthropicService = require('./anthropicService');
const config = require('../config/default');

class AIServiceFactory {
  static getService() {
    const provider = config.aiProvider.toLowerCase();
    
    switch (provider) {
      case 'openai':
        return new OpenAIService(config.openai.apiKey);
      case 'anthropic':
        return new AnthropicService(config.anthropic.apiKey);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
}

module.exports = AIServiceFactory;