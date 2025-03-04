import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormSection from './FormSection';
import '../../styles/forms.css';

/**
 * Target Market Audience Profile form component
 */
const TargetMarketAudienceForm = ({ initialData = {}, onSubmit, onBack }) => {
  // Form state
  const [formData, setFormData] = useState({
    // Core Demographics
    ageRange: '',
    genderDistribution: '',
    incomeLevels: '',
    educationBackground: '',
    primaryMarkets: '',
    secondaryMarkets: '',
    currentRoles: '',
    careerStage: '',
    
    // Psychographic Profile
    coreValues: '',
    lifePhilosophy: '',
    decisionPriorities: '',
    professionalGoals: '',
    personalAmbitions: '',
    lifestyleDesires: '',
    primaryFrustrations: '',
    currentObstacles: '',
    unmetNeeds: '',
    
    // Behavioral Patterns
    preferredPlatforms: '',
    contentFormats: '',
    peakEngagementTimes: '',
    attentionSpan: '',
    decisionFactors: '',
    priceSensitivity: '',
    researchHabits: '',
    buyingCycle: '',
    communityParticipation: '',
    socialSharingHabits: '',
    brandInteractionPreferences: '',
    
    // Lifestyle & Habits
    workPatterns: '',
    freeTimeActivities: '',
    learningHabits: '',
    devicePreferences: '',
    appUsage: '',
    digitalComfortLevel: '',
    trustedAuthorities: '',
    preferredMedia: '',
    learningMethods: '',
    
    // Communication Preferences
    languageLevel: '',
    preferredTone: '',
    culturalConsiderations: '',
    primaryChannels: '',
    responseExpectations: '',
    interactionFrequency: '',
    
    // Market Evolution
    emergingNeeds: '',
    shiftingPreferences: '',
    newChallenges: '',
    anticipatedChanges: '',
    growingOpportunities: '',
    potentialThreats: '',
    
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
    const requiredFields = ['ageRange', 'genderDistribution', 'incomeLevels'];
    
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
        <h2>Target Market Audience Profile</h2>
        <p>Please provide detailed information about your target audience to create a comprehensive profile.</p>
      </div>
      
      <FormSection 
        title="1. Core Demographics"
        description="Basic demographic information about your target audience"
      >
        <FormField
          id="ageRange"
          label="Age Range"
          value={formData.ageRange}
          onChange={handleChange}
          placeholder="e.g., 25-45, Gen Z, Baby Boomers"
          required
          error={errors.ageRange}
        />
        
        <FormField
          id="genderDistribution"
          label="Gender Distribution"
          value={formData.genderDistribution}
          onChange={handleChange}
          placeholder="e.g., Primarily female, Evenly split"
          required
          error={errors.genderDistribution}
        />
        
        <FormField
          id="incomeLevels"
          label="Income Levels"
          value={formData.incomeLevels}
          onChange={handleChange}
          placeholder="e.g., Middle-income, $75K-150K annually"
          required
          error={errors.incomeLevels}
        />
        
        <FormField
          id="educationBackground"
          label="Education Background"
          value={formData.educationBackground}
          onChange={handleChange}
          placeholder="e.g., College educated, Technical certifications"
        />
        
        <div className="form-group">
          <h4>Geographic Location</h4>
          <FormField
            id="primaryMarkets"
            label="Primary Markets"
            value={formData.primaryMarkets}
            onChange={handleChange}
            placeholder="e.g., Urban areas in North America, Western Europe"
          />
          
          <FormField
            id="secondaryMarkets"
            label="Secondary Markets"
            value={formData.secondaryMarkets}
            onChange={handleChange}
            placeholder="e.g., Australia, East Asia, Rural markets"
          />
        </div>
        
        <div className="form-group">
          <h4>Professional Status</h4>
          <FormField
            id="currentRoles"
            label="Current Roles"
            value={formData.currentRoles}
            onChange={handleChange}
            placeholder="e.g., Marketing managers, Small business owners"
          />
          
          <FormField
            id="careerStage"
            label="Career Stage"
            value={formData.careerStage}
            onChange={handleChange}
            placeholder="e.g., Mid-career professionals, Early entrepreneurs"
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="2. Psychographic Profile"
        description="Values, beliefs, aspirations, and pain points"
      >
        <div className="form-group">
          <h4>Values & Beliefs</h4>
          <FormField
            id="coreValues"
            label="Core Values"
            value={formData.coreValues}
            onChange={handleChange}
            placeholder="e.g., Family-oriented, Environmentally conscious"
          />
          
          <FormField
            id="lifePhilosophy"
            label="Life Philosophy"
            value={formData.lifePhilosophy}
            onChange={handleChange}
            placeholder="e.g., Work-life balance, Continuous growth"
          />
          
          <FormField
            id="decisionPriorities"
            label="Decision-making Priorities"
            value={formData.decisionPriorities}
            onChange={handleChange}
            placeholder="e.g., Value-oriented, Quality over price"
          />
        </div>
        
        <div className="form-group">
          <h4>Aspirations & Goals</h4>
          <FormField
            id="professionalGoals"
            label="Professional Goals"
            value={formData.professionalGoals}
            onChange={handleChange}
            placeholder="e.g., Career advancement, Building a successful business"
          />
          
          <FormField
            id="personalAmbitions"
            label="Personal Ambitions"
            value={formData.personalAmbitions}
            onChange={handleChange}
            placeholder="e.g., Work-life balance, Financial independence"
          />
          
          <FormField
            id="lifestyleDesires"
            label="Lifestyle Desires"
            value={formData.lifestyleDesires}
            onChange={handleChange}
            placeholder="e.g., Luxury travel, Sustainable living"
          />
        </div>
        
        <div className="form-group">
          <h4>Pain Points & Challenges</h4>
          <FormField
            id="primaryFrustrations"
            label="Primary Frustrations"
            value={formData.primaryFrustrations}
            onChange={handleChange}
            placeholder="e.g., Lack of time, Technology complexity"
          />
          
          <FormField
            id="currentObstacles"
            label="Current Obstacles"
            value={formData.currentObstacles}
            onChange={handleChange}
            placeholder="e.g., Budget constraints, Lack of expertise"
          />
          
          <FormField
            id="unmetNeeds"
            label="Unmet Needs"
            value={formData.unmetNeeds}
            onChange={handleChange}
            placeholder="e.g., Personalized support, Simplified solutions"
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="3. Behavioral Patterns"
        description="Content consumption, purchase behavior, and engagement patterns"
      >
        <div className="form-group">
          <h4>Content Consumption</h4>
          <FormField
            id="preferredPlatforms"
            label="Preferred Platforms"
            value={formData.preferredPlatforms}
            onChange={handleChange}
            placeholder="e.g., LinkedIn, Instagram, Industry blogs"
          />
          
          <FormField
            id="contentFormats"
            label="Content Formats"
            value={formData.contentFormats}
            onChange={handleChange}
            placeholder="e.g., Video tutorials, Podcasts, In-depth articles"
          />
          
          <FormField
            id="peakEngagementTimes"
            label="Peak Engagement Times"
            value={formData.peakEngagementTimes}
            onChange={handleChange}
            placeholder="e.g., Evenings, Weekends, Morning commute"
          />
          
          <FormField
            id="attentionSpan"
            label="Attention Span"
            value={formData.attentionSpan}
            onChange={handleChange}
            placeholder="e.g., Quick snippets, Long-form content, Mixed"
          />
        </div>
        
        <div className="form-group">
          <h4>Purchase Behavior</h4>
          <FormField
            id="decisionFactors"
            label="Decision Factors"
            value={formData.decisionFactors}
            onChange={handleChange}
            placeholder="e.g., Peer recommendations, Expert reviews"
          />
          
          <FormField
            id="priceSensitivity"
            label="Price Sensitivity"
            value={formData.priceSensitivity}
            onChange={handleChange}
            placeholder="e.g., Value-conscious, Premium-oriented"
          />
          
          <FormField
            id="researchHabits"
            label="Research Habits"
            value={formData.researchHabits}
            onChange={handleChange}
            placeholder="e.g., Thorough research, Impulse buyers"
          />
          
          <FormField
            id="buyingCycle"
            label="Buying Cycle"
            value={formData.buyingCycle}
            onChange={handleChange}
            placeholder="e.g., 3-6 month consideration, Seasonal purchases"
          />
        </div>
        
        <div className="form-group">
          <h4>Engagement Patterns</h4>
          <FormField
            id="communityParticipation"
            label="Community Participation"
            value={formData.communityParticipation}
            onChange={handleChange}
            placeholder="e.g., Active in forums, Passive content consumers"
          />
          
          <FormField
            id="socialSharingHabits"
            label="Social Sharing Habits"
            value={formData.socialSharingHabits}
            onChange={handleChange}
            placeholder="e.g., Frequently shares resources, Private consumption"
          />
          
          <FormField
            id="brandInteractionPreferences"
            label="Brand Interaction Preferences"
            value={formData.brandInteractionPreferences}
            onChange={handleChange}
            placeholder="e.g., Email communication, Live chat support"
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="4. Lifestyle & Habits"
        description="Daily routine, technology usage, and information sources"
      >
        <div className="form-group">
          <h4>Daily Routine</h4>
          <FormField
            id="workPatterns"
            label="Work Patterns"
            value={formData.workPatterns}
            onChange={handleChange}
            placeholder="e.g., Remote workers, 9-to-5 office, Freelancers"
          />
          
          <FormField
            id="freeTimeActivities"
            label="Free Time Activities"
            value={formData.freeTimeActivities}
            onChange={handleChange}
            placeholder="e.g., Fitness, Family time, Travel"
          />
          
          <FormField
            id="learningHabits"
            label="Learning Habits"
            value={formData.learningHabits}
            onChange={handleChange}
            placeholder="e.g., Self-taught, Formal education, Workshops"
          />
        </div>
        
        <div className="form-group">
          <h4>Technology Usage</h4>
          <FormField
            id="devicePreferences"
            label="Device Preferences"
            value={formData.devicePreferences}
            onChange={handleChange}
            placeholder="e.g., Mobile-first, Desktop for work"
          />
          
          <FormField
            id="appUsage"
            label="App Usage"
            value={formData.appUsage}
            onChange={handleChange}
            placeholder="e.g., Productivity tools, Social media, News apps"
          />
          
          <FormField
            id="digitalComfortLevel"
            label="Digital Comfort Level"
            value={formData.digitalComfortLevel}
            onChange={handleChange}
            placeholder="e.g., Tech-savvy, Digital natives, Late adopters"
          />
        </div>
        
        <div className="form-group">
          <h4>Information Sources</h4>
          <FormField
            id="trustedAuthorities"
            label="Trusted Authorities"
            value={formData.trustedAuthorities}
            onChange={handleChange}
            placeholder="e.g., Industry experts, Peer recommendations"
          />
          
          <FormField
            id="preferredMedia"
            label="Preferred Media"
            value={formData.preferredMedia}
            onChange={handleChange}
            placeholder="e.g., Podcasts, YouTube channels, Newsletters"
          />
          
          <FormField
            id="learningMethods"
            label="Learning Methods"
            value={formData.learningMethods}
            onChange={handleChange}
            placeholder="e.g., Visual learners, Hands-on practice"
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="5. Communication Preferences"
        description="Tone, style, and channel preferences"
      >
        <div className="form-group">
          <h4>Tone & Style</h4>
          <FormField
            id="languageLevel"
            label="Language Level"
            value={formData.languageLevel}
            onChange={handleChange}
            placeholder="e.g., Technical terminology, Simple explanations"
          />
          
          <FormField
            id="preferredTone"
            label="Preferred Tone"
            value={formData.preferredTone}
            onChange={handleChange}
            placeholder="e.g., Professional, Conversational, Direct"
          />
          
          <FormField
            id="culturalConsiderations"
            label="Cultural Considerations"
            value={formData.culturalConsiderations}
            onChange={handleChange}
            placeholder="e.g., Regional references, Inclusive language"
          />
        </div>
        
        <div className="form-group">
          <h4>Channel Preferences</h4>
          <FormField
            id="primaryChannels"
            label="Primary Channels"
            value={formData.primaryChannels}
            onChange={handleChange}
            placeholder="e.g., Email, Social media, Direct mail"
          />
          
          <FormField
            id="responseExpectations"
            label="Response Expectations"
            value={formData.responseExpectations}
            onChange={handleChange}
            placeholder="e.g., Immediate replies, Thoughtful responses"
          />
          
          <FormField
            id="interactionFrequency"
            label="Interaction Frequency"
            value={formData.interactionFrequency}
            onChange={handleChange}
            placeholder="e.g., Weekly newsletter, Daily social posts"
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="7. Market Evolution"
        description="Current trends and future predictions"
        showDivider={false}
      >
        <div className="form-group">
          <h4>Current Trends</h4>
          <FormField
            id="emergingNeeds"
            label="Emerging Needs"
            value={formData.emergingNeeds}
            onChange={handleChange}
            placeholder="e.g., Increased demand for sustainability"
          />
          
          <FormField
            id="shiftingPreferences"
            label="Shifting Preferences"
            value={formData.shiftingPreferences}
            onChange={handleChange}
            placeholder="e.g., Moving from ownership to subscription models"
          />
          
          <FormField
            id="newChallenges"
            label="New Challenges"
            value={formData.newChallenges}
            onChange={handleChange}
            placeholder="e.g., Privacy concerns, Economic uncertainty"
          />
        </div>
        
        <div className="form-group">
          <h4>Future Predictions</h4>
          <FormField
            id="anticipatedChanges"
            label="Anticipated Changes"
            value={formData.anticipatedChanges}
            onChange={handleChange}
            placeholder="e.g., Shift to remote work culture"
          />
          
          <FormField
            id="growingOpportunities"
            label="Growing Opportunities"
            value={formData.growingOpportunities}
            onChange={handleChange}
            placeholder="e.g., New market segments, Emerging technologies"
          />
          
          <FormField
            id="potentialThreats"
            label="Potential Threats"
            value={formData.potentialThreats}
            onChange={handleChange}
            placeholder="e.g., New competitors, Regulatory changes"
          />
        </div>
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

export default TargetMarketAudienceForm;