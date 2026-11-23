import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchQuizzes,
  generateQuiz,
  fetchAttempts,
} from '../features/quizzes/quizSlice';
import { fetchNotes } from '../features/notes/notesSlice';
import { fetchDocuments } from '../features/pdf/pdfSlice';
import { addToast } from '../features/ui/uiSlice';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Skeleton';
import {
  HelpCircle,
  Sparkles,
  Play,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const QuizzesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { quizzes, attempts, loading, generating } = useSelector((state) => state.quizzes);
  const { notes } = useSelector((state) => state.notes);
  const { documents } = useSelector((state) => state.pdf);

  // Generate Modal
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [quizTopic, setQuizTopic] = useState('');
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchAttempts());
    dispatch(fetchNotes({ limit: 100 }));
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim() && !selectedNote && !selectedDoc) {
      dispatch(addToast({ message: 'Please specify a topic, note, or document.', type: 'error' }));
      return;
    }

    const res = await dispatch(
      generateQuiz({
        topic: quizTopic.trim(),
        noteId: selectedNote || undefined,
        documentId: selectedDoc || undefined,
        difficulty,
        questionCount: count,
      })
    );

    if (!res.error) {
      dispatch(addToast({ message: 'Quiz created with Gemini AI!', type: 'success' }));
      setIsGenerateOpen(false);
      navigate(`/quizzes/${res.payload._id}`);
    } else {
      dispatch(addToast({ message: res.payload || 'Failed to generate quiz.', type: 'error' }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>AI Quiz Generator & Assessments</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Test comprehension with multiple-choice quizzes created dynamically by Gemini from your study material.
          </p>
        </div>

        <Button
          onClick={() => setIsGenerateOpen(true)}
          variant="accent"
          size="sm"
          icon={Sparkles}
        >
          Generate AI Quiz
        </Button>
      </div>

      {/* Quizzes List */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-3">
          Available Quizzes
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                onClick={() => navigate(`/quizzes/${quiz._id}`)}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <Badge
                      variant={
                        quiz.difficulty === 'hard'
                          ? 'danger'
                          : quiz.difficulty === 'medium'
                          ? 'warning'
                          : 'success'
                      }
                      size="xs"
                    >
                      {quiz.difficulty.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                    {quiz.topic} • {quiz.questions?.length || 0} Questions
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/quizzes/${quiz._id}`);
                    }}
                    variant="ghost"
                    size="sm"
                    icon={Play}
                    className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs"
                  >
                    Start Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={HelpCircle}
            title="No quizzes generated yet"
            description="Use Gemini to generate a quiz from any topic, lecture note, or uploaded textbook."
            actionText="Generate Quiz"
            onAction={() => setIsGenerateOpen(true)}
          />
        )}
      </div>

      {/* Quiz History & Attempts */}
      {attempts.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Completed Assessments History</span>
            </h3>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {attempts.slice(0, 5).map((att) => (
              <div key={att._id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {att.quiz?.title || 'Quiz Assessment'}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Score: {att.score}/{att.totalQuestions} • {new Date(att.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    att.percentage >= 80 ? 'success' : att.percentage >= 50 ? 'warning' : 'danger'
                  }
                  size="sm"
                >
                  {att.percentage}% Score
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Quiz Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate AI Academic Quiz"
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <Input
            label="Quiz Topic"
            placeholder="e.g. World War II Geopolitics, Graph Theory"
            value={quizTopic}
            onChange={(e) => setQuizTopic(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Or Generate from Study Note
            </label>
            <select
              value={selectedNote}
              onChange={(e) => setSelectedNote(e.target.value)}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="easy">Easy (Fundamentals)</option>
                <option value="medium">Medium (Analytical)</option>
                <option value="hard">Hard (Advanced / Exam)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Questions
              </label>
              <select
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsGenerateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              isLoading={generating}
              icon={Sparkles}
            >
              Generate Quiz
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
