// Firebase Admin and Functions imports
const functions = require("firebase-functions/v1"); // Using v1 for http/firestore triggers
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

// Initialize Firebase Admin SDK (ensure it's initialized only once)
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const firestoreDb = getFirestore(); // Get Firestore instance

// --- Express App Setup ---
const express = require('express');
const cors = require('cors');

// --- Import Services, Utils, Controllers, Prompts ---
// Note: Ensure these imports align with the actual file structure and exports
const { chunkTextByTokens } = require("./utils/tokenChunker");
const PromptBuilder = require("./utils/promptBuilder");
const DocumentProcessor = require("./utils/documentProcessor");
const AIServiceFactory = require("./services/aiServiceFactory");
const userService = require("./services/userService"); // Assumes userService is adapted if needed
const wizardController = require('./controllers/wizardController'); // Assumes controller methods accept (req, res)
const subscriptionController = require('./controllers/subscriptionController'); // Assumes controller methods accept (req, res)
// documentService might be used internally by controllers, ensure its imports are correct within those files

// --- Authentication Middleware (Adapted for Cloud Functions) ---
const authenticateAndSyncUser = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Check if token exists and has the correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Auth middleware: Missing or invalid Authorization header.');
    // Send response directly for errors in middleware
    return res.status(401).send({ error: 'Unauthorized: Bearer token required.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    logger.log(`Auth middleware: Token verified for user ${userId}`);

    // --- Firestore User Sync ---
    let userRecord = await userService.getUserById(userId);

    if (!userRecord) {
      // User exists in Firebase Auth but not in Firestore DB yet. Create them.
      logger.log(`Auth middleware: User ${userId} not found in Firestore. Creating profile...`);
      const newUserPayload = {
        email: decodedToken.email,
        name: decodedToken.name || '',
        role: decodedToken.role || 'user', // Default role
        usage: { // Initialize with default free tier structure
             tokenCount: 0,
             documents: { generated: 0, limit: 5 },
             monthlyAllowance: 50000,
             resetDate: null
        },
        subscription: {
            plan: 'free', // Default to free plan
            active: true,
            startDate: FieldValue.serverTimestamp()
        },
        authProvider: decodedToken.firebase.sign_in_provider,
        lastLoginAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };
      // Ensure setUser returns the created record or fetch it again
      await userService.setUser(userId, newUserPayload);
      userRecord = await userService.getUserById(userId); // Fetch after creation
      logger.log(`Auth middleware: User profile created in Firestore for ${userId}`);

    } else {
       // User exists, update last login time
        try {
            await userService.updateUser(userId, {
                 lastLoginAt: FieldValue.serverTimestamp(),
                 updatedAt: FieldValue.serverTimestamp() // Also update updatedAt timestamp
             });
             // Refetch user record after update to ensure req.user has latest data
             userRecord = await userService.getUserById(userId);
             logger.log(`Auth middleware: Updated lastLoginAt for user ${userId}`);
        } catch(updateError){
             logger.warn(`Auth middleware: Failed to update lastLoginAt for user ${userId}:`, updateError.message);
             // Non-critical error, continue request processing with existing userRecord
        }
    }

    // Attach the full user profile *from Firestore* to the request object
    if (!userRecord) {
        logger.error(`Auth middleware: Failed to get or create user record for user ${userId} after Firestore sync.`);
        // Send response directly
        return res.status(500).send({ error: 'Internal Server Error: Could not retrieve user profile.' });
    }
    req.user = userRecord; // Attach Firestore user data
    // --- End Firestore User Sync ---

    logger.log(`Auth middleware: User ${userId} authenticated successfully.`);
    next(); // Proceed to the next middleware/route handler

  } catch (err) {
    logger.error('Auth middleware: Token verification or user sync error:', err);
     // Differentiate between invalid token and other errors
    if (err.code === 'auth/id-token-expired' || err.code === 'auth/argument-error' || err.code?.startsWith('auth/')) {
         // Send response directly
         return res.status(401).send({ error: 'Unauthorized: Invalid or expired token.', code: err.code });
    } else {
        // Handle potential errors from userService (setUser, getUserById) or other issues
        // Send response directly
        return res.status(500).send({ error: 'Internal Server Error: Authentication processing failed.' });
    }
  }
};


// --- Initialize Express App ---
const app = express();

// --- Express Middleware ---
// Enable CORS for all origins - IMPORTANT: Restrict this in production!
app.use(cors({ origin: true }));
// Firebase automatically parses JSON request bodies, usually no need for express.json()

// --- API Routes ---
// Health check (public)
app.get('/health', (req, res) => {
  logger.info("API Health check endpoint hit");
  res.status(200).send('OK');
});

// Wizard Routes (Require Authentication + Synced User)
// Assumes wizardController methods are adapted to use req.user and send responses via res
app.post('/wizard/save', authenticateAndSyncUser, wizardController.saveDraft);
app.delete('/wizard/delete/:docId', authenticateAndSyncUser, wizardController.deleteDraft);
app.get('/wizard/drafts', authenticateAndSyncUser, wizardController.getDrafts);


// Subscription Routes (Require Authentication + Synced User)
// Assumes subscriptionController methods are adapted to use req.user and send responses via res
app.get('/subscriptions/plans', authenticateAndSyncUser, subscriptionController.getPlans);
app.get('/subscriptions/current', authenticateAndSyncUser, subscriptionController.getCurrent);
app.post('/subscriptions/update', authenticateAndSyncUser, subscriptionController.updateSubscription);
app.post('/subscriptions/cancel', authenticateAndSyncUser, subscriptionController.cancelSubscription);

// TODO: Define other routes as needed, ensuring controllers are adapted

// --- Export API Function ---
// Expose the Express API as a single Cloud Function named 'api'
exports.api = functions.region('us-central1').https.onRequest(app); // Define region

// --- Firestore Triggered Function: generateContextDocument ---
// (Keep the existing function, ensuring imports and logic are correct)
const runtimeOpts = {
  timeoutSeconds: 540, // Max timeout
  memory: '1GB', // Adjust as needed
};

exports.generateContextDocument = functions
  .region('us-central1') // Specify region consistent with API
  .runWith(runtimeOpts)
  .firestore.document('wizardResponses/{docId}')
  .onCreate(async (snap, context) => {
    const wizardData = snap.data();
    const docId = context.params.docId;
    // Ensure userId is present in the wizardData when saved by the controller
    const userId = wizardData?.userId;

    logger.log(`[${docId}] Triggered generation for user ${userId}`);

    if (!userId) {
      logger.error(`[${docId}] Missing userId in wizard data. Aborting.`);
      await snap.ref.update({ generationStatus: 'error', generationError: 'Missing userId' });
      return null;
    }

     // Check if generation was already started (e.g., due to trigger retry)
     if (wizardData.generationStatus && wizardData.generationStatus !== 'pending') {
         logger.warn(`[${docId}] Generation already started (status: ${wizardData.generationStatus}). Skipping.`);
         return null;
     }


    await snap.ref.update({ generationStatus: 'processing', generatedAt: FieldValue.serverTimestamp() });

    try {
      const contextType = wizardData.documentType;
      if (!contextType) {
        throw new Error('Document type not found in wizard data.');
      }

      // --- Check User Usage BEFORE generation ---
      try {
        const userRecord = await userService.getUserById(userId); // Fetch latest user data
        if (!userRecord) throw new Error("User record not found for usage check.");

        // Define limits based on subscription or defaults
        const docLimit = userRecord.subscription?.documentLimit ?? userRecord.usage?.documents?.limit ?? 5;
        const docsGenerated = userRecord.usage?.documents?.generated ?? 0;

        // Check document limit
        if (docLimit !== Infinity && docsGenerated >= docLimit) {
          throw new Error(`Document generation limit (${docLimit}) reached.`);
        }
        // TODO: Add token limit check if necessary (might require estimating prompt size)
        logger.log(`[${docId}] Usage check passed for user ${userId}.`);

      } catch (usageError) {
        logger.error(`[${docId}] Usage check failed for user ${userId}:`, usageError);
        // Update Firestore doc with specific usage error status
        await snap.ref.update({
          generationStatus: 'error',
          generationError: usageError.message || 'Usage limit check failed.',
          completedAt: FieldValue.serverTimestamp(),
        });
        return null; // Stop processing
      }

      // Destructure form data carefully
      const { userId: _u, createdAt: _c, updatedAt: _u2, generationStatus: _gs, generationError: _ge, generatedContent: _gc, generatedDocumentStructure: _gds, generatedTokensUsed: _gtu, completedAt: _ca, chunkErrors: _ce, ...formDataToChunk } = wizardData;
      const textToChunk = JSON.stringify(formDataToChunk);
      const chunks = chunkTextByTokens(textToChunk, "gpt-3.5-turbo", 2000, 200); // TODO: Make model/params configurable
      logger.log(`[${docId}] Data split into ${chunks.length} chunks.`);

      // --- AI Generation Logic ---
      const aiService = AIServiceFactory.getService(); // TODO: Make AI service configurable
      let fullGeneratedContent = '';
      let totalTokensUsed = 0;
      const chunkErrors = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        logger.log(`[${docId}] Processing chunk ${i + 1}/${chunks.length}`);
        const prompt = PromptBuilder.buildChunkPrompt(contextType, formDataToChunk, chunk, i, chunks.length);

        try {
          const responseData = await aiService.generateContent(prompt);
          fullGeneratedContent += (responseData.content || '') + '

';
          totalTokensUsed += responseData.tokensUsed || 0;
        } catch (chunkError) {
          logger.error(`[${docId}] Error processing chunk ${i + 1}:`, chunkError);
          chunkErrors.push({ chunk: i + 1, message: chunkError.message || "Unknown AI error" });
        }
      }

      logger.log(`[${docId}] Finished processing all chunks. Total tokens approx: ${totalTokensUsed}`);
      const finalProcessedDocument = DocumentProcessor.processResponse(fullGeneratedContent.trim(), contextType);

      // --- Update User Usage AFTER generation ---
      try {
        // Consider batching these Firestore writes
        await userService.updateTokenUsage(userId, totalTokensUsed);
        await userService.incrementDocumentCount(userId);
        logger.log(`[${docId}] User usage updated for ${userId}.`);
      } catch (usageError) {
        logger.error(`[${docId}] Failed to update usage stats for user ${userId}:`, usageError);
        // Add flag or log, but don't necessarily fail the whole process
      }

      // --- Update Firestore Document ---
      const finalStatus = chunkErrors.length > 0 ? 'complete_with_errors' : 'complete';
      const updatePayload = {
        generationStatus: finalStatus,
        generatedContent: finalProcessedDocument.content || "Error: Generated content was empty.",
        generatedTokensUsed: totalTokensUsed,
        completedAt: FieldValue.serverTimestamp(),
        // Store errors if any occurred during this run
        ...(chunkErrors.length > 0 && { chunkErrors: chunkErrors }),
        // Clear generationError field only if this run was successful overall
        generationError: FieldValue.delete()
      };

      await snap.ref.update(updatePayload);
      logger.log(`[${docId}] Generation ${finalStatus}. Document updated in Firestore.`);

    } catch (error) {
      // Catch errors from usage check or other parts of the main try block
      logger.error(`[${docId}] Overall generation failed:`, error);
      try {
        // Ensure we don't overwrite a more specific usage error
        if (!snap.get('generationError')?.includes('limit')) {
             await snap.ref.update({
                 generationStatus: 'error',
                 generationError: error.message || 'An unknown error occurred during generation.',
                 completedAt: FieldValue.serverTimestamp(),
             });
        }
      } catch (updateError) {
        logger.error(`[${docId}] Failed to update document with error status:`, updateError);
      }
    }
    return null; // Indicate function completion
  });
