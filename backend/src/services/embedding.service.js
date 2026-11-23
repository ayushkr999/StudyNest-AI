import { getGeminiEmbeddingModel } from './gemini.service.js';
import { ApiError } from '../middleware/error.middleware.js';

export const generateEmbedding = async (text) => {
  const model = getGeminiEmbeddingModel();
  if (!model) {
    throw new ApiError(503, 'Gemini embedding model is not configured. Check GEMINI_API_KEY in environment.');
  }

  try {
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (err) {
    console.error('[Gemini Embedding Error]:', err.message);
    throw new ApiError(500, `Failed to generate vector embedding: ${err.message}`);
  }
};

export const generateEmbeddingsBatch = async (chunks, batchSize = 20) => {
  const model = getGeminiEmbeddingModel();
  if (!model) {
    throw new ApiError(503, 'Gemini embedding model is not configured. Check GEMINI_API_KEY in environment.');
  }

  const embeddedChunks = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    try {
      // Use native high-performance batch embedding
      const res = await model.batchEmbedContents({
        requests: batch.map((chunk) => ({
          content: { parts: [{ text: chunk.text }] },
        })),
      });

      for (let j = 0; j < batch.length; j++) {
        embeddedChunks.push({
          ...batch[j],
          vector: res.embeddings[j].values,
        });
      }
    } catch (batchErr) {
      console.warn('[Gemini Batch Embedding Fallback to item-level]:', batchErr.message);
      // Fallback sequentially to handle edge cases
      for (const chunk of batch) {
        try {
          const singleRes = await model.embedContent(chunk.text);
          embeddedChunks.push({
            ...chunk,
            vector: singleRes.embedding.values,
          });
        } catch (itemErr) {
          console.error(`[Embedding Batch Item Error] Chunk ${chunk.id}:`, itemErr.message);
          throw itemErr;
        }
      }
    }

    // Minor delay between batches to respect API limits
    if (i + batchSize < chunks.length) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  return embeddedChunks;
};
