/**
 * Document formatting utilities for the Context Generator application
 */

/**
 * Converts markdown to HTML for document display
 * 
 * @param {string} markdown - Markdown content to convert
 * @returns {string} - HTML content
 */
export const markdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // Convert headings
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
  // Convert paragraphs
  html = html.replace(/^\s*(\n)?(.+)/gim, function(m) {
    return /<(\/)?(h[1-3]|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
  });
    
  // Convert bold
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  
  // Convert italic
  html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
  
  // Convert unordered lists
  html = html.replace(/^\s*-\s*(.*)/gim, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul><ul>/gim, '');
  
  // Convert ordered lists
  html = html.replace(/^\s*\d+\.\s*(.*)/gim, '<ol><li>$1</li></ol>');
  html = html.replace(/<\/ol><ol>/gim, '');
  
  // Convert line breaks
  html = html.replace(/\n/gim, '<br>');
  
  return html;
};

/**
 * Formats a document for export in various formats
 * 
 * @param {object} document - Document object to format
 * @param {string} format - Format type (markdown, html, text)
 * @returns {string} - Formatted document content
 */
export const formatDocumentForExport = (document, format = 'markdown') => {
  if (!document) return '';
  
  // Create header with document info
  let content = '';
  
  switch (format) {
    case 'html':
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${document.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    h2 { color: #444; margin-top: 30px; }
    h3 { color: #555; }
    .metadata { color: #666; font-style: italic; margin-bottom: 30px; }
    .section { margin-bottom: 40px; }
  </style>
</head>
<body>
  <h1>${document.title}</h1>
  <div class="metadata">
    <p>Generated: ${new Date(document.createdAt || Date.now()).toLocaleDateString()}</p>
    <p>Document Type: ${document.documentType}</p>
  </div>`;
      
      // Add sections
      document.sections.forEach(section => {
        content += `<div class="section">
    <h2>${section.title}</h2>
    ${markdownToHtml(section.content)}
  </div>`;
      });
      
      content += `</body>
</html>`;
      break;
      
    case 'text':
      content = `${document.title.toUpperCase()}\n`;
      content += `Generated: ${new Date(document.createdAt || Date.now()).toLocaleDateString()}\n`;
      content += `Document Type: ${document.documentType}\n\n`;
      
      // Add sections
      document.sections.forEach(section => {
        content += `${section.title.toUpperCase()}\n`;
        content += `${'-'.repeat(section.title.length)}\n\n`;
        content += `${section.content}\n\n`;
      });
      break;
      
    case 'markdown':
    default:
      content = `# ${document.title}\n\n`;
      content += `*Generated: ${new Date(document.createdAt || Date.now()).toLocaleDateString()}*\n\n`;
      content += `*Document Type: ${document.documentType}*\n\n`;
      
      // Add sections
      document.sections.forEach(section => {
        content += `## ${section.title}\n\n`;
        content += `${section.content}\n\n`;
      });
      break;
  }
  
  return content;
};

/**
 * Generates a filename for document export
 * 
 * @param {object} document - Document object
 * @param {string} format - Export format (markdown, html, text)
 * @returns {string} - Filename for export
 */
export const generateExportFilename = (document, format) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedTitle = (document.title || 'document')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const extension = format === 'html' ? 'html' : 
                   format === 'text' ? 'txt' : 'md';
                   
  return `${sanitizedTitle}-${timestamp}.${extension}`;
};