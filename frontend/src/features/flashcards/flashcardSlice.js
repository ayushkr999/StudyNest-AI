import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDecks = createAsyncThunk('flashcards/fetchDecks', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/flashcards/decks');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchDeckById = createAsyncThunk('flashcards/fetchDeckById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/flashcards/decks/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createDeck = createAsyncThunk('flashcards/createDeck', async (deckData, { rejectWithValue }) => {
  try {
    const res = await api.post('/flashcards/decks', deckData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteDeck = createAsyncThunk('flashcards/deleteDeck', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/flashcards/decks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addCard = createAsyncThunk('flashcards/addCard', async ({ deckId, cardData }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/flashcards/decks/${deckId}/cards`, cardData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const reviewCard = createAsyncThunk(
  'flashcards/reviewCard',
  async ({ cardId, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/flashcards/cards/${cardId}/review`, { status });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const generateAiCards = createAsyncThunk(
  'flashcards/generateAiCards',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/flashcards/generate', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState: {
    decks: [],
    currentDeck: null,
    cards: [],
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {
    shuffleCurrentCards: (state) => {
      state.cards = [...state.cards].sort(() => Math.random() - 0.5);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDecks.fulfilled, (state, action) => {
        state.loading = false;
        state.decks = action.payload;
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDeckById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeckById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDeck = action.payload.deck;
        state.cards = action.payload.cards;
      })
      .addCase(fetchDeckById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDeck.fulfilled, (state, action) => {
        state.decks.unshift(action.payload);
      })
      .addCase(deleteDeck.fulfilled, (state, action) => {
        state.decks = state.decks.filter((d) => d._id !== action.payload);
        if (state.currentDeck?._id === action.payload) {
          state.currentDeck = null;
          state.cards = [];
        }
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
        if (state.currentDeck) {
          state.currentDeck.cardCount += 1;
        }
      })
      .addCase(reviewCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
      })
      .addCase(generateAiCards.pending, (state) => {
        state.generating = true;
      })
      .addCase(generateAiCards.fulfilled, (state, action) => {
        state.generating = false;
        state.decks.unshift(action.payload.deck);
      })
      .addCase(generateAiCards.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      });
  },
});

export const { shuffleCurrentCards } = flashcardSlice.actions;
export default flashcardSlice.reducer;
