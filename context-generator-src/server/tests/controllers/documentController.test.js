const mongoose = require('mongoose');
const Document = require('../../src/models/Document');
const User = require('../../src/models/User');
const DocumentController = require('../../src/controllers/documentController');
const aiServiceFactory = require('../../src/services/aiServiceFactory');
const DocumentProcessor = require('../../src/utils/documentProcessor');
const config = require('../../src/config/default');

// Mock dependencies
jest.mock('../../src/services/aiServiceFactory');
jest.mock('../../src/utils/documentProcessor');

describe('Document Controller', () => {
  let userId;
  let mockAiService;

  beforeAll(async () => {
    // Connect to MongoDB memory server
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await user.save();
    userId = user._id;
  });

  afterAll(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await Document.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the documents collection before each test
    await Document.deleteMany({});
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup mock AI service
    mockAiService = {
      generateContextDocument: jest.fn().mockResolvedValue('AI generated content')
    };
    
    aiServiceFactory.getService = jest.fn().mockReturnValue(mockAiService);
    
    // Setup mock DocumentProcessor
    DocumentProcessor.processResponse = jest.fn().mockReturnValue({
      title: 'Test Document',
      type: 'targetMarketAudience',
      sections: [
        {
          title: 'Introduction',
          level: 1,
          content: 'This is an introduction section',
          id: 'section-0',
          position: 0
        }
      ],
      metadata: {
        title: 'Test Document'
      }
    });
  });

  describe('generateDocument', () => {
    it('should generate a document without saving it if user is not authenticated', async () => {
      // Mock request and response objects
      const req = {
        body: {
          formData: { test: 'data' },
          contextType: 'targetMarketAudience',
          aiProvider: 'anthropic'
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      // Call the generateDocument method
      await DocumentController.generateDocument(req, res);
      
      // Check that the AI service was called with the correct arguments
      expect(aiServiceFactory.getService).toHaveBeenCalledWith('anthropic');
      expect(mockAiService.generateContextDocument).toHaveBeenCalledWith(
        req.body.formData,
        req.body.contextType
      );
      
      // Check that DocumentProcessor was called to process the response
      expect(DocumentProcessor.processResponse).toHaveBeenCalledWith(
        'AI generated content',
        req.body.contextType
      );
      
      // Check that the response was sent with the processed document
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Document',
        type: 'targetMarketAudience'
      }));
      
      // Check that no document was saved to the database
      const documents = await Document.find({});
      expect(documents.length).toBe(0);
    });
    
    it('should generate and save a document if user is authenticated', async () => {
      // Mock request and response objects
      const req = {
        body: {
          formData: { test: 'data' },
          contextType: 'targetMarketAudience',
          aiProvider: 'anthropic'
        },
        user: {
          id: userId
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      // Call the generateDocument method
      await DocumentController.generateDocument(req, res);
      
      // Check that the document was saved to the database
      const documents = await Document.find({});
      expect(documents.length).toBe(1);
      expect(documents[0].userId.toString()).toBe(userId.toString());
      expect(documents[0].title).toBe('Test Document');
      expect(documents[0].type).toBe('targetMarketAudience');
      
      // Check that the response was sent with the processed document including the ID
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: expect.any(String),
        title: 'Test Document',
        type: 'targetMarketAudience'
      }));
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Mock request and response objects
      const req = {
        body: {
          // Missing required fields
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Call the generateDocument method
      await DocumentController.generateDocument(req, res);
      
      // Check that the response was sent with the correct status and error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });
  });

  describe('getUserDocuments', () => {
    it('should return all documents for the authenticated user', async () => {
      // Create some test documents
      await Document.insertMany([
        {
          userId,
          title: 'Document 1',
          type: 'targetMarketAudience',
          content: { test: 'content 1' }
        },
        {
          userId,
          title: 'Document 2',
          type: 'businessProfile',
          content: { test: 'content 2' }
        },
        {
          userId: new mongoose.Types.ObjectId(), // Different user
          title: 'Document 3',
          type: 'styleGuide',
          content: { test: 'content 3' }
        }
      ]);
      
      // Mock request and response objects
      const req = {
        user: {
          id: userId
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      // Call the getUserDocuments method
      await DocumentController.getUserDocuments(req, res);
      
      // Check that the response was sent with the correct documents
      expect(res.json).toHaveBeenCalled();
      
      const jsonArg = res.json.mock.calls[0][0];
      expect(jsonArg.length).toBe(2); // Only documents for this user
      expect(jsonArg[0].title).toBe('Document 2'); // Sorted by createdAt desc
      expect(jsonArg[1].title).toBe('Document 1');
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by ID for the authenticated user', async () => {
      // Create a test document
      const document = new Document({
        userId,
        title: 'Test Document',
        type: 'targetMarketAudience',
        content: { test: 'content' }
      });
      
      await document.save();
      
      // Mock request and response objects
      const req = {
        params: {
          id: document._id
        },
        user: {
          id: userId
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      // Call the getDocumentById method
      await DocumentController.getDocumentById(req, res);
      
      // Check that the response was sent with the correct document
      expect(res.json).toHaveBeenCalled();
      
      const jsonArg = res.json.mock.calls[0][0];
      expect(jsonArg._id.toString()).toBe(document._id.toString());
      expect(jsonArg.title).toBe('Test Document');
    });
    
    it('should return 404 if document is not found', async () => {
      // Mock request and response objects
      const req = {
        params: {
          id: new mongoose.Types.ObjectId()
        },
        user: {
          id: userId
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Call the getDocumentById method
      await DocumentController.getDocumentById(req, res);
      
      // Check that the response was sent with the correct status and error
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Document not found' });
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document by ID for the authenticated user', async () => {
      // Create a test document
      const document = new Document({
        userId,
        title: 'Test Document',
        type: 'targetMarketAudience',
        content: { test: 'content' }
      });
      
      await document.save();
      
      // Mock request and response objects
      const req = {
        params: {
          id: document._id
        },
        user: {
          id: userId
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      // Call the deleteDocument method
      await DocumentController.deleteDocument(req, res);
      
      // Check that the document was deleted from the database
      const foundDocument = await Document.findById(document._id);
      expect(foundDocument).toBeNull();
      
      // Check that the response was sent with the correct message
      expect(res.json).toHaveBeenCalledWith({ message: 'Document deleted successfully' });
    });
    
    it('should return 404 if document is not found', async () => {
      // Mock request and response objects
      const req = {
        params: {
          id: new mongoose.Types.ObjectId()
        },
        user: {
          id: userId
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Call the deleteDocument method
      await DocumentController.deleteDocument(req, res);
      
      // Check that the response was sent with the correct status and error
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Document not found' });
    });
  });
});