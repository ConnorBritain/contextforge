const jwt = require('jsonwebtoken');
const auth = require('../../src/middleware/auth');
const config = require('../../src/config/default');

// Mock the jsonwebtoken module
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock request and response objects
    mockRequest = {
      header: jest.fn()
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    nextFunction = jest.fn();
  });

  it('should add user to request object when valid token is provided', () => {
    // Mock token in request header
    mockRequest.header.mockReturnValue('valid-token');

    // Mock jwt.verify to return a decoded token
    const user = { id: 'user-id', email: 'test@example.com' };
    jwt.verify.mockReturnValue(user);

    // Call the middleware
    auth(mockRequest, mockResponse, nextFunction);

    // Check that jwt.verify was called with the correct arguments
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.jwt.secret);

    // Check that the user was added to the request object
    expect(mockRequest.user).toEqual(user);

    // Check that next was called
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 status if no token is provided', () => {
    // Mock no token in request header
    mockRequest.header.mockReturnValue(null);

    // Call the middleware
    auth(mockRequest, mockResponse, nextFunction);

    // Check that status and json were called with the correct arguments
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No token, authorization denied' });

    // Check that next was NOT called
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 status if token is invalid', () => {
    // Mock token in request header
    mockRequest.header.mockReturnValue('invalid-token');

    // Mock jwt.verify to throw an error
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Call the middleware
    auth(mockRequest, mockResponse, nextFunction);

    // Check that status and json were called with the correct arguments
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token is not valid' });

    // Check that next was NOT called
    expect(nextFunction).not.toHaveBeenCalled();
  });
});