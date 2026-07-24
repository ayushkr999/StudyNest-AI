import StudyRoom from "../models/studyRoom.model.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Retry with backoff when quota is exceeded
const callWithRetry = async (fn, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes("RESOURCE_EXHAUSTED");
      if (is429 && attempt < maxRetries) {
        const waitSeconds = 15 * attempt;
        console.warn(`⚠️ Quota exceeded in socket. Retrying in ${waitSeconds}s...`);
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
        continue;
      }
      throw err;
    }
  }
};

export const handleSocketConnection = (io) => {
    io.on('connection', (socket) => {
        socket.on('join-room', async (data) => {
            const { roomId, userId, username } = data;
            const normalizedRoomId = roomId ? roomId.toUpperCase() : '';

            try {
                const room = await StudyRoom.findOne({ roomId: normalizedRoomId, isActive: true });
                if (!room) {
                    socket.emit('error', { message: 'Room not found' });
                    return;
                }

                socket.join(normalizedRoomId);
                socket.userId = userId;
                socket.username = username;
                socket.roomId = normalizedRoomId;

                socket.to(normalizedRoomId).emit('user-joined', {
                    userId,
                    username,
                    message: `${username} joined the study room`
                });
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        socket.on('send-message', async (data) => {
            const { roomId, message, userId, username } = data;
            const normalizedRoomId = roomId ? roomId.toUpperCase() : '';

            if (!username) {
                socket.emit('error', { message: 'Username is required' });
                return;
            }

            try {
                const room = await StudyRoom.findOne({ roomId: normalizedRoomId, isActive: true });
                if (!room) {
                    socket.emit('error', { message: 'Room not found' });
                    return;
                }

                const newMessage = {
                    userId,
                    username,
                    message,
                    isAI: false,
                    timestamp: new Date()
                };

                room.messages.push(newMessage);
                await room.save();

                io.to(roomId).emit('new-message', newMessage);

                const messageText = message.toLowerCase();
                if (messageText.includes('@ai') || messageText.includes('ai help') || messageText.startsWith('ai ')) {
                    setTimeout(async () => {
                        try {
                            const aiResponse = await generateAIResponse(message, room.messages);

                            const aiMessage = {
                                userId: 'ai-tutor',
                                username: 'AI Tutor',
                                message: aiResponse,
                                isAI: true,
                                timestamp: new Date()
                            };

                            room.messages.push(aiMessage);
                            await room.save();

                            io.to(roomId).emit('new-message', aiMessage);
                        } catch (error) {
                            console.error('AI response error:', error);
                            const errorMessage = {
                                userId: 'ai-tutor',
                                username: 'AI Tutor',
                                message: "Sorry, I'm having trouble right now. Please try again!",
                                isAI: true,
                                timestamp: new Date()
                            };
                            io.to(roomId).emit('new-message', errorMessage);
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('leave-room', async () => {
            if (socket.roomId && socket.username && socket.userId) {
                try {
                    const room = await StudyRoom.findOne({ roomId: socket.roomId, isActive: true });
                    if (room) {
                        room.participants = room.participants.filter(
                            p => p.userId.toString() !== socket.userId.toString()
                        );

                        const isCreator = room.createdBy.toString() === socket.userId.toString();
                        const isEmpty = room.participants.length === 0;

                        if (isCreator || isEmpty) {
                            room.isActive = false;
                            await room.save();
                            socket.to(socket.roomId).emit('room-closed', {
                                message: isCreator
                                    ? `Room closed: ${socket.username} (creator) left the study room`
                                    : 'Room closed: No participants remaining'
                            });
                        } else {
                            await room.save();
                            socket.to(socket.roomId).emit('user-left', {
                                username: socket.username,
                                message: `${socket.username} left the study room`,
                                participantCount: room.participants.length
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error handling leave room:', error);
                }
            }
        });

        socket.on('disconnect', async () => {
            if (socket.roomId && socket.username && socket.userId) {
                try {
                    const room = await StudyRoom.findOne({ roomId: socket.roomId, isActive: true });
                    if (room) {
                        room.participants = room.participants.filter(
                            p => p.userId.toString() !== socket.userId.toString()
                        );

                        const isCreator = room.createdBy.toString() === socket.userId.toString();
                        const isEmpty = room.participants.length === 0;

                        if (isCreator || isEmpty) {
                            room.isActive = false;
                            await room.save();
                            socket.to(socket.roomId).emit('room-closed', {
                                message: isCreator
                                    ? `Room closed: ${socket.username} (creator) disconnected`
                                    : 'Room closed: No participants remaining'
                            });
                        } else {
                            await room.save();
                            socket.to(socket.roomId).emit('user-left', {
                                username: socket.username,
                                message: `${socket.username} disconnected`,
                                participantCount: room.participants.length
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error handling disconnect:', error);
                }
            }
        });
    });
};

const generateAIResponse = async (userMessage, chatHistory) => {
    try {
        if (userMessage.toLowerCase().includes('test')) {
            return "Hello! I'm your AI tutor and I'm working perfectly! 🤖 How can I help you study today?";
        }

        const recentMessages = chatHistory.slice(-10).map(msg =>
            `${msg.username}: ${msg.message}`
        ).join('\n');

        const prompt = `You are an AI tutor in a collaborative study room. Students are studying together and need your help.

Recent conversation:
${recentMessages}

Current question: ${userMessage}

Please provide a helpful, encouraging response that:
1. Answers their question clearly
2. Encourages collaborative learning
3. Asks follow-up questions to deepen understanding
4. Keeps the response concise (2-3 sentences max)

Response:`;

        const response = await callWithRetry(() =>
            ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            })
        );

        return response.text;
    } catch (error) {
        console.error('AI generation error:', error);
        if (error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED")) {
            return "⏳ AI quota limit reached. Please wait a minute before asking again!";
        }
        return "I'm having trouble processing that right now. Can you try rephrasing your question?";
    }
};