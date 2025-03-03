const mongoose = require('mongoose');
const Document = require('../../src/models/Document');
const User = require('../../src/models/User');
const config = require('../../src/config/default');

describe('Document Model', () => {
  let userId;

  beforeAll(async () => {
    // Connect to MongoDB memory server
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a test user for document associations
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await user.save();
    userId = user._id;
  });

  afterAll(async () => {
    // Clean up test user and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the documents collection before each test
    await Document.deleteMany({});
  });

  it('should create a new document', async () => {
    const documentData = {
      userId,
      title: 'Test Document',
      type: 'targetMarketAudience',
      content: {
        type: 'targetMarketAudience',
        title: 'Test Document',
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
      }
    };
    
    const document = new Document(documentData);
    await document.save();
    
    // Find the document in the database
    const foundDocument = await Document.findOne({ title: documentData.title });
    
    // Check that the document was created with the correct data
    expect(foundDocument).toBeTruthy();
    expect(foundDocument.title).toBe(documentData.title);
    expect(foundDocument.type).toBe(documentData.type);
    expect(foundDocument.userId.toString()).toBe(userId.toString());
    expect(foundDocument.content.sections[0].title).toBe('Introduction');
  });

  it('should validate required fields', async () => {
    // Create a document without required fields
    const document = new Document({});
    
    // Validate the document and expect errors
    let validationError;
    try {
      await document.validate();
    } catch (error) {
      validationError = error;
    }
    
    // Check that validation errors were thrown
    expect(validationError).toBeTruthy();
    expect(validationError.errors.userId).toBeTruthy();
    expect(validationError.errors.title).toBeTruthy();
    expect(validationError.errors.type).toBeTruthy();
    expect(validationError.errors.content).toBeTruthy();
  });

  it('should validate document type', async () => {
    // Create a document with an invalid type
    const document = new Document({
      userId,
      title: 'Test Document',
      type: 'invalidType',
      content: { test: 'content' }
    });
    
    // Validate the document and expect errors
    let validationError;
    try {
      await document.validate();
    } catch (error) {
      validationError = error;
    }
    
    // Check that a validation error was thrown for the type
    expect(validationError).toBeTruthy();
    expect(validationError.errors.type).toBeTruthy();
  });

  it('should update the updatedAt timestamp on save', async () => {
    // Create and save a document
    const document = new Document({
      userId,
      title: 'Test Document',
      type: 'targetMarketAudience',
      content: { test: 'content' }
    });
    
    await document.save();
    
    // Store the original createdAt and updatedAt values
    const originalCreatedAt = document.createdAt;
    const originalUpdatedAt = document.updatedAt;
    
    // Wait a short time to ensure timestamps would differ
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update the document
    document.title = 'Updated Title';
    await document.save();
    
    // Check that updatedAt was changed but createdAt remained the same
    expect(document.createdAt.getTime()).toBe(originalCreatedAt.getTime());
    expect(document.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});