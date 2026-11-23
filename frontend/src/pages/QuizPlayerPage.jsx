import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuizById,
  submitQuizAttempt,
  clearCurrentQuiz,
} from '../features/quizzes/quizSlice';
import { addToast } from '../features/ui/uiSlice';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MarkdownView } from '../components/common/MarkdownView';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Clock,
} from 'lucide-react';

export const QuizPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentQuiz, lastAttemptResult, submitting, loading } = useSelector(
    (state) => state.quizzes
  );

  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: selectedOptionString }
  const [secondsSpent, setSecondsSpent] = useState(0);

  useEffect(() => {
    dispatch(clearCurrentQuiz());
    dispatch(fetchQuizById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (lastAttemptResult) return;
    const timer = setInterval(() => {
      setSecondsSpent((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastAttemptResult]);

  const handleSelectOption = (qIdx, option) => {
    if (lastAttemptResult) return; // already evaluated
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: option,
    });
  };

  const handleSubmit = async () => {
    if (!currentQuiz) return;
    const answersPayload = currentQuiz.questions.map((q, idx) => ({
      questionIndex: idx,
      selectedOption: selectedAnswers[idx] || '',
    }));

    const res = await dispatch(
      submitQuizAttempt({
        quizId: id,
        answers: answersPayload,
        timeSpentSeconds: secondsSpent,
      })
    );

    if (!res.error) {
      dispatch(addToast({ message: 'Quiz submitted and evaluated!', type: 'success' }));
    }
  };

  if (loading || !currentQuiz) {
    return (
      <div className="py-12 text-center text-sm text-neutral-400">
        Loading quiz questions...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/quizzes')}
        >
          All Quizzes
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {Math.floor(secondsSpent / 60)}:
              {secondsSpent % 60 < 10 ? '0' : ''}
              {secondsSpent % 60}
            </span>
          </div>

          <Badge variant="primary" size="sm">
            {currentQuiz.difficulty.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Quiz Evaluation Summary Banner if submitted */}
      {lastAttemptResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-md flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-300" />
              <h2 className="text-xl font-black">
                Score: {lastAttemptResult.score} / {lastAttemptResult.totalQuestions} ({lastAttemptResult.percentage}%)
              </h2>
            </div>
            <p className="text-xs text-emerald-100/80 mt-1">
              Review correct answers and AI explanations below.
            </p>
          </div>

          <Button
            onClick={() => {
              dispatch(clearCurrentQuiz());
              setSelectedAnswers({});
              setSecondsSpent(0);
              dispatch(fetchQuizById(id));
            }}
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            icon={RotateCcw}
          >
            Retake Quiz
          </Button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {currentQuiz.questions.map((q, idx) => {
          const userSelected = selectedAnswers[idx];
          const evaluatedAnswer = lastAttemptResult?.answers?.find(
            (a) => a.questionIndex === idx
          );

          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 mr-2">
                    Q{idx + 1}.
                  </span>
                  {q.question}
                </h3>

                {evaluatedAnswer && (
                  evaluatedAnswer.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = userSelected === opt;
                  let optionClass =
                    'border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300';

                  if (lastAttemptResult) {
                    if (opt === q.correctAnswer) {
                      optionClass =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                    } else if (isSelected && opt !== q.correctAnswer) {
                      optionClass =
                        'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-medium';
                    }
                  } else if (isSelected) {
                    optionClass =
                      'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20';
                  }

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(idx, opt)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${optionClass}`}
                    >
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {lastAttemptResult && q.explanation && (
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    Explanation:
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!lastAttemptResult && (
        <div className="flex justify-end pt-2 pb-8">
          <Button
            onClick={handleSubmit}
            variant="accent"
            size="lg"
            isLoading={submitting}
          >
            Submit Assessment
          </Button>
        </div>
      )}
    </div>
  );
};
