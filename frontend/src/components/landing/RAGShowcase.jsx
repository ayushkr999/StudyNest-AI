import React from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  FileCheck2,
  Database,
  ArrowRight,
  Cpu,
  Layers,
  FileText,
  BadgeAlert,
} from 'lucide-react';

export const RAGShowcase = () => {
  const pipeline = [
    { name: 'PDF Processing', desc: 'pdf-parse page extractor' },
    { name: 'Text Chunking', desc: 'LangChain 1000/200 split' },
    { name: 'Embeddings', desc: 'Gemini text-embedding-004' },
    { name: 'Vector Search', desc: 'Qdrant Cloud Cosine' },
    { name: 'AI Answer', desc: 'Gemini 1.5 Grounded' },
  ];

  return (
    <section id="rag-showcase" className="py-24 bg-[#F8FAF7] dark:bg-[#0D1117] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary dark:text-emerald-400">
            Retrieval-Augmented Generation (RAG)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text dark:text-neutral-50">
            Your PDFs. Your Questions. Instant Understanding.
          </h2>
          <p className="text-sm sm:text-base text-brand-muted dark:text-neutral-400 leading-relaxed font-normal">
            Upload your study material and interact with it using an intelligent AI assistant. StudyNest AI retrieves relevant information from your documents to provide context-aware answers with source references.
          </p>
        </div>

        {/* Tech Pipeline Strip */}
        <div className="mb-12 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-brand-border dark:border-neutral-800 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            {pipeline.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-brand-bg/60 dark:bg-neutral-800/60 border border-brand-borderSubtle dark:border-neutral-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary dark:text-emerald-400">
                  Step 0{idx + 1}
                </span>
                <p className="text-xs font-bold text-brand-text dark:text-neutral-100 mt-0.5">
                  {step.name}
                </p>
                <p className="text-[10px] text-brand-muted dark:text-neutral-400 mt-0.5">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Realistic RAG Interactive Product Mockup */}
        <div className="rounded-2xl border border-brand-border dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Document View with Excerpt (5 cols) */}
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-brand-border dark:border-neutral-800 bg-brand-bg/40 dark:bg-neutral-850 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-brand-borderSubtle dark:border-neutral-750 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-brand-text dark:text-neutral-100 text-xs block truncate max-w-[180px]">
                      Cell_Biology_Lodish.pdf
                    </span>
                    <span className="text-[10px] text-brand-muted">Chapter 14: Mitochondria</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                  Page 42
                </span>
              </div>

              {/* Document Text Mockup with Highlighting */}
              <div className="mt-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-brand-borderSubtle dark:border-neutral-800 text-xs font-serif leading-relaxed text-neutral-600 dark:text-neutral-400 space-y-3">
                <p className="text-[11px]">
                  ...The electrochemical proton gradient across the inner mitochondrial membrane is established by the electron transport chain complexes (I, III, and IV).
                </p>
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-brand-text dark:text-neutral-200 text-xs font-sans">
                  <span className="text-[9px] uppercase font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                    Retrieved Vector Chunk (Similarity: 96%)
                  </span>
                  "ATP Synthase utilizes the proton-motive force (PMF) to synthesize ATP from ADP and Pi through rotational catalysis in the F0 and F1 subunits."
                </div>
                <p className="text-[11px]">
                  ...This chemiosmotic coupling hypothesis, originally proposed by Peter Mitchell in 1961, explains how biological systems store energy without covalent intermediates...
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-brand-muted">
              <span>Extracted 142 chunks</span>
              <span>Vector Dimension: 768</span>
            </div>
          </div>

          {/* Right: RAG Q&A Output with Citations (7 cols) */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-brand-borderSubtle dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-secondary dark:text-emerald-400" />
                  <span className="text-xs font-bold text-brand-text dark:text-neutral-100">
                    Grounded Answer with Verified Citations
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Grounded Mode Active
                </span>
              </div>

              {/* Question */}
              <div className="mt-4 p-3 rounded-xl bg-brand-primary text-white text-xs font-medium">
                Student: "How does ATP Synthase actually generate ATP according to this chapter?"
              </div>

              {/* Synthesized Answer */}
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-brand-text dark:text-neutral-200">
                <p>
                  Based on Chapter 14 of <strong>Cell_Biology_Lodish.pdf</strong>:
                </p>
                <div className="space-y-1.5 pl-3 border-l-2 border-brand-secondary/40">
                  <p>
                    • <strong>Proton-Motive Force (PMF):</strong> The proton gradient created across the inner mitochondrial membrane drives protons back through the membrane.
                  </p>
                  <p>
                    • <strong>Rotational Catalysis:</strong> Protons flowing through the F₀ subunit induce mechanical rotation, changing the conformation of catalytic sites in the F₁ headpiece to bond ADP and inorganic phosphate into ATP.
                  </p>
                </div>

                {/* Source Verification Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      1 Verified Source Cited
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      96% Confidence
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-900 dark:text-emerald-200 font-mono bg-white/70 dark:bg-neutral-900/70 p-2 rounded border border-emerald-100 dark:border-emerald-950">
                    Source: Cell_Biology_Lodish.pdf • Page 42 (Chunk #18)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-brand-borderSubtle dark:border-neutral-800 text-[11px] text-brand-muted flex items-center justify-between">
              <span>All retrieved chunks enforce authenticated user-level filters.</span>
              <span className="font-semibold text-brand-primary dark:text-emerald-400">
                Multi-Doc Query Supported
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
