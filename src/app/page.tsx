'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  FileText,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Plus,
  Play,
  Award,
} from 'lucide-react';
import { getStoredDecks, getStoredCards, getDailyStreak, getStoredSettings, DailyStreakData } from '@/lib/storage';
import { getTranslations } from '@/lib/i18n';
import { Deck, UserProfile } from '@/types';
import OnboardingModal from '@/components/OnboardingModal';

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [streak, setStreak] = useState<DailyStreakData>({ count: 1, lastCompletedDate: '', todayCompletedWords: 0 });
  const [settings, setSettings] = useState<UserProfile>(getStoredSettings());

  useEffect(() => {
    loadData();

    const handleSettingsChanged = () => {
      loadData();
    };

    window.addEventListener('hanzideck_settings_changed', handleSettingsChanged);
    return () => window.removeEventListener('hanzideck_settings_changed', handleSettingsChanged);
  }, []);

  const loadData = () => {
    setDecks(getStoredDecks());
    const cards = getStoredCards();
    setTotalWords(cards.length);
    setStreak(getDailyStreak());
    setSettings(getStoredSettings());
  };

  const t = getTranslations(settings.language || 'vi');
  const dailyGoal = settings.daily_goal || 10;
  const dailyProgressPercent = Math.min(
    100,
    Math.round((streak.todayCompletedWords / dailyGoal) * 100)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Onboarding Dialog for new visitors */}
      <OnboardingModal onFinish={loadData} />

      {/* Minimalist Apple Hero Header */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 shadow-glass space-y-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Học Chữ Hán thông minh chuẩn HSK 3.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Làm chủ Tiếng Trung với <span className="text-sky-300">HanziDeck</span>
          </h1>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed">
            Flashcard 3D không rung giật, từ điển phân tích bộ thủ, bóc tách từ tự động theo trình độ HSK của bạn và trợ lý AI Gemini.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/daily-stack"
            className="liquid-glass-btn px-5 py-2.5 rounded-2xl font-semibold text-xs flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Học theo mục tiêu hôm nay</span>
          </Link>
          <Link
            href="/text-parser"
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-medium flex items-center gap-2 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Bóc tách đoạn văn</span>
          </Link>
          <Link
            href="/dictionary"
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-medium flex items-center gap-2 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-white/70" />
            <span>Từ điển Hanzii</span>
          </Link>
          <Link
            href="/ai-coach"
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-sky-300 border border-white/10 text-xs font-medium flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trợ lý AI Gemini</span>
          </Link>
        </div>
      </div>

      {/* Overview Stats & Daily Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Goal Card */}
        <div className="md:col-span-2 liquid-glass-card rounded-3xl p-6 border border-white/10 shadow-glass flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Tiến độ hôm nay</h3>
                <p className="text-xs text-white/50">
                  Đã hoàn thành {streak.todayCompletedWords} / {dailyGoal} từ mục tiêu
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold font-mono text-sky-300">
              {dailyProgressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${dailyProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Mục tiêu: {dailyGoal} từ/ngày</span>
              <Link href="/daily-stack" className="text-sky-400 hover:underline flex items-center gap-1">
                Vào Ngăn xếp học tiếp <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="liquid-glass-card rounded-3xl p-6 border border-white/10 shadow-glass flex flex-col justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Chuỗi ngày học</h3>
              <p className="text-xs text-white/50">Giữ vững phong độ</p>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-amber-300 font-mono">
              {streak.count}
            </span>
            <span className="text-xs text-white/60">ngày liên tiếp</span>
          </div>

          <div className="pt-2 border-t border-white/5 text-xs text-white/50 flex justify-between">
            <span>Kho từ vựng:</span>
            <span className="font-semibold text-white font-mono">{totalWords} từ</span>
          </div>
        </div>
      </div>

      {/* Your Decks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Bộ thẻ từ vựng của bạn</span>
            </h2>
            <p className="text-xs text-white/50">
              Các bộ từ vựng luyện tập dạng Flashcard 3D và Trắc nghiệm
            </p>
          </div>
          <Link
            href="/decks"
            className="text-xs font-medium text-sky-400 hover:underline flex items-center gap-1"
          >
            Quản lý tất cả bộ thẻ <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="liquid-glass-card rounded-2xl p-5 border border-white/10 shadow-glass flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white text-sm group-hover:text-sky-300 transition-colors line-clamp-1">
                    {deck.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] font-mono text-white/60 shrink-0 border border-white/10">
                    {deck.total_cards} thẻ
                  </span>
                </div>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {deck.description}
                </p>
              </div>

              {/* Study links */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <Link
                  href={`/decks/${deck.id}/study`}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-center text-xs font-semibold text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-300" />
                  <span>Học Thẻ</span>
                </Link>
                <Link
                  href={`/decks/${deck.id}/quiz`}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-center text-xs font-semibold text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Trắc nghiệm</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
