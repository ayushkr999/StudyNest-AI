import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, GraduationCap } from 'lucide-react';

export const FinalCTA = () => {
  return (
    <section className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-brand-primary via-[#174D3A] to-brand-secondary p-8 sm:p-14 text-white text-center shadow-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-accent border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack AI Learning Platform</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Make Every Study Session Count.
            </h2>

            <p className="text-sm sm:text-base text-brand-accent/90 leading-relaxed font-normal max-w-xl mx-auto">
              Bring your notes, documents, AI tools, and study partners together in one intelligent workspace.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-white text-brand-primary hover:bg-neutral-100 shadow-lg transition-all active:scale-98"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs text-brand-accent/80 font-medium">
              Your learning journey starts here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
