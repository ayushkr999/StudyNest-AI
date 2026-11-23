import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotes, deleteNote, togglePinNote } from '../features/notes/notesSlice';
import { fetchFolders, createFolder } from '../features/folders/folderSlice';
import { addToast } from '../features/ui/uiSlice';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Skeleton';
import {
  FileText,
  Folder as FolderIcon,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Filter,
} from 'lucide-react';

export const NotesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notes, loading } = useSelector((state) => state.notes);
  const { folders } = useSelector((state) => state.folders);

  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#10b981');

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  useEffect(() => {
    const query = {};
    if (search.trim()) query.search = search.trim();
    if (selectedFolder !== 'all') {
      query.folder = selectedFolder === 'root' ? 'null' : selectedFolder;
    }
    dispatch(fetchNotes(query));
  }, [dispatch, search, selectedFolder]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    await dispatch(createFolder({ name: newFolderName.trim(), color: newFolderColor }));
    dispatch(addToast({ message: 'Folder created successfully!', type: 'success' }));
    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  const handleDeleteNote = async (e, noteId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await dispatch(deleteNote(noteId));
      dispatch(addToast({ message: 'Note deleted.', type: 'info' }));
    }
  };

  const handleTogglePin = async (e, noteId) => {
    e.stopPropagation();
    await dispatch(togglePinNote(noteId));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            My Study Notes
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Organize study materials, synthesize concepts, and auto-save notes with Markdown.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsFolderModalOpen(true)}
            variant="outline"
            size="sm"
            icon={FolderIcon}
          >
            New Folder
          </Button>
          <Button
            onClick={() => navigate('/notes/new')}
            variant="accent"
            size="sm"
            icon={Plus}
          >
            Create Note
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search notes by title, content, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Folder Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFolder === 'all'
                ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => setSelectedFolder('root')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFolder === 'root'
                ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
            }`}
          >
            Unsorted
          </button>
          {folders.map((folder) => (
            <button
              key={folder._id}
              onClick={() => setSelectedFolder(folder._id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedFolder === folder._id
                  ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: folder.color || '#10b981' }}
              />
              <span>{folder.name}</span>
              <span className="opacity-70 text-[10px]">({folder.noteCount ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note._id}
              onClick={() => navigate(`/notes/edit/${note._id}`)}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {note.title}
                  </h3>
                  <button
                    onClick={(e) => handleTogglePin(e, note._id)}
                    className={`p-1 rounded-lg transition-colors ${
                      note.isPinned
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-500'
                    }`}
                    title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                  >
                    <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                  {note.content ? note.content.slice(0, 160) : 'Empty note content...'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">
                  {note.folder?.name ? (
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                      {note.folder.name}
                    </span>
                  ) : (
                    'Unsorted'
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDeleteNote(e, note._id)}
                    className="p-1 rounded text-neutral-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No study notes found"
          description="Create your first note to start drafting, formatting Markdown, or synthesizing notes with Gemini AI."
          actionText="Create New Note"
          onAction={() => navigate('/notes/new')}
        />
      )}

      {/* Create Folder Modal */}
      <Modal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        title="Create New Folder"
      >
        <form onSubmit={handleCreateFolder} className="space-y-4">
          <Input
            label="Folder Name"
            placeholder="e.g. Organic Chemistry, Algorithms"
            required
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Accent Color
            </label>
            <div className="flex gap-2">
              {['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'].map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setNewFolderColor(color)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    newFolderColor === color ? 'scale-125 ring-2 ring-offset-2 ring-emerald-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFolderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Folder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
