import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';

// Route imports (MVC Architecture)
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import folderRoutes from './routes/folder.routes.js';
import noteRoutes from './routes/note.routes.js';
import aiRoutes from './routes/ai.routes.js';
import ragRoutes from './routes/rag.routes.js';
import flashcardRoutes from './routes/flashcard.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import roomRoutes from './routes/room.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

export const createApp = () => {
  const app = express();

// CORS Configuration
const allowedOrigins = [
  ENV.CLIENT_URL,
  'https://studynest-3zx8s6boc-devayush761-7213s-projects.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

  // Parsers
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());

  // Static files for uploads if local storage fallback
  const uploadsDir = path.resolve(process.cwd(), ENV.STORAGE_DIR);
  app.use('/uploads', express.static(uploadsDir));

  // Rate Limiting
  app.use('/api', generalLimiter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'StudyNest AI Monolith Backend (MVC)',
      environment: ENV.NODE_ENV,
    });
  });

  // MVC Routes Registration
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/folders', folderRoutes);
  app.use('/api/notes', noteRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/rag', ragRoutes);
  app.use('/api/flashcards', flashcardRoutes);
  app.use('/api/quizzes', quizRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 Handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.originalUrl} not found on StudyNest AI backend.`,
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
