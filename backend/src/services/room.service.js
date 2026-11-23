import crypto from 'crypto';
import { StudyRoom } from '../models/StudyRoom.js';
import { RoomMessage } from '../models/RoomMessage.js';
import { ApiError } from '../middleware/error.middleware.js';

export const generateRoomCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

export const createStudyRoom = async (userId, { name, description, isPrivate }) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Room name is required.');
  }

  let code = generateRoomCode();
  let existing = await StudyRoom.findOne({ code });
  while (existing) {
    code = generateRoomCode();
    existing = await StudyRoom.findOne({ code });
  }

  const room = await StudyRoom.create({
    name: name.trim(),
    description: description || '',
    code,
    owner: userId,
    isPrivate: Boolean(isPrivate),
    members: [{ user: userId, role: 'owner', joinedAt: new Date() }],
  });

  return room.populate('owner', 'name email avatar');
};

export const joinStudyRoomByCode = async (userId, { code }) => {
  if (!code) {
    throw new ApiError(400, 'Room code is required.');
  }

  const cleanCode = code.trim().toUpperCase();
  const room = await StudyRoom.findOne({ code: cleanCode, active: true }).populate('owner', 'name email avatar');

  if (!room) {
    throw new ApiError(404, 'Study room not found with this code.');
  }

  const isMember = room.members.some((m) => m.user.toString() === userId.toString());
  if (!isMember) {
    if (room.members.length >= room.maxMembers) {
      throw new ApiError(400, 'Study room has reached maximum capacity.');
    }

    room.members.push({
      user: userId,
      role: 'member',
      joinedAt: new Date(),
    });
    await room.save();
  }

  return room;
};

export const getMyRooms = async (userId) => {
  const rooms = await StudyRoom.find({
    'members.user': userId,
    active: true,
  })
    .populate('owner', 'name email avatar')
    .sort({ updatedAt: -1 });

  return rooms;
};

export const getRoomByCode = async (userId, code) => {
  const cleanCode = code.trim().toUpperCase();
  const room = await StudyRoom.findOne({ code: cleanCode, active: true })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

  if (!room) {
    throw new ApiError(404, 'Study room not found.');
  }

  const isMember = room.members.some((m) => m.user?._id?.toString() === userId.toString());
  if (!isMember) {
    throw new ApiError(403, 'You must join this room before accessing messages.');
  }

  return room;
};

export const getRoomMessages = async (userId, roomId) => {
  const room = await StudyRoom.findById(roomId);
  if (!room) {
    throw new ApiError(404, 'Room not found.');
  }

  const isMember = room.members.some((m) => m.user.toString() === userId.toString());
  if (!isMember) {
    throw new ApiError(403, 'Access denied.');
  }

  const messages = await RoomMessage.find({ room: roomId })
    .populate('user', 'name avatar')
    .sort({ createdAt: 1 })
    .limit(100);

  return messages;
};
