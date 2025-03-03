import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Header component for the application
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
        <Link to="/" className="logo">
          Context Generator
        </Link>
        
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create Document</Link>
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
                  <button onClick={handleLogout} className="nav-button">Logout</button>
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