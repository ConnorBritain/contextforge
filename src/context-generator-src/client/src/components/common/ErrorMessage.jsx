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
    
    // Use SVG icons matching G2L brand style
    switch (type) {
      case 'server':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11H17.4L20.8 7.6L19.4 6.2L14.6 11H13V9.4L17.8 4.6L16.4 3.2L13 6.6V2H11V6.6L7.6 3.2L6.2 4.6L11 9.4V11H9.4L4.6 6.2L3.2 7.6L6.6 11H2V13H6.6L3.2 16.4L4.6 17.8L9.4 13H11V14.6L6.2 19.4L7.6 20.8L11 17.4V22H13V17.4L16.4 20.8L17.8 19.4L13 14.6V13H14.6L19.4 17.8L20.8 16.4L17.4 13H22V11Z" fill="#ff7d45"/>
          </svg>
        );
      case 'auth':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#75c3e8"/>
          </svg>
        );
      case 'notFound':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#75c3e8"/>
          </svg>
        );
      case 'rateLimit':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#6fe4c6"/>
            <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#6fe4c6"/>
          </svg>
        );
      case 'validation':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#92b079"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#ff7d45"/>
            <path d="M13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#ff7d45"/>
          </svg>
        );
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