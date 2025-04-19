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
      // Normalize the raw response
      const normalizedResponse = this._normalizeText(rawResponse);
      
      // Extract metadata from document
      const metadata = this._extractMetadata(normalizedResponse);
      
      // Split the content by section headers for easier display
      const sections = this._extractSections(normalizedResponse);
      
      // Process each section to enhance formatting
      const processedSections = sections.map(section => ({
        ...section,
        content: this._enhanceFormatting(section.content)
      }));
      
      return {
        type: contextType,
        title: metadata.title || `${contextType.charAt(0).toUpperCase() + contextType.slice(1)} Document`,
        rawContent: rawResponse,
        sections: processedSections,
        metadata: metadata,
        createdAt: new Date().toISOString()
      };
    }
    
    /**
     * Normalize text to handle inconsistent line breaks and whitespace
     * @param {string} text - Raw text content
     * @returns {string} - Normalized text
     */
    static _normalizeText(text) {
      return text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }
    
    /**
     * Extract metadata from document content
     * @param {string} content - Document content
     * @returns {Object} - Extracted metadata
     */
    static _extractMetadata(content) {
      const metadata = {
        title: null,
        subtitle: null,
        author: null,
        creationDate: null
      };
      
      // Try to extract document title from first heading
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        metadata.title = titleMatch[1].trim();
      }
      
      // Look for subtitle in second heading
      const subtitleMatch = content.match(/^##\s+(.+)$/m);
      if (subtitleMatch) {
        metadata.subtitle = subtitleMatch[1].trim();
      }
      
      return metadata;
    }
    
    /**
     * Extract sections from the raw content
     * @param {string} content - Raw text content
     * @returns {Array} - Array of section objects
     */
    static _extractSections(content) {
      // Enhanced section extraction to handle different heading levels
      const sectionRegex = /^(#{1,3})\s+(.+)$/gm;
      const sections = [];
      let matches = [];
      let match;
      
      // Collect all heading matches with their level, title and position
      while ((match = sectionRegex.exec(content)) !== null) {
        const level = match[1].length;
        const title = match[2].trim();
        matches.push({
          level,
          title,
          startIndex: match.index,
          endIndex: match.index + match[0].length
        });
      }
      
      // Process matches to create a hierarchical section structure
      for (let i = 0; i < matches.length; i++) {
        const currentMatch = matches[i];
        const nextMatch = matches[i + 1];
        
        const sectionContent = nextMatch 
          ? content.substring(currentMatch.endIndex, nextMatch.startIndex).trim()
          : content.substring(currentMatch.endIndex).trim();
        
        sections.push({
          title: currentMatch.title,
          level: currentMatch.level,
          content: sectionContent,
          id: `section-${i}`,
          position: i
        });
      }
      
      // If no sections were found, treat the entire content as a single section
      if (sections.length === 0) {
        sections.push({
          title: 'Complete Document',
          level: 1,
          content: content,
          id: 'section-0',
          position: 0
        });
      }
      
      return sections;
    }
    
    /**
     * Enhance formatting of section content
     * @param {string} content - Section content
     * @returns {string} - Enhanced formatted content
     */
    static _enhanceFormatting(content) {
      let enhancedContent = content;
      
      // Identify and format bullet point lists
      enhancedContent = this._formatBulletLists(enhancedContent);
      
      // Identify and format numbered lists
      enhancedContent = this._formatNumberedLists(enhancedContent);
      
      // Enhance paragraph breaks for readability
      enhancedContent = this._formatParagraphs(enhancedContent);
      
      // Apply emphasis formatting (bold, italics)
      enhancedContent = this._formatEmphasis(enhancedContent);
      
      return enhancedContent;
    }
    
    /**
     * Format bullet point lists
     * @param {string} content - Section content
     * @returns {string} - Formatted content with properly structured bullet lists
     */
    static _formatBulletLists(content) {
      // Match different styles of bullet lists and standardize them
      return content
        .replace(/^[ \t]*[-•⦿⚫][ \t]+(.+)$/gm, '- $1')
        .replace(/^[ \t]*\*[ \t]+(.+)$/gm, '- $1');
    }
    
    /**
     * Format numbered lists
     * @param {string} content - Section content
     * @returns {string} - Formatted content with properly structured numbered lists
     */
    static _formatNumberedLists(content) {
      // Standardize numbered lists
      return content.replace(/^[ \t]*(\d+)[.)]+[ \t]+(.+)$/gm, '$1. $2');
    }
    
    /**
     * Format paragraphs for better readability
     * @param {string} content - Section content
     * @returns {string} - Formatted content with proper paragraph spacing
     */
    static _formatParagraphs(content) {
      // Ensure paragraphs are properly separated
      return content
        .replace(/\n{3,}/g, '\n\n')
        .replace(/([^-\n])\n([^\n-])/g, '$1\n\n$2');
    }
    
    /**
     * Format text emphasis (bold, italics)
     * @param {string} content - Section content
     * @returns {string} - Formatted content with standardized emphasis
     */
    static _formatEmphasis(content) {
      // Ensure consistent styling for bold and italic text
      return content
        .replace(/\*\*([^*]+)\*\*/g, '**$1**')  // Bold with **
        .replace(/__([^_]+)__/g, '**$1**')      // Convert underscores to asterisks for bold
        .replace(/\*([^*]+)\*/g, '*$1*')        // Italic with *
        .replace(/_([^_]+)_/g, '*$1*');         // Convert underscores to asterisks for italic
    }
  }
  
  module.exports = DocumentProcessor;