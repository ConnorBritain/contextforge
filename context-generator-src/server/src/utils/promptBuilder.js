const marketAudiencePrompts = require('../prompts/marketAudiencePrompts');
const businessProfilePrompts = require('../prompts/businessProfilePrompts');
const styleGuidePrompts = require('../prompts/styleGuidePrompts');

class PromptBuilder {
  static buildPrompt(contextType, formData) {
    switch (contextType) {
      case 'marketAudience':
        return this._buildMarketAudiencePrompt(formData);
      case 'businessProfile':
        return this._buildBusinessProfilePrompt(formData);
      case 'styleGuide':
        return this._buildStyleGuidePrompt(formData);
      default:
        throw new Error(`Unsupported context type: ${contextType}`);
    }
  }

  static _buildMarketAudiencePrompt(formData) {
    // For MVP, we'll use a simpler approach with one comprehensive prompt
    return marketAudiencePrompts.fullDocumentPrompt(formData);
  }

  static _buildBusinessProfilePrompt(formData) {
    return businessProfilePrompts.fullDocumentPrompt(formData);
  }

  static _buildStyleGuidePrompt(formData) {
    return styleGuidePrompts.fullDocumentPrompt(formData);
  }
}

module.exports = PromptBuilder;