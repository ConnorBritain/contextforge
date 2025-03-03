import React, { useState } from 'react';
import '../../styles/forms.css';

/**
 * Form for collecting audience information for document generation
 */
const AudienceForm = ({ initialData = {}, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    targetAudience: initialData.targetAudience || '',
    demographicProfile: initialData.demographicProfile || '',
    psychographicTraits: initialData.psychographicTraits || '',
    painPoints: initialData.painPoints || '',
    preferredChannels: initialData.preferredChannels || '',
    buyingBehavior: initialData.buyingBehavior || '',
    additionalInsights: initialData.additionalInsights || ''
  });
  
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
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Audience Information</h2>
        <p>Tell us about your target audience to create a comprehensive audience profile.</p>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience Description</label>
          <textarea
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="Describe your overall target audience (e.g. 'Small business owners in the tech industry')"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="demographicProfile">Demographic Profile</label>
          <textarea
            id="demographicProfile"
            name="demographicProfile"
            value={formData.demographicProfile}
            onChange={handleChange}
            placeholder="Age range, gender, income level, education, occupation, location, etc."
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="psychographicTraits">Psychographic Traits</label>
          <textarea
            id="psychographicTraits"
            name="psychographicTraits"
            value={formData.psychographicTraits}
            onChange={handleChange}
            placeholder="Values, interests, lifestyle, attitudes, opinions, etc."
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="painPoints">Pain Points and Challenges</label>
          <textarea
            id="painPoints"
            name="painPoints"
            value={formData.painPoints}
            onChange={handleChange}
            placeholder="What problems or challenges do they face that your product/service solves?"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferredChannels">Preferred Communication Channels</label>
          <textarea
            id="preferredChannels"
            name="preferredChannels"
            value={formData.preferredChannels}
            onChange={handleChange}
            placeholder="Where do they consume content? (e.g. social media platforms, email, blogs, etc.)"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="buyingBehavior">Buying Behavior</label>
          <textarea
            id="buyingBehavior"
            name="buyingBehavior"
            value={formData.buyingBehavior}
            onChange={handleChange}
            placeholder="Decision-making process, purchase triggers, price sensitivity, etc."
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalInsights">Additional Insights (Optional)</label>
          <textarea
            id="additionalInsights"
            name="additionalInsights"
            value={formData.additionalInsights}
            onChange={handleChange}
            placeholder="Any other relevant information about your audience"
            rows={2}
          />
        </div>
      </div>
      
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

export default AudienceForm;