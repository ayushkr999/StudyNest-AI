import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // In dev mode when offline or credentials not yet provided, do not crash process immediately, allow graceful degradation
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
