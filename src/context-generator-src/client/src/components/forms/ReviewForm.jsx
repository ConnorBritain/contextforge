import React from 'react';
import '../../styles/forms.css';
import apiService from '../../services/apiService'; // Import apiService
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { toast } from 'react-hot-toast'; // Import toast for notifications

/**
 * Form component for reviewing and confirming all input data
 * before generating the document
 */
const ReviewForm = ({ formData, documentType, onBack, isSubmitting, setIsSubmitting }) => {
  const navigate = useNavigate(); // Hook for navigation

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
      // Add other cases as needed
      default:
        return 'Document';
    }
  };
  
  // Organize the form data into sections for easier review
  // (Assuming sections definition remains the same)
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
    // Add more sections/fields based on the specific documentType if needed
  ];
  
  // Handle submission by calling the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Ensure formData includes a unique ID (e.g., timestamp or UUID)
    // If `formData.id` is not already set, generate one here
    const wizardData = { 
        ...formData, 
        id: formData.id || `wizard-${Date.now()}`, // Ensure an ID exists
        documentType: documentType // Include document type in payload
    };

    try {
      // Call the backend API to save the wizard data
      const response = await apiService.saveWizardData(wizardData);
      
      console.log('API Response:', response);
      toast.success('Wizard data saved successfully!');
      
      // Navigate to the dashboard or a confirmation page upon success
      // You might want to pass the documentId to the next page
      // navigate(`/dashboard?saved=${response.documentId}`); 
      navigate('/dashboard'); // Redirect to dashboard

    } catch (error) {
      console.error('Error saving wizard data:', error);
      // Display specific error message from API if available
      const errorMessage = error.data?.message || error.message || 'Failed to save wizard data. Please try again.';
      toast.error(errorMessage);
      
      // Handle specific errors like 401 Unauthorized
      if (error.status === 401) {
        // Redirect to login page or show login modal
        // navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Review Your Information</h2>
        <p>Please review the information you've provided before saving.</p>
      </div>
      
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="review-section">
          <h3>{section.title}</h3>
          <div className="review-grid">
            {section.fields.map((field, fieldIndex) => {
              // Only display fields that have data
              const value = formData[field.key];
              if (!value) return null;
              
              return (
                <div key={fieldIndex} className="review-item">
                  <div className="review-label">{field.label}</div>
                  <div className="review-value">
                    {/* Render arrays as comma-separated strings or lists */}
                    {Array.isArray(value) ? value.join(', ') : value}
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
          className="generate-button" // Changed text to Save Draft
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Draft'} 
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
