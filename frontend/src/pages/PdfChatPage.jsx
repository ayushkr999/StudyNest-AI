import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDocuments,
  fetchDocumentById,
} from '../features/pdf/pdfSlice';
import {
  askPdfQuestion,
  fetchSessions,
  fetchSessionMessages,
  clearActiveSession,
  appendOptimisticUserMessage,
} from '../features/chat/chatSlice';
import { addToast } from '../features/ui/uiSlice';
import { Button } from '../components/common/Button';
import { MarkdownView } from '../components/common/MarkdownView';
import { Badge } from '../components/common/Badge';
import {
  ArrowLeft,
  Send,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Loader2,
  FileText,
} from 'lucide-react';

export const PdfChatPage = () => {
  const { docId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMulti = docId === 'multi';
  const multiDocQuery = searchParams.get('docs');
  const targetDocIds = isMulti && multiDocQuery ? multiDocQuery.split(',') : docId ? [docId] : [];

  const { documents } = useSelector((state) => state.pdf);
  const { messages, asking, activeSessionId } = useSelector((state) => state.chat);

  const [question, setQuestion] = useState('');
  const [activeSourcesDrawer, setActiveSourcesDrawer] = useState(null); // array of sources for selected message

  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(clearActiveSession());
  }, [dispatch]);

  const activeDocs = documents.filter((d) => targetDocIds.includes(d._id));

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || asking) return;

    const query = question.trim();
    setQuestion('');
    dispatch(appendOptimisticUserMessage(query));

    const payload = {
      question: query,
      sessionId: activeSessionId || undefined,
      documentIds: targetDocIds,
    };

    const res = await dispatch(askPdfQuestion(payload));
    if (res.error) {
      dispatch(addToast({ message: res.payload || 'Failed to retrieve answer.', type: 'error' }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/pdf-library')}
          >
            Library
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                {isMulti
                  ? `Multi-Document RAG Chat (${activeDocs.length} PDFs)`
                  : activeDocs[0]?.title || 'Document Q&A'}
              </p>
              <p className="text-[11px] text-neutral-400">
                Semantic retrieval powered by Qdrant & Gemini
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <Badge variant="primary" size="sm">
          Grounded Mode Active
        </Badge>
      </div>

      {/* Main Chat and Sources Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chat Feed */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <Sparkles className="w-10 h-10 text-emerald-600 mb-2 opacity-80" />
                <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  Ask questions about your uploaded PDF
                </h4>
                <p className="text-xs max-w-sm mt-1">
                  Answers are synthesized strictly from retrieved document chunks with verifiable page citations.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
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
                      <>
                        <MarkdownView content={msg.content} />

                        {/* Citation button if sources attached */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                              {msg.sources.length} Verified Sources Cited
                            </span>
                            <button
                              onClick={() => setActiveSourcesDrawer(msg.sources)}
                              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                            >
                              <span>View Sources</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}

            {asking && (
              <div className="flex gap-3 items-center text-xs text-neutral-400 pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Searching vector database and generating grounded answer...</span>
              </div>
            )}
          </div>

          {/* Question Input */}
          <form
            onSubmit={handleAsk}
            className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question based on this document..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button
              type="submit"
              variant="accent"
              isLoading={asking}
              icon={Send}
            >
              Ask
            </Button>
          </form>
        </div>

        {/* Sources & Document Details Drawer */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 flex flex-col h-[650px] overflow-hidden">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Retrieved Sources & Context</span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3">
            {activeSourcesDrawer && activeSourcesDrawer.length > 0 ? (
              activeSourcesDrawer.map((src, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[160px]">
                      {src.documentName || 'Document'}
                    </span>
                    <Badge variant="info" size="xs">
                      Page {src.pageNumber}
                    </Badge>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px] leading-relaxed">
                    "{src.textSnippet}"
                  </p>
                  {src.score && (
                    <p className="text-[10px] text-neutral-400">
                      Similarity Score: {(src.score * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 italic py-8 text-center">
                Click "View Sources" on any AI response to inspect retrieved chunks and page citations.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
