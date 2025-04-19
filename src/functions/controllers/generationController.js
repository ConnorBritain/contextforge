const firestoreService = require('../services/firestoreService');
const aiServiceFactory = require('../services/aiServiceFactory');
const { chunkTextByTokens } = require('../utils/tokenChunker');
const config = require('../config/default');
const { Writable } = require('stream');

// Get the configured AI service
const aiService = aiServiceFactory.getService();

/**
 * Controller to handle the generation of a context document.
 * Fetches wizard data, chunks it, sends it to the AI service, and streams results.
 */
const generateContextDocument = async (req, res, next) => {
  const { wizardId } = req.body; // Assuming wizardId is passed in the request body
  const userId = req.auth?.uid; // From auth middleware

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found.' });
  }
  if (!wizardId) {
    return res.status(400).json({ message: 'Bad Request: Missing wizardId.' });
  }

  try {
    // 1. Fetch wizard document from Firestore
    const db = firestoreService.getFirestore();
    const docId = `${userId}_${wizardId}`;
    const docRef = db.collection('wizardResponses').doc(docId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).json({ message: `Wizard data not found for ID: ${wizardId}` });
    }
    const wizardData = docSnapshot.data();

    // Simple check to ensure we have some data
    if (!wizardData || Object.keys(wizardData).length === 0) {
        return res.status(400).json({ message: 'Wizard data is empty.' });
    }

    // 2. Chunk the wizard data
    const wizardDataString = JSON.stringify(wizardData);
    // Use config for model, maxTokens, overlap if available, otherwise defaults
    const modelName = config.ai?.model || 'gpt-3.5-turbo';
    const maxTokens = config.chunker?.maxTokens || 2000;
    const overlap = config.chunker?.overlap || 200;
    
    let chunks = [];
    try {
        chunks = chunkTextByTokens(wizardDataString, modelName, maxTokens, overlap);
        console.log(`Successfully chunked wizard data into ${chunks.length} chunks.`);
    } catch (chunkError) {
        console.error('Error chunking wizard data:', chunkError);
        return res.status(500).json({ message: 'Failed to process wizard data for generation.' });
    }

    // 3. Set up Server-Sent Events (SSE)
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // Function to send SSE messages
    const sendEvent = (eventName, data) => {
      res.write(`event: ${eventName}
`);
      res.write(`data: ${JSON.stringify(data)}

`);
    };

    // Send initial message indicating the number of chunks
    sendEvent('start', { message: `Starting generation with ${chunks.length} chunks...`, totalChunks: chunks.length });

    // 4. Process each chunk and stream results
    let fullDocument = '';
    let processedChunks = 0;

    // Placeholder for the actual generation prompt - needs to be defined
    // This prompt should instruct the AI on how to process each chunk 
    // and contribute to the final document.
    const generationPromptTemplate = (chunk, isFirstChunk, isLastChunk, previousContext = '') => {
        let prompt = `You are building a comprehensive document based on provided data chunks. `; 
        if (isFirstChunk) {
            prompt += `This is the first chunk. Start the document generation based on this: 

${chunk}`;
        } else if (isLastChunk) {
            prompt += `This is the final chunk. Use this information along with the context from previous chunks to complete the document. 
Previous Context: ${previousContext}

Current Chunk: 
${chunk}`;
        } else {
            prompt += `This is an intermediate chunk. Continue building the document using this information and the context from previous chunks. 
Previous Context: ${previousContext}

Current Chunk: 
${chunk}`;
        }
        prompt += `

--- Ensure the output is a coherent continuation or completion of the document. ---`;
        return prompt;
    };

    // Use a simple sequential approach for now
    // More robust implementation might involve parallel processing or different context passing strategies
    let accumulatedContext = '';
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const isFirst = i === 0;
      const isLast = i === chunks.length - 1;
      
      // Construct the prompt for the current chunk
      const prompt = generationPromptTemplate(chunk, isFirst, isLast, accumulatedContext.slice(-500)); // Pass last 500 chars of context

      try {
        sendEvent('chunk_processing', { chunkNumber: i + 1, totalChunks: chunks.length });
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);
        
        const result = await aiService.generateContext(prompt, {}); // Pass options if needed
        
        if (result && result.content) {
            const content = result.content;
            fullDocument += content + '
'; // Append result of each chunk
            accumulatedContext += content + '
'; // Update accumulated context
            
            // Stream partial result to the client
            sendEvent('chunk_result', { chunkNumber: i + 1, content: content });
            processedChunks++;
            console.log(`Chunk ${i + 1} processed successfully.`);
        } else {
            console.warn(`Chunk ${i + 1} did not return content.`);
            sendEvent('chunk_error', { chunkNumber: i + 1, message: 'AI service returned no content for this chunk.' });
        }

      } catch (error) {
        console.error(`Error processing chunk ${i + 1}:`, error);
        sendEvent('chunk_error', { chunkNumber: i + 1, message: error.message || 'Failed to process chunk.' });
        // Decide if we should continue or abort
        // For now, we'll try to continue but signal the error
      }
    }

    // 5. Signal completion
    sendEvent('end', { 
        message: `Generation complete. Processed ${processedChunks}/${chunks.length} chunks.`, 
        finalDocument: fullDocument // Optionally send the full document at the end
    });
    res.end(); // End the SSE connection

  } catch (error) {
    console.error('Error generating context document:', error);
    // If headers already sent for SSE, we can't send a JSON error response
    if (!res.headersSent) {
        next(error); // Pass to global error handler if possible
    } else {
        // Try to send an error event via SSE if the connection is still open
        try {
            res.write(`event: error
`);
            res.write(`data: ${JSON.stringify({ message: error.message || 'Internal Server Error' })}

`);
            res.end();
        } catch (sseError) {
            console.error('Failed to send error via SSE:', sseError);
        }
    }
  }
};

module.exports = {
  generateContextDocument,
};
