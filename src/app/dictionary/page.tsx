'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Layers,
  Plus,
  Sparkles,
  Volume2,
  BookmarkPlus,
  AlertCircle,
} from 'lucide-react';
import { getStoredCards, getStoredDecks, pushToDailyStack, saveCard } from '@/lib/storage';
import { searchDictionary } from '@/lib/dictionaryData';
import { getGeminiApiKeyFromCookie } from '@/lib/cookie';
import { lookupWordWithGemini } from '@/lib/gemini';
import AudioPlayer from '@/components/AudioPlayer';
import WordModal from '@/components/WordModal';
import { Card } from '@/types';

export default function DictionaryPage() {
  const [query, setQuery] = useState('');
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [results, setResults] = useState<Card[]>([]);
  const [selectedWord, setSelectedWord] = useState<Card | null>(null);

  // Gemini AI lookup state
  const [apiKey, setApiKey] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const cards = getStoredCards();
    setAllCards(cards);
    setResults(cards.slice(0, 16));
    setApiKey(getGeminiApiKeyFromCookie());
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    setAiError(null);
    const res = searchDictionary(text, allCards);
    setResults(res);
  };

  const handleAiLookup = async () => {
    if (!query.trim()) return;
    if (!apiKey) {
      setAiError('Vui lòng nhập Google Gemini API Key trong phần Cài đặt để sử dụng tính năng tra cứu thông minh.');
      return;
    }

    setAiLoading(true);
    setAiError(null);
    try {
      const aiCard = await lookupWordWithGemini(query.trim(), apiKey);
      if (aiCard) {
        // Save to local cards cache so it's always accessible
        saveCard(aiCard);
        setAllCards((prev) => [aiCard, ...prev]);
        setResults((prev) => [aiCard, ...prev]);
        setSelectedWord(aiCard);
      } else {
        setAiError(`Không tìm thấy kết quả cho từ "${query}".`);
      }
    } catch (err: any) {
      setAiError(err?.message || 'Tra cứu AI thất bại. Vui lòng kiểm tra lại API Key.');
    } finally {
      setAiLoading(false);
    }
  };

  const quickTags = ['你好', '提高', '坚持', '旅游', '马到成功', '一心一意', '半途而废', '解决', '独特'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1.5 border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Search className="w-6 h-6 text-sky-400" />
          <span>Tra cứu Từ điển Hanzii</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/60">
          Kho dữ liệu 5.375+ từ vựng chuẩn HSK 1–6 (3.0) & Thành ngữ. Tra cứu Chữ Hán, Pinyin, Hán Việt, phân tích bộ thủ và câu ví dụ song ngữ.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6 shadow-glass border border-white/10 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results.length === 0) {
                handleAiLookup();
              }
            }}
            placeholder="Nhập Chữ Hán (汉字), Pinyin hoặc Nghĩa tiếng Việt..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl liquid-glass-input text-base font-medium placeholder:text-white/30"
          />
        </div>

        {/* Quick Tag Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-white/50">Từ phổ biến:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSearch(tag)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all font-chinese"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* AI Search Banner if query has no local matches or user wants deep lookup */}
      {query.trim().length > 0 && (
        <div className="liquid-glass rounded-2xl p-4 border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tra cứu sâu bằng AI Gemini 3.5 Flash Lite
            </span>
            <p className="text-white/60">
              Tra cứu bộ thủ, phân tích âm Hán Việt, số nét và sinh câu ví dụ cho "{query}".
            </p>
          </div>

          <button
            type="button"
            onClick={handleAiLookup}
            disabled={aiLoading}
            className="liquid-glass-btn px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>{aiLoading ? 'Đang phân tích...' : 'Tra cứu với AI'}</span>
          </button>
        </div>
      )}

      {aiError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{aiError}</span>
          {!apiKey && (
            <Link href="/settings" className="underline ml-auto font-semibold">
              Đến Cài đặt
            </Link>
          )}
        </div>
      )}

      {/* Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-white/50 px-1">
          <span>Tìm thấy {results.length} từ (trong kho {allCards.length} từ)</span>
          <span>Nhấp vào thẻ để xem chi tiết bộ thủ & lưu vào bộ</span>
        </div>

        {results.length === 0 ? (
          <div className="liquid-glass rounded-3xl p-12 text-center text-white/60 border border-white/10 space-y-4">
            <p className="text-base font-semibold text-white">Chưa có từ vựng này trong kho sẵn có</p>
            <p className="text-xs max-w-md mx-auto">
              Bạn có thể bấm tra cứu trực tiếp bằng AI Gemini để bóc tách ngay Chữ Hán, Pinyin, Hán Việt và ví dụ câu!
            </p>
            <button
              type="button"
              onClick={handleAiLookup}
              disabled={aiLoading}
              className="liquid-glass-btn px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span>{aiLoading ? 'Đang phân tích...' : `Tra cứu AI cho "${query}"`}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {results.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedWord(card)}
                className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 shadow-glass flex flex-col justify-between gap-3.5 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Big Character Box */}
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-3xl text-white font-chinese border border-white/10 shrink-0 group-hover:border-sky-400/40 transition-colors">
                    {card.hanzi}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold font-mono text-sky-300">{card.pinyin}</span>
                      {card.han_viet && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-white/70">
                          {card.han_viet}
                        </span>
                      )}
                      {card.hsk_level && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-bold border border-white/10">
                          HSK {card.hsk_level}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-white leading-snug truncate">
                      {card.meaning_vi}
                    </p>
                    {card.radical && (
                      <p className="text-xs text-white/50 truncate">
                        Bộ thủ: <span className="text-white/80">{card.radical}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-1.5 text-white/40">
                    {card.stroke_count && <span>{card.stroke_count} nét</span>}
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <AudioPlayer text={card.hanzi} audioUrl={card.audio_url} size="sm" />
                    <button
                      type="button"
                      onClick={() => setSelectedWord(card)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-medium flex items-center gap-1 border border-white/10 transition-colors"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-sky-300" />
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
