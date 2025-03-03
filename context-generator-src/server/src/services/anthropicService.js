const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config/default');

class AnthropicService {
  constructor(apiKey = config.anthropic.apiKey) {
    this.client = new Anthropic({ apiKey });
    this.model = config.anthropic.model;
    this.temperature = config.anthropic.temperature;
    this.maxTokens = config.anthropic.maxTokens;
  }

  async generateContent(prompt) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
}

module.exports = AnthropicService;