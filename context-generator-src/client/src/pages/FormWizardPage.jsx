import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// DocumentContext removed
// import { DocumentContext } from '../context/DocumentContext'; 
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
import { toast } from 'react-hot-toast';
import apiService from '../services/apiService';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to check auth status

/**
 * Multi-step form wizard for creating/editing document drafts.
 */
const FormWizardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext); // Check if user is logged in
  
  // Get initial data if passed from navigation state (for editing drafts)
  const initialData = location.state?.initialData || {};

  // Removed useContext(DocumentContext)
  // const { isGenerating, error, setError } = useContext(DocumentContext); 

  // Local state for error handling within the wizard
  const [wizardError, setWizardError] = useState(null);

  // Determine initial step and state based on initialData
  const [currentStep, setCurrentStep] = useState(initialData.documentType ? 2 : 1); // Start at step 2 if editing
  const [formData, setFormData] = useState(initialData);
  const [documentType, setDocumentType] = useState(initialData.documentType || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to set initial state when editing
  useEffect(() => {
      if (location.state?.initialData) {
          const data = location.state.initialData;
          console.log("Loading initial data for editing:", data);
          setFormData(data);
          setDocumentType(data.documentType || '');
          // Start at step 2 if editing an existing draft with a type
          setCurrentStep(data.documentType ? 2 : 1);
      }
  }, [location.state]);

  // Handle document type selection (only relevant when creating new)
  const handleSelectDocumentType = (type) => {
    setDocumentType(type);
    // Reset form data if type changes, keeping only potential ID if editing?
    // setFormData(prev => ({ id: prev.id })); // Decide on reset strategy
  };

  // Handle navigation to next step, merging data
  const handleNext = (newData) => {
    // Clear previous step's error when moving forward
    setWizardError(null);

    if (typeof newData === 'string') { // From DocumentTypeSelector
      setDocumentType(newData);
      // Ensure ID from initialData is preserved if editing
      setFormData(prev => ({ ...prev, documentType: newData, id: prev.id || `wizard-${Date.now()}` }));
    } else { // From specific forms
      setFormData(prevData => ({
        ...prevData,
        ...newData,
        // Ensure an ID exists (from initial data or generate new)
        id: prevData.id || initialData.id || `wizard-${Date.now()}` 
      }));
    }
    setCurrentStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };

  // Handle navigation to previous step
  const handleBack = () => {
    setWizardError(null); // Clear error when going back
    setCurrentStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  // Handle submission: Save draft to Firestore via backend
  const handleSaveDraft = async () => {
    if (!user) {
        toast.error("You must be logged in to save a draft.");
        navigate('/login');
        return;
    }
    
    setIsSubmitting(true);
    setWizardError(null); // Clear previous errors

    // Ensure ID and documentType are included
    const wizardData = { 
        ...formData, 
        id: formData.id || initialData.id || `wizard-${Date.now()}`, 
        documentType: documentType 
    };

    if (!wizardData.documentType) {
        setWizardError("Document type is missing.");
        setIsSubmitting(false);
        toast.error("Cannot save draft: Document type not selected.");
        setCurrentStep(1); // Go back to type selection
        return;
    }

    try {
      // Call the backend API to save the wizard data
      const response = await apiService.saveWizardData(wizardData);
      toast.success('Wizard draft saved successfully!');
      // Navigate to saved documents page after successful save
      navigate('/saved'); 
    } catch (apiError) {
      console.error('Error saving wizard draft:', apiError);
      const errorMessage = apiError.data?.message || apiError.message || 'Failed to save wizard draft. Please try again.';
      setWizardError(errorMessage); // Use local error state
      toast.error(errorMessage);
      if (apiError.status === 401) {
        navigate('/login'); // Redirect to login on auth error
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step component
  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <DocumentTypeSelector 
          selectedType={documentType}
          onSelectType={handleSelectDocumentType}
          onNext={handleNext}
        />
      );
    }
    
    if (currentStep === 3) {
      return (
        <ReviewForm 
          formData={formData}
          documentType={documentType}
          onBack={handleBack}
          onSubmit={handleSaveDraft} 
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting} // Needed for form state
        />
      );
    }
    
    if (currentStep === 2) {
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
        // Should not happen if navigating correctly, but handle defensively
        setWizardError("Invalid document type selected.");
        setCurrentStep(1); // Go back to selection
        return <div>Invalid document type. Please select again.</div>;
      }
    }
    
    return <div>Loading wizard step...</div>;
  };

  // Helper to get the correct form component based on type
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
  };

  return (
    <div className="page-container">
      <div className="wizard-container">
        {/* Progress Bar */}
        <div className="wizard-progress">
           <div className="progress-steps">
             {/* Step 1 */} 
             <div 
               className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}
               onClick={() => !initialData.documentType && setCurrentStep(1)} // Allow click only if creating new
               style={{ cursor: !initialData.documentType ? 'pointer' : 'default' }}
             >
               <div className="step-number">1</div>
               <div className="step-label">Document Type</div>
             </div>
             {/* Step 2 */} 
             <div 
               className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}
               onClick={() => documentType && setCurrentStep(2)}
               style={{ cursor: documentType ? 'pointer' : 'default' }}
             >
               <div className="step-number">2</div>
               <div className="step-label">
                 {getFormComponent(documentType)?.name?.replace('Form', '') || 'Details'}
               </div>
             </div>
             {/* Step 3 */} 
             <div 
               className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}
               onClick={() => documentType && setCurrentStep(3)}
               style={{ cursor: documentType ? 'pointer' : 'default' }}
             >
               <div className="step-number">3</div>
               <div className="step-label">Review & Save</div>
             </div>
           </div>
           <div className="progress-bar">
             <div className="progress-indicator" style={{ width: `${(currentStep - 1) * 50}%` }} />
           </div>
        </div>
        
        {/* Loading overlay during submission */}
        {isSubmitting && (
          <div className="loading-overlay">
            <LoadingSpinner />
            <div className="loading-message">Saving your draft...</div>
          </div>
        )}
        
        {/* Display local wizard errors */}
        {wizardError && <ErrorMessage message={wizardError} />}
        
        {/* Render the current step form */}
        <div className="wizard-content">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default FormWizardPage;
