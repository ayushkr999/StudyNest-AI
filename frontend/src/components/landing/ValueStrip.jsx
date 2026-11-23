import React from 'react';
import { Sparkles, BookOpen, Layers, Users } from 'lucide-react';

export const ValueStrip = () => {
  const highlights = [
    {
      title: 'AI-Powered Learning',
      description: 'Synthesize notes & concepts with Google Gemini',
      icon: Sparkles,
    },
    {
      title: 'Intelligent PDF Search',
      description: 'LangChain & Qdrant semantic vector retrieval',
      icon: BookOpen,
    },
    {
      title: 'Personalized Revision',
      description: 'Spaced repetition flashcards & dynamic quizzes',
      icon: Layers,
    },
    {
      title: 'Collaborative Study',
      description: 'Real-time peer study rooms with @ai tutor',
      icon: Users,
    },
  ];

  return (
    <section className="border-y border-brand-border/70 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xs py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/5 dark:bg-emerald-950/40 text-brand-primary dark:text-emerald-400 flex items-center justify-center shrink-0 border border-brand-primary/10">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-text dark:text-neutral-100">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-brand-muted dark:text-neutral-400 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
