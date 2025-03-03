import React from 'react';

/**
 * Component for displaying error messages
 */
const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <div className="error-icon"> </div>
      <div className="error-text">{message}</div>
    </div>
  );
};

export default ErrorMessage;