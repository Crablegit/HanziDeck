'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, CheckCircle2, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStoredDecks, getStoredCards, recordCompletedWord } from '@/lib/storage';
import Flashcard from '@/components/Flashcard';
import { Card, Deck } from '@/types';
import confetti from 'canvas-confetti';

export default function FlashcardStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const deckId = resolvedParams.id;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const allDecks = getStoredDecks();
    const d = allDecks.find((x) => x.id === deckId);
    if (d) setDeck(d);

    const allCards = getStoredCards();
    const deckCards = allCards.filter((c) => c.deck_id === deckId);
    setCards(deckCards);
  }, [deckId]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishSession();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMastered = () => {
    setMasteredCount((prev) => prev + 1);
    recordCompletedWord();
    handleNext();
  };

  const handleReview = () => {
    handleNext();
  };

  const finishSession = () => {
    setIsCompleted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setMasteredCount(0);
    setIsCompleted(false);
  };

  if (!deck || cards.length === 0) {
    return (
      <div className="max-w-md mx-auto liquid-glass rounded-3xl p-8 text-center space-y-4 my-12">
        <p className="text-theme-text-muted">Bộ thẻ này chưa có từ vựng nào để học.</p>
        <Link href={`/decks/${deckId}`} className="liquid-glass-btn px-4 py-2 rounded-xl text-xs inline-block">
          Quay lại thêm từ vựng
        </Link>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/decks/${deckId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-theme-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát ra {deck.title}</span>
        </Link>

        {/* Card counter */}
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="font-bold text-white">{currentIndex + 1}</span>
          <span className="text-theme-text-muted">/</span>
          <span className="text-theme-text-muted">{cards.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden border border-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-theme-primary to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          <Flashcard
            card={currentCard}
            currentIndex={currentIndex}
            totalCards={cards.length}
            onMastered={handleMastered}
            onReview={handleReview}
            onNext={handleNext}
            onPrev={handlePrev}
          />

          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-4 text-theme-text-muted text-xs">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-xl liquid-glass hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <span className="opacity-70">Nhấn phím mũi tên [←] [→] để chuyển từ</span>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl liquid-glass hover:bg-white/15 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      ) : (
        /* Completed Screen */
        <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto shadow-glass-lg border border-white/20 my-8">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center border border-amber-400/30">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Xuất sắc! Đã hoàn thành</h2>
            <p className="text-sm text-theme-text-muted">
              Bạn vừa học xong toàn bộ {cards.length} từ trong bộ <strong>{deck.title}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/20 border border-theme-border/40 flex items-center justify-around text-center">
            <div>
              <span className="text-xs text-theme-text-muted block">Tổng từ</span>
              <span className="text-xl font-bold text-white font-mono">{cards.length}</span>
            </div>
            <div className="h-8 w-px bg-theme-border/40" />
            <div>
              <span className="text-xs text-emerald-300 block">Đã thuộc</span>
              <span className="text-xl font-bold text-emerald-300 font-mono">{masteredCount}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl liquid-glass hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-2 border border-theme-border"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Học lại lần nữa</span>
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
