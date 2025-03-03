const fullDocumentPrompt = (formData) => {
    return `
  You are creating a comprehensive AI Style Guide for ${formData.businessName}.
  
  COMPLETE BUSINESS INFORMATION:
  Business Name: ${formData.businessName}
  Industry: ${formData.industry}
  Brand Voice: ${formData.brandVoice}
  Target Audience: ${formData.targetAudience}
  Core Values: ${formData.coreValues}
  Key Terminology: ${formData.keyTerminology}
  Communication Goals: ${formData.communicationGoals}
  
  YOUR TASK:
  Create a complete, professional AI Style Guide that will help ensure consistent AI interactions that align with ${formData.businessName}'s brand identity. Include the following sections:
  
  1. Brand Voice & Tone
     - Overall brand personality
     - Tone characteristics (formal vs. casual, technical vs. simple, etc.)
     - Emotional range and appropriate sentiment
     - Examples of ideal responses
  
  2. Language Guidelines
     - Vocabulary preferences and restrictions
     - Key terminology and phrases to use
     - Terms and phrases to avoid
     - Grammar and punctuation preferences
  
  3. Audience Considerations
     - Description of primary audience
     - Appropriate level of technical language
     - Cultural sensitivities
     - Regional language adaptations
  
  4. Communication Structure
     - Preferred response length
     - Formatting guidelines
     - Use of headings, lists, and emphasis
     - Approach to complex explanations
  
  5. Interaction Patterns
     - Greeting and closing styles
     - Question handling approach
     - Error and uncertainty handling
     - Conversational flow guidelines
  
  6. Content Types
     - Guidelines for different types of content (explanations, instructions, etc.)
     - Requirements for specific use cases
     - Templates for common responses
  
  7. Brand Alignment
     - How to incorporate mission and values
     - Expressing brand differentiators
     - Maintaining brand consistency across channels
     - Integration with wider marketing messaging
  
  8. Do's and Don'ts
     - Specific examples of ideal responses
     - Examples of unacceptable responses
     - Common pitfalls to avoid
     - Best practices
  
  9. Adaptation Guidelines
     - When and how to adjust tone
     - Handling special circumstances
     - Process for updating guidelines
  
  SPECIAL INSTRUCTIONS:
  - Focus on creating practical, actionable guidelines that could be used to instruct an AI system
  - Include specific examples of preferred language and responses
  - Ensure all guidelines align with ${formData.businessName}'s brand identity and values
  - Create a document that could serve as a reference for AI prompt engineering
  - Format with clear headings, subheadings, and bullet points where appropriate
  `;
  };
  
  module.exports = {
    fullDocumentPrompt
  };