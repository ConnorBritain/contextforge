/**
 * Prompts for generating Offer Documentation Brief
 */

const fullDocumentPrompt = (formData) => {
  return `
You are creating a comprehensive Offer Documentation Brief for "${formData.offerName}" following a specific structured format.

OFFER INFORMATION:
${JSON.stringify(formData, null, 2)}

YOUR TASK:
Create a complete, professional Offer Documentation Brief document with the following specific sections:

Section I: Executive Summary
- Provide a concise overview of the offer "${formData.offerName}"
- Clearly state the offer type (${formData.offerType})
- Summarize the core transformation this offer provides
- Identify the primary target audience
- Highlight 3-5 key differentiators
- Include a compelling value proposition statement

Section II: Offer Overview & Value Proposition
- Detailed description of the offer and its components
- Explain the core transformation or outcome it provides
- How it fits into the broader business model
- Detail the unique selling proposition (USP)
- List all key benefits and differentiators
- Describe how this offer solves specific problems

Section III: Target Customer Profile
- Detailed description of the primary target audience
- Demographics, psychographics, and behavioral traits
- Specific industry or niche focus
- Current awareness level about this type of solution
- Urgency and priority level of the problem
- Aspirations, goals, and desired outcomes
- Alternative solutions they might consider

Section IV: Pain Points & Solution Mapping
- Detail the top 3-5 pain points experienced by the target audience
- For each pain point, explain how the offer directly addresses it
- Describe the transformation from problem state to desired state
- Include potential objections about the solution's effectiveness
- Explain how this solution is superior to alternatives

Section V: Features & Deliverables
- Comprehensive breakdown of all included features
- Tangible deliverables the customer receives
- Detailed explanation of the delivery process and timeline
- Customer experience journey from purchase to results
- Optional add-ons and upgrades available
- Role of AI or automation in delivery (if applicable)

Section VI: Pricing Strategy & Value Justification
- Detailed pricing model with options if applicable
- Value justification that explains price in relation to benefits
- Competitive price analysis compared to alternatives
- Payment plans, trials, and guarantee information
- Address common price objections with counter-arguments
- Expected ROI or savings calculations

Section VII: Sales & Conversion Framework
- Primary conversion mechanism and customer journey
- Key persuasive elements in the sales approach
- Comprehensive objection handling guide
- Lead nurturing process for non-immediate conversions
- Follow-up sequences and automation details
- Guarantee or risk-reversal strategy

Section VIII: Competitive Analysis & Positioning
- Analysis of direct and indirect competitors
- Unique positioning against alternatives
- Brand's unique perspective on the problem/solution
- Strategy for maintaining competitive edge
- Industry trends that impact positioning
- Threat assessment and mitigation strategy

Section IX: Customer Success & Support
- Expected timeline for customer results
- Support options and accessibility
- Onboarding materials and training resources
- Customer success measurement and enhancement
- Feedback collection and testimonial systems
- Refund and cancellation policies

Section X: Marketing Messages & Copy Points
- Core messaging framework for different channels
- Key headlines and angles for marketing materials
- Bullet points for features and benefits
- Pain-agitation-solution frameworks
- Social proof and testimonial highlights
- Call-to-action variations and value statements

FORMAT REQUIREMENTS:
- Use professional, persuasive language with clarity and precision
- Include section dividers and clear formatting
- Balance thoroughness with conciseness
- Use bullet points for lists and key information
- Create a document that serves as both a strategic guide and practical sales tool
- Ensure consistent styling throughout
- Maintain strong coherence between sections, with cross-references where appropriate
- Provide practical, actionable insights rather than generic statements

The final document should be ready to guide sales page creation, video scripts, email sequences, and any marketing collateral needed to effectively sell this offer.
`;
};

module.exports = { fullDocumentPrompt };