import React from 'react';

/**
 * Enhanced component for displaying error messages with retry functionality
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Object} props.error - Error object with additional details
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 * @param {boolean} props.canRetry - Whether the error can be retried
 */
const ErrorMessage = ({ message, error, onRetry, canRetry = false }) => {
  // Determine error type for styling/messaging
  const getErrorType = () => {
    if (!error) return 'generic';
    
    if (error.status >= 500) return 'server';
    if (error.status === 401 || error.status === 403) return 'auth';
    if (error.status === 404) return 'notFound';
    if (error.status === 429) return 'rateLimit';
    if (error.status === 400) return 'validation';
    
    return 'generic';
  };
  
  // Get icon based on error type
  const getIcon = () => {
    const type = getErrorType();
    
    switch (type) {
      case 'server':
        return '🔧';
      case 'auth':
        return '🔒';
      case 'notFound':
        return '🔍';
      case 'rateLimit':
        return '⏱️';
      case 'validation':
        return '⚠️';
      default:
        return '❌';
    }
  };
  
  // Get a user-friendly message
  const getDisplayMessage = () => {
    if (message) return message;
    
    const type = getErrorType();
    
    switch (type) {
      case 'server':
        return 'Server error occurred. Please try again later.';
      case 'auth':
        return 'Authentication error. Please sign in again.';
      case 'notFound':
        return 'The requested resource was not found.';
      case 'rateLimit':
        return 'Too many requests. Please try again later.';
      case 'validation':
        return 'Please check your input and try again.';
      default:
        return 'An unexpected error occurred.';
    }
  };
  
  return (
    <div className={`error-message error-type-${getErrorType()}`}>
      <div className="error-content">
        <div className="error-icon">{getIcon()}</div>
        <div className="error-text">
          <div className="error-title">{getDisplayMessage()}</div>
          {error && error.data && error.data.details && (
            <div className="error-details">
              {typeof error.data.details === 'string' 
                ? error.data.details 
                : JSON.stringify(error.data.details)}
            </div>
          )}
        </div>
      </div>
      
      {canRetry && onRetry && (
        <button 
          className="error-retry-button" 
          onClick={onRetry}
          aria-label="Retry operation"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;