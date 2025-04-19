const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config/default');

class AnthropicService {
  constructor(apiKey = config.anthropic.apiKey) {
    this.client = new Anthropic({ apiKey });
    this.model = config.anthropic.model;
    this.temperature = config.anthropic.temperature;
    this.maxTokens = config.anthropic.maxTokens;
  }

  /**
   * Generate content from Anthropic Claude API and track token usage
   * @param {string} prompt - The prompt to send to the API
   * @returns {Object} - The generated content and token usage
   */
  async generateContent(prompt) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });

      // Track token usage
      const tokensUsed = {
        input: response.usage?.input_tokens || 0,
        output: response.usage?.output_tokens || 0,
        total: response.usage?.input_tokens + response.usage?.output_tokens || 0
      };

      console.log(`Anthropic token usage: ${tokensUsed.input} input, ${tokensUsed.output} output, ${tokensUsed.total} total`);

      return {
        content: response.content[0].text,
        tokensUsed: tokensUsed.total
      };
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
}

module.exports = AnthropicService;