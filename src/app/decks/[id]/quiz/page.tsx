'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { getStoredDecks, getStoredCards, recordCompletedWord } from '@/lib/storage';
import QuizCard from '@/components/QuizCard';
import { Card, Deck, QuizQuestion } from '@/types';
import confetti from 'canvas-confetti';

export default function DeckQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const deckId = resolvedParams.id;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const allDecks = getStoredDecks();
    const d = allDecks.find((x) => x.id === deckId);
    if (d) setDeck(d);

    const allCards = getStoredCards();
    const deckCards = allCards.filter((c) => c.deck_id === deckId);

    if (deckCards.length > 0) {
      generateQuizQuestions(deckCards, allCards);
    }
  }, [deckId]);

  const generateQuizQuestions = (deckCards: Card[], allCards: Card[]) => {
    const generated: QuizQuestion[] = [];
    const questionTypes: Array<'hanzi_to_meaning' | 'meaning_to_hanzi' | 'audio_to_hanzi'> = [
      'hanzi_to_meaning',
      'meaning_to_hanzi',
      'audio_to_hanzi',
    ];

    deckCards.forEach((card, index) => {
      const type = questionTypes[index % questionTypes.length];
      let correctAnswer = '';
      let wrongPool: string[] = [];

      if (type === 'hanzi_to_meaning') {
        correctAnswer = card.meaning_vi;
        wrongPool = allCards
          .filter((c) => c.id !== card.id)
          .map((c) => c.meaning_vi);
      } else {
        correctAnswer = card.hanzi;
        wrongPool = allCards
          .filter((c) => c.id !== card.id)
          .map((c) => c.hanzi);
      }

      // Shuffle wrong options
      const shuffledWrong = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3);
      // Fallback if not enough cards
      while (shuffledWrong.length < 3) {
        shuffledWrong.push(`Từ vựng mẫu ${shuffledWrong.length + 1}`);
      }

      const options = [correctAnswer, ...shuffledWrong].sort(() => 0.5 - Math.random());

      generated.push({
        id: `q-${index}`,
        card,
        type,
        prompt: card.hanzi,
        correctAnswer,
        options,
      });
    });

    setQuestions(generated);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
      recordCompletedWord();
    }

    // Auto advance after 1.5s
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        finishQuiz();
      }
    }, 1200);
  };

  const finishQuiz = () => {
    setIsFinished(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    const allCards = getStoredCards();
    const deckCards = allCards.filter((c) => c.deck_id === deckId);
    generateQuizQuestions(deckCards, allCards);
  };

  if (!deck || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto liquid-glass rounded-3xl p-8 text-center space-y-4 my-12">
        <p className="text-theme-text-muted">Không đủ từ vựng để tạo bài trắc nghiệm.</p>
        <Link href={`/decks/${deckId}`} className="liquid-glass-btn px-4 py-2 rounded-xl text-xs inline-block">
          Quay lại bộ thẻ
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const accuracyPercent = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/decks/${deckId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-theme-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát ra {deck.title}</span>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-emerald-300 font-bold">
            Điểm: {score}
          </span>
          <span className="text-theme-text-muted font-mono">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden border border-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-theme-primary to-amber-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {!isFinished ? (
        <QuizCard
          key={currentQ.id}
          question={currentQ}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      ) : (
        /* Quiz Finished Screen */
        <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto shadow-glass-lg border border-white/20 my-8">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center border border-amber-400/30">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Hoàn thành bài thi!</h2>
            <p className="text-sm text-theme-text-muted">
              Kết quả luyện trắc nghiệm bộ từ: <strong>{deck.title}</strong>
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/25 border border-theme-border/50 grid grid-cols-2 gap-4 text-center">
            <div>
              <span className="text-xs text-theme-text-muted block mb-1">Điểm đúng</span>
              <span className="text-3xl font-black text-emerald-300 font-mono">
                {score} / {questions.length}
              </span>
            </div>
            <div>
              <span className="text-xs text-theme-text-muted block mb-1">Độ chính xác</span>
              <span className="text-3xl font-black text-amber-300 font-mono">
                {accuracyPercent}%
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl liquid-glass hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 border border-theme-border"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại bài này</span>
            </button>
            <Link
              href={`/decks/${deck.id}`}
              className="w-full sm:w-auto liquid-glass-btn px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Quay lại bộ thẻ</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
