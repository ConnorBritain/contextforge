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
                  fontWeight: 'var(--font-weight-regular)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  padding: 0
                }}
              >
                About <span style={{ 
                  marginLeft: '4px', 
                  fontSize: '0.7rem',
                  color: 'var(--color-purple-accent)'
                }}>{aboutMenuOpen ? '▲' : '▼'}</span>
              </button>
              {aboutMenuOpen && (
                <div className="about-dropdown-menu">
                  <a href="/about" onClick={() => setAboutMenuOpen(false)}>About ContextForge</a>
                  <a href="/about#business-profile" onClick={() => setAboutMenuOpen(false)}>Business Profile</a>
                  <a href="/about#target-audience" onClick={() => setAboutMenuOpen(false)}>Target Audience Profile</a>
                  <a href="/about#style-guide" onClick={() => setAboutMenuOpen(false)}>AI Style Guide</a>
                  <a href="/about#personal-bio" onClick={() => setAboutMenuOpen(false)}>Personal Bio</a>
                  <a href="/about#offer-documentation" onClick={() => setAboutMenuOpen(false)}>Offer Documentation</a>
                  <a href="/about#sales-messaging" onClick={() => setAboutMenuOpen(false)}>Sales Messaging Playbook</a>
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