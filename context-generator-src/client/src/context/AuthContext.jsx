import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create the auth context
const AuthContext = createContext();

/**
 * AuthProvider component for managing authentication state
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Auth provider component
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from local storage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration result
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Login result
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  /**
   * Get the current user's profile
   * @returns {Promise} - User profile data
   */
  const getProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const profile = await authService.getProfile();
      setCurrentUser(profile);
      return profile;
    } catch (err) {
      setError(err.error || 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Updated user data
   */
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.updateProfile(profileData);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.error || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if the user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  /**
   * Initiate Google OAuth login
   */
  const loginWithGoogle = () => {
    authService.loginWithGoogle();
  };

  // Create auth context value object
  const contextValue = {
    currentUser,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    getProfile,
    updateProfile,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @returns {Object} - Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;