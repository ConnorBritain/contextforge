/**
 * Mock data service for development - provides data when MongoDB is not available
 */
class MockDataService {
  constructor() {
    // Initialize with some mock documents
    this.documents = [
      {
        id: 'mock-doc-1',
        title: 'Target Market Audience Profile - Tech SaaS',
        type: 'targetMarketAudience',
        documentType: 'Target Market Audience Profile',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        userId: 'mock-user-1',
        tokensUsed: 4563,
        sections: [
          {
            id: 'section-1-1',
            title: 'Overview',
            content: '## Overview\n\nThis target market audience profile focuses on mid-size SaaS companies in the tech sector. The primary audience consists of decision-makers with technical backgrounds who understand the value of AI-driven solutions.',
            level: 2
          },
          {
            id: 'section-1-2',
            title: 'Demographics',
            content: '## Demographics\n\n- **Age Range**: 30-45 years old\n- **Position**: CTOs, CIOs, VP of Engineering\n- **Company Size**: 50-500 employees\n- **Industry**: Software, Tech Services, Data Analytics\n- **Education**: Technical degrees, often advanced',
            level: 2
          },
          {
            id: 'section-1-3',
            title: 'Psychographics',
            content: '## Psychographics\n\n- Value efficiency and automation\n- Data-driven decision makers\n- Early technology adopters\n- Results-oriented\n- Concerned with ROI and implementation time',
            level: 2
          }
        ]
      },
      {
        id: 'mock-doc-2',
        title: 'Business Dimensional Profile - Growth Marketing Agency',
        type: 'businessProfile',
        documentType: 'Business Dimensional Profile',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
        userId: 'mock-user-1',
        tokensUsed: 7841,
        sections: [
          {
            id: 'section-2-1',
            title: 'Executive Summary',
            content: '## Executive Summary\n\nGrowthPath Marketing is a specialized agency focused on data-driven growth strategies for B2B technology companies. Our unique approach combines technical marketing automation with creative content strategies.',
            level: 2
          },
          {
            id: 'section-2-2',
            title: 'Market Analysis',
            content: '## Market Analysis\n\nThe B2B technology marketing space is increasingly competitive, with clients demanding measurable results and clear ROI. Traditional marketing agencies struggle to provide the technical sophistication needed for modern digital campaigns.',
            level: 2
          },
          {
            id: 'section-2-3',
            title: 'Offerings Overview',
            content: '## Offerings Overview\n\n1. **Technical SEO Optimization**\n2. **Content Marketing for Technical Audiences**\n3. **Marketing Automation Setup & Management**\n4. **Analytics & Attribution Modeling**\n5. **Conversion Rate Optimization**',
            level: 2
          }
        ]
      },
      {
        id: 'mock-doc-3',
        title: 'AI Style Guide - Financial Services Company',
        type: 'styleGuide',
        documentType: 'AI Style Guide',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        userId: 'mock-user-1',
        tokensUsed: 8927,
        sections: [
          {
            id: 'section-3-1',
            title: 'Brand Voice & Tone',
            content: '## Brand Voice & Tone\n\nThe TrustFinance AI voice should be:\n\n- **Authoritative**: Demonstrate expertise without being condescending\n- **Clear**: Avoid jargon and explain financial concepts simply\n- **Reassuring**: Convey security and stability\n- **Professional**: Maintain appropriate formality while being approachable\n- **Helpful**: Focus on customer needs and solutions',
            level: 2
          },
          {
            id: 'section-3-2',
            title: 'Language Guidelines',
            content: '## Language Guidelines\n\n**Preferred Terms**:\n- "Financial plan" (not "money strategy")\n- "Investment portfolio" (not "stock collection")\n- "Risk assessment" (not "risk profile")\n\n**Prohibited Terms**:\n- Avoid gambling metaphors ("bet", "gamble")\n- Avoid excessive optimism ("guaranteed returns")\n- Avoid minimizing risk ("nothing to worry about")',
            level: 2
          },
          {
            id: 'section-3-3',
            title: 'Interaction Design',
            content: '## Interaction Design\n\n- Begin conversations by clarifying the customer\'s financial goals\n- Provide options rather than single recommendations\n- Always clarify risk factors with any investment discussion\n- Include both short-term and long-term considerations\n- End interactions with clear next steps',
            level: 2
          }
        ]
      }
    ];
    
    // Mock users
    this.users = [
      {
        id: 'mock-user-1',
        name: 'Demo User',
        email: 'demo@example.com',
        subscription: {
          plan: 'professional',
          tokensRemaining: 100000,
          tokenLimit: 500000,
          renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days from now
        },
        usageHistory: [
          { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), tokens: 4563 },
          { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), tokens: 7841 },
          { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), tokens: 8927 }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days ago
      }
    ];
  }
  
  /**
   * Get all documents for a user
   */
  getDocuments(userId) {
    return Promise.resolve(this.documents.filter(doc => doc.userId === userId));
  }
  
  /**
   * Get a specific document by ID
   */
  getDocumentById(id) {
    const document = this.documents.find(doc => doc.id === id);
    return Promise.resolve(document || null);
  }
  
  /**
   * Save a new document
   */
  saveDocument(document) {
    const newDoc = {
      ...document,
      id: `mock-doc-${this.documents.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.documents.push(newDoc);
    return Promise.resolve(newDoc);
  }
  
  /**
   * Update an existing document
   */
  updateDocument(id, updates) {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Document not found'));
    }
    
    const updated = {
      ...this.documents[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.documents[index] = updated;
    return Promise.resolve(updated);
  }
  
  /**
   * Delete a document
   */
  deleteDocument(id) {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Document not found'));
    }
    
    this.documents.splice(index, 1);
    return Promise.resolve({ success: true });
  }
  
  /**
   * Get user information
   */
  getUserById(id) {
    const user = this.users.find(user => user.id === id);
    return Promise.resolve(user || null);
  }
  
  /**
   * Update user information
   */
  updateUser(id, updates) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return Promise.reject(new Error('User not found'));
    }
    
    const updated = {
      ...this.users[index],
      ...updates
    };
    
    this.users[index] = updated;
    return Promise.resolve(updated);
  }
  
  /**
   * Authenticate a user - always returns the demo user for development
   */
  authenticate(email, password) {
    // In development mode, always return the demo user
    return Promise.resolve(this.users[0]);
  }
}

// Export a singleton instance
module.exports = new MockDataService();