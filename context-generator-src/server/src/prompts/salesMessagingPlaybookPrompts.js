/**
 * Prompts for generating Sales Messaging Playbook
 */

const fullDocumentPrompt = (formData) => {
  return `
You are creating a comprehensive Sales Messaging Playbook that follows a specific structured format.

SALES MESSAGING INFORMATION:
${JSON.stringify(formData, null, 2)}

YOUR TASK:
Create a complete, professional Sales Messaging Playbook with the following specific sections:

Section I: Executive Summary
- Provide a concise overview of the offer and its target audience
- Summarize the core value proposition and key differentiators
- Highlight the primary messaging strategy and approach
- Include a brief statement on the intended emotional impact of the messaging
- Outline the main conversion triggers and calls to action

Section II: Offer Positioning & Core Messaging
- Clear and concise offer description (1-2 sentences)
- Primary value propositions (3-5 bullet points)
- Key differentiators from competitors
- Core message or theme that must be consistently communicated
- Recommended messaging frameworks for different contexts
- Value-based positioning statements for various scenarios

Section III: Audience & Psychographic Analysis
- Detailed ideal customer profile (demographics, psychographics, professional characteristics)
- Primary desires, aspirations, and goals related to this offer
- Key emotional triggers and responses to target
- Common objections, hesitations, and how to address them
- Specific language, terminology, and phrases that resonate with the audience
- Pain points to emphasize and how to frame them effectively

Section IV: Messaging Strategy by Awareness Level
- Unaware Audience: Introduction of the problem and initial engagement strategies
- Problem-Aware Audience: Problem amplification and urgency creation
- Solution-Aware Audience: Solution positioning and differentiation tactics
- Product-Aware Audience: Unique benefit highlighting and competitive advantage messaging
- Ready-to-Buy Audience: Conversion optimization and decision reinforcement
- Sample scripts or templates for each awareness level

Section V: Conversion Triggers & Persuasion Elements
- Key benefits that drive immediate action
- Proactive objection handling strategies and language
- Effective urgency and scarcity techniques
- Social proof and evidence formats that work best
- Risk reversal and guarantee frameworks
- Call-to-action language options for different channels
- Decision-making psychology leveraged in messaging

Section VI: Emotional & Psychological Appeal
- Emotional triggers utilized in messaging
- The emotional journey map from first contact to conversion
- Effective storytelling frameworks and narrative arcs
- Balance of emotional vs. logical appeals
- Psychological principles leveraged (reciprocity, authority, scarcity, etc.)
- Transformation messaging (before/after states)

Section VII: Channel-Specific Messaging
- Email: Subject line templates, email body frameworks, and follow-up sequences
- Social Media: Ad headline templates, copy formats, and platform-specific considerations
- Landing Pages: Headline structures, page flow, and key element recommendations
- Sales Calls/Demos: Talk tracks, discovery questions, and presentation outlines
- Webinars/Presentations: Introduction frameworks, content structure, and closing techniques
- Best practices for adapting core messaging to each channel

Section VIII: Buyer Persona Messaging Adaptation
- Detailed buyer personas or segments
- Persona-specific messaging adjustments
- Unique pain points and desires by persona
- Language variations for different segments
- Most effective social proof by persona
- Decision-making factors for each segment

Section IX: Follow-Up & Retention Communications
- Lead nurturing strategy for non-immediate converters
- Follow-up sequence content and timing
- Post-purchase value reinforcement messaging
- Referral encouragement language and incentives
- Testimonial solicitation approach
- Repeat purchase or upsell communication tactics

Section X: Voice, Tone & Style Guide
- Overall messaging tone characteristics
- Specific approaches for objection handling
- Words, phrases, and terminology to always include
- Language to avoid or exclude
- Grammar, syntax, and punctuation guidelines
- Recommendations for maintaining consistent voice across team members

FORMAT REQUIREMENTS:
- Use professional, persuasive language with clarity and precision
- Include section dividers and clear formatting
- Use bullet points for lists and key messages
- Provide practical, actionable examples rather than generic statements
- Include templates and frameworks where relevant
- Ensure consistent styling throughout
- Use tables for comparative information
- Create a document that serves as a practical reference guide for marketing and sales teams

The final document should be immediately usable by sales and marketing teams to ensure consistent, compelling, and conversion-focused messaging across all touchpoints.
`;
};

module.exports = { fullDocumentPrompt };