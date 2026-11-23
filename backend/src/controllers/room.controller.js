import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as roomService from '../services/room.service.js';

export const createRoom = asyncHandler(async (req, res) => {
  const room = await roomService.createStudyRoom(req.user._id, req.body);
  return ApiResponse.created(res, room, 'Study room created successfully.');
});

export const joinRoom = asyncHandler(async (req, res) => {
  const room = await roomService.joinStudyRoomByCode(req.user._id, req.body);
  return ApiResponse.success(res, room, 'Joined study room successfully.');
});

export const getMyRooms = asyncHandler(async (req, res) => {
  const rooms = await roomService.getMyRooms(req.user._id);
  return ApiResponse.success(res, rooms, 'Study rooms retrieved.');
});

export const getRoomByCode = asyncHandler(async (req, res) => {
  const room = await roomService.getRoomByCode(req.user._id, req.params.code);
  return ApiResponse.success(res, room, 'Room details retrieved.');
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await roomService.getRoomMessages(req.user._id, req.params.id);
  return ApiResponse.success(res, messages, 'Room messages retrieved.');
});
