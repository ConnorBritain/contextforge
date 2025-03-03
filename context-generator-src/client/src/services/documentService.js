import apiService from './apiService';

/**
 * Service for document-related operations
 */
class DocumentService {
  /**
   * Generate a new document
   * @param {Object} formData - The form data from the user
   * @param {string} contextType - The type of document to generate
   * @param {string} aiProvider - The AI provider to use (default: anthropic)
   * @returns {Promise} - The generated document
   */
  async generateDocument(formData, contextType, aiProvider = 'anthropic') {
    return apiService.post('/documents/generate', {
      formData,
      contextType,
      aiProvider
    });
  }

  /**
   * Get all documents for the current user
   * @param {Object} options - Pagination options
   * @returns {Promise} - The user's documents
   */
  async getUserDocuments(options = {}) {
    const { page = 1, limit = 10 } = options;
    return apiService.get(`/documents?page=${page}&limit=${limit}`);
  }

  /**
   * Get a specific document by ID
   * @param {string} id - The document ID
   * @returns {Promise} - The document
   */
  async getDocumentById(id) {
    return apiService.get(`/documents/${id}`);
  }

  /**
   * Delete a document
   * @param {string} id - The document ID
   * @returns {Promise} - The result
   */
  async deleteDocument(id) {
    return apiService.delete(`/documents/${id}`);
  }

  /**
   * Export a document to a specific format
   * @param {Object} document - The document to export
   * @param {string} format - The format to export to (markdown, html, text)
   * @returns {Promise} - The exported document
   */
  async exportDocument(document, format = 'markdown') {
    // For saved documents with an ID
    if (document.id) {
      // Create a download link for the file
      const link = document.createElement('a');
      link.href = `${apiService.baseURL}/documents/${document.id}/export?format=${format}`;
      link.download = `${document.title || document.type}-${new Date().toISOString().split('T')[0]}.${this._getFileExtension(format)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return Promise.resolve();
    }
    
    // For unsaved documents, use the export endpoint
    return new Promise((resolve, reject) => {
      apiService.post(`/documents/export/current?format=${format}`, { document })
        .then(response => {
          // Create a blob from the response
          const blob = new Blob([response], {
            type: this._getContentType(format)
          });
          
          // Create a download link for the blob
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${document.title || document.type}-${new Date().toISOString().split('T')[0]}.${this._getFileExtension(format)}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          window.URL.revokeObjectURL(url);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  /**
   * Get the file extension for a format
   * @param {string} format - The format
   * @returns {string} - The file extension
   */
  _getFileExtension(format) {
    const extensions = {
      markdown: 'md',
      html: 'html',
      text: 'txt'
    };
    
    return extensions[format] || 'txt';
  }
  
  /**
   * Get the content type for a format
   * @param {string} format - The format
   * @returns {string} - The content type
   */
  _getContentType(format) {
    const contentTypes = {
      markdown: 'text/markdown',
      html: 'text/html',
      text: 'text/plain'
    };
    
    return contentTypes[format] || 'text/plain';
  }
}

export const documentService = new DocumentService();