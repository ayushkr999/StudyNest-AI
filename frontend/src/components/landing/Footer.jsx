import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-brand-border dark:border-neutral-800 bg-[#F8FAF7] dark:bg-[#0D1117] py-14 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info (2 cols) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-brand-text dark:text-neutral-100">
                StudyNest <span className="text-brand-secondary dark:text-emerald-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-brand-muted dark:text-neutral-400 max-w-sm leading-relaxed">
              Tagline: <strong>Learn Smarter. Remember Longer.</strong>
              <br />
              A JavaScript Modular Monolith collaborative learning environment integrating Notes, RAG over PDFs, Spaced Repetition Flashcards, and Real-Time Peer Rooms.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-brand-text dark:text-neutral-200">
              Platform
            </h5>
            <ul className="space-y-2 text-brand-muted dark:text-neutral-400">
              <li>
                <a href="#features" className="hover:text-brand-primary transition-colors">
                  Smart Notes
                </a>
              </li>
              <li>
                <a href="#rag-showcase" className="hover:text-brand-primary transition-colors">
                  PDF RAG Search
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-primary transition-colors">
                  Flashcard Decks
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-primary transition-colors">
                  AI Quiz Generator
                </a>
              </li>
              <li>
                <a href="#collaboration" className="hover:text-brand-primary transition-colors">
                  Study Rooms
                </a>
              </li>
            </ul>
          </div>

          {/* Technology Links */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-brand-text dark:text-neutral-200">
              Technology
            </h5>
            <ul className="space-y-2 text-brand-muted dark:text-neutral-400">
              <li>Google Gemini API</li>
              <li>LangChain.js</li>
              <li>Qdrant Cloud Vectors</li>
              <li>Socket.IO Collaboration</li>
              <li>MongoDB Mongoose</li>
            </ul>
          </div>

          {/* Account / Access Links */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[11px] text-brand-text dark:text-neutral-200">
              Get Started
            </h5>
            <ul className="space-y-2 text-brand-muted dark:text-neutral-400">
              <li>
                <Link to="/login" className="hover:text-brand-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-borderSubtle dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-brand-muted dark:text-neutral-500">
          <p>© {new Date().getFullYear()} StudyNest AI. MIT Licensed.</p>
          <p className="text-[11px]">
            Engineered with JavaScript Monolith Architecture.
          </p>
        </div>
      </div>
    </footer>
  );
};
