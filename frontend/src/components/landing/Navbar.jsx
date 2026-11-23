import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GraduationCap, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F8FAF7]/90 dark:bg-[#0D1117]/90 backdrop-blur-md border-b border-brand-border/80 dark:border-neutral-800 shadow-xs py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-brand-text dark:text-neutral-100 flex items-center gap-1">
                StudyNest <span className="text-brand-secondary dark:text-emerald-400 font-extrabold">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-brand-muted hover:text-brand-text dark:text-neutral-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-brand-primary dark:hover:text-emerald-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-brand-primary dark:hover:text-emerald-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('rag-showcase')}
              className="hover:text-brand-primary dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>PDF RAG</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-brand-accent/30 text-brand-primary dark:bg-emerald-950 dark:text-emerald-300">
                New
              </span>
            </button>
            <button
              onClick={() => scrollToSection('ai-capabilities')}
              className="hover:text-brand-primary dark:hover:text-emerald-400 transition-colors"
            >
              AI Tutor
            </button>
            <button
              onClick={() => scrollToSection('collaboration')}
              className="hover:text-brand-primary dark:hover:text-emerald-400 transition-colors"
            >
              Study Rooms
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-primary text-white hover:bg-brand-hover shadow-sm transition-all"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-brand-text dark:text-neutral-200 hover:text-brand-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-primary text-white hover:bg-brand-hover shadow-sm transition-all active:scale-95"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-brand-text dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#F8FAF7] dark:bg-[#0D1117] border-b border-brand-border dark:border-neutral-800 space-y-3 animate-in fade-in duration-200">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-sm font-medium text-brand-text dark:text-neutral-200"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm font-medium text-brand-text dark:text-neutral-200"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('rag-showcase')}
            className="block w-full text-left py-2 text-sm font-medium text-brand-text dark:text-neutral-200"
          >
            PDF Search (RAG)
          </button>
          <button
            onClick={() => scrollToSection('ai-capabilities')}
            className="block w-full text-left py-2 text-sm font-medium text-brand-text dark:text-neutral-200"
          >
            AI Study Partner
          </button>
          <button
            onClick={() => scrollToSection('collaboration')}
            className="block w-full text-left py-2 text-sm font-medium text-brand-text dark:text-neutral-200"
          >
            Collaborative Rooms
          </button>
          <div className="pt-3 border-t border-brand-border dark:border-neutral-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-brand-primary text-white"
              >
                Go to Workspace
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl text-xs font-semibold border border-brand-border dark:border-neutral-700 text-brand-text dark:text-neutral-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-brand-primary text-white"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
