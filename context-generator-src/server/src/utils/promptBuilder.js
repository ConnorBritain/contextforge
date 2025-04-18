const marketAudiencePrompts = require('../prompts/marketAudiencePrompts');
const businessProfilePrompts = require('../prompts/businessProfilePrompts');
const styleGuidePrompts = require('../prompts/styleGuidePrompts');
const personalBioPrompts = require('../prompts/personalBioPrompts');
// Import other prompt files as needed

class PromptBuilder {
  /**
   * Builds the primary prompt for a given document type when NOT chunking.
   */
  static buildPrompt(contextType, formData) {
    switch (contextType) {
      case 'targetMarketAudience':
        return this._buildMarketAudiencePrompt(formData);
      case 'businessProfile':
        return this._buildBusinessProfilePrompt(formData);
      case 'styleGuide':
        return this._buildStyleGuidePrompt(formData);
      case 'personalBio':
        return this._buildPersonalBioPrompt(formData);
      // Add cases for other document types
      default:
        console.warn(`No specific prompt builder found for context type: ${contextType}. Using a generic approach.`);
        return {
            systemPrompt: "You are an AI assistant tasked with generating professional documents based on user input.",
            userPrompt: `Generate a document based on the following data: 

${JSON.stringify(formData, null, 2)}`
        };
    }
  }

  // --- Private builders for specific document types (unchanged) ---
  static _buildMarketAudiencePrompt(formData) {
    return marketAudiencePrompts.fullDocumentPrompt(formData);
  }
  static _buildBusinessProfilePrompt(formData) {
    return businessProfilePrompts.fullDocumentPrompt(formData);
  }
  static _buildStyleGuidePrompt(formData) {
    return styleGuidePrompts.fullDocumentPrompt(formData);
  }
  static _buildPersonalBioPrompt(formData) {
    let userPrompt = personalBioPrompts.PERSONAL_BIO_USER_PROMPT;
    Object.keys(formData).forEach(key => {
      const value = formData[key] || '';
      const keyPattern = new RegExp(`{{${key}}}`, 'g');
      userPrompt = userPrompt.replace(keyPattern, value);
      const ifPattern = new RegExp(`{{#if ${key}}}([\s\S]*?){{/if}}`, 'g');
      userPrompt = userPrompt.replace(ifPattern, value ? '$1' : '');
    });
    userPrompt = userPrompt.replace(/{{#if [\w]+}}[\s\S]*?{{\/if}}/g, '');
    userPrompt = userPrompt.replace(/{{[\w]+}}/g, '');
    return {
      systemPrompt: personalBioPrompts.PERSONAL_BIO_SYSTEM_PROMPT,
      userPrompt: userPrompt
    };
  }
  // Add other builders as needed

  /**
   * Builds a prompt for processing a single chunk of data, including overall context.
   * @param {string} contextType - The type of document being generated.
   * @param {object} fullFormData - The complete original form data.
   * @param {string} chunk - The specific text chunk to process.
   * @param {number} chunkIndex - The index of the current chunk (0-based).
   * @param {number} totalChunks - The total number of chunks.
   * @returns {{systemPrompt: string, userPrompt: string}} The prompt object.
   */
  static buildChunkPrompt(contextType, fullFormData, chunk, chunkIndex, totalChunks) {
    // 1. Get the base system prompt for the document type
    const basePrompts = this.buildPrompt(contextType, fullFormData);
    let systemPrompt = basePrompts.systemPrompt || "You are an AI assistant generating a professional document section by section.";

    // 2. Add chunking instructions to the system prompt
    systemPrompt += `

--- Chunk Processing Instructions ---`;
    systemPrompt += `
You are generating a '${contextType}' document based on extensive user input. The input has been split into ${totalChunks} chunks due to length limitations.`;
    systemPrompt += `
You are currently processing chunk ${chunkIndex + 1} of ${totalChunks}.`;

    if (chunkIndex > 0) {
        systemPrompt += ` Content from previous chunks has already been generated. Focus on generating the content relevant *only* to the current chunk provided in the user prompt, ensuring it flows logically from potential previous sections. Do NOT repeat content from previous chunks unless necessary for context.`;
    } else {
        systemPrompt += ` This is the first chunk. Begin generating the document based on this initial data.`;
    }
    if (chunkIndex < totalChunks - 1) {
        systemPrompt += ` More chunks will follow to complete the document.`;
    } else {
        systemPrompt += ` This is the final chunk. Ensure the document concludes appropriately based on this chunk's data and the overall context.`;
    }
    systemPrompt += `
Format your output clearly using Markdown. Only generate content for the current chunk.`;
    systemPrompt += `
--- End Chunk Processing Instructions ---`;


    // 3. Prepare overall context summary for the user prompt
    //    Extract key identifying information from the full form data.
    //    This helps the AI stay grounded even when processing later chunks.
    let contextSummary = `--- Overall Document Context ---
`;
    contextSummary += `Document Type: ${contextType}
`;
    if (fullFormData.businessName) contextSummary += `Business Name: ${fullFormData.businessName}
`;
    if (fullFormData.targetAudienceOverview) contextSummary += `Target Audience Summary: ${fullFormData.targetAudienceOverview}
`;
    if (fullFormData.personalInfo?.name) contextSummary += `Subject Name: ${fullFormData.personalInfo.name}
`; // Example for personal bio
    // Add other key context fields as relevant for different document types
    contextSummary += `--- End Overall Document Context ---

`;

    // 4. Construct the final user prompt
    const userPrompt = `${contextSummary}Process the following data chunk (Part ${chunkIndex + 1}/${totalChunks}) and generate the corresponding section(s) of the document:

--- Current Chunk Data ---
${chunk}
--- End Current Chunk Data ---`;

    return {
        systemPrompt: systemPrompt,
        userPrompt: userPrompt
    };
  }
}

module.exports = PromptBuilder;
