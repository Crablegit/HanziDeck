'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  Layers,
  BookOpen,
  Award,
  Plus,
  Search,
  Trash2,
  ArrowLeft,
  Volume2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { getStoredDecks, getStoredCards, saveCard, deleteCard, getStoredSettings } from '@/lib/storage';
import { getTranslations } from '@/lib/i18n';
import AudioPlayer from '@/components/AudioPlayer';
import { Card, Deck } from '@/types';

export default function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const deckId = resolvedParams.id;
  const router = useRouter();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(60);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [hanViet, setHanViet] = useState('');
  const [meaningVi, setMeaningVi] = useState('');
  const [meaningEn, setMeaningEn] = useState('');
  const [radical, setRadical] = useState('');
  const [exampleHanzi, setExampleHanzi] = useState('');
  const [examplePinyin, setExamplePinyin] = useState('');
  const [exampleMeaning, setExampleMeaning] = useState('');

  const settings = getStoredSettings();
  const t = getTranslations(settings.language || 'vi');

  useEffect(() => {
    const allDecks = getStoredDecks();
    const currentDeck = allDecks.find((d) => d.id === deckId);
    if (!currentDeck) {
      return;
    }
    setDeck(currentDeck);

    const allCards = getStoredCards();
    const deckCards = allCards.filter((c) => c.deck_id === deckId);
    setCards(deckCards);
  }, [deckId]);

  if (!deck) {
    return (
      <div className="p-10 text-center text-theme-text-muted">
        <p>Đang tải dữ liệu bộ thẻ...</p>
        <Link href="/decks" className="mt-4 inline-block text-emerald-300 underline">
          Quay lại danh sách bộ thẻ
        </Link>
      </div>
    );
  }

  const filteredCards = cards.filter(
    (c) =>
      c.hanzi.includes(searchQuery) ||
      c.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.meaning_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.han_viet && c.han_viet.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hanzi.trim() || !pinyin.trim() || !meaningVi.trim()) return;

    const newCard: Card = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      deck_id: deckId,
      hanzi: hanzi.trim(),
      pinyin: pinyin.trim(),
      han_viet: hanViet.trim() || undefined,
      meaning_vi: meaningVi.trim(),
      meaning_en: meaningEn.trim() || undefined,
      radical: radical.trim() || undefined,
      examples: exampleHanzi.trim()
        ? [
            {
              hanzi: exampleHanzi.trim(),
              pinyin: examplePinyin.trim(),
              meaning_vi: exampleMeaning.trim(),
            },
          ]
        : [],
      created_at: new Date().toISOString(),
    };

    saveCard(newCard);
    setCards((prev) => [newCard, ...prev]);

    // Reset form
    setHanzi('');
    setPinyin('');
    setHanViet('');
    setMeaningVi('');
    setMeaningEn('');
    setRadical('');
    setExampleHanzi('');
    setExamplePinyin('');
    setExampleMeaning('');
    setIsAddModalOpen(false);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Bạn có chắc muốn xóa thẻ từ vựng này khỏi bộ?')) {
      deleteCard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button & Breadcrumb */}
      <Link
        href="/decks"
        className="inline-flex items-center gap-2 text-xs font-semibold text-theme-text-muted hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại tất cả bộ thẻ</span>
      </Link>

      {/* Deck Header Card */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/20 shadow-glass-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{deck.title}</h1>
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-theme-text-muted border border-theme-border">
              {cards.length} thẻ
            </span>
          </div>
          <p className="text-sm text-theme-text-muted leading-relaxed">{deck.description}</p>
        </div>

        {/* Study Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/decks/${deck.id}/study`}
            className="liquid-glass-btn px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-emerald-200" />
            <span>{t.decks.studyFlashcards}</span>
          </Link>
          <Link
            href={`/decks/${deck.id}/quiz`}
            className="px-5 py-3 rounded-2xl liquid-glass hover:bg-white/15 text-white border-theme-border font-semibold text-sm flex items-center gap-2 transition-all"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>{t.decks.studyQuiz}</span>
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-theme-border text-sm font-medium flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-theme-secondary" />
            <span>{t.decks.addWord}</span>
          </button>
        </div>
      </div>

      {/* Search & Word List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{t.decks.wordList}</span>
            <span className="text-xs text-theme-text-muted font-normal">
              (Hiển thị {filteredCards.length} từ)
            </span>
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.decks.searchWords}
              className="w-full pl-10 pr-4 py-2 rounded-xl liquid-glass-input text-xs"
            />
          </div>
        </div>

        {/* Cards Table / List */}
        {filteredCards.length === 0 ? (
          <div className="liquid-glass rounded-3xl p-10 text-center space-y-3 border border-theme-border/40">
            <p className="text-sm text-theme-text-muted">{t.decks.emptyDeck}</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="liquid-glass-btn px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm từ đầu tiên vào bộ này</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {filteredCards.slice(0, visibleLimit).map((card) => (
                <div
                  key={card.id}
                  className="liquid-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 shadow-glass flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-bold text-white font-chinese tracking-wide">
                        {card.hanzi}
                      </span>
                      <span className="text-base font-semibold font-mono text-amber-300">
                        {card.pinyin}
                      </span>
                      {card.han_viet && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-white/70 font-medium">
                          {card.han_viet}
                        </span>
                      )}
                      {card.hsk_level && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-bold border border-white/10">
                          HSK {card.hsk_level}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/90 font-medium">{card.meaning_vi}</p>
                    {card.examples && card.examples[0] && (
                      <p className="text-xs text-white/50 truncate hidden sm:block">
                        Ví dụ: {card.examples[0].hanzi} — {card.examples[0].meaning_vi}
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <AudioPlayer text={card.hanzi} audioUrl={card.audio_url} size="sm" />
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      title="Xóa thẻ khỏi bộ"
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCards.length > visibleLimit && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setVisibleLimit((prev) => prev + 60)}
                  className="liquid-glass-btn px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
                >
                  <span>Hiển thị thêm ({filteredCards.length - visibleLimit} từ còn lại)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg liquid-glass-card rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/20 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-theme-text-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-theme-secondary" />
              <span>Thêm thẻ từ vựng mới</span>
            </h2>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                    Chữ Hán (Hanzi) *
                  </label>
                  <input
                    type="text"
                    required
                    value={hanzi}
                    onChange={(e) => setHanzi(e.target.value)}
                    placeholder="ví dụ: 学习"
                    className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-base font-serif"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                    Bính âm (Pinyin) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pinyin}
                    onChange={(e) => setPinyin(e.target.value)}
                    placeholder="ví dụ: xuéxí"
                    className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                    Âm Hán Việt
                  </label>
                  <input
                    type="text"
                    value={hanViet}
                    onChange={(e) => setHanViet(e.target.value)}
                    placeholder="ví dụ: Học Tập"
                    className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                    Bộ thủ & cấu tạo
                  </label>
                  <input
                    type="text"
                    value={radical}
                    onChange={(e) => setRadical(e.target.value)}
                    placeholder="ví dụ: 子 (Tử) / 宀"
                    className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Nghĩa Tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  value={meaningVi}
                  onChange={(e) => setMeaningVi(e.target.value)}
                  placeholder="ví dụ: Học tập, nghiên cứu"
                  className="w-full px-3 py-2.5 rounded-xl liquid-glass-input text-sm"
                />
              </div>

              {/* Example sentence */}
              <div className="p-3 rounded-2xl bg-black/20 border border-theme-border/40 space-y-2">
                <span className="text-xs font-semibold text-amber-300 block">Ví dụ mẫu câu (Tùy chọn):</span>
                <input
                  type="text"
                  value={exampleHanzi}
                  onChange={(e) => setExampleHanzi(e.target.value)}
                  placeholder="Câu Chữ Hán (ví dụ: 我们一起学习汉语。)"
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs font-serif"
                />
                <input
                  type="text"
                  value={examplePinyin}
                  onChange={(e) => setExamplePinyin(e.target.value)}
                  placeholder="Pinyin câu ví dụ (ví dụ: Wǒmen yīqǐ xuéxí hànyǔ.)"
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs font-mono"
                />
                <input
                  type="text"
                  value={exampleMeaning}
                  onChange={(e) => setExampleMeaning(e.target.value)}
                  placeholder="Nghĩa câu ví dụ (ví dụ: Chúng tôi cùng nhau học tiếng Trung.)"
                  className="w-full px-3 py-2 rounded-xl liquid-glass-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl liquid-glass hover:bg-white/15 text-xs text-theme-text-muted"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="liquid-glass-btn px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Lưu vào bộ thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
