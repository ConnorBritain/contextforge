const express = require('express');
const morgan = require('morgan');
const config = require('config'); // Using node-config
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const healthRoutes = require('./routes/healthRoutes');
const configureSecurityMiddleware = require('./middleware/security');
const configureCorsMiddleware = require('./middleware/cors');
const { errorHandler } = require('./middleware/errorHandler');
const firebaseAdmin = require('./services/firebaseAdmin'); // Handles Admin SDK init for Auth
const { initializeFirestore } = require('./services/firestoreService'); // Handles Admin SDK init for Firestore
const wizardController = require('./controllers/wizardController');
const authMiddleware = require('./middleware/auth');
const userServiceMiddleware = require('./middleware/usageLimit');

// Initialize Express app
const app = express();

// Initialize Firestore (uses Admin SDK)
try {
  initializeFirestore();
} catch (error) {
  console.error('Failed to initialize Firestore:', error);
  process.exit(1);
}

// Serve static files from the client/build directory
const path = require('path');
app.use(express.static(path.join(__dirname, '../../client/build')));

// Apply CORS middleware
app.use(configureCorsMiddleware());

// Configure security middleware (Helmet, etc.)
configureSecurityMiddleware(app);

// JSON body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware (Morgan)
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Log Firebase Initialization Status
if (firebaseAdmin.apps.length > 0 && firebaseAdmin.app().options.projectId) {
    console.log(`Firebase Admin SDK initialized for project: ${firebaseAdmin.app().options.projectId}`);
} else {
    console.warn('Firebase Admin SDK likely not initialized via service account. Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly.');
}

// --- Public API Routes ---
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

// Server info endpoint needs access to the `server` instance, defined later
// We'll add it after server starts listening

// --- Protected API Routes ---
// Apply authentication and user data loading middleware
app.use('/api', authMiddleware.verifyToken, userServiceMiddleware.loadUserData);

// Wizard Draft routes
app.post('/api/wizard', wizardController.save);
app.get('/api/wizard/list', wizardController.list);
app.delete('/api/wizard/:docId', wizardController.deleteDraft);

// Subscription routes
app.use('/api/subscriptions', subscriptionRoutes);

// Removed routes related to old document model (/api/documents, /api/contexts)
// app.use('/api/documents', documentRoutes); 
// app.use('/api/contexts', documentRoutes);


// --- Static File Serving & Client-Side Routing ---
// Serve the React app for any non-API GET requests
app.get('*', (req, res, next) => {
  // If path starts with /api/, pass to 404 handler
  if (req.path.startsWith('/api/')) {
      return next(); 
  }
  // Otherwise, serve index.html for client-side routing
  res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'), (err) => {
    if (err) {
        console.error("Error sending index.html:", err);
        next(err); // Pass error to Express error handler
    }
  });
});

// --- API 404 Handler ---
// Catches any /api/* routes not handled above
app.use('/api/*', (req, res, next) => {
  res.status(404).json({
      success: false,
      message: `API route not found: ${req.originalUrl}`
  });
});

// --- Centralized Error Handling --- 
app.use(errorHandler);


// --- Server Startup Logic --- 
let server; // To hold the server instance

const startServer = (port) => {
  const listener = app.listen(port);

  listener.on('listening', () => {
    const actualPort = listener.address().port;
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${actualPort}`);
    
    // Update config object if port changed dynamically
    if (actualPort !== parseInt(config.get('port'))) {
      console.log(`Note: Using port ${actualPort} instead of configured port ${config.get('port')}`);
      // Update config - requires node-config mutation capabilities or careful handling
      // For simplicity, we primarily rely on the dynamic value below
    }

    // Define server-info endpoint *after* server is listening
    app.get('/api/server-info', (req, res) => {
        const currentServerUrl = config.get('serverUrl').replace(`:${config.get('port')}`, `:${actualPort}`);
        res.json({
            port: actualPort,
            serverUrl: currentServerUrl,
            apiUrl: `${currentServerUrl}/api`
        });
    });
    console.log(`Server info endpoint available at /api/server-info`);

  });

  listener.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const currentPort = parseInt(port || config.get('port'));
      const nextPort = currentPort + 1;
      console.log(`Port ${currentPort} is busy, trying port ${nextPort}`);
      listener.close(); 
      server = startServer(nextPort); // Recursively try next port
    } else {
      console.error('Server startup error:', err);
      process.exit(1);
    }
  });

  return listener; 
};

// Start the server using port from config
const initialPort = parseInt(config.get('port'));
server = startServer(initialPort); // Assign the instance

// --- Process Exception Handling ---
// Graceful shutdown
const shutdown = (signal) => {
    console.log(`
${signal} received. Shutting down gracefully...`);
    server?.close(() => {
        console.log('HTTP server closed.');
        // Add any other cleanup here (e.g., close DB connections if not handled elsewhere)
        process.exit(0);
    });
    // Force shutdown after timeout
    setTimeout(() => {
        console.error('Could not close connections in time, forcing shutdown.');
        process.exit(1);
    }, 10000).unref(); // 10 seconds
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT')); // Handle Ctrl+C

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Details:', err);
  // Decide if shutdown is necessary, or just log
  // shutdown('Unhandled Rejection'); 
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  shutdown('Uncaught Exception');
});

module.exports = app;
