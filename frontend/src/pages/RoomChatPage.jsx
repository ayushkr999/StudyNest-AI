import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRoomByCode,
  fetchRoomMessages,
  addMessage,
  setRoomPresence,
  setAiTyping,
  clearActiveRoom,
} from '../features/studyRooms/studyRoomSlice';
import { addToast } from '../features/ui/uiSlice';
import { connectSocket, getSocket } from '../services/socket';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MarkdownView } from '../components/common/MarkdownView';
import {
  ArrowLeft,
  Users,
  Send,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Circle,
} from 'lucide-react';

export const RoomChatPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeRoom, messages, activeMembers, isAiTyping } = useSelector(
    (state) => state.studyRooms
  );
  const currentUser = useSelector((state) => state.auth.user);

  const [messageInput, setMessageInput] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(clearActiveRoom());
    dispatch(fetchRoomByCode(code)).then((res) => {
      if (!res.error && res.payload) {
        dispatch(fetchRoomMessages(res.payload._id));

        // Connect socket & join room
        const socket = connectSocket();
        socket.emit('join_room', { roomId: res.payload._id });

        socket.on('new_message', (msg) => {
          dispatch(addMessage(msg));
        });

        socket.on('room_presence', (data) => {
          if (data.activeMembers) {
            dispatch(setRoomPresence(data.activeMembers));
          }
        });

        socket.on('ai_typing', (data) => {
          dispatch(setAiTyping(data.isTyping));
        });
      }
    });

    return () => {
      const socket = getSocket();
      if (socket && activeRoom?._id) {
        socket.emit('leave_room', { roomId: activeRoom._id });
        socket.off('new_message');
        socket.off('room_presence');
        socket.off('ai_typing');
      }
    };
  }, [dispatch, code]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeRoom) return;

    const socket = getSocket();
    if (socket) {
      socket.emit('send_message', {
        roomId: activeRoom._id,
        content: messageInput.trim(),
      });
      setMessageInput('');
    }
  };

  const handleCopyCode = () => {
    if (activeRoom?.code) {
      navigator.clipboard.writeText(activeRoom.code);
      setCopied(true);
      dispatch(addToast({ message: 'Room code copied to clipboard!', type: 'success' }));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!activeRoom) {
    return (
      <div className="py-12 text-center text-sm text-neutral-400">
        Joining study room...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/study-rooms')}
          >
            Rooms
          </Button>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {activeRoom.name}
            </h1>
            <p className="text-[11px] text-neutral-400">
              Mention <span className="font-semibold text-emerald-600">@ai</span> anytime to summon the AI tutor
            </p>
          </div>
        </div>

        {/* Room Code Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 transition-colors"
            title="Click to copy code"
          >
            <span>Code: {activeRoom.code}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Room Layout: Messages + Active Members */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Messages Feed */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => {
              const isMe = msg.user?._id === currentUser?.id || msg.senderName === currentUser?.name;
              const isAi = msg.isAi;

              return (
                <div
                  key={msg._id || idx}
                  className={`flex gap-3 max-w-3xl ${
                    isMe && !isAi ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs ${
                      isAi
                        ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm'
                        : isMe
                        ? 'bg-emerald-800 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {isAi ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      msg.senderName?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-sm ${
                      isAi
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-neutral-900 dark:text-neutral-100 rounded-tl-none shadow-sm'
                        : isMe
                        ? 'bg-emerald-800 text-white rounded-tr-none'
                        : 'bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-75">
                      <span className="font-semibold">{msg.senderName}</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {isAi ? (
                      <MarkdownView content={msg.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {isAiTyping && (
              <div className="flex gap-2 items-center text-xs text-emerald-600 dark:text-emerald-400 pl-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>StudyNest AI Tutor is synthesizing an answer for the group...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Send Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex gap-2"
          >
            <input
              type="text"
              placeholder="Message study room (type @ai to ask the tutor)..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button type="submit" variant="accent" icon={Send}>
              Send
            </Button>
          </form>
        </div>

        {/* Online Members Sidebar */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 flex flex-col h-[650px] overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Active Peers ({activeMembers.length})</span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2">
            {activeMembers.map((member, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-xs"
              >
                <div className="relative">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold flex items-center justify-center text-[11px]">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <Circle className="w-2 h-2 text-emerald-500 fill-current absolute -top-0.5 -right-0.5" />
                </div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                  {member.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300">
            Tip: Type <span className="font-bold">@ai</span> in the chat box to invoke Gemini to resolve group doubts in real-time.
          </div>
        </div>
      </div>
    </div>
  );
};
