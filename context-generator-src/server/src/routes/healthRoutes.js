/**
 * Health check and system status routes
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @route GET /api/health
 * @description Basic health check route
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      status: 'ok',
      message: 'Context Generator API is running'
    };
    
    res.status(200).json(healthCheck);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      message: 'Health check failed'
    });
  }
});

/**
 * @route GET /api/health/details
 * @description Detailed health check including database connection
 * @access Public
 */
router.get('/details', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Calculate memory usage
    const memoryUsage = process.memoryUsage();
    
    const healthCheck = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      status: 'ok',
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'unknown'
      },
      system: {
        nodeVersion: process.version,
        memoryUsage: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
        },
        env: process.env.NODE_ENV
      }
    };
    
    if (dbStatus !== 'connected') {
      healthCheck.status = 'warning';
      healthCheck.message = 'Database connection issue';
    }
    
    res.status(200).json(healthCheck);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

module.exports = router;