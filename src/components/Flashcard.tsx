'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/types';
import AudioPlayer from './AudioPlayer';
import { RotateCw, Check, RefreshCw } from 'lucide-react';
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
      {/* 3D Perspective Card Container - Steady, no hover animation */}
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
          <div className="absolute inset-0 w-full h-full backface-hidden flashcard-face rounded-3xl p-8 sm:p-10 flex flex-col justify-between items-center text-center">
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-xs text-white/50">
              <div className="flex items-center gap-2">
                {card.hsk_level && (
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 font-semibold text-white/90">
                    HSK {card.hsk_level}
                  </span>
                )}
                {card.stroke_count && (
                  <span className="opacity-70 font-mono text-[11px]">
                    {card.stroke_count} nét
                  </span>
                )}
              </div>
              <span className="opacity-60 font-mono text-xs">
                {currentIndex !== undefined && totalCards !== undefined
                  ? `${currentIndex + 1} / ${totalCards}`
                  : ''}
              </span>
            </div>

            {/* Center: Large Hanzi */}
            <div className="flex flex-col items-center justify-center gap-4 my-auto">
              <h1 className="text-7xl sm:text-8xl font-bold tracking-tight text-white font-chinese drop-shadow-sm">
                {card.hanzi}
              </h1>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <AudioPlayer text={card.hanzi} audioUrl={card.audio_url} size="md" />
              </div>
            </div>

            {/* Bottom Hint */}
            <div className="w-full flex items-center justify-center gap-2 text-xs text-white/40">
              <RotateCw className="w-3 h-3" />
              <span>Nhấp chuột hoặc phím [Space] để lật mặt sau</span>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden flashcard-face flashcard-face-back rotate-y-180 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left overflow-y-auto">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white font-chinese">{card.hanzi}</span>
                <span className="text-xl font-semibold text-sky-300 font-mono">{card.pinyin}</span>
                {card.han_viet && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-white/70">
                    Hán Việt: <strong className="text-white font-medium">{card.han_viet}</strong>
                  </span>
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <AudioPlayer text={card.hanzi} audioUrl={card.audio_url} size="sm" />
              </div>
            </div>

            {/* Meaning Section */}
            <div className="my-auto space-y-3 py-2">
              <div>
                <label className="text-[11px] uppercase font-semibold tracking-wider text-white/40 block mb-1">
                  Ý nghĩa tiếng Việt:
                </label>
                <p className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                  {card.meaning_vi}
                </p>
                {card.meaning_en && (
                  <p className="text-xs text-white/50 mt-0.5">{card.meaning_en}</p>
                )}
              </div>

              {/* Radicals & Components */}
              {card.radical && (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="text-sky-300 font-medium">Bộ thủ & cấu tạo: </span>
                  <span className="text-white/70">{card.radical}</span>
                </div>
              )}

              {/* Examples */}
              {card.examples && card.examples.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] uppercase font-semibold tracking-wider text-white/40 block">
                    Ví dụ câu:
                  </label>
                  {card.examples.slice(0, 2).map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm font-chinese">{ex.hanzi}</span>
                        <div onClick={(e) => e.stopPropagation()}>
                          <AudioPlayer text={ex.hanzi} size="sm" />
                        </div>
                      </div>
                      <p className="text-sky-300/90 font-mono text-[11px]">{ex.pinyin}</p>
                      <p className="text-white/70">{ex.meaning_vi}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="flex items-center justify-between text-[11px] text-white/40 border-t border-white/10 pt-2">
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
            className="flex-1 max-w-[180px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-medium text-xs transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cần ôn lại</span>
          </button>
        )}
        {onMastered && (
          <button
            type="button"
            onClick={onMastered}
            className="flex-1 max-w-[180px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl liquid-glass-btn font-semibold text-xs transition-all active:scale-95"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Đã thuộc</span>
          </button>
        )}
      </div>
    </div>
  );
}
