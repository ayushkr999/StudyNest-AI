import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../features/notes/notesSlice';
import { fetchFolders } from '../features/folders/folderSlice';
import { addToast } from '../features/ui/uiSlice';
import api from '../services/api';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { MarkdownView } from '../components/common/MarkdownView';
import {
  Sparkles,
  MessageSquare,
  Lightbulb,
  FileQuestion,
  BookMarked,
  Send,
  Loader2,
  FolderSync,
} from 'lucide-react';

export const AiAssistantPage = () => {
  const dispatch = useDispatch();
  const { notes } = useSelector((state) => state.notes);
  const { folders } = useSelector((state) => state.folders);

  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'explain', 'exam', 'revision', 'folder'

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your **StudyNest AI Study Assistant**. How can I help you learn today? You can ask me to explain any difficult concept, break down theories, test your recall, or review your study material.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Concept Explanation State
  const [concept, setConcept] = useState('');
  const [context, setContext] = useState('');
  const [explanation, setExplanation] = useState('');
  const [explainLoading, setExplainLoading] = useState(false);

  // Exam Questions State
  const [examTopic, setExamTopic] = useState('');
  const [selectedNoteForExam, setSelectedNoteForExam] = useState('');
  const [examQuestions, setExamQuestions] = useState('');
  const [examLoading, setExamLoading] = useState(false);

  // Revision Notes State
  const [revisionTopic, setRevisionTopic] = useState('');
  const [selectedNoteForRevision, setSelectedNoteForRevision] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisionLoading, setRevisionLoading] = useState(false);

  // Folder Summary State
  const [selectedFolderForSummary, setSelectedFolderForSummary] = useState('');
  const [folderSummaryStyle, setFolderSummaryStyle] = useState('detailed');
  const [folderSummary, setFolderSummary] = useState('');
  const [folderSummaryLoading, setFolderSummaryLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchNotes({ limit: 100 }));
    dispatch(fetchFolders());
  }, [dispatch]);

  // Send Chat Message
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userQuery = chatInput.trim();
    const newHistory = [...chatMessages, { role: 'user', content: userQuery }];
    setChatMessages(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        messages: newHistory,
        userQuery,
      });
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.response },
      ]);
    } catch (err) {
      dispatch(addToast({ message: err.message, type: 'error' }));
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an issue: ${err.message}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Explain Concept
  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim() || explainLoading) return;
    setExplainLoading(true);
    setExplanation('');

    try {
      const res = await api.post('/ai/explain-concept', { concept, context });
      setExplanation(res.data.explanation);
    } catch (err) {
      dispatch(addToast({ message: err.message, type: 'error' }));
    } finally {
      setExplainLoading(false);
    }
  };

  // Generate Exam Questions
  const handleGenerateExamQuestions = async (e) => {
    e.preventDefault();
    if ((!examTopic.trim() && !selectedNoteForExam) || examLoading) return;
    setExamLoading(true);
    setExamQuestions('');

    try {
      const res = await api.post('/ai/exam-questions', {
        topic: examTopic.trim(),
        noteId: selectedNoteForExam || undefined,
        count: 5,
      });
      setExamQuestions(res.data.questions);
    } catch (err) {
      dispatch(addToast({ message: err.message, type: 'error' }));
    } finally {
      setExamLoading(false);
    }
  };

  // Generate Revision Notes
  const handleGenerateRevisionNotes = async (e) => {
    e.preventDefault();
    if ((!revisionTopic.trim() && !selectedNoteForRevision) || revisionLoading) return;
    setRevisionLoading(true);
    setRevisionNotes('');

    try {
      const res = await api.post('/ai/revision-notes', {
        topic: revisionTopic.trim(),
        noteId: selectedNoteForRevision || undefined,
      });
      setRevisionNotes(res.data.revisionNotes);
    } catch (err) {
      dispatch(addToast({ message: err.message, type: 'error' }));
    } finally {
      setRevisionLoading(false);
    }
  };

  // Summarize Folder
  const handleSummarizeFolder = async (e) => {
    e.preventDefault();
    if (!selectedFolderForSummary || folderSummaryLoading) return;
    setFolderSummaryLoading(true);
    setFolderSummary('');

    try {
      const res = await api.post(`/ai/summarize-folder/${selectedFolderForSummary}`, {
        style: folderSummaryStyle,
      });
      setFolderSummary(res.data.summary);
    } catch (err) {
      dispatch(addToast({ message: err.message, type: 'error' }));
    } finally {
      setFolderSummaryLoading(false);
    }
  };

  const tabs = [
    { id: 'chat', label: 'AI Study Chat', icon: MessageSquare },
    { id: 'explain', label: 'Explain Concept', icon: Lightbulb },
    { id: 'exam', label: 'Exam Questions', icon: FileQuestion },
    { id: 'revision', label: 'Revision Notes', icon: BookMarked },
    { id: 'folder', label: 'Folder Summary', icon: FolderSync },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span>Gemini AI Study Assistant</span>
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Synthesize complex topics, generate exam-style questions, and chat with an interactive academic tutor.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white dark:bg-emerald-700 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: AI Study Chat */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs ${
                    msg.role === 'user'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {msg.role === 'user' ? 'You' : <Sparkles className="w-4 h-4" />}
                </div>
                <div
                  className={`p-4 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-800 text-white rounded-tr-none'
                      : 'bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <MarkdownView content={msg.content} />
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3 items-center text-xs text-neutral-400 pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>StudyNest AI is formulating an answer...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendChat}
            className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your syllabus, exam theories, formulas..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button
              type="submit"
              variant="accent"
              isLoading={chatLoading}
              icon={Send}
            >
              Ask
            </Button>
          </form>
        </div>
      )}

      {/* Tab 2: Explain Concept */}
      {activeTab === 'explain' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Feynman Technique Concept Breakdown
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Get an intuitive analogy, deep-dive mechanics, real-world examples, and quick self-check questions.
            </p>

            <form onSubmit={handleExplainConcept} className="space-y-4">
              <Input
                label="Concept or Principle"
                placeholder="e.g. Backpropagation, CAP Theorem, Photosynthesis Light Reactions"
                required
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
              />

              <Input
                label="Optional Context or specific confusion"
                placeholder="e.g. I understand forward pass, but gradients confuse me"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />

              <Button
                type="submit"
                variant="accent"
                isLoading={explainLoading}
                icon={Lightbulb}
              >
                Explain Concept
              </Button>
            </form>
          </div>

          {explanation && (
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <MarkdownView content={explanation} />
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Exam Questions */}
      {activeTab === 'exam' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Generate High-Yield Exam Questions
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Curate strict examination questions with model answers and grading rubrics.
            </p>

            <form onSubmit={handleGenerateExamQuestions} className="space-y-4">
              <Input
                label="Subject Topic"
                placeholder="e.g. Distributed Consensus, Microeconomics Elasticity"
                value={examTopic}
                onChange={(e) => setExamTopic(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Or Base on Existing Study Note
                </label>
                <select
                  value={selectedNoteForExam}
                  onChange={(e) => setSelectedNoteForExam(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value="">Select a note (Optional)</option>
                  {notes.map((n) => (
                    <option key={n._id} value={n._id}>
                      {n.title}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="accent"
                isLoading={examLoading}
                icon={FileQuestion}
              >
                Generate Exam Questions
              </Button>
            </form>
          </div>

          {examQuestions && (
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <MarkdownView content={examQuestions} />
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Revision Notes */}
      {activeTab === 'revision' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Last-Minute Active Recall Sheet
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Synthesize high-density cheat sheets with formulas, core mnemonics, and common exam traps.
            </p>

            <form onSubmit={handleGenerateRevisionNotes} className="space-y-4">
              <Input
                label="Topic"
                placeholder="e.g. Organic Reaction Mechanisms, Operating System Scheduling"
                value={revisionTopic}
                onChange={(e) => setRevisionTopic(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Or Select Existing Note
                </label>
                <select
                  value={selectedNoteForRevision}
                  onChange={(e) => setSelectedNoteForRevision(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value="">Select a note (Optional)</option>
                  {notes.map((n) => (
                    <option key={n._id} value={n._id}>
                      {n.title}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="accent"
                isLoading={revisionLoading}
                icon={BookMarked}
              >
                Generate Revision Sheet
              </Button>
            </form>
          </div>

          {revisionNotes && (
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <MarkdownView content={revisionNotes} />
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Folder Summary */}
      {activeTab === 'folder' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Synthesize Entire Folder
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Gemini will read all notes inside the chosen folder and generate a unified curriculum summary.
            </p>

            <form onSubmit={handleSummarizeFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Select Folder
                </label>
                <select
                  required
                  value={selectedFolderForSummary}
                  onChange={(e) => setSelectedFolderForSummary(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                >
                  <option value="">Choose a folder...</option>
                  {folders.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} ({f.noteCount ?? 0} notes)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Summary Style
                </label>
                <div className="flex gap-3">
                  {[
                    { id: 'detailed', label: 'Comprehensive Synthesis' },
                    { id: 'short', label: 'Executive Summary' },
                    { id: 'bullet-points', label: 'Bullet Points' },
                  ].map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="folderStyle"
                        checked={folderSummaryStyle === s.id}
                        onChange={() => setFolderSummaryStyle(s.id)}
                        className="text-emerald-600"
                      />
                      <span className="text-neutral-700 dark:text-neutral-300">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                isLoading={folderSummaryLoading}
                icon={FolderSync}
              >
                Synthesize Folder
              </Button>
            </form>
          </div>

          {folderSummary && (
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <MarkdownView content={folderSummary} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
