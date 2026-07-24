import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axiosInstance from '../utils/axios';
import { useAuthStore } from '../store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Send, ArrowLeft, Bot, Hash, Lightbulb, Loader2 } from 'lucide-react';

// Use same URL as axiosInstance base — works for both local dev and production
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const StudyRoomChat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(SOCKET_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.emit('join-room', {
      roomId,
      userId: user._id,
      username: user.name || user.email || 'Anonymous'
    });

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user-joined', (data) => {
      setMessages(prev => [...prev, {
        _id: Date.now(), username: 'System', message: data.message,
        isAI: false, timestamp: new Date(), isSystem: true
      }]);
    });

    newSocket.on('room-closed', (data) => {
      setMessages(prev => [...prev, {
        _id: Date.now(), username: 'System', message: data.message,
        isAI: false, timestamp: new Date(), isSystem: true
      }]);
      setTimeout(() => {
        navigate('/study-rooms');
      }, 2000);
    });

    newSocket.on('user-left', (data) => {
      setMessages(prev => [...prev, {
        _id: Date.now(), username: 'System', message: data.message,
        isAI: false, timestamp: new Date(), isSystem: true
      }]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    fetchRoomDetails();

    return () => {
      axiosInstance.post(`/api/study-rooms/leave/${roomId}`).catch(console.error);
      newSocket.emit('leave-room');
      newSocket.close();
    };
  }, [roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/study-rooms/${roomId}`);
      if (response.data.success) {
        setRoomDetails(response.data.room);
        setMessages(response.data.room.messages || []);
        setParticipants(response.data.room.participants || []);
      }
    } catch (error) {
      navigate('/study-rooms');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    socket.emit('send-message', {
      roomId, message: newMessage.trim(),
      userId: user._id, username: user.name || user.email || 'Anonymous'
    });
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeave = async () => {
    try {
      await axiosInstance.post(`/api/study-rooms/leave/${roomId}`);
    } catch (error) {}
    navigate('/study-rooms');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Joining study room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050816] pt-16 flex flex-col overflow-hidden">
      {/* Room header */}
      <div className="glass-dark border-b border-white/5 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLeave}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-8 h-8 rounded-lg gradient-indigo-purple flex items-center justify-center text-white text-sm font-bold">
              {roomDetails?.roomName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">{roomDetails?.roomName}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Hash size={10} />{roomId}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {participants.length} online
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/25 transition-colors"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Participants sidebar */}
        <div className="hidden md:flex flex-col w-56 border-r border-white/5 glass-dark flex-shrink-0">
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={11} />
              Participants ({participants.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {participants.map((p) => (
              <div key={p.userId} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full gradient-indigo-purple flex items-center justify-center text-white text-xs font-bold">
                    {p.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#050816]" />
                </div>
                <span className="text-slate-300 text-xs truncate">{p.username}</span>
              </div>
            ))}
          </div>

          {/* AI Help panel */}
          <div className="p-3 border-t border-white/5">
            <div className="p-3 rounded-xl glass-brand border border-indigo-500/15">
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb size={12} className="text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300">AI Tutor Help</span>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p>• "@ai explain X" — ask a question</p>
                <p>• "@ai help with Y" — get study help</p>
                <p>• "@ai test" — test AI response</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={message._id || index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${
                    message.isSystem
                      ? 'justify-center'
                      : message.userId === user._id
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {/* System message */}
                  {message.isSystem && (
                    <span className="px-4 py-1.5 rounded-full text-xs text-slate-600 glass border border-white/5">
                      {message.message}
                    </span>
                  )}

                  {/* AI message */}
                  {!message.isSystem && message.isAI && (
                    <div className="flex items-start gap-2.5 max-w-[75%]">
                      <div className="w-7 h-7 rounded-lg gradient-purple-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={13} className="text-white" />
                      </div>
                      <div className="glass border border-white/5 rounded-2xl rounded-tl-sm px-4 py-2.5">
                        <div className="text-xs text-indigo-400 font-medium mb-1 flex items-center gap-1">
                          <Bot size={10} /> AI Tutor
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">{message.message}</p>
                        <p className="text-slate-600 text-[10px] mt-1.5">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* User/other messages */}
                  {!message.isSystem && !message.isAI && (
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                      message.userId === user._id
                        ? 'gradient-indigo-purple rounded-tr-sm'
                        : 'glass border border-white/5 rounded-tl-sm'
                    }`}>
                      {message.userId !== user._id && (
                        <p className="text-indigo-400 text-xs font-medium mb-1">{message.username}</p>
                      )}
                      <p className="text-white text-sm leading-relaxed">{message.message}</p>
                      <p className={`text-[10px] mt-1.5 ${message.userId === user._id ? 'text-indigo-200/60' : 'text-slate-600'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-white/5 glass-dark p-4 flex-shrink-0">
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message... (use @ai for AI help)"
                className="input-field flex-1 resize-none py-3 text-sm"
                rows={1}
                style={{ maxHeight: '100px', overflowY: 'auto' }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="btn btn-primary px-4 self-end py-3 disabled:opacity-50"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoomChat;