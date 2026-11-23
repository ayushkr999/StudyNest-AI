import { QdrantClient } from '@qdrant/js-client-rest';
import { ENV } from '../config/env.js';
import { ApiError } from '../middleware/error.middleware.js';
import crypto from 'crypto';

let qdrantClient = null;

export const getQdrantClient = () => {
  if (!qdrantClient) {
    if (!ENV.QDRANT_URL) {
      console.warn('[Qdrant] Warning: QDRANT_URL is not set.');
      return null;
    }

    try {
      qdrantClient = new QdrantClient({
        url: ENV.QDRANT_URL,
        apiKey: ENV.QDRANT_API_KEY || undefined,
        checkCompatibility: false,
      });
      console.log('[Qdrant] Client initialized with target:', ENV.QDRANT_URL);
    } catch (err) {
      console.error('[Qdrant] Failed to initialize client:', err.message);
      return null;
    }
  }
  return qdrantClient;
};

export const ensureQdrantCollection = async (collectionName = ENV.QDRANT_COLLECTION, vectorSize = 3072) => {
  const client = getQdrantClient();
  if (!client) return false;

  try {
    const collections = await client.getCollections();
    const exists = collections.collections.some((c) => c.name === collectionName);

    if (!exists) {
      console.log(`[Qdrant] Creating collection "${collectionName}" with dimension ${vectorSize}...`);
      await client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine',
        },
      });
      console.log(`[Qdrant] Collection "${collectionName}" created successfully.`);
    }

    // Ensure payload indexes for filtered vector searches
    try {
      await client.createPayloadIndex(collectionName, {
        field_name: 'userId',
        field_schema: 'keyword',
        wait: true,
      });
    } catch (e) {
      // index exists
    }

    try {
      await client.createPayloadIndex(collectionName, {
        field_name: 'documentId',
        field_schema: 'keyword',
        wait: true,
      });
    } catch (e) {
      // index exists
    }

    return true;
  } catch (error) {
    console.error(`[Qdrant] Error verifying/creating collection "${collectionName}":`, error.message);
    return false;
  }
};

const stringToUuid = (str) => {
  return crypto.createHash('md5').update(str).digest('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
};

export const upsertVectors = async (chunksWithVectors, collectionName = ENV.QDRANT_COLLECTION) => {
  const client = getQdrantClient();
  if (!client) {
    throw new ApiError(503, 'Qdrant vector database is not configured. Check QDRANT_URL and QDRANT_API_KEY.');
  }

  const vectorDim = chunksWithVectors[0]?.vector?.length || 3072;
  await ensureQdrantCollection(collectionName, vectorDim);

  const points = chunksWithVectors.map((chunk) => ({
    id: stringToUuid(chunk.id),
    vector: chunk.vector,
    payload: {
      userId: chunk.metadata.userId,
      documentId: chunk.metadata.documentId,
      documentName: chunk.metadata.documentName,
      pageNumber: chunk.metadata.pageNumber,
      chunkIndex: chunk.metadata.chunkIndex,
      text: chunk.text,
    },
  }));

  // Upsert in batches of 50
  for (let i = 0; i < points.length; i += 50) {
    const batch = points.slice(i, i + 50);
    await client.upsert(collectionName, {
      wait: true,
      points: batch,
    });
  }

  return true;
};

export const searchSimilarChunks = async ({
  queryVector,
  userId,
  documentIds = [],
  limit = 5,
  collectionName = ENV.QDRANT_COLLECTION,
}) => {
  const client = getQdrantClient();
  if (!client) {
    throw new ApiError(503, 'Qdrant vector database is not configured.');
  }

  const mustFilters = [
    {
      key: 'userId',
      match: { value: userId.toString() },
    },
  ];

  if (documentIds && documentIds.length > 0) {
    mustFilters.push({
      key: 'documentId',
      match: {
        any: documentIds.map((id) => id.toString()),
      },
    });
  }

  const searchResult = await client.search(collectionName, {
    vector: queryVector,
    limit,
    filter: {
      must: mustFilters,
    },
    with_payload: true,
  });

  return searchResult.map((item) => ({
    score: item.score,
    text: item.payload?.text || '',
    pageNumber: item.payload?.pageNumber || 1,
    documentId: item.payload?.documentId,
    documentName: item.payload?.documentName || 'Unknown Document',
    chunkIndex: item.payload?.chunkIndex,
  }));
};

export const deleteDocumentVectors = async (documentId, userId, collectionName = ENV.QDRANT_COLLECTION) => {
  const client = getQdrantClient();
  if (!client) return false;

  try {
    await client.delete(collectionName, {
      filter: {
        must: [
          { key: 'userId', match: { value: userId.toString() } },
          { key: 'documentId', match: { value: documentId.toString() } },
        ],
      },
    });
    return true;
  } catch (err) {
    console.error(`[Qdrant] Failed to delete vectors for doc ${documentId}:`, err.message);
    return false;
  }
};
