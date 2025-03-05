/**
 * Security-related middleware for production
 */
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const config = require('../config/default');

/**
 * Configure and return security middleware
 */
const configureSecurityMiddleware = (app) => {
  // Set security HTTP headers with Helmet
  app.use(helmet());
  
  // CORS is now configured separately in middleware/cors.js
  
  // Configure global rate limiting to prevent brute force attacks
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again later'
  });
  app.use('/api/', generalLimiter);
  
  // Stricter rate limit for authentication routes
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 login/register attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts, please try again later'
  });
  app.use('/api/auth/', authLimiter);
  
  // Stricter rate limit for document generation routes
  const docGenLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 document generations per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Document generation rate limit reached, please try again later'
  });
  app.use('/api/documents/generate', docGenLimiter);
  
  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());
  
  // Data sanitization against XSS attacks
  app.use(xss());
  
  // Log security configuration
  console.log(`Security middleware configured for environment: ${process.env.NODE_ENV}`);
};

module.exports = configureSecurityMiddleware;