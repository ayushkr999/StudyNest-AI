import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Brain, FileText, Users, BarChart2,
  ChevronDown, LogOut, User, Menu, X, Sparkles, Zap
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { icon: BookOpen, title: 'Notes', description: 'Smart note-taking', link: '/notes', color: 'text-indigo-400' },
    { icon: Brain, title: 'AI Actions', description: 'Flashcards & summaries', link: '/ai', color: 'text-purple-400' },
    { icon: FileText, title: 'PDF Chat', description: 'Chat with documents', link: '/chat', color: 'text-cyan-400' },
    { icon: Users, title: 'Study Rooms', description: 'Collaborate with AI', link: '/study-rooms', color: 'text-emerald-400' },
    { icon: BarChart2, title: 'Analytics', description: 'Track your progress', link: '/profile', color: 'text-violet-400' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    setTimeout(() => {
      navigate('/login');
      setIsLoggingOut(false);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Logout Overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#050816] flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-indigo-purple flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold">
                    <span className="gradient-text">StudyNest AI</span>
                  </h1>
                </div>
              </motion.div>
              <div className="flex gap-2 justify-center mb-4">
                <div className="thinking-dot" />
                <div className="thinking-dot" />
                <div className="thinking-dot" />
              </div>
              <p className="text-slate-400 text-sm">Signing you out securely...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg gradient-indigo-purple flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 transition-shadow">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold font-[Space_Grotesk]">
                <span className="gradient-text">StudyNest</span>
                <span className="text-white"> AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {/* Features Dropdown */}
                  <div className="relative z-[60]" ref={dropdownRef}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl glass-brand text-indigo-300 hover:text-white transition-colors border border-indigo-500/20 text-sm font-medium"
                    >
                      <Zap size={14} />
                      Features
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute right-0 mt-2 w-72 glass-dark rounded-2xl shadow-2xl border border-white/8 py-2 overflow-hidden"
                          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.1)' }}
                        >
                          <div className="px-4 py-2 border-b border-white/5 mb-1">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Features</span>
                          </div>
                          {navItems.map((item, i) => (
                            <motion.div
                              key={item.link}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Link
                                to={item.link}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
                              >
                                <div className={`w-8 h-8 rounded-lg glass-brand flex items-center justify-center ${item.color} border border-white/5`}>
                                  <item.icon size={15} />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{item.title}</div>
                                  <div className="text-xs text-slate-500">{item.description}</div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    <div className="w-7 h-7 rounded-lg gradient-indigo-purple flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase() || <User size={12} />}
                    </div>
                    <span className="hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                  </Link>

                  {/* Logout */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
                  >
                    <LogOut size={15} />
                    <span className="hidden lg:inline">Logout</span>
                  </motion.button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl btn-primary text-white text-sm font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/5 overflow-hidden"
            >
              <div className="glass-dark px-4 py-4 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 mb-3">
                      <div className="w-8 h-8 rounded-lg gradient-indigo-purple flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user?.name}</div>
                        <div className="text-xs text-slate-500">{user?.email}</div>
                      </div>
                    </div>
                    <div className="border-t border-white/5 pt-2 space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.link}
                          to={item.link}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <item.icon size={16} className={item.color} />
                          <span className="text-sm font-medium">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-white/5 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={16} />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-center btn-primary rounded-xl text-white text-sm font-semibold"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
