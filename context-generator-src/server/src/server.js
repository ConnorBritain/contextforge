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
// aiController might still be needed if generateContext is kept, otherwise remove import
// const aiController = require('./controllers/aiController'); 
const authMiddleware = require('./middleware/auth'); // Import auth middleware
const userServiceMiddleware = require('./middleware/usageLimit'); // Import usage limit middleware

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
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Log the Firebase initialization
if (firebaseAdmin.app()?.options?.projectId) {
    console.log(`Firebase Admin SDK initialized for project: ${firebaseAdmin.app().options.projectId}`);
} else {
    console.warn('Firebase Admin SDK Project ID not found. Ensure GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_PROJECT_ID is set.');
}

// --- Public Routes ---
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/server-info', (req, res) => {
  // Use the port the server is actually listening on
  const currentPort = server.address()?.port || config.port; 
  // Ensure config reflects the actual port if it changed on startup
  const currentServerUrl = config.serverUrl.includes(`:${currentPort}`) ? config.serverUrl : config.serverUrl.replace(/:\d+/, `:${currentPort}`);
  res.json({
    port: currentPort,
    serverUrl: currentServerUrl,
    apiUrl: `${currentServerUrl}/api`
  });
});


// --- Protected Routes (require authentication) ---
app.use('/api', authMiddleware.verifyToken, userServiceMiddleware.loadUserData);

// Wizard Draft routes (Save, List, Delete)
app.post('/api/wizard', wizardController.save);
app.get('/api/wizard/list', wizardController.list); 
app.delete('/api/wizard/:docId', wizardController.deleteDraft); 

// Document Generation Route (Removed - Handled by Cloud Function)
// app.post('/api/generate/context-doc', userServiceMiddleware.checkUsageLimits, aiController.generateContextDoc);

// Original direct generation route (Keep or remove based on requirements)
// If kept, ensure aiController import and definition remain
// app.post('/api/generate/context', userServiceMiddleware.checkUsageLimits, aiController.generateContext);

// Other protected routes
app.use('/api/documents', documentRoutes); 
app.use('/api/subscriptions', subscriptionRoutes); 
app.use('/api/contexts', documentRoutes); // Backward compatibility (consider deprecation)


// --- Static File Serving & 404/Error Handling ---
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
      return next(); 
  }
  // Serve static file first
  express.static(path.join(__dirname, '../../client/build'), { fallthrough: false })(req, res, (err) => {
    // If static file not found or error, serve index.html for client-side routing
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'), (fileErr) => {
        if (fileErr) {
            console.error("Error sending index.html:", fileErr);
            next(fileErr); 
        }
    });
  });
});

// 404 handler specifically for API routes
app.use('/api/*', (req, res, next) => {
  res.status(404).json({
      success: false,
      message: `API route not found: ${req.originalUrl}`
  });
});

// Centralized error handling middleware
app.use(errorHandler);


// --- Server Startup ---
let server; // Declare server variable

const startServer = (port) => {
  const listener = app.listen(port);

  listener.on('listening', () => {
    const actualPort = listener.address().port;
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${actualPort}`);
    if (actualPort !== parseInt(config.port)) {
      console.log(`Note: Using port ${actualPort} instead of configured port ${config.port}`);
      config.serverUrl = config.serverUrl.replace(`:${config.port}`, `:${actualPort}`);
      config.port = actualPort; 
      console.log(`Server URL updated to: ${config.serverUrl}`);
    }
  });

  listener.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const currentPort = parseInt(port || config.port);
      const nextPort = currentPort + 1;
      console.log(`Port ${currentPort} is busy, trying port ${nextPort}`);
      listener.close(); 
      server = startServer(nextPort); // Reassign server instance
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  return listener; 
};

const initialPort = parseInt(config.port);
server = startServer(initialPort); // Initialize server

// --- Process Exception Handling ---
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err?.name, err?.message);
  console.error(err?.stack);
  server?.close(() => { // Check if server exists before closing
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...', err?.name, err?.message);
  console.error(err?.stack);
   server?.close(() => { // Check if server exists before closing
    process.exit(1);
  });
   // Force exit if server closing fails
   setTimeout(() => process.exit(1), 1000).unref();
});

module.exports = app;
