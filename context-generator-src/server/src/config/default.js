module.exports = {
    port: process.env.PORT || 5000,
    aiProvider: process.env.AI_PROVIDER || 'mock', // 'openai', 'anthropic', or 'mock'
    useRealAI: process.env.USE_REAL_AI === 'true' || false, // Set to true in production or for testing real AI
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
    },
    auth: {
      google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
      }
    },
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    serverUrl: process.env.SERVER_URL || 'http://localhost:5000',
    // Document generation settings
    documents: {
      maxLength: 20000, // Maximum character length for generated documents
      defaultContextType: 'targetMarketAudience',
      exportFormats: ['markdown', 'html', 'text']
    }
  };