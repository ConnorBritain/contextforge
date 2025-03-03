import React, { createContext, useContext, useState } from 'react';

// Create context
const DocumentContext = createContext();

/**
 * Provider component for managing document state
 */
export const DocumentProvider = ({ children }) => {
  const [document, setDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Clear the current document and errors
   */
  const clearDocument = () => {
    setDocument(null);
    setError(null);
  };
  
  /**
   * Set an error message
   */
  const setErrorMessage = (message) => {
    setError(message);
  };
  
  // Context value
  const value = {
    document,
    setDocument,
    isGenerating,
    setIsGenerating,
    error,
    setErrorMessage,
    clearDocument
  };
  
  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

/**
 * Custom hook for using the document context
 */
export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

export default DocumentContext;