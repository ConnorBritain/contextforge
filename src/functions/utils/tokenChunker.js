import { encoding_for_model } from "tiktoken";

/**
 * Chunks text based on token count using tiktoken.
 * @param {string} text The input text to chunk.
 * @param {string} modelName The name of the model to use for tokenization (e.g., "gpt-3.5-turbo").
 * @param {number} maxTokens The maximum number of tokens allowed per chunk.
 * @param {number} overlap The number of tokens to overlap between chunks.
 * @returns {string[]} An array of text chunks.
 * @throws {Error} If the model name is not supported or tokenization fails.
 */
export function chunkTextByTokens(text, modelName = "gpt-3.5-turbo", maxTokens = 2000, overlap = 200) {
  if (overlap >= maxTokens) {
    throw new Error("Overlap must be less than maxTokens.");
  }

  let enc;
  try {
    enc = encoding_for_model(modelName);
  } catch (e) {
    console.error(`Failed to get encoding for model ${modelName}:`, e);
    // Fallback or rethrow, depending on desired behavior
    // For now, rethrow to indicate a critical configuration issue
    throw new Error(`Unsupported model for tokenization: ${modelName}`);
  }

  const tokens = enc.encode(text);
  const chunks = [];
  let start = 0;

  while (start < tokens.length) {
    const end = Math.min(start + maxTokens, tokens.length);
    const chunkTokens = tokens.slice(start, end);
    const chunkText = enc.decode(chunkTokens);
    chunks.push(chunkText);

    // Calculate the next start position
    const nextStart = start + maxTokens - overlap;
    
    // If the next start is before the current end and we haven't reached the end of tokens,
    // move the start position forward. Otherwise, break the loop.
    if (nextStart > start && nextStart < tokens.length) {
        start = nextStart;
    } else {
        break; // Exit loop if overlap logic doesn't advance or we're past the end
    }

    // Safety break to prevent infinite loops in edge cases
    if (start >= end) {
        console.warn("Token chunker loop condition met an edge case. Breaking.");
        break;
    }
  }

  enc.free(); // Release the encoder resources
  return chunks;
}

// Example usage:
/*
const sampleText = "This is a sample text that needs to be chunked. It is relatively short for demonstration.";
try {
  const chunks = chunkTextByTokens(sampleText, "gpt-3.5-turbo", 10, 2);
  console.log("Chunks:", chunks);
} catch (error) {
  console.error("Error chunking text:", error);
}
*/

module.exports = { chunkTextByTokens }; // Use module.exports for CommonJS compatibility if needed
