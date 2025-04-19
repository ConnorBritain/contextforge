import React, { useState, useEffect } from 'react'; // Removed useContext
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Corrected import
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import DocumentPreview from '../components/document/DocumentPreview';
import { documentService } from '../services/documentService'; // For export helpers
import { toast } from 'react-hot-toast';
import '../styles/document.css'; // Reuse styles if applicable

/**
 * Page to display the real-time status and result of a document generation.
 */
const DocumentStatusPage = () => {
  const { docId } = useParams(); // Get the composite docId (userId_wizardId) from URL
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Corrected usage

  const [draftData, setDraftData] = useState(null);
  const [generationStatus, setGenerationStatus] = useState('loading'); // loading, pending, processing, complete, error
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use currentUser instead of user
    if (!docId || !currentUser) {
      // If docId or user is missing, cannot proceed
      if (!currentUser) navigate('/login'); // Redirect if user logs out
      else navigate('/saved'); // Redirect if docId is bad
      return;
    }

    // Verify the docId belongs to the current user (basic check)
    // Use currentUser.uid instead of user.uid
    if (!docId.startsWith(currentUser.uid + '_')) {
        console.error('Mismatch between user ID and document ID.');
        setErrorMessage('You do not have permission to view this document.');
        setGenerationStatus('error');
        setIsLoading(false);
        return;
    }

    const db = getFirestore();
    const docRef = doc(db, 'wizardResponses', docId);

    console.log(`Setting up listener for document: ${docId}`);
    setIsLoading(true);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Received Firestore update:', data);
          setDraftData(data); // Store the full draft data

          // Update status based on the document field
          const status = data.generationStatus || 'pending';
          setGenerationStatus(status);
          setErrorMessage(status === 'error' ? (data.error || 'An unknown generation error occurred.') : null);

          // If status indicates completion or error, stop the main loading indicator
          if (status === 'complete' || status === 'complete_with_errors' || status === 'error') {
            setIsLoading(false);
          } else {
            // Still loading if status is pending/processing
            setIsLoading(true);
          }

        } else {
          // Document doesn't exist or was deleted
          console.warn(`Document ${docId} not found.`);
          setErrorMessage('Document not found. It may have been deleted.');
          setGenerationStatus('error');
          setIsLoading(false);
        }
      },
      (error) => {
        // Error fetching/listening to the document
        console.error("Error listening to Firestore document:", error);
        setErrorMessage('Could not load document status. Please try again later.');
        setGenerationStatus('error');
        setIsLoading(false);
      }
    );

    // Cleanup function: Unsubscribe when component unmounts or dependencies change
    return () => {
      console.log(`Unsubscribing from listener for document: ${docId}`);
      unsubscribe();
    };

  }, [docId, currentUser, navigate]); // Use currentUser in dependency array

  // --- Render Helper Functions --- 

  const getStatusDisplay = () => {
      switch(generationStatus) {
          case 'loading': return <LoadingSpinner />; // Show spinner while initially loading
          case 'pending': return <p>Generation is pending...</p>;
          case 'processing': return <><LoadingSpinner size="small" /> <p>Processing document...</p></>; // Spinner + text
          case 'complete': return <h2 className="status-complete">Generation Complete!</h2>;
          case 'complete_with_errors': return <h2 className="status-warning">Generation Complete (with errors)</h2>;
          case 'error': return <ErrorMessage title="Generation Failed" message={errorMessage || 'An unknown error occurred.'} />;
          default: return <p>Loading status...</p>;
      }
  };

  const handleExport = (format) => {
    if (!draftData?.generatedDocument) {
        toast.error("Generated document content not available for export.");
        return;
    }
    try {
        const content = draftData.generatedDocument.content || ''; // Assuming content is stored here
        const blob = new Blob([content], { type: documentService._getContentType(format) });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const docType = draftData.documentType || 'generated-document';
        const wizardId = docId.split('_')[1] || 'doc';
        link.download = `${docType}-${wizardId}.${documentService._getFileExtension(format)}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success(`Document exported as ${format.toUpperCase()}`);
    } catch (err) {
        console.error("Export failed:", err);
        toast.error("Failed to export document.");
    }
}

const handleSave = () => {
    // TODO: Implement saving the generated document to a new collection or structure if needed
    // Currently, the result is stored within the wizardResponses doc itself.
    // This function might save it to a separate 'publishedDocuments' collection.
    toast.info("Save functionality (to separate collection) not implemented yet.");
}

  return (
    <div className="page-container document-status-page">
      <div className="page-header">
        {/* Display draft title or fallback */} 
        <h1>{draftData?.title || `Document Status ${docId ? '(...' + docId.slice(-6) + ')' : ''}`}</h1>
        <button className="secondary-button" onClick={() => navigate('/saved')}>Back to Drafts</button>
      </div>

      <div className="status-section">
          {getStatusDisplay()} 
      </div>

      {/* Display errors specifically from chunk processing if they exist */}
      {generationStatus === 'complete_with_errors' && draftData?.chunkErrors && (
          <div className="chunk-errors-section">
              <h3>Chunk Processing Errors:</h3>
              <ul>
                  {draftData.chunkErrors.map((err, index) => (
                      <li key={index}>Chunk {err.chunk}: {err.message}</li>
                  ))}
              </ul>
          </div>
      )}

      {/* Display the final document preview if available */} 
      {(generationStatus === 'complete' || generationStatus === 'complete_with_errors') && draftData?.generatedDocument ? (
          <div className="document-result-container">
              <div className="document-actions-header">
                <button onClick={() => handleExport('markdown')} className="secondary-button">Export MD</button>
                {/* <button onClick={handleSave} className="primary-button">Save Final</button> */}
              </div>
              <DocumentPreview document={draftData.generatedDocument} />
          </div>
      ) : (
          // Optionally show processing details or nothing while loading/pending/processing
          !errorMessage && isLoading && <p>Waiting for document details...</p>
      )}

    </div>
  );
};

export default DocumentStatusPage;
