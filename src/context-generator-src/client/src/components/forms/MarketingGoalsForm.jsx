import React, { useState, useEffect } from 'react';
import '../../styles/forms.css';

/**
 * Form component for collecting marketing and audience information
 */
const MarketingGoalsForm = ({ initialData = {}, onSubmit, onBack, formRef }) => {
  const [formData, setFormData] = useState({
    targetAudienceOverview: '',
    audienceAge: '',
    audienceGender: '',
    audienceLocation: '',
    audiencePainPoints: '',
    audienceGoals: '',
    audienceIncomeLevel: '',
    marketingChannels: '',
    communicationGoals: '',
    keyMessaging: '',
    brandVoice: '',
    keyTerminology: '',
    competitiveAdvantage: '',
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
        <h2>Audience & Marketing Information</h2>
        <p>Please provide details about your target audience and marketing goals.</p>
      </div>
      
      <div className="form-section">
        <div className="form-group full-width">
          <label htmlFor="targetAudienceOverview">Target Audience Overview *</label>
          <textarea
            id="targetAudienceOverview"
            name="targetAudienceOverview"
            value={formData.targetAudienceOverview}
            onChange={handleChange}
            required
            placeholder="Provide a comprehensive overview of your ideal customer"
            rows={4}
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="audienceAge">Age Range</label>
          <input
            type="text"
            id="audienceAge"
            name="audienceAge"
            value={formData.audienceAge}
            onChange={handleChange}
            placeholder="E.g., 25-45, 18-35"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="audienceGender">Gender Distribution</label>
          <input
            type="text"
            id="audienceGender"
            name="audienceGender"
            value={formData.audienceGender}
            onChange={handleChange}
            placeholder="E.g., All genders, 60% female"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="audienceLocation">Geographic Location</label>
          <input
            type="text"
            id="audienceLocation"
            name="audienceLocation"
            value={formData.audienceLocation}
            onChange={handleChange}
            placeholder="E.g., Urban US, Global, Southeast region"
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="audiencePainPoints">Pain Points & Challenges *</label>
          <textarea
            id="audiencePainPoints"
            name="audiencePainPoints"
            value={formData.audiencePainPoints}
            onChange={handleChange}
            required
            placeholder="What problems or challenges does your audience face?"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="audienceGoals">Audience Goals & Motivations *</label>
          <textarea
            id="audienceGoals"
            name="audienceGoals"
            value={formData.audienceGoals}
            onChange={handleChange}
            required
            placeholder="What are your audience's primary goals and motivations?"
            rows={3}
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="audienceIncomeLevel">Income Level / Budget</label>
          <input
            type="text"
            id="audienceIncomeLevel"
            name="audienceIncomeLevel"
            value={formData.audienceIncomeLevel}
            onChange={handleChange}
            placeholder="E.g., Middle-income, Enterprise-level budget"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="marketingChannels">Primary Marketing Channels</label>
          <input
            type="text"
            id="marketingChannels"
            name="marketingChannels"
            value={formData.marketingChannels}
            onChange={handleChange}
            placeholder="E.g., Social media, Email, Search, Events"
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="communicationGoals">Communication Goals *</label>
          <textarea
            id="communicationGoals"
            name="communicationGoals"
            value={formData.communicationGoals}
            onChange={handleChange}
            required
            placeholder="What do you want to achieve with your communications?"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="keyMessaging">Key Messaging</label>
          <textarea
            id="keyMessaging"
            name="keyMessaging"
            value={formData.keyMessaging}
            onChange={handleChange}
            placeholder="What are the main messages you want to convey?"
            rows={3}
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="brandVoice">Brand Voice & Tone *</label>
          <textarea
            id="brandVoice"
            name="brandVoice"
            value={formData.brandVoice}
            onChange={handleChange}
            required
            placeholder="How would you describe your brand's personality and tone?"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="keyTerminology">Key Terminology</label>
          <textarea
            id="keyTerminology"
            name="keyTerminology"
            value={formData.keyTerminology}
            onChange={handleChange}
            placeholder="Important terms or phrases specific to your brand"
            rows={3}
          />
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group full-width">
          <label htmlFor="competitiveAdvantage">Competitive Advantage</label>
          <textarea
            id="competitiveAdvantage"
            name="competitiveAdvantage"
            value={formData.competitiveAdvantage}
            onChange={handleChange}
            placeholder="What makes your offering better than competitors?"
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

export default MarketingGoalsForm;