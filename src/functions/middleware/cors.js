/**
 * Enhanced CORS middleware configuration for all environments
 */
const cors = require('cors');
const config = require('../config/default');

/**
 * Configure and export CORS middleware with appropriate settings
 * This provides more detailed and permissive CORS settings for development
 */
const configureCorsMiddleware = () => {
  const corsOptions = {
    origin: [config.clientUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'x-auth-token',
      'Access-Control-Allow-Headers',
      'Origin',
      'Accept'
    ],
    credentials: true, // Allow cookies to be sent with requests
    maxAge: 86400, // CORS preflight request cache time (1 day)
    preflightContinue: false,
    optionsSuccessStatus: 204
  };

  return cors(corsOptions);
};

module.exports = configureCorsMiddleware;