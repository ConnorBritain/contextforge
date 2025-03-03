/**
 * @typedef {Object} Section
 * @property {string} id - Unique identifier for the section
 * @property {string} type - Type of section from SECTION_TYPES
 * @property {string} title - Section title
 * @property {string} content - Section content
 * @property {number} [level=2] - Heading level for the section (1-6)
 * @property {Object} [metadata] - Additional metadata for the section
 */

/**
 * @typedef {Object} DocumentMetadata
 * @property {string} [subtitle] - Document subtitle
 * @property {string} [author] - Document author
 * @property {string} [company] - Company name
 * @property {string} [industry] - Industry
 * @property {string} [createdWith] - AI model used to generate
 * @property {Object} [additional] - Any additional metadata
 */

/**
 * @typedef {Object} Document
 * @property {string} id - Unique identifier
 * @property {string} type - Document type from DOCUMENT_TYPES
 * @property {string} title - Document title
 * @property {Section[]} sections - Document sections
 * @property {string} createdAt - Creation date
 * @property {string} [updatedAt] - Last update date
 * @property {string} userId - Owner user ID
 * @property {DocumentMetadata} [metadata] - Document metadata
 * @property {number} tokensUsed - Number of tokens used to generate
 */

/**
 * @typedef {Object} DocumentFormData
 * @property {string} [businessName] - Business name
 * @property {string} [industry] - Industry or sector
 * @property {string} [businessDescription] - Business description
 * @property {string} [products] - Products or services
 * @property {string} [targetAudience] - Target audience
 * @property {string} [targetAudienceOverview] - Detailed target audience overview
 * @property {string} [coreValues] - Core values
 * @property {string} [missionStatement] - Mission statement
 * @property {string} [visionStatement] - Vision statement
 * @property {string} [keyDifferentiators] - Key differentiators
 * @property {string} [marketPosition] - Market position
 * @property {string} [audienceAge] - Audience age range
 * @property {string} [audienceGender] - Audience gender distribution
 * @property {string} [audienceLocation] - Audience geographic location
 * @property {string} [audiencePainPoints] - Audience pain points
 * @property {string} [audienceGoals] - Audience goals
 * @property {string} [audienceIncomeLevel] - Audience income level
 * @property {string} [marketingChannels] - Marketing channels
 * @property {string} [communicationGoals] - Communication goals
 * @property {string} [keyMessaging] - Key messaging
 * @property {string} [brandVoice] - Brand voice
 * @property {string} [keyTerminology] - Key terminology
 * @property {string} [competitiveAdvantage] - Competitive advantage
 */

module.exports = {}; // Export is needed for JSDoc types to be recognized