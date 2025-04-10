// Import both the admin app instance and the firestore db instance
const { firebaseAdmin, firestoreDb } = require('./firebaseAdmin');
// Use Firestore FieldValue from the admin instance
const { FieldValue } = firebaseAdmin.firestore;

// Ensure firestoreDb is initialized before proceeding
if (!firestoreDb) {
  throw new Error("Firestore is not initialized. Check Firebase Admin setup.");
}

const usersCollection = firestoreDb.collection('users');

/**
 * Service to interact with user data in Firestore
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
        console.log(`User not found for ID: ${userId}`);
        return null;
      }

      // Include the document ID along with the data
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      // Consider throwing a more specific error or returning null based on desired behavior
      throw error;
    }
  },

  /**
   * Create or completely overwrite a user document in Firestore.
   * Typically used when a user signs up for the first time.
   * @param {string} userId - Firebase user ID
   * @param {Object} userData - User data to store (e.g., email, displayName)
   * @returns {Promise<Object>} Created or updated user data
   */
  setUser: async (userId, userData) => {
    try {
      // Use set with merge: false to ensure we overwrite or create
      await usersCollection.doc(userId).set({
        ...userData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
        // Add any other default fields for a new user here
      }, { merge: false }); // Explicitly overwrite

      console.log(`User document created/set for ID: ${userId}`);
      // Fetch the newly created/set data to return it
      return await userService.getUserById(userId);
    } catch (error) {
      console.error(`Error setting user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Update specific fields of a user profile or usage data.
   * Uses `update` which fails if the document doesn't exist.
   * @param {string} userId - Firebase user ID
   * @param {Object} updateData - Data to update (e.g., { displayName: 'New Name', 'usage.tokenCount': 100 })
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: async (userId, updateData) => {
    try {
      const userRef = usersCollection.doc(userId);
      await userRef.update({
        ...updateData,
        updatedAt: FieldValue.serverTimestamp() // Always update the timestamp
      });

      console.log(`User document updated for ID: ${userId}`);
      // Fetch the updated data to return it
      return await userService.getUserById(userId);
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      // Firestore's update throws if the doc doesn't exist.
      // Handle this case if needed (e.g., by trying to create the user instead)
      if (error.code === 'not-found') {
          console.warn(`Attempted to update non-existent user: ${userId}`);
          // Optionally, create the user here if that's the desired behavior
          // return await userService.setUser(userId, updateData);
          throw new Error(`User with ID ${userId} not found for update.`);
      }
      throw error;
    }
  },

  // --- Usage methods remain largely the same, just ensure FieldValue is correctly referenced ---

  /**
   * Update token usage for a user using a transaction
   * @param {string} userId - Firebase user ID
   * @param {number} tokenCount - Number of tokens *used* in this operation
   * @returns {Promise<number>} New total token count for the current period
   */
  updateTokenUsage: async (userId, tokenCount) => {
    if (typeof tokenCount !== 'number' || tokenCount < 0) {
        throw new Error("Invalid tokenCount provided.");
    }
    try {
      const userRef = usersCollection.doc(userId);

      // Use transaction to ensure atomic read-modify-write
      return await firestoreDb.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error(`User ${userId} not found for updating token usage.`);
        }

        const userData = userDoc.data();
        // Use dot notation for nested fields in updates
        const currentTokenCount = userData.usage?.tokenCount || 0;
        const newTokenCount = currentTokenCount + tokenCount;

        transaction.update(userRef, {
          'usage.tokenCount': newTokenCount,
          lastActive: FieldValue.serverTimestamp() // Update last active time
        });

        console.log(`Updated token usage for ${userId}. Added: ${tokenCount}, New Total: ${newTokenCount}`);
        return newTokenCount; // Return the new total
      });
    } catch (error) {
      console.error(`Error updating token usage for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Increment document count for a user using a transaction
   * @param {string} userId - Firebase user ID
   * @returns {Promise<number>} New total document count for the current period
   */
  incrementDocumentCount: async (userId) => {
    try {
      const userRef = usersCollection.doc(userId);

      // Use transaction for atomic increment
      return await firestoreDb.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error(`User ${userId} not found for incrementing document count.`);
        }

        // Using FieldValue.increment is the standard way for atomic counters
        transaction.update(userRef, {
          'usage.documents.generated': FieldValue.increment(1),
          lastActive: FieldValue.serverTimestamp()
        });

        // Note: FieldValue.increment updates server-side.
        // To return the *new* count, we need the value *after* the transaction commits.
        // We'll return the incremented value directly if possible, or refetch outside transaction.
        // For simplicity, we'll estimate the new count here. For accuracy, refetch after transaction.
        const currentCount = userDoc.data().usage?.documents?.generated || 0;
        const newCount = currentCount + 1;
        console.log(`Incremented document count for ${userId}. New estimated total: ${newCount}`);
        return newCount;
      });
       // If precise count needed immediately after:
       // const updatedUserData = await userService.getUserById(userId);
       // return updatedUserData.usage?.documents?.generated;

    } catch (error) {
      console.error(`Error incrementing document count for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Check if a user has reached their usage limits and potentially resets monthly usage.
   * @param {string} userId - Firebase user ID
   * @returns {Promise<Object>} Usage limit status and user data
   */
  checkUsageLimits: async (userId) => {
    // This function requires careful handling of potentially missing fields
    // and comparing Firestore Timestamps correctly.

    try {
        const userRef = usersCollection.doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error(`User ${userId} not found for checking usage limits.`);
        }

        const userData = userDoc.data();
        const usage = userData.usage || {};
        const subscription = userData.subscription || {}; // Assuming structure { plan: 'free'/'paid', active: true/false, endDate: Timestamp }
        const now = new Date(); // Current time for comparisons
        let wasReset = false; // Flag if usage was reset in this check

        // --- Subscription Status ---
        const isActiveSubscription = subscription.active === true;
        let isExpired = false;
        // Only non-free plans expire based on endDate
        if (subscription.plan !== 'free' && subscription.endDate) {
             // Ensure endDate is a Date object for comparison
            const endDate = subscription.endDate.toDate ? subscription.endDate.toDate() : new Date(subscription.endDate);
            isExpired = now > endDate;
        }
        const canUseService = isActiveSubscription && !isExpired; // Basic check if user account is active

        // --- Usage Reset Logic ---
        // Check if we need to reset usage (typically first day of the month)
        const resetDate = usage.resetDate?.toDate ? usage.resetDate.toDate() : null;

        if (resetDate && now >= resetDate) {
            console.log(`Usage reset triggered for user ${userId}. Reset date: ${resetDate}`);
            // Calculate the next reset date (first day of the *next* month)
            const nextResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            // Reset usage counts and set the next reset date
            await userRef.update({
                'usage.tokenCount': 0,
                'usage.documents.generated': 0,
                'usage.resetDate': firebaseAdmin.firestore.Timestamp.fromDate(nextResetDate) // Store as Firestore Timestamp
            });

            // Update local state to reflect the reset for the current check
            usage.tokenCount = 0;
            usage.documents = { ...usage.documents, generated: 0 };
            usage.resetDate = firebaseAdmin.firestore.Timestamp.fromDate(nextResetDate); // Keep consistency
            wasReset = true;
            console.log(`Usage reset for user ${userId}. Next reset: ${nextResetDate}`);
        } else if (!resetDate) {
             // If resetDate was never set, set it for the first time (start of next month)
             console.log(`Initializing reset date for user ${userId}.`);
             const nextResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
             await userRef.update({
                'usage.resetDate': firebaseAdmin.firestore.Timestamp.fromDate(nextResetDate)
             });
             usage.resetDate = firebaseAdmin.firestore.Timestamp.fromDate(nextResetDate);
        }


        // --- Limit Calculation (Based on potentially reset usage) ---
        // Define limits based on subscription plan (example values)
        let tokenLimit = 50000; // Default free tier
        let docsLimit = 5;     // Default free tier
        if (subscription.plan === 'paid' && canUseService) { // Example paid plan limits
            tokenLimit = 500000;
            docsLimit = 50;
        } else if (subscription.plan === 'free') {
             // Keep default free limits
        } else {
             // No active plan or expired? Set limits to 0 or handle as needed
             tokenLimit = 0;
             docsLimit = 0;
             console.warn(`User ${userId} has no active/valid subscription plan. Limits set to 0.`);
        }

        const tokenCount = usage.tokenCount || 0;
        const docsGenerated = usage.documents?.generated || 0;

        const isTokenLimitReached = tokenCount >= tokenLimit;
        const isDocLimitReached = docsGenerated >= docsLimit;

        return {
            canUseService, // Overall flag if the user's account is active & valid
            isExpired,
            isTokenLimitReached,
            isDocLimitReached,
            tokenCount,
            tokenLimit,
            docsGenerated,
            docsLimit,
            wasReset, // Indicate if usage was reset during this check
            userData // Return potentially updated user data (after reset)
        };
    } catch (error) {
        console.error(`Error checking usage limits for user ${userId}:`, error);
        throw error;
    }
  }
};

module.exports = userService;
