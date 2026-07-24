import React, { useEffect, useState } from 'react';
import { useFolderStore } from '../store/folder.store.js';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, FolderPlus, Trash2, FileText, ChevronRight } from 'lucide-react';

const FolderSidebar = ({ onSelectFolder, onDropNote, activeFolderId }) => {
  const { folders, fetchFolders, createFolder, deleteFolder, loading } = useFolderStore();
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createFolder(name);
    setName('');
    setIsCreating(false);
  };

  return (
    <div className="w-full lg:w-64 h-auto lg:h-screen flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 glass-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FolderOpen size={15} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Folders</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCreating(!isCreating)}
          className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-colors"
          title="New folder"
        >
          <FolderPlus size={15} />
        </motion.button>
      </div>

      {/* Create folder form */}
      <AnimatePresence>
        {isCreating && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="overflow-hidden"
          >
            <div className="p-3 border-b border-white/5 flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Folder name..."
                autoFocus
                className="flex-1 input-field py-1.5 text-xs rounded-lg"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg gradient-indigo-purple text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center gap-2 px-3 py-2 text-slate-500 text-xs">
            <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Loading folders...
          </div>
        ) : (
          <ul className="space-y-0.5">
            {/* All Notes */}
            <li
              onClick={() => onSelectFolder(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (onDropNote) onDropNote(null); }}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all text-sm ${
                activeFolderId === null
                  ? 'bg-indigo-500/15 border border-indigo-500/25 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={14} className={activeFolderId === null ? 'text-indigo-400' : 'text-slate-500'} />
              <span className="flex-1 font-medium truncate">All Notes</span>
              {activeFolderId === null && (
                <ChevronRight size={12} className="text-indigo-400" />
              )}
            </li>

            {/* Folders */}
            <AnimatePresence>
              {folders.map((folder, i) => (
                <motion.li
                  key={folder._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => onSelectFolder(folder._id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (onDropNote) onDropNote(folder._id); }}
                  className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all text-sm ${
                    activeFolderId === folder._id
                      ? 'bg-indigo-500/15 border border-indigo-500/25 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FolderOpen
                    size={14}
                    className={activeFolderId === folder._id ? 'text-indigo-400' : 'text-slate-500'}
                  />
                  <span className="flex-1 font-medium truncate">{folder.name}</span>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const ok = window.confirm('Delete this folder? Notes will remain but be unassigned.');
                      if (!ok) return;
                      await deleteFolder(folder._id);
                      if (activeFolderId === folder._id) onSelectFolder(null);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete folder"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>

            {folders.length === 0 && !loading && (
              <div className="px-3 py-4 text-center">
                <p className="text-slate-600 text-xs">No folders yet</p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="text-indigo-400 hover:text-indigo-300 text-xs mt-1 transition-colors"
                >
                  Create your first folder →
                </button>
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FolderSidebar;
