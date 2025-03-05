import axios from 'axios';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Subscription endpoints
const SUBSCRIPTION_ENDPOINTS = {
  plans: '/subscriptions/plans',
  current: '/subscriptions/current',
  update: '/subscriptions/update',
  cancel: '/subscriptions/cancel'
};

/**
 * Authentication service for user registration, login, and session management
 * Now using Firebase Authentication
 */
const authService = {
  /**
   * Set up auth state listener
   * @param {Function} callback - Function to call when auth state changes
   * @returns {Function} - Unsubscribe function
   */
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Initiate Google OAuth login with Firebase
   */
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      
      // Check if it's a new user and create firestore doc if needed
      await authService.createUserProfileIfNeeded(user);
      
      return { user, token };
    } catch (error) {
      throw { error: error.message || 'Google login failed' };
    }
  },

  /**
   * Register a new user with Firebase
   * @param {Object} userData - User registration data
   * @returns {Promise} - Response with user data
   */
  register: async (userData) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      const user = userCredential.user;
      
      // Update display name if provided
      if (userData.name) {
        await updateFirebaseProfile(user, {
          displayName: userData.name
        });
      }
      
      // Create user profile document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: userData.name || '',
        createdAt: new Date().toISOString(),
        role: 'user',
        subscription: {
          plan: 'free',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      });
      
      // Get ID token for API calls
      const token = await getIdToken(user);
      
      return { user, token };
    } catch (error) {
      throw { error: error.message || 'Registration failed' };
    }
  },

  /**
   * Login a user with Firebase
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Response with user data
   */
  login: async (credentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      const user = userCredential.user;
      const token = await getIdToken(user);
      
      return { user, token };
    } catch (error) {
      // Map Firebase error codes to user-friendly messages
      let errorMessage = 'Login failed';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      throw { error: errorMessage };
    }
  },

  /**
   * Logout the current user with Firebase
   */
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Get the current user from Firebase Auth
   * @returns {Object|null} - Current user data or null
   */
  getCurrentUser: () => {
    return auth.currentUser;
  },

  /**
   * Check if a user exists in Firestore and create profile if needed
   * @param {Object} user - Firebase auth user
   */
  createUserProfileIfNeeded: async (user) => {
    if (!user) return;
    
    const userRef = doc(firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        role: 'user',
        subscription: {
          plan: 'free',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      });
    }
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   */
  sendPasswordResetEmail: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw { error: error.message || 'Failed to send password reset email' };
    }
  },

  /**
   * Get the current user's token
   * @returns {Promise<string|null>} - Current user's ID token or null
   */
  getToken: async () => {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      return await getIdToken(user, true); // Force refresh
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Check if the user is authenticated
   * @returns {boolean} - Whether the user is authenticated
   */
  isAuthenticated: () => {
    return !!auth.currentUser;
  },

  /**
   * Get current user's profile from Firestore
   * @returns {Promise} - Response with user profile data
   */
  getProfile: async () => {
    const user = auth.currentUser;
    if (!user) {
      throw { error: 'No authenticated user found' };
    }
    
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { ...userSnap.data(), id: user.uid };
      } else {
        // Create profile if it doesn't exist
        await authService.createUserProfileIfNeeded(user);
        const newUserSnap = await getDoc(userRef);
        return { ...newUserSnap.data(), id: user.uid };
      }
    } catch (error) {
      throw { error: error.message || 'Failed to fetch profile' };
    }
  },

  /**
   * Update user profile in Firestore
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated user data
   */
  updateProfile: async (profileData) => {
    const user = auth.currentUser;
    if (!user) {
      throw { error: 'No authenticated user found' };
    }
    
    try {
      // Update display name in Firebase Auth if provided
      if (profileData.displayName) {
        await updateFirebaseProfile(user, {
          displayName: profileData.displayName
        });
      }
      
      // Update profile in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });
      
      // Get updated profile
      const updatedProfile = await authService.getProfile();
      return { user: updatedProfile };
    } catch (error) {
      throw { error: error.message || 'Failed to update profile' };
    }
  },

  /**
   * Get all available subscription plans
   * @returns {Promise} - Response with subscription plans
   */
  getSubscriptionPlans: async () => {
    try {
      const token = await authService.getToken();
      const response = await axios.get(`${API_URL}${SUBSCRIPTION_ENDPOINTS.plans}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
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
      const token = await authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(`${API_URL}${SUBSCRIPTION_ENDPOINTS.current}`, {
        headers: {
          Authorization: `Bearer ${token}`
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
      const token = await authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(`${API_URL}${SUBSCRIPTION_ENDPOINTS.update}`, 
        { plan },
        {
          headers: {
            Authorization: `Bearer ${token}`
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
      const token = await authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(`${API_URL}${SUBSCRIPTION_ENDPOINTS.cancel}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to cancel subscription' };
    }
  }
};

export default authService;