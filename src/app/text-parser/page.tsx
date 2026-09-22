'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Layers,
  BookmarkPlus,
  Volume2,
  Trash2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { segmentChineseText, TokenizedWord } from '@/lib/tokenizer';
import { getKnownWordsSet, getStoredCards, getStoredDecks, pushMultipleToDailyStack, saveMultipleCards } from '@/lib/storage';
import { Card, Deck } from '@/types';
import WordModal from '@/components/WordModal';
import AudioPlayer from '@/components/AudioPlayer';

export default function TextParserPage() {
  const [inputText, setInputText] = useState(
    '今天北京的天气非常好，我和朋友一起去故宫旅游。学汉语很有趣，只要我们每天坚持学习，就一定能提高中文水平！'
  );
  const [segments, setSegments] = useState<Array<{ text: string; isWord: boolean; isKnown: boolean }>>([]);
  const [newWords, setNewWords] = useState<TokenizedWord[]>([]);
  const [knownWords, setKnownWords] = useState<TokenizedWord[]>([]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // Deck selector for bulk add
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [bulkAddSuccess, setBulkAddSuccess] = useState(false);
  const [stackAddSuccess, setStackAddSuccess] = useState(false);

  // Modal inspection
  const [inspectCard, setInspectCard] = useState<Card | null>(null);

  useEffect(() => {
    const d = getStoredDecks();
    setDecks(d);
    if (d.length > 0) setSelectedDeckId(d[0].id);
  }, []);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    const knownSet = getKnownWordsSet();
    const result = segmentChineseText(inputText, knownSet);
    setSegments(result.segments);
    setNewWords(result.newWords);
    setKnownWords(result.knownWords);
    setIsAnalyzed(true);
  };

  const handleClear = () => {
    setInputText('');
    setSegments([]);
    setNewWords([]);
    setKnownWords([]);
    setIsAnalyzed(false);
  };

  const handleWordClick = (wordText: string) => {
    const allCards = getStoredCards();
    const existing = allCards.find((c) => c.hanzi === wordText);

    if (existing) {
      setInspectCard(existing);
    } else {
      // Temporary card for inspection
      const tempCard: Card = {
        id: `temp-${Date.now()}`,
        deck_id: selectedDeckId || 'deck-hsk1',
        hanzi: wordText,
        pinyin: 'tra cứu pinyin...',
        meaning_vi: 'Từ vựng trích xuất từ đoạn văn',
        examples: [
          {
            hanzi: inputText.slice(0, 50),
            pinyin: '',
            meaning_vi: 'Ngữ cảnh trong đoạn văn trích xuất',
          },
        ],
      };
      setInspectCard(tempCard);
    }
  };

  const handleBulkAddToDeck = () => {
    if (newWords.length === 0 || !selectedDeckId) return;

    const cardsToAdd: Card[] = newWords.map((item, idx) => ({
      id: `card-ext-${Date.now()}-${idx}`,
      deck_id: selectedDeckId,
      hanzi: item.word,
      pinyin: '',
      meaning_vi: `Từ mới trích xuất (${item.frequency} lần)`,
      examples: [],
      created_at: new Date().toISOString(),
    }));

    saveMultipleCards(cardsToAdd);
    setBulkAddSuccess(true);
    setTimeout(() => setBulkAddSuccess(false), 3000);
  };

  const handleBulkAddToStack = () => {
    if (newWords.length === 0) return;

    const allCards = getStoredCards();
    const existingMap = new Map(allCards.map((c) => [c.hanzi, c.id]));
    const idsToPush: string[] = [];

    // Save cards first if they don't exist
    const cardsToCreate: Card[] = [];
    newWords.forEach((item, idx) => {
      const existingId = existingMap.get(item.word);
      if (existingId) {
        idsToPush.push(existingId);
      } else {
        const newId = `card-ext-${Date.now()}-${idx}`;
        cardsToCreate.push({
          id: newId,
          deck_id: selectedDeckId || decks[0]?.id || 'deck-hsk1',
          hanzi: item.word,
          pinyin: '',
          meaning_vi: 'Từ mới từ đoạn văn',
          examples: [],
        });
        idsToPush.push(newId);
      }
    });

    if (cardsToCreate.length > 0) {
      saveMultipleCards(cardsToCreate);
    }

    pushMultipleToDailyStack(idsToPush);
    setStackAddSuccess(true);
    setTimeout(() => setStackAddSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2 border-b border-theme-border/40 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-theme-secondary" />
          <span>Bóc tách Từ vựng Thông minh từ Đoạn văn</span>
        </h1>
        <p className="text-sm text-theme-text-muted leading-relaxed">
          Dán bất kỳ bài báo, hội thoại hoặc tài liệu tiếng Trung nào. Hệ thống sẽ tự động phân tích tách từ (Intl.Segmenter), đối chiếu kho từ của bạn và đánh dấu các từ mới bạn chưa học!
        </p>
      </div>

      {/* Input Area */}
      <div className="liquid-glass rounded-3xl p-6 shadow-glass border border-white/10 space-y-4">
        <div className="flex items-center justify-between text-xs font-medium text-white/60">
          <span>Văn bản tiếng Trung đầu vào:</span>
          <span className="font-mono text-white/40">{inputText.length} ký tự</span>
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Dán hoặc nhập đoạn văn tiếng Trung vào đây (ví dụ: 学汉语 / 我每天学汉语)..."
          className="w-full px-4 py-3.5 rounded-2xl liquid-glass-input text-base font-sans font-chinese leading-relaxed resize-none placeholder:text-white/30 outline-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 rounded-xl liquid-glass hover:bg-white/15 text-xs text-white/60 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa văn bản</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            className="liquid-glass-btn px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Phân tích & Lọc từ mới</span>
          </button>
        </div>
      </div>

      {/* Analysis Result */}
      {isAnalyzed && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Segmented text display with badges */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border/50 pb-3">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <span>Văn bản đã bóc tách trực quan</span>
              </h2>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-theme-text-muted">
                  <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400 inline-block" />
                  Từ đã học
                </span>
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-400 inline-block" />
                  Từ mới ({newWords.length})
                </span>
              </div>
            </div>

            {/* Interactive paragraph rendering */}
            <div className="p-5 rounded-2xl bg-black/25 border border-white/10 text-lg sm:text-xl font-chinese leading-loose tracking-wide flex flex-wrap gap-x-1.5 gap-y-2">
              {segments.map((seg, idx) => {
                if (!seg.isWord) {
                  return (
                    <span key={idx} className="text-theme-text-muted/80">
                      {seg.text}
                    </span>
                  );
                }

                if (seg.isKnown) {
                  return (
                    <span
                      key={idx}
                      onClick={() => handleWordClick(seg.text)}
                      title={`Từ đã biết: "${seg.text}" - Bấm để xem`}
                      className="px-1.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/30 cursor-pointer transition-all"
                    >
                      {seg.text}
                    </span>
                  );
                }

                return (
                  <span
                    key={idx}
                    onClick={() => handleWordClick(seg.text)}
                    title={`Từ mới phát hiện: "${seg.text}" - Bấm để xem`}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/25 border-b-2 border-amber-400 text-amber-200 font-bold hover:bg-amber-500/40 cursor-pointer transition-all shadow-sm"
                  >
                    {seg.text}
                  </span>
                );
              })}
            </div>

            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <span className="text-white/30 font-medium">Gợi ý:</span>
              <span>Nhấp vào bất kỳ từ vựng nào (đặc biệt là các từ màu vàng) để nghe phát âm và xem nghĩa chi tiết.</span>
            </p>
          </div>

          {/* New words list & Bulk actions */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-border/40 pb-4">
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <BookmarkPlus className="w-5 h-5 text-amber-300" />
                  <span>Danh sách {newWords.length} từ mới phát hiện</span>
                </h3>
                <p className="text-xs text-theme-text-muted">
                  Bạn có muốn thêm các từ mới này vào bộ học hoặc học ngay hôm nay không?
                </p>
              </div>

              {/* Bulk actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={selectedDeckId}
                  onChange={(e) => setSelectedDeckId(e.target.value)}
                  className="px-3 py-2 rounded-xl liquid-glass-input text-xs"
                >
                  {decks.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                      {d.title}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleBulkAddToDeck}
                  disabled={newWords.length === 0 || bulkAddSuccess}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    bulkAddSuccess
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400'
                      : 'liquid-glass-btn'
                  }`}
                >
                  {bulkAddSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã thêm vào bộ!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Thêm tất cả vào Bộ</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBulkAddToStack}
                  disabled={newWords.length === 0 || stackAddSuccess}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    stackAddSuccess
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-theme-border'
                  }`}
                >
                  {stackAddSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>Đã đưa vào Stack ngày!</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5 text-amber-300" />
                      <span>Đưa vào Stack hôm nay</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Word Chips */}
            {newWords.length === 0 ? (
              <p className="text-sm text-theme-text-muted text-center py-4">
                Tuyệt vời! Đoạn văn này không có từ mới nào đối với bạn.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {newWords.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleWordClick(item.word)}
                    className="p-3 rounded-xl liquid-glass hover:bg-white/15 border border-amber-400/40 cursor-pointer flex items-center justify-between gap-2 group transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-lg font-chinese text-white group-hover:text-amber-300">
                        {item.word}
                      </span>
                      <span className="text-[10px] text-theme-text-muted">
                        Xuất hiện {item.frequency} lần
                      </span>
                    </div>
                    <AudioPlayer text={item.word} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Inspector */}
      <WordModal
        card={inspectCard}
        isOpen={Boolean(inspectCard)}
        onClose={() => setInspectCard(null)}
      />
    </div>
  );
}
