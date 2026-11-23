import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDeckById,
  reviewCard,
  addCard,
  shuffleCurrentCards,
} from '../features/flashcards/flashcardSlice';
import { addToast } from '../features/ui/uiSlice';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { MarkdownView } from '../components/common/MarkdownView';
import {
  ArrowLeft,
  RotateCw,
  Shuffle,
  Plus,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const FlashcardDeckViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentDeck, cards, loading } = useSelector((state) => state.flashcards);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Add Card Modal
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newHint, setNewHint] = useState('');

  useEffect(() => {
    dispatch(fetchDeckById(id));
  }, [dispatch, id]);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(cards.length - 1);
    }
  };

  const handleReview = async (status) => {
    if (!currentCard) return;
    await dispatch(reviewCard({ cardId: currentCard._id, status }));
    dispatch(
      addToast({
        message: status === 'known' ? 'Marked as Known!' : 'Scheduled for revision.',
        type: status === 'known' ? 'success' : 'info',
      })
    );
    handleNext();
  };

  const handleAddCardSubmit = async (e) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    await dispatch(
      addCard({
        deckId: id,
        cardData: {
          front: newFront.trim(),
          back: newBack.trim(),
          hint: newHint.trim(),
        },
      })
    );
    dispatch(addToast({ message: 'Card added to deck!', type: 'success' }));
    setIsAddCardOpen(false);
    setNewFront('');
    setNewBack('');
    setNewHint('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/flashcards')}
          >
            Decks
          </Button>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {currentDeck?.title || 'Review Mode'}
            </h1>
            <p className="text-[11px] text-neutral-400">
              Active Recall • Card {cards.length > 0 ? currentIndex + 1 : 0} of {cards.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => dispatch(shuffleCurrentCards())}
            variant="outline"
            size="sm"
            icon={Shuffle}
          >
            Shuffle
          </Button>
          <Button
            onClick={() => setIsAddCardOpen(true)}
            variant="accent"
            size="sm"
            icon={Plus}
          >
            Add Card
          </Button>
        </div>
      </div>

      {/* Flashcard Presentation Card */}
      {cards.length > 0 && currentCard ? (
        <div className="space-y-6">
          {/* Card Flip Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 cursor-pointer min-h-[340px] select-none"
          >
            <div
              className={`relative w-full min-h-[340px] transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 backface-hidden p-8 rounded-3xl bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-bold uppercase tracking-wider text-emerald-600">
                    Question (Front)
                  </span>
                  <Badge variant={currentCard.status === 'known' ? 'success' : 'warning'}>
                    {currentCard.status}
                  </Badge>
                </div>

                <div className="py-6 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                    {currentCard.front}
                  </h2>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Click anywhere to flip</span>
                  {currentCard.hint && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(!showHint);
                      }}
                      className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHint ? `Hint: ${currentCard.hint}` : 'Show Hint'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Back of Card */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-2 border-emerald-700 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-emerald-300">
                  <span className="font-bold uppercase tracking-wider">
                    Answer (Back)
                  </span>
                  <span>Interval: {currentCard.intervalDays || 1} days</span>
                </div>

                <div className="py-6 text-center">
                  <div className="text-base sm:text-lg text-emerald-50 leading-relaxed">
                    <MarkdownView content={currentCard.back} />
                  </div>
                </div>

                <div className="text-center text-xs text-emerald-300/80">
                  Rate your recall below to adjust spaced repetition interval
                </div>
              </div>
            </div>
          </div>

          {/* Navigation and Recall Scoring Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            {/* Prev */}
            <Button variant="ghost" size="sm" icon={ChevronLeft} onClick={handlePrev}>
              Previous
            </Button>

            {/* Spaced Repetition Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleReview('needs_revision')}
                variant="outline"
                size="md"
                className="border-amber-500 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                icon={AlertCircle}
              >
                Needs Revision
              </Button>
              <Button
                onClick={() => handleReview('known')}
                variant="accent"
                size="md"
                icon={CheckCircle}
              >
                Mastered / Known
              </Button>
            </div>

            {/* Next */}
            <Button variant="ghost" size="sm" onClick={handleNext}>
              <span>Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <Layers className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
            Deck is currently empty
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
            Add cards to this deck or generate them with Gemini to start studying.
          </p>
          <Button onClick={() => setIsAddCardOpen(true)} variant="accent" size="sm">
            Add First Card
          </Button>
        </div>
      )}

      {/* Add Card Modal */}
      <Modal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        title="Add Card to Deck"
      >
        <form onSubmit={handleAddCardSubmit} className="space-y-4">
          <Input
            label="Front (Question / Prompt)"
            placeholder="e.g. What is the difference between TCP and UDP?"
            required
            value={newFront}
            onChange={(e) => setNewFront(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Back (Answer / Explanation)
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. TCP is connection-oriented and reliable with handshakes; UDP is connectionless..."
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm p-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <Input
            label="Optional Memory Hint"
            placeholder="e.g. Handshake vs Streaming"
            value={newHint}
            onChange={(e) => setNewHint(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddCardOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Card
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
