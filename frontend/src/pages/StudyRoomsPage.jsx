import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuthStore } from '../store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, LogIn, Search, Hash, Globe, Loader2 } from 'lucide-react';
import Modal from '../components/ui/Modal.jsx';

const StudyRoomsPage = () => {
  const [activeRooms, setActiveRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchActiveRooms();
  }, []);

  const fetchActiveRooms = async () => {
    try {
      const response = await axiosInstance.get('/api/study-rooms');
      setActiveRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const createRoom = async () => {
    if (!roomName.trim()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/study-rooms/create', { roomName: roomName.trim() });
      if (response.data.success) {
        navigate(`/study-room/${response.data.room.roomId}`);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/study-rooms/join/${roomId}`, {});
      if (response.data.success) {
        navigate(`/study-room/${roomId}`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinRoomById = () => {
    if (!joinRoomId.trim()) return;
    joinRoom(joinRoomId.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/3 w-80 h-80 bg-emerald-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-900/15 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-indigo-purple flex items-center justify-center shadow-lg">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Study Rooms</h1>
              <p className="text-slate-500 text-sm">Join collaborative sessions with real-time AI assistance</p>
            </div>
          </div>
        </motion.div>

        {/* Action cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-5 mb-8"
        >
          {/* Create room */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-indigo-purple flex items-center justify-center">
                <Plus size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Create Room</h3>
                <p className="text-slate-500 text-xs">Start a new study session</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="w-full btn btn-primary py-3 text-sm font-semibold"
            >
              <Plus size={15} />
              Create Study Room
            </motion.button>
          </div>

          {/* Join room */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Hash size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Join by Room ID</h3>
                <p className="text-slate-500 text-xs">Enter a 6-character code</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. ABC123"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                  className="input-field pr-4 font-mono tracking-widest text-center text-sm"
                  maxLength={6}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={joinRoomById}
                disabled={loading || !joinRoomId.trim()}
                className="btn btn-primary px-4 py-3 text-sm disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Active rooms list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-white/5 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-emerald-400" />
              <h2 className="font-bold text-white text-base">Active Study Rooms</h2>
              {activeRooms.length > 0 && (
                <span className="badge badge-emerald">{activeRooms.length} live</span>
              )}
            </div>
            <button
              onClick={fetchActiveRooms}
              className="text-slate-500 hover:text-white transition-colors text-xs"
            >
              Refresh
            </button>
          </div>

          <div className="p-5">
            {activeRooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl glass-brand flex items-center justify-center mx-auto mb-4 border border-indigo-500/15">
                  <Users size={28} className="text-slate-600" />
                </div>
                <h3 className="text-slate-400 font-semibold mb-2">No active rooms yet</h3>
                <p className="text-slate-600 text-sm">Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeRooms.map((room, i) => (
                  <motion.div
                    key={room.roomId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-indigo-purple flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {room.roomName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{room.roomName}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Hash size={10} />
                            {room.roomId}
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {room.participantCount} participant{room.participantCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => joinRoom(room.roomId)}
                      disabled={loading}
                      className="btn btn-secondary px-4 py-2 text-sm disabled:opacity-50 gap-1.5"
                    >
                      <LogIn size={13} />
                      Join
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setRoomName(''); }}
        title="Create Study Room"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Room Name</label>
            <input
              type="text"
              placeholder="e.g. Physics Chapter 4"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createRoom()}
              className="input-field"
              maxLength={50}
              autoFocus
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { setShowCreateModal(false); setRoomName(''); }}
              className="flex-1 btn btn-ghost border border-white/10 py-3 text-sm"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createRoom}
              disabled={loading || !roomName.trim()}
              className="flex-1 btn btn-primary py-3 text-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Creating...
                </span>
              ) : 'Create Room'}
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudyRoomsPage;