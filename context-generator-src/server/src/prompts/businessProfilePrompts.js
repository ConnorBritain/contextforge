const fullDocumentPrompt = (formData) => {
   return `
 You are creating a comprehensive Business Dimensional Profile for ${formData.businessName} that follows a specific structured format.
 
 BUSINESS INFORMATION:
 ${JSON.stringify(formData, null, 2)}
 
 YOUR TASK:
 Create a complete, professional Business Dimensional Profile document with the following specific sections:
 
 Section I: Executive Summary
 - Provide a concise purpose statement for ${formData.businessName}
 - Include mission and vision statements
 - Describe the target audience precisely
 - Highlight 3-5 key differentiators
 - Summarize current offerings
 - Explain strategic positioning within the market
 
 Section II: Market Analysis
 - Analyze the industry landscape and trends
 - Provide a target market overview with detailed segmentation
 - Detail specific audience pain points (4-6 points)
 - Assess the competitive landscape with specific differentiators
 - Identify 2-3 key market opportunities
 
 Section III: Offerings Overview
 - Introduce the core value proposition
 - Detail each core offering with description and goals (4-5 offerings)
 - Include any supplementary offerings
 - Explain how offerings align with the company's mission
 
 Section IV: Business Model & Funnel Strategy
 - Outline the multi-tiered funnel approach
 - Detail each tier's focus, team structure, and tools
 - Explain strategic integration between tiers
 - Highlight time compression and quality multiplication benefits
 - Describe strategic upselling methodologies
 
 Section V: Community & Engagement
 - Explain the role of community in the business
 - Detail interactive events, peer networking, and recognition systems
 - Outline specific engagement strategies
 - Explain why the community matters to the business model
 - Describe how community integrates with the funnel strategy
 
 Section VI: Marketing & Sales Strategy
 - Provide a strategic overview of marketing approach
 - Detail specific channels and tactics for awareness
 - Outline lead nurturing strategies
 - Explain conversion optimization techniques
 - Include metrics and KPIs for measuring success
 
 Section VII: Operational Framework
 - Structure in stages of operations (startup, scale-up, mature operations)
 - Detail team evolution at each stage
 - Outline key processes and responsibilities
 - Recommend specific tools and systems
 - Provide efficiency recommendations
 
 Section VIII: Financial & Growth Projections
 - Include realistic revenue projections with multiple scenarios
 - Detail operational overhead at different stages
 - Present profitability scenarios with actual numbers
 - Include strategic insights on maximizing growth
 - Incorporate advertising and reinvestment strategies
 
 Section IX: Ethical & Philosophical Alignment
 - Reference core values and principles guiding the business
 - Explain alignment with audience values
 - Detail ethical commitments in practice
 - Show how ethics harmonizes with growth objectives
 - Present a philosophical foundation for offerings
 
 Section X: Next Steps & Contingency Plan
 - Outline immediate pre-launch priorities
 - Detail scaling strategy for first 12 months
 - Provide contingency plans for 3-4 potential challenges
 - List key performance indicators
 - Conclude with focus on adaptability and resilience
 
 Appendix & Resources
 - Include relevant supporting materials and resources
 
 FORMAT REQUIREMENTS:
 - Use professional, business language while maintaining readability
 - Include section dividers and clear formatting
 - Balance thoroughness with conciseness
 - Use bullet points for lists and key information
 - Create a document that appears professionally designed for executive review
 - Ensure consistent styling throughout
 - Maintain strong coherence between sections, with cross-references where appropriate
 
 The final document should look and feel like a premium business intelligence document that would be created by a high-end business consulting firm.
 `;
 };