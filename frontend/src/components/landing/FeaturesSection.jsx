import React from 'react';
import {
  FileText,
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  Users,
  Check,
  Search,
  CheckCircle2,
  Bookmark,
  ArrowUpRight,
} from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      id: 'smart-notes',
      title: 'Smart Notes',
      tag: 'Markdown & Auto-Save',
      description:
        'Organize notes into color-coded folders with full Markdown syntax, side-by-side live rendering, and debounced auto-saving as you type.',
      icon: FileText,
      preview: (
        <div className="mt-4 p-3 rounded-xl bg-brand-bg dark:bg-neutral-800/70 border border-brand-borderSubtle dark:border-neutral-700 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-brand-muted">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold"># Machine Learning</span>
            <span className="flex items-center gap-1 text-[9px] text-emerald-600">
              <CheckCircle2 className="w-2.5 h-2.5" /> Saved
            </span>
          </div>
          <div className="text-brand-text/90 dark:text-neutral-200">
            **Gradient descent** updates parameters by moving along the negative gradient.
          </div>
          <div className="text-[10px] text-brand-muted">
            Tags: <span className="bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded">#ai</span>{' '}
            <span className="bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded">#optimization</span>
          </div>
        </div>
      ),
    },
    {
      id: 'pdf-rag',
      title: 'Chat with Your PDFs',
      tag: 'LangChain & Qdrant',
      description:
        'Upload course syllabi, textbooks, and research papers. Natural-language queries retrieve grounded excerpts with exact page citations.',
      icon: BookOpen,
      preview: (
        <div className="mt-4 p-3 rounded-xl bg-brand-bg dark:bg-neutral-800/70 border border-brand-borderSubtle dark:border-neutral-700 text-[11px] space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-brand-text dark:text-neutral-200">Biology_Ch12.pdf</span>
            <span className="text-emerald-600 font-bold text-[9px] bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
              Page 84 cited
            </span>
          </div>
          <p className="text-[10px] text-brand-muted dark:text-neutral-400 italic bg-white dark:bg-neutral-900 p-2 rounded-lg border border-brand-borderSubtle dark:border-neutral-800">
            "Photosystem II absorbs light at 680 nm, exciting electrons through plastoquinone..."
          </p>
        </div>
      ),
    },
    {
      id: 'ai-assistant',
      title: 'AI Study Assistant',
      tag: 'Google Gemini',
      description:
        'Generate high-yield exam questions with model rubrics, Feynman technique concept breakdowns, and last-minute active recall cheat sheets.',
      icon: Sparkles,
      preview: (
        <div className="mt-4 p-3 rounded-xl bg-brand-bg dark:bg-neutral-800/70 border border-brand-borderSubtle dark:border-neutral-700 text-[11px] space-y-1.5">
          <div className="text-[10px] font-bold text-brand-secondary dark:text-emerald-400 uppercase tracking-wider">
            Feynman Concept Breakdown
          </div>
          <p className="text-brand-text dark:text-neutral-200 text-[11px] font-medium">
            "ELI5: A Hash Table is like a library with numbered shelves where you calculate book location instantly..."
          </p>
        </div>
      ),
    },
    {
      id: 'flashcards',
      title: 'AI Flashcards',
      tag: 'Spaced Repetition',
      description:
        'Turn entire notes or topics into active-recall flashcard decks. Interactive 3D flip review mode adjusts intervals dynamically.',
      icon: Layers,
      preview: (
        <div className="mt-4 p-3 rounded-xl bg-white dark:bg-neutral-800 border-2 border-emerald-600/30 dark:border-emerald-500/30 text-[11px] shadow-2xs space-y-2">
          <div className="flex justify-between text-[9px] text-brand-muted">
            <span className="font-bold text-emerald-700 dark:text-emerald-400">Card 3 of 12</span>
            <span>Interval: 4 Days</span>
          </div>
          <p className="font-bold text-brand-text dark:text-neutral-100 text-xs">
            What is the primary role of tRNA?
          </p>
          <div className="flex gap-2 pt-1 text-[9px]">
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
              Needs Revision
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Mastered
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'quizzes',
      title: 'AI Quiz Generator',
      tag: 'Comprehension Test',
      description:
        'Generate custom multiple-choice assessments tailored by difficulty level. Immediate evaluation with explanations for all options.',
      icon: HelpCircle,
      preview: (
        <div className="mt-4 p-3 rounded-xl bg-brand-bg dark:bg-neutral-800/70 border border-brand-borderSubtle dark:border-neutral-700 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-brand-text dark:text-neutral-200">MCQ Assessment</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
              HARD
            </span>
          </div>
          <div className="p-1.5 rounded bg-emerald-50 text-emerald-800 font-medium text-[10px] border border-emerald-200 flex items-center justify-between">
            <span>✓ Option B: O(log n) time complexity</span>
            <span className="font-bold">Correct</span>
          </div>
        </div>
      ),
    },
    {
      id: 'study-rooms',
      title: 'Collaborative Study Rooms',
      tag: 'Socket.IO & @ai',
      description:
        'Study together in private peer rooms with unique 6-character room codes. Mention @ai anytime to summon the AI tutor into group chats.',
      icon: Users,
      preview: (
        <div className="mt-4 p-3 rounded-xl bg-brand-bg dark:bg-neutral-800/70 border border-brand-borderSubtle dark:border-neutral-700 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-brand-text dark:text-neutral-200">Room: [NEST89]</span>
            <span className="flex items-center gap-1 text-[9px] text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 4 Active Peers
            </span>
          </div>
          <div className="p-1.5 rounded bg-white dark:bg-neutral-900 border border-brand-borderSubtle dark:border-neutral-700 text-[10px] text-brand-text dark:text-neutral-300">
            <span className="font-bold text-brand-secondary">@ai</span> What is the difference between TCP and UDP?
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#F8FAF7] dark:bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary dark:text-emerald-400">
            Comprehensive Workspace
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text dark:text-neutral-50">
            Everything You Need to Learn Better
          </h2>
          <p className="text-sm sm:text-base text-brand-muted dark:text-neutral-400">
            One intelligent workspace for your entire study workflow.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-brand-border dark:border-neutral-800 hover:border-brand-secondary/40 dark:hover:border-emerald-600/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/5 dark:bg-emerald-950/40 text-brand-primary dark:text-emerald-400 flex items-center justify-center border border-brand-primary/10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted dark:text-neutral-400 bg-brand-bg dark:bg-neutral-800 px-2.5 py-1 rounded-full border border-brand-borderSubtle dark:border-neutral-700">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-text dark:text-neutral-100 group-hover:text-brand-primary dark:group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-brand-muted dark:text-neutral-400 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                {/* Micro UI Preview */}
                <div className="mt-5">{feature.preview}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
