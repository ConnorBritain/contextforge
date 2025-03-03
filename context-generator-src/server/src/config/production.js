/**
 * Production environment configuration
 */
const defaultConfig = require('./default');

// Production-specific configuration overrides
module.exports = {
  ...defaultConfig,
  
  // Use real AI in production
  aiProvider: process.env.AI_PROVIDER || 'anthropic',
  useRealAI: true,
  
  // MongoDB connection string 
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d' 
  },
  
  // URLs
  clientUrl: process.env.CLIENT_URL || 'https://contextgenerator.com',
  serverUrl: process.env.SERVER_URL || 'https://api.contextgenerator.com',
  
  // Logging
  logging: {
    level: 'info',
    format: 'combined'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Max 100 requests per windowMs
  },
  
  // Security
  security: {
    cors: {
      allowedOrigins: [
        'https://contextgenerator.com', 
        'https://www.contextgenerator.com'
      ]
    }
  }
};