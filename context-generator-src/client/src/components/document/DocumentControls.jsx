import React, { useState, useRef } from 'react';
import { documentService } from '../../services/documentService';
import '../../styles/document.css';

/**
 * Component for document control actions like exporting, printing, etc.
 */
const DocumentControls = ({ document, onExport, showBottom = false }) => {
  const [exportFormat, setExportFormat] = useState('markdown');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const errorTimeoutRef = useRef(null);
  
  // Clear error after 5 seconds
  const clearErrorAfterDelay = () => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
    }, 5000);
  };
  
  const handleExport = async () => {
    if (!document || isExporting) return;
    
    setIsExporting(true);
    setError(null);
    
    try {
      // If custom export handler provided, use it
      if (onExport) {
        await onExport(document, exportFormat);
      } else {
        // Otherwise use the document service
        await documentService.exportDocument(document, exportFormat);
      }
    } catch (error) {
      console.error('Error exporting document:', error);
      setError('Export failed. Please try again.');
      clearErrorAfterDelay();
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleExpandAll = () => {
    // Use React refs to avoid direct DOM manipulation in future refactoring
    const sections = document.querySelectorAll('.document-section.collapsed .section-header');
    sections.forEach(header => header.click());
  };
  
  const handleCollapseAll = () => {
    const sections = document.querySelectorAll('.document-section.expanded .section-header');
    sections.forEach(header => header.click());
  };
  
  return (
    <div className={`document-controls ${showBottom ? 'bottom' : 'top'}`}>
      <div className="control-group export-controls">
        <select 
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="export-format-select"
          disabled={isExporting}
        >
          <option value="markdown">Markdown (.md)</option>
          <option value="html">HTML (.html)</option>
          <option value="text">Plain Text (.txt)</option>
          <option value="pdf">PDF Document (.pdf)</option>
        </select>
        
        <button 
          className="export-button"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </button>
        
        {error && (
          <div className="error-tooltip">
            {error}
          </div>
        )}
      </div>
      
      <div className="control-group view-controls">
        <button 
          className="print-button" 
          onClick={handlePrint}
          disabled={isExporting}
        >
          Print
        </button>
        
        <button 
          className="expand-all-button" 
          onClick={handleExpandAll}
          disabled={isExporting}
        >
          Expand All
        </button>
        
        <button 
          className="collapse-all-button" 
          onClick={handleCollapseAll}
          disabled={isExporting}
        >
          Collapse All
        </button>
      </div>
    </div>
  );
};

export default DocumentControls;