import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Page to handle OAuth callbacks
 * This page processes the token and user information from the OAuth provider callback
 */
const AuthCallbackPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const id = params.get('id');
    const name = params.get('name');
    const email = params.get('email');
    const error = params.get('error');

    // Handle error cases
    if (error) {
      console.error('Authentication failed:', error);
      navigate('/login?error=' + encodeURIComponent(error));
      return;
    }

    // Ensure we have the required data
    if (!token || !id) {
      console.error('Missing authentication data');
      navigate('/login?error=invalid-auth-data');
      return;
    }

    // Store auth data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id,
      name: name || 'User',
      email: email || ''
    }));

    // Redirect to home page or intended destination
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
    localStorage.removeItem('redirectAfterLogin');
    navigate(redirectPath);
  }, [search, navigate]);

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="auth-callback-page">
      <div className="container">
        <div className="auth-callback-content">
          <h1>Completing Sign In</h1>
          <p>Please wait while we complete your authentication...</p>
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;