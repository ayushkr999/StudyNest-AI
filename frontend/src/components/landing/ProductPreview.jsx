import React from 'react';
import {
  FileText,
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Search,
  MessageSquare,
  Bot,
  Hash,
} from 'lucide-react';

export const ProductPreview = () => {
  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-brand-border/60 to-brand-border/20 dark:from-neutral-800 dark:to-neutral-900 shadow-2xl border border-brand-border dark:border-neutral-800">
      {/* Top Application Browser Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-neutral-900 rounded-t-xl border-b border-brand-borderSubtle dark:border-neutral-800 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 font-mono text-[10px] text-brand-muted dark:text-neutral-400">
            app.studynest.ai/workspace/neural-networks
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-brand-muted">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Gemini 1.5 Flash Connected</span>
        </div>
      </div>

      {/* Main App Workspace Canvas */}
      <div className="bg-[#FAF9F6] dark:bg-[#12171F] rounded-b-xl overflow-hidden grid grid-cols-12 min-h-[460px] text-xs">
        {/* Mock Left Sidebar (2 cols) */}
        <div className="hidden lg:flex col-span-3 flex-col border-r border-brand-borderSubtle dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 p-3 space-y-4">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-6 h-6 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold text-[10px]">
              SN
            </div>
            <span className="font-bold text-xs text-brand-text dark:text-neutral-200">
              StudyNest AI
            </span>
          </div>

          <div className="space-y-1">
            <div className="px-2.5 py-1.5 rounded-lg text-brand-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary dark:text-emerald-400 font-semibold flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              <span>My Notes</span>
              <span className="ml-auto text-[9px] bg-brand-primary text-white px-1.5 py-0.2 rounded-full">
                Active
              </span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg text-brand-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>PDF Library (RAG)</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg text-brand-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg text-brand-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>AI Quizzes</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg text-brand-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              <span>Study Rooms</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Mini Mastery Widget */}
          <div className="mt-auto p-2.5 rounded-xl bg-brand-bg dark:bg-neutral-800 border border-brand-border dark:border-neutral-700">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-semibold text-brand-text dark:text-neutral-200">
                Retention Score
              </span>
              <span className="font-bold text-brand-secondary dark:text-emerald-400">92%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-secondary rounded-full w-[92%]" />
            </div>
            <p className="text-[9px] text-brand-muted mt-1">18 cards due for spaced review</p>
          </div>
        </div>

        {/* Center Note Workspace (5 cols) */}
        <div className="col-span-12 sm:col-span-7 lg:col-span-5 p-4 flex flex-col justify-between border-r border-brand-borderSubtle dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div>
            <div className="flex items-center justify-between border-b border-brand-borderSubtle dark:border-neutral-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Deep Learning
                </span>
                <span className="text-[10px] text-brand-muted flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Auto-saved
                </span>
              </div>
              <span className="text-[10px] text-brand-muted">Markdown View</span>
            </div>

            <h3 className="text-base font-bold text-brand-text dark:text-neutral-100 mb-2">
              Neural Networks & Backpropagation
            </h3>

            <div className="space-y-2 text-brand-text/90 dark:text-neutral-300 leading-relaxed font-sans text-xs">
              <p>
                In a standard Multi-Layer Perceptron (MLP), forward propagation computes activations:
              </p>
              <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 font-mono text-[11px] text-brand-primary dark:text-emerald-300 border border-brand-borderSubtle dark:border-neutral-700">
                z^[l] = W^[l] · a^[l-1] + b^[l]
              </div>
              <p>
                Backpropagation applies the <strong className="text-brand-primary dark:text-emerald-400">multivariable chain rule</strong> to compute gradients with respect to weights:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-brand-muted dark:text-neutral-400">
                <li>Derivative of loss function with respect to output</li>
                <li>Backward pass error assignment per hidden layer</li>
                <li>Gradient descent update step with learning rate α</li>
              </ul>
            </div>
          </div>

          {/* Quick AI Action Buttons inside editor */}
          <div className="mt-4 pt-2.5 border-t border-brand-borderSubtle dark:border-neutral-800 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-primary/5 dark:bg-emerald-950/30 text-brand-primary dark:text-emerald-400 text-[10px] font-semibold border border-brand-primary/20">
              <Sparkles className="w-3 h-3" />
              Summarize Note
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-brand-muted text-[10px] font-medium">
              <HelpCircle className="w-3 h-3" />
              Generate 5 MCQs
            </span>
          </div>
        </div>

        {/* Right RAG / AI Chat Preview (4 cols) */}
        <div className="hidden sm:flex col-span-5 lg:col-span-4 p-4 flex-col justify-between bg-brand-bg/50 dark:bg-neutral-900/40">
          <div>
            <div className="flex items-center justify-between border-b border-brand-borderSubtle dark:border-neutral-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5 font-semibold text-brand-text dark:text-neutral-200 text-xs">
                <Bot className="w-3.5 h-3.5 text-brand-secondary dark:text-emerald-400" />
                <span>Grounded RAG Assistant</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
                Qdrant Indexed
              </span>
            </div>

            {/* Conversation Snippets */}
            <div className="space-y-3">
              {/* User Question */}
              <div className="p-2.5 rounded-xl rounded-tr-none bg-brand-primary text-white text-[11px] ml-4 shadow-xs">
                "Why do vanishing gradients happen with sigmoid in deep layers?"
              </div>

              {/* RAG Answer with Source Badge */}
              <div className="p-3 rounded-xl rounded-tl-none bg-white dark:bg-neutral-800 border border-brand-border dark:border-neutral-700 text-[11px] text-brand-text dark:text-neutral-200 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1 text-[9px] font-bold text-brand-secondary dark:text-emerald-400">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Answer Grounded in Uploaded PDF</span>
                </div>
                <p className="leading-relaxed">
                  Sigmoid derivatives max out at <strong>0.25</strong>. As derivatives chain multiply across $n$ layers, the factor $(0.25)^n$ vanishes exponentially.
                </p>

                {/* Citation Tag */}
                <div className="pt-1.5 border-t border-brand-borderSubtle dark:border-neutral-700 flex items-center justify-between text-[9px]">
                  <span className="font-semibold text-brand-primary dark:text-emerald-400 flex items-center gap-1">
                    <BookOpen className="w-2.5 h-2.5" />
                    Goodfellow_DL.pdf, Page 148
                  </span>
                  <span className="text-emerald-600 font-bold">94% Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Interactive Input Box */}
          <div className="mt-3 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-brand-border dark:border-neutral-700 flex items-center justify-between text-[11px] text-brand-muted">
            <span>Ask question over document chunks...</span>
            <div className="w-5 h-5 rounded-lg bg-brand-primary text-white flex items-center justify-center">
              <span className="text-[10px]">↵</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
