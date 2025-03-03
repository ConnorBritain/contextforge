import React, { createContext, useContext, useState, useEffect } from 'react';
import { documentService } from '../services/documentService';

// Create context
export const DocumentContext = createContext();

/**
 * Provider component for managing document state
 */
export const DocumentProvider = ({ children }) => {
  // State for current document being viewed/edited
  const [currentDocument, setCurrentDocument] = useState(null);
  
  // State for all user documents
  const [documents, setDocuments] = useState([]);
  
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Error state - now stores more detailed error information
  const [error, setError] = useState(null);
  
  // Initialize - load user documents if authenticated
  useEffect(() => {
    const loadUserDocuments = async () => {
      try {
        // Check if user is authenticated (simplified for now)
        const isAuthenticated = localStorage.getItem('authToken');
        
        if (isAuthenticated) {
          setIsLoading(true);
          const userDocs = await documentService.getUserDocuments();
          setDocuments(userDocs);
        }
      } catch (err) {
        console.error('Error loading documents:', err);
        setError({
          message: 'Failed to load your documents',
          error: err
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserDocuments();
  }, []);
  
  /**
   * Generate a new document
   * @param {Object} formData - User input data
   * @param {string} contextType - Document type
   */
  const generateDocument = async (formData, contextType) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const newDocument = await documentService.generateDocument(formData, contextType);
      setCurrentDocument(newDocument);
      return newDocument;
    } catch (err) {
      console.error('Error generating document:', err);
      setError({
        message: 'Failed to generate document. Please try again.',
        error: err,
        canRetry: true
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  /**
   * Save current document
   */
  const saveDocument = async () => {
    if (!currentDocument) {
      setError({
        message: 'No document to save',
        error: new Error('No document available')
      });
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const savedDoc = await documentService.saveDocument(currentDocument);
      
      // Update documents list
      setDocuments(prevDocs => {
        const existingIndex = prevDocs.findIndex(d => d.id === savedDoc.id);
        if (existingIndex >= 0) {
          const newDocs = [...prevDocs];
          newDocs[existingIndex] = savedDoc;
          return newDocs;
        } else {
          return [...prevDocs, savedDoc];
        }
      });
      
      setCurrentDocument(savedDoc);
      return savedDoc;
    } catch (err) {
      console.error('Error saving document:', err);
      setError({
        message: 'Failed to save document',
        error: err,
        canRetry: true
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load document by ID
   * @param {string} id - Document ID
   */
  const loadDocument = async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const doc = await documentService.getDocumentById(id);
      setCurrentDocument(doc);
      return doc;
    } catch (err) {
      console.error('Error loading document:', err);
      setError({
        message: 'Failed to load document',
        error: err,
        canRetry: true
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete document by ID
   * @param {string} id - Document ID
   */
  const deleteDocument = async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await documentService.deleteDocument(id);
      
      // Remove from documents list
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
      
      // Clear current document if it was deleted
      if (currentDocument && currentDocument.id === id) {
        clearDocument();
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      setError({
        message: 'Failed to delete document',
        error: err
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Export document in specified format
   * @param {Object} document - Document to export
   * @param {string} format - Export format
   */
  const exportDocument = async (document, format = 'markdown') => {
    const docToExport = document || currentDocument;
    
    if (!docToExport) {
      setError({
        message: 'No document to export',
        error: new Error('No document available')
      });
      return false;
    }
    
    try {
      await documentService.exportDocument(docToExport, format);
      return true;
    } catch (err) {
      console.error('Error exporting document:', err);
      setError({
        message: 'Failed to export document',
        error: err,
        canRetry: true
      });
      return false;
    }
  };
  
  /**
   * Retry the last failed operation
   */
  const retryOperation = () => {
    // Clear the error first
    setError(null);
    
    // The component using this context should implement the retry logic
    // based on the operation that failed
    return true;
  };
  
  /**
   * Clear the current document and errors
   */
  const clearDocument = () => {
    setCurrentDocument(null);
    setError(null);
  };
  
  /**
   * Set an error message with additional details
   */
  const setErrorMessage = (message, errorObj = null, canRetry = false) => {
    setError({
      message,
      error: errorObj || new Error(message),
      canRetry
    });
  };
  
  // Context value
  const value = {
    currentDocument,
    setCurrentDocument,
    documents,
    setDocuments,
    isGenerating,
    isLoading,
    error,
    generateDocument,
    saveDocument,
    loadDocument,
    deleteDocument,
    exportDocument,
    clearDocument,
    setErrorMessage,
    retryOperation
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