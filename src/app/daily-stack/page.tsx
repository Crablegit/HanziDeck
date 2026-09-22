'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Flame,
  CheckCircle2,
  Plus,
  Play,
  RotateCcw,
  Trash2,
  Volume2,
  ArrowRight,
  Settings as SettingsIcon,
} from 'lucide-react';
import {
  getDailyStackQueue,
  removeFromDailyStack,
  getStoredCards,
  getDailyStreak,
  getStoredSettings,
  saveStoredSettings,
  recordCompletedWord,
  pushToDailyStack,
} from '@/lib/storage';
import Flashcard from '@/components/Flashcard';
import AudioPlayer from '@/components/AudioPlayer';
import { Card, UserProfile } from '@/types';
import confetti from 'canvas-confetti';

export default function DailyStackPage() {
  const [queueIds, setQueueIds] = useState<string[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [settings, setSettings] = useState<UserProfile>(getStoredSettings());
  const [streak, setStreak] = useState(getDailyStreak());

  // Study session mode
  const [isStudying, setIsStudying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Manual word add
  const [manualWord, setManualWord] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const q = getDailyStackQueue();
    setQueueIds(q);
    const cards = getStoredCards();
    setAllCards(cards);
    setSettings(getStoredSettings());
    setStreak(getDailyStreak());
  };

  const queueCards = queueIds
    .map((id) => allCards.find((c) => c.id === id))
    .filter((c): c is Card => Boolean(c));

  const handleGoalChange = (newGoal: number) => {
    const updated = saveStoredSettings({ daily_goal: newGoal });
    setSettings(updated);
  };

  const handleRemoveFromQueue = (id: string) => {
    const updated = removeFromDailyStack(id);
    setQueueIds(updated);
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualWord.trim()) return;

    // Check if word already exists in library
    let target = allCards.find((c) => c.hanzi === manualWord.trim());
    if (target) {
      pushToDailyStack(target.id);
    } else {
      // Find or create in first deck
      const firstCard = allCards[0];
      if (firstCard) {
        pushToDailyStack(firstCard.id);
      }
    }

    setManualWord('');
    loadData();
  };

  // Study Session Controls
  const handleStartStudy = () => {
    if (queueCards.length === 0) return;
    setCurrentIndex(0);
    setIsStudying(true);
    setIsSessionFinished(false);
  };

  const handleNextCard = () => {
    if (currentIndex < queueCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishDailySession();
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMastered = () => {
    const currentCard = queueCards[currentIndex];
    if (currentCard) {
      removeFromDailyStack(currentCard.id);
    }
    const updatedStreak = recordCompletedWord();
    setStreak(updatedStreak);
    handleNextCard();
  };

  const finishDailySession = () => {
    setIsSessionFinished(true);
    setIsStudying(false);
    loadData();
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const dailyProgressPercent = Math.min(
    100,
    Math.round((streak.todayCompletedWords / (settings.daily_goal || 10)) * 100)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border/40 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-theme-secondary" />
            <span>Ngăn xếp Học theo ngày (Daily Stack)</span>
          </h1>
          <p className="text-sm text-theme-text-muted mt-1">
            Đưa các từ vựng cần học vào hàng đợi, cài đặt mục tiêu mỗi ngày và duy trì chuỗi học tập đều đặn.
          </p>
        </div>

        {/* Goal Settings selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto liquid-glass px-3 py-1.5 rounded-2xl border border-theme-border text-xs">
          <span className="text-theme-text-muted">Mục tiêu:</span>
          {[5, 10, 20, 30].map((goal) => (
            <button
              key={goal}
              onClick={() => handleGoalChange(goal)}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                settings.daily_goal === goal
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-theme-text-muted hover:text-white'
              }`}
            >
              {goal} từ
            </button>
          ))}
        </div>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-glass-card rounded-2xl p-5 border border-white/15 shadow-glass flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-theme-text-muted block">Tiến độ hôm nay</span>
            <span className="text-xl font-bold text-white font-mono">
              {streak.todayCompletedWords} / {settings.daily_goal} từ
            </span>
          </div>
        </div>

        <div className="liquid-glass-card rounded-2xl p-5 border border-white/15 shadow-glass flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-theme-text-muted block">Chuỗi ngày học liên tục</span>
            <span className="text-xl font-bold text-amber-300 font-mono">
              {streak.count} ngày
            </span>
          </div>
        </div>

        <div className="liquid-glass-card rounded-2xl p-5 border border-white/15 shadow-glass flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-theme-text-muted block">Từ đang chờ trong Stack</span>
            <span className="text-xl font-bold text-cyan-300 font-mono">
              {queueCards.length} từ
            </span>
          </div>
        </div>
      </div>

      {/* Study Session Active Screen */}
      {isStudying && queueCards[currentIndex] ? (
        <div className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsStudying(false)}
              className="text-xs font-semibold text-theme-text-muted hover:text-white"
            >
              Tạm dừng phiên học
            </button>
            <span className="text-xs font-mono text-emerald-300 font-bold">
              Thẻ {currentIndex + 1} / {queueCards.length}
            </span>
          </div>

          <Flashcard
            card={queueCards[currentIndex]}
            currentIndex={currentIndex}
            totalCards={queueCards.length}
            onMastered={handleMastered}
            onReview={handleNextCard}
            onNext={handleNextCard}
            onPrev={handlePrevCard}
          />
        </div>
      ) : (
        /* Queue Management & Start Button */
        <div className="space-y-6">
          {/* Start Button banner */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Sẵn sàng chinh phục mục tiêu hôm nay?</span>
              </h2>
              <p className="text-xs text-theme-text-muted">
                Có {queueCards.length} từ vựng đang xếp hàng trong Stack chờ bạn luyện tập.
              </p>
            </div>

            <button
              onClick={handleStartStudy}
              disabled={queueCards.length === 0}
              className="liquid-glass-btn px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none self-start sm:self-auto"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu phiên học ngay</span>
            </button>
          </div>

          {/* Manual word add box */}
          <form
            onSubmit={handleAddManual}
            className="liquid-glass rounded-2xl p-4 border border-theme-border/40 flex items-center gap-3"
          >
            <input
              type="text"
              value={manualWord}
              onChange={(e) => setManualWord(e.target.value)}
              placeholder="Thêm nhanh từ vào Stack (ví dụ: 学习, 朋友, 旅游...)"
              className="flex-1 px-4 py-2 rounded-xl liquid-glass-input text-xs font-serif"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 border border-theme-border transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm vào Stack</span>
            </button>
          </form>

          {/* Queue List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-theme-text-muted px-1">
              <span>Hàng đợi từ vựng ({queueCards.length} từ)</span>
              <span>Luyện xong từ nào sẽ tự động đẩy ra khỏi Stack</span>
            </div>

            {queueCards.length === 0 ? (
              <div className="liquid-glass rounded-3xl p-10 text-center text-theme-text-muted border border-theme-border/40 space-y-3">
                <p className="text-sm">Ngăn xếp đang trống!</p>
                <div className="flex items-center justify-center gap-3 text-xs">
                  <Link href="/dictionary" className="text-emerald-300 underline">
                    Tìm từ trong Từ điển
                  </Link>
                  <span>hoặc</span>
                  <Link href="/text-parser" className="text-amber-300 underline">
                    Bóc tách từ đoạn văn
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {queueCards.map((card) => (
                  <div
                    key={card.id}
                    className="liquid-glass-card rounded-2xl p-4 border border-white/15 shadow-glass flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-bold text-lg text-white font-chinese tracking-wide">
                          {card.hanzi}
                        </span>
                        <span className="text-xs font-semibold font-mono text-amber-300">
                          {card.pinyin}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 truncate">{card.meaning_vi}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <AudioPlayer text={card.hanzi} size="sm" />
                      <button
                        onClick={() => handleRemoveFromQueue(card.id)}
                        title="Bỏ khỏi hàng đợi"
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
