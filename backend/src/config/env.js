import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  get PORT() { return process.env.PORT || 5000; },
  get NODE_ENV() { return process.env.NODE_ENV || 'development'; },
  get CLIENT_URL() { return process.env.CLIENT_URL || 'http://localhost:5173'; },
  get MONGO_URI() { return process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studynest'; },
  get JWT_SECRET() { return process.env.JWT_SECRET || 'studynest_jwt_secret_dev_key_replace_in_prod_1234567890'; },
  get JWT_EXPIRES_IN() { return process.env.JWT_EXPIRES_IN || '7d'; },
  get GEMINI_API_KEY() { return process.env.GEMINI_API_KEY || ''; },
  get GEMINI_MODEL() { return process.env.GEMINI_MODEL || 'gemini-3.5-flash'; },
  get GEMINI_EMBEDDING_MODEL() { return process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001'; },
  get QDRANT_URL() { return process.env.QDRANT_URL || ''; },
  get QDRANT_API_KEY() { return process.env.QDRANT_API_KEY || ''; },
  get QDRANT_COLLECTION() { return process.env.QDRANT_COLLECTION || 'studynest_documents'; },
  get STORAGE_PROVIDER() { return process.env.STORAGE_PROVIDER || 'local'; },
  get STORAGE_DIR() { return process.env.STORAGE_DIR || 'uploads'; },
};
