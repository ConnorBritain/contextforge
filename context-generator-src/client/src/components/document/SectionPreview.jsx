import React, { useState } from 'react';
import '../../styles/document.css';

/**
 * Component for previewing a document section
 */
const SectionPreview = ({ section, index }) => {
  const [expanded, setExpanded] = useState(true);
  
  // Convert markdown syntax in content to HTML
  const formatContent = (content) => {
    if (!content) return '';
    
    // Replace markdown with HTML
    return content
      // Format headings
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      
      // Format bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      
      // Format unordered lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n)+/g, (match) => {
        return `<ul>${match}</ul>`;
      })
      
      // Format ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n)+/g, (match) => {
        return match.includes('" ') || match.includes('- ') 
          ? match 
          : `<ol>${match}</ol>`;
      })
      
      // Format paragraphs
      .replace(/^(?!<h|<ul|<ol|<li)(.+)$/gm, '<p>$1</p>')
      
      // Handle line breaks
      .replace(/\n\n/g, '<br/><br/>');
  };
  
  const renderContent = () => {
    const formattedContent = formatContent(section.content);
    return { __html: formattedContent };
  };
  
  // Determine the heading level based on section.level (default to h2)
  const HeadingTag = `h${Math.min(Math.max(section.level || 2, 1), 6)}`;
  
  return (
    <div className={`document-section ${expanded ? 'expanded' : 'collapsed'}`} id={section.id || `section-${index}`}>
      <div 
        className="section-header" 
        onClick={() => setExpanded(!expanded)}
      >
        <HeadingTag className="section-title">
          {section.title}
        </HeadingTag>
        <button className="toggle-section">
          {expanded ? '¼' : 'º'}
        </button>
      </div>
      
      {expanded && (
        <div className="section-content" dangerouslySetInnerHTML={renderContent()} />
      )}
    </div>
  );
};

export default SectionPreview;