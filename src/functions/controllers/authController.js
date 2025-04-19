const userService = require('../services/userService');
const logger = require("firebase-functions/logger");

/**
 * Get the current authenticated user's profile from Firestore
 * (User data is already attached to req.user by middleware)
 */
const getProfile = async (req, res) => {
  try {
    // The authenticateAndSyncUser middleware already fetched/created the user
    // and attached it as req.user. We just need to return it.
    const userProfile = req.user;

    if (!userProfile) {
      // Should be caught by middleware, but good to double-check
      logger.error('getProfile: User data missing from req.user after authentication.');
      return res.status(404).send({ error: 'Not Found: User profile not available.' });
    }

    logger.log(`getProfile: Returning profile for user ${userProfile.id}`);
    // Send the user profile attached by the middleware
    res.status(200).json(userProfile);

  } catch (error) {
    // This catch block might be redundant if middleware handles all errors,
    // but keep it as a safety net.
    logger.error(`getProfile: Error fetching profile for user ${req.user?.id}:`, error);
    res.status(500).send({ error: 'Internal Server Error: Could not retrieve profile.' });
  }
};

/**
 * Update the current authenticated user's profile in Firestore
 */
const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    logger.warn('updateProfile: Unauthorized - req.user.id missing.');
    return res.status(401).send({ error: 'Unauthorized: User ID not found.' });
  }

  try {
    // Basic validation/sanitization - avoid updating protected fields
    const allowedUpdates = ['name', 'displayName']; // Add other allowed fields here
    const updates = {};
    for (const key in req.body) {
      if (allowedUpdates.includes(key) && req.body[key] !== undefined && req.body[key] !== null) {
        updates[key] = req.body[key];
      }
    }
    
    // Ensure displayName is updated if name is provided, for consistency
    if (updates.name && !updates.displayName) {
        updates.displayName = updates.name;
    }
     if (updates.displayName && !updates.name) {
        updates.name = updates.displayName;
    }


    if (Object.keys(updates).length === 0) {
      logger.warn(`updateProfile: Bad Request for user ${userId} - No valid fields to update.`);
      // Return current profile instead of error? Or send 400?
      return res.status(400).send({ error: 'Bad Request: No valid fields provided for update.' });
      // return res.status(200).json(req.user);
    }

    logger.log(`updateProfile: User ${userId} updating profile with data:`, updates);
    // Update the user in Firestore
    await userService.updateUser(userId, updates); // Pass only allowed updates

    // Fetch the updated user record to return it
    const updatedUser = await userService.getUserById(userId);

     logger.log(`updateProfile: User ${userId} profile updated successfully.`);
    res.status(200).json({
      message: 'Profile updated successfully.',
      user: updatedUser // Return the updated profile
    });

  } catch (error) {
    logger.error(`updateProfile: Error updating profile for user ${userId}:`, error);
    res.status(500).send({ error: 'Internal Server Error: Could not update profile.' });
  }
};

// --- Admin Functions (Placeholder - Requires Admin Role Check Middleware) ---
// TODO: Implement proper admin role check middleware if these routes are exposed

/**
 * Admin-only: Get user by ID
 */
const getUserByIdAdmin = async (req, res) => {
   // IMPORTANT: Add admin check middleware before this controller in routes
   // if (req.user?.role !== 'admin') {
   //   logger.warn(`getUserByIdAdmin: Forbidden attempt by user ${req.user?.id}`);
   //   return res.status(403).send({ error: 'Forbidden: Not authorized.' });
   // }
   try {
      const { userId: targetUserId } = req.params;
      logger.log(`getUserByIdAdmin: Admin ${req.user.id} fetching profile for ${targetUserId}`);
      const user = await userService.getUserById(targetUserId);
      
      if (!user) {
        return res.status(404).send({ error: 'Not Found: User not found.' });
      }
      res.status(200).json(user);
   } catch (error) {
     logger.error(`getUserByIdAdmin: Error fetching user ${req.params.userId}:`, error);
     res.status(500).send({ error: 'Internal Server Error' });
   }
};

/**
 * Admin-only: Update user by ID
 */
const updateUserByIdAdmin = async (req, res) => {
   // IMPORTANT: Add admin check middleware before this controller in routes
   // if (req.user?.role !== 'admin') {
   //   logger.warn(`updateUserByIdAdmin: Forbidden attempt by user ${req.user?.id}`);
   //   return res.status(403).send({ error: 'Forbidden: Not authorized.' });
   // }
    try {
      const { userId: targetUserId } = req.params;
      // TODO: Add validation/sanitization for admin updates
      const updates = req.body;
      logger.log(`updateUserByIdAdmin: Admin ${req.user.id} updating profile for ${targetUserId} with data:`, updates);
      await userService.updateUser(targetUserId, updates);
      const updatedUser = await userService.getUserById(targetUserId);
      res.status(200).json(updatedUser);
   } catch (error) {
     logger.error(`updateUserByIdAdmin: Error updating user ${req.params.userId}:`, error);
     res.status(500).send({ error: 'Internal Server Error' });
   }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserByIdAdmin,   // Renamed for clarity
  updateUserByIdAdmin // Renamed for clarity
};
