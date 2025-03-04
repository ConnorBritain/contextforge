import React from 'react';
import '../../styles/forms.css';

/**
 * Form component for reviewing and confirming all input data
 * before generating the document
 */
const ReviewForm = ({ formData, documentType, onBack, onSubmit, isSubmitting }) => {
  // Define document type display name
  const getDocumentTypeDisplay = () => {
    switch (documentType) {
      case 'targetMarketAudience':
        return 'Target Market Audience Profile';
      case 'businessProfile':
        return 'Business Dimensional Profile';
      case 'styleGuide':
        return 'AI Style Guide';
      case 'personalBio':
        return 'Personal Bio Document';
      default:
        return 'Document';
    }
  };
  
  // Organize the form data into sections for easier review
  const sections = [
    {
      title: 'Business Information',
      fields: [
        { key: 'businessName', label: 'Business Name' },
        { key: 'industry', label: 'Industry' },
        { key: 'products', label: 'Products/Services' },
        { key: 'businessDescription', label: 'Business Description' },
        { key: 'coreValues', label: 'Core Values' },
        { key: 'missionStatement', label: 'Mission Statement' },
        { key: 'visionStatement', label: 'Vision Statement' }
      ]
    },
    {
      title: 'Audience & Marketing',
      fields: [
        { key: 'targetAudience', label: 'Target Audience' },
        { key: 'targetAudienceOverview', label: 'Target Audience Overview' },
        { key: 'audienceAge', label: 'Age Range' },
        { key: 'audienceGender', label: 'Gender Distribution' },
        { key: 'audienceLocation', label: 'Geographic Location' },
        { key: 'audiencePainPoints', label: 'Pain Points & Challenges' },
        { key: 'audienceGoals', label: 'Audience Goals & Motivations' },
        { key: 'audienceIncomeLevel', label: 'Income Level / Budget' }
      ]
    },
    {
      title: 'Messaging & Positioning',
      fields: [
        { key: 'keyDifferentiators', label: 'Key Differentiators' },
        { key: 'marketPosition', label: 'Market Position' },
        { key: 'keyMessaging', label: 'Key Messaging' },
        { key: 'brandVoice', label: 'Brand Voice & Tone' },
        { key: 'keyTerminology', label: 'Key Terminology' },
        { key: 'communicationGoals', label: 'Communication Goals' },
        { key: 'competitiveAdvantage', label: 'Competitive Advantage' },
        { key: 'marketingChannels', label: 'Marketing Channels' }
      ]
    }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Review Your Information</h2>
        <p>Please review the information you've provided before forging your {getDocumentTypeDisplay()}.</p>
      </div>
      
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="review-section">
          <h3>{section.title}</h3>
          <div className="review-grid">
            {section.fields.map((field, fieldIndex) => {
              // Skip fields that don't exist in the form data
              if (formData[field.key] === undefined) return null;
              
              return (
                <div key={fieldIndex} className="review-item">
                  <div className="review-label">{field.label}</div>
                  <div className="review-value">
                    {formData[field.key] ? formData[field.key] : <em>Not provided</em>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="document-type-review">
        <h3>Document Type</h3>
        <div className="review-item">
          <div className="review-value">
            <strong>{getDocumentTypeDisplay()}</strong>
          </div>
        </div>
      </div>
      
      <div className="form-navigation">
        <button 
          type="button" 
          className="back-button"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </button>
        
        <button 
          type="submit" 
          className="generate-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Forging...' : 'Forge Document'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;