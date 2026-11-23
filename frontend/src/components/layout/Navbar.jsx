import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../../features/ui/uiSlice';
import { logoutUser } from '../../features/auth/authSlice';
import { Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const user = useSelector((state) => state.auth.user);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-20 h-16 border-b border-neutral-200 dark:border-neutral-800 bg-[#FAF9F6]/80 dark:bg-[#0D1117]/80 backdrop-blur-md transition-all duration-300 ${
        sidebarOpen ? 'pl-64' : 'pl-20'
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Side title / breadcrumb greeting */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Welcome back,{' '}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {user?.name || 'Student'}
            </span>
          </span>
        </div>

        {/* Right Side actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Pill */}
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm cursor-pointer hover:border-emerald-500 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hidden sm:inline">
              {user?.name || 'My Account'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
