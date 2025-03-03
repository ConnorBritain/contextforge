import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home page component
 */
const HomePage = () => {
  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Context Generator</h1>
        <p className="subtitle">Transform your business inputs into comprehensive, professional documents</p>
        
        <div className="cta-buttons">
          <Link to="/create" className="primary-button">
            Create New Document
          </Link>
          
          <Link to="/saved" className="secondary-button">
            View Saved Documents
          </Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Document Types</h2>
        
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">=e</div>
            <h3>Target Market Audience Profile</h3>
            <p>Comprehensive analysis of your ideal customer segments, including demographics, psychographics, behaviors, and needs.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">=Ê</div>
            <h3>Business Dimensional Profile</h3>
            <p>Detailed business strategy document covering market analysis, offerings, business model, operations, and growth projections.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon"><¨</div>
            <h3>AI Style Guide</h3>
            <p>Comprehensive guide for ensuring consistent AI communications that align with your brand voice, audience, and business objectives.</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works-section">
        <h2>How It Works</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Choose Document Type</h3>
              <p>Select the type of document that best suits your business needs.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Input Your Information</h3>
              <p>Fill out the forms with details about your business, audience, and goals.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Generate Document</h3>
              <p>Our AI transforms your inputs into a comprehensive, professional document.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Export & Use</h3>
              <p>Download your document in multiple formats and put it to work.</p>
            </div>
          </div>
        </div>
        
        <div className="cta-center">
          <Link to="/create" className="primary-button">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;