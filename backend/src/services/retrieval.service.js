import { generateEmbedding } from './embedding.service.js';
import * as qdrantService from './qdrant.service.js';

export const retrieveRelevantChunks = async ({ question, userId, documentIds = [], limit = 5 }) => {
  const queryVector = await generateEmbedding(question);

  const matchedChunks = await qdrantService.searchSimilarChunks({
    queryVector,
    userId,
    documentIds,
    limit,
  });

  return matchedChunks;
};
