import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getDashboardData = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardAnalytics(req.user._id);
  return ApiResponse.success(res, data, 'Dashboard analytics retrieved.');
});
