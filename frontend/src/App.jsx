import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RedirectRoute from './components/RedirectRoute.jsx';
import NotesPage from './components/NotesPage.jsx';
import { useAuthStore } from './store/auth.store.js';
import AIActionPage from './pages/AIActionPage.jsx';
import PDFChatPage from './pages/PDFChatPage.jsx';
import Profile from './pages/Profile.jsx';
import StudyRoomsPage from './pages/StudyRoomsPage.jsx';
import StudyRoomChat from './pages/StudyRoomChat.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/Navbar.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

const App = () => {
  const { checkAuth } = useAuthStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLoadingComplete = () => {
    setIsInitialLoading(false);
  };

  if (isInitialLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#6366f1', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#fff' },
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/signup" element={<RedirectRoute><Signup /></RedirectRoute>} />
        <Route path="/login" element={<RedirectRoute><Login /></RedirectRoute>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><PDFChatPage /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AIActionPage /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
        <Route path="/study-rooms" element={<ProtectedRoute><StudyRoomsPage /></ProtectedRoute>} />
        <Route path="/study-room/:roomId" element={<ProtectedRoute><StudyRoomChat /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;