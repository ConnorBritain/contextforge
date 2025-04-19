import React, { useState, useEffect } from 'react';
import { validateField, validationSchemas } from '../../utils/formValidation';
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
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
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
    
    // Validate field on change if it's been touched
    if (touched[name]) {
      const schema = validationSchemas.businessInfo[name];
      if (schema) {
        const fieldError = validateField(value, schema);
        setErrors(prev => ({
          ...prev,
          [name]: fieldError
        }));
      }
    }
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field
    const schema = validationSchemas.businessInfo[name];
    if (schema) {
      const fieldError = validateField(value, schema);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(validationSchemas.businessInfo).forEach(field => {
      const schema = validationSchemas.businessInfo[field];
      const fieldError = validateField(formData[field] || '', schema);
      if (fieldError) {
        newErrors[field] = fieldError;
      }
    });
    
    setErrors(newErrors);
    
    // Submit if no errors
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector(`[name="${Object.keys(newErrors)[0]}"]`);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  };
  
  return (
    <form ref={formRef} className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Business Information</h2>
        <p>Provide details about your business to help generate a tailored document.</p>
      </div>
      
      <div className="form-section">
        <div className={`form-group ${errors.businessName ? 'has-error' : ''}`}>
          <label htmlFor="businessName">Business Name *</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your business name"
            aria-invalid={errors.businessName ? 'true' : 'false'}
          />
          {errors.businessName && touched.businessName && (
            <div className="error-message">{errors.businessName}</div>
          )}
        </div>
        
        <div className={`form-group ${errors.industry ? 'has-error' : ''}`}>
          <label htmlFor="industry">Industry *</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="E.g., Technology, Healthcare, Education"
            aria-invalid={errors.industry ? 'true' : 'false'}
          />
          {errors.industry && touched.industry && (
            <div className="error-message">{errors.industry}</div>
          )}
        </div>
      </div>
      
      <div className="form-section">
        <div className={`form-group ${errors.products ? 'has-error' : ''}`}>
          <label htmlFor="products">Products/Services *</label>
          <input
            type="text"
            id="products"
            name="products"
            value={formData.products}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Main products or services you offer"
            aria-invalid={errors.products ? 'true' : 'false'}
          />
          {errors.products && touched.products && (
            <div className="error-message">{errors.products}</div>
          )}
        </div>
        
        <div className={`form-group full-width ${errors.businessDescription ? 'has-error' : ''}`}>
          <label htmlFor="businessDescription">Business Description *</label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            value={formData.businessDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Provide a brief overview of what your business does"
            rows={4}
            aria-invalid={errors.businessDescription ? 'true' : 'false'}
          />
          {errors.businessDescription && touched.businessDescription && (
            <div className="error-message">{errors.businessDescription}</div>
          )}
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
            onBlur={handleBlur}
            placeholder="The principles that guide your business"
            rows={3}
          />
        </div>
        
        <div className={`form-group ${errors.targetAudience ? 'has-error' : ''}`}>
          <label htmlFor="targetAudience">Target Audience *</label>
          <textarea
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe your ideal customers or clients"
            rows={3}
            aria-invalid={errors.targetAudience ? 'true' : 'false'}
          />
          {errors.targetAudience && touched.targetAudience && (
            <div className="error-message">{errors.targetAudience}</div>
          )}
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