import apiService from './apiService';

/**
 * Service for context document-related operations
 */
class ContextService {
  /**
   * Generate a new context document
   * @param {Object} formData - The form data from the user
   * @returns {Promise} - The generated context
   */
  async generateContext(formData) {
    return apiService.post('/contexts/generate', formData);
  }

  /**
   * Get all contexts for the current user
   * In a more complete implementation, this would include pagination
   */
  async getContexts() {
    return apiService.get('/contexts');
  }

  /**
   * Get a specific context by ID
   */
  async getContextById(id) {
    return apiService.get(`/contexts/${id}`);
  }

  /**
   * Save a generated context
   */
  async saveContext(context) {
    return apiService.post('/contexts', context);
  }

  /**
   * Update an existing context
   */
  async updateContext(id, updates) {
    return apiService.put(`/contexts/${id}`, updates);
  }

  /**
   * Delete a context
   */
  async deleteContext(id) {
    return apiService.delete(`/contexts/${id}`);
  }
}

export default new ContextService();