import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchMyRooms,
  createRoom,
  joinRoom,
} from '../features/studyRooms/studyRoomSlice';
import { addToast } from '../features/ui/uiSlice';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Skeleton';
import {
  Users,
  Plus,
  LogIn,
  MessageSquare,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export const StudyRoomsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rooms, loading } = useSelector((state) => state.studyRooms);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    dispatch(fetchMyRooms());
  }, [dispatch]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const res = await dispatch(
      createRoom({
        name: newRoomName.trim(),
        description: newRoomDesc.trim(),
      })
    );

    if (!res.error) {
      dispatch(addToast({ message: 'Study room created!', type: 'success' }));
      setIsCreateOpen(false);
      navigate(`/study-rooms/${res.payload.code}`);
    } else {
      dispatch(addToast({ message: res.payload || 'Failed to create room.', type: 'error' }));
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    const res = await dispatch(joinRoom({ code: joinCode.trim() }));
    if (!res.error) {
      dispatch(addToast({ message: 'Joined study room!', type: 'success' }));
      setIsJoinOpen(false);
      navigate(`/study-rooms/${res.payload.code}`);
    } else {
      dispatch(addToast({ message: res.payload || 'Failed to join room.', type: 'error' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Collaborative Study Rooms</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time peer chat with live presence and on-demand Gemini AI tutor assistance via <span className="font-mono text-emerald-600">@ai</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsJoinOpen(true)}
            variant="outline"
            size="sm"
            icon={LogIn}
          >
            Join with Code
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="accent"
            size="sm"
            icon={Plus}
          >
            Create Room
          </Button>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => navigate(`/study-rooms/${room.code}`)}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <Badge variant="primary" size="sm">
                    Code: {room.code}
                  </Badge>
                </div>

                <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {room.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                  {room.description || 'Collaborative study space.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">
                  {room.members?.length || 1} Participants
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>Enter Room</span>
                  <MessageSquare className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No study rooms joined yet"
          description="Create a study room to invite classmates or enter a 6-character room code to join an active group."
          actionText="Create Study Room"
          onAction={() => setIsCreateOpen(true)}
        />
      )}

      {/* Create Room Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Study Room"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <Input
            label="Room Name"
            placeholder="e.g. CS101 Finals Prep, Calculus Study Circle"
            required
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />

          <Input
            label="Description (Optional)"
            placeholder="What will your study group focus on?"
            value={newRoomDesc}
            onChange={(e) => setNewRoomDesc(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Room
            </Button>
          </div>
        </form>
      </Modal>

      {/* Join Room Modal */}
      <Modal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        title="Join Study Room with Code"
      >
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <Input
            label="6-Character Room Code"
            placeholder="e.g. NEST89"
            required
            maxLength={6}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            className="font-mono tracking-widest text-center uppercase"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsJoinOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              Join Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
