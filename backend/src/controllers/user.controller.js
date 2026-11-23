import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as authService from '../services/auth.service.js';

export const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(
    res,
    {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      bio: req.user.bio,
      studyGoals: req.user.studyGoals,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    },
    'User session verified.'
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
  return ApiResponse.success(res, updatedUser, 'Profile updated successfully.');
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.updateUserPassword(req.user._id, req.body);
  return ApiResponse.success(res, null, 'Password changed successfully.');
});
