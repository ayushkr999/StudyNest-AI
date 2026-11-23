import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNoteById,
  createNote,
  updateNote,
  togglePinNote,
  deleteNote,
} from '../features/notes/notesSlice';
import { fetchFolders } from '../features/folders/folderSlice';
import { addToast } from '../features/ui/uiSlice';
import api from '../services/api';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { MarkdownView } from '../components/common/MarkdownView';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Pin,
  Trash2,
  CheckCircle2,
  Loader2,
  Eye,
  Edit2,
  Columns,
} from 'lucide-react';

export const NoteEditorPage = () => {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentNote, saving, loading } = useSelector((state) => state.notes);
  const { folders } = useSelector((state) => state.folders);

  const [title, setTitle] = useState('Untitled Note');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'edit', 'preview', 'split'

  // AI Summary Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState('detailed');
  const [aiSummary, setAiSummary] = useState('');
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);

  // Debounced auto-save ref
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchFolders());
    if (!isNew) {
      dispatch(fetchNoteById(id));
    } else {
      setTitle('Untitled Note');
      setContent('');
      setFolder('');
      setIsPinned(false);
    }
  }, [dispatch, id, isNew]);

  useEffect(() => {
    if (!isNew && currentNote && currentNote._id === id) {
      setTitle(currentNote.title || 'Untitled Note');
      setContent(currentNote.content || '');
      setFolder(currentNote.folder?._id || currentNote.folder || '');
      setIsPinned(Boolean(currentNote.isPinned));
    }
  }, [currentNote, isNew, id]);

  // Debounce auto-save whenever title or content changes (for existing notes)
  const triggerAutoSave = (updatedFields) => {
    if (isNew) return; // do not auto-save before initial create
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      dispatch(
        updateNote({
          id,
          data: updatedFields,
        })
      );
    }, 700);
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    triggerAutoSave({ title: val, content, folder: folder || null });
  };

  const handleContentChange = (val) => {
    setContent(val);
    triggerAutoSave({ title, content: val, folder: folder || null });
  };

  const handleFolderChange = (val) => {
    setFolder(val);
    triggerAutoSave({ title, content, folder: val || null });
  };

  const handleManualSave = async () => {
    if (isNew) {
      const res = await dispatch(
        createNote({
          title,
          content,
          folder: folder || null,
          isPinned,
        })
      );
      if (!res.error) {
        dispatch(addToast({ message: 'Note created successfully!', type: 'success' }));
        navigate(`/notes/edit/${res.payload._id}`, { replace: true });
      }
    } else {
      await dispatch(
        updateNote({
          id,
          data: { title, content, folder: folder || null, isPinned },
        })
      );
      dispatch(addToast({ message: 'Saved successfully!', type: 'success' }));
    }
  };

  const handleSummarizeWithAi = async () => {
    setIsAiSummarizing(true);
    setAiSummary('');
    try {
      // First ensure current content is saved if editing existing
      if (!isNew) {
        await dispatch(updateNote({ id, data: { title, content } }));
      }
      const res = await api.post(`/ai/summarize-note/${id}`, { style: summaryStyle });
      setAiSummary(res.data.summary);
    } catch (err) {
      dispatch(addToast({ message: err.message, type: 'error' }));
    } finally {
      setIsAiSummarizing(false);
    }
  };

  const handleAppendAiSummary = () => {
    if (!aiSummary) return;
    const newContent = `${content}\n\n## AI Summary (${summaryStyle})\n${aiSummary}`;
    setContent(newContent);
    triggerAutoSave({ title, content: newContent, folder: folder || null });
    setIsAiModalOpen(false);
    dispatch(addToast({ message: 'AI Summary appended to note!', type: 'success' }));
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/notes')}
          >
            Back
          </Button>

          {/* Saving status indicator */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Auto-saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saved</span>
              </>
            )}
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2">
          {/* Folder Select */}
          <select
            value={folder}
            onChange={(e) => handleFolderChange(e.target.value)}
            className="text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2.5 py-1.5 focus:outline-none"
          >
            <option value="">No Folder (Unsorted)</option>
            {folders.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800 p-0.5 bg-neutral-50 dark:bg-neutral-800">
            <button
              onClick={() => setViewMode('edit')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'edit' ? 'bg-white dark:bg-neutral-700 shadow-xs' : 'text-neutral-500'
              }`}
              title="Editor Only"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'split' ? 'bg-white dark:bg-neutral-700 shadow-xs' : 'text-neutral-500'
              }`}
              title="Split View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'preview' ? 'bg-white dark:bg-neutral-700 shadow-xs' : 'text-neutral-500'
              }`}
              title="Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gemini AI Summarize Note */}
          {!isNew && (
            <Button
              onClick={() => setIsAiModalOpen(true)}
              variant="outline"
              size="sm"
              icon={Sparkles}
              className="text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
            >
              AI Summarize
            </Button>
          )}

          <Button onClick={handleManualSave} variant="primary" size="sm" icon={Save}>
            Save
          </Button>
        </div>
      </div>

      {/* Title Input */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note Title..."
          className="w-full text-xl sm:text-2xl font-black bg-transparent border-none text-neutral-900 dark:text-neutral-100 focus:outline-none placeholder-neutral-400"
        />
      </div>

      {/* Editor & Live Preview Area */}
      <div
        className={`grid gap-4 min-h-[500px] ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Markdown Editor
            </span>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your study notes using Markdown (# Heading, **bold**, - bullet points, ```code)..."
              className="w-full flex-1 min-h-[480px] bg-transparent resize-y border-none text-sm font-mono leading-relaxed text-neutral-800 dark:text-neutral-200 focus:outline-none"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex flex-col rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm overflow-y-auto max-h-[700px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Live Preview
            </span>
            {content ? (
              <MarkdownView content={content} />
            ) : (
              <p className="text-xs text-neutral-400 italic">
                Markdown preview will appear here live as you type...
              </p>
            )}
          </div>
        )}
      </div>

      {/* AI Summarize Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="Summarize Note with Gemini AI"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
              Choose Summary Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'short', label: 'Concise (2-3 Paragraphs)' },
                { id: 'detailed', label: 'Detailed Breakdown' },
                { id: 'bullet-points', label: 'High-Impact Bullets' },
              ].map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setSummaryStyle(style.id)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    summaryStyle === style.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSummarizeWithAi}
            variant="accent"
            size="sm"
            isLoading={isAiSummarizing}
            icon={Sparkles}
          >
            Generate Summary
          </Button>

          {aiSummary && (
            <div className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 max-h-72 overflow-y-auto">
              <MarkdownView content={aiSummary} />
            </div>
          )}

          {aiSummary && (
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsAiModalOpen(false)}>
                Dismiss
              </Button>
              <Button variant="primary" size="sm" onClick={handleAppendAiSummary}>
                Append to Note
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
