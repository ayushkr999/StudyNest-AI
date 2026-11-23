import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ProductPreview } from './ProductPreview';

export const HeroSection = () => {
  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-accent/20 dark:bg-emerald-950/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Copy */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/5 dark:bg-emerald-950/40 border border-brand-primary/15 dark:border-emerald-800 text-xs font-semibold text-brand-primary dark:text-emerald-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-secondary dark:text-emerald-400" />
            <span>Your AI-Powered Learning Companion</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text dark:text-neutral-50 leading-[1.12]">
            Your Entire Learning Journey,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-emerald-600 dark:from-emerald-400 dark:to-teal-300">
              Powered by AI.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-brand-muted dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto font-normal">
            Organize your notes, chat with your PDFs, generate flashcards, and collaborate with friends. Everything you need to study smarter, in one place.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-brand-primary text-white hover:bg-brand-hover shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <span>Start Learning for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-neutral-800 border border-brand-border dark:border-neutral-700 text-brand-text dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors"
            >
              Explore Features
            </button>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-4 flex items-center justify-center gap-6 text-[11px] text-brand-muted dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-secondary" />
              Instant Setup
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-secondary" />
              Private & Grounded
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
              Google Gemini Integrated
            </span>
          </div>
        </div>

        {/* Hero Visual Preview */}
        <div className="mt-14 sm:mt-18">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
};
