import React, { useContext, useState } from 'react';
import { DocumentContext } from '../../context/DocumentContext';
import SectionPreview from './SectionPreview';
import DocumentControls from './DocumentControls';
import '../../styles/document.css';

/**
 * Component for previewing and editing a generated document
 */
const DocumentPreview = ({ document, onExport, loading = false, editable = true }) => {
  const { currentDocument, updateDocument } = useContext(DocumentContext);
  
  // Use provided document or the one from context
  const [doc, setDoc] = useState(document || currentDocument);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  
  // Update local doc when context or prop changes
  React.useEffect(() => {
    setDoc(document || currentDocument);
  }, [document, currentDocument]);
  
  // Handle section updates
  const handleSectionUpdate = (updatedSection, index) => {
    const updatedSections = [...doc.sections];
    updatedSections[index] = updatedSection;
    
    const updatedDoc = {
      ...doc,
      sections: updatedSections
    };
    
    setDoc(updatedDoc);
    
    // If we have context update function, update in context too
    if (updateDocument) {
      updateDocument(updatedDoc);
    }
  };
  
  // Handle section reordering
  const moveSection = (index, direction) => {
    if (!doc || !doc.sections) return;
    
    // Cannot move first section up or last section down
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === doc.sections.length - 1)
    ) {
      return;
    }
    
    const updatedSections = [...doc.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap sections
    [updatedSections[index], updatedSections[newIndex]] = 
      [updatedSections[newIndex], updatedSections[index]];
    
    const updatedDoc = {
      ...doc,
      sections: updatedSections
    };
    
    setDoc(updatedDoc);
    
    // If we have context update function, update in context too
    if (updateDocument) {
      updateDocument(updatedDoc);
    }
  };
  
  // Toggle document title editing
  const toggleTitleEdit = () => {
    if (isEditing) {
      // Save title
      const updatedDoc = {
        ...doc,
        title: editTitle
      };
      setDoc(updatedDoc);
      
      // If we have context update function, update in context too
      if (updateDocument) {
        updateDocument(updatedDoc);
      }
      
      setIsEditing(false);
    } else {
      setEditTitle(doc.title || '');
      setIsEditing(true);
    }
  };
  
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
        {isEditing ? (
          <div className="document-title-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="document-title-input"
            />
            <div className="title-edit-controls">
              <button onClick={toggleTitleEdit} className="save-title-button">
                Save
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                className="cancel-title-button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="document-title-container">
            <h1 className="document-title">{doc.title || doc.type}</h1>
            {editable && (
              <button 
                className="edit-title-button"
                onClick={toggleTitleEdit}
                title="Edit document title"
              >
                Edit
              </button>
            )}
          </div>
        )}
        
        {doc.metadata && doc.metadata.subtitle && (
          <h2 className="document-subtitle">{doc.metadata.subtitle}</h2>
        )}
        
        <div className="document-meta">
          <span className="document-date">
            Generated: {new Date(doc.createdAt || Date.now()).toLocaleString()}
          </span>
          <span className="document-type">{doc.type || doc.documentType}</span>
        </div>
      </div>
      
      <DocumentControls document={doc} onExport={onExport} />
      
      <div className="document-content">
        {doc.sections.map((section, index) => (
          <SectionPreview 
            key={section.id || `section-${index}`}
            section={section}
            index={index}
            onSectionUpdate={editable ? handleSectionUpdate : null}
            onMoveSection={editable ? moveSection : null}
            isFirst={index === 0}
            isLast={index === doc.sections.length - 1}
          />
        ))}
      </div>
      
      <DocumentControls document={doc} onExport={onExport} showBottom />
    </div>
  );
};

export default DocumentPreview;