const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');
const config = require('../../src/config/default');

// Mock bcrypt and jwt
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to MongoDB memory server
    await mongoose.connect(config.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    // Disconnect from MongoDB memory server
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany({});
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    // Mock bcrypt.genSalt and bcrypt.hash
    bcrypt.genSalt.mockImplementation((saltRounds, callback) => {
      callback(null, 'mockedSalt');
    });
    
    bcrypt.hash.mockImplementation((password, salt, callback) => {
      callback(null, 'hashedPassword');
    });
    
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const user = new User(userData);
    await user.save();
    
    // Find the user in the database
    const foundUser = await User.findOne({ email: userData.email });
    
    // Check that the user was created with the correct data
    expect(foundUser).toBeTruthy();
    expect(foundUser.name).toBe(userData.name);
    expect(foundUser.email).toBe(userData.email);
    expect(foundUser.role).toBe('user'); // Default role should be 'user'
  });

  it('should compare passwords correctly', async () => {
    // Create a user with a known password
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword'
    });
    
    // Mock bcrypt.compare to return true for the correct password
    bcrypt.compare.mockResolvedValueOnce(true);
    
    const result = await user.comparePassword('correctPassword');
    expect(result).toBe(true);
    
    // Mock bcrypt.compare to return false for an incorrect password
    bcrypt.compare.mockResolvedValueOnce(false);
    
    const incorrectResult = await user.comparePassword('wrongPassword');
    expect(incorrectResult).toBe(false);
  });

  it('should generate a valid JWT token', () => {
    // Create a user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Set _id for the user
    user._id = new mongoose.Types.ObjectId('5f7d8f3d9b8d2c001b8d9c9b');
    
    // Mock jwt.sign to return a token
    jwt.sign.mockReturnValueOnce('mockedToken');
    
    const token = user.generateAuthToken();
    
    // Check that jwt.sign was called with the correct arguments
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    // Check that a token was returned
    expect(token).toBe('mockedToken');
  });

  it('should validate required fields', async () => {
    // Create a user without required fields
    const user = new User({});
    
    // Validate the user and expect errors
    let validationError;
    try {
      await user.validate();
    } catch (error) {
      validationError = error;
    }
    
    // Check that validation errors were thrown
    expect(validationError).toBeTruthy();
    expect(validationError.errors.name).toBeTruthy();
    expect(validationError.errors.email).toBeTruthy();
    expect(validationError.errors.password).toBeTruthy();
  });

  it('should validate email format', async () => {
    // Create a user with an invalid email
    const user = new User({
      name: 'Test User',
      email: 'invalidEmail',
      password: 'password123'
    });
    
    // Validate the user and expect errors
    let validationError;
    try {
      await user.validate();
    } catch (error) {
      validationError = error;
    }
    
    // Check that a validation error was thrown for the email
    expect(validationError).toBeTruthy();
    expect(validationError.errors.email).toBeTruthy();
  });
});