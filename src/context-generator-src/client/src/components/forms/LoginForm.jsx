import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Login form component with email/password and Google OAuth options
 * Updated to work with Firebase Authentication
 */
const LoginForm = ({ onSignupClick, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const { login, loginWithGoogle, loading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError('Please enter both email and password');
      setIsSubmitting(false);
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      // No need to do anything here - the AuthContext will update automatically
      // due to the Firebase onAuthStateChanged listener
    } catch (err) {
      setFormError(err.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      // No need to do anything here - the AuthContext will update automatically
    } catch (err) {
      setFormError(err.error || 'Google login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Sign In</h2>
      
      {(error || formError) && (
        <ErrorMessage message={formError || error} />
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
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
            placeholder="Your password"
            minLength="6"
            required
          />
        </div>
        
        {onForgotPassword && (
          <p className="forgot-password">
            <button 
              type="button" 
              className="text-link" 
              onClick={() => onForgotPassword(formData.email)}
            >
              Forgot password?
            </button>
          </p>
        )}
        
        <button 
          type="submit" 
          className="primary-button"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? <LoadingSpinner size="small" /> : 'Sign In'}
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
        Sign in with Google
      </button>
      
      <p className="auth-switch">
        Don't have an account?{' '}
        <button type="button" className="text-link" onClick={onSignupClick}>
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;