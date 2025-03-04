import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentContext } from '../context/DocumentContext';
import { DOCUMENT_TYPES } from '../constants/documentTypes';
import DocumentTypeSelector from '../components/forms/DocumentTypeSelector';
import BusinessProfileForm from '../components/forms/BusinessProfileForm';
import TargetMarketAudienceForm from '../components/forms/TargetMarketAudienceForm';
import StyleGuideForm from '../components/forms/StyleGuideForm';
import PersonalBioForm from '../components/forms/PersonalBioForm';
import ReviewForm from '../components/forms/ReviewForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Multi-step form wizard for generating documents
 */
const FormWizardPage = () => {
  const navigate = useNavigate();
  const { generateDocument, isGenerating, error } = useContext(DocumentContext);
  
  // Current step in the wizard
  const [currentStep, setCurrentStep] = useState(1);
  
  // Combined form data
  const [formData, setFormData] = useState({});
  
  // Selected document type
  const [documentType, setDocumentType] = useState('');
  
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
        ...data
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
  
  // Handle form submission to generate document
  const handleSubmit = async () => {
    const result = await generateDocument(formData, documentType);
    
    if (result) {
      // Navigate to results page
      navigate('/document-result');
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
          onSubmit={handleSubmit}
          isSubmitting={isGenerating}
        />
      );
    }
    
    // Step 2 changes based on the selected document type
    if (currentStep === 2) {
      switch (documentType) {
        case DOCUMENT_TYPES.BUSINESS_PROFILE:
          return (
            <BusinessProfileForm 
              initialData={formData}
              onSubmit={handleNext}
              onBack={handleBack}
            />
          );
        case DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE:
          return (
            <TargetMarketAudienceForm 
              initialData={formData}
              onSubmit={handleNext}
              onBack={handleBack}
            />
          );
        case DOCUMENT_TYPES.STYLE_GUIDE:
          return (
            <StyleGuideForm 
              initialData={formData}
              onSubmit={handleNext}
              onBack={handleBack}
            />
          );
        case DOCUMENT_TYPES.PERSONAL_BIO:
          return (
            <PersonalBioForm 
              initialData={formData}
              onSubmit={handleNext}
              onBack={handleBack}
            />
          );
        default:
          return <div>Please select a document type first</div>;
      }
    }
    
    return <div>Unknown step</div>;
  };
  
  return (
    <div className="page-container">
      <div className="wizard-container">
        <div className="wizard-progress">
          <div className="progress-steps">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Document Type</div>
            </div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">
                {documentType === DOCUMENT_TYPES.BUSINESS_PROFILE && 'Business Profile'}
                {documentType === DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE && 'Audience Profile'}
                {documentType === DOCUMENT_TYPES.STYLE_GUIDE && 'Style Guide'}
                {documentType === DOCUMENT_TYPES.PERSONAL_BIO && 'Personal Bio'}
                {!documentType && 'Document Details'}
              </div>
            </div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Review</div>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-indicator" 
              style={{ width: `${(currentStep - 1) * 50}%` }} 
            />
          </div>
        </div>
        
        {isGenerating && (
          <div className="loading-overlay">
            <LoadingSpinner />
            <div className="loading-message">
              Forging your document. This may take a minute...
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