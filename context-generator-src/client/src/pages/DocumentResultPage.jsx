import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentContext } from '../context/DocumentContext';
import DocumentPreview from '../components/document/DocumentPreview';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Page for displaying the generated document result
 */
const DocumentResultPage = () => {
  const navigate = useNavigate();
  const { 
    currentDocument, 
    saveDocument, 
    clearDocument, 
    exportDocument,
    isLoading,
    error 
  } = useContext(DocumentContext);
  
  // State for export format
  const [exportFormat, setExportFormat] = useState('markdown');
  
  // State for save status
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Handler for exporting document
  const handleExport = async (format) => {
    await exportDocument(currentDocument, format || exportFormat);
  };
  
  // Handler for saving document
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const result = await saveDocument(currentDocument);
      if (result) {
        setSaveMessage('Document saved successfully!');
      }
    } catch (err) {
      setSaveMessage('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handler for starting over
  const handleStartOver = () => {
    clearDocument();
    navigate('/');
  };
  
  // If no document is available, redirect to home
  if (!currentDocument) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>No Document Generated</h2>
          <p>Please complete the form wizard to generate a document.</p>
          <button 
            className="primary-button"
            onClick={() => navigate('/')}
          >
            Go to Form
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      {isLoading && (
        <div className="loading-overlay">
          <LoadingSpinner />
          <div className="loading-message">
            {isSaving ? 'Saving your document...' : 'Loading...'}
          </div>
        </div>
      )}
      
      {error && <ErrorMessage message={error} />}
      {saveMessage && (
        <div className="save-message-banner">
          {saveMessage}
        </div>
      )}
      
      <div className="document-result-header">
        <h1>Your Generated Document</h1>
        
        <div className="document-actions">
          <div className="export-controls">
            <select 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="export-format-select"
            >
              <option value="markdown">Markdown (.md)</option>
              <option value="html">HTML (.html)</option>
              <option value="text">Plain Text (.txt)</option>
            </select>
            
            <button 
              className="export-button"
              onClick={() => handleExport()}
            >
              Export
            </button>
          </div>
          
          <div className="main-actions">
            <button 
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Document'}
            </button>
            
            <button 
              className="secondary-button"
              onClick={handleStartOver}
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
      
      <div className="document-result-container">
        <DocumentPreview 
          document={currentDocument}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default DocumentResultPage;