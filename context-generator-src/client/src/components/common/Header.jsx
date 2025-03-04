import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Header component for the application with G2L branding
 */
const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };
  
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo brand-title">
          <span className="brand-title-context">Context</span><span className="brand-title-forge">Forge</span>
        </Link>
        
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create" onClick={() => {
                // Reset any form wizard state by forcing a reload of the component
                localStorage.removeItem('formWizardState');
                window.location.href = "/create";
              }}>Forge</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/saved">Saved Documents</Link>
                </li>
                <li>
                  <Link to="/usage">Usage Dashboard</Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="nav-button"
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--color-white)',
                      fontFamily: 'var(--font-family)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;