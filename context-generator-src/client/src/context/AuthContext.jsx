import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../config/firebase';
import authService from '../services/authService';

// Create the auth context
const AuthContext = createContext();

/**
 * AuthProvider component for managing authentication state with Firebase
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Auth provider component
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setLoading(true);
      try {
        if (user) {
          // User is signed in
          setCurrentUser(user);
          
          // Get user profile data from Firestore if needed
          try {
            const profileData = await authService.getProfile();
            setUserProfile(profileData);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
        } else {
          // User is signed out
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError('Authentication error occurred');
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Register a new user with Firebase
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration result
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      return result;
    } catch (err) {
      setError(err.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login a user with Firebase
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Login result
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      return result;
    } catch (err) {
      setError(err.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user with Firebase
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.logout();
    } catch (err) {
      setError(err.error || 'Logout failed');
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get the current user's profile from Firestore
   * @returns {Promise} - User profile data
   */
  const getProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const profile = await authService.getProfile();
      setUserProfile(profile);
      return profile;
    } catch (err) {
      setError(err.error || 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update the current user's profile in Firestore
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Updated user data
   */
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.updateProfile(profileData);
      setUserProfile(result.user);
      return result;
    } catch (err) {
      setError(err.error || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send password reset email
   * @param {string} email - User email
   */
  const sendPasswordReset = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.sendPasswordResetEmail(email);
    } catch (err) {
      setError(err.error || 'Failed to send password reset email');
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
   * Initiate Google OAuth login with Firebase
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.loginWithGoogle();
    } catch (err) {
      setError(err.error || 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create auth context value object with combined user data
  const contextValue = {
    currentUser,
    profile: userProfile,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    getProfile,
    updateProfile,
    sendPasswordReset,
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