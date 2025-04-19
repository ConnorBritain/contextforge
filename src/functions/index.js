/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Import necessary modules
const functions = require("firebase-functions/v1"); // Using v1 for broader trigger support initially
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

// Import shared utilities and services (adjust paths as necessary)
// Assuming utilities can be shared or copied into the functions directory
const { chunkText } = require("./utils/tokenChunker"); 
const PromptBuilder = require("./utils/promptBuilder"); 
const DocumentProcessor = require("./utils/documentProcessor");
const AIServiceFactory = require("./services/aiServiceFactory");
const userService = require("./services/userService"); 

// Initialize Firebase Admin SDK (ensure it's initialized only once)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// --- Firestore Triggered Function: generateContextDocument --- 

// Define function settings (region, memory, timeout)
const runtimeOpts = {
  timeoutSeconds: 540, // Max timeout
  memory: '1GB', // Adjust as needed
};

exports.generateContextDocument = functions
  .region('us-central1') // Specify region
  .runWith(runtimeOpts)
  .firestore.document('wizardResponses/{docId}')
  .onCreate(async (snap, context) => {
    const wizardData = snap.data();
    const docId = context.params.docId;
    const userId = wizardData?.userId; // Extract userId from the document data

    logger.log(`[${docId}] Triggered generation for user ${userId}`);

    if (!userId) {
      logger.error(`[${docId}] Missing userId in wizard data. Aborting.`);
      // Optionally update Firestore doc with error status
      await snap.ref.update({ generationStatus: 'error', generationError: 'Missing userId' });
      return null;
    }

    // Add initial status to the document
    await snap.ref.update({ generationStatus: 'processing', generatedAt: FieldValue.serverTimestamp() });

    try {
      const contextType = wizardData.documentType;
      if (!contextType) {
        throw new Error('Document type not found in wizard data.');
      }

      // Prepare data for chunking (exclude metadata)
      const { userId: _, createdAt, updatedAt, generationStatus, generationError, generatedContent, ...formDataToChunk } = wizardData;
      const textToChunk = JSON.stringify(formDataToChunk);
      const chunks = chunkText(textToChunk, 2000, 200);
      logger.log(`[${docId}] Data split into ${chunks.length} chunks.`);

      // --- AI Generation Logic --- 
      const aiService = AIServiceFactory.getService(); // Ensure config is available to factory
      let fullGeneratedContent = '';
      let totalTokensUsed = 0;
      let hasChunkError = false;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        logger.log(`[${docId}] Processing chunk ${i + 1}/${chunks.length}`);
        // Update status in Firestore (optional, can be noisy)
        // await snap.ref.update({ generationStatus: `processing_chunk_${i + 1}_of_${chunks.length}` });

        const prompt = PromptBuilder.buildChunkPrompt(contextType, formDataToChunk, chunk, i, chunks.length);

        try {
          const responseData = await aiService.generateContent(prompt);
          fullGeneratedContent += (responseData.content || '') + '

';
          totalTokensUsed += responseData.tokensUsed || 0;
        } catch (chunkError) {
          logger.error(`[${docId}] Error processing chunk ${i + 1}:`, chunkError);
          hasChunkError = true;
          // Store the first chunk error encountered
          if (!wizardData.generationError) {
              await snap.ref.update({ generationError: `Error in chunk ${i+1}: ${chunkError.message}` });
          }
          // Decide whether to continue or break (for now, continue)
        }
      }

      // --- Process Final Document & Update Firestore --- 
      logger.log(`[${docId}] Finished processing all chunks. Total tokens approx: ${totalTokensUsed}`);
      const finalProcessedDocument = DocumentProcessor.processResponse(
          fullGeneratedContent.trim(),
          contextType
      );

      // Update user usage stats (important: needs access to user data)
      // This might require the userService to be adapted for functions environment
      try {
          await userService.updateTokenUsage(userId, totalTokensUsed);
          await userService.incrementDocumentCount(userId);
          logger.log(`[${docId}] User usage updated for ${userId}.`);
      } catch (usageError) {
          logger.error(`[${docId}] Failed to update usage stats for user ${userId}:`, usageError);
          // Proceed with saving the document anyway, but log the error
      }

      // Update the original Firestore document with the result
      const finalStatus = hasChunkError ? 'complete_with_errors' : 'complete';
      await snap.ref.update({
        generationStatus: finalStatus,
        generatedContent: finalProcessedDocument.content, // Store the main content
        // Optionally store the full structured document if needed
        // generatedDocumentStructure: finalProcessedDocument, 
        generatedTokensUsed: totalTokensUsed,
        completedAt: FieldValue.serverTimestamp(),
      });

      logger.log(`[${docId}] Generation ${finalStatus}. Document updated in Firestore.`);

    } catch (error) {
      logger.error(`[${docId}] Overall generation failed:`, error);
      // Update Firestore doc with error status
      try {
        await snap.ref.update({ 
            generationStatus: 'error', 
            generationError: error.message || 'An unknown error occurred during generation.',
            completedAt: FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
          logger.error(`[${docId}] Failed to update document with error status:`, updateError);
      }
    }
    return null; // Indicate function completion
  });

// Note: You might need helper functions or other triggers here.
