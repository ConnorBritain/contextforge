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
        <p className="subtitle">Create powerful context documents that semantically calibrate AI systems for your specific business needs</p>
        
        <div className="hero-description">
          <p>Our AI-optimized context documents help you get more precise, tailored responses from ChatGPT, Claude, and other AI systems by providing them with detailed contextual information about your business, audience, and communication style.</p>
        </div>
        
        <div className="cta-buttons">
          <Link to="/create" className="primary-button">
            Create New Document
          </Link>
          
          <Link to="/saved" className="secondary-button">
            View Saved Documents
          </Link>
          
          <Link to="/about" className="text-button">
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Document Types</h2>
        
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Business Dimensional Profile</h3>
            <p>Detailed business context document that enables AI systems to generate outputs precisely aligned with your unique business model, market position, offerings, and strategic objectives.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Target Market Audience Profile</h3>
            <p>Comprehensive analysis of your ideal customer segments for semantically calibrating AI systems to accurately understand and target your specific audience demographics, psychographics, behaviors, and needs.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>AI Style Guide</h3>
            <p>Advanced AI calibration document for consistently aligning AI-generated content with your brand voice, terminology preferences, and communication standards across all platforms.</p>
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
          <Link to="/create" className="primary-button">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;