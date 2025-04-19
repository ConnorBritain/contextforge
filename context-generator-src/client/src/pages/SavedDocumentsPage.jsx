import React, { useState, useEffect, useCallback } from 'react'; // Removed useContext
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { documentService } from '../services/documentService';
import { toast } from 'react-hot-toast';
// GenerationProgressModal is likely no longer needed here, replaced by Firestore listener on dedicated page
// import GenerationProgressModal from '../components/document/GenerationProgressModal'; 
import { useAuth } from '../context/AuthContext'; // Corrected import

/**
 * Page for displaying saved wizard drafts.
 * Generation is handled by Cloud Functions, status viewed on a separate page.
 */
const SavedDocumentsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Corrected usage
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Stores the docId to confirm deletion

  // Fetch saved drafts function using useCallback
  const fetchSavedDrafts = useCallback(async () => {
    // Use currentUser
    if (!currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const drafts = await documentService.getSavedDrafts();
      // Sort drafts by updated date, newest first
      drafts.sort((a, b) => {
          const dateA = a.updatedAt?.seconds || 0;
          const dateB = b.updatedAt?.seconds || 0;
          return dateB - dateA;
      });
      setSavedDrafts(drafts || []);
    } catch (err) {
      console.error("Error fetching drafts:", err);
      const errorMsg = err.data?.message || err.message || 'Failed to fetch saved drafts';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]); // Dependency: currentUser

  // Fetch drafts on mount and when user changes
  useEffect(() => {
    // Use currentUser
    if (currentUser) {
      fetchSavedDrafts();
    } else {
      setSavedDrafts([]); // Clear drafts if user logs out
    }
  }, [currentUser, fetchSavedDrafts]); // Use currentUser

  // Handle viewing/editing a saved draft
  const handleEditDraft = (draft) => {
    if (!draft) return;
    // Navigate to the wizard page with the draft data as initial state
    navigate('/forge', { state: { initialData: draft } });
    toast.info('Loading draft into wizard...');
  };

  // Navigate to view the status/result of a draft generation
  const handleViewStatus = (docId) => {
    if (!docId) return;
    // Navigate to a new page that will listen to this specific document ID
    navigate(`/document-status/${docId}`);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (docId) => {
    setDeleteConfirm(docId);
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  // Handle draft deletion
  const handleDeleteDraft = async (docId) => {
    // Use currentUser
    if (!currentUser || !docId) return;
    console.log(`Attempting to delete draft with docId: ${docId}`);
    try {
      const response = await documentService.deleteDraft(docId);
      toast.success(response?.message || 'Draft deleted successfully');
      // Update UI by removing the deleted draft
      setSavedDrafts(prev => prev.filter(d => d.docId !== docId));
    } catch (err) {
      console.error("Error deleting draft:", err);
      const errorMsg = err.data?.message || err.message || 'Failed to delete draft.';
      toast.error(errorMsg);
      setError(errorMsg); 
    } finally {
      setDeleteConfirm(null); // Close confirmation dialog
    }
  };

  // --- Helper Functions --- 
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      if (timestamp.seconds) { // Firestore Timestamp
        const date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      } else if (!isNaN(new Date(timestamp))) { // ISO String or similar
        return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      }
    } catch (e) { console.error("Error formatting date:", e); }
    return 'Invalid Date';
  };

  const getDocumentTypeDisplay = (type) => {
    if (!type) return 'Draft';
    const result = type.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1).trim();
  };

  const getGenerationStatusDisplay = (status) => {
      switch(status) {
          case 'processing': return <span className="status-badge status-processing">Processing...</span>;
          case 'complete': return <span className="status-badge status-complete">Complete</span>;
          case 'complete_with_errors': return <span className="status-badge status-warning">Complete (with errors)</span>;
          case 'error': return <span className="status-badge status-error">Error</span>;
          default: return <span className="status-badge status-pending">Pending Generation</span>; // Draft saved, function not yet run or status not set
      }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Saved Drafts</h1>
        <button
          className="primary-button"
          onClick={() => navigate('/forge')}
        >
          Create New Draft
        </button>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}

      {error && !isLoading && <ErrorMessage message={error} />}

      <div className="documents-container">
        {!isLoading && savedDrafts.length === 0 ? (
          <div className="empty-state">
            <h2>No Saved Drafts</h2>
            <p>You haven't saved any wizard drafts yet. Create one to get started!</p>
            <button onClick={fetchSavedDrafts} className="secondary-button">Refresh</button>
          </div>
        ) : (
          <div className="document-list">
            {savedDrafts.map(draft => (
              <div key={draft.docId} className="document-card">
                <div className="document-card-content">
                  <h3>{draft.title || getDocumentTypeDisplay(draft.documentType) || `Draft ${draft.docId?.substring(0, 6)}`}</h3>
                  <p className="document-type">{getDocumentTypeDisplay(draft.documentType)}</p>
                  <p className="document-date">Saved: {formatDate(draft.updatedAt || draft.createdAt)}</p>
                  <div className="document-status">
                      Status: {getGenerationStatusDisplay(draft.generationStatus)}
                  </div>
                </div>

                <div className="document-card-actions">
                  {deleteConfirm === draft.docId ? (
                    <div className="delete-confirmation">
                      <p>Are you sure?</p>
                      <div className="confirmation-buttons">
                        <button className="confirm-delete-button" onClick={() => handleDeleteDraft(draft.docId)}>Delete</button>
                        <button className="cancel-delete-button" onClick={handleDeleteCancel}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* View Status / Result button */}
                      <button
                        className="primary-button"
                        onClick={() => handleViewStatus(draft.docId)}
                        // Disable view button until generation has started or finished
                        disabled={!draft.generationStatus || draft.generationStatus === 'pending'}
                      >
                        {draft.generationStatus === 'complete' || draft.generationStatus === 'complete_with_errors' ? 'View Result' : 'View Status'}
                      </button>
                      {/* Edit button - Allow editing anytime for now */}
                      <button
                        className="secondary-button"
                        onClick={() => handleEditDraft(draft)}
                        // disabled={draft.generationStatus === 'processing'} // Maybe disable while processing?
                      >
                        Edit Draft
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteConfirm(draft.docId)}
                        // disabled={draft.generationStatus === 'processing'} // Maybe disable while processing?
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

      {/* Modal removed - generation status/result handled on DocumentStatusPage */}

    </div>
  );
};

export default SavedDocumentsPage;
