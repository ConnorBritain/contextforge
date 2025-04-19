import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormSection from './FormSection';
import '../../styles/forms.css';

/**
 * Sales Messaging Playbook form component
 */
const SalesMessagingPlaybookForm = ({ initialData = {}, onSubmit, onBack }) => {
  // Form state
  const [formData, setFormData] = useState({
    // Messaging Foundations
    offerDescription: '',
    valuePropositions: '',
    differentiation: '',
    coreMessage: '',
    
    // Audience Alignment
    idealCustomer: '',
    customerDesires: '',
    emotionsToEvoke: '',
    audienceObjections: '',
    audienceLanguage: '',
    
    // Messaging Strategy by Awareness Level
    unawareAudience: '',
    problemAwareAudience: '',
    solutionAwareAudience: '',
    productAwareAudience: '',
    readyToBuyAudience: '',
    
    // Conversion Triggers
    keyBenefits: '',
    objectionHandling: '',
    urgencyTriggers: '',
    proofElements: '',
    
    // Emotional & Psychological Appeal
    emotionalDrivers: '',
    emotionalJourney: '',
    effectiveStories: '',
    emotionalLogicalBalance: '',
    
    // Channel-Specific Messaging
    channelVariations: '',
    emailSubjectLines: '',
    socialMediaAds: '',
    salesPageHeadlines: '',
    presentationIntros: '',
    platformConsiderations: '',
    
    // Buyer Personas & Tailored Messaging
    buyerPersonas: '',
    personaMessagingAdjustments: '',
    personaSpecificPhrases: '',
    personaTestimonials: '',
    
    // Follow-Up & Retention Messaging
    leadNurturing: '',
    followUpSequence: '',
    postSaleValue: '',
    referralMessaging: '',
    
    // Messaging Style & Tone
    messagingTone: '',
    objectionTone: '',
    includedExcludedPhrases: '',
    
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
    const requiredFields = ['offerDescription', 'valuePropositions', 'idealCustomer'];
    
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
  const toneOptions = [
    { value: 'conversational', label: 'Conversational' },
    { value: 'professional', label: 'Professional' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'empathetic', label: 'Empathetic' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'educational', label: 'Educational' },
    { value: 'inspirational', label: 'Inspirational' }
  ];
  
  // REMOVED unused awarenessLevelOptions
  // const awarenessLevelOptions = [
  //   { value: 'unaware', label: 'Unaware (No knowledge of problem)' },
  //   { value: 'problem-aware', label: 'Problem Aware (Knows problem, not solutions)' },
  //   { value: 'solution-aware', label: 'Solution Aware (Knows solutions exist, not yours)' },
  //   { value: 'product-aware', label: 'Product Aware (Knows your solution, not convinced)' },
  //   { value: 'most-aware', label: 'Most Aware (Ready to buy)' }
  // ];
  
  // REMOVED unused emotionsOptions
  // const emotionsOptions = [
  //   { value: 'trust', label: 'Trust' },
  //   { value: 'hope', label: 'Hope' },
  //   { value: 'fear', label: 'Fear' },
  //   { value: 'excitement', label: 'Excitement' },
  //   { value: 'curiosity', label: 'Curiosity' },
  //   { value: 'relief', label: 'Relief' },
  //   { value: 'belonging', label: 'Belonging' },
  //   { value: 'pride', label: 'Pride' },
  //   { value: 'urgency', label: 'Urgency' }
  // ];

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Sales Messaging Playbook</h2>
        <p>Please provide information about your sales messaging to create a comprehensive playbook for consistent and effective communication.</p>
      </div>
      
      <FormSection 
        title="Messaging Foundations"
        description="Core elements of your offer messaging"
      >
        <FormField
          id="offerDescription"
          label="Describe your offer in one clear sentence"
          value={formData.offerDescription}
          onChange={handleChange}
          placeholder="Enter a concise description of your offer"
          required
          error={errors.offerDescription}
        />
        
        <FormField
          id="valuePropositions"
          label="What are your primary selling points or value propositions? (List 3-5)"
          type="textarea"
          value={formData.valuePropositions}
          onChange={handleChange}
          placeholder="List your main value propositions, one per line"
          required
          error={errors.valuePropositions}
          rows={4}
        />
        
        <FormField
          id="differentiation"
          label="What differentiates your offer from the competition?"
          type="textarea"
          value={formData.differentiation}
          onChange={handleChange}
          placeholder="Describe your unique selling points compared to competitors"
          rows={3}
        />
        
        <FormField
          id="coreMessage"
          label="What is your brand's core message or theme that must be consistently communicated?"
          type="textarea"
          value={formData.coreMessage}
          onChange={handleChange}
          placeholder="Describe the central message that should appear in all communications"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Audience Alignment"
        description="Understanding who you're speaking to and how to connect with them"
      >
        <FormField
          id="idealCustomer"
          label="Who is your ideal customer for this offer?"
          type="textarea"
          value={formData.idealCustomer}
          onChange={handleChange}
          placeholder="Describe demographic, psychographic, and professional characteristics"
          required
          error={errors.idealCustomer}
          rows={4}
        />
        
        <FormField
          id="customerDesires"
          label="What are your audience's main desires or aspirations related to your offer?"
          type="textarea"
          value={formData.customerDesires}
          onChange={handleChange}
          placeholder="Describe what your customers hope to achieve"
          rows={4}
        />
        
        <FormField
          id="emotionsToEvoke"
          label="Identify the emotions you want your messaging to evoke"
          type="textarea"
          value={formData.emotionsToEvoke}
          onChange={handleChange}
          placeholder="List the emotional responses you want to trigger"
          rows={3}
        />
        
        <FormField
          id="audienceObjections"
          label="What hesitations or objections does your audience typically have?"
          type="textarea"
          value={formData.audienceObjections}
          onChange={handleChange}
          placeholder="List common objections or concerns"
          rows={3}
        />
        
        <FormField
          id="audienceLanguage"
          label="What specific language resonates with your ideal customers?"
          type="textarea"
          value={formData.audienceLanguage}
          onChange={handleChange}
          placeholder="Include phrases, vocabulary, or terms that connect with your audience"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Messaging Strategy by Awareness Level"
        description="How to adapt your message based on audience familiarity"
      >
        <FormField
          id="unawareAudience"
          label="Unaware Audience: How do you introduce the problem your offer solves?"
          type="textarea"
          value={formData.unawareAudience}
          onChange={handleChange}
          placeholder="Describe your approach for people who don't know they have a problem"
          rows={3}
        />
        
        <FormField
          id="problemAwareAudience"
          label="Problem Aware Audience: How do you demonstrate urgency or importance?"
          type="textarea"
          value={formData.problemAwareAudience}
          onChange={handleChange}
          placeholder="Describe your approach for people who recognize the problem but don't know solutions exist"
          rows={3}
        />
        
        <FormField
          id="solutionAwareAudience"
          label="Solution Aware Audience: How do you position your offer as the ideal solution?"
          type="textarea"
          value={formData.solutionAwareAudience}
          onChange={handleChange}
          placeholder="Describe your approach for people who know solutions exist but not yours specifically"
          rows={3}
        />
        
        <FormField
          id="productAwareAudience"
          label="Product Aware Audience: How do you communicate the superiority of your solution specifically?"
          type="textarea"
          value={formData.productAwareAudience}
          onChange={handleChange}
          placeholder="Describe your approach for people who know your solution but aren't convinced yet"
          rows={3}
        />
        
        <FormField
          id="readyToBuyAudience"
          label="Ready-to-Buy Audience: What messaging or incentives trigger immediate conversion?"
          type="textarea"
          value={formData.readyToBuyAudience}
          onChange={handleChange}
          placeholder="Describe your approach for people who are ready to purchase"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Conversion Triggers"
        description="Elements that drive prospect action"
      >
        <FormField
          id="keyBenefits"
          label="What key benefits do you emphasize to drive immediate action?"
          type="textarea"
          value={formData.keyBenefits}
          onChange={handleChange}
          placeholder="List the benefits that most effectively drive conversions"
          rows={3}
        />
        
        <FormField
          id="objectionHandling"
          label="How do you handle objections proactively in messaging?"
          type="textarea"
          value={formData.objectionHandling}
          onChange={handleChange}
          placeholder="Describe your approach to addressing common objections before they arise"
          rows={3}
        />
        
        <FormField
          id="urgencyTriggers"
          label="What urgency or scarcity triggers do you use?"
          type="textarea"
          value={formData.urgencyTriggers}
          onChange={handleChange}
          placeholder="Describe limited-time offers, quantity limitations, bonuses, etc."
          rows={3}
        />
        
        <FormField
          id="proofElements"
          label="What evidence or proof do you provide?"
          type="textarea"
          value={formData.proofElements}
          onChange={handleChange}
          placeholder="Describe testimonials, case studies, statistics, demonstrations you use"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Emotional & Psychological Appeal"
        description="How you connect with customers on a deeper level"
      >
        <FormField
          id="emotionalDrivers"
          label="How does your messaging tap into customer emotions or psychological drivers?"
          type="textarea"
          value={formData.emotionalDrivers}
          onChange={handleChange}
          placeholder="Explain how you engage emotional motivations and psychological triggers"
          rows={4}
        />
        
        <FormField
          id="emotionalJourney"
          label="Describe the emotional journey you want your audience to experience"
          type="textarea"
          value={formData.emotionalJourney}
          onChange={handleChange}
          placeholder="Outline the emotional transformation from first touchpoint to conversion"
          rows={4}
        />
        
        <FormField
          id="effectiveStories"
          label="What stories or narratives have been most effective in your sales process?"
          type="textarea"
          value={formData.effectiveStories}
          onChange={handleChange}
          placeholder="Describe the key stories that connect with your audience"
          rows={4}
        />
        
        <FormField
          id="emotionalLogicalBalance"
          label="How do you balance emotional appeals with logical arguments?"
          type="textarea"
          value={formData.emotionalLogicalBalance}
          onChange={handleChange}
          placeholder="Explain your approach to combining emotional and rational appeals"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Channel-Specific Messaging"
        description="Adapting your message for different platforms and formats"
      >
        <FormField
          id="channelVariations"
          label="How does your sales message vary by channel?"
          type="textarea"
          value={formData.channelVariations}
          onChange={handleChange}
          placeholder="Explain how you adapt messaging for email, social media, sales pages, calls, etc."
          rows={4}
        />
        
        <FormField
          id="emailSubjectLines"
          label="Email subject lines examples:"
          type="textarea"
          value={formData.emailSubjectLines}
          onChange={handleChange}
          placeholder="List 3-5 of your best-performing email subject lines"
          rows={3}
        />
        
        <FormField
          id="socialMediaAds"
          label="Social media ads examples:"
          type="textarea"
          value={formData.socialMediaAds}
          onChange={handleChange}
          placeholder="List 3-5 of your best-performing social media ad headlines or copy"
          rows={3}
        />
        
        <FormField
          id="salesPageHeadlines"
          label="Sales page headlines examples:"
          type="textarea"
          value={formData.salesPageHeadlines}
          onChange={handleChange}
          placeholder="List 3-5 of your best-performing sales page headlines"
          rows={3}
        />
        
        <FormField
          id="presentationIntros"
          label="Webinar or presentation intros examples:"
          type="textarea"
          value={formData.presentationIntros}
          onChange={handleChange}
          placeholder="Provide examples of how you open presentations or webinars"
          rows={3}
        />
        
        <FormField
          id="platformConsiderations"
          label="What platform-specific considerations influence your messaging?"
          type="textarea"
          value={formData.platformConsiderations}
          onChange={handleChange}
          placeholder="Describe how you adapt to the constraints and opportunities of different platforms"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Buyer Personas & Tailored Messaging"
        description="Adapting your message for different audience segments"
      >
        <FormField
          id="buyerPersonas"
          label="Define your key buyer personas or segments"
          type="textarea"
          value={formData.buyerPersonas}
          onChange={handleChange}
          placeholder="Outline your main customer types or segments"
          rows={4}
        />
        
        <FormField
          id="personaMessagingAdjustments"
          label="What core messaging adjustments do you make for each segment?"
          type="textarea"
          value={formData.personaMessagingAdjustments}
          onChange={handleChange}
          placeholder="Explain how your messaging shifts for different personas"
          rows={4}
        />
        
        <FormField
          id="personaSpecificPhrases"
          label="What unique phrases or pain points resonate strongly with each segment?"
          type="textarea"
          value={formData.personaSpecificPhrases}
          onChange={handleChange}
          placeholder="List specific language that connects with each persona"
          rows={4}
        />
        
        <FormField
          id="personaTestimonials"
          label="What specific examples or testimonials best speak to each persona?"
          type="textarea"
          value={formData.personaTestimonials}
          onChange={handleChange}
          placeholder="Describe the social proof most effective for each segment"
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="Follow-Up & Retention Messaging"
        description="Continuing the conversation after initial contact"
      >
        <FormField
          id="leadNurturing"
          label="How do you nurture leads who don't immediately convert?"
          type="textarea"
          value={formData.leadNurturing}
          onChange={handleChange}
          placeholder="Describe your approach to nurturing non-converting prospects"
          rows={3}
        />
        
        <FormField
          id="followUpSequence"
          label="Describe your follow-up sequence or cadence:"
          type="textarea"
          value={formData.followUpSequence}
          onChange={handleChange}
          placeholder="Outline your follow-up timing, content focus, and channels"
          rows={3}
        />
        
        <FormField
          id="postSaleValue"
          label="How do you communicate after the sale to reinforce value?"
          type="textarea"
          value={formData.postSaleValue}
          onChange={handleChange}
          placeholder="Describe your post-purchase communication strategy"
          rows={3}
        />
        
        <FormField
          id="referralMessaging"
          label="What messaging encourages referrals, testimonials, or repeat purchases?"
          type="textarea"
          value={formData.referralMessaging}
          onChange={handleChange}
          placeholder="Explain how you prompt customers to refer others or buy again"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="Messaging Style & Tone"
        description="Your brand's voice in sales communications"
        showDivider={false}
      >
        <FormField
          id="messagingTone"
          label="How would you describe your sales messaging tone?"
          type="select"
          value={formData.messagingTone}
          onChange={handleChange}
          options={toneOptions}
        />
        
        <FormField
          id="objectionTone"
          label="What tone is most effective in overcoming objections?"
          type="select"
          value={formData.objectionTone}
          onChange={handleChange}
          options={toneOptions}
        />
        
        <FormField
          id="includedExcludedPhrases"
          label="What phrases or words should always be included or avoided?"
          type="textarea"
          value={formData.includedExcludedPhrases}
          onChange={handleChange}
          placeholder="List phrases to use and phrases to avoid in your messaging"
          rows={4}
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

export default SalesMessagingPlaybookForm;
