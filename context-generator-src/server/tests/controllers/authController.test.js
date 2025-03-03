const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const User = require('../../src/models/User');
const AuthController = require('../../src/controllers/authController');
const config = require('../../src/config/default');

// Mock express-validator
jest.mock('express-validator');

describe('Auth Controller', () => {
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
    
    // Mock validationResult to return no errors by default
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Mock request and response objects
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Call the register method
      await AuthController.register(req, res);
      
      // Check that the user was created in the database
      const user = await User.findOne({ email: req.body.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(req.body.name);
      
      // Check that the response was sent with the correct status and data
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      // Check that the response contains a token and user data
      const jsonArg = res.json.mock.calls[0][0];
      expect(jsonArg.token).toBeTruthy();
      expect(jsonArg.user).toEqual({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      });
    });
    
    it('should return 400 if validation fails', async () => {
      // Mock validationResult to return errors
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Name is required' }]
      });
      
      // Mock request and response objects
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Call the register method
      await AuthController.register(req, res);
      
      // Check that the response was sent with the correct status and error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Name is required' }] });
    });
    
    it('should return 400 if user already exists', async () => {
      // Create a user in the database
      const existingUser = new User({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      await existingUser.save();
      
      // Mock request and response objects
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Call the register method
      await AuthController.register(req, res);
      
      // Check that the response was sent with the correct status and error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Create a user in the database
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Mock the comparePassword method to return true
      user.comparePassword = jest.fn().mockResolvedValue(true);
      user.generateAuthToken = jest.fn().mockReturnValue('mocked-token');
      
      await user.save();
      
      // Mock request and response objects
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      // Call the login method
      await AuthController.login(req, res);
      
      // Check that the response was sent with the correct data
      expect(res.json).toHaveBeenCalled();
      
      // Check that the response contains a token and user data
      const jsonArg = res.json.mock.calls[0][0];
      expect(jsonArg.token).toBe('mocked-token');
      expect(jsonArg.user).toEqual({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      });
    });
    
    it('should return 400 if user does not exist', async () => {
      // Mock request and response objects
      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password123'
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Call the login method
      await AuthController.login(req, res);
      
      // Check that the response was sent with the correct status and error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
    
    it('should return 400 if password is incorrect', async () => {
      // Create a user in the database
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      // Mock the comparePassword method to return false
      user.comparePassword = jest.fn().mockResolvedValue(false);
      
      await user.save();
      
      // Mock request and response objects
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Call the login method
      await AuthController.login(req, res);
      
      // Check that the response was sent with the correct status and error
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});