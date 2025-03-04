import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home page component with G2L branding
 */
const HomePage = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>
          <span className="brand-title">
            <span className="brand-title-context">Context</span><span className="brand-title-forge">Forge</span>
          </span>
        </h1>
        <p className="subtitle gradient-text-light">Create powerful context documents that semantically calibrate AI systems for your specific business needs.</p>
        
        <div className="hero-description">
          <p>Our AI-optimized context documents help you get more precise, tailored responses from ChatGPT, Claude, and other AI systems by providing them with detailed contextual information about your business, audience, and communication style.</p>
        </div>
        
        <div className="cta-buttons">
          <Link to="/forge" className="primary-button" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            Forge New Document
          </Link>
          
          <Link to="/saved" className="secondary-button" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            View Saved Documents
          </Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Document <span>Types</span></h2>
        
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21H3V3H12V5H5V19H19V12H21V21Z" fill="#dc97ff"/>
                <path d="M21 9L19 7L15 11L13 9L11 11L15 15L21 9Z" fill="#ff7d45"/>
                <path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" fill="#dc97ff"/>
              </svg>
            </div>
            <h3>Business Dimensional Profile</h3>
            <p>Detailed business context document that enables AI systems to generate outputs precisely aligned with your unique business model, market position, offerings, and strategic objectives.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6C8.68 6 6 8.68 6 12C6 15.32 8.68 18 12 18C15.32 18 18 15.32 18 12C18 8.68 15.32 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="#6fe4c6"/>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#ff7d45"/>
              </svg>
            </div>
            <h3>Target Market Audience Profile</h3>
            <p>Comprehensive analysis of your ideal customer segments for semantically calibrating AI systems to accurately understand and target your specific audience demographics, psychographics, behaviors, and needs.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#75c3e8" fillOpacity="0.5"/>
                <path d="M14 2V8H20L14 2Z" fill="#dc97ff"/>
                <path d="M16 12H8V14H16V12Z" fill="#ff7d45"/>
                <path d="M16 16H8V18H16V16Z" fill="#ff7d45"/>
                <path d="M10 8H8V10H10V8Z" fill="#dc97ff"/>
              </svg>
            </div>
            <h3>AI Style Guide</h3>
            <p>Advanced AI calibration document for consistently aligning AI-generated content with your brand voice, terminology preferences, and communication standards across all platforms.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="#6fe4c6"/>
                <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#dc97ff"/>
              </svg>
            </div>
            <h3>Personal Bio Document</h3>
            <p>Comprehensive personal profile that helps AI systems understand your professional background, expertise, communication style, and preferences to generate more personalized and contextually relevant outputs.</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works-section">
        <h2>How It <span>Works</span></h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Choose Document Type</h3>
              <p>Select the AI context document that best suits your specific calibration needs.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Input Your Information</h3>
              <p>Provide details about your business, audience, or communication style through our guided forms.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Generate Document</h3>
              <p>Our system creates a semantically optimized context document specifically designed for AI calibration.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Use with AI Systems</h3>
              <p>Attach to AI conversations, use as embeddings, integrate with APIs, or reference in prompts for enhanced AI responses.</p>
            </div>
          </div>
        </div>
        
        <div className="cta-center">
          <Link to="/forge" className="primary-button" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            Start Forging
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;