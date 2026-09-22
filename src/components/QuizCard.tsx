'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/types';
import AudioPlayer from './AudioPlayer';
import { CheckCircle2, XCircle, ArrowRight, Volume2 } from 'lucide-react';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
  currentIndex: number;
  totalQuestions: number;
}

export default function QuizCard({
  question,
  onAnswer,
  currentIndex,
  totalQuestions,
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
    setIsSubmitted(true);
    const correct = option === question.correctAnswer;
    onAnswer(correct);
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto liquid-glass-card rounded-3xl p-6 sm:p-10 shadow-glass-lg border border-white/20 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-theme-text-muted border-b border-theme-border/50 pb-3">
        <span className="font-semibold uppercase tracking-wider text-theme-secondary">
          {question.type === 'hanzi_to_meaning'
            ? 'Chữ Hán → Nghĩa'
            : question.type === 'meaning_to_hanzi'
            ? 'Nghĩa → Chữ Hán'
            : 'Nghe phát âm → Chữ Hán'}
        </span>
        <span className="font-mono font-bold">
          Câu {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Question Prompt */}
      <div className="flex flex-col items-center justify-center text-center py-4 gap-3">
        {question.type === 'audio_to_hanzi' ? (
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm text-theme-text-muted">Bấm loa để nghe phát âm từ vựng:</span>
            <AudioPlayer text={question.card.hanzi} size="lg" />
            <span className="text-xl font-mono text-amber-300 font-bold">{question.card.pinyin}</span>
          </div>
        ) : question.type === 'hanzi_to_meaning' ? (
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-6xl sm:text-7xl font-bold font-serif text-white tracking-wide">
              {question.card.hanzi}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono text-amber-300">{question.card.pinyin}</span>
              <AudioPlayer text={question.card.hanzi} size="sm" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-theme-text-muted">
              Chọn Chữ Hán tương ứng với nghĩa:
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
              {question.card.meaning_vi}
            </h2>
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {question.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          let btnStyle = 'liquid-glass hover:bg-white/15 border-theme-border text-white';

          if (isSubmitted) {
            if (option === question.correctAnswer) {
              btnStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-100 shadow-md';
            } else if (option === selectedOption) {
              btnStyle = 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-md';
            } else {
              btnStyle = 'opacity-40 border-transparent text-theme-text-muted';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleSelect(option)}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left font-medium transition-all ${btnStyle}`}
            >
              <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                {letter}
              </span>
              <span className="text-base sm:text-lg flex-1 leading-snug">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Answer feedback status */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-sm animate-in fade-in duration-200 ${
            isCorrect
              ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <p className="font-semibold">{isCorrect ? 'Chính xác!' : 'Chưa chính xác!'}</p>
              {!isCorrect && (
                <p className="text-xs opacity-90">
                  Đáp án đúng là: <strong>{question.correctAnswer}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
