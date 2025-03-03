const fullDocumentPrompt = (formData) => {
  return `
# AI Style Guide for ${formData.businessName}

## Document Context
You are crafting a professional AI Style Guide for ${formData.businessName} that will serve as the definitive reference for all AI-driven communications. This document will be used by technical and non-technical stakeholders to ensure consistent AI interactions that authentically represent the brand.

## Business Information
Business Name: ${formData.businessName}
Industry: ${formData.industry}
Brand Voice: ${formData.brandVoice}
Target Audience: ${formData.targetAudience}
Core Values: ${formData.coreValues}
Key Terminology: ${formData.keyTerminology}
Communication Goals: ${formData.communicationGoals}

## Document Requirements
Create a comprehensive, visually structured AI Style Guide with clear section hierarchy, professional formatting, and actionable guidelines. Your document must follow this precise structure:

## I. Executive Summary
- Provide a concise overview of the style guide's purpose
- Summarize the core brand voice attributes in 3-5 descriptive terms
- Explain how this document serves as a blueprint for AI-driven communications
- Include a brief statement on how these guidelines connect to business objectives

## II. Brand Voice & Tone Framework
### Brand Voice Foundation
- Define 3-5 specific voice attributes with detailed explanations of each
- Explain how these attributes relate to ${formData.businessName}'s values and positioning
- Clarify the difference between consistent voice versus adaptable tone
- Include a visual spectrum or matrix showing voice positioning (formal/casual, technical/simple, etc.)

### Tone Variations
- Outline appropriate tone modifiers for different contexts
- Specify emotional range parameters (degree of enthusiasm, empathy, certainty)
- Provide concrete examples of the same message delivered in different tones
- Include guidelines for maintaining voice consistency while adapting tone

### Voice Examples
- Present 5-7 exemplary responses that perfectly embody the brand voice
- For each example, highlight specific elements that make it effective
- Provide before/after examples showing generic responses transformed into on-brand messaging
- Include a "voice comparison chart" contrasting your brand voice with generic alternatives

## III. Language Architecture
### Vocabulary Framework
- List 15-20 power words and phrases that reinforce brand attributes
- Categorize vocabulary by emotional impact and contextual appropriateness
- Provide specific alternatives for common terms that better reflect the brand
- Include guidance on technical language usage with complexity gradients

### Terminology Guidelines
- Create a detailed glossary of key product, service, and brand terminology
- Specify exact phrasing for describing core offerings and features
- Provide context-specific usage rules for specialized terminology
- Include naming conventions and capitalization rules

### Prohibited Language
- List specific terms, phrases, and language patterns to strictly avoid
- Explain the rationale behind each restriction
- Provide preferred alternatives for prohibited language
- Include examples of common language misalignments and their corrections

### Grammar & Style Conventions
- Specify punctuation preferences (serial commas, exclamation points, etc.)
- Detail sentence structure guidelines (length, complexity, active vs. passive)
- Outline capitalization and formatting conventions
- Include guidance on numbers, dates, acronyms, and specialized formatting

## IV. Audience-Centered Communication
### Audience Personas
- Create 2-3 detailed audience personas with communication preferences
- Specify linguistic adaptations for each persona
- Outline attention patterns and information processing preferences
- Include guidance on addressing different knowledge levels

### Technical Language Calibration
- Provide a framework for adjusting technical complexity
- Include examples of the same information at different technical levels
- Specify industry jargon usage guidelines
- Detail how to recognize and respond to the audience's technical fluency

### Cultural & Regional Considerations
- Outline guidance for inclusive, culturally sensitive language
- Specify regional term variations and preferences
- Provide translation and localization principles
- Include guidance on handling culturally specific references and metaphors

## V. Structural & Formatting Standards
### Response Architecture
- Specify ideal response structures for different communication types
- Detail length parameters with minimum/maximum guidelines
- Provide templates for organizing complex information
- Include progressive disclosure frameworks for layered information

### Formatting Specifications
- Outline specific formatting guidelines for:
  * Headings and subheadings (using proper markdown)
  * Bulleted and numbered lists
  * Emphasis techniques (bold, italic, etc.)
  * Block quotes and call-outs
- Include visual examples of properly formatted responses
- Provide templates for different response types

### Complex Information Handling
- Detail strategies for breaking down complex concepts
- Provide frameworks for sequential explanation
- Specify visualization and analogy guidelines
- Include examples of effectively simplified technical content

## VI. Interaction Design Patterns
### Conversation Flows
- Outline standard conversation patterns and response sequencing
- Provide opening and closing techniques with examples
- Detail transitions between topics and information types
- Include guidance on maintaining conversation history coherence

### Query Response Framework
- Specify approaches for different question types
- Detail clarification and disambiguation techniques
- Provide examples of effectively handled complex questions
- Include guidance on balancing conciseness with completeness

### Error & Uncertainty Handling
- Outline protocols for handling incorrect assumptions
- Provide templates for communicating uncertainty
- Detail recovery strategies for miscommunications
- Include examples of gracefully handled errors

## VII. Content Type Guidelines
### Content-Specific Frameworks
- Provide detailed guidelines for each content type:
  * Explanations and definitions
  * Instructions and tutorials
  * Recommendations and suggestions
  * Analysis and insights
  * Confirmation and acknowledgments
- Include specialized templates for each content type
- Detail specific structure, tone, and formatting variations by content category

### Use Case Templates
- Present templated responses for 8-10 common scenarios
- Provide completion examples for each template
- Include guidance on adapting templates while maintaining consistency
- Detail the logical structure underlying each template

## VIII. Brand Alignment Strategy
### Values Integration Framework
- Detail specific techniques for reflecting each core value
- Provide examples of values-aligned communication
- Outline subtle methods for reinforcing brand purpose
- Include guidance on avoiding performative or inauthentic values expression

### Differentiation Guidelines
- Specify language that reinforces key differentiators
- Detail unique perspective and positioning elements
- Provide comparative examples showing distinct brand approach
- Include guidance on maintaining consistent differentiation

### Cross-Channel Consistency
- Outline adaptation guidelines for different communication channels
- Specify elements that must remain consistent across all touchpoints
- Detail voice coordination with other brand communications
- Include guidance on maintaining consistency with human representatives

## IX. Comprehensive Do's and Don'ts
### Best Practices Showcase
- Present 10-15 exemplary responses with detailed analysis
- Group examples by context and communication objective
- Highlight specific techniques that make each example effective
- Include guidance on adapting these examples to different situations

### Anti-Patterns & Corrections
- Present 10-15 problematic examples with detailed critique
- Provide corrected versions of each example
- Categorize common pitfalls by type and severity
- Include warning signs that indicate potential voice misalignment

## X. Implementation & Governance
### Adaptation Framework
- Provide a decision tree for tone adjustment situations
- Detail contextual signals that should trigger adaptations
- Specify limits of acceptable adaptation
- Include escalation criteria for unusual situations

### Governance Model
- Outline the review and approval process for new AI responses
- Detail evaluation criteria for voice alignment
- Specify monitoring and quality assurance procedures
- Include the process for style guide evolution and updates

## XI. Appendices
### Quick Reference Guides
- Include condensed one-page summaries of key guidelines
- Provide voice attribute quick reference card
- Detail emergency response protocols
- Include contact information for style governance team

### Measurement Framework
- Outline metrics for evaluating voice consistency
- Detail success criteria for AI communications
- Specify feedback collection and incorporation process
- Include benchmarks for voice performance

## Formatting Requirements
- Use consistent markdown formatting throughout the document
- Structure with proper hierarchical headings (# for main sections, ## for subsections, etc.)
- Use bullet points for lists and key information
- Include whitespace for readability
- Use bold and italic formatting for emphasis
- Create a document that appears professionally designed for executive review

## Special Instructions
- Create a document that demonstrates the exact voice it prescribes
- Include highly specific, actionable guidance that could be directly implemented
- Ensure all guidelines directly support ${formData.businessName}'s brand identity
- Incorporate ${formData.keyTerminology} naturally throughout the document
- Support all major points with concrete examples
- Format for both digital reading and print production
- Create a document that serves as an exemplar of clear, professional communication
`;
};

module.exports = {
  fullDocumentPrompt
};