import React, { useState } from 'react';
import { documentService } from '../../services/documentService';
import '../../styles/document.css';

/**
 * Component for document control actions like exporting, printing, etc.
 */
const DocumentControls = ({ document, onExport, showBottom = false }) => {
  const [exportFormat, setExportFormat] = useState('markdown');
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    if (!document || isExporting) return;
    
    setIsExporting(true);
    
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
      alert('Failed to export document. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleExpandAll = () => {
    // Find all collapsed sections and click them
    document.querySelectorAll('.document-section.collapsed .section-header')
      .forEach(header => header.click());
  };
  
  const handleCollapseAll = () => {
    // Find all expanded sections and click them
    document.querySelectorAll('.document-section.expanded .section-header')
      .forEach(header => header.click());
  };
  
  return (
    <div className={`document-controls ${showBottom ? 'bottom' : 'top'}`}>
      <div className="control-group export-controls">
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
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </button>
      </div>
      
      <div className="control-group view-controls">
        <button className="print-button" onClick={handlePrint}>
          Print
        </button>
        
        <button className="expand-all-button" onClick={handleExpandAll}>
          Expand All
        </button>
        
        <button className="collapse-all-button" onClick={handleCollapseAll}>
          Collapse All
        </button>
      </div>
    </div>
  );
};

export default DocumentControls;