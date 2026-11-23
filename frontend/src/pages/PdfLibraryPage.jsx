import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchDocuments,
  uploadPdfDocument,
  deleteDocument,
  retryIndexing,
} from '../features/pdf/pdfSlice';
import { addToast } from '../features/ui/uiSlice';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/Skeleton';
import {
  BookOpen,
  UploadCloud,
  MessageSquare,
  Trash2,
  RefreshCw,
  FileCheck2,
  Layers,
  FileText,
} from 'lucide-react';

export const PdfLibraryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { documents, loading, uploading } = useSelector((state) => state.pdf);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        dispatch(addToast({ message: 'Only PDF documents are allowed.', type: 'error' }));
        return;
      }
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      dispatch(addToast({ message: 'Please select a PDF file.', type: 'error' }));
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (docTitle.trim()) {
      formData.append('title', docTitle.trim());
    }

    const res = await dispatch(uploadPdfDocument(formData));
    if (!res.error) {
      dispatch(
        addToast({
          message: 'PDF uploaded! LangChain text extraction and Qdrant indexing started.',
          type: 'success',
        })
      );
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setDocTitle('');
    } else {
      dispatch(addToast({ message: res.payload || 'Upload failed.', type: 'error' }));
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this document and all associated Qdrant vector embeddings?')) {
      await dispatch(deleteDocument(id));
      dispatch(addToast({ message: 'Document and vectors removed.', type: 'info' }));
    }
  };

  const handleRetry = async (e, id) => {
    e.stopPropagation();
    const res = await dispatch(retryIndexing(id));
    if (!res.error) {
      dispatch(addToast({ message: 'Indexing restarted.', type: 'info' }));
    }
  };

  const toggleSelectDoc = (id) => {
    if (selectedDocIds.includes(id)) {
      setSelectedDocIds(selectedDocIds.filter((item) => item !== id));
    } else {
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  const handleStartMultiDocChat = () => {
    if (selectedDocIds.length === 0) return;
    navigate(`/pdf-library/chat/multi?docs=${selectedDocIds.join(',')}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>RAG Document Library</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Upload textbooks, lecture slides, and notes. LangChain splits text and Qdrant Cloud indexes embeddings for semantic search.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {selectedDocIds.length > 1 && (
            <Button
              onClick={handleStartMultiDocChat}
              variant="outline"
              size="sm"
              icon={Layers}
              className="border-emerald-500 text-emerald-700 dark:text-emerald-400"
            >
              Chat ({selectedDocIds.length} Docs Selected)
            </Button>
          )}

          <Button
            onClick={() => setIsUploadModalOpen(true)}
            variant="accent"
            size="sm"
            icon={UploadCloud}
          >
            Upload PDF
          </Button>
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const isSelected = selectedDocIds.includes(doc._id);
            return (
              <div
                key={doc._id}
                onClick={() => navigate(`/pdf-library/chat/${doc._id}`)}
                className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Selection checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleSelectDoc(doc._id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
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

                  <h3 className="mt-3 text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {doc.title}
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {doc.totalPages || 0} pages • {doc.chunkCount || 0} vector chunks
                  </p>

                  {doc.errorMessage && (
                    <p className="mt-2 text-[11px] text-red-500 line-clamp-2">
                      Error: {doc.errorMessage}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-400">
                    {(doc.fileSize / (1024 * 1024)).toFixed(1)} MB
                  </span>

                  <div className="flex items-center gap-2">
                    {doc.status === 'failed' && (
                      <button
                        onClick={(e) => handleRetry(e, doc._id)}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                        title="Retry Indexing"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/pdf-library/chat/${doc._id}`);
                      }}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, doc._id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No documents in your RAG library"
          description="Upload your textbook chapters or research papers to unlock question-answering with exact source citations."
          actionText="Upload PDF"
          onAction={() => setIsUploadModalOpen(true)}
        />
      )}

      {/* Upload PDF Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document for RAG Indexing"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input
            label="Document Title (Optional)"
            placeholder="e.g. Campbell Biology Chapter 12"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />

          {/* File Dropzone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Select PDF File (Max 30MB)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-emerald-500 transition-colors">
              <div className="space-y-2 text-center">
                <UploadCloud className="mx-auto h-10 w-10 text-neutral-400" />
                <div className="flex text-xs text-neutral-600 dark:text-neutral-400 justify-center">
                  <label className="relative cursor-pointer font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-[11px] text-neutral-400">PDF up to 30MB</p>
              </div>
            </div>
            {selectedFile && (
              <p className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <FileCheck2 className="w-4 h-4" />
                <span>Selected: {selectedFile.name}</span>
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={uploading}
              disabled={!selectedFile}
            >
              Upload & Index
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
