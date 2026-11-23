import { createSlice } from '@reduxjs/toolkit';

const initialDarkMode =
  localStorage.getItem('studynest_theme') === 'dark' ||
  (!localStorage.getItem('studynest_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (initialDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: initialDarkMode,
    sidebarOpen: true,
    toasts: [], // { id, message, type: 'success' | 'error' | 'info' }
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('studynest_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('studynest_theme', 'light');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now() + Math.random(),
        message: action.payload.message,
        type: action.payload.type || 'info',
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleDarkMode, toggleSidebar, setSidebarOpen, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
