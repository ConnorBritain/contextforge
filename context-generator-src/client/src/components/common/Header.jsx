import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header component for the application
 */
const Header = () => {
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
            <li>
              <Link to="/saved">Saved Documents</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;