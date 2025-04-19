import React, { useState, useEffect } from 'react';
// DocumentContext removed
// import { DocumentContext } from '../../context/DocumentContext';
// Removed unused import: SectionPreview
// import SectionPreview from './SectionPreview';
import DocumentControls from './DocumentControls';
import '../../styles/document.css';

/**
 * Component for previewing a generated document.
 * Editing capabilities are removed or simplified as editing now happens via the wizard.
 */
const DocumentPreview = ({ document, onExport, loading = false }) => {
  // Removed useContext(DocumentContext)
  // const { currentDocument, updateDocument } = useContext(DocumentContext);
  
  // Use local state derived from props
  const [doc, setDoc] = useState(document);
  // Editing state removed, as editing is now handled by reloading the wizard
  // const [isEditing, setIsEditing] = useState(false);
  // const [editTitle, setEditTitle] = useState('');

  // Update local doc when prop changes
  useEffect(() => {
    setDoc(document);
  }, [document]);
  
  // Section update/move handlers removed - editing happens via wizard
  // const handleSectionUpdate = (updatedSection, index) => { ... };
  // const moveSection = (index, direction) => { ... };
  // const toggleTitleEdit = () => { ... };
  
  if (loading) {
    return (
      <div className="document-preview loading">
        <div className="document-loading">
          <h2>Loading Document...</h2>
          {/* Simplified loading message */}
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Use doc directly from state, check for content instead of sections array
  if (!doc || !doc.content) { 
    return (
      <div className="document-preview empty">
        <div className="empty-state">
          <h2>No Document Content Available</h2>
          <p>The document content could not be loaded or is empty.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="document-preview">
      <div className="document-header">
         {/* Title Display - Simplified, no editing */}
         <div className="document-title-container">
            {/* Attempt to extract title from content or use fallback */}
            <h1 className="document-title">{doc.title || doc.documentType || 'Generated Document'}</h1>
         </div>
        
        {/* Metadata Display (if available) */}
        {doc.subtitle && (
          <h2 className="document-subtitle">{doc.subtitle}</h2>
        )}
        <div className="document-meta">
          <span className="document-date">
            {/* Use generatedAt or fallback */}
            Generated: {doc.generatedAt || doc.createdAt ? new Date(doc.generatedAt?.seconds * 1000 || doc.createdAt?.seconds * 1000 || Date.now()).toLocaleString() : 'N/A'}
          </span>
          <span className="document-type">{doc.type || doc.documentType}</span>
        </div>
      </div>
      
      {/* Controls might still be relevant for export */}
      <DocumentControls document={doc} onExport={onExport} />
      
      <div className="document-content">
        {/* Render the generated content directly */} 
        {/* This assumes doc.content is markdown/HTML string */}
        {/* For structured content (like sections), map over them */}
        {typeof doc.content === 'string' ? (
             <div dangerouslySetInnerHTML={{ __html: doc.content /* Or use a Markdown renderer */ }} />
         ) : (
             <p>Cannot display document content format.</p>
         )}
         
         {/* Original section mapping (if doc.sections exists) - Keep if applicable */}
         {/*
         {doc.sections?.map((section, index) => (
             <SectionPreview 
                 key={section.id || `section-${index}`}
                 section={section}
                 // Editing props removed
             />
         ))}
         */}
      </div>
      
      {/* Bottom Controls */}
      <DocumentControls document={doc} onExport={onExport} showBottom />
    </div>
  );
};

export default DocumentPreview;
