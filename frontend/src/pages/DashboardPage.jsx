import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../features/dashboard/dashboardSlice';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import {
  FileText,
  BookOpen,
  Layers,
  HelpCircle,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Academic Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Elevate your study flow, {user?.name?.split(' ')[0] || 'Scholar'}.
          </h1>
          <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
            Your notes, RAG-indexed textbooks, flashcard decks, and live peer study rooms are all synchronized with Gemini AI.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => navigate('/notes/new')}
              variant="accent"
              size="sm"
              icon={Plus}
            >
              New Note
            </Button>
            <Button
              onClick={() => navigate('/pdf-library')}
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              icon={BookOpen}
            >
              Upload PDF
            </Button>
            <Button
              onClick={() => navigate('/quizzes')}
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              icon={HelpCircle}
            >
              Take AI Quiz
            </Button>
            <Button
              onClick={() => navigate('/study-rooms')}
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              icon={Users}
            >
              Study Rooms
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Total Notes
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-3" />
          ) : (
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {metrics.totalNotes ?? 0}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Across {metrics.totalFolders ?? 0} folders
              </p>
            </div>
          )}
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              RAG Documents
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-3" />
          ) : (
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {metrics.totalDocuments ?? 0}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">Vector indexed PDFs</p>
            </div>
          )}
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Flashcards
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-3" />
          ) : (
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {metrics.totalCards ?? 0}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {metrics.masteryRate ?? 0}% mastery rate
              </p>
            </div>
          )}
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Avg Quiz Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-3" />
          ) : (
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {metrics.averageScore ?? 0}%
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {metrics.totalAttempts ?? 0} attempts completed
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weak Topics Callout if present */}
      {data?.weakTopics && data.weakTopics.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Recommended Focus Areas from Recent Quizzes
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.weakTopics.map((topic, i) => (
                <Badge key={i} variant="warning" size="sm">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Two Column Section: Recent Notes & Recent PDFs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Recent Notes
            </h3>
            <Link
              to="/notes"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map((n) => <Skeleton key={n} className="h-14 w-full" />)
            ) : data?.recentNotes?.length > 0 ? (
              data.recentNotes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => navigate(`/notes/edit/${note._id}`)}
                  className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 bg-neutral-50/50 dark:bg-neutral-800/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {note.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {note.folder?.name ? `Folder: ${note.folder.name}` : 'Unsorted'} •{' '}
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {note.isPinned && <Badge variant="primary">Pinned</Badge>}
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 py-6 text-center">
                No notes created yet. Click "New Note" to begin writing!
              </p>
            )}
          </div>
        </div>

        {/* Recent PDF Documents */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              RAG Document Library
            </h3>
            <Link
              to="/pdf-library"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Manage library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map((n) => <Skeleton key={n} className="h-14 w-full" />)
            ) : data?.recentDocuments?.length > 0 ? (
              data.recentDocuments.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => navigate(`/pdf-library/chat/${doc._id}`)}
                  className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-sky-400 dark:hover:border-sky-600 bg-neutral-50/50 dark:bg-neutral-800/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 flex items-center justify-center font-bold text-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px] sm:max-w-[280px]">
                        {doc.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {doc.totalPages} pages • {doc.chunkCount} vector chunks
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      doc.status === 'indexed'
                        ? 'success'
                        : doc.status === 'processing'
                        ? 'warning'
                        : doc.status === 'failed'
                        ? 'danger'
                        : 'default'
                    }
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 py-6 text-center">
                No PDFs uploaded yet. Upload a syllabus or textbook to chat with your materials.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
