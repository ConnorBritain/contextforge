const businessProfilePrompts = require('../prompts/businessProfilePrompts');
const marketAudiencePrompts = require('../prompts/marketAudiencePrompts');
const styleGuidePrompts = require('../prompts/styleGuidePrompts');
const personalBioPrompts = require('../prompts/personalBioPrompts');
const offerDocumentationPrompts = require('../prompts/offerDocumentationPrompts');

/**
 * Mock AI service for development and testing
 * Returns predefined responses for different document types
 */
class MockAiService {
  /**
   * Generate a context document based on form data and context type
   * @param {Object} formData - User form data
   * @param {string} contextType - Type of document to generate
   * @returns {Promise<string>} - Generated document content
   */
  async generateContextDocument(formData, contextType) {
    // Add delay to simulate real API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return appropriate mock response based on context type
    switch (contextType) {
      case 'targetMarketAudience':
        return this._generateTargetMarketAudience(formData);
      case 'businessProfile':
        return this._generateBusinessProfile(formData);
      case 'styleGuide':
        return this._generateStyleGuide(formData);
      case 'personalBio':
        return this._generatePersonalBio(formData);
      case 'offerDocumentation':
        return this._generateOfferDocumentation(formData);
      default:
        throw new Error(`Unknown context type: ${contextType}`);
    }
  }
  
  /**
   * Generate mock target market audience profile
   * @param {Object} formData - User form data
   * @returns {string} - Mock document content
   */
  _generateTargetMarketAudience(formData) {
    // Access the full prompt to understand expected structure
    const prompt = marketAudiencePrompts.fullDocumentPrompt(formData);
    
    // Generate mock document based on prompt structure
    return `# Target Market Audience Profile for ${formData.businessName}

## Overview

${formData.businessName} operates at the intersection of purpose and possibility, creating innovative solutions for ${formData.industry} professionals. Our target audience consists of value creators who are motivated by growth, impact, and excellence. Our mission is to empower these professionals with tools and insights that amplify their effectiveness and expand their influence.`;
  }
  
  /**
   * Generate mock business profile document
   * @param {Object} formData - User form data
   * @returns {string} - Mock document content
   */
  _generateBusinessProfile(formData) {
    // Access the full prompt to understand expected structure
    const prompt = businessProfilePrompts.fullDocumentPrompt(formData);
    
    return `# Business Dimensional Profile: ${formData.businessName}

## I. Executive Summary

${formData.businessName} exists to transform how ${formData.industry} professionals approach growth and development through integrated systems and proven methodologies. Our mission is to empower clients with actionable insights that create measurable impact, while our vision is to become the definitive resource for professionals seeking transformative advancement.`;
  }
  
  /**
   * Generate mock style guide document
   * @param {Object} formData - User form data
   * @returns {string} - Mock document content
   */
  _generateStyleGuide(formData) {
    // Access the full prompt to understand expected structure
    const prompt = styleGuidePrompts.fullDocumentPrompt(formData);
    
    return `# AI Style Guide for ${formData.businessName}

## I. Executive Summary

This style guide serves as the definitive reference for all AI-driven communications representing ${formData.businessName}. It establishes clear parameters for voice, tone, language, and interaction patterns to ensure brand consistency across all touchpoints.`;
  }

  /**
   * Generate mock personal bio document
   * @param {Object} formData - User form data
   * @returns {string} - Mock document content
   */
  _generatePersonalBio(formData) {
    // Access the prompts to understand expected structure
    const systemPrompt = personalBioPrompts.PERSONAL_BIO_SYSTEM_PROMPT;
    
    const fullName = formData.fullName || "Jane Doe";
    const industry = formData.industryRole || "Technology";
    
    return `# Personal Bio Document: ${fullName}

## 1. Personal Overview

${fullName} is an experienced professional in the ${industry} sector with a proven track record of delivering results and driving innovation. Leveraging a unique combination of technical expertise and strategic vision, they have consistently demonstrated the ability to navigate complex challenges while maintaining a focus on measurable outcomes and sustainable growth.

### Background & Experience
- **Current Role:** ${formData.industryRole || "Senior Consultant"}
- **Location:** ${formData.location || "San Francisco, CA"}
- **Years of Experience:** ${formData.yearsExperience || "12+"} 
- **Pronouns:** ${formData.pronouns || "They/Them"}

### Expertise & Specialization
${formData.expertise || "Core areas of expertise include strategic planning, process optimization, and cross-functional team leadership. Technical proficiencies encompass data analytics, system architecture, and implementation methodologies that bridge theoretical frameworks with practical applications."}`;
  }
}

  /**
   * Generate mock offer documentation brief
   * @param {Object} formData - User form data
   * @returns {string} - Mock document content
   */
  _generateOfferDocumentation(formData) {
    // Access the full prompt to understand expected structure
    const prompt = offerDocumentationPrompts.fullDocumentPrompt(formData);
    
    const offerName = formData.offerName || "ProductX";
    const offerType = formData.offerType || "service";
    
    return `# Offer Documentation Brief: ${offerName}

## I. Executive Summary

${offerName} is a comprehensive ${offerType} designed to transform how professionals approach their work through innovative methodologies and proven frameworks. This offer delivers exceptional results for ${formData.primaryAudience || "business professionals"} by addressing their core challenges and unlocking new possibilities. Key differentiators include proprietary frameworks, personalized implementation support, and measurable ROI tracking.

## II. Offer Overview & Value Proposition

${offerName} combines cutting-edge strategies with practical implementation tools to create a complete solution for ${formData.primaryAudience || "clients"}. The core transformation focuses on ${formData.coreTransformation || "improved productivity and outcomes"} through a structured approach that consistently delivers results.

### Unique Selling Proposition
${formData.uniqueSellingProposition || "Our proprietary methodology delivers results in half the time of competing approaches while providing superior long-term outcomes and implementation support."}`;
  }
}

module.exports = MockAiService;