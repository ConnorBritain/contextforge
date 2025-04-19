import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import FormSection from './FormSection';
import '../../styles/forms.css';

/**
 * Personal Bio Document form component
 */
const PersonalBioForm = ({ initialData = {}, onSubmit, onBack }) => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    preferredName: '',
    pronouns: '',
    location: '',
    industryRole: '',
    yearsExperience: '',
    expertise: '',
    education: '',
    professionalDrive: '',
    desiredImpact: '',
    longTermVision: '',
    careerSummary: '',
    notableProjects: '',
    awards: '',
    technicalSkills: '',
    leadershipSkills: '',
    communicationStrengths: '',
    professionalVoice: '',
    preferredTone: '',
    keyMessaging: '',
    coreValues: '',
    ethicalConsiderations: '',
    primaryAudience: '',
    audienceChallenges: '',
    contentPlatforms: '',
    workPreferences: '',
    productivityTools: '',
    communicationPreferences: '',
    learningPreferences: '',
    thoughtLeaders: '',
    hobbies: '',
    travelWellness: '',
    shortTermGoals: '',
    longTermGoals: '',
    legacyGoal: '',
    aiTopics: '',
    responseFormats: '',
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
    const requiredFields = ['fullName', 'industryRole', 'expertise']; 
    
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
        <h2>Personal Bio Document</h2>
        <p>Please provide information about yourself to create a comprehensive personal bio profile.</p>
      </div>
      
      <FormSection 
        title="1. Personal Overview"
        description="Basic information about you and your professional background"
      >
        <FormField
          id="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          error={errors.fullName}
        />
        
        <FormField
          id="preferredName"
          label="Preferred Name"
          value={formData.preferredName}
          onChange={handleChange}
          placeholder="Enter your preferred name/nickname (if applicable)"
        />

        <FormField
          id="pronouns"
          label="Pronouns"
          value={formData.pronouns}
          onChange={handleChange}
          placeholder="Your preferred pronouns (e.g., she/her, he/him, they/them)"
        />

        <FormField
          id="location"
          label="Location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Your current location (city, country)"
        />

        <FormField
          id="industryRole"
          label="Primary Industry & Current Role"
          value={formData.industryRole}
          onChange={handleChange}
          placeholder="Your industry and current position/role"
          required
          error={errors.industryRole}
        />

        <FormField
          id="yearsExperience"
          label="Years of Experience"
          value={formData.yearsExperience}
          onChange={handleChange}
          placeholder="Number of years in your industry/profession"
        />

        <FormField
          id="expertise"
          label="Key Areas of Expertise"
          type="textarea"
          value={formData.expertise}
          onChange={handleChange}
          placeholder="Your primary skills and areas of specialization"
          required
          error={errors.expertise}
          rows={3}
        />

        <FormField
          id="education"
          label="Certifications & Education"
          type="textarea"
          value={formData.education}
          onChange={handleChange}
          placeholder="Relevant degrees, certificates, and training"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="2. Mission & Vision"
        description="Your professional purpose and aspirations"
      >
        <FormField
          id="professionalDrive"
          label="What drives you professionally?"
          type="textarea"
          value={formData.professionalDrive}
          onChange={handleChange}
          placeholder="Describe your motivations and what inspires your work"
          rows={3}
        />
        
        <FormField
          id="desiredImpact"
          label="What impact do you want to create?"
          type="textarea"
          value={formData.desiredImpact}
          onChange={handleChange}
          placeholder="The difference you aim to make through your work"
          rows={3}
        />

        <FormField
          id="longTermVision"
          label="Long-term vision for career/life"
          type="textarea"
          value={formData.longTermVision}
          onChange={handleChange}
          placeholder="Your big-picture aspirations and vision"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="3. Professional Experience & Achievements"
        description="Your career journey and notable accomplishments"
      >
        <FormField
          id="careerSummary"
          label="Career Journey Summary"
          type="textarea"
          value={formData.careerSummary}
          onChange={handleChange}
          placeholder="Brief overview of your professional journey"
          rows={4}
        />
        
        <FormField
          id="notableProjects"
          label="Notable Projects"
          type="textarea"
          value={formData.notableProjects}
          onChange={handleChange}
          placeholder="Key projects or initiatives you've led or contributed to"
          rows={4}
        />

        <FormField
          id="awards"
          label="Awards, Published Work, Media Features"
          type="textarea"
          value={formData.awards}
          onChange={handleChange}
          placeholder="Recognition, publications, and media appearances"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="4. Skills & Expertise"
        description="Your professional capabilities and strengths"
      >
        <FormField
          id="technicalSkills"
          label="Technical Skills"
          type="textarea"
          value={formData.technicalSkills}
          onChange={handleChange}
          placeholder="Specific technical abilities and competencies"
          rows={3}
        />
        
        <FormField
          id="leadershipSkills"
          label="Business & Leadership Skills"
          type="textarea"
          value={formData.leadershipSkills}
          onChange={handleChange}
          placeholder="Your management, strategic, and business abilities"
          rows={3}
        />

        <FormField
          id="communicationStrengths"
          label="Communication Strengths"
          type="textarea"
          value={formData.communicationStrengths}
          onChange={handleChange}
          placeholder="Your strengths in written, verbal, and interpersonal communication"
          rows={3}
        />
      </FormSection>
      
      <FormSection 
        title="5. Personal Brand & Voice"
        description="Your communication style and professional identity"
      >
        <FormField
          id="professionalVoice"
          label="How would you describe your professional voice?"
          type="textarea"
          value={formData.professionalVoice}
          onChange={handleChange}
          placeholder="(e.g., concise, authoritative, warm, technical, approachable)"
          rows={3}
        />
        
        <FormField
          id="preferredTone"
          label="Preferred tone in communication?"
          type="textarea"
          value={formData.preferredTone}
          onChange={handleChange}
          placeholder="Your typical tone and communication approach"
          rows={3}
        />

        <FormField
          id="keyMessaging"
          label="Key messaging points you often use"
          type="textarea"
          value={formData.keyMessaging}
          onChange={handleChange}
          placeholder="Themes, topics, and messages you regularly emphasize"
          rows={3}
        />
      </FormSection>

      <FormSection 
        title="6. Core Values & Ethical Beliefs"
        description="Principles that guide your professional conduct"
      >
        <FormField
          id="coreValues"
          label="List 3-5 core values"
          type="textarea"
          value={formData.coreValues}
          onChange={handleChange}
          placeholder="Values that guide your professional decisions (e.g., integrity, innovation, excellence)"
          rows={3}
        />
        
        <FormField
          id="ethicalConsiderations"
          label="Ethical considerations in your industry"
          type="textarea"
          value={formData.ethicalConsiderations}
          onChange={handleChange}
          placeholder="Key ethical principles or issues in your field"
          rows={3}
        />
      </FormSection>

      <FormSection 
        title="7. Target Audience & Influence"
        description="Who you communicate with and influence"
      >
        <FormField
          id="primaryAudience"
          label="Who do you primarily communicate with?"
          type="textarea"
          value={formData.primaryAudience}
          onChange={handleChange}
          placeholder="Your primary professional audience and stakeholders"
          rows={3}
        />
        
        <FormField
          id="audienceChallenges"
          label="What challenges does your audience face?"
          type="textarea"
          value={formData.audienceChallenges}
          onChange={handleChange}
          placeholder="Key problems or needs of your audience"
          rows={3}
        />

        <FormField
          id="contentPlatforms"
          label="Content platforms you use"
          type="textarea"
          value={formData.contentPlatforms}
          onChange={handleChange}
          placeholder="Social media, professional networks, or other channels you use"
          rows={2}
        />
      </FormSection>

      <FormSection 
        title="8. Work & Productivity Preferences"
        description="How you prefer to work and communicate"
      >
        <FormField
          id="workPreferences"
          label="Work structure preferences"
          type="textarea"
          value={formData.workPreferences}
          onChange={handleChange}
          placeholder="(deep work vs. flexible workflow, collaboration style, etc.)"
          rows={3}
        />
        
        <FormField
          id="productivityTools"
          label="Favorite productivity tools"
          type="textarea"
          value={formData.productivityTools}
          onChange={handleChange}
          placeholder="Apps, systems, or methods you use to stay productive"
          rows={2}
        />

        <FormField
          id="communicationPreferences"
          label="Communication preferences"
          type="textarea"
          value={formData.communicationPreferences}
          onChange={handleChange}
          placeholder="How you prefer to communicate (email, meetings, messaging, etc.)"
          rows={2}
        />
      </FormSection>

      <FormSection 
        title="9. Learning & Knowledge Management"
        description="How you develop and manage your expertise"
      >
        <FormField
          id="learningPreferences"
          label="Preferred ways to learn?"
          type="textarea"
          value={formData.learningPreferences}
          onChange={handleChange}
          placeholder="(Courses, books, hands-on experience, mentorship, etc.)"
          rows={3}
        />
        
        <FormField
          id="thoughtLeaders"
          label="Thought leaders you follow"
          type="textarea"
          value={formData.thoughtLeaders}
          onChange={handleChange}
          placeholder="People, organizations, or sources that influence your thinking"
          rows={3}
        />
      </FormSection>

      <FormSection 
        title="10. Personal Interests & Lifestyle"
        description="Non-work aspects that influence your professional life"
      >
        <FormField
          id="hobbies"
          label="Hobbies & causes you support"
          type="textarea"
          value={formData.hobbies}
          onChange={handleChange}
          placeholder="Personal interests, volunteer work, and causes you care about"
          rows={3}
        />
        
        <FormField
          id="travelWellness"
          label="Travel preferences & wellness habits"
          type="textarea"
          value={formData.travelWellness}
          onChange={handleChange}
          placeholder="How you maintain balance and wellbeing"
          rows={3}
        />
      </FormSection>

      <FormSection 
        title="11. Future Goals & Aspirations"
        description="Where you're headed professionally"
      >
        <FormField
          id="shortTermGoals"
          label="Short-term (1-2 years) goals"
          type="textarea"
          value={formData.shortTermGoals}
          onChange={handleChange}
          placeholder="Your near-term professional objectives"
          rows={3}
        />
        
        <FormField
          id="longTermGoals"
          label="Long-term (5-10 years) vision"
          type="textarea"
          value={formData.longTermGoals}
          onChange={handleChange}
          placeholder="Your extended career and life aspirations"
          rows={3}
        />

        <FormField
          id="legacyGoal"
          label="Legacy goal"
          type="textarea"
          value={formData.legacyGoal}
          onChange={handleChange}
          placeholder="The lasting impact you hope to create"
          rows={3}
        />
      </FormSection>

      <FormSection 
        title="12. AI Personalization Preferences"
        description="How AI should interact with your information"
        showDivider={false}
      >
        <FormField
          id="aiTopics"
          label="Topics AI should emphasize or avoid"
          type="textarea"
          value={formData.aiTopics}
          onChange={handleChange}
          placeholder="Preferences for AI content generation based on your profile"
          rows={3}
        />
        
        <FormField
          id="responseFormats"
          label="Preferred response formats"
          type="textarea"
          value={formData.responseFormats}
          onChange={handleChange}
          placeholder="How you'd like information presented (bullet points, paragraphs, etc.)"
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

export default PersonalBioForm;