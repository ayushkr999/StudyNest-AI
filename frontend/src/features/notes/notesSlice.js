import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/notes', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchRecentNotes = createAsyncThunk('notes/fetchRecentNotes', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/notes/recent');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchNoteById = createAsyncThunk('notes/fetchNoteById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createNote = createAsyncThunk('notes/createNote', async (noteData, { rejectWithValue }) => {
  try {
    const res = await api.post('/notes', noteData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateNote = createAsyncThunk('notes/updateNote', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/notes/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/notes/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const togglePinNote = createAsyncThunk('notes/togglePinNote', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/notes/${id}/pin`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    recentNotes: [],
    currentNote: null,
    totalNotes: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
    },
    updateCurrentNoteLocally: (state, action) => {
      if (state.currentNote) {
        state.currentNote = { ...state.currentNote, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.notes;
        state.totalNotes = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchRecentNotes
      .addCase(fetchRecentNotes.fulfilled, (state, action) => {
        state.recentNotes = action.payload;
      })
      // fetchNoteById
      .addCase(fetchNoteById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload;
      })
      // createNote
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
        state.currentNote = action.payload;
      })
      // updateNote
      .addCase(updateNote.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.saving = false;
        state.currentNote = action.payload;
        const index = state.notes.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state) => {
        state.saving = false;
      })
      // deleteNote
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n._id !== action.payload);
        if (state.currentNote?._id === action.payload) {
          state.currentNote = null;
        }
      })
      // togglePinNote
      .addCase(togglePinNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notes[index].isPinned = action.payload.isPinned;
        }
        if (state.currentNote?._id === action.payload._id) {
          state.currentNote.isPinned = action.payload.isPinned;
        }
      });
  },
});

export const { setCurrentNote, updateCurrentNoteLocally } = notesSlice.actions;
export default notesSlice.reducer;
