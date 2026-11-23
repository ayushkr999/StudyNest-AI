import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { User } from '../models/User.js';
import { StudyRoom } from '../models/StudyRoom.js';
import { RoomMessage } from '../models/RoomMessage.js';
import { getGeminiModel } from '../services/gemini.service.js';

// Map of roomId -> Map of socketId -> { userId, name, avatar }
const roomPresence = new Map();

export const setupRoomSocket = (io) => {
  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1] ||
        (socket.handshake.headers?.cookie &&
          socket.handshake.headers.cookie
            .split(';')
            .map((c) => c.trim())
            .find((c) => c.startsWith('token='))
            ?.split('=')[1]);

      if (!token) {
        return next(new Error('Authentication required for real-time collaboration.'));
      }

      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      const user = await User.findById(decoded.id).select('name email avatar');

      if (!user) {
        return next(new Error('User not found.'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token.'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] User connected: ${socket.user.name} (${socket.id})`);

    // Join Study Room
    socket.on('join_room', async ({ roomId }) => {
      try {
        const room = await StudyRoom.findById(roomId);
        if (!room) {
          return socket.emit('error', { message: 'Room not found.' });
        }

        socket.join(roomId);
        socket.currentRoomId = roomId;

        if (!roomPresence.has(roomId)) {
          roomPresence.set(roomId, new Map());
        }

        const roomUsers = roomPresence.get(roomId);
        roomUsers.set(socket.id, {
          userId: socket.user._id.toString(),
          name: socket.user.name,
          avatar: socket.user.avatar,
        });

        // Broadcast active presence
        const activeMembers = Array.from(roomUsers.values());
        io.to(roomId).emit('room_presence', {
          roomId,
          activeMembers,
        });

        console.log(`[Socket.IO] ${socket.user.name} joined room ${roomId}`);
      } catch (err) {
        console.error('[Socket Join Error]:', err.message);
      }
    });

    // Leave Study Room
    socket.on('leave_room', ({ roomId }) => {
      socket.leave(roomId);
      if (roomPresence.has(roomId)) {
        const roomUsers = roomPresence.get(roomId);
        roomUsers.delete(socket.id);
        io.to(roomId).emit('room_presence', {
          roomId,
          activeMembers: Array.from(roomUsers.values()),
        });
      }
      socket.currentRoomId = null;
    });

    // Send Real-Time Message
    socket.on('send_message', async ({ roomId, content }) => {
      if (!content || !content.trim()) return;

      try {
        // 1. Save user message to database
        const savedMsg = await RoomMessage.create({
          room: roomId,
          user: socket.user._id,
          senderName: socket.user.name,
          isAi: false,
          content: content.trim(),
        });

        const broadcastPayload = {
          _id: savedMsg._id,
          room: roomId,
          senderName: socket.user.name,
          user: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar,
          },
          isAi: false,
          content: savedMsg.content,
          createdAt: savedMsg.createdAt,
        };

        io.to(roomId).emit('new_message', broadcastPayload);

        // 2. Check for @ai or /ai mention
        const isAiTriggered = /@ai|\/ai/i.test(content);
        if (isAiTriggered) {
          // Notify room that AI Tutor is thinking
          io.to(roomId).emit('ai_typing', { roomId, isTyping: true });

          const cleanedQuery = content.replace(/@ai|\/ai/gi, '').trim();

          const model = getGeminiModel();
          let aiReply = '';

          if (!model) {
            aiReply =
              'Hello! StudyNest AI Tutor is currently in standby mode because GEMINI_API_KEY is not configured on the backend. Please add the API key to enable live AI responses.';
          } else {
            try {
              const prompt = `You are StudyNest AI Tutor participating in a live collaborative group study room with students.
A student (${socket.user.name}) asked: "${cleanedQuery || 'Can you help our study group?'}"

Provide an encouraging, clear, and pedagogically rich academic answer suitable for group study. Use clean Markdown formatting.`;

              const aiRes = await model.generateContent(prompt);
              aiReply = aiRes.response.text();
            } catch (aiErr) {
              console.error('[AI Tutor Socket Error]:', aiErr.message);
              aiReply = `Sorry group, I encountered an issue while generating my answer: ${aiErr.message}`;
            }
          }

          // Save AI response
          const aiSavedMsg = await RoomMessage.create({
            room: roomId,
            user: null,
            senderName: 'StudyNest AI Tutor',
            isAi: true,
            content: aiReply,
          });

          // Stop typing indicator
          io.to(roomId).emit('ai_typing', { roomId, isTyping: false });

          // Broadcast AI Message to room
          io.to(roomId).emit('new_message', {
            _id: aiSavedMsg._id,
            room: roomId,
            senderName: 'StudyNest AI Tutor',
            user: null,
            isAi: true,
            content: aiReply,
            createdAt: aiSavedMsg.createdAt,
          });
        }
      } catch (err) {
        console.error('[Socket send_message error]:', err.message);
        socket.emit('error', { message: 'Failed to send message.' });
      }
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Disconnected: ${socket.user.name}`);
      if (socket.currentRoomId && roomPresence.has(socket.currentRoomId)) {
        const roomUsers = roomPresence.get(socket.currentRoomId);
        roomUsers.delete(socket.id);
        io.to(socket.currentRoomId).emit('room_presence', {
          roomId: socket.currentRoomId,
          activeMembers: Array.from(roomUsers.values()),
        });
      }
    });
  });
};
