import { Note } from '../models/Note.js';
import { Folder } from '../models/Folder.js';
import { Document } from '../models/Document.js';
import { FlashcardDeck } from '../models/FlashcardDeck.js';
import { Flashcard } from '../models/Flashcard.js';
import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { StudyRoom } from '../models/StudyRoom.js';

export const getDashboardAnalytics = async (userId) => {
  // 1. Fetch counts
  const [
    totalNotes,
    totalFolders,
    totalDocuments,
    totalDecks,
    totalCards,
    totalQuizzes,
    totalAttempts,
    myRoomsCount,
  ] = await Promise.all([
    Note.countDocuments({ user: userId, isArchived: false }),
    Folder.countDocuments({ user: userId }),
    Document.countDocuments({ user: userId }),
    FlashcardDeck.countDocuments({ user: userId }),
    Flashcard.countDocuments({ user: userId }),
    Quiz.countDocuments({ user: userId }),
    QuizAttempt.countDocuments({ user: userId }),
    StudyRoom.countDocuments({ 'members.user': userId, active: true }),
  ]);

  // 2. Fetch Recent Notes & Documents
  const [recentNotes, recentDocuments, recentAttempts] = await Promise.all([
    Note.find({ user: userId, isArchived: false })
      .populate('folder', 'name color')
      .sort({ updatedAt: -1 })
      .limit(5),
    Document.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    QuizAttempt.find({ user: userId })
      .populate('quiz', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  // 3. Performance metrics
  const attempts = await QuizAttempt.find({ user: userId });
  let averageScore = 0;
  const weakTopicsSet = new Set();

  if (attempts.length > 0) {
    const totalScorePct = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
    averageScore = Math.round(totalScorePct / attempts.length);

    attempts.forEach((att) => {
      if (att.weakTopics && Array.isArray(att.weakTopics)) {
        att.weakTopics.forEach((topic) => weakTopicsSet.add(topic));
      }
    });
  }

  // 4. Flashcard Mastery Stats
  const [knownCards, revisionCards, learningCards] = await Promise.all([
    Flashcard.countDocuments({ user: userId, status: 'known' }),
    Flashcard.countDocuments({ user: userId, status: 'needs_revision' }),
    Flashcard.countDocuments({ user: userId, status: 'learning' }),
  ]);

  return {
    metrics: {
      totalNotes,
      totalFolders,
      totalDocuments,
      totalDecks,
      totalCards,
      totalQuizzes,
      totalAttempts,
      myRoomsCount,
      averageScore,
      masteryRate: totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0,
    },
    flashcardBreakdown: {
      known: knownCards,
      needsRevision: revisionCards,
      learning: learningCards,
    },
    recentNotes,
    recentDocuments,
    recentAttempts,
    weakTopics: Array.from(weakTopicsSet).slice(0, 5),
  };
};
