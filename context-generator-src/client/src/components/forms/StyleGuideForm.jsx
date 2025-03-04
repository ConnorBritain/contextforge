import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormSection from './FormSection';
import '../../styles/forms.css';

/**
 * AI Style Guide form component
 */
const StyleGuideForm = ({ initialData = {}, onSubmit, onBack }) => {
  // Form state
  const [formData, setFormData] = useState({
    // Introduction and Purpose
    styleGuideIntro: '',
    
    // Voice and Tone
    voiceCharacteristics: '',
    styleDescription: '',
    toneVariations: '',
    toneContexts: '',
    dosPractices: '',
    dontsPractices: '',
    
    // Language and Style
    languageComplexity: '',
    formalityLevel: '',
    termsToUse: '',
    termsToAvoid: '',
    culturalConsiderations: '',
    
    // Formatting and Structure
    contentStructure: '',
    contentLength: '',
    formattingDetails: '',
    
    // Examples
    exampleOne: '',
    exampleOneContext: '',
    exampleOneAnnotations: '',
    exampleTwo: '',
    exampleTwoContext: '',
    exampleTwoAnnotations: '',
    
    // Audience Profiles
    audienceOne: '',
    audienceOneAdjustments: '',
    audienceTwo: '',
    audienceTwoAdjustments: '',
    
    // Purpose and Objectives
    communicationGoals: '',
    keyMessages: '',
    callToActionGuidelines: '',
    
    // Specific Contexts
    scenarioOne: '',
    scenarioOneGuidelines: '',
    scenarioTwo: '',
    scenarioTwoGuidelines: '',
    
    // Ethical Guidelines
    valuesAndPrinciples: '',
    contentRestrictions: '',
    inclusivityPractices: '',
    
    // AI Implementation
    customInstructions: '',
    adherenceLevel: '',
    updateNotes: '',
    
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
    const requiredFields = ['styleGuideIntro', 'voiceCharacteristics', 'styleDescription'];
    
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

  // Formality level options
  const formalityOptions = [
    { value: 'very-formal', label: 'Very Formal' },
    { value: 'formal', label: 'Formal' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'casual', label: 'Casual' }
  ];

  // Language complexity options
  const complexityOptions = [
    { value: 'simple', label: 'Simple (8th grade reading level)' },
    { value: 'moderate', label: 'Moderate (High school reading level)' },
    { value: 'advanced', label: 'Advanced (College reading level)' },
    { value: 'technical', label: 'Technical (Industry experts)' }
  ];

  // Adherence level options
  const adherenceOptions = [
    { value: 'strict', label: 'Strict (Follow guidelines exactly)' },
    { value: 'balanced', label: 'Balanced (Follow general direction)' },
    { value: 'flexible', label: 'Flexible (Use as general reference)' }
  ];

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>AI Style Guide</h2>
        <p>Please provide information to create a comprehensive AI style guide.</p>
      </div>
      
      <FormSection 
        title="1. Introduction and Purpose"
        description="Provide a brief overview of the style guide's intent"
      >
        <FormField
          id="styleGuideIntro"
          label="Style Guide Introduction and Purpose"
          type="textarea"
          value={formData.styleGuideIntro}
          onChange={handleChange}
          placeholder="Explain how this style guide should be used and its purpose in guiding AI communications"
          required
          error={errors.styleGuideIntro}
          rows={4}
        />
      </FormSection>
      
      <FormSection 
        title="2. Voice and Tone Guidelines"
        description="Define how your brand or organization should sound"
      >
        <FormField
          id="voiceCharacteristics"
          label="Voice Characteristics"
          value={formData.voiceCharacteristics}
          onChange={handleChange}
          placeholder="e.g., friendly, authoritative, compassionate, innovative"
          required
          error={errors.voiceCharacteristics}
        />
        
        <FormField
          id="styleDescription"
          label="Overall Style Description"
          type="textarea"
          value={formData.styleDescription}
          onChange={handleChange}
          placeholder="Describe your general communication style"
          required
          error={errors.styleDescription}
          rows={3}
        />
        
        <FormField
          id="toneVariations"
          label="Tone Variations"
          type="textarea"
          value={formData.toneVariations}
          onChange={handleChange}
          placeholder="Explain how the tone may vary in different contexts"
          rows={3}
        />
        
        <FormField
          id="toneContexts"
          label="Contexts for Different Tones"
          type="textarea"
          value={formData.toneContexts}
          onChange={handleChange}
          placeholder="When to use different tones (e.g., customer support vs. marketing)"
          rows={3}
        />
        
        <div className="form-group">
          <h4>Dos and Don'ts</h4>
          <FormField
            id="dosPractices"
            label="Dos"
            type="textarea"
            value={formData.dosPractices}
            onChange={handleChange}
            placeholder="List practices to follow (e.g., use inclusive language, address the customer directly)"
            rows={3}
          />
          
          <FormField
            id="dontsPractices"
            label="Don'ts"
            type="textarea"
            value={formData.dontsPractices}
            onChange={handleChange}
            placeholder="List practices to avoid (e.g., avoid technical jargon, don't use overly complex sentences)"
            rows={3}
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="3. Language and Style Preferences"
        description="Specific language choices and preferences"
      >
        <FormField
          id="languageComplexity"
          label="Language Complexity"
          type="select"
          value={formData.languageComplexity}
          onChange={handleChange}
          options={complexityOptions}
        />
        
        <FormField
          id="formalityLevel"
          label="Formality Level"
          type="select"
          value={formData.formalityLevel}
          onChange={handleChange}
          options={formalityOptions}
        />
        
        <FormField
          id="termsToUse"
          label="Preferred Vocabulary (Terms to Use)"
          type="textarea"
          value={formData.termsToUse}
          onChange={handleChange}
          placeholder="e.g., 'clients' instead of 'customers', 'team members' instead of 'employees'"
          rows={3}
        />
        
        <FormField
          id="termsToAvoid"
          label="Terms to Avoid"
          type="textarea"
          value={formData.termsToAvoid}
          onChange={handleChange}
          placeholder="e.g., industry jargon, technical acronyms, outdated terminology"
          rows={3}
        />
        
        <FormField
          id="culturalConsiderations"
          label="Cultural Considerations"
          type="textarea"
          value={formData.culturalConsiderations}
          onChange={handleChange}
          placeholder="e.g., preferred date formats, regional considerations, guidelines for inclusivity"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="4. Formatting and Structural Guidelines"
        description="How content should be structured and formatted"
      >
        <FormField
          id="contentStructure"
          label="Content Structure"
          type="textarea"
          value={formData.contentStructure}
          onChange={handleChange}
          placeholder="e.g., preferred use of paragraphs, bullet points, headings, etc."
          rows={3}
        />
        
        <FormField
          id="contentLength"
          label="Content Length"
          value={formData.contentLength}
          onChange={handleChange}
          placeholder="e.g., ideal length for emails, posts, articles, or responses"
        />
        
        <FormField
          id="formattingDetails"
          label="Formatting Details"
          type="textarea"
          value={formData.formattingDetails}
          onChange={handleChange}
          placeholder="e.g., use of bold/italics, list types, capitalization rules"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="5. Examples and Exhibits"
        description="Sample texts that exemplify your voice and style"
      >
        <div className="form-group">
          <h4>Example 1</h4>
          <FormField
            id="exampleOneContext"
            label="Context"
            value={formData.exampleOneContext}
            onChange={handleChange}
            placeholder="e.g., Customer support response, Marketing email"
          />
          
          <FormField
            id="exampleOne"
            label="Sample Text"
            type="textarea"
            value={formData.exampleOne}
            onChange={handleChange}
            placeholder="Insert sample text that exemplifies your voice and style"
            rows={4}
          />
          
          <FormField
            id="exampleOneAnnotations"
            label="Annotations"
            type="textarea"
            value={formData.exampleOneAnnotations}
            onChange={handleChange}
            placeholder="Highlight specific phrases or stylistic choices that make this example effective"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <h4>Example 2</h4>
          <FormField
            id="exampleTwoContext"
            label="Context"
            value={formData.exampleTwoContext}
            onChange={handleChange}
            placeholder="e.g., Social media post, Product description"
          />
          
          <FormField
            id="exampleTwo"
            label="Sample Text"
            type="textarea"
            value={formData.exampleTwo}
            onChange={handleChange}
            placeholder="Insert another sample text in a different context"
            rows={4}
          />
          
          <FormField
            id="exampleTwoAnnotations"
            label="Annotations"
            type="textarea"
            value={formData.exampleTwoAnnotations}
            onChange={handleChange}
            placeholder="Highlight specific phrases or stylistic choices that make this example effective"
            rows={3}
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="6. Audience Profiles"
        description="How to adapt communications for different audience segments"
      >
        <div className="form-group">
          <h4>Primary Audience</h4>
          <FormField
            id="audienceOne"
            label="Audience Description"
            type="textarea"
            value={formData.audienceOne}
            onChange={handleChange}
            placeholder="Demographics, interests, needs of your primary audience"
            rows={3}
          />
          
          <FormField
            id="audienceOneAdjustments"
            label="Tone and Style Adjustments"
            type="textarea"
            value={formData.audienceOneAdjustments}
            onChange={handleChange}
            placeholder="How to adapt communications specifically for this audience"
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <h4>Secondary Audience</h4>
          <FormField
            id="audienceTwo"
            label="Audience Description"
            type="textarea"
            value={formData.audienceTwo}
            onChange={handleChange}
            placeholder="Demographics, interests, needs of your secondary audience"
            rows={3}
          />
          
          <FormField
            id="audienceTwoAdjustments"
            label="Tone and Style Adjustments"
            type="textarea"
            value={formData.audienceTwoAdjustments}
            onChange={handleChange}
            placeholder="How to adapt communications specifically for this audience"
            rows={3}
          />
        </div>
      </FormSection>
      
      <FormSection 
        title="7. Communication Goals and Key Messages"
        description="Primary objectives and core themes to emphasize"
      >
        <FormField
          id="communicationGoals"
          label="Communication Goals"
          type="textarea"
          value={formData.communicationGoals}
          onChange={handleChange}
          placeholder="State your primary objectives for communications (e.g., educate, build trust, drive action)"
          rows={3}
        />
        
        <FormField
          id="keyMessages"
          label="Key Messages"
          type="textarea"
          value={formData.keyMessages}
          onChange={handleChange}
          placeholder="List core messages or themes to emphasize consistently"
          rows={3}
        />
        
        <FormField
          id="callToActionGuidelines"
          label="Call-to-Action Guidelines"
          type="textarea"
          value={formData.callToActionGuidelines}
          onChange={handleChange}
          placeholder="Preferred approaches for encouraging engagement or next steps"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="8. Ethical Guidelines"
        description="Ensuring ethical and responsible AI communications"
        showDivider={false}
      >
        <FormField
          id="valuesAndPrinciples"
          label="Values and Principles"
          type="textarea"
          value={formData.valuesAndPrinciples}
          onChange={handleChange}
          placeholder="State your commitment to ethical communication standards"
          rows={3}
        />
        
        <FormField
          id="contentRestrictions"
          label="Content Restrictions"
          type="textarea"
          value={formData.contentRestrictions}
          onChange={handleChange}
          placeholder="Topics or language to strictly avoid in all communications"
          rows={3}
        />
        
        <FormField
          id="inclusivityPractices"
          label="Inclusivity Practices"
          type="textarea"
          value={formData.inclusivityPractices}
          onChange={handleChange}
          placeholder="Guidelines to ensure content is accessible and respectful to all audiences"
          rows={3}
        />
        
        <div className="form-group">
          <h4>AI Implementation</h4>
          <FormField
            id="customInstructions"
            label="Custom Instructions for AI"
            type="textarea"
            value={formData.customInstructions}
            onChange={handleChange}
            placeholder="Specific directives to input directly into AI platforms"
            rows={4}
          />
          
          <FormField
            id="adherenceLevel"
            label="Level of Adherence"
            type="select"
            value={formData.adherenceLevel}
            onChange={handleChange}
            options={adherenceOptions}
          />
          
          <FormField
            id="updateNotes"
            label="Updates and Maintenance"
            type="textarea"
            value={formData.updateNotes}
            onChange={handleChange}
            placeholder="Notes on reviewing and updating the style guide over time"
            rows={3}
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

export default StyleGuideForm;