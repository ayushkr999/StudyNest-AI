import React from 'react';
import { FolderPlus, Cpu, GraduationCap, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Organize Your Learning',
      description:
        'Create notes with rich Markdown, organize folders by subject, and upload your textbook PDFs or lecture materials.',
      icon: FolderPlus,
      accent: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      step: '02',
      title: 'Let AI Do the Heavy Lifting',
      description:
        'Ask questions directly over your PDFs, generate synthesized summaries, and break down challenging concepts with Gemini.',
      icon: Cpu,
      accent: 'border-brand-secondary/30',
    },
    {
      step: '03',
      title: 'Learn, Revise and Collaborate',
      description:
        'Practice with spaced-repetition flashcards, test recall with AI quizzes, and invite friends to real-time study rooms.',
      icon: GraduationCap,
      accent: 'border-teal-200 dark:border-teal-800',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-neutral-900 border-y border-brand-border/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary dark:text-emerald-400">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text dark:text-neutral-50">
            A Smarter Way to Study
          </h2>
          <p className="text-sm sm:text-base text-brand-muted dark:text-neutral-400">
            Replace scattered study apps with a unified workflow built for high retention.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-7 rounded-2xl bg-brand-bg/50 dark:bg-neutral-850 border border-brand-border dark:border-neutral-750 flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-brand-primary/40 dark:text-emerald-500/40">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 text-brand-primary dark:text-emerald-400 flex items-center justify-center border border-brand-border dark:border-neutral-700 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-brand-text dark:text-neutral-100">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-brand-muted dark:text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-semibold text-brand-secondary dark:text-emerald-400 flex items-center gap-1">
                  <span>Step {idx + 1} Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
