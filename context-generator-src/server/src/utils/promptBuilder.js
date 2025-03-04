const marketAudiencePrompts = require('../prompts/marketAudiencePrompts');
const businessProfilePrompts = require('../prompts/businessProfilePrompts');
const styleGuidePrompts = require('../prompts/styleGuidePrompts');
const personalBioPrompts = require('../prompts/personalBioPrompts');

class PromptBuilder {
  static buildPrompt(contextType, formData) {
    switch (contextType) {
      case 'marketAudience':
        return this._buildMarketAudiencePrompt(formData);
      case 'businessProfile':
        return this._buildBusinessProfilePrompt(formData);
      case 'styleGuide':
        return this._buildStyleGuidePrompt(formData);
      case 'personalBio':
        return this._buildPersonalBioPrompt(formData);
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

  static _buildPersonalBioPrompt(formData) {
    // Process the form data to replace Handlebars template variables
    let userPrompt = personalBioPrompts.PERSONAL_BIO_USER_PROMPT;

    // Replace all the handlebars variables
    Object.keys(formData).forEach(key => {
      const value = formData[key] || '';
      
      // Replace {{key}} with value
      const keyPattern = new RegExp(`{{${key}}}`, 'g');
      userPrompt = userPrompt.replace(keyPattern, value);

      // Handle conditional blocks {{#if key}}content{{/if}}
      const ifPattern = new RegExp(`{{#if ${key}}}([\\s\\S]*?){{/if}}`, 'g');
      userPrompt = userPrompt.replace(ifPattern, value ? '$1' : '');
    });

    // Clean up any remaining handlebars patterns
    userPrompt = userPrompt.replace(/{{#if [\w]+}}[\s\S]*?{{\/if}}/g, '');
    userPrompt = userPrompt.replace(/{{[\w]+}}/g, '');

    return {
      systemPrompt: personalBioPrompts.PERSONAL_BIO_SYSTEM_PROMPT,
      userPrompt: userPrompt
    };
  }
}

module.exports = PromptBuilder;