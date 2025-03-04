import React, { useState, useRef, useEffect } from 'react';
import { markdownToHtml } from '../../utils/documentFormatter';
import '../../styles/document.css';

/**
 * Component for previewing and editing a document section
 */
const SectionPreview = ({ 
  section, 
  index, 
  onSectionUpdate = null,
  onMoveSection = null,
  isFirst = false,
  isLast = false
}) => {
  const [expanded, setExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const textareaRef = useRef(null);
  
  // Initialize edit content when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditContent(section.content || '');
      setEditTitle(section.title || '');
      
      // Focus and set cursor at end of textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          editContent.length,
          editContent.length
        );
      }
    }
  }, [isEditing, section]);
  
  // Handle toggling edit mode
  const toggleEditMode = (e) => {
    e.stopPropagation(); // Prevent toggling expansion
    if (isEditing) {
      // If exiting edit mode without saving, reset to original content
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };
  
  // Handle saving edits
  const handleSaveEdit = (e) => {
    e.stopPropagation(); // Prevent toggling expansion
    
    if (onSectionUpdate) {
      onSectionUpdate({
        ...section,
        title: editTitle,
        content: editContent
      }, index);
    }
    
    setIsEditing(false);
  };
  
  // Auto-resize textarea as content grows
  const handleTextareaChange = (e) => {
    setEditContent(e.target.value);
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  
  // Render HTML content from markdown
  const renderContent = () => {
    return { __html: markdownToHtml(section.content) };
  };
  
  // Determine the heading level based on section.level (default to h2)
  const HeadingTag = `h${Math.min(Math.max(section.level || 2, 1), 6)}`;
  
  return (
    <div className={`document-section ${expanded ? 'expanded' : 'collapsed'} ${isEditing ? 'editing' : ''}`} id={section.id || `section-${index}`}>
      <div className="section-header">
        <div 
          className="section-header-title"
          onClick={() => !isEditing && setExpanded(!expanded)}
        >
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="section-title-input"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <HeadingTag className="section-title">
              {section.title}
            </HeadingTag>
          )}
        </div>
        
        <div className="section-controls">
          {/* Edit controls */}
          {onSectionUpdate && !isEditing && (
            <button 
              className="edit-section"
              onClick={toggleEditMode}
              title="Edit section"
            >
              Edit
            </button>
          )}
          
          {/* Save/Cancel controls */}
          {isEditing && (
            <>
              <button 
                className="save-edit"
                onClick={handleSaveEdit}
                title="Save changes"
              >
                Save
              </button>
              <button 
                className="cancel-edit"
                onClick={toggleEditMode}
                title="Cancel editing"
              >
                Cancel
              </button>
            </>
          )}
          
          {/* Move controls */}
          {onMoveSection && !isEditing && (
            <div className="move-controls">
              <button 
                className="move-up"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveSection(index, 'up');
                }}
                disabled={isFirst}
                title="Move section up"
              >
                ↑
              </button>
              <button 
                className="move-down"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveSection(index, 'down');
                }}
                disabled={isLast}
                title="Move section down"
              >
                ↓
              </button>
            </div>
          )}
          
          {/* Expand/collapse control */}
          <button 
            className="toggle-section"
            onClick={() => !isEditing && setExpanded(!expanded)}
            title={expanded ? "Collapse section" : "Expand section"}
          >
            {expanded ? '−' : '+'}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="section-content">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={handleTextareaChange}
              className="section-editor"
              rows={10}
              placeholder="Enter section content using Markdown formatting..."
            />
          ) : (
            <div dangerouslySetInnerHTML={renderContent()} />
          )}
        </div>
      )}
    </div>
  );
};

export default SectionPreview;