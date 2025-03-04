import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth endpoints are directly used in the code rather than through this variable

// Subscription endpoints
const SUBSCRIPTION_ENDPOINTS = {
  plans: '/subscriptions/plans',
  current: '/subscriptions/current',
  update: '/subscriptions/update',
  cancel: '/subscriptions/cancel'
};

/**
 * Authentication service for user registration, login, and session management
 */
const authService = {
  /**
   * Initiate Google OAuth login
   * Redirects the user to the Google authentication page
   */
  loginWithGoogle: () => {
    const googleAuthUrl = `${API_URL}/auth/google`;
    // Store the current location to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    // Redirect to Google auth page
    window.location.href = googleAuthUrl;
  },
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Response with token and user data
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Response with token and user data
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get the current user from local storage
   * @returns {Object|null} - Current user data or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get the current user's token
   * @returns {string|null} - Current user's token or null
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Check if the user is authenticated
   * @returns {boolean} - Whether the user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current user's profile
   * @returns {Promise} - Response with user profile data
   */
  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated user data
   */
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: {
          'x-auth-token': token
        }
      });
      
      // Update stored user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  /**
   * Get all available subscription plans
   * @returns {Promise} - Response with subscription plans
   */
  getSubscriptionPlans: async () => {
    try {
      const response = await axios.get(`${API_URL}${SUBSCRIPTION_ENDPOINTS.plans}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch subscription plans' };
    }
  },

  /**
   * Get user's current subscription and usage
   * @returns {Promise} - Response with subscription and usage details
   */
  getCurrentSubscription: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(`${API_URL}${SUBSCRIPTION_ENDPOINTS.current}`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch subscription details' };
    }
  },

  /**
   * Update user's subscription plan
   * @param {string} plan - The plan to upgrade/downgrade to
   * @returns {Promise} - Response with updated subscription details
   */
  updateSubscription: async (plan) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(`${API_URL}${SUBSCRIPTION_ENDPOINTS.update}`, 
        { plan },
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update subscription' };
    }
  },

  /**
   * Cancel user's subscription
   * @returns {Promise} - Response with cancellation confirmation
   */
  cancelSubscription: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(`${API_URL}${SUBSCRIPTION_ENDPOINTS.cancel}`, {}, {
        headers: {
          'x-auth-token': token
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to cancel subscription' };
    }
  }
};

export default authService;