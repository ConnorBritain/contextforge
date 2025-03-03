/**
 * Base API service for making HTTP requests
 */
class ApiService {
    constructor() {
      this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      this.defaultHeaders = {
        'Content-Type': 'application/json'
      };
    }
  
    /**
     * Set auth token for authenticated requests
     */
    setAuthToken(token) {
      if (token) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        delete this.defaultHeaders['Authorization'];
      }
    }
  
    /**
     * Make a GET request
     */
    async get(endpoint, params = {}) {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.defaultHeaders
      });
      
      return this._handleResponse(response);
    }
  
    /**
     * Make a POST request
     */
    async post(endpoint, data = {}) {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(data)
      });
      
      return this._handleResponse(response);
    }
  
    /**
     * Make a PUT request
     */
    async put(endpoint, data = {}) {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.defaultHeaders,
        body: JSON.stringify(data)
      });
      
      return this._handleResponse(response);
    }
  
    /**
     * Make a DELETE request
     */
    async delete(endpoint) {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.defaultHeaders
      });
      
      return this._handleResponse(response);
    }
  
    /**
     * Handle API response
     */
    async _handleResponse(response) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      return data;
    }
  }
  
  export default new ApiService();