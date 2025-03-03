/**
 * Document export functionality for various formats
 */
class DocumentExporter {
  /**
   * Convert document to markdown format
   * @param {Object} document - The document object with sections
   * @returns {string} - Markdown formatted document
   */
  static toMarkdown(document) {
    let markdown = `# ${document.title || document.type}\n\n`;
    
    // Add metadata if available
    if (document.metadata && (document.metadata.subtitle || document.metadata.author)) {
      if (document.metadata.subtitle) {
        markdown += `## ${document.metadata.subtitle}\n\n`;
      }
      
      if (document.metadata.author) {
        markdown += `*Author: ${document.metadata.author}*\n\n`;
      }
      
      if (document.metadata.creationDate) {
        markdown += `*Created: ${document.metadata.creationDate}*\n\n`;
      }
      
      markdown += '---\n\n';
    }
    
    // Add each section
    document.sections.forEach(section => {
      const headingLevel = '#'.repeat(section.level || 2);
      markdown += `${headingLevel} ${section.title}\n\n${section.content}\n\n`;
    });
    
    return markdown;
  }
  
  /**
   * Convert document to HTML format
   * @param {Object} document - The document object with sections
   * @returns {string} - HTML formatted document
   */
  static toHTML(document) {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${document.title || document.type}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
    h2 {
      color: #3498db;
      margin-top: 30px;
    }
    h3 {
      color: #2980b9;
    }
    ul, ol {
      padding-left: 20px;
    }
    .metadata {
      color: #7f8c8d;
      font-style: italic;
      margin-bottom: 30px;
    }
    .section {
      margin-bottom: 30px;
    }
    hr {
      border: none;
      border-top: 1px solid #eee;
      margin: 30px 0;
    }
    .content {
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h1>${document.title || document.type}</h1>`;
    
    // Add metadata if available
    if (document.metadata && (document.metadata.subtitle || document.metadata.author)) {
      html += `\n  <div class="metadata">`;
      
      if (document.metadata.subtitle) {
        html += `\n    <h2>${document.metadata.subtitle}</h2>`;
      }
      
      if (document.metadata.author) {
        html += `\n    <p>Author: ${document.metadata.author}</p>`;
      }
      
      if (document.metadata.creationDate) {
        html += `\n    <p>Created: ${document.metadata.creationDate}</p>`;
      }
      
      html += `\n  </div>\n  <hr>`;
    }
    
    // Add each section
    document.sections.forEach(section => {
      const headingLevel = Math.min(section.level || 2, 6);
      const formattedContent = this._formatHTMLContent(section.content);
      
      html += `\n  <div class="section">
    <h${headingLevel}>${section.title}</h${headingLevel}>
    <div class="content">${formattedContent}</div>
  </div>`;
    });
    
    html += `\n</body>
</html>`;
    
    return html;
  }
  
  /**
   * Convert document to plain text format
   * @param {Object} document - The document object with sections
   * @returns {string} - Plain text formatted document
   */
  static toPlainText(document) {
    let text = `${document.title || document.type.toUpperCase()}\n\n`;
    
    // Add metadata if available
    if (document.metadata && (document.metadata.subtitle || document.metadata.author)) {
      if (document.metadata.subtitle) {
        text += `${document.metadata.subtitle}\n\n`;
      }
      
      if (document.metadata.author) {
        text += `Author: ${document.metadata.author}\n`;
      }
      
      if (document.metadata.creationDate) {
        text += `Created: ${document.metadata.creationDate}\n`;
      }
      
      text += '\n' + '-'.repeat(40) + '\n\n';
    }
    
    // Add each section
    document.sections.forEach(section => {
      // Use uppercase for heading and add underline
      text += `${section.title.toUpperCase()}\n${'-'.repeat(section.title.length)}\n\n`;
      text += `${section.content}\n\n`;
    });
    
    return text;
  }
  
  /**
   * Format markdown content to HTML
   * @param {string} content - Markdown content
   * @returns {string} - HTML formatted content
   */
  static _formatHTMLContent(content) {
    // Basic formatting for markdown to HTML
    return content
      // Format bold text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Format italic text
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Format bullet lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n)+/g, '<ul>$&</ul>')
      // Format numbered lists
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n)+/g, match => {
        return match.includes('• ') || match.includes('- ') 
          ? match 
          : '<ol>' + match + '</ol>';
      })
      // Format paragraphs
      .replace(/^(?!<[uo]l>|<\/[uo]l>|<li>)(.+)$/gm, '<p>$1</p>')
      // Handle line breaks properly
      .replace(/\n/g, '');
  }
  
  /**
   * Get file extension based on format type
   * @param {string} format - Export format
   * @returns {string} - File extension
   */
  static getFileExtension(format) {
    const extensions = {
      markdown: 'md',
      html: 'html',
      text: 'txt',
      pdf: 'pdf'
    };
    
    return extensions[format] || 'txt';
  }
}

module.exports = DocumentExporter;