import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { setupRoomSocket } from './sockets/roomSocket.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

// Setup Socket.IO
const allowedOrigins = [
  ENV.CLIENT_URL,
  'https://studynest-3zx8s6boc-devayush761-7213s-projects.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    
    credentials: true,
  },
});

  setupRoomSocket(io);

  server.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`  StudyNest AI Backend running on port ${ENV.PORT}`);
    console.log(`  Environment: ${ENV.NODE_ENV}`);
    console.log(`  Client Origin: ${ENV.CLIENT_URL}`);
    console.log(`  Gemini Model: ${ENV.GEMINI_MODEL}`);
    console.log(`  Embedding Model: ${ENV.GEMINI_EMBEDDING_MODEL}`);
    console.log(`  Ready for AI, RAG & Real-Time Collaboration.`);
    console.log(`=======================================================`);
  });
};

startServer().catch((err) => {
  console.error('[Fatal Server Startup Error]:', err);
});
