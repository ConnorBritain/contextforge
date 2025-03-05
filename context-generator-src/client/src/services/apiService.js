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
      // Default server port is 5000, but it could be different if that port is busy
      this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      this.defaultHeaders = {
        'Content-Type': 'application/json'
      };
      
      // Try to detect if the server is using a different port
      this._detectServerPort();
      
      // Initialize token from localStorage if present
      this._initializeToken();
    }
    
    /**
     * Try to detect if the server is running on a different port
     */
    async _detectServerPort() {
      // Test ports in sequence starting with the default
      const testPorts = [5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009, 5010];
      let foundPort = false;
      
      for (const port of testPorts) {
        try {
          // Try to fetch server info from this port
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1000);
          
          const response = await fetch(`http://localhost:${port}/api/server-info`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            // Update baseUrl with the correct port
            this.baseUrl = `http://localhost:${data.port}/api`;
            console.log(`API Service: Connected to server at ${this.baseUrl}`);
            foundPort = true;
            break;
          }
        } catch (error) {
          // Continue trying other ports
          console.log(`API Service: Port ${port} not available, trying next...`);
        }
      }
      
      // If no port is found, retry after a delay
      if (!foundPort) {
        console.log('API Service: Could not connect to server. Will retry in 3 seconds...');
        setTimeout(() => this._detectServerPort(), 3000);
      }
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
        // Check if the response has a JSON content type
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // For non-JSON responses (like file downloads), return the raw response
          return response;
        }
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
  
  const apiServiceInstance = new ApiService();
export default apiServiceInstance;