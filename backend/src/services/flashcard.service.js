import { FlashcardDeck } from '../models/FlashcardDeck.js';
import { Flashcard } from '../models/Flashcard.js';
import { Note } from '../models/Note.js';
import { Document } from '../models/Document.js';
import { ApiError } from '../middleware/error.middleware.js';
import { getGeminiModel } from './gemini.service.js';

export const createDeck = async (userId, { title, description, folder, document, note, tags }) => {
  if (!title || !title.trim()) {
    throw new ApiError(400, 'Deck title is required.');
  }

  const deck = await FlashcardDeck.create({
    title: title.trim(),
    description: description || '',
    folder: folder || null,
    document: document || null,
    note: note || null,
    tags: Array.isArray(tags) ? tags : [],
    user: userId,
  });

  return deck;
};

export const getDecks = async (userId) => {
  const decks = await FlashcardDeck.find({ user: userId })
    .populate('note', 'title')
    .populate('document', 'title')
    .sort({ updatedAt: -1 });

  return decks;
};

export const getDeckById = async (userId, deckId) => {
  const deck = await FlashcardDeck.findOne({ _id: deckId, user: userId })
    .populate('note', 'title')
    .populate('document', 'title');

  if (!deck) {
    throw new ApiError(404, 'Flashcard deck not found.');
  }

  const cards = await Flashcard.find({ deck: deckId, user: userId }).sort({ createdAt: 1 });

  return {
    deck,
    cards,
  };
};

export const deleteDeck = async (userId, deckId) => {
  const deck = await FlashcardDeck.findOneAndDelete({ _id: deckId, user: userId });
  if (!deck) {
    throw new ApiError(404, 'Flashcard deck not found.');
  }

  await Flashcard.deleteMany({ deck: deckId });
  return true;
};

export const addCard = async (userId, deckId, { front, back, hint, difficulty }) => {
  const deck = await FlashcardDeck.findOne({ _id: deckId, user: userId });
  if (!deck) {
    throw new ApiError(404, 'Flashcard deck not found.');
  }

  if (!front || !back) {
    throw new ApiError(400, 'Both front and back content are required.');
  }

  const card = await Flashcard.create({
    deck: deckId,
    user: userId,
    front,
    back,
    hint: hint || '',
    difficulty: difficulty || 'medium',
  });

  deck.cardCount += 1;
  await deck.save();

  return card;
};

export const reviewCard = async (userId, cardId, { status }) => {
  const card = await Flashcard.findOne({ _id: cardId, user: userId });
  if (!card) {
    throw new ApiError(404, 'Flashcard not found.');
  }

  card.reviewCount += 1;
  card.lastReviewedAt = new Date();
  card.status = status;

  if (status === 'known') {
    card.intervalDays = Math.max(1, Math.round(card.intervalDays * card.easeFactor));
    card.easeFactor = Math.min(3.0, card.easeFactor + 0.1);
  } else {
    card.intervalDays = 1;
    card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + card.intervalDays);
  card.nextReviewDate = nextDate;

  await card.save();
  return card;
};

export const generateCardsWithAi = async (userId, { deckId, noteId, documentId, topic, count = 5 }) => {
  let sourceText = '';
  let deckTitle = topic || 'AI Generated Deck';

  if (noteId) {
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (note) {
      sourceText = `Title: ${note.title}\nContent:\n${note.content}`;
      deckTitle = `Flashcards: ${note.title}`;
    }
  } else if (documentId) {
    const doc = await Document.findOne({ _id: documentId, user: userId });
    if (doc) {
      sourceText = `Document: ${doc.title}`;
      deckTitle = `Flashcards: ${doc.title}`;
    }
  } else if (topic) {
    sourceText = `Topic: ${topic}`;
  }

  if (!sourceText) {
    throw new ApiError(400, 'Please provide a note, document, or topic to generate flashcards.');
  }

  const model = getGeminiModel();
  if (!model) {
    throw new ApiError(503, 'Gemini AI is not available to generate flashcards.');
  }

  const prompt = `Generate exactly ${count} high-yield study flashcards based on this material:
${sourceText}

Return ONLY a strict JSON array of objects with keys: "front", "back", "hint", "difficulty" (easy/medium/hard).
Do not wrap in markdown quotes if possible, or use standard \`\`\`json markdown code blocks.
Example:
[
  {
    "front": "What is the primary function of the mitochondria?",
    "back": "To generate most of the chemical energy needed to power the cell's biochemical reactions through ATP production.",
    "hint": "Powerhouse of the cell",
    "difficulty": "easy"
  }
]`;

  try {
    const response = await model.generateContent(prompt);
    let rawText = response.response.text().trim();
    rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    const parsedCards = JSON.parse(rawText);

    let targetDeck = null;
    if (deckId) {
      targetDeck = await FlashcardDeck.findOne({ _id: deckId, user: userId });
    }

    if (!targetDeck) {
      targetDeck = await FlashcardDeck.create({
        title: deckTitle,
        description: `AI-generated flashcards for ${deckTitle}`,
        user: userId,
        note: noteId || null,
        document: documentId || null,
      });
    }

    const cardsToInsert = parsedCards.map((c) => ({
      deck: targetDeck._id,
      user: userId,
      front: c.front,
      back: c.back,
      hint: c.hint || '',
      difficulty: c.difficulty || 'medium',
      status: 'learning',
    }));

    const inserted = await Flashcard.insertMany(cardsToInsert);
    targetDeck.cardCount += inserted.length;
    await targetDeck.save();

    return {
      deck: targetDeck,
      cards: inserted,
    };
  } catch (err) {
    console.error('[Flashcard AI Generation Error]:', err.message);
    throw new ApiError(500, `Failed to generate flashcards with AI: ${err.message}`);
  }
};
