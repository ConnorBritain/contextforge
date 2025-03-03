import React, { useContext } from 'react';
import { DocumentContext } from '../../context/DocumentContext';
import SectionPreview from './SectionPreview';
import DocumentControls from './DocumentControls';
import '../../styles/document.css';

/**
 * Component for previewing a generated document
 */
const DocumentPreview = ({ document, onExport, loading = false }) => {
  const { currentDocument } = useContext(DocumentContext);
  
  // Use provided document or the one from context
  const doc = document || currentDocument;
  
  if (loading) {
    return (
      <div className="document-preview loading">
        <div className="document-loading">
          <h2>Generating your document...</h2>
          <p>This may take a moment as we craft a comprehensive document.</p>
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!doc || !doc.sections || doc.sections.length === 0) {
    return (
      <div className="document-preview empty">
        <div className="empty-state">
          <h2>No Document Generated Yet</h2>
          <p>Complete the form to generate your document.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="document-preview">
      <div className="document-header">
        <h1 className="document-title">{doc.title || doc.type}</h1>
        {doc.metadata && doc.metadata.subtitle && (
          <h2 className="document-subtitle">{doc.metadata.subtitle}</h2>
        )}
        
        <div className="document-meta">
          <span className="document-date">Generated: {new Date(doc.createdAt).toLocaleString()}</span>
          <span className="document-type">{doc.type}</span>
        </div>
      </div>
      
      <DocumentControls document={doc} onExport={onExport} />
      
      <div className="document-content">
        {doc.sections.map((section, index) => (
          <SectionPreview 
            key={section.id || `section-${index}`}
            section={section}
            index={index}
          />
        ))}
      </div>
      
      <DocumentControls document={doc} onExport={onExport} showBottom />
    </div>
  );
};

export default DocumentPreview;