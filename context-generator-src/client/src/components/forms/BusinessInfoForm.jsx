import React, { useState, useEffect } from 'react';
import '../../styles/forms.css';

/**
 * Form component for collecting business information
 */
const BusinessInfoForm = ({ initialData = {}, onSubmit, onBack, formRef }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    products: '',
    businessDescription: '',
    coreValues: '',
    targetAudience: '',
    missionStatement: '',
    visionStatement: '',
    keyDifferentiators: '',
    marketPosition: '',
    ...initialData
  });
  
  // If initialData changes, update the form state
  useEffect(() => {
    if (Object.keys(initialData).length) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form ref={formRef} className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Business Information</h2>
        <p>Provide details about your business to help generate a tailored document.</p>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="businessName">Business Name *</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            placeholder="Enter your business name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="industry">Industry *</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            placeholder="E.g., Technology, Healthcare, Education"
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="products">Products/Services *</label>
          <input
            type="text"
            id="products"
            name="products"
            value={formData.products}
            onChange={handleChange}
            required
            placeholder="Main products or services you offer"
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="businessDescription">Business Description *</label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            value={formData.businessDescription}
            onChange={handleChange}
            required
            placeholder="Provide a brief overview of what your business does"
            rows={4}
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="coreValues">Core Values</label>
          <textarea
            id="coreValues"
            name="coreValues"
            value={formData.coreValues}
            onChange={handleChange}
            placeholder="The principles that guide your business"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience *</label>
          <textarea
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            required
            placeholder="Describe your ideal customers or clients"
            rows={3}
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="missionStatement">Mission Statement</label>
          <textarea
            id="missionStatement"
            name="missionStatement"
            value={formData.missionStatement}
            onChange={handleChange}
            placeholder="What is your company's purpose?"
            rows={2}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="visionStatement">Vision Statement</label>
          <textarea
            id="visionStatement"
            name="visionStatement"
            value={formData.visionStatement}
            onChange={handleChange}
            placeholder="What does your company aspire to become?"
            rows={2}
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="keyDifferentiators">Key Differentiators</label>
          <textarea
            id="keyDifferentiators"
            name="keyDifferentiators"
            value={formData.keyDifferentiators}
            onChange={handleChange}
            placeholder="What sets your business apart from competitors?"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="marketPosition">Market Position</label>
          <textarea
            id="marketPosition"
            name="marketPosition"
            value={formData.marketPosition}
            onChange={handleChange}
            placeholder="How do you position your business in the market?"
            rows={3}
          />
        </div>
      </div>
      
      <div className="form-navigation">
        {onBack && (
          <button 
            type="button" 
            className="back-button"
            onClick={onBack}
          >
            Back
          </button>
        )}
        
        <button type="submit" className="next-button">
          Next
        </button>
      </div>
    </form>
  );
};

export default BusinessInfoForm;