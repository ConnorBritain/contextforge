/**
 * Processes raw AI-generated content into a structured document format
 */
class DocumentProcessor {
    /**
     * Process the raw AI response into a structured format
     * @param {string} rawResponse - The raw text from the AI service
     * @param {string} contextType - The type of context document
     * @returns {Object} - Structured document with sections
     */
    static processResponse(rawResponse, contextType) {
      // Basic initial processing - in a more advanced version we could parse sections, etc.
      
      // Split the content by section headers for easier display
      const sections = this._extractSections(rawResponse);
      
      return {
        type: contextType,
        rawContent: rawResponse,
        sections: sections,
        createdAt: new Date().toISOString()
      };
    }
    
    /**
     * Extract sections from the raw content
     * @param {string} content - Raw text content
     * @returns {Array} - Array of section objects
     */
    static _extractSections(content) {
      // Simple section extraction based on markdown headings
      const sectionRegex = /^#{1,3}\s+(.+)$/gm;
      const sections = [];
      let match;
      let lastIndex = 0;
      
      // Find all headings and use them as section titles
      while ((match = sectionRegex.exec(content)) !== null) {
        const title = match[1];
        const startIndex = match.index;
        
        // If this isn't the first heading, add the content from the previous heading to this one
        if (lastIndex > 0) {
          const sectionContent = content.substring(lastIndex, startIndex).trim();
          if (sections.length > 0) {
            sections[sections.length - 1].content = sectionContent;
          }
        }
        
        sections.push({
          title: title,
          content: '' // Will be filled in the next iteration or after the loop
        });
        
        lastIndex = startIndex + match[0].length;
      }
      
      // Add the content for the last section
      if (sections.length > 0) {
        sections[sections.length - 1].content = content.substring(lastIndex).trim();
      }
      
      // If no sections were found, treat the entire content as a single section
      if (sections.length === 0) {
        sections.push({
          title: 'Complete Document',
          content: content
        });
      }
      
      return sections;
    }
  }
  
  module.exports = DocumentProcessor;