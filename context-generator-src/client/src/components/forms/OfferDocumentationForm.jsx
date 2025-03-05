import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormSection from './FormSection';
import '../../styles/forms.css';

/**
 * Offer Documentation Brief form component
 */
const OfferDocumentationForm = ({ initialData = {}, onSubmit, onBack }) => {
  // Form state
  const [formData, setFormData] = useState({
    // Offer Overview
    offerName: '',
    offerType: '',
    coreTransformation: '',
    businessModelFit: '',
    uniqueSellingProposition: '',
    keyBenefits: '',
    
    // Ideal Customer & Market Fit
    primaryAudience: '',
    topPainPoints: '',
    aspirationsGoals: '',
    audienceAwareness: '',
    problemUrgency: '',
    alternativeSolutions: '',
    
    // Core Features & Deliverables
    keyFeatures: '',
    tangibleDeliverables: '',
    deliveryProcess: '',
    customerExperienceJourney: '',
    optionalAddons: '',
    aiAutomationRole: '',
    
    // Pricing & Value Justification
    pricingModel: '',
    valueJustification: '',
    competitorComparison: '',
    paymentsGuarantees: '',
    priceObjections: '',
    expectedROI: '',
    
    // Sales & Conversion Strategy
    conversionMechanism: '',
    persuasiveElements: '',
    commonObjections: '',
    leadNurturing: '',
    followupSequences: '',
    guaranteeStrategy: '',
    
    // Offer Positioning & Competitive Edge
    competitors: '',
    uniquePositioning: '',
    brandPerspective: '',
    competitiveEdge: '',
    industryTrends: '',
    
    // Delivery, Support & Customer Success
    deliveryTimeline: '',
    customerSupport: '',
    onboardingMaterials: '',
    customerSuccessRate: '',
    feedbackSystems: '',
    refundPolicy: '',
    
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
    const requiredFields = ['offerName', 'offerType', 'coreTransformation', 'primaryAudience', 'topPainPoints'];
    
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
  
  // Options for select fields
  const offerTypeOptions = [
    { value: 'product', label: 'Product' },
    { value: 'service', label: 'Service' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'hybrid', label: 'Hybrid/Bundle' },
    { value: 'course', label: 'Course/Training' },
    { value: 'membership', label: 'Membership' },
    { value: 'consulting', label: 'Consulting' }
  ];
  
  const awarenessOptions = [
    { value: 'cold', label: 'Cold (Unaware of problem)' },
    { value: 'problem-aware', label: 'Problem-Aware (Know problem, not solution)' },
    { value: 'solution-aware', label: 'Solution-Aware (Know solutions exist)' },
    { value: 'product-aware', label: 'Product-Aware (Know your product)' },
    { value: 'most-aware', label: 'Most Aware (Ready to buy)' }
  ];
  
  const urgencyOptions = [
    { value: 'immediate', label: 'Immediate (Must solve now)' },
    { value: 'short-term', label: 'Short-term (Within weeks)' },
    { value: 'medium-term', label: 'Medium-term (Within months)' },
    { value: 'long-term', label: 'Long-term (Eventually)' },
    { value: 'aspirational', label: 'Aspirational (Nice to have)' }
  ];
  
  const pricingModelOptions = [
    { value: 'one-time', label: 'One-time Payment' },
    { value: 'recurring', label: 'Recurring Subscription' },
    { value: 'tiered', label: 'Tiered Pricing' },
    { value: 'usage-based', label: 'Usage-based' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'payment-plan', label: 'Payment Plan' }
  ];
  
  const conversionMechanismOptions = [
    { value: 'sales-page', label: 'Sales Page' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'discovery-call', label: 'Discovery Call' },
    { value: 'demo', label: 'Product Demo' },
    { value: 'free-trial', label: 'Free Trial' },
    { value: 'email-sequence', label: 'Email Sequence' },
    { value: 'video-series', label: 'Video Series' }
  ];

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Offer Documentation Brief</h2>
        <p>Please provide detailed information about your offer to create a comprehensive brief.</p>
      </div>
      
      <FormSection 
        title="Offer Overview"
        description="Basic information about your offer and its value proposition"
      >
        <FormField
          id="offerName"
          label="What is the name of your offer?"
          value={formData.offerName}
          onChange={handleChange}
          placeholder="Enter your offer name"
          required
          error={errors.offerName}
        />
        
        <FormField
          id="offerType"
          label="Is this a product, service, subscription, or hybrid?"
          type="select"
          value={formData.offerType}
          onChange={handleChange}
          options={offerTypeOptions}
          required
          error={errors.offerType}
        />
        
        <FormField
          id="coreTransformation"
          label="What is the core transformation or outcome this offer provides?"
          type="textarea"
          value={formData.coreTransformation}
          onChange={handleChange}
          placeholder="Describe the primary transformation or outcome customers will experience"
          required
          error={errors.coreTransformation}
          rows={4}
        />
        
        <FormField
          id="businessModelFit"
          label="How does this offer fit into your broader business model?"
          type="textarea"
          value={formData.businessModelFit}
          onChange={handleChange}
          placeholder="Explain how this offer relates to your overall business strategy"
          rows={3}
        />
        
        <FormField
          id="uniqueSellingProposition"
          label="What is the unique selling proposition (USP) of this offer?"
          type="textarea"
          value={formData.uniqueSellingProposition}
          onChange={handleChange}
          placeholder="Describe what makes your offer uniquely valuable"
          rows={3}
        />
        
        <FormField
          id="keyBenefits"
          label="What are the key benefits that differentiate this offer from competitors?"
          type="textarea"
          value={formData.keyBenefits}
          onChange={handleChange}
          placeholder="List the main benefits that set your offer apart"
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Ideal Customer & Market Fit"
        description="Who your offer serves and why it's valuable to them"
      >
        <FormField
          id="primaryAudience"
          label="Who is the primary audience for this offer?"
          type="textarea"
          value={formData.primaryAudience}
          onChange={handleChange}
          placeholder="Describe demographics, psychographics, industry, etc."
          required
          error={errors.primaryAudience}
          rows={4}
        />
        
        <FormField
          id="topPainPoints"
          label="What are the top 3 pain points this offer solves for them?"
          type="textarea"
          value={formData.topPainPoints}
          onChange={handleChange}
          placeholder="List the key problems your customers face that your offer solves"
          required
          error={errors.topPainPoints}
          rows={4}
        />
        
        <FormField
          id="aspirationsGoals"
          label="What aspirations, desires, or goals does this offer help them achieve?"
          type="textarea"
          value={formData.aspirationsGoals}
          onChange={handleChange}
          placeholder="Describe the positive outcomes customers desire"
          rows={4}
        />
        
        <FormField
          id="audienceAwareness"
          label="What level of awareness does your audience have about this type of offer?"
          type="select"
          value={formData.audienceAwareness}
          onChange={handleChange}
          options={awarenessOptions}
        />
        
        <FormField
          id="problemUrgency"
          label="How urgent is the problem this offer solves?"
          type="select"
          value={formData.problemUrgency}
          onChange={handleChange}
          options={urgencyOptions}
        />
        
        <FormField
          id="alternativeSolutions"
          label="How does this offer compare to alternative solutions your audience may consider?"
          type="textarea"
          value={formData.alternativeSolutions}
          onChange={handleChange}
          placeholder="Compare your offer to other solutions in the market"
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Core Features & Deliverables"
        description="What customers receive and how it's delivered"
      >
        <FormField
          id="keyFeatures"
          label="What are the key features or components of this offer?"
          type="textarea"
          value={formData.keyFeatures}
          onChange={handleChange}
          placeholder="List the main features that make up your offer"
          rows={4}
        />
        
        <FormField
          id="tangibleDeliverables"
          label="What are the tangible deliverables included?"
          type="textarea"
          value={formData.tangibleDeliverables}
          onChange={handleChange}
          placeholder="Describe what customers physically or digitally receive"
          rows={4}
        />
        
        <FormField
          id="deliveryProcess"
          label="How does the delivery process work?"
          type="textarea"
          value={formData.deliveryProcess}
          onChange={handleChange}
          placeholder="Provide a step-by-step breakdown of fulfillment"
          rows={4}
        />
        
        <FormField
          id="customerExperienceJourney"
          label="What is the customer experience journey from purchase to results?"
          type="textarea"
          value={formData.customerExperienceJourney}
          onChange={handleChange}
          placeholder="Outline the customer's journey after purchasing"
          rows={4}
        />
        
        <FormField
          id="optionalAddons"
          label="What optional add-ons or upgrades are available?"
          type="textarea"
          value={formData.optionalAddons}
          onChange={handleChange}
          placeholder="Describe any additional options customers can add"
          rows={3}
        />
        
        <FormField
          id="aiAutomationRole"
          label="How does AI or automation play a role in the delivery (if applicable)?"
          type="textarea"
          value={formData.aiAutomationRole}
          onChange={handleChange}
          placeholder="Explain any AI or automation components"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Pricing & Value Justification"
        description="How your offer is priced and why it's worth it"
      >
        <FormField
          id="pricingModel"
          label="What is the pricing model?"
          type="select"
          value={formData.pricingModel}
          onChange={handleChange}
          options={pricingModelOptions}
        />
        
        <FormField
          id="valueJustification"
          label="What justifies the price in relation to its value?"
          type="textarea"
          value={formData.valueJustification}
          onChange={handleChange}
          placeholder="Explain why your offer is worth the price"
          rows={4}
        />
        
        <FormField
          id="competitorComparison"
          label="How does the cost compare to competitors or alternatives?"
          type="textarea"
          value={formData.competitorComparison}
          onChange={handleChange}
          placeholder="Compare your pricing to alternatives in the market"
          rows={3}
        />
        
        <FormField
          id="paymentsGuarantees"
          label="Do you offer payment plans, trials, or guarantees?"
          type="textarea"
          value={formData.paymentsGuarantees}
          onChange={handleChange}
          placeholder="Describe payment options and guarantees"
          rows={3}
        />
        
        <FormField
          id="priceObjections"
          label="What objections do customers have about the price, and how do you handle them?"
          type="textarea"
          value={formData.priceObjections}
          onChange={handleChange}
          placeholder="List common price objections and your responses"
          rows={4}
        />
        
        <FormField
          id="expectedROI"
          label="What ROI (Return on Investment) or savings can customers expect?"
          type="textarea"
          value={formData.expectedROI}
          onChange={handleChange}
          placeholder="Describe the financial benefits customers will receive"
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Sales & Conversion Strategy"
        description="How you convert prospects into customers"
      >
        <FormField
          id="conversionMechanism"
          label="What is the primary conversion mechanism?"
          type="select"
          value={formData.conversionMechanism}
          onChange={handleChange}
          options={conversionMechanismOptions}
        />
        
        <FormField
          id="persuasiveElements"
          label="What persuasive elements are included in the pitch?"
          type="textarea"
          value={formData.persuasiveElements}
          onChange={handleChange}
          placeholder="Describe testimonials, social proof, urgency tactics, bonuses, etc."
          rows={4}
        />
        
        <FormField
          id="commonObjections"
          label="What objections commonly arise, and how are they addressed?"
          type="textarea"
          value={formData.commonObjections}
          onChange={handleChange}
          placeholder="List common objections and your responses"
          rows={4}
        />
        
        <FormField
          id="leadNurturing"
          label="How do you nurture leads who don't convert immediately?"
          type="textarea"
          value={formData.leadNurturing}
          onChange={handleChange}
          placeholder="Describe your lead nurturing approach"
          rows={3}
        />
        
        <FormField
          id="followupSequences"
          label="What are the follow-up sequences or automations in place?"
          type="textarea"
          value={formData.followupSequences}
          onChange={handleChange}
          placeholder="Outline email sequences, retargeting, etc."
          rows={3}
        />
        
        <FormField
          id="guaranteeStrategy"
          label="What kind of guarantee or risk-reversal strategy do you offer?"
          type="textarea"
          value={formData.guaranteeStrategy}
          onChange={handleChange}
          placeholder="Describe your guarantee or risk-reversal approach"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Offer Positioning & Competitive Edge"
        description="How your offer stands out in the marketplace"
      >
        <FormField
          id="competitors"
          label="Who are your direct and indirect competitors?"
          type="textarea"
          value={formData.competitors}
          onChange={handleChange}
          placeholder="List your main competitors"
          rows={3}
        />
        
        <FormField
          id="uniquePositioning"
          label="How is your offer positioned uniquely against them?"
          type="textarea"
          value={formData.uniquePositioning}
          onChange={handleChange}
          placeholder="Explain your unique market position"
          rows={4}
        />
        
        <FormField
          id="brandPerspective"
          label="What is your brand's unique perspective on this problem/solution?"
          type="textarea"
          value={formData.brandPerspective}
          onChange={handleChange}
          placeholder="Describe your brand's philosophy or approach"
          rows={4}
        />
        
        <FormField
          id="competitiveEdge"
          label="How do you ensure your offer remains competitive over time?"
          type="textarea"
          value={formData.competitiveEdge}
          onChange={handleChange}
          placeholder="Explain how you maintain a competitive advantage"
          rows={3}
        />
        
        <FormField
          id="industryTrends"
          label="What trends in your industry may impact this offer's positioning?"
          type="textarea"
          value={formData.industryTrends}
          onChange={handleChange}
          placeholder="Identify relevant industry trends"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Delivery, Support & Customer Success"
        description="How you ensure customer satisfaction and results"
        showDivider={false}
      >
        <FormField
          id="deliveryTimeline"
          label="What is the expected timeline for delivery/results?"
          type="textarea"
          value={formData.deliveryTimeline}
          onChange={handleChange}
          placeholder="Describe when customers can expect results"
          rows={3}
        />
        
        <FormField
          id="customerSupport"
          label="What level of customer support is provided?"
          type="textarea"
          value={formData.customerSupport}
          onChange={handleChange}
          placeholder="Detail support options (email, chat, coaching, community, etc.)"
          rows={3}
        />
        
        <FormField
          id="onboardingMaterials"
          label="What onboarding materials or training do you provide?"
          type="textarea"
          value={formData.onboardingMaterials}
          onChange={handleChange}
          placeholder="List resources provided to new customers"
          rows={3}
        />
        
        <FormField
          id="customerSuccessRate"
          label="How do you ensure high customer success rates?"
          type="textarea"
          value={formData.customerSuccessRate}
          onChange={handleChange}
          placeholder="Describe strategies for ensuring customer success"
          rows={3}
        />
        
        <FormField
          id="feedbackSystems"
          label="What systems are in place for collecting feedback and testimonials?"
          type="textarea"
          value={formData.feedbackSystems}
          onChange={handleChange}
          placeholder="Outline your feedback collection process"
          rows={3}
        />
        
        <FormField
          id="refundPolicy"
          label="What happens if a customer wants a refund or cancellation?"
          type="textarea"
          value={formData.refundPolicy}
          onChange={handleChange}
          placeholder="Describe your refund or cancellation policy"
          rows={3}
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

export default OfferDocumentationForm;