const fullDocumentPrompt = (formData) => {
   return `
 You are creating a comprehensive Business Dimensional Profile for ${formData.companyName || "the company"} that will be used for AI semantic calibration. This document will help AI systems better understand the business and generate more accurate, relevant outputs.
 
 BUSINESS INFORMATION:
 ${JSON.stringify(formData, null, 2)}
 
 YOUR TASK:
 Create a complete, professional Business Dimensional Profile document with the following specific sections:
 
 Section I: Executive Summary
 - Provide a concise, clear purpose statement for the business
 - Include the mission statement and future vision
 - Describe the target audience and customer base precisely
 - Highlight 3-5 key differentiators that make this business unique
 - Summarize core offerings and services
 - Explain the company's stage and positioning within the market
 
 Section II: Market Analysis & Customer Insights
 - Identify the core problems this business solves for customers
 - Provide a detailed overview of primary customers and audience segments
 - Detail specific customer challenges and pain points (2-4 points)
 - Explain why customers choose this business over competitors
 - Identify market positioning and competitive advantages
 
 Section III: Products & Services
 - List and describe all main products/services offered
 - Explain the unique benefits provided that competitors don't offer
 - Detail special methods, processes, or approaches used
 - Connect offerings to customer needs and problems solved
 - Explain how products/services create value for customers
 
 Section IV: Customer Experience & Journey
 - Map the customer journey from discovery to satisfaction
 - Explain typical customer discovery channels and methods
 - Detail customer onboarding and relationship processes
 - Describe post-purchase support and resources provided
 - Highlight key touchpoints and experience differentiators
 
 Section V: Sales & Marketing Approach
 - Outline customer acquisition strategies and channels
 - Describe the sales process and customer conversion journey
 - Detail effective marketing channels and tactics
 - Explain lead nurturing and relationship-building approaches
 - Connect marketing approaches to customer needs and pain points
 
 Section VI: Brand Values & Identity
 - List core values and principles guiding the business
 - Explain how these values manifest in business operations
 - Describe the desired brand impression and emotional response
 - Connect values to customer expectations and market positioning
 - Detail brand authenticity and consistency measures
 
 Section VII: Operational Structure
 - Describe the team size and composition
 - Explain key operational processes and workflows
 - Detail essential tools, systems, and technologies used
 - Connect operational approach to customer experience
 - Highlight operational strengths and efficiency measures
 
 Section VIII: Growth Strategy & Future Direction
 - Outline short-term goals and priorities (1 year)
 - Describe medium-term vision (3-5 years)
 - Address known challenges and growth obstacles
 - Explain adaptation strategies for industry changes
 - Connect growth plans to market opportunities
 
 Section IX: Financial Model & Pricing Strategy
 - Explain the business revenue model and income sources
 - Detail pricing structures and models
 - Position pricing strategy relative to market (premium, competitive, value)
 - Connect pricing approach to value proposition
 - Highlight financial strengths and considerations
 
 Section X: Competitive Landscape
 - Identify key competitors and market alternatives
 - Detail specific competitive advantages and differentiators
 - Explain industry adaptation and innovation approaches
 - Highlight unique positioning against each competitor
 - Address competitive threats and mitigation strategies
 
 Section XI: Ethics & Community Engagement
 - Describe ethical practices and commitments
 - Detail community initiatives and social responsibility
 - Explain authenticity measures and trust-building approaches
 - Connect ethics to brand values and customer expectations
 - Highlight any cause-related or purpose-driven elements
 
 Section XII: AI Guidance & Special Considerations
 - Note specific areas of focus for AI content generation
 - List any topics, approaches, or messaging to avoid
 - Highlight terminology preferences and language guidance
 - Provide additional context that would help AI systems
 - Include any other business-specific information not covered elsewhere
 
 FORMAT REQUIREMENTS:
 - Use clear, professional language that balances expertise with readability
 - Include section headers and logical organization
 - Prioritize conciseness while maintaining comprehensive coverage
 - Use bullet points for lists and easy scanning
 - Ensure the document is semantically rich for AI systems to understand the business context
 - Maintain consistency in tone and detail level throughout
 - Include cross-references between related sections where helpful
 
 The final document should serve as a comprehensive semantic calibration tool that helps AI systems understand this business's unique context, values, offerings, and positioning.
 `;
 };