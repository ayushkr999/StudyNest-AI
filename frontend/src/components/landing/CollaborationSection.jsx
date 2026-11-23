import React from 'react';
import { Users, Sparkles, MessageSquare, Shield, Copy, Circle } from 'lucide-react';

export const CollaborationSection = () => {
  return (
    <section id="collaboration" className="py-24 bg-[#F8FAF7] dark:bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary dark:text-emerald-400">
            Real-Time Collaboration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text dark:text-neutral-50">
            Better Learning Happens Together
          </h2>
          <p className="text-sm sm:text-base text-brand-muted dark:text-neutral-400">
            Create study rooms, share knowledge, discuss difficult topics, and get AI assistance while collaborating with friends.
          </p>
        </div>

        {/* Study Room Interface Mockup */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-neutral-900 border border-brand-border dark:border-neutral-800 shadow-xl overflow-hidden">
          {/* Room Header */}
          <div className="p-4 bg-brand-bg/60 dark:bg-neutral-850 border-b border-brand-borderSubtle dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-brand-text dark:text-neutral-100 text-sm">
                  Algorithms & Complexity Study Group
                </h4>
                <p className="text-[11px] text-brand-muted">
                  Topic: Dynamic Programming vs Memoization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-brand-border dark:border-neutral-700 font-mono font-bold text-xs text-brand-primary dark:text-emerald-400">
                <span>Code: NEST89</span>
                <Copy className="w-3 h-3 text-brand-muted cursor-pointer" />
              </div>

              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <Circle className="w-2 h-2 fill-current" />
                <span>4 Active</span>
              </div>
            </div>
          </div>

          {/* Room Body: Chat + Presence */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
            {/* Chat Stream (8 cols) */}
            <div className="md:col-span-8 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-brand-borderSubtle dark:border-neutral-800 space-y-4">
              <div className="space-y-3.5">
                {/* Peer 1 */}
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                    S
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-brand-text dark:text-neutral-200 text-[11px]">
                      Siddharth M.
                    </span>
                    <div className="p-2.5 rounded-xl rounded-tl-none bg-neutral-100 dark:bg-neutral-800 text-brand-text dark:text-neutral-200">
                      I am stuck on whether the 0/1 Knapsack recurrence can be optimized into a 1D array.
                    </div>
                  </div>
                </div>

                {/* Peer 2 invoking @ai */}
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                    A
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-brand-text dark:text-neutral-200 text-[11px]">
                      Ayush
                    </span>
                    <div className="p-2.5 rounded-xl rounded-tl-none bg-brand-primary text-white">
                      <span className="font-bold text-brand-accent">@ai</span> Can 0/1 knapsack space be reduced from O(N*W) to O(W)?
                    </div>
                  </div>
                </div>

                {/* AI Tutor Response */}
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="font-bold text-brand-secondary dark:text-emerald-400 text-[11px] flex items-center gap-1">
                      <span>StudyNest AI Tutor</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-primary/10 text-brand-primary dark:text-emerald-300">
                        In-Room Bot
                      </span>
                    </span>
                    <div className="p-3 rounded-xl rounded-tl-none bg-brand-primary/5 dark:bg-emerald-950/30 border border-brand-primary/20 dark:border-emerald-800 text-brand-text dark:text-neutral-200 text-xs leading-relaxed">
                      Yes! You can reduce space to <strong>O(W)</strong> by iterating capacity $w$ in <em>reverse order</em> (from $W$ down to $weight[i]$). This guarantees each item is used at most once.
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Placeholder */}
              <div className="p-2 rounded-xl bg-brand-bg dark:bg-neutral-800 border border-brand-border dark:border-neutral-700 text-xs text-brand-muted flex items-center justify-between">
                <span>Message group (type @ai to ask tutor)...</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-primary text-white">
                  Send
                </span>
              </div>
            </div>

            {/* Active Presence (4 cols) */}
            <div className="md:col-span-4 p-5 bg-brand-bg/30 dark:bg-neutral-850 flex flex-col justify-between text-xs space-y-4">
              <div>
                <span className="font-bold uppercase tracking-wider text-brand-muted text-[10px] block mb-3">
                  Online Participants (4)
                </span>
                <div className="space-y-2">
                  {[
                    { name: 'Ayush Sharma (You)', role: 'Host' },
                    { name: 'Siddharth M.', role: 'Member' },
                    { name: 'Priya Patel', role: 'Member' },
                    { name: 'StudyNest AI Tutor', role: 'AI Bot', isAi: true },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-800 border border-brand-borderSubtle dark:border-neutral-700">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.isAi ? 'bg-brand-secondary' : 'bg-emerald-500'}`} />
                        <span className="font-semibold text-brand-text dark:text-neutral-200 text-[11px]">{p.name}</span>
                      </div>
                      <span className="text-[9px] text-brand-muted">{p.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-brand-borderSubtle dark:border-neutral-700 text-[10px] text-brand-muted leading-relaxed">
                Study rooms sync in real-time via Socket.IO with zero refresh latency.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
