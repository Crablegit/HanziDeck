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

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [streak, setStreak] = useState<DailyStreakData>({ count: 1, lastCompletedDate: '', todayCompletedWords: 0 });
  const [settings, setSettings] = useState<UserProfile>(getStoredSettings());

  useEffect(() => {
    setDecks(getStoredDecks());
    const cards = getStoredCards();
    setTotalWords(cards.length);
    setStreak(getDailyStreak());
    setSettings(getStoredSettings());
  }, []);

  const t = getTranslations(settings.language || 'vi');
  const dailyProgressPercent = Math.min(
    100,
    Math.round((streak.todayCompletedWords / (settings.daily_goal || 10)) * 100)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden liquid-glass rounded-3xl p-6 sm:p-10 border border-white/20 shadow-glass-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-theme-text-muted">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Học Chữ Hán thông minh chuẩn Quizlet & Hanzii</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.home.heroTitle}{' '}
            <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              HanziDeck
            </span>
          </h1>

          <p className="text-base sm:text-lg text-theme-text-muted max-w-2xl leading-relaxed">
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/daily-stack"
              className="liquid-glass-btn px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.home.startLearning}</span>
            </Link>
            <Link
              href="/text-parser"
              className="px-5 py-3 rounded-2xl liquid-glass hover:bg-white/15 text-white border-theme-border font-medium text-sm flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-theme-secondary" />
              <span>{t.home.openParser}</span>
            </Link>
            <Link
              href="/dictionary"
              className="px-5 py-3 rounded-2xl liquid-glass hover:bg-white/15 text-white border-theme-border font-medium text-sm flex items-center gap-2 transition-all"
            >
              <Search className="w-4 h-4 text-cyan-300" />
              <span>Từ điển Hanzii</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stats & Daily Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Daily Goal Card */}
        <div className="md:col-span-2 liquid-glass-card rounded-3xl p-6 shadow-glass border border-white/15 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{t.home.todayProgress}</h3>
                <p className="text-xs text-theme-text-muted">
                  Đã học {streak.todayCompletedWords} / {settings.daily_goal} từ mục tiêu
                </p>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-300">
              {dailyProgressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <div className="w-full h-3.5 rounded-full bg-black/30 overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-theme-primary to-emerald-400 transition-all duration-500 shadow-sm"
                style={{ width: `${dailyProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-theme-text-muted">
              <span>Bắt đầu ngày mới</span>
              <Link href="/daily-stack" className="text-emerald-300 hover:underline flex items-center gap-1 font-medium">
                Vào Ngăn xếp học ngay <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Streak & Library Stats */}
        <div className="liquid-glass-card rounded-3xl p-6 shadow-glass border border-white/15 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{t.home.streak}</h3>
                <p className="text-xs text-theme-text-muted">Giữ vững phong độ hàng ngày</p>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-amber-300 font-mono tracking-tight">
              {streak.count}
            </span>
            <span className="text-sm text-theme-text-muted">{t.home.days} liên tiếp</span>
          </div>

          <div className="pt-2 border-t border-theme-border/40 text-xs text-theme-text-muted flex justify-between">
            <span>Tổng từ trong kho:</span>
            <span className="font-bold text-white font-mono">{totalWords} từ</span>
          </div>
        </div>
      </div>

      {/* Standard Decks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-theme-secondary" />
              <span>{t.home.hskDecks}</span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Luyện tập từ vựng chuẩn khung Hán ngữ Quốc tế
            </p>
          </div>
          <Link
            href="/decks"
            className="text-xs font-semibold text-emerald-300 hover:underline flex items-center gap-1"
          >
            Xem tất cả bộ thẻ <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="liquid-glass-card rounded-2xl p-5 border border-white/15 shadow-glass flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                    {deck.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-theme-text-muted shrink-0 border border-theme-border">
                    {deck.total_cards} thẻ
                  </span>
                </div>
                <p className="text-xs text-theme-text-muted line-clamp-2 leading-relaxed">
                  {deck.description}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme-border/40">
                <Link
                  href={`/decks/${deck.id}/study`}
                  className="px-3 py-2 rounded-xl liquid-glass hover:bg-white/20 text-center text-xs font-semibold text-white border border-theme-border flex items-center justify-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.home.startFlashcards}</span>
                </Link>
                <Link
                  href={`/decks/${deck.id}/quiz`}
                  className="px-3 py-2 rounded-xl liquid-glass hover:bg-white/20 text-center text-xs font-semibold text-white border border-theme-border flex items-center justify-center gap-1.5 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.home.startQuiz}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
