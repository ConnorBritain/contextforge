const fullDocumentPrompt = (formData) => {
    return `
  You are creating a comprehensive Target Market Audience Profile for ${formData.businessName}.
  
  COMPLETE BUSINESS INFORMATION:
  Business Name: ${formData.businessName}
  Industry: ${formData.industry}
  Products/Services: ${formData.products}
  Business Description: ${formData.businessDescription}
  Core Values: ${formData.coreValues}
  Target Audience Overview: ${formData.targetAudienceOverview}
  
  YOUR TASK:
  Create a complete, professional document similar to a Target Market Audience Profile with the following sections:
  
  1. Overview
     - Introduce ${formData.businessName}
     - Describe the intersection of purpose and possibility
     - Define the audience as "Value Creators"
     - Explain the mission and vision
  
  2. Demographics
     - Age ranges and why they're relevant
     - Gender distribution
     - Income levels
     - Education backgrounds
     - Geographic locations
     - Occupations and professional backgrounds
  
  3. Psychographics
     - Core values of the target audience
     - Key motivations
     - Behavioral traits
     - Pain points
     - Psychological profile
  
  4. Behavioral Patterns
     - Content consumption habits
     - Engagement preferences
     - Purchasing behavior
     - Routine behaviors
     - Information sharing patterns
  
  5. Motivations & Goals
     - Primary motivations
     - Professional goals
     - Personal goals
     - Short-term aspirations
     - Long-term visions
  
  6. Challenges & Pain Points
     - Knowledge and skill gaps
     - Time constraints
     - Resource limitations
     - Emotional and psychological barriers
     - Execution challenges
     - Market pressures
  
  7. Media Consumption Habits
     - Preferred platforms
     - Content formats
     - Engagement timing
     - Information sources
  
  8. Key Audience Segments
     - Identify 3-6 distinct segments within the broader audience
     - For each segment, provide description, characteristics, and needs
  
  9. Marketing Strategies
     - Overview
     - Core objectives
     - Key channels and tactics
     - Performance metrics
  
  SPECIAL INSTRUCTIONS:
  - Maintain absolute coherence between sections
  - Reference insights from earlier sections when relevant
  - Use consistent terminology throughout
  - Ensure the document tells a compelling, unified story about ${formData.businessName}'s target audience
  - Include specific insights tailored to ${formData.industry}
  - Format with clear headings, subheadings, and bullet points where appropriate
  - Create a professional document that could be presented to stakeholders
  `;
  };
  
  module.exports = {
    fullDocumentPrompt
  };