import React from 'react';

/**
 * Footer component for the application
 */
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>Context Generator &copy; {new Date().getFullYear()}</p>
          <p>Transform your business inputs into comprehensive, professional documents</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;