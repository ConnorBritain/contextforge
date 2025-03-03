const { OpenAI } = require('openai');
const config = require('../config/default');

class OpenAIService {
  constructor(apiKey = config.openai.apiKey) {
    this.client = new OpenAI({ apiKey });
    this.model = config.openai.model;
    this.temperature = config.openai.temperature;
    this.maxTokens = config.openai.maxTokens;
  }

  async generateContent(prompt) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;