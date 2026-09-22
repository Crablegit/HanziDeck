'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/types';
import AudioPlayer from './AudioPlayer';
import { RotateCw, Check, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import { playChineseAudio } from '@/lib/tts';

interface FlashcardProps {
  card: Card;
  onMastered?: () => void;
  onReview?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalCards?: number;
}

export default function Flashcard({
  card,
  onMastered,
  onReview,
  onNext,
  onPrev,
  currentIndex,
  totalCards,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight' && onNext) {
        e.preventDefault();
        onNext();
      } else if (e.code === 'ArrowLeft' && onPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        playChineseAudio(card.hanzi, card.audio_url);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, onNext, onPrev]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 select-none">
      {/* 3D Perspective Card Container */}
      <div
        className="w-full h-[420px] sm:h-[460px] perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= FRONT FACE ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden liquid-glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between items-center text-center shadow-glass-lg border border-white/20">
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-xs text-theme-text-muted">
              <div className="flex items-center gap-2">
                {card.hsk_level && (
                  <span className="px-2.5 py-1 rounded-full bg-theme-primary/30 border border-theme-border font-bold text-white tracking-wide">
                    HSK {card.hsk_level}
                  </span>
                )}
                {card.stroke_count && (
                  <span className="opacity-80">
                    {card.stroke_count} nét
                  </span>
                )}
              </div>
              <span className="opacity-70 font-mono">
                {currentIndex !== undefined && totalCards !== undefined
                  ? `${currentIndex + 1} / ${totalCards}`
                  : ''}
              </span>
            </div>

            {/* Center: Large Hanzi */}
            <div className="flex flex-col items-center justify-center gap-4 my-auto">
              <h1 className="text-7xl sm:text-8xl font-bold tracking-tight text-white drop-shadow-md font-serif">
                {card.hanzi}
              </h1>
              <div className="flex items-center gap-2">
                <AudioPlayer text={card.hanzi} audioUrl={card.audio_url} size="md" />
              </div>
            </div>

            {/* Bottom Hint */}
            <div className="w-full flex items-center justify-center gap-2 text-xs text-theme-text-muted opacity-70">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Nhấp chuột hoặc nhấn [Space] để lật mặt sau</span>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 liquid-glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-glass-lg border border-theme-secondary/40 text-left overflow-y-auto">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-theme-border/50 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white font-serif">{card.hanzi}</span>
                <span className="text-xl font-semibold text-amber-300 font-mono">{card.pinyin}</span>
                {card.han_viet && (
                  <span className="text-sm px-2 py-0.5 rounded-md bg-white/10 text-theme-text-muted">
                    Hán Việt: <strong className="text-white">{card.han_viet}</strong>
                  </span>
                )}
              </div>
              <AudioPlayer text={card.hanzi} audioUrl={card.audio_url} size="sm" />
            </div>

            {/* Meaning Section */}
            <div className="my-auto space-y-3 py-2">
              <div>
                <label className="text-xs uppercase font-semibold tracking-wider text-theme-text-muted opacity-80 block mb-1">
                  Ý nghĩa tiếng Việt:
                </label>
                <p className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {card.meaning_vi}
                </p>
                {card.meaning_en && (
                  <p className="text-sm text-theme-text-muted mt-0.5">{card.meaning_en}</p>
                )}
              </div>

              {/* Radicals & Components */}
              {card.radical && (
                <div className="p-2.5 rounded-xl bg-black/20 border border-theme-border/60 text-xs">
                  <span className="text-amber-300 font-semibold">Bộ thủ & cấu tạo: </span>
                  <span className="text-theme-text-muted">{card.radical}</span>
                </div>
              )}

              {/* Examples */}
              {card.examples && card.examples.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs uppercase font-semibold tracking-wider text-theme-text-muted opacity-80 block">
                    Ví dụ câu:
                  </label>
                  {card.examples.slice(0, 2).map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/5 border border-theme-border/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{ex.hanzi}</span>
                        <AudioPlayer text={ex.hanzi} size="sm" />
                      </div>
                      <p className="text-amber-300/90 font-mono text-[11px]">{ex.pinyin}</p>
                      <p className="text-theme-text-muted">{ex.meaning_vi}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="flex items-center justify-between text-xs text-theme-text-muted border-t border-theme-border/50 pt-2 opacity-80">
              <span>Lật lại mặt trước [Space]</span>
              <span>Chuyển từ [←] [→]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 w-full justify-center">
        {onReview && (
          <button
            type="button"
            onClick={onReview}
            className="flex-1 max-w-[180px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-medium text-sm transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Cần ôn lại</span>
          </button>
        )}
        {onMastered && (
          <button
            type="button"
            onClick={onMastered}
            className="flex-1 max-w-[180px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl liquid-glass-btn font-semibold text-sm transition-all active:scale-95"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Đã thuộc</span>
          </button>
        )}
      </div>
    </div>
  );
}
