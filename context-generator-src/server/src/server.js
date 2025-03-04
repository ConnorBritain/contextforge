const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/default');
const mongoose = require('mongoose');
const passport = require('passport');
const documentRoutes = require('./routes/documentRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const healthRoutes = require('./routes/healthRoutes');
const configureSecurityMiddleware = require('./middleware/security');
const { errorHandler } = require('./middleware/errorHandler');
const configurePassport = require('./config/passport');

// Initialize Express app
const app = express();

// Serve static files from the client/build directory
const path = require('path');
app.use(express.static(path.join(__dirname, '../../client/build')));

// Configure security middleware for production
if (process.env.NODE_ENV === 'production') {
  configureSecurityMiddleware(app);
} else {
  // Basic CORS for development
  app.use(cors());
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

// Initialize Passport
app.use(passport.initialize());
// Configure passport strategies
configurePassport();

// Connect to MongoDB with improved options for production
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Only attempt MongoDB connection in production or if MONGODB_REQUIRED is set
if (process.env.NODE_ENV === 'production' || process.env.MONGODB_REQUIRED === 'true') {
  mongoose.connect(config.mongodb.uri, mongoOptions)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
} else {
  console.log('MongoDB connection skipped in development mode.');
  console.log('Note: Document saving and user authentication features will be unavailable.');
  console.log('To enable MongoDB, set MONGODB_REQUIRED=true or install MongoDB locally.');
}

// Health check routes (must be before auth middleware)
app.use('/api/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

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
      
      // Add an endpoint to let the client know what port the server is running on
      app.get('/api/server-info', (req, res) => {
        res.json({ 
          port: port,
          serverUrl: config.serverUrl 
        });
      });
    }
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