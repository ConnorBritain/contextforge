import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Register form component
 * Updated to work with Firebase Authentication
 */
const RegisterForm = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const { register, loginWithGoogle, loading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError('');
  };

  // Handle form submission with Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      // Remove confirmPassword before sending to Firebase
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      // No need to do anything here - the AuthContext will update automatically
      // due to the Firebase onAuthStateChanged listener
    } catch (err) {
      // Map Firebase error codes to user-friendly messages
      let errorMessage = err.error || 'Registration failed. Please try again.';
      if (err.error && err.error.includes('email-already-in-use')) {
        errorMessage = 'This email is already registered. Please use a different email or sign in.';
      } else if (err.error && err.error.includes('invalid-email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.error && err.error.includes('weak-password')) {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth registration
  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      // No need to do anything here - the AuthContext will update automatically
    } catch (err) {
      setFormError(err.error || 'Google sign up failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create an Account</h2>
      
      {(error || formError) && (
        <ErrorMessage message={formError || error} />
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="youremail@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            minLength="6"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            minLength="6"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="primary-button"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? <LoadingSpinner size="small" /> : 'Sign Up'}
        </button>
      </form>
      
      <div className="auth-divider">
        <span>OR</span>
      </div>
      
      <button 
        className="btn btn-google btn-block"
        onClick={handleGoogleLogin}
        disabled={loading || isSubmitting}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
          <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
        </svg>
        Sign up with Google
      </button>
      
      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="text-link" onClick={onLoginClick}>
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;