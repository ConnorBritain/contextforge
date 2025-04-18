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
 * Base API service for making HTTP requests and handling SSE
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
          // console.log(`API Service: Port ${port} not available, trying next...`); // Reduce noise
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
        // Also store token for potential use in EventSource URL
        this.authToken = token; 
      } else {
        delete this.defaultHeaders['x-auth-token'];
        this.authToken = null;
      }
      // Ensure token is persisted to localStorage as well
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
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
     * Save wizard data to the backend
     * @param {object} wizardData - The complete wizard data payload.
     * @returns {Promise<object>} The response from the server.
     */
    async saveWizardData(wizardData) {
      this._initializeToken(); 
      return this.post('/wizard', wizardData);
    }

    /**
     * Initiates document generation via SSE.
     * @param {string} wizardId - The ID of the wizard data to generate from.
     * @returns {EventSource} An EventSource instance connected to the generation endpoint.
     * @throws {Error} If authentication token is missing.
     */
    generateDocumentStream(wizardId) {
        this._initializeToken(); // Ensure token is fresh
        if (!this.authToken) {
            throw new Error('Authentication token is required for document generation.');
        }

        // Construct the URL for the EventSource
        // Note: EventSource doesn't easily support custom headers like 'x-auth-token'.
        // A common workaround is to pass the token as a query parameter (requires server-side handling).
        // Alternatively, the POST request could initiate the process and return a unique ID 
        // for an EventSource connection that is then authorized via session/cookie or the ID itself.
        // For simplicity here, we assume the POST request sets up the context and 
        // the EventSource connection might rely on existing session/cookie auth or 
        // the server needs modification to accept token via query param.
        
        // Let's try initiating with POST first to ensure the server knows which wizardId to process,
        // and then maybe open the SSE connection? Or redesign server to accept wizardId in SSE setup?
        // For now, sticking to the plan: POST request triggers SSE stream.
        // We need a way to start the SSE stream *after* the POST is accepted.
        
        // Simplest approach for now: Use POST to *request* generation, and server handles the SSE stream.
        // Let's adapt the method signature. It should POST the request and the component handles the stream.

        // Let's redefine: This service will initiate the POST request. The component will handle the EventSource.
        // This seems cleaner.

        // --- Revised Approach --- 
        // Method to *initiate* generation, assumes the component will set up EventSource separately.
        // However, the prompt asks the *route* to handle fetching, chunking, and streaming.
        // So, the EventSource connection *must* be to the POST endpoint, which is non-standard.
        // Let's stick to the less standard but direct approach: EventSource to the POST endpoint.
        // This requires the server to handle POST requests as SSE initiators.
        // EventSource API standardly uses GET. A workaround involves using fetch with ReadableStream, 
        // or a library that wraps EventSource to allow POST.

        // --- Let's use a library or fetch for more control --- 
        // Using fetch to handle the SSE stream initiated by a POST request.
        // This function will return the ReadableStream body. 
        
        // --- Reverting to standard EventSource with GET --- 
        // Modify server: POST /api/generate/request -> returns { generationId } 
        // GET /api/generate/stream/{generationId} -> returns SSE stream 
        // This is more standard but requires more server changes.

        // --- Sticking to the prompt's implied flow: POST triggers SSE --- 
        // We'll use fetch API directly to handle the streaming response from the POST endpoint.
        // This method will return the fetch Response object, allowing the caller to process the stream.
        console.log(`Initiating generation stream for wizard ID: ${wizardId}`);
        const url = `${this.baseUrl}/generate/context-doc`;
        const headers = { ...this.defaultHeaders }; // Include auth token

        // Return the promise for the fetch response
        return fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ wizardId: wizardId }),
            // Keepalive might be useful for long processes, but not standard for fetch request itself
            // The connection for SSE is managed differently by the browser/server.
        });
        // The calling component will need to handle response.body (ReadableStream).
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
      // If response is stream (like from SSE fetch), return it directly
      if (response.headers.get('content-type') && response.headers.get('content-type').includes('text/event-stream')) {
          if (!response.ok) {
              // Try to read error from stream or response status
              throw new ApiError(
                  `Failed to connect to stream: ${response.statusText}`,
                  response.status
              );
          }
          return response; // Return the raw response for stream handling
      }

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
            throw new ApiError(data.message || 'Bad request - Invalid input', 400, data);
          case 401: // Unauthorized
            this.setAuthToken(null); 
            window.dispatchEvent(new Event('auth-error'));
            throw new ApiError(data.message || 'Authentication required', 401, data);
          case 403: // Forbidden
            throw new ApiError(data.message || 'Access denied', 403, data);
          case 404: // Not Found
            throw new ApiError(data.message || 'Resource not found', 404, data);
          case 429: // Rate Limited
            throw new ApiError(data.message || 'Too many requests - please try again later', 429, data);
          case 500: // Server Error
          default:
            throw new ApiError(data.message || 'Server error - please try again later', response.status, data);
        }
      }
      
      return data;
    }
  }
  
  const apiServiceInstance = new ApiService();
export default apiServiceInstance;
