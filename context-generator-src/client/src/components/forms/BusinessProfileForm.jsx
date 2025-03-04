import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormSection from './FormSection';
import '../../styles/forms.css';

/**
 * Business Dimensional Profile form component
 */
const BusinessProfileForm = ({ initialData = {}, onSubmit, onBack }) => {
  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    companyOverview: '',
    targetAudience: '',
    missionStatement: '',
    offerings: '',
    uniqueApproach: '',
    coreValues: '',
    outcomes: '',
    customerExperience: '',
    communicationStyle: '',
    successMetrics: '',
    vision: '',
    ...initialData
  });

  // Errors state
  const [errors, setErrors] = useState({});

  // Load initial data if provided
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: inputValue
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['companyName', 'companyOverview', 'targetAudience'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.field-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Business Dimensional Profile</h2>
        <p>Please provide information about your business to create a comprehensive profile.</p>
      </div>
      
      <FormSection 
        title="Company Identity"
        description="Basic information about your company and its purpose"
      >
        <FormField
          id="companyName"
          label="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter your company name"
          required
          error={errors.companyName}
        />
        
        <FormField
          id="companyOverview"
          label="Company Overview"
          type="textarea"
          value={formData.companyOverview}
          onChange={handleChange}
          placeholder="Provide a brief introduction to your company"
          required
          error={errors.companyOverview}
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Target Audience and Mission"
        description="Who you serve and why"
      >
        <FormField
          id="targetAudience"
          label="Who You Serve"
          type="textarea"
          value={formData.targetAudience}
          onChange={handleChange}
          placeholder="Describe your target audience"
          required
          error={errors.targetAudience}
          rows={4}
        />
        
        <FormField
          id="missionStatement"
          label="Why You Serve Them"
          type="textarea"
          value={formData.missionStatement}
          onChange={handleChange}
          placeholder="Explain your mission and motivation"
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Offerings and Approach"
        description="Your products/services and what makes them unique"
      >
        <FormField
          id="offerings"
          label="How You Serve Them"
          type="textarea"
          value={formData.offerings}
          onChange={handleChange}
          placeholder="Detail your primary offerings and methods"
          rows={4}
        />
        
        <FormField
          id="uniqueApproach"
          label="What Makes Your Approach Unique"
          type="textarea"
          value={formData.uniqueApproach}
          onChange={handleChange}
          placeholder="Outline your key differentiators"
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Values and Outcomes"
        description="Your principles and the results you create"
      >
        <FormField
          id="coreValues"
          label="What Values Guide You"
          type="textarea"
          value={formData.coreValues}
          onChange={handleChange}
          placeholder="List your core principles and beliefs"
          rows={4}
        />
        
        <FormField
          id="outcomes"
          label="What Outcomes You Create"
          type="textarea"
          value={formData.outcomes}
          onChange={handleChange}
          placeholder="Describe the results and impact of your work"
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Customer Experience and Communication"
        description="How you interact with your customers"
      >
        <FormField
          id="customerExperience"
          label="What Experience You Deliver"
          type="textarea"
          value={formData.customerExperience}
          onChange={handleChange}
          placeholder="Explain the journey and feeling your customers/clients receive"
          rows={4}
        />
        
        <FormField
          id="communicationStyle"
          label="How You Communicate"
          type="textarea"
          value={formData.communicationStyle}
          onChange={handleChange}
          placeholder="Detail your voice, tone, and communication style"
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Success Metrics and Vision"
        description="How you measure success and your future goals"
        showDivider={false}
      >
        <FormField
          id="successMetrics"
          label="How You Measure Success"
          type="textarea"
          value={formData.successMetrics}
          onChange={handleChange}
          placeholder="Define your key metrics and indicators"
          rows={4}
        />
        
        <FormField
          id="vision"
          label="What Future You're Building"
          type="textarea"
          value={formData.vision}
          onChange={handleChange}
          placeholder="Share your vision and long-term goals"
          rows={4}
        />
      </FormSection>
      
      <div className="form-navigation">
        <button 
          type="button" 
          className="back-button"
          onClick={onBack}
        >
          Back
        </button>
        <button 
          type="submit" 
          className="next-button"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default BusinessProfileForm;