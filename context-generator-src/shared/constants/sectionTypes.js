/**
 * Types of sections that can be included in documents
 */
const SECTION_TYPES = {
  // Common section types
  INTRODUCTION: 'introduction',
  EXECUTIVE_SUMMARY: 'executiveSummary',
  CONCLUSION: 'conclusion',
  
  // Target Market Audience Profile sections
  DEMOGRAPHIC_OVERVIEW: 'demographicOverview',
  PSYCHOGRAPHIC_PROFILE: 'psychographicProfile',
  PAIN_POINTS: 'painPoints',
  BUYING_BEHAVIOR: 'buyingBehavior',
  COMMUNICATION_CHANNELS: 'communicationChannels',
  CUSTOMER_JOURNEY: 'customerJourney',
  MARKET_TRENDS: 'marketTrends',
  
  // Business Profile sections
  BUSINESS_OVERVIEW: 'businessOverview',
  MARKET_ANALYSIS: 'marketAnalysis',
  PRODUCTS_SERVICES: 'productsServices',
  BUSINESS_MODEL: 'businessModel',
  COMPETITIVE_ANALYSIS: 'competitiveAnalysis',
  VALUE_PROPOSITION: 'valueProposition',
  OPERATIONS: 'operations',
  GROWTH_STRATEGY: 'growthStrategy',
  
  // Style Guide sections
  BRAND_VOICE: 'brandVoice',
  TONE_GUIDELINES: 'toneGuidelines',
  LANGUAGE_PATTERNS: 'languagePatterns',
  CONTENT_STRUCTURE: 'contentStructure',
  MESSAGING_FRAMEWORK: 'messagingFramework',
  RESPONSE_TEMPLATES: 'responseTemplates',
  DO_DONT_EXAMPLES: 'doDontExamples'
};

/**
 * Display names for section types
 */
const SECTION_TYPE_NAMES = {
  // Common section names
  [SECTION_TYPES.INTRODUCTION]: 'Introduction',
  [SECTION_TYPES.EXECUTIVE_SUMMARY]: 'Executive Summary',
  [SECTION_TYPES.CONCLUSION]: 'Conclusion',
  
  // Target Market Audience Profile section names
  [SECTION_TYPES.DEMOGRAPHIC_OVERVIEW]: 'Demographic Overview',
  [SECTION_TYPES.PSYCHOGRAPHIC_PROFILE]: 'Psychographic Profile',
  [SECTION_TYPES.PAIN_POINTS]: 'Pain Points & Challenges',
  [SECTION_TYPES.BUYING_BEHAVIOR]: 'Buying Behavior & Decision Process',
  [SECTION_TYPES.COMMUNICATION_CHANNELS]: 'Communication Channels & Preferences',
  [SECTION_TYPES.CUSTOMER_JOURNEY]: 'Customer Journey Map',
  [SECTION_TYPES.MARKET_TRENDS]: 'Market Trends & Opportunities',
  
  // Business Profile section names
  [SECTION_TYPES.BUSINESS_OVERVIEW]: 'Business Overview',
  [SECTION_TYPES.MARKET_ANALYSIS]: 'Market Analysis',
  [SECTION_TYPES.PRODUCTS_SERVICES]: 'Products & Services',
  [SECTION_TYPES.BUSINESS_MODEL]: 'Business Model',
  [SECTION_TYPES.COMPETITIVE_ANALYSIS]: 'Competitive Analysis',
  [SECTION_TYPES.VALUE_PROPOSITION]: 'Value Proposition',
  [SECTION_TYPES.OPERATIONS]: 'Operations & Resources',
  [SECTION_TYPES.GROWTH_STRATEGY]: 'Growth Strategy',
  
  // Style Guide section names
  [SECTION_TYPES.BRAND_VOICE]: 'Brand Voice & Personality',
  [SECTION_TYPES.TONE_GUIDELINES]: 'Tone & Communication Guidelines',
  [SECTION_TYPES.LANGUAGE_PATTERNS]: 'Language Patterns & Terminology',
  [SECTION_TYPES.CONTENT_STRUCTURE]: 'Content Structure & Formatting',
  [SECTION_TYPES.MESSAGING_FRAMEWORK]: 'Messaging Framework',
  [SECTION_TYPES.RESPONSE_TEMPLATES]: 'Response Templates & Examples',
  [SECTION_TYPES.DO_DONT_EXAMPLES]: 'Do\'s & Don\'ts Examples'
};

module.exports = {
  SECTION_TYPES,
  SECTION_TYPE_NAMES
};