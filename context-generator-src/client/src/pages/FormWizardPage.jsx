import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentContext } from '../context/DocumentContext';
import { DOCUMENT_TYPES } from '../constants/documentTypes';
import DocumentTypeSelector from '../components/forms/DocumentTypeSelector';
import BusinessProfileForm from '../components/forms/BusinessProfileForm';
import TargetMarketAudienceForm from '../components/forms/TargetMarketAudienceForm';
import StyleGuideForm from '../components/forms/StyleGuideForm';
import PersonalBioForm from '../components/forms/PersonalBioForm';
import OfferDocumentationForm from '../components/forms/OfferDocumentationForm';
import SalesMessagingPlaybookForm from '../components/forms/SalesMessagingPlaybookForm';
import ReviewForm from '../components/forms/ReviewForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { toast } from 'react-hot-toast'; // Import toast for notifications
import apiService from '../services/apiService'; // Import apiService

/**
 * Multi-step form wizard for generating documents
 */
const FormWizardPage = () => {
  const navigate = useNavigate();
  // Keeping DocumentContext for potential future generation logic, 
  // but replacing direct generation with save draft for now.
  const { isGenerating, error, setError } = useContext(DocumentContext); 
  
  // Current step in the wizard
  const [currentStep, setCurrentStep] = useState(1);
  
  // Combined form data
  const [formData, setFormData] = useState({});
  
  // Selected document type
  const [documentType, setDocumentType] = useState('');

  // State for managing submission/loading state for the save draft action
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle document type selection
  const handleSelectDocumentType = (type) => {
    setDocumentType(type);
  };
  
  // Handle navigation to next step
  const handleNext = (data) => {
    // If data is just the document type (from step 1)
    if (typeof data === 'string') {
      setDocumentType(data);
    } else {
      // Update form data with new fields
      setFormData(prevData => ({
        ...prevData,
        ...data,
        // Ensure an ID is added early if not present, or use a consistent ID throughout
        id: prevData.id || `wizard-${Date.now()}`
      }));
    }
    
    // Move to next step
    setCurrentStep(prevStep => prevStep + 1);
    
    // Scroll to top
    window.scrollTo(0, 0);
  };
  
  // Handle navigation to previous step
  const handleBack = () => {
    setCurrentStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };
  
  // Handle submission: Save draft to Firestore via backend
  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    const wizardData = { 
        ...formData, 
        id: formData.id || `wizard-${Date.now()}`, // Re-ensure ID
        documentType: documentType // Include document type in payload
    };

    try {
      // Call the backend API to save the wizard data
      const response = await apiService.saveWizardData(wizardData);
      
      console.log('API Response:', response);
      toast.success('Wizard draft saved successfully!');
      
      // Navigate to the dashboard or a confirmation page upon success
      navigate('/dashboard'); // Redirect to dashboard

    } catch (apiError) {
      console.error('Error saving wizard draft:', apiError);
      // Use the error structure from ApiError
      const errorMessage = apiError.data?.message || apiError.message || 'Failed to save wizard draft. Please try again.';
      setError(errorMessage); // Use context error state
      toast.error(errorMessage);
      
      // Handle specific errors like 401 Unauthorized
      if (apiError.status === 401) {
        // Optional: Redirect to login page
        // navigate('/login'); 
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the current step of the wizard
  const renderStep = () => {
    // Step 1 is always the document type selector
    if (currentStep === 1) {
      return (
        <DocumentTypeSelector 
          selectedType={documentType}
          onSelectType={handleSelectDocumentType}
          onNext={handleNext}
        />
      );
    }
    
    // Step 3 is always the review form
    if (currentStep === 3) {
      return (
        <ReviewForm 
          formData={formData}
          documentType={documentType}
          onBack={handleBack}
          // Pass handleSaveDraft instead of handleSubmit
          onSubmit={handleSaveDraft} 
          isSubmitting={isSubmitting} // Pass the local submitting state
          setIsSubmitting={setIsSubmitting} // Pass setter if needed inside ReviewForm
        />
      );
    }
    
    // Step 2 changes based on the selected document type
    if (currentStep === 2) {
      // Render the appropriate form based on documentType
      // Ensure initialData, onSubmit, and onBack are passed correctly
      const FormComponent = getFormComponent(documentType);
      if (FormComponent) {
        return (
          <FormComponent 
            initialData={formData} 
            onSubmit={handleNext} 
            onBack={handleBack} 
          />
        );
      } else {
        return <div>Please select a valid document type first</div>;
      }
    }
    
    return <div>Unknown step</div>;
  };

  // Helper to get the correct form component for Step 2
  const getFormComponent = (type) => {
    switch (type) {
      case DOCUMENT_TYPES.BUSINESS_PROFILE: return BusinessProfileForm;
      case DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE: return TargetMarketAudienceForm;
      case DOCUMENT_TYPES.STYLE_GUIDE: return StyleGuideForm;
      case DOCUMENT_TYPES.PERSONAL_BIO: return PersonalBioForm;
      case DOCUMENT_TYPES.OFFER_DOCUMENTATION: return OfferDocumentationForm;
      case DOCUMENT_TYPES.SALES_MESSAGING_PLAYBOOK: return SalesMessagingPlaybookForm;
      default: return null;
    }
  }
  
  return (
    <div className="page-container">
      <div className="wizard-container">
        {/* Progress bar remains the same */} 
        <div className="wizard-progress">
           {/* ... progress bar JSX ... */} 
           <div className="progress-steps">
             <div 
               className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}
               onClick={() => documentType && setCurrentStep(1)}
               style={{ cursor: documentType ? 'pointer' : 'default' }}
             >
               <div className="step-number">1</div>
               <div className="step-label">Document Type</div>
             </div>
             <div 
               className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}
               onClick={() => documentType && setCurrentStep(2)}
               style={{ cursor: documentType ? 'pointer' : 'default' }}
             >
               <div className="step-number">2</div>
               <div className="step-label">
                 {getFormComponent(documentType)?.name?.replace('Form', '') || 'Document Details'}
               </div>
             </div>
             <div 
               className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}
               onClick={() => Object.keys(formData).length > 0 && documentType && setCurrentStep(3)}
               style={{ cursor: Object.keys(formData).length > 0 && documentType ? 'pointer' : 'default' }}
             >
               <div className="step-number">3</div>
               <div className="step-label">Review & Save</div>
             </div>
           </div>
           <div className="progress-bar">
             <div 
               className="progress-indicator" 
               style={{ width: `${(currentStep - 1) * 50}%` }} 
             />
           </div>
        </div>
        
        {/* Display loading spinner or error messages */} 
        {isSubmitting && (
          <div className="loading-overlay">
            <LoadingSpinner />
            <div className="loading-message">
              Saving your draft...
            </div>
          </div>
        )}
        
        {error && <ErrorMessage message={error} />}
        
        <div className="wizard-content">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default FormWizardPage;
