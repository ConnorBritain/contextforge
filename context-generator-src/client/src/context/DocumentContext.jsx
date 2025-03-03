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
  
  // Error state
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
        setError('Failed to load your documents');
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
      setError('Failed to generate document. Please try again.');
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
      setError('No document to save');
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
      setError('Failed to save document');
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
      setError('Failed to load document');
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
      setError('Failed to delete document');
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
      setError('No document to export');
      return false;
    }
    
    try {
      await documentService.exportDocument(docToExport, format);
      return true;
    } catch (err) {
      console.error('Error exporting document:', err);
      setError('Failed to export document');
      return false;
    }
  };
  
  /**
   * Clear the current document and errors
   */
  const clearDocument = () => {
    setCurrentDocument(null);
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
    setErrorMessage
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