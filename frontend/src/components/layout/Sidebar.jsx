import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../features/ui/uiSlice';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  Users,
  Settings,
  ChevronLeft,
  GraduationCap,
} from 'lucide-react';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Notes', path: '/notes', icon: FileText },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
    { name: 'PDF Library', path: '/pdf-library', icon: BookOpen },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { name: 'Study Rooms', path: '/study-rooms', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-[#12171F] border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
                StudyNest <span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                Collaborative
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 font-semibold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`
              }
              title={!sidebarOpen ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Tagline */}
      {sidebarOpen && (
        <div className="p-4 m-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
            StudyNest AI
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Learn Smarter. Remember Longer.
          </p>
        </div>
      )}
    </aside>
  );
};
