import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDocuments = createAsyncThunk('pdf/fetchDocuments', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/rag/documents');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const uploadPdfDocument = createAsyncThunk('pdf/uploadPdfDocument', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/rag/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteDocument = createAsyncThunk('pdf/deleteDocument', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/rag/documents/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchDocumentById = createAsyncThunk('pdf/fetchDocumentById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/rag/documents/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const retryIndexing = createAsyncThunk('pdf/retryIndexing', async (id, { rejectWithValue }) => {
  try {
    const res = await api.post(`/rag/documents/${id}/retry`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const pdfSlice = createSlice({
  name: 'pdf',
  initialState: {
    documents: [],
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadPdfDocument.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadPdfDocument.fulfilled, (state, action) => {
        state.uploading = false;
        state.documents.unshift(action.payload);
      })
      .addCase(uploadPdfDocument.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter((d) => d._id !== action.payload);
      })
      .addCase(retryIndexing.fulfilled, (state, action) => {
        const index = state.documents.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      });
  },
});

export default pdfSlice.reducer;
