import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchDecks,
  createDeck,
  deleteDeck,
  generateAiCards,
} from '../features/flashcards/flashcardSlice';
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
  Layers,
  Sparkles,
  Plus,
  Play,
  Trash2,
  BookOpen,
  FileText,
} from 'lucide-react';

export const FlashcardsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { decks, loading, generating } = useSelector((state) => state.flashcards);
  const { notes } = useSelector((state) => state.notes);
  const { documents } = useSelector((state) => state.pdf);

  // Manual Deck Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDesc, setDeckDesc] = useState('');

  // AI Generation Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [cardCount, setCardCount] = useState(5);

  useEffect(() => {
    dispatch(fetchDecks());
    dispatch(fetchNotes({ limit: 100 }));
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleCreateManualDeck = async (e) => {
    e.preventDefault();
    if (!deckTitle.trim()) return;

    const res = await dispatch(createDeck({ title: deckTitle.trim(), description: deckDesc }));
    if (!res.error) {
      dispatch(addToast({ message: 'Deck created!', type: 'success' }));
      setIsManualModalOpen(false);
      setDeckTitle('');
      setDeckDesc('');
    }
  };

  const handleGenerateAiDeck = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim() && !selectedNote && !selectedDoc) {
      dispatch(addToast({ message: 'Please specify a topic, note, or document.', type: 'error' }));
      return;
    }

    const res = await dispatch(
      generateAiCards({
        topic: aiTopic.trim(),
        noteId: selectedNote || undefined,
        documentId: selectedDoc || undefined,
        count: cardCount,
      })
    );

    if (!res.error) {
      dispatch(addToast({ message: 'AI Flashcards generated successfully!', type: 'success' }));
      setIsAiModalOpen(false);
      setAiTopic('');
      setSelectedNote('');
      setSelectedDoc('');
    } else {
      dispatch(addToast({ message: res.payload || 'Failed to generate cards.', type: 'error' }));
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this flashcard deck and all its cards?')) {
      await dispatch(deleteDeck(id));
      dispatch(addToast({ message: 'Deck deleted.', type: 'info' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>AI Flashcards & Spaced Repetition</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Build active recall decks from notes, PDF documents, or generate them automatically using Gemini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsManualModalOpen(true)}
            variant="outline"
            size="sm"
            icon={Plus}
          >
            Create Deck
          </Button>
          <Button
            onClick={() => setIsAiModalOpen(true)}
            variant="accent"
            size="sm"
            icon={Sparkles}
          >
            Generate with AI
          </Button>
        </div>
      </div>

      {/* Decks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div
              key={deck._id}
              onClick={() => navigate(`/flashcards/${deck._id}`)}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <Badge variant="primary" size="sm">
                    {deck.cardCount || 0} Cards
                  </Badge>
                </div>

                <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {deck.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                  {deck.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/flashcards/${deck._id}`);
                  }}
                  variant="ghost"
                  size="sm"
                  icon={Play}
                  className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs"
                >
                  Review
                </Button>

                <button
                  onClick={(e) => handleDelete(e, deck._id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 transition-colors"
                  title="Delete Deck"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No flashcard decks yet"
          description="Generate flashcard decks from your notes with Gemini AI or create a deck manually to master definitions and formulas."
          actionText="Generate AI Flashcards"
          onAction={() => setIsAiModalOpen(true)}
        />
      )}

      {/* Manual Deck Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Create New Flashcard Deck"
      >
        <form onSubmit={handleCreateManualDeck} className="space-y-4">
          <Input
            label="Deck Title"
            placeholder="e.g. Neuroscience Terminology"
            required
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
          />
          <Input
            label="Description (Optional)"
            placeholder="Brief overview of what this deck tests..."
            value={deckDesc}
            onChange={(e) => setDeckDesc(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsManualModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Deck
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI Generate Deck Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="Generate AI Flashcards with Gemini"
      >
        <form onSubmit={handleGenerateAiDeck} className="space-y-4">
          <Input
            label="Topic or Concept"
            placeholder="e.g. Krebs Cycle Enzymes, React 19 Server Components"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Number of Cards
            </label>
            <select
              value={cardCount}
              onChange={(e) => setCardCount(parseInt(e.target.value))}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none"
            >
              <option value={5}>5 Flashcards</option>
              <option value={10}>10 Flashcards</option>
              <option value={15}>15 Flashcards</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAiModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              isLoading={generating}
              icon={Sparkles}
            >
              Generate Cards
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
