const express = require('express');
const morgan = require('morgan');
const config = require('./config/default');
const documentRoutes = require('./routes/documentRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const healthRoutes = require('./routes/healthRoutes');
const configureSecurityMiddleware = require('./middleware/security');
const configureCorsMiddleware = require('./middleware/cors');
const { errorHandler } = require('./middleware/errorHandler');
const firebaseAdmin = require('./services/firebaseAdmin'); // Keep existing Firebase Admin setup for Auth
const { initializeFirestore } = require('./services/firestoreService'); // Import Firestore initializer
const wizardController = require('./controllers/wizardController'); // Import wizard controller
const authMiddleware = require('./middleware/auth'); // Import auth middleware

// Initialize Express app
const app = express();

// Initialize Firestore
try {
  initializeFirestore();
} catch (error) {
  console.error('Failed to initialize Firestore:', error);
  process.exit(1); // Exit if Firestore cannot be initialized
}

// Serve static files from the client/build directory
const path = require('path');
app.use(express.static(path.join(__dirname, '../../client/build')));

// Apply CORS middleware for all environments
app.use(configureCorsMiddleware());

// Configure additional security middleware for production
if (process.env.NODE_ENV === 'production') {
  configureSecurityMiddleware(app);
}

// JSON body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  // Use concise 'combined' format for production logs
  app.use(morgan('combined'));
} else {
  // Use more verbose 'dev' format for development
  app.use(morgan('dev'));
}

// Log the Firebase initialization
console.log(`Firebase Admin SDK initialized for project: ${firebaseAdmin.app().options.projectId}`);

// Health check routes (must be before auth middleware)
app.use('/api/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// New wizard route - protected by auth middleware
app.post('/api/wizard', authMiddleware.verifyToken, wizardController.save);

// Backward compatibility for previous route
app.use('/api/contexts', documentRoutes);

// Add server info endpoint for dynamic port discovery
app.get('/api/server-info', (req, res) => {
  res.json({ 
    port: config.port,
    serverUrl: config.serverUrl 
  });
});

// Serve the React app for any non-API routes
app.get('/*', (req, res, next) => {
  // Only handle non-API routes with this middleware
  if (!req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  }
  next();
});

// 404 handler for API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server with port fallback
const startServer = (port) => {
  const server = app.listen(port);
  
  server.on('listening', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    
    // Update the config if we're using a different port than originally configured
    if (port !== parseInt(config.port)) {
      console.log(`Note: Using port ${port} instead of configured port ${config.port} (which was busy)`);
      
      // Update the server URL in the config to reflect the new port
      config.serverUrl = config.serverUrl.replace(`:${config.port}`, `:${port}`);
      config.port = port;
      
      console.log(`Server URL updated to: ${config.serverUrl}`);
    }
    
    // Always ensure server-info endpoint is available with up-to-date port information
    // This helps the client detect which port to use
    app.get('/api/server-info', (req, res) => {
      res.json({ 
        port: port,
        serverUrl: config.serverUrl,
        apiUrl: `http://localhost:${port}/api`
      });
    });
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying port ${parseInt(port) + 1}`);
      server.close();
      return startServer(parseInt(port) + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
  
  return server;
};

const PORT = parseInt(config.port);
const server = startServer(PORT);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err.name, err.message);
  console.error(err.stack);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...', err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

module.exports = app;
