import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePDFChatStore } from '../store/pdf.store.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Send, Trash2, MessageSquare,
  Bot, User, CloudUpload, Loader2, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PDFChatPage = () => {
  const {
    uploadedPDFs, selectedPDF, chatHistory,
    loading, error, fetchPDFs, uploadPDF, selectPDF, sendMessage, clearChat,
  } = usePDFChatStore();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchPDFs();
  }, [fetchPDFs]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    await uploadPDF(file);
    setFile(null);
    setUploading(false);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage('');
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="min-h-screen bg-[#050816] pt-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-cyan-900/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-indigo-900/15 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-purple-cyan flex items-center justify-center shadow-lg">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PDF AI Chat</h1>
              <p className="text-slate-500 text-sm">Upload PDFs and have intelligent conversations with them</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="lg:col-span-1 space-y-5">
            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Upload size={14} className="text-cyan-400" />
                  Upload PDF
                </h2>
              </div>
              <div className="p-4">
                {/* Drag & Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                    isDragging
                      ? 'border-cyan-500/60 bg-cyan-500/5'
                      : file
                      ? 'border-indigo-500/40 bg-indigo-500/5'
                      : 'border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5'
                  }`}
                  onClick={() => document.getElementById('pdf-input').click()}
                >
                  <input
                    id="pdf-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                  <CloudUpload size={28} className={`mx-auto mb-3 ${isDragging ? 'text-cyan-400' : file ? 'text-indigo-400' : 'text-slate-600'}`} />
                  {file ? (
                    <>
                      <p className="text-white text-sm font-medium truncate">{file.name}</p>
                      <p className="text-slate-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-400 text-sm font-medium">Drop PDF here</p>
                      <p className="text-slate-600 text-xs mt-1">or click to browse</p>
                    </>
                  )}
                </div>

                {file && (
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex-1 btn btn-primary py-2.5 text-sm"
                    >
                      {uploading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Upload size={14} />
                          Upload
                        </span>
                      )}
                    </motion.button>
                    <button
                      onClick={() => setFile(null)}
                      className="p-2.5 rounded-xl btn-ghost border border-white/5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* PDF list */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                  <FileText size={14} className="text-indigo-400" />
                  Your PDFs
                  <span className="badge badge-indigo ml-auto">{uploadedPDFs.length}</span>
                </h2>
              </div>
              <div className="p-3">
                {uploadedPDFs.length === 0 ? (
                  <div className="py-8 text-center">
                    <FileText size={32} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-600 text-xs">No PDFs uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {uploadedPDFs.map((pdf) => (
                      <motion.button
                        key={pdf._id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => selectPDF(pdf)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm ${
                          selectedPDF?._id === pdf._id
                            ? 'bg-indigo-500/15 border border-indigo-500/30 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedPDF?._id === pdf._id
                            ? 'gradient-indigo-purple'
                            : 'bg-slate-800'
                        }`}>
                          <FileText size={13} className="text-white" />
                        </div>
                        <span className="truncate font-medium">{pdf.title}</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Chat panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-2xl border border-white/5 flex flex-col"
            style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}
          >
            {selectedPDF ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-purple-cyan flex items-center justify-center">
                      <MessageSquare size={14} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm truncate max-w-[200px]">
                        {selectedPDF.title}
                      </h3>
                      <p className="text-slate-600 text-xs">Chat with this PDF</p>
                    </div>
                  </div>
                  <button
                    onClick={clearChat}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
                  >
                    <Trash2 size={12} />
                    Clear
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {chatHistory.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-16 h-16 rounded-2xl gradient-purple-cyan flex items-center justify-center mb-4 shadow-lg">
                        <Bot size={28} className="text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">Ask anything about your PDF</h3>
                      <p className="text-slate-500 text-sm max-w-xs">
                        I can summarize sections, answer specific questions, extract key points, and more.
                      </p>
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {chatHistory.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role !== 'user' && (
                          <div className="w-8 h-8 rounded-lg gradient-purple-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot size={14} className="text-white" />
                          </div>
                        )}
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'gradient-indigo-purple text-white rounded-tr-sm'
                            : 'glass border border-white/5 text-slate-200 rounded-tl-sm'
                        }`}>
                          {msg.role === 'user' ? (
                            <p>{msg.content}</p>
                          ) : (
                            <div className="ai-markdown text-sm">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-lg gradient-indigo-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User size={14} className="text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-lg gradient-purple-cyan flex items-center justify-center flex-shrink-0">
                        <Bot size={14} className="text-white" />
                      </div>
                      <div className="glass border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">
                        <div className="flex gap-1.5">
                          <div className="thinking-dot" />
                          <div className="thinking-dot" />
                          <div className="thinking-dot" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Error */}
                {error && (
                  <div className="mx-5 mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Input */}
                <div className="px-5 py-4 border-t border-white/5 flex-shrink-0">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Ask anything about this PDF..."
                      className="input-field flex-1"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!message.trim() || loading}
                      className="btn btn-primary px-4 py-3 disabled:opacity-50"
                    >
                      <Send size={16} />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-2xl gradient-purple-cyan flex items-center justify-center mb-5 shadow-xl">
                  <MessageSquare size={34} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Select a PDF to chat</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Choose a PDF from your library on the left, or upload a new one to get started.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PDFChatPage;
