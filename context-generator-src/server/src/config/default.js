module.exports = {
    port: process.env.PORT || 5000,
    aiProvider: process.env.AI_PROVIDER || 'openai', // 'openai' or 'anthropic'
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4000
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 4000
    },
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/context-generator'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key-for-development',
      expiresIn: '7d'
    }
  };