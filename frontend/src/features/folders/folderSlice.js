import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchFolders = createAsyncThunk('folders/fetchFolders', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/folders');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createFolder = createAsyncThunk('folders/createFolder', async (folderData, { rejectWithValue }) => {
  try {
    const res = await api.post('/folders', folderData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateFolder = createAsyncThunk('folders/updateFolder', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/folders/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteFolder = createAsyncThunk('folders/deleteFolder', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/folders/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const folderSlice = createSlice({
  name: 'folders',
  initialState: {
    folders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.folders.unshift({ ...action.payload, noteCount: 0 });
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        const index = state.folders.findIndex((f) => f._id === action.payload._id);
        if (index !== -1) {
          state.folders[index] = { ...state.folders[index], ...action.payload };
        }
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter((f) => f._id !== action.payload);
      });
  },
});

export default folderSlice.reducer;
