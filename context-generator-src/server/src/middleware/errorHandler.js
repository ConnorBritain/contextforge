/**
 * Custom error classes for standardized error handling
 */
class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// For 400 errors - client sent wrong data
class BadRequestError extends AppError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'BadRequestError';
  }
}

// For 401 errors - authentication required
class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

// For 403 errors - user doesn't have permission
class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

// For 404 errors - resource not found
class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details = null) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

// For 429 errors - rate limit exceeded
class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded. Try again later') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

// For AI service errors
class AIServiceError extends AppError {
  constructor(message = 'AI service error', details = null) {
    super(message, 500, details);
    this.name = 'AIServiceError';
  }
}

// Main error handler middleware
const errorHandler = (err, req, res, next) => {
  const requestId = req.headers['x-request-id'] || 'unknown';
  
  // Log the error
  console.error(`[${requestId}] Error:`, {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack
  });
  
  // Determine error status and message
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Something went wrong',
      type: err.name || 'ServerError'
    }
  };
  
  // Add detailed error information in development
  if (process.env.NODE_ENV !== 'production' && err.details) {
    errorResponse.error.details = err.details;
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = {
  errorHandler,
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  AIServiceError
};