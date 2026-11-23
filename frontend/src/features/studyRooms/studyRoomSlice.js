import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMyRooms = createAsyncThunk('studyRooms/fetchMyRooms', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/rooms/my-rooms');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createRoom = createAsyncThunk('studyRooms/createRoom', async (roomData, { rejectWithValue }) => {
  try {
    const res = await api.post('/rooms', roomData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const joinRoom = createAsyncThunk('studyRooms/joinRoom', async ({ code }, { rejectWithValue }) => {
  try {
    const res = await api.post('/rooms/join', { code });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchRoomByCode = createAsyncThunk(
  'studyRooms/fetchRoomByCode',
  async (code, { rejectWithValue }) => {
    try {
      const res = await api.get(`/rooms/code/${code}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRoomMessages = createAsyncThunk(
  'studyRooms/fetchRoomMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/rooms/${roomId}/messages`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const studyRoomSlice = createSlice({
  name: 'studyRooms',
  initialState: {
    rooms: [],
    activeRoom: null,
    messages: [],
    activeMembers: [],
    isAiTyping: false,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setRoomPresence: (state, action) => {
      state.activeMembers = action.payload;
    },
    setAiTyping: (state, action) => {
      state.isAiTyping = action.payload;
    },
    clearActiveRoom: (state) => {
      state.activeRoom = null;
      state.messages = [];
      state.activeMembers = [];
      state.isAiTyping = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchMyRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.unshift(action.payload);
        state.activeRoom = action.payload;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.activeRoom = action.payload;
      })
      .addCase(fetchRoomByCode.fulfilled, (state, action) => {
        state.activeRoom = action.payload;
      })
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { addMessage, setRoomPresence, setAiTyping, clearActiveRoom } = studyRoomSlice.actions;
export default studyRoomSlice.reducer;
