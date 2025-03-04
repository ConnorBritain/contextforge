import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/forms/LoginForm';
import RegisterForm from '../components/forms/RegisterForm';

/**
 * Login/Register page component
 */
const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for error in query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');
    
    if (error) {
      // Handle different error types
      console.error('Authentication error:', error);
    }
  }, [location]);
  
  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Toggle between login and signup forms
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };
  
  return (
    <div className="login-page">
      <div className="container">
        <div className="auth-container">
          {showLogin ? (
            <LoginForm onSignupClick={toggleForm} />
          ) : (
            <RegisterForm onLoginClick={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;