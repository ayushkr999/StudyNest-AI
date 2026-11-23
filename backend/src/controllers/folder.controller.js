import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import * as folderService from '../services/folder.service.js';

export const createFolder = asyncHandler(async (req, res) => {
  const folder = await folderService.createFolder(req.user._id, req.body);
  return ApiResponse.created(res, folder, 'Folder created successfully.');
});

export const getFolders = asyncHandler(async (req, res) => {
  const folders = await folderService.getFolders(req.user._id);
  return ApiResponse.success(res, folders, 'Folders retrieved.');
});

export const updateFolder = asyncHandler(async (req, res) => {
  const folder = await folderService.updateFolder(req.user._id, req.params.id, req.body);
  return ApiResponse.success(res, folder, 'Folder updated successfully.');
});

export const deleteFolder = asyncHandler(async (req, res) => {
  await folderService.deleteFolder(req.user._id, req.params.id);
  return ApiResponse.success(res, null, 'Folder deleted successfully.');
});
