import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentContext } from '../context/DocumentContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Page for displaying and managing saved documents
 */
const SavedDocumentsPage = () => {
  const navigate = useNavigate();
  const { 
    documents, 
    loadDocument, 
    deleteDocument, 
    isLoading, 
    error 
  } = useContext(DocumentContext);
  
  // Local state for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Handle viewing a saved document
  const handleViewDocument = async (id) => {
    await loadDocument(id);
    navigate('/document-result');
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    setDeleteConfirm(id);
  };
  
  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };
  
  // Handle document deletion
  const handleDeleteDocument = async (id) => {
    await deleteDocument(id);
    setDeleteConfirm(null);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get document type display name
  const getDocumentTypeDisplay = (type) => {
    switch (type) {
      case 'targetMarketAudience':
        return 'Target Market Audience Profile';
      case 'businessProfile':
        return 'Business Dimensional Profile';
      case 'styleGuide':
        return 'AI Style Guide';
      default:
        return 'Document';
    }
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Saved Documents</h1>
        <button 
          className="primary-button"
          onClick={() => navigate('/create')}
        >
          Create New Document
        </button>
      </div>
      
      {isLoading && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
      
      {error && <ErrorMessage message={error} />}
      
      <div className="documents-container">
        {documents.length === 0 ? (
          <div className="empty-state">
            <h2>No Saved Documents</h2>
            <p>You haven't saved any documents yet. Create your first document to get started.</p>
            <button 
              className="primary-button"
              onClick={() => navigate('/create')}
            >
              Create Document
            </button>
          </div>
        ) : (
          <div className="document-list">
            {documents.map(doc => (
              <div key={doc.id} className="document-card">
                <div className="document-card-content">
                  <h3>{doc.title || `${getDocumentTypeDisplay(doc.type)}`}</h3>
                  <p className="document-type">{getDocumentTypeDisplay(doc.type)}</p>
                  <p className="document-date">Created: {formatDate(doc.createdAt)}</p>
                </div>
                
                <div className="document-card-actions">
                  {deleteConfirm === doc.id ? (
                    <div className="delete-confirmation">
                      <p>Are you sure?</p>
                      <div className="confirmation-buttons">
                        <button 
                          className="confirm-delete-button"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          Delete
                        </button>
                        <button 
                          className="cancel-delete-button"
                          onClick={handleDeleteCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="view-button"
                        onClick={() => handleViewDocument(doc.id)}
                      >
                        View
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteConfirm(doc.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedDocumentsPage;