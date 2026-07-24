import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const Flashcard = ({ question, answer, index, total }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="flashcard-container perspective-1000 cursor-pointer select-none"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`flashcard-inner transform-style-preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="flashcard-front backface-hidden flex flex-col justify-between p-6 overflow-hidden">
          {/* Decorative gradient circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <span className="badge badge-indigo text-xs">
              Question {index + 1}
              {total ? ` / ${total}` : ''}
            </span>
            <RotateCcw size={14} className="text-indigo-300 opacity-60" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="flashcard-text-container text-white text-sm font-medium leading-relaxed text-center">
              {question.length > 200 ? (
                <div className="max-h-32 overflow-y-auto">{question}</div>
              ) : question}
            </div>
          </div>

          <p className="text-center text-indigo-200 text-xs opacity-60 mt-2">
            Click to reveal answer
          </p>
        </div>

        {/* Back */}
        <div className="flashcard-back backface-hidden flex flex-col justify-between p-6 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <span className="badge badge-cyan text-xs">Answer</span>
            <RotateCcw size={14} className="text-cyan-300 opacity-60" />
          </div>

          <div className="flex-1 flex items-center justify-center py-2">
            <div className="flashcard-text-container text-white text-sm font-medium leading-relaxed text-center">
              {answer.length > 200 ? (
                <div className="max-h-32 overflow-y-auto">{answer}</div>
              ) : answer}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-cyan-200 text-xs opacity-70">Click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardGrid = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'review'

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-2xl glass-brand flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
          <span className="text-3xl">🎴</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No flashcards generated</h3>
        <p className="text-slate-500 text-sm">Select a folder and click "Generate Flashcards" to create some!</p>
      </div>
    );
  }

  if (viewMode === 'review') {
    const card = flashcards[currentIndex];
    return (
      <div className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Card {currentIndex + 1} of {flashcards.length}</span>
            <button
              onClick={() => setViewMode('grid')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
            >
              ← Back to grid
            </button>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full gradient-indigo-purple transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="h-72 max-w-xl mx-auto">
          <Flashcard
            question={card.question}
            answer={card.answer}
            index={currentIndex}
            total={flashcards.length}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 rounded-xl btn-secondary text-sm disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1))}
            disabled={currentIndex === flashcards.length - 1}
            className="px-5 py-2.5 rounded-xl btn-primary text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          <span className="text-white font-semibold">{flashcards.length}</span> flashcards generated · Click any card to flip
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setViewMode('review'); setCurrentIndex(0); }}
          className="px-4 py-2 rounded-xl btn-primary text-sm"
        >
          Review Mode →
        </motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="h-60"
          >
            <Flashcard question={card.question} answer={card.answer} index={index} total={flashcards.length} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardGrid;
