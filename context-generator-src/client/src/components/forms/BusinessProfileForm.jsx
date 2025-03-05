import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormSection from './FormSection';
import '../../styles/forms.css';

/**
 * Business Dimensional Profile form component with multi-step wizard
 */
const BusinessProfileForm = ({ initialData = {}, onSubmit, onBack }) => {
  // Form sections list with their fields
  const formSections = [
    {
      id: 'company-identity',
      title: "Company Identity",
      description: "Tell us the basics about your business",
      fields: ['companyName', 'businessDescription', 'businessDuration', 'businessStage']
    },
    {
      id: 'mission-vision',
      title: "Mission & Vision",
      description: "Help us understand your purpose and direction",
      fields: ['coreProblem', 'missionStatement', 'futureVision']
    },
    {
      id: 'audience-market',
      title: "Audience & Market",
      description: "Tell us about your customers and market",
      fields: ['primaryCustomers', 'customerChallenges', 'customerChoiceReason']
    },
    {
      id: 'products-services',
      title: "Products & Services",
      description: "Tell us about what you offer",
      fields: ['mainProducts', 'uniqueBenefit', 'specialMethods']
    },
    {
      id: 'customer-journey',
      title: "Customer Journey & Experience",
      description: "Describe how customers interact with your business",
      fields: ['customerJourney', 'customerDiscovery', 'postPurchaseSupport']
    },
    {
      id: 'sales-marketing',
      title: "Sales & Marketing",
      description: "How you find and convert customers",
      fields: ['customerAcquisition', 'salesProcess', 'effectiveChannels', 'leadNurturing']
    },
    {
      id: 'values-identity',
      title: "Values & Brand Identity",
      description: "What your business stands for",
      fields: ['coreValues', 'valueImplementation', 'brandImpression']
    },
    {
      id: 'operations-team',
      title: "Operations & Team",
      description: "How your business runs day-to-day",
      fields: ['teamSize', 'operationalProcesses', 'essentialTools']
    },
    {
      id: 'goals-growth',
      title: "Goals & Growth",
      description: "Your business objectives and growth plans",
      fields: ['yearlyGoals', 'fiveYearVision', 'growthChallenges']
    },
    {
      id: 'financial-pricing',
      title: "Financial Health & Pricing",
      description: "Your business model and pricing approach",
      fields: ['revenueModel', 'pricingModel', 'marketComparison']
    },
    {
      id: 'competitive-positioning',
      title: "Competitive Positioning",
      description: "How you position against competitors",
      fields: ['competitors', 'competitiveAdvantage', 'industryAdaptation']
    },
    {
      id: 'ethics-community',
      title: "Ethics & Community",
      description: "Your values and community involvement",
      fields: ['ethicalPractices', 'businessAuthenticity', 'communityInitiatives']
    },
    {
      id: 'additional-insights',
      title: "Additional Insights (Optional)",
      description: "Anything else you'd like to add",
      fields: ['additionalInfo', 'aiGuidance']
    }
  ];

  // Current section index
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    // Company Identity
    companyName: '',
    businessDescription: '',
    businessDuration: '',
    businessStage: '',
    
    // Mission & Vision
    coreProblem: '',
    missionStatement: '',
    futureVision: '',
    
    // Audience & Market
    primaryCustomers: '',
    customerChallenges: '',
    customerChoiceReason: '',
    
    // Products & Services
    mainProducts: '',
    uniqueBenefit: '',
    specialMethods: '',
    
    // Customer Journey & Experience
    customerJourney: '',
    customerDiscovery: '',
    postPurchaseSupport: '',
    
    // Sales & Marketing
    customerAcquisition: '',
    salesProcess: '',
    effectiveChannels: '',
    leadNurturing: '',
    
    // Values & Brand Identity
    coreValues: '',
    valueImplementation: '',
    brandImpression: '',
    
    // Operations & Team
    teamSize: '',
    operationalProcesses: '',
    essentialTools: '',
    
    // Goals & Growth
    yearlyGoals: '',
    fiveYearVision: '',
    growthChallenges: '',
    
    // Financial Health & Pricing
    revenueModel: '',
    pricingModel: '',
    marketComparison: '',
    
    // Competitive Positioning
    competitors: '',
    competitiveAdvantage: '',
    industryAdaptation: '',
    
    // Ethics & Community
    ethicalPractices: '',
    businessAuthenticity: '',
    communityInitiatives: '',
    
    // Additional Insights
    additionalInfo: '',
    aiGuidance: '',
    
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

  // Validate current section fields
  const validateCurrentSection = () => {
    const newErrors = {};
    const currentSectionFields = formSections[currentSectionIndex].fields;
    const requiredFields = ['companyName', 'businessDescription'];
    
    // Only validate fields in the current section that are required
    currentSectionFields.forEach(field => {
      if (requiredFields.includes(field) && !formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate entire form data before final submission
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['companyName', 'businessDescription'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle navigation to next section
  const handleNext = () => {
    if (validateCurrentSection()) {
      // If we're at the last section, submit the form
      if (currentSectionIndex === formSections.length - 1) {
        if (validateForm()) {
          onSubmit(formData);
        }
      } else {
        // Otherwise, move to the next section
        setCurrentSectionIndex(prevIndex => prevIndex + 1);
        // Scroll to top of form only when moving to next section
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.field-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Handle navigation to previous section
  const handlePrevious = () => {
    if (currentSectionIndex === 0) {
      // If we're at the first section, go back to document type selection
      onBack();
    } else {
      // Otherwise, move to the previous section
      setCurrentSectionIndex(prevIndex => prevIndex - 1);
      // Don't scroll when moving to previous section, stay at current position
    }
  };

  // Calculate progress percentage for progress bar
  const progressPercentage = ((currentSectionIndex) / (formSections.length - 1)) * 100;

  // Get the current section
  const currentSection = formSections[currentSectionIndex];

  // Render form fields for the current section
  const renderFormFields = () => {
    switch (currentSection.id) {
      case 'company-identity':
        return (
          <>
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
              id="businessDescription"
              label="Briefly describe what your business does"
              type="textarea"
              value={formData.businessDescription}
              onChange={handleChange}
              placeholder="Elevator pitch, in plain language"
              required
              error={errors.businessDescription}
              rows={3}
            />
            
            <FormField
              id="businessDuration"
              label="How long have you been in business?"
              value={formData.businessDuration}
              onChange={handleChange}
              placeholder="e.g., 3 years, 6 months, etc."
            />
            
            <FormField
              id="businessStage"
              label="What stage best describes your business?"
              type="select"
              value={formData.businessStage}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select a stage' },
                { value: 'early-stage', label: 'Early-stage' },
                { value: 'growing', label: 'Growing' },
                { value: 'established', label: 'Established' }
              ]}
            />
          </>
        );
      
      case 'mission-vision':
        return (
          <>
            <FormField
              id="coreProblem"
              label="What core problem does your business solve for your customers?"
              type="textarea"
              value={formData.coreProblem}
              onChange={handleChange}
              placeholder="Describe the main problem you help customers solve"
              rows={3}
            />
            
            <FormField
              id="missionStatement"
              label="Describe your mission in one simple sentence"
              value={formData.missionStatement}
              onChange={handleChange}
              placeholder="Your purpose statement"
            />
            
            <FormField
              id="futureVision"
              label="What's your big-picture vision for the future?"
              type="textarea"
              value={formData.futureVision}
              onChange={handleChange}
              placeholder="Where do you want your business to be in the long-term?"
              rows={3}
            />
          </>
        );

      case 'audience-market':
        return (
          <>
            <FormField
              id="primaryCustomers"
              label="Who are your primary customers or clients?"
              type="textarea"
              value={formData.primaryCustomers}
              onChange={handleChange}
              placeholder="Briefly describe your main audience"
              rows={3}
            />
            
            <FormField
              id="customerChallenges"
              label="List 2-3 specific problems or challenges your customers face"
              type="textarea"
              value={formData.customerChallenges}
              onChange={handleChange}
              placeholder="What pain points do you address for your customers?"
              rows={3}
            />
            
            <FormField
              id="customerChoiceReason"
              label="What makes your customers choose your business over others?"
              type="textarea"
              value={formData.customerChoiceReason}
              onChange={handleChange}
              placeholder="Why do customers pick you instead of competitors?"
              rows={3}
            />
          </>
        );

      case 'products-services':
        return (
          <>
            <FormField
              id="mainProducts"
              label="List your main products or services"
              type="textarea"
              value={formData.mainProducts}
              onChange={handleChange}
              placeholder="Short descriptions of what you offer"
              rows={3}
            />
            
            <FormField
              id="uniqueBenefit"
              label="What unique benefit do you offer that your competitors don't?"
              type="textarea"
              value={formData.uniqueBenefit}
              onChange={handleChange}
              placeholder="Your key differentiator or unique selling proposition"
              rows={3}
            />
            
            <FormField
              id="specialMethods"
              label="Are there specific methods, tools, or processes you use that customers appreciate most?"
              type="textarea"
              value={formData.specialMethods}
              onChange={handleChange}
              placeholder="Unique approaches or methodologies you employ"
              rows={3}
            />
          </>
        );

      case 'customer-journey':
        return (
          <>
            <FormField
              id="customerJourney"
              label="Briefly describe your customer's experience from discovering you to becoming satisfied customers"
              type="textarea"
              value={formData.customerJourney}
              onChange={handleChange}
              placeholder="Think about interactions, onboarding, and support"
              rows={3}
            />
            
            <FormField
              id="customerDiscovery"
              label="How do customers typically find you?"
              type="textarea"
              value={formData.customerDiscovery}
              onChange={handleChange}
              placeholder="Social media, referrals, ads, etc."
              rows={2}
            />
            
            <FormField
              id="postPurchaseSupport"
              label="What kind of support or resources do you provide after someone buys from you?"
              type="textarea"
              value={formData.postPurchaseSupport}
              onChange={handleChange}
              placeholder="Post-purchase care, follow-ups, resources, etc."
              rows={3}
            />
          </>
        );

      case 'sales-marketing':
        return (
          <>
            <FormField
              id="customerAcquisition"
              label="Where and how do you usually find new customers?"
              type="textarea"
              value={formData.customerAcquisition}
              onChange={handleChange}
              placeholder="Lead generation strategies and channels"
              rows={3}
            />
            
            <FormField
              id="salesProcess"
              label="Describe your typical sales process or customer journey"
              type="textarea"
              value={formData.salesProcess}
              onChange={handleChange}
              placeholder="Steps from awareness to purchase"
              rows={3}
            />
            
            <FormField
              id="effectiveChannels"
              label="What marketing channels are most effective for you right now?"
              type="textarea"
              value={formData.effectiveChannels}
              onChange={handleChange}
              placeholder="Social media, email, events, etc."
              rows={2}
            />
            
            <FormField
              id="leadNurturing"
              label="How do you stay connected with potential customers who aren't ready to buy yet?"
              type="textarea"
              value={formData.leadNurturing}
              onChange={handleChange}
              placeholder="Lead nurturing strategies"
              rows={3}
            />
          </>
        );

      case 'values-identity':
        return (
          <>
            <FormField
              id="coreValues"
              label="What values are most important to your business?"
              type="textarea"
              value={formData.coreValues}
              onChange={handleChange}
              placeholder="Choose 3–5 simple words or phrases"
              rows={2}
            />
            
            <FormField
              id="valueImplementation"
              label="How do these values show up in the way you run your business?"
              type="textarea"
              value={formData.valueImplementation}
              onChange={handleChange}
              placeholder="How you put your values into practice"
              rows={3}
            />
            
            <FormField
              id="brandImpression"
              label="What kind of feeling or impression do you want your brand to create?"
              type="textarea"
              value={formData.brandImpression}
              onChange={handleChange}
              placeholder="Emotions or perceptions you want to evoke"
              rows={3}
            />
          </>
        );

      case 'operations-team':
        return (
          <>
            <FormField
              id="teamSize"
              label="How many people are currently on your team?"
              value={formData.teamSize}
              onChange={handleChange}
              placeholder="Current team size"
            />
            
            <FormField
              id="operationalProcesses"
              label="Describe how your business typically gets things done"
              type="textarea"
              value={formData.operationalProcesses}
              onChange={handleChange}
              placeholder="Roles, processes, collaboration methods"
              rows={3}
            />
            
            <FormField
              id="essentialTools"
              label="Are there key tools or systems your business can't operate without?"
              type="textarea"
              value={formData.essentialTools}
              onChange={handleChange}
              placeholder="e.g., software, apps, platforms"
              rows={2}
            />
          </>
        );

      case 'goals-growth':
        return (
          <>
            <FormField
              id="yearlyGoals"
              label="What are your top goals for the next year?"
              type="textarea"
              value={formData.yearlyGoals}
              onChange={handleChange}
              placeholder="Keep it simple, just a few bullet points"
              rows={3}
            />
            
            <FormField
              id="fiveYearVision"
              label="What would you like your business to look like in 3–5 years?"
              type="textarea"
              value={formData.fiveYearVision}
              onChange={handleChange}
              placeholder="Medium-term vision and goals"
              rows={3}
            />
            
            <FormField
              id="growthChallenges"
              label="Are there specific challenges or obstacles you see in your growth?"
              type="textarea"
              value={formData.growthChallenges}
              onChange={handleChange}
              placeholder="Potential barriers to achieving your goals"
              rows={3}
            />
          </>
        );

      case 'financial-pricing':
        return (
          <>
            <FormField
              id="revenueModel"
              label="Briefly explain how your business makes money"
              type="textarea"
              value={formData.revenueModel}
              onChange={handleChange}
              placeholder="e.g., sales, subscriptions, consulting fees"
              rows={2}
            />
            
            <FormField
              id="pricingModel"
              label="What pricing model(s) do you use?"
              type="textarea"
              value={formData.pricingModel}
              onChange={handleChange}
              placeholder="One-time, monthly, annual, etc."
              rows={2}
            />
            
            <FormField
              id="marketComparison"
              label="How do your prices compare to others in your market?"
              type="select"
              value={formData.marketComparison}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select an option' },
                { value: 'lower', label: 'Lower than competitors' },
                { value: 'competitive', label: 'Competitive with market rates' },
                { value: 'premium', label: 'Premium pricing' }
              ]}
            />
          </>
        );

      case 'competitive-positioning':
        return (
          <>
            <FormField
              id="competitors"
              label="Name 1–3 competitors you frequently encounter"
              type="textarea"
              value={formData.competitors}
              onChange={handleChange}
              placeholder="Main competitors in your space"
              rows={2}
            />
            
            <FormField
              id="competitiveAdvantage"
              label="What is one thing you do better or differently from each competitor?"
              type="textarea"
              value={formData.competitiveAdvantage}
              onChange={handleChange}
              placeholder="Your advantages compared to competitors"
              rows={3}
            />
            
            <FormField
              id="industryAdaptation"
              label="How do you stay competitive as your industry evolves?"
              type="textarea"
              value={formData.industryAdaptation}
              onChange={handleChange}
              placeholder="How you adapt to industry changes"
              rows={3}
            />
          </>
        );

      case 'ethics-community':
        return (
          <>
            <FormField
              id="ethicalPractices"
              label="Describe any causes, communities, or ethical practices important to your business"
              type="textarea"
              value={formData.ethicalPractices}
              onChange={handleChange}
              placeholder="Important causes or ethical priorities"
              rows={3}
            />
            
            <FormField
              id="businessAuthenticity"
              label="How do you make sure your business stays responsible or authentic?"
              type="textarea"
              value={formData.businessAuthenticity}
              onChange={handleChange}
              placeholder="Practices that maintain integrity"
              rows={3}
            />
            
            <FormField
              id="communityInitiatives"
              label="Do you actively give back or support community initiatives? If so, how?"
              type="textarea"
              value={formData.communityInitiatives}
              onChange={handleChange}
              placeholder="Community support or initiatives"
              rows={3}
            />
          </>
        );

      case 'additional-insights':
        return (
          <>
            <FormField
              id="additionalInfo"
              label="Are there specific things you want people to know about your business that haven't been covered yet?"
              type="textarea"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any other important information"
              rows={3}
            />
            
            <FormField
              id="aiGuidance"
              label="Anything you'd like AI to focus on (or avoid) when creating content or messaging for your business?"
              type="textarea"
              value={formData.aiGuidance}
              onChange={handleChange}
              placeholder="Guidance for AI systems working with your business"
              rows={3}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Business Dimensional Profile</h2>
        <p>Please provide information about your business to create a comprehensive AI-optimized profile.</p>
      </div>
      
      {/* Section indicators (above form) */}
      <div className="section-indicators">
        <div className="current-section">
          <h3>{currentSection.title}</h3>
          <p>{currentSection.description}</p>
        </div>
        <div className="section-counter">
          Step {currentSectionIndex + 1} of {formSections.length}
        </div>
      </div>
      
      {/* Current form section */}
      <form onSubmit={(e) => e.preventDefault()}>
        <FormSection showDivider={false}>
          {renderFormFields()}
        </FormSection>
        
        {/* Navigation buttons */}
        <div className="form-navigation">
          <button 
            type="button" 
            className="back-button"
            onClick={handlePrevious}
          >
            {currentSectionIndex === 0 ? 'Back to Document Types' : 'Previous'}
          </button>
          <button 
            type="button" 
            className="next-button"
            onClick={handleNext}
          >
            {currentSectionIndex === formSections.length - 1 ? 'Next' : 'Next'}
          </button>
        </div>
      </form>
      
      {/* Progress bar (bottom of form) */}
      <div className="form-progress-bar">
        <div className="progress-indicator" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      {/* Section dots navigation */}
      <div className="section-dots">
        {formSections.map((section, index) => (
          <button
            key={section.id}
            className={`section-dot ${index === currentSectionIndex ? 'active' : ''}`}
            onClick={() => setCurrentSectionIndex(index)}
            title={section.title}
          />
        ))}
      </div>
    </div>
  );
};

export default BusinessProfileForm;