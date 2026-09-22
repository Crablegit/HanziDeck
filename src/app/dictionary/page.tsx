'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Layers, Plus, Sparkles, Volume2, BookmarkPlus } from 'lucide-react';
import { getStoredCards, getStoredDecks, pushToDailyStack, saveCard } from '@/lib/storage';
import { searchDictionary } from '@/lib/dictionaryData';
import AudioPlayer from '@/components/AudioPlayer';
import WordModal from '@/components/WordModal';
import { Card } from '@/types';

export default function DictionaryPage() {
  const [query, setQuery] = useState('');
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [results, setResults] = useState<Card[]>([]);
  const [selectedWord, setSelectedWord] = useState<Card | null>(null);

  useEffect(() => {
    const cards = getStoredCards();
    setAllCards(cards);
    setResults(cards.slice(0, 15));
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    const res = searchDictionary(text, allCards);
    setResults(res);
  };

  const quickTags = ['你好', '谢谢', '中国', '朋友', '喜欢', '旅游', '准备', '提高', '坚持'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2 border-b border-theme-border/40 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Search className="w-7 h-7 text-theme-secondary" />
          <span>Tra cứu Từ điển Hanzii</span>
        </h1>
        <p className="text-sm text-theme-text-muted">
          Tra cứu Chữ Hán, Bính âm (Pinyin), Âm Hán Việt, phân tích bộ thủ, số nét và ví dụ câu chuẩn bản xứ.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6 shadow-glass border border-white/15 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-theme-secondary absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Nhập Chữ Hán (汉字), Pinyin (ni hao) hoặc Nghĩa Tiếng Việt..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl liquid-glass-input text-base font-medium placeholder:text-theme-text-muted/60"
          />
        </div>

        {/* Quick Tag Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-theme-text-muted opacity-80">Gợi ý tìm nhanh:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSearch(tag)}
              className="px-2.5 py-1 rounded-xl liquid-glass hover:bg-white/15 text-theme-text-muted hover:text-white border border-theme-border transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-theme-text-muted px-1">
          <span>Tìm thấy {results.length} từ vựng</span>
          <span>Nhấp vào thẻ để xem phân tích bộ thủ & cấu tạo</span>
        </div>

        {results.length === 0 ? (
          <div className="liquid-glass rounded-3xl p-12 text-center text-theme-text-muted border border-theme-border/40">
            <p className="text-base font-semibold text-white mb-1">Không tìm thấy từ tương ứng</p>
            <p className="text-xs">Hãy thử tìm bằng chữ Hán khác, Pinyin không dấu hoặc nghĩa tiếng Việt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedWord(card)}
                className="liquid-glass-card rounded-2xl p-5 border border-white/15 shadow-glass flex flex-col justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Big Character Box */}
                  <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center font-bold text-3xl text-white font-serif border border-theme-border shadow-inner shrink-0 group-hover:border-theme-secondary transition-colors">
                    {card.hanzi}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold font-mono text-amber-300">{card.pinyin}</span>
                      {card.han_viet && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-theme-text-muted">
                          {card.han_viet}
                        </span>
                      )}
                      {card.hsk_level && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          HSK {card.hsk_level}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white leading-snug truncate">
                      {card.meaning_vi}
                    </p>
                    {card.radical && (
                      <p className="text-xs text-theme-text-muted truncate">
                        Bộ thủ: <span className="text-white/80">{card.radical}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-3 border-t border-theme-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-theme-text-muted">
                    {card.stroke_count && <span>{card.stroke_count} nét</span>}
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <AudioPlayer text={card.hanzi} audioUrl={card.audio_url} size="sm" />
                    <button
                      type="button"
                      onClick={() => setSelectedWord(card)}
                      className="px-2.5 py-1.5 rounded-xl liquid-glass hover:bg-white/20 text-white font-medium flex items-center gap-1"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Chi tiết / Lưu</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Word Inspector Modal */}
      <WordModal
        card={selectedWord}
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
      />
    </div>
  );
}
