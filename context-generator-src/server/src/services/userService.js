const admin = require('./firebaseAdmin');
const db = admin.firestore();
const usersCollection = db.collection('users');

/**
 * Service to interact with user data in Firestore
 * Replaces User model MongoDB methods with Firestore equivalents
 */
const userService = {
  /**
   * Get user data by ID
   * @param {string} userId - Firebase user ID
   * @returns {Promise<Object|null>} User data or null if not found
   */
  getUserById: async (userId) => {
    try {
      const userDoc = await usersCollection.doc(userId).get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  
  /**
   * Update user profile or usage data
   * @param {string} userId - Firebase user ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: async (userId, updateData) => {
    try {
      await usersCollection.doc(userId).update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Get updated user data
      return await userService.getUserById(userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  /**
   * Create a new user in Firestore
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} Created user data
   */
  createUser: async (userData) => {
    try {
      const userId = userData.uid || userData.id;
      
      await usersCollection.doc(userId).set({
        ...userData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return await userService.getUserById(userId);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  /**
   * Update token usage for a user
   * @param {string} userId - Firebase user ID
   * @param {number} tokenCount - Number of tokens to add
   * @returns {Promise<number>} New token count
   */
  updateTokenUsage: async (userId, tokenCount) => {
    try {
      const userRef = usersCollection.doc(userId);
      
      // Use transaction to ensure atomic update
      return await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error('User not found');
        }
        
        const userData = userDoc.data();
        const newTokenCount = (userData.usage?.tokenCount || 0) + tokenCount;
        
        transaction.update(userRef, {
          'usage.tokenCount': newTokenCount,
          lastActive: admin.firestore.FieldValue.serverTimestamp()
        });
        
        return newTokenCount;
      });
    } catch (error) {
      console.error('Error updating token usage:', error);
      throw error;
    }
  },
  
  /**
   * Increment document count for a user
   * @param {string} userId - Firebase user ID
   * @returns {Promise<number>} New document count
   */
  incrementDocumentCount: async (userId) => {
    try {
      const userRef = usersCollection.doc(userId);
      
      // Use transaction to ensure atomic update
      return await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error('User not found');
        }
        
        transaction.update(userRef, {
          'usage.documents.generated': admin.firestore.FieldValue.increment(1),
          lastActive: admin.firestore.FieldValue.serverTimestamp()
        });
        
        const updatedUser = await userService.getUserById(userId);
        return updatedUser.usage?.documents?.generated || 1;
      });
    } catch (error) {
      console.error('Error incrementing document count:', error);
      throw error;
    }
  },
  
  /**
   * Check if a user has reached their usage limits
   * @param {string} userId - Firebase user ID
   * @returns {Promise<Object>} Usage limit information
   */
  checkUsageLimits: async (userId) => {
    try {
      const userDoc = await usersCollection.doc(userId).get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      const usage = userData.usage || {};
      const subscription = userData.subscription || {};
      
      // Check for subscription validity
      const now = new Date();
      const endDate = subscription.endDate?.toDate() || now;
      
      const isActive = subscription.active !== false;
      const isExpired = now > endDate && subscription.plan !== 'free';
      
      // Check token usage
      const tokenCount = usage.tokenCount || 0;
      const tokenLimit = usage.monthlyAllowance || 50000;
      const isTokenLimitReached = tokenCount >= tokenLimit;
      
      // Check document limit
      const docsGenerated = usage.documents?.generated || 0;
      const docsLimit = usage.documents?.limit || 5;
      const isDocLimitReached = docsGenerated >= docsLimit;
      
      // Check if we need to reset usage (first day of month)
      const resetDate = usage.resetDate?.toDate() || null;
      let wasReset = false;
      
      if (resetDate && now >= resetDate) {
        // Create new reset date for first day of next month
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);
        
        await userService.updateUser(userId, {
          'usage.tokenCount': 0,
          'usage.documents.generated': 0,
          'usage.resetDate': nextMonth
        });
        
        wasReset = true;
      }
      
      return {
        isActive,
        isExpired,
        isTokenLimitReached,
        isDocLimitReached,
        tokenCount,
        tokenLimit,
        docsGenerated,
        docsLimit,
        wasReset,
        userData
      };
    } catch (error) {
      console.error('Error checking usage limits:', error);
      throw error;
    }
  }
};

module.exports = userService;