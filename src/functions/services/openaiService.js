const { OpenAI } = require('openai');
const config = require('../config/default');

class OpenAIService {
  constructor(apiKey = config.openai.apiKey) {
    this.client = new OpenAI({ apiKey });
    this.model = config.openai.model;
    this.temperature = config.openai.temperature;
    this.maxTokens = config.openai.maxTokens;
  }

  /**
   * Generate content from OpenAI API and track token usage
   * @param {string} prompt - The prompt to send to the API
   * @returns {Object} - The generated content and token usage
   */
  async generateContent(prompt) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });

      // Track token usage
      const tokensUsed = {
        input: response.usage?.prompt_tokens || 0,
        output: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0
      };

      console.log(`OpenAI token usage: ${tokensUsed.input} input, ${tokensUsed.output} output, ${tokensUsed.total} total`);

      return {
        content: response.choices[0].message.content,
        tokensUsed: tokensUsed.total
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;