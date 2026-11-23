import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });
  authService.setAuthCookie(res, result.token);
  return ApiResponse.created(res, result.user, 'Registration successful.');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  authService.setAuthCookie(res, result.token);
  return ApiResponse.success(res, result.user, 'Login successful.');
});

export const logout = asyncHandler(async (req, res) => {
  authService.clearAuthCookie(res);
  return ApiResponse.success(res, null, 'Logged out successfully.');
});
