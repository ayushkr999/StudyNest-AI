import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSessions = createAsyncThunk('chat/fetchSessions', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/rag/chat/sessions');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchSessionMessages = createAsyncThunk(
  'chat/fetchSessionMessages',
  async (sessionId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/rag/chat/sessions/${sessionId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const askPdfQuestion = createAsyncThunk('chat/askPdfQuestion', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/rag/chat/ask', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteChatSession = createAsyncThunk(
  'chat/deleteChatSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      await api.delete(`/rag/chat/sessions/${sessionId}`);
      return sessionId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessions: [],
    activeSessionId: null,
    messages: [],
    loadingMessages: false,
    asking: false,
    error: null,
  },
  reducers: {
    setActiveSessionId: (state, action) => {
      state.activeSessionId = action.payload;
    },
    clearActiveSession: (state) => {
      state.activeSessionId = null;
      state.messages = [];
    },
    appendOptimisticUserMessage: (state, action) => {
      state.messages.push({
        _id: 'temp-' + Date.now(),
        role: 'user',
        content: action.payload,
        createdAt: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      .addCase(fetchSessionMessages.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(fetchSessionMessages.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.activeSessionId = action.payload.session._id;
        state.messages = action.payload.messages;
      })
      .addCase(fetchSessionMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload;
      })
      .addCase(askPdfQuestion.pending, (state) => {
        state.asking = true;
      })
      .addCase(askPdfQuestion.fulfilled, (state, action) => {
        state.asking = false;
        state.activeSessionId = action.payload.sessionId;
        // Replace temp or add message
        state.messages.push(action.payload.message);
      })
      .addCase(askPdfQuestion.rejected, (state, action) => {
        state.asking = false;
        state.error = action.payload;
      })
      .addCase(deleteChatSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter((s) => s._id !== action.payload);
        if (state.activeSessionId === action.payload) {
          state.activeSessionId = null;
          state.messages = [];
        }
      });
  },
});

export const { setActiveSessionId, clearActiveSession, appendOptimisticUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
