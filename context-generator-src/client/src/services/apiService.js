/**
 * Custom API error class with detailed information
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Base API service for making HTTP requests
 */
class ApiService {
    constructor() {
      this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      this.defaultHeaders = {
        'Content-Type': 'application/json'
      };
      
      // Initialize token from localStorage if present
      this._initializeToken();
    }
    
    /**
     * Initialize token from localStorage if available
     */
    _initializeToken() {
      const token = localStorage.getItem('token');
      if (token) {
        this.setAuthToken(token);
      }
    }
  
    /**
     * Set auth token for authenticated requests
     */
    setAuthToken(token) {
      if (token) {
        this.defaultHeaders['x-auth-token'] = token;
      } else {
        delete this.defaultHeaders['x-auth-token'];
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
     * Handle API response with improved error handling
     */
    async _handleResponse(response) {
      let data;

      try {
        data = await response.json();
      } catch (error) {
        // In case response is not valid JSON
        throw new ApiError(
          'Invalid response from server', 
          response.status,
          { url: response.url }
        );
      }
      
      if (!response.ok) {
        // Determine error type based on status code
        switch (response.status) {
          case 400: // Bad Request
            throw new ApiError(
              data.error?.message || 'Bad request - Invalid input', 
              400, 
              data.error
            );
          case 401: // Unauthorized
            // Clear token on auth errors
            localStorage.removeItem('token');
            this.setAuthToken(null);
            throw new ApiError(
              data.error?.message || 'Authentication required', 
              401, 
              data.error
            );
          case 403: // Forbidden
            throw new ApiError(
              data.error?.message || 'Access denied', 
              403, 
              data.error
            );
          case 404: // Not Found
            throw new ApiError(
              data.error?.message || 'Resource not found', 
              404, 
              data.error
            );
          case 429: // Rate Limited
            throw new ApiError(
              data.error?.message || 'Too many requests - please try again later', 
              429, 
              data.error
            );
          case 500: // Server Error
          default:
            throw new ApiError(
              data.error?.message || 'Server error - please try again later', 
              response.status, 
              data.error
            );
        }
      }
      
      return data;
    }
  }
  
  export default new ApiService();