import { Embeddings } from '@langchain/core/embeddings';
import { getGeminiEmbeddingModel } from './gemini.service.js';

/**
 * LangChain.js compatible Gemini Embeddings integration
 */
export class GeminiLangChainEmbeddings extends Embeddings {
  constructor(fields = {}) {
    super(fields);
    this.modelName = fields.modelName || process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
  }

  async embedDocuments(documents) {
    const model = getGeminiEmbeddingModel(this.modelName);
    if (!model) {
      throw new Error('Gemini embedding model is not configured.');
    }

    const vectors = [];
    const batchSize = 20;

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      try {
        const res = await model.batchEmbedContents({
          requests: batch.map((text) => ({
            content: { parts: [{ text }] },
          })),
        });
        vectors.push(...res.embeddings.map((e) => e.values));
      } catch (err) {
        for (const text of batch) {
          const single = await model.embedContent(text);
          vectors.push(single.embedding.values);
        }
      }
    }

    return vectors;
  }

  async embedQuery(document) {
    const model = getGeminiEmbeddingModel(this.modelName);
    if (!model) {
      throw new Error('Gemini embedding model is not configured.');
    }
    const res = await model.embedContent(document);
    return res.embedding.values;
  }
}
