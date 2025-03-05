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

  // Validate form data
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
        <p>Please provide information about your business to create a comprehensive AI-optimized profile.</p>
      </div>
      
      {/* COMPANY IDENTITY */}
      <FormSection 
        title="Company Identity"
        description="Tell us the basics about your business"
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
      </FormSection>
      
      {/* MISSION & VISION */}
      <FormSection 
        title="Mission & Vision"
        description="Help us understand your purpose and direction"
      >
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
      </FormSection>
      
      {/* AUDIENCE & MARKET */}
      <FormSection 
        title="Audience & Market"
        description="Tell us about your customers and market"
      >
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
      </FormSection>
      
      {/* PRODUCTS & SERVICES */}
      <FormSection 
        title="Products & Services"
        description="Tell us about what you offer"
      >
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
      </FormSection>
      
      {/* CUSTOMER JOURNEY & EXPERIENCE */}
      <FormSection 
        title="Customer Journey & Experience"
        description="Describe how customers interact with your business"
      >
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
      </FormSection>
      
      {/* SALES & MARKETING */}
      <FormSection 
        title="Sales & Marketing"
        description="How you find and convert customers"
      >
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
      </FormSection>
      
      {/* VALUES & BRAND IDENTITY */}
      <FormSection 
        title="Values & Brand Identity"
        description="What your business stands for"
      >
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
      </FormSection>
      
      {/* OPERATIONS & TEAM */}
      <FormSection 
        title="Operations & Team"
        description="How your business runs day-to-day"
      >
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
      </FormSection>
      
      {/* GOALS & GROWTH */}
      <FormSection 
        title="Goals & Growth"
        description="Your business objectives and growth plans"
      >
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
      </FormSection>
      
      {/* FINANCIAL HEALTH & PRICING */}
      <FormSection 
        title="Financial Health & Pricing"
        description="Your business model and pricing approach"
      >
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
      </FormSection>
      
      {/* COMPETITIVE POSITIONING */}
      <FormSection 
        title="Competitive Positioning"
        description="How you position against competitors"
      >
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
      </FormSection>
      
      {/* ETHICS & COMMUNITY */}
      <FormSection 
        title="Ethics & Community"
        description="Your values and community involvement"
      >
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
      </FormSection>
      
      {/* ADDITIONAL INSIGHTS */}
      <FormSection 
        title="Additional Insights (Optional)"
        description="Anything else you'd like to add"
        showDivider={false}
      >
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