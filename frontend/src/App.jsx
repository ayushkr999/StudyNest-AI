import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';

// Layouts & Guards
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotesPage } from './pages/NotesPage';
import { NoteEditorPage } from './pages/NoteEditorPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { PdfLibraryPage } from './pages/PdfLibraryPage';
import { PdfChatPage } from './pages/PdfChatPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { FlashcardDeckViewPage } from './pages/FlashcardDeckViewPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { QuizPlayerPage } from './pages/QuizPlayerPage';
import { StudyRoomsPage } from './pages/StudyRoomsPage';
import { RoomChatPage } from './pages/RoomChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Landing & Marketing Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected SaaS Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/new" element={<NoteEditorPage />} />
          <Route path="/notes/edit/:id" element={<NoteEditorPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/pdf-library" element={<PdfLibraryPage />} />
          <Route path="/pdf-library/chat/:docId" element={<PdfChatPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/flashcards/:id" element={<FlashcardDeckViewPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/quizzes/:id" element={<QuizPlayerPage />} />
          <Route path="/study-rooms" element={<StudyRoomsPage />} />
          <Route path="/study-rooms/:code" element={<RoomChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
