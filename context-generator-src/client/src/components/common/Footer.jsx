import React from 'react';

/**
 * Footer component for the application with G2L branding
 */
const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>
            <span className="text-purple">G2L</span> <span className="text-orange">Context</span> &copy; {new Date().getFullYear()}
          </p>
          <p style={{ fontWeight: 'var(--font-weight-light)', opacity: 0.8 }}>
            Transform your business inputs into comprehensive, professional documents
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <a href="#" className="text-mint">Privacy Policy</a>
            <a href="#" className="text-tertiary-blue">Terms of Service</a>
            <a href="#" className="text-tertiary-green">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;