'use client';

import React, { useState, useEffect } from 'react';
import { Card, Deck } from '@/types';
import AudioPlayer from './AudioPlayer';
import { X, Plus, CheckCircle2, BookmarkPlus, Layers, Volume2 } from 'lucide-react';
import { getStoredDecks, pushToDailyStack, saveCard } from '@/lib/storage';

interface WordModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onAddedToDeck?: () => void;
}

export default function WordModal({ card, isOpen, onClose, onAddedToDeck }: WordModalProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [addedDeckSuccess, setAddedDeckSuccess] = useState(false);
  const [addedStackSuccess, setAddedStackSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const d = getStoredDecks();
      setDecks(d);
      if (d.length > 0 && !selectedDeckId) {
        setSelectedDeckId(d[0].id);
      }
      setAddedDeckSuccess(false);
      setAddedStackSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !card) return null;

  const handleAddToDeck = () => {
    if (!selectedDeckId) return;
    const newCard: Card = {
      ...card,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      deck_id: selectedDeckId,
      created_at: new Date().toISOString(),
    };
    saveCard(newCard);
    setAddedDeckSuccess(true);
    if (onAddedToDeck) onAddedToDeck();
    setTimeout(() => setAddedDeckSuccess(false), 2500);
  };

  const handleAddToStack = () => {
    pushToDailyStack(card.id);
    setAddedStackSuccess(true);
    setTimeout(() => setAddedStackSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg liquid-glass-card rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/20 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-theme-text-muted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Word Header */}
        <div className="flex items-start gap-4 border-b border-theme-border/50 pb-5">
          <div className="w-20 h-20 rounded-2xl liquid-glass flex items-center justify-center font-bold text-4xl sm:text-5xl text-white font-serif border border-theme-border shadow-inner shrink-0">
            {card.hanzi}
          </div>
          <div className="flex flex-col gap-1 flex-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-amber-300">{card.pinyin}</span>
              <AudioPlayer text={card.hanzi} audioUrl={card.audio_url} size="sm" />
            </div>
            {card.han_viet && (
              <span className="text-xs text-theme-text-muted">
                Âm Hán Việt: <strong className="text-white font-medium">{card.han_viet}</strong>
              </span>
            )}
            <div className="flex items-center gap-2 mt-1">
              {card.hsk_level && (
                <span className="px-2 py-0.5 rounded-md bg-theme-primary/30 border border-theme-border text-[11px] font-bold text-white">
                  HSK {card.hsk_level}
                </span>
              )}
              {card.stroke_count && (
                <span className="text-[11px] text-theme-text-muted opacity-80">
                  {card.stroke_count} nét viết
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Word Details */}
        <div className="py-4 space-y-4 text-sm">
          {/* Meanings */}
          <div>
            <label className="text-xs uppercase font-semibold tracking-wider text-theme-text-muted opacity-80 block mb-1">
              Ý nghĩa:
            </label>
            <p className="text-lg font-bold text-white">{card.meaning_vi}</p>
            {card.meaning_en && (
              <p className="text-xs text-theme-text-muted mt-0.5">{card.meaning_en}</p>
            )}
          </div>

          {/* Radicals */}
          {card.radical && (
            <div className="p-3 rounded-xl bg-black/20 border border-theme-border/60 text-xs">
              <span className="text-amber-300 font-semibold">Bộ thủ & cấu tạo: </span>
              <span className="text-theme-text-muted">{card.radical}</span>
            </div>
          )}

          {/* Example Sentences */}
          {card.examples && card.examples.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs uppercase font-semibold tracking-wider text-theme-text-muted opacity-80 block">
                Ví dụ mẫu câu:
              </label>
              {card.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/5 border border-theme-border/40 text-xs space-y-1"
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

        {/* Action Buttons */}
        <div className="border-t border-theme-border/50 pt-4 flex flex-col gap-3">
          {/* Add to Deck option */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl liquid-glass-input text-xs"
            >
              {decks.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {d.title} ({d.total_cards} từ)
                </option>
              ))}
            </select>
            <button
              onClick={handleAddToDeck}
              disabled={addedDeckSuccess || !selectedDeckId}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                addedDeckSuccess
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400'
                  : 'liquid-glass-btn'
              }`}
            >
              {addedDeckSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã thêm!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Lưu vào bộ</span>
                </>
              )}
            </button>
          </div>

          {/* Add to Daily Stack option */}
          <button
            onClick={handleAddToStack}
            disabled={addedStackSuccess}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              addedStackSuccess
                ? 'bg-amber-500/30 text-amber-200 border border-amber-400'
                : 'bg-white/10 hover:bg-white/20 text-white border border-theme-border'
            }`}
          >
            {addedStackSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Đã đưa vào Stack học hôm nay!</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Đưa vào Ngăn xếp học hôm nay (Daily Stack)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
