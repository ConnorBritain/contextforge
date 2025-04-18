import apiService from './apiService';

/**
 * Service for wizard draft operations.
 * Generation is now handled by Cloud Functions triggered via Firestore.
 */
class DocumentService {

  /**
   * Fetches all saved wizard drafts for the current user.
   * @param {object} options - Optional query parameters (e.g., pagination).
   * @returns {Promise<Array>} A promise that resolves to an array of draft objects.
   */
  async getSavedDrafts(options = {}) {
    console.log('Fetching saved drafts...');
    // Calls GET /api/wizard/list
    try {
        const response = await apiService.get('/wizard/list', options);
        // The backend returns { success: true, drafts: [...] }
        return response?.drafts || []; 
    } catch (error) {
        console.error('Error fetching saved drafts:', error);
        throw error; // Propagate error for handling in UI
    }
  }

  /**
   * Deletes a specific wizard draft using its composite ID.
   * @param {string} docId - The composite Firestore document ID (e.g., userId_wizardId).
   * @returns {Promise<object>} The response from the API.
   */
  async deleteDraft(docId) {
    if (!docId) {
        throw new Error('Document ID is required to delete a draft.');
    }
    console.log(`Requesting deletion of draft: ${docId}`);
    // Calls DELETE /api/wizard/:docId
    try {
        const response = await apiService.delete(`/wizard/${docId}`);
        // Backend returns { success: true, message: ... }
        return response; 
    } catch (error) {
        console.error(`Error deleting draft ${docId}:`, error);
        throw error; // Propagate error for handling in UI
    }
  }

  // --- Generation Initiation (Removed) ---
  // generateContextDocStream() removed as generation is triggered by Firestore create.

  // --- Deprecated / Placeholder Methods (Consider Removing) --- 

  async getUserDocuments(options = {}) {
      console.warn('getUserDocuments is deprecated, use getSavedDrafts instead.');
      return this.getSavedDrafts(options);
  }

  async getDocumentById(id) {
      console.warn('getDocumentById is deprecated. Drafts are fetched via getSavedDrafts, editing loads into wizard.');
      return Promise.resolve(null); 
  }

  async deleteDocument(id) {
      console.warn('deleteDocument is deprecated, use deleteDraft instead.');
      return this.deleteDraft(id);
  }

  async exportDocument(document, format = 'markdown') {
      console.warn('exportDocument should be handled client-side based on generated document data.');
      return Promise.reject(new Error('Export not implemented in service this way.'));
  }
  
  // --- Client-Side Helper methods for Export (can be kept) --- 
  _getFileExtension(format) {
    const extensions = { markdown: 'md', html: 'html', text: 'txt' };
    return extensions[format] || 'txt';
  }
  _getContentType(format) {
    const contentTypes = { markdown: 'text/markdown', html: 'text/html', text: 'text/plain' };
    return contentTypes[format] || 'text/plain';
  }
}

export const documentService = new DocumentService();
