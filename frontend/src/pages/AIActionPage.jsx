import React, { useEffect, useState } from 'react';
import { useAIStore } from '../store/ai.store';
import axiosInstance from '../utils/axios.js';
import FlashcardGrid from '../components/Flashcard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, FileText, HelpCircle, X, ChevronDown, FolderOpen, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIActionPage = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [currentAction, setCurrentAction] = useState('');
  const [selectError, setSelectError] = useState(false);

  const { loading, result, error, runAIAction, clearResult } = useAIStore();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await axiosInstance.get('/api/folders');
        setFolders(res.data.folders || []);
      } catch (err) {
        setFolders([]);
      }
    };
    fetchFolders();
  }, []);

  const handleAction = (action) => {
    const targetFolder = selectedFolder || 'all';
    if (!selectedFolder) {
      setSelectedFolder('all');
    }
    setCurrentAction(action);
    runAIAction(targetFolder, action);
  };

  const parseFlashcards = (text) => {
    if (!text) return [];

    // Clean markdown bold stars for regex matching
    const cleanText = text.replace(/\*\*/g, '');

    // Pattern 1: Q: ... A: ... or Q1: ... A1: ... or Question 1: ... Answer 1: ...
    const flashcardRegex = /(?:Question|Q)\s*\d*[:\s]+(.+?)(?:\r?\n)(?:Answer|A)\s*\d*[:\s]+(.+?)(?=\r?\n\r?\n|\r?\n(?:Question|Q)\s*\d*[:\s]|$)/gis;
    const matches = [...cleanText.matchAll(flashcardRegex)];
    if (matches.length > 0) {
      return matches.map(match => ({
        question: match[1].trim().replace(/^[:\s-]+/, ''),
        answer: match[2].trim().replace(/^[:\s-]+/, '')
      })).slice(0, 10);
    }

    // Fallback: Pair alternating non-empty lines
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.toLowerCase().startsWith('here are'));
    const flashcards = [];
    for (let i = 0; i < lines.length - 1; i += 2) {
      const q = lines[i].replace(/^(?:Q\d*|Question\d*|\d+\.)[:\s]*/i, '').trim();
      const a = lines[i + 1].replace(/^(?:A\d*|Answer\d*|\d+\.)[:\s]*/i, '').trim();
      if (q && a) {
        flashcards.push({ question: q, answer: a });
      }
    }
    return flashcards.slice(0, 10);
  };

  const parseQuestions = (text) => {
    if (!text) return [];
    const cleanText = text.replace(/\*\*/g, '');
    const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
    const questions = [];

    for (const line of lines) {
      if (
        (line.endsWith('?') || /^(?:Question|\d+\.|\?)/i.test(line)) &&
        line.length > 15 &&
        !line.toLowerCase().startsWith('here are') &&
        !line.toLowerCase().startsWith('summary')
      ) {
        const qText = line
          .replace(/^(?:Question|\d+\.|Q\d+)[:\s]*/i, '')
          .trim();
        if (qText.length > 10 && !questions.includes(qText)) {
          questions.push(qText);
        }
      }
    }

    return questions.slice(0, 10);
  };

  const actions = [
    {
      id: 'summarize',
      icon: FileText,
      title: 'Summarize Notes',
      description: 'Transform your notes into a comprehensive, easy-to-read AI summary with key points highlighted.',
      gradient: 'from-indigo-500 to-indigo-700',
      badgeClass: 'badge-indigo',
      badge: 'Summary',
    },
    {
      id: 'flashcards',
      icon: Zap,
      title: 'Generate Flashcards',
      description: 'Create interactive flashcards with flip animations. Perfect for memorization and quick review.',
      gradient: 'from-purple-500 to-purple-700',
      badgeClass: 'badge-purple',
      badge: 'Flashcards',
    },
    {
      id: 'questions',
      icon: HelpCircle,
      title: 'Study Questions',
      description: 'Generate exam-style questions from your notes to test your knowledge and prepare for exams.',
      gradient: 'from-cyan-500 to-cyan-700',
      badgeClass: 'badge-cyan',
      badge: 'Questions',
    },
  ];

  const getActionLabel = () => {
    if (currentAction === 'flashcards') return '🎴 Generated Flashcards';
    if (currentAction === 'questions') return '❓ Study Questions';
    if (currentAction === 'summarize') return '📄 AI Summary';
    return '🤖 AI Result';
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-900/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-indigo-900/15 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl gradient-indigo-purple flex items-center justify-center shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Quick Actions</h1>
              <p className="text-slate-500 text-sm">Transform your notes into powerful study materials</p>
            </div>
          </div>
        </motion.div>

        {/* Folder selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 border border-white/5 mb-8"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
            <FolderOpen size={15} className="text-indigo-400" />
            Select a Folder to Analyze
          </label>
          <div className="relative">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="input-field appearance-none pr-10 cursor-pointer"
            >
              <option value="all">📁 All Notes (All Folders)</option>
              {Array.isArray(folders) && folders.map((folder) => (
                <option key={folder._id} value={folder._id}>📂 {folder.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"
        >
          {actions.map((action, i) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.id)}
              className={`glass rounded-2xl p-6 border transition-all duration-300 group cursor-pointer border-white/5 hover:border-indigo-500/25 hover:shadow-xl ${
                currentAction === action.id && loading ? 'border-indigo-500/40 bg-indigo-900/10' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon size={22} className="text-white" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-white text-base">{action.title}</h3>
                <span className={`badge ${action.badgeClass}`}>{action.badge}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{action.description}</p>
              <div className="flex items-center gap-1.5 mt-4 text-indigo-400 text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                <Sparkles size={11} />
                Click to generate
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {(loading || result || error) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass rounded-2xl border border-indigo-500/15 overflow-hidden"
            >
              {/* Result header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-indigo-purple flex items-center justify-center">
                    <Brain size={15} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white">{getActionLabel()}</h3>
                  {loading && (
                    <div className="flex gap-1.5">
                      <div className="thinking-dot" />
                      <div className="thinking-dot" />
                      <div className="thinking-dot" />
                    </div>
                  )}
                </div>
                <button
                  onClick={clearResult}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6">
                {/* Loading state */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-16 h-16 rounded-2xl gradient-indigo-purple flex items-center justify-center shadow-xl animate-pulse">
                      <Brain size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-center mb-1">AI is processing your notes...</p>
                      <p className="text-slate-500 text-sm text-center">This may take a few moments</p>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {error && !loading && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <span className="text-red-400 text-xl">⚠️</span>
                    <div>
                      <h4 className="text-red-400 font-semibold text-sm mb-1">Error Processing Request</h4>
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Results */}
                {result && !loading && (
                  <div>
                    {currentAction === 'flashcards' ? (
                      <FlashcardGrid flashcards={parseFlashcards(result)} />
                    ) : currentAction === 'questions' ? (
                      <div className="space-y-4">
                        <p className="text-slate-400 text-sm mb-6">
                          {parseQuestions(result).length} questions generated for your study session
                        </p>
                        {parseQuestions(result).length > 0 ? (
                          parseQuestions(result).map((question, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="glass rounded-xl p-5 border border-white/5 hover:border-indigo-500/20 transition-all"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg gradient-indigo-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-white leading-relaxed">{question}</p>
                                  <div className="flex gap-3 mt-3 text-xs text-slate-600">
                                    <span className="flex items-center gap-1"><span>📚</span> Study Question</span>
                                    <span className="flex items-center gap-1"><span>⏱️</span> 2-3 min</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <HelpCircle size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No questions could be parsed. Try again or check your notes content.</p>
                          </div>
                        )}

                        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-sm text-slate-400 mt-4">
                          <span className="text-indigo-400 font-medium">💡 Study Tip: </span>
                          Try to answer each question out loud before checking your notes. This reinforces memory!
                        </div>
                      </div>
                    ) : (
                      <div className="ai-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIActionPage;
