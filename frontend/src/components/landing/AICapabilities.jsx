import React, { useState } from 'react';
import {
  Lightbulb,
  FileQuestion,
  BookMarked,
  FolderSync,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const AICapabilities = () => {
  const [activeTab, setActiveTab] = useState(0);

  const capabilities = [
    {
      id: 'simplify',
      title: 'Simplify Complex Topics',
      short: 'Feynman Technique',
      icon: Lightbulb,
      description:
        'Transform dense academic jargon into intuitive analogies, real-world examples, and self-checks.',
      example: {
        query: 'Explain the CAP Theorem for Distributed Systems',
        output: [
          '30-Second Intuition: You can only pick 2 out of 3: Consistency (everyone sees same data), Availability (system always responds), and Partition Tolerance (network drops don\'t crash you).',
          'Real-World Analogy: Like a group chat during poor mobile signal—you either pause sending until signals connect (Consistency), or keep chatting with whoever is near you (Availability).',
        ],
      },
    },
    {
      id: 'exam-questions',
      title: 'Generate Exam Questions',
      short: 'Model Answers & Rubrics',
      icon: FileQuestion,
      description:
        'Generate rigorous conceptual and analytical exam questions with model answers and grading rubrics.',
      example: {
        query: 'Exam Question: Organic Chemistry Nucleophilic Substitution',
        output: [
          'Question: Compare the stereochemical outcomes of SN1 vs SN2 reaction mechanisms.',
          'Model Answer: SN2 occurs via backside attack with complete inversion of configuration (Walden inversion). SN1 proceeds through a planar carbocation intermediate, leading to racemization.',
          'Grading Rubric: Full credit requires mentioning carbocation geometry and inversion kinetics.',
        ],
      },
    },
    {
      id: 'summarize',
      title: 'Summarize Long Documents',
      short: 'Multi-Style Synthesis',
      icon: FolderSync,
      description:
        'Condense full textbook chapters or complete study folders into concise takeaways or high-impact bullets.',
      example: {
        query: 'Synthesize Entire Folder: Microeconomics Market Structures',
        output: [
          '• Perfect Competition: Price-takers, P = MR = MC, zero long-run economic profit.',
          '• Monopoly: Price-maker, MR < P, generates deadweight loss to society.',
          '• Oligopoly: High barriers to entry, mutual interdependence, modeled with Nash Equilibrium.',
        ],
      },
    },
    {
      id: 'revision',
      title: 'Create Revision Material',
      short: 'Cheat Sheets & Mnemonics',
      icon: BookMarked,
      description:
        'Generate dense last-minute active recall sheets featuring core formulas, memory hacks, and traps.',
      example: {
        query: 'Revision Sheet: Operating System Scheduling Algorithms',
        output: [
          '• Round Robin (RR): Preemptive, quantum-driven. Large quantum approaches FCFS; small quantum causes context-switch overhead.',
          '• Shortest Job First (SJF): Provably optimal average wait time; susceptible to starvation.',
          '• Common Exam Trap: Confusing turnaround time (Completion - Arrival) with waiting time (Turnaround - Burst).',
        ],
      },
    },
  ];

  const current = capabilities[activeTab];

  return (
    <section id="ai-capabilities" className="py-24 bg-white dark:bg-neutral-900 border-b border-brand-border/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary dark:text-emerald-400">
            Intelligent Pedagogical Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text dark:text-neutral-50">
            Your Personal AI Study Partner
          </h2>
          <p className="text-sm sm:text-base text-brand-muted dark:text-neutral-400">
            Engineered to sharpen comprehension, retention, and exam preparedness.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'bg-brand-bg dark:bg-neutral-800 text-brand-muted dark:text-neutral-300 hover:text-brand-text hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Capability Card */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-brand-bg/40 dark:bg-neutral-850 border border-brand-border dark:border-neutral-750 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-borderSubtle dark:border-neutral-750">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary dark:text-emerald-400">
                {current.short}
              </span>
              <h3 className="text-lg font-bold text-brand-text dark:text-neutral-100">
                {current.title}
              </h3>
            </div>
            <span className="text-xs text-brand-muted max-w-sm sm:text-right font-normal">
              {current.description}
            </span>
          </div>

          {/* Realistic Example Preview */}
          <div className="mt-6 space-y-4">
            <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-brand-border dark:border-neutral-700 text-xs font-semibold text-brand-text dark:text-neutral-200 flex items-center justify-between">
              <span>Task: {current.example.query}</span>
              <span className="text-[10px] text-brand-secondary dark:text-emerald-400 font-bold bg-brand-primary/5 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                Gemini Synthesized
              </span>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-brand-borderSubtle dark:border-neutral-750 text-xs text-brand-text/90 dark:text-neutral-200 leading-relaxed space-y-2.5 font-sans">
              {current.example.output.map((line, i) => (
                <p key={i} className="pl-3 border-l-2 border-brand-secondary/40">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
