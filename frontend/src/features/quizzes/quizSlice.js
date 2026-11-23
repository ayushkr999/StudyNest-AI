import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchQuizzes = createAsyncThunk('quizzes/fetchQuizzes', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/quizzes');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchQuizById = createAsyncThunk('quizzes/fetchQuizById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/quizzes/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const generateQuiz = createAsyncThunk('quizzes/generateQuiz', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/quizzes/generate', payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const submitQuizAttempt = createAsyncThunk(
  'quizzes/submitQuizAttempt',
  async ({ quizId, answers, timeSpentSeconds }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/quizzes/${quizId}/attempt`, { answers, timeSpentSeconds });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAttempts = createAsyncThunk('quizzes/fetchAttempts', async (quizId = null, { rejectWithValue }) => {
  try {
    const res = await api.get('/quizzes/attempts', { params: quizId ? { quizId } : {} });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    currentQuiz: null,
    attempts: [],
    lastAttemptResult: null,
    loading: false,
    generating: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
      state.lastAttemptResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateQuiz.pending, (state) => {
        state.generating = true;
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        state.generating = false;
        state.quizzes.unshift(action.payload);
        state.currentQuiz = action.payload;
      })
      .addCase(generateQuiz.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      })
      .addCase(submitQuizAttempt.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastAttemptResult = action.payload;
        state.attempts.unshift(action.payload);
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      .addCase(fetchAttempts.fulfilled, (state, action) => {
        state.attempts = action.payload;
      });
  },
});

export const { clearCurrentQuiz } = quizSlice.actions;
export default quizSlice.reducer;
