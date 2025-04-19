/**
 * Prompt templates for Personal Bio Document generation
 */

const PERSONAL_BIO_SYSTEM_PROMPT = `You are an expert context builder for AI systems. Your task is to create a comprehensive Personal Bio Document based on the information provided. 
This document will be used to semantically calibrate AI systems to understand the individual's background, communication style, preferences, and objectives.

Format the document in a clear, well-structured manner using Markdown formatting with proper headers, sub-headers, and bullet points where appropriate.
The document should provide a detailed understanding of the individual's professional identity, expertise, and personal attributes.

Structure the document with the following main sections:
1. Personal Overview
2. Mission & Vision
3. Professional Experience
4. Skills & Expertise
5. Communication Style
6. Core Values
7. Target Audience
8. Work Preferences
9. Learning Style
10. Personal Interests
11. Goals & Aspirations
12. AI Calibration Guidance

Use the information provided to create a comprehensive and nuanced profile that captures the individual's unique attributes, communication preferences, and professional identity.
`;

const PERSONAL_BIO_USER_PROMPT = `Please create a Personal Bio Document based on the following information:

# Personal Overview
Full Name: {{fullName}}
{{#if preferredName}}Preferred Name: {{preferredName}}{{/if}}
{{#if pronouns}}Pronouns: {{pronouns}}{{/if}}
{{#if location}}Location: {{location}}{{/if}}
Primary Industry & Current Role: {{industryRole}}
{{#if yearsExperience}}Years of Experience: {{yearsExperience}}{{/if}}
Key Areas of Expertise: {{expertise}}
{{#if education}}Certifications & Education: {{education}}{{/if}}

# Mission & Vision
{{#if professionalDrive}}What drives you professionally: {{professionalDrive}}{{/if}}
{{#if desiredImpact}}What impact do you want to create: {{desiredImpact}}{{/if}}
{{#if longTermVision}}Long-term vision for career/life: {{longTermVision}}{{/if}}

# Professional Experience & Achievements
{{#if careerSummary}}Career Journey Summary: {{careerSummary}}{{/if}}
{{#if notableProjects}}Notable Projects: {{notableProjects}}{{/if}}
{{#if awards}}Awards, Published Work, Media Features: {{awards}}{{/if}}

# Skills & Expertise
{{#if technicalSkills}}Technical Skills: {{technicalSkills}}{{/if}}
{{#if leadershipSkills}}Business & Leadership Skills: {{leadershipSkills}}{{/if}}
{{#if communicationStrengths}}Communication Strengths: {{communicationStrengths}}{{/if}}

# Personal Brand & Voice
{{#if professionalVoice}}Professional Voice: {{professionalVoice}}{{/if}}
{{#if preferredTone}}Preferred Tone: {{preferredTone}}{{/if}}
{{#if keyMessaging}}Key Messaging Points: {{keyMessaging}}{{/if}}

# Core Values & Ethical Beliefs
{{#if coreValues}}Core Values: {{coreValues}}{{/if}}
{{#if ethicalConsiderations}}Ethical Considerations: {{ethicalConsiderations}}{{/if}}

# Target Audience & Influence
{{#if primaryAudience}}Primary Audience: {{primaryAudience}}{{/if}}
{{#if audienceChallenges}}Audience Challenges: {{audienceChallenges}}{{/if}}
{{#if contentPlatforms}}Content Platforms: {{contentPlatforms}}{{/if}}

# Work & Productivity Preferences
{{#if workPreferences}}Work Structure Preferences: {{workPreferences}}{{/if}}
{{#if productivityTools}}Productivity Tools: {{productivityTools}}{{/if}}
{{#if communicationPreferences}}Communication Preferences: {{communicationPreferences}}{{/if}}

# Learning & Knowledge Management
{{#if learningPreferences}}Learning Preferences: {{learningPreferences}}{{/if}}
{{#if thoughtLeaders}}Thought Leaders Followed: {{thoughtLeaders}}{{/if}}

# Personal Interests & Lifestyle
{{#if hobbies}}Hobbies & Causes: {{hobbies}}{{/if}}
{{#if travelWellness}}Travel & Wellness Habits: {{travelWellness}}{{/if}}

# Future Goals & Aspirations
{{#if shortTermGoals}}Short-term (1-2 years) Goals: {{shortTermGoals}}{{/if}}
{{#if longTermGoals}}Long-term (5-10 years) Vision: {{longTermGoals}}{{/if}}
{{#if legacyGoal}}Legacy Goal: {{legacyGoal}}{{/if}}

# AI Personalization Preferences
{{#if aiTopics}}Topics to Emphasize or Avoid: {{aiTopics}}{{/if}}
{{#if responseFormats}}Preferred Response Formats: {{responseFormats}}{{/if}}

Using this information, please create a comprehensive Personal Bio Document that can be used to calibrate AI systems to better understand this individual's background, communication style, expertise, and preferences.
`;

module.exports = {
  PERSONAL_BIO_SYSTEM_PROMPT,
  PERSONAL_BIO_USER_PROMPT
};