import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Header component for the application with G2L branding
 */
const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const aboutMenuRef = useRef(null);
  
  // Close the about menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target)) {
        setAboutMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
              <Link to="/forge" onClick={() => {
                // Reset any form wizard state by forcing a reload of the component
                localStorage.removeItem('formWizardState');
                window.location.href = "/forge";
              }}>Forge</Link>
            </li>
            <li className="about-menu-container" ref={aboutMenuRef}>
              <button 
                className="nav-button about-menu-button"
                onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
                aria-expanded={aboutMenuOpen}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-family)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                About {aboutMenuOpen ? '▲' : '▼'}
              </button>
              {aboutMenuOpen && (
                <div className="about-dropdown-menu">
                  <Link to="/about" onClick={() => setAboutMenuOpen(false)}>About ContextForge</Link>
                  <Link to="/about#business-profile" onClick={() => setAboutMenuOpen(false)}>Business Profile</Link>
                  <Link to="/about#target-audience" onClick={() => setAboutMenuOpen(false)}>Target Audience Profile</Link>
                  <Link to="/about#style-guide" onClick={() => setAboutMenuOpen(false)}>AI Style Guide</Link>
                  <Link to="/about#personal-bio" onClick={() => setAboutMenuOpen(false)}>Personal Bio</Link>
                  <Link to="/about#offer-documentation" onClick={() => setAboutMenuOpen(false)}>Offer Documentation</Link>
                  <Link to="/about#sales-messaging" onClick={() => setAboutMenuOpen(false)}>Sales Messaging Playbook</Link>
                </div>
              )}
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