/**
 * Test script for token tracking and subscription functionality
 * 
 * This script tests:
 * 1. User registration
 * 2. Document generation and token tracking
 * 3. Subscription tier limits
 * 4. Subscription upgrade/downgrade
 */

const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env.docker') });

const API_URL = process.env.SERVER_URL || 'http://localhost:5000';
const VERBOSE = process.env.VERBOSE === 'true' || false;

// Sample data for testing
const TEST_USERS = [
  {
    name: 'Free Tier User',
    email: 'free@example.com',
    password: 'password123',
    plan: 'free'
  },
  {
    name: 'Basic Tier User',
    email: 'basic@example.com',
    password: 'password123',
    plan: 'basic'
  },
  {
    name: 'Professional Tier User',
    email: 'pro@example.com',
    password: 'password123',
    plan: 'professional'
  }
];

// Sample document generation data
const DOCUMENT_DATA = {
  contextType: 'targetMarketAudience',
  formData: {
    businessName: 'Acme Tech Solutions',
    industry: 'Software Development',
    productDescription: 'Cloud-based project management software for remote teams',
    targetAudience: 'Small to medium-sized technology companies with distributed teams',
    competitorAnalysis: 'Competing with Asana, Trello, and Monday.com but focused on remote work optimization',
    brandVoice: 'Professional, innovative, and supportive',
    primaryGoals: 'Increase brand awareness and drive product sign-ups from tech startups',
  }
};

// Global variables to store test state
let authTokens = {};
let userIds = {};

/**
 * Helper function for making API requests with authentication
 */
const apiRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'post' || method === 'put')) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
        details: error.response.data
      };
    }
    return {
      error: true,
      message: error.message
    };
  }
};

/**
 * Test user registration and login
 */
const testRegistrationAndLogin = async () => {
  console.log('🧪 Testing user registration and login...');
  
  for (const user of TEST_USERS) {
    // Register user
    console.log(`\nRegistering ${user.name}...`);
    const registerResult = await apiRequest('post', '/api/auth/register', user);
    
    if (registerResult.error) {
      // If registration fails, try logging in (might already exist)
      console.log(`Registration failed: ${registerResult.message}, trying login...`);
      const loginResult = await apiRequest('post', '/api/auth/login', {
        email: user.email,
        password: user.password
      });
      
      if (loginResult.error) {
        console.error(`Login failed for ${user.email}: ${loginResult.message}`);
        continue;
      }
      
      authTokens[user.email] = loginResult.token;
      userIds[user.email] = loginResult.user.id;
      console.log(`Logged in as existing user ${user.email}`);
    } else {
      authTokens[user.email] = registerResult.token;
      userIds[user.email] = registerResult.user.id;
      console.log(`Registered new user ${user.email}`);
      
      // Update subscription if needed
      if (user.plan !== 'free') {
        await updateSubscription(user.email, user.plan);
      }
    }
  }
};

/**
 * Update a user's subscription plan
 */
const updateSubscription = async (email, plan) => {
  console.log(`\nUpdating ${email} to ${plan} plan...`);
  const token = authTokens[email];
  
  if (!token) {
    console.error(`No auth token for ${email}`);
    return false;
  }
  
  const result = await apiRequest('put', '/api/subscriptions/update', { plan }, token);
  
  if (result.error) {
    console.error(`Failed to update subscription: ${result.message}`);
    return false;
  }
  
  console.log(`Successfully updated to ${plan} plan`);
  return true;
};

/**
 * Test document generation and token tracking
 */
const testDocumentGeneration = async () => {
  console.log('\n🧪 Testing document generation and token tracking...');
  
  for (const user of TEST_USERS) {
    const email = user.email;
    const token = authTokens[email];
    
    if (!token) {
      console.error(`No auth token for ${email}`);
      continue;
    }
    
    // Get initial usage data
    const initialUsage = await apiRequest('get', '/api/subscriptions/current', null, token);
    
    if (initialUsage.error) {
      console.error(`Failed to get initial usage: ${initialUsage.message}`);
      continue;
    }
    
    console.log(`\n${user.name} (${user.plan} plan):`);
    console.log(`Initial token usage: ${initialUsage.usage.tokenCount}/${initialUsage.usage.tokenAllowance}`);
    console.log(`Initial documents: ${initialUsage.usage.documentsGenerated}/${initialUsage.usage.documentLimit}`);
    
    // Generate a document
    console.log(`Generating document...`);
    const docResult = await apiRequest('post', '/api/documents/generate', DOCUMENT_DATA, token);
    
    if (docResult.error) {
      console.error(`Document generation failed: ${docResult.message}`);
      continue;
    }
    
    // Get updated usage data
    const updatedUsage = await apiRequest('get', '/api/subscriptions/current', null, token);
    
    if (updatedUsage.error) {
      console.error(`Failed to get updated usage: ${updatedUsage.message}`);
      continue;
    }
    
    console.log(`Updated token usage: ${updatedUsage.usage.tokenCount}/${updatedUsage.usage.tokenAllowance}`);
    console.log(`Updated documents: ${updatedUsage.usage.documentsGenerated}/${updatedUsage.usage.documentLimit}`);
    
    // Calculate and display token usage for this generation
    const tokensUsed = updatedUsage.usage.tokenCount - initialUsage.usage.tokenCount;
    console.log(`Tokens used for this document: ${tokensUsed}`);
    
    if (VERBOSE) {
      console.log('\nDocument content preview:');
      console.log(docResult.context.sections[0].content.substring(0, 150) + '...');
    }
  }
};

/**
 * Test subscription limits by repeatedly generating documents
 */
const testSubscriptionLimits = async () => {
  console.log('\n🧪 Testing subscription limits...');
  
  // We'll use the free tier user to test document limits
  const email = TEST_USERS[0].email;
  const token = authTokens[email];
  
  if (!token) {
    console.error(`No auth token for ${email}`);
    return;
  }
  
  // Get current usage
  const initialUsage = await apiRequest('get', '/api/subscriptions/current', null, token);
  
  if (initialUsage.error) {
    console.error(`Failed to get initial usage: ${initialUsage.message}`);
    return;
  }
  
  console.log(`\nFree tier user current state:`);
  console.log(`Documents: ${initialUsage.usage.documentsGenerated}/${initialUsage.usage.documentLimit}`);
  
  // Determine how many documents we need to generate to hit the limit
  const remainingDocuments = initialUsage.usage.documentLimit - initialUsage.usage.documentsGenerated;
  console.log(`Need to generate ${remainingDocuments} more documents to hit limit`);
  
  // Generate documents until we hit the limit
  for (let i = 0; i < remainingDocuments + 1; i++) {
    console.log(`\nGenerating document ${i + 1}/${remainingDocuments + 1}...`);
    const docResult = await apiRequest('post', '/api/documents/generate', DOCUMENT_DATA, token);
    
    if (docResult.error) {
      console.log(`Document generation failed as expected: ${docResult.message}`);
      
      if (i >= remainingDocuments) {
        console.log('✅ Limit properly enforced!');
      } else {
        console.error('❌ Limit triggered too early!');
      }
      
      break;
    }
    
    // If we've generated more documents than the limit, that's an error
    if (i >= remainingDocuments) {
      console.error('❌ Limit not properly enforced - was able to exceed document limit!');
      break;
    }
    
    console.log('Document generated successfully');
  }
};

/**
 * Test subscription upgrade and downgrade
 */
const testSubscriptionChanges = async () => {
  console.log('\n🧪 Testing subscription changes...');
  
  // Use the basic tier user for testing subscription changes
  const email = TEST_USERS[1].email;
  const token = authTokens[email];
  
  if (!token) {
    console.error(`No auth token for ${email}`);
    return;
  }
  
  // Get current subscription
  const initialSub = await apiRequest('get', '/api/subscriptions/current', null, token);
  
  if (initialSub.error) {
    console.error(`Failed to get initial subscription: ${initialSub.message}`);
    return;
  }
  
  console.log(`\nCurrent plan: ${initialSub.subscription.plan}`);
  console.log(`Token allowance: ${initialSub.usage.tokenAllowance}`);
  console.log(`Document limit: ${initialSub.usage.documentLimit}`);
  
  // Upgrade to professional
  console.log('\nUpgrading to professional plan...');
  const upgradeResult = await updateSubscription(email, 'professional');
  
  if (!upgradeResult) {
    console.error('Upgrade failed');
    return;
  }
  
  // Get updated subscription
  const upgradedSub = await apiRequest('get', '/api/subscriptions/current', null, token);
  
  if (upgradedSub.error) {
    console.error(`Failed to get updated subscription: ${upgradedSub.message}`);
    return;
  }
  
  console.log(`New plan: ${upgradedSub.subscription.plan}`);
  console.log(`Token allowance: ${upgradedSub.usage.tokenAllowance}`);
  console.log(`Document limit: ${upgradedSub.usage.documentLimit}`);
  
  // Verify the upgrade increased limits
  if (upgradedSub.usage.tokenAllowance > initialSub.usage.tokenAllowance && 
      upgradedSub.usage.documentLimit > initialSub.usage.documentLimit) {
    console.log('✅ Upgrade successfully increased limits');
  } else {
    console.error('❌ Upgrade did not increase limits correctly');
  }
  
  // Downgrade to free
  console.log('\nDowngrading to free plan...');
  const downgradeResult = await updateSubscription(email, 'free');
  
  if (!downgradeResult) {
    console.error('Downgrade failed');
    return;
  }
  
  // Get downgraded subscription
  const downgradedSub = await apiRequest('get', '/api/subscriptions/current', null, token);
  
  if (downgradedSub.error) {
    console.error(`Failed to get downgraded subscription: ${downgradedSub.message}`);
    return;
  }
  
  console.log(`New plan: ${downgradedSub.subscription.plan}`);
  console.log(`Token allowance: ${downgradedSub.usage.tokenAllowance}`);
  console.log(`Document limit: ${downgradedSub.usage.documentLimit}`);
  
  // Restore original plan
  console.log('\nRestoring original plan...');
  await updateSubscription(email, 'basic');
};

/**
 * Run all tests
 */
const runTests = async () => {
  console.log('🚀 Starting token tracking and subscription tests...');
  
  try {
    await testRegistrationAndLogin();
    await testDocumentGeneration();
    await testSubscriptionChanges();
    await testSubscriptionLimits();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
};

// Run the tests
runTests();