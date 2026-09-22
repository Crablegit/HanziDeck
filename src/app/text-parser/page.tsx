'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Layers,
  BookmarkPlus,
  Trash2,
  CheckCircle2,
  Check,
  BookOpen,
} from 'lucide-react';
import { segmentChineseText, TokenizedWord } from '@/lib/tokenizer';
import { getKnownWordsSet, getStoredCards, getStoredDecks, pushMultipleToDailyStack, saveMultipleCards } from '@/lib/storage';
import { resolveCardForWord } from '@/lib/compoundAnalyzer';
import { Card, Deck } from '@/types';
import WordModal from '@/components/WordModal';
import AudioPlayer from '@/components/AudioPlayer';

export default function TextParserPage() {
  const [inputText, setInputText] = useState(
    '今天北京的天气非常好，我和朋友一起去故宫旅游。学汉语很有趣，只要我们每天坚持学习，就一定能提高中文水平！'
  );
  const [segments, setSegments] = useState<Array<{ text: string; isWord: boolean; isKnown: boolean; isCompound?: boolean }>>([]);
  const [newWords, setNewWords] = useState<TokenizedWord[]>([]);
  const [knownWords, setKnownWords] = useState<TokenizedWord[]>([]);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'known'>('new');

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
    // Nếu không có từ mới thì tự động chuyển sang tab từ đã biết
    if (result.newWords.length === 0 && result.knownWords.length > 0) {
      setActiveTab('known');
    } else {
      setActiveTab('new');
    }
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
    const knownSet = getKnownWordsSet();
    const resolved = resolveCardForWord(wordText, allCards, knownSet, inputText);
    setInspectCard(resolved);
  };

  const handleBulkAddToDeck = () => {
    if (newWords.length === 0 || !selectedDeckId) return;

    const allCards = getStoredCards();
    const knownSet = getKnownWordsSet();
    const cardsToAdd: Card[] = newWords.map((item) => {
      const resolved = resolveCardForWord(item.word, allCards, knownSet, inputText);
      return {
        ...resolved,
        deck_id: selectedDeckId,
      };
    });

    saveMultipleCards(cardsToAdd);
    setBulkAddSuccess(true);
    setTimeout(() => setBulkAddSuccess(false), 3000);
  };

  const handleBulkAddToStack = () => {
    if (newWords.length === 0) return;

    const allCards = getStoredCards();
    const knownSet = getKnownWordsSet();
    const existingMap = new Map(allCards.map((c) => [c.hanzi, c.id]));
    const idsToPush: string[] = [];

    const cardsToCreate: Card[] = [];
    newWords.forEach((item) => {
      const existingId = existingMap.get(item.word);
      if (existingId) {
        idsToPush.push(existingId);
      } else {
        const resolved = resolveCardForWord(item.word, allCards, knownSet, inputText);
        cardsToCreate.push(resolved);
        idsToPush.push(resolved.id);
      }
    });

    if (cardsToCreate.length > 0) {
      saveMultipleCards(cardsToCreate);
    }

    pushMultipleToDailyStack(idsToPush);
    setStackAddSuccess(true);
    setTimeout(() => setStackAddSuccess(false), 3000);
  };

  const totalWords = segments.filter((s) => s.isWord).length;
  const comprehensionRate =
    totalWords > 0
      ? Math.round((knownWords.length / (newWords.length + knownWords.length)) * 100)
      : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2 border-b border-theme-border/40 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-theme-secondary" />
          <span>Bóc tách Từ vựng Thông minh từ Đoạn văn</span>
        </h1>
        <p className="text-sm text-theme-text-muted leading-relaxed">
          Dán bất kỳ bài báo, hội thoại hoặc tài liệu tiếng Trung nào. Hệ thống tự động phân tích tách từ (Intl.Segmenter), nhận diện từ ghép đã biết và gom nhóm từ mới bạn chưa học!
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
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/20 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border/50 pb-4">
              <div>
                <h2 className="font-bold text-white text-base flex items-center gap-2">
                  <span>Văn bản đã bóc tách trực quan</span>
                </h2>
                <p className="text-xs text-theme-text-muted mt-0.5">
                  Độ hiểu văn bản: <strong className="text-emerald-400 font-semibold">{comprehensionRate}%</strong> ({knownWords.length}/{knownWords.length + newWords.length} nhóm từ)
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400 inline-block" />
                  Từ đã biết ({knownWords.length})
                </span>
                <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-400 inline-block" />
                  Từ mới ({newWords.length})
                </span>
              </div>
            </div>

            {/* Interactive paragraph rendering */}
            <div className="p-5 rounded-2xl bg-black/25 border border-white/10 text-lg sm:text-xl font-chinese leading-loose tracking-wide flex flex-wrap gap-x-1.5 gap-y-2.5">
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
                      title={seg.isCompound ? `Từ ghép đã biết: "${seg.text}" - Bấm để xem phân tích` : `Từ đã biết: "${seg.text}" - Bấm để xem`}
                      className={`px-2 py-0.5 rounded-lg border cursor-pointer transition-all inline-flex items-center gap-1 ${
                        seg.isCompound
                          ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/35'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/30'
                      }`}
                    >
                      <span>{seg.text}</span>
                      {seg.isCompound && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Từ ghép cấu thành từ các chữ Hán đã biết" />
                      )}
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
              <span>Nhấp vào bất kỳ từ vựng nào để nghe phát âm, xem giải nghĩa và phân tích từng chữ cấu thành.</span>
            </p>
          </div>

          {/* Grouped Word Lists (Tabs: Từ mới vs Từ đã biết) */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 space-y-6">
            {/* Tabs selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border/40 pb-4">
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/30 border border-white/10 w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab('new')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === 'new'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Từ mới cần học ({newWords.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('known')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === 'known'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/50 shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Từ đã biết & Từ ghép ({knownWords.length})</span>
                </button>
              </div>

              {/* Bulk actions for New Words */}
              {activeTab === 'new' && newWords.length > 0 && (
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
                    disabled={bulkAddSuccess}
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
                    disabled={stackAddSuccess}
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
              )}
            </div>

            {/* Tab 1: New Words View */}
            {activeTab === 'new' && (
              <div>
                {newWords.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                    <p className="text-base font-semibold text-white">
                      Tuyệt vời! Không phát hiện từ mới nào trong đoạn văn.
                    </p>
                    <p className="text-xs text-theme-text-muted">
                      Bạn đã biết tất cả các từ và chữ Hán trong văn bản này.
                    </p>
                  </div>
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
            )}

            {/* Tab 2: Known Words & Compounds View */}
            {activeTab === 'known' && (
              <div>
                {knownWords.length === 0 ? (
                  <p className="text-sm text-theme-text-muted text-center py-6">
                    Chưa có từ đã biết nào được ghi nhận trong đoạn văn này.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {knownWords.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleWordClick(item.word)}
                        className="p-3 rounded-xl liquid-glass hover:bg-white/15 border border-emerald-500/30 cursor-pointer flex items-center justify-between gap-2 group transition-all"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-lg font-chinese text-white group-hover:text-emerald-300">
                              {item.word}
                            </span>
                            {item.isCompound && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/25 border border-emerald-400/30 text-[9px] font-medium text-emerald-200">
                                Ghép
                              </span>
                            )}
                          </div>
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
