import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/ui/uiSlice';
import authReducer from '../features/auth/authSlice';
import folderReducer from '../features/folders/folderSlice';
import notesReducer from '../features/notes/notesSlice';
import pdfReducer from '../features/pdf/pdfSlice';
import chatReducer from '../features/chat/chatSlice';
import flashcardReducer from '../features/flashcards/flashcardSlice';
import quizReducer from '../features/quizzes/quizSlice';
import studyRoomReducer from '../features/studyRooms/studyRoomSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    folders: folderReducer,
    notes: notesReducer,
    pdf: pdfReducer,
    chat: chatReducer,
    flashcards: flashcardReducer,
    quizzes: quizReducer,
    studyRooms: studyRoomReducer,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
