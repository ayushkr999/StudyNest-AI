import React, { useEffect, useState, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useNoteStore } from '../store/note.store.js';
import FolderSidebar from '../components/FolderSidebar.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, X, FileText, Clock, Hash } from 'lucide-react';

const getWordCount = (text) => text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
const getReadingTime = (text) => {
  const words = getWordCount(text);
  const mins = Math.ceil(words / 200);
  return mins < 1 ? '< 1 min' : `${mins} min read`;
};

const NotesPage = () => {
  const { notes, fetchNotes, createNote, updateNote, deleteNote, loading } = useNoteStore();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSaved, setAutoSaved] = useState(false);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const displayedNotes = selectedFolder
    ? notes.filter((n) => n.folder === selectedFolder)
    : notes;

  const filteredNotes = displayedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-save indicator
  useEffect(() => {
    if (editingNote && content) {
      setAutoSaved(false);
      const timer = setTimeout(() => setAutoSaved(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [content, editingNote]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createNote(title, content, selectedFolder);
    setTitle(''); setContent(''); setShowCreateForm(false);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowCreateForm(true);
  };

  const handleUpdate = async () => {
    if (!editingNote) return;
    await updateNote(editingNote._id, title, content, selectedFolder);
    setEditingNote(null); setTitle(''); setContent(''); setShowCreateForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  const handleDropNoteToFolder = async (targetFolderId) => {
    const draggedNoteId = window.__draggedNoteId;
    if (!draggedNoteId) return;
    const note = notes.find((n) => n._id === draggedNoteId);
    if (!note) return;
    await updateNote(note._id, note.title, note.content, targetFolderId || null);
  };

  const cancelEdit = () => {
    setEditingNote(null); setTitle(''); setContent(''); setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-16">
      <div className="flex flex-col lg:flex-row h-screen max-w-[1600px] mx-auto">
        {/* Folder Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <FolderSidebar onSelectFolder={setSelectedFolder} onDropNote={handleDropNoteToFolder} activeFolderId={selectedFolder} />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <FileText size={24} className="text-indigo-400" />
                  Notes
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  {selectedFolder ? 'Filtered by folder' : `${filteredNotes.length} total notes`}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="btn btn-primary px-4 py-2.5 text-sm gap-2"
              >
                <Plus size={15} />
                New Note
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 text-sm"
              />
            </div>
          </div>

          {/* Create/Edit form */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 glass rounded-2xl border border-indigo-500/15 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Edit3 size={15} className="text-indigo-400" />
                      {editingNote ? 'Edit Note' : 'Create New Note'}
                    </h3>
                    <div className="flex items-center gap-3">
                      {editingNote && autoSaved && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Auto-saved
                        </span>
                      )}
                      <button onClick={cancelEdit} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field mb-4 font-semibold text-base"
                  />

                  {title && (
                    <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Hash size={10} />
                        {getWordCount(content)} words
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {getReadingTime(content)}
                      </span>
                    </div>
                  )}

                  <div data-color-mode="dark" className="rounded-xl overflow-hidden border border-white/5 mb-4">
                    <MDEditor value={content} onChange={setContent} height={200} preview="edit" />
                  </div>

                  <div className="flex gap-3">
                    {editingNote ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleUpdate}
                        className="btn btn-primary px-5 py-2.5 text-sm"
                      >
                        Update Note
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreate}
                        disabled={!title.trim()}
                        className="btn btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
                      >
                        Create Note
                      </motion.button>
                    )}
                    <button
                      onClick={cancelEdit}
                      className="btn btn-ghost px-5 py-2.5 text-sm border border-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notes grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-500 text-sm">Loading notes...</p>
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-2xl glass-brand flex items-center justify-center mb-4 border border-indigo-500/15">
                <FileText size={28} className="text-slate-600" />
              </div>
              <h3 className="text-slate-300 font-semibold text-lg mb-2">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-slate-600 text-sm mb-5">
                {searchQuery ? 'Try different search terms' : 'Create your first note to get started'}
              </p>
              {!searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-primary px-6 py-2.5 text-sm"
                >
                  <Plus size={15} /> Create First Note
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {filteredNotes.map((note, i) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    draggable
                    onDragStart={() => { window.__draggedNoteId = note._id; }}
                    onDragEnd={() => { if (window.__draggedNoteId === note._id) delete window.__draggedNoteId; }}
                    className="glass rounded-2xl border border-white/5 p-4 hover:border-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-grab"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-white text-base truncate flex-1 mr-2 group-hover:text-indigo-300 transition-colors">
                        {note.title}
                      </h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => handleEdit(note)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
                      <MDEditor.Markdown source={note.content || ''} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-700 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Hash size={9} />
                          {getWordCount(note.content)}w
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={9} />
                          {getReadingTime(note.content)}
                        </span>
                      </div>
                      <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
