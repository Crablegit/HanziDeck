'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Plus, BookOpen, Trash2, ArrowRight, X, BookmarkCheck, ShieldCheck } from 'lucide-react';
import { getStoredDecks, saveDeck, deleteDeck, getStoredSettings } from '@/lib/storage';
import { getTranslations } from '@/lib/i18n';
import { Deck } from '@/types';

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [settings, setSettings] = useState(getStoredSettings());

  useEffect(() => {
    setDecks(getStoredDecks());
    setSettings(getStoredSettings());
  }, []);

  const t = getTranslations(settings.language || 'vi');

  const customDecks = decks.filter((d) => !d.is_system);
  const systemDecks = decks.filter((d) => d.is_system);

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Bộ từ vựng tùy chỉnh cá nhân',
      total_cards: 0,
      color_tag: 'emerald',
      is_system: false,
      created_at: new Date().toISOString(),
    };

    const updated = saveDeck(newDeck);
    setDecks(updated);
    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa bộ từ vựng này không?')) {
      const updated = deleteDeck(id);
      setDecks(updated);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border/40 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-theme-secondary" />
            <span>{t.decks.title}</span>
          </h1>
          <p className="text-sm text-theme-text-muted mt-1">{t.decks.subtitle}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="liquid-glass-btn px-4 py-2.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.decks.createNew}</span>
        </button>
      </div>

      {/* Section 1: Custom Personal Decks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Sổ từ vựng cá nhân của bạn</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {customDecks.length} bộ
            </span>
          </div>
          <p className="text-xs text-white/50 hidden sm:block">
            Nơi lưu các từ mới bạn tự thêm hoặc trích xuất từ đoạn văn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {customDecks.map((deck) => (
            <Link
              key={deck.id}
              href={`/decks/${deck.id}`}
              className="liquid-glass-card rounded-3xl p-6 border border-emerald-500/30 shadow-glass flex flex-col justify-between gap-5 group hover:border-emerald-400 transition-all relative overflow-hidden"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {deck.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-xs font-mono text-emerald-200 shrink-0 border border-emerald-500/30">
                    {deck.total_cards} thẻ
                  </span>
                </div>
                <p className="text-xs text-theme-text-muted line-clamp-2 leading-relaxed">
                  {deck.description}
                </p>
              </div>

              <div className="pt-3 border-t border-theme-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Mở học ngay <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                {deck.id !== 'deck-my-vocabulary' && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(deck.id, e)}
                    title="Xóa bộ thẻ cá nhân này"
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Section 2: Standard HSK System Decks */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Kho từ vựng chuẩn HSK 3.0 & Thành ngữ</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Hệ thống
            </span>
          </div>
          <p className="text-xs text-white/50 hidden sm:block">
            Giáo trình từ vựng chuẩn mực quốc tế HSK 1 đến HSK 6
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {systemDecks.map((deck) => (
            <Link
              key={deck.id}
              href={`/decks/${deck.id}`}
              className="liquid-glass-card rounded-3xl p-6 border border-white/15 shadow-glass flex flex-col justify-between gap-5 group hover:border-sky-400/50 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors line-clamp-1">
                    {deck.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-mono text-theme-text-muted shrink-0 border border-theme-border">
                    {deck.total_cards} thẻ
                  </span>
                </div>
                <p className="text-xs text-theme-text-muted line-clamp-2 leading-relaxed">
                  {deck.description}
                </p>
              </div>

              <div className="pt-3 border-t border-theme-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Mở học ngay <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Create Deck Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md liquid-glass-card rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/20 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-theme-text-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-theme-secondary" />
              <span>{t.decks.createNew}</span>
            </h2>

            <form onSubmit={handleCreateDeck} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Tên bộ thẻ từ vựng:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.decks.deckTitlePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">
                  Mô tả bộ thẻ:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.decks.deckDescPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass-input text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl liquid-glass hover:bg-white/15 text-xs text-theme-text-muted"
                >
                  {t.decks.cancel}
                </button>
                <button
                  type="submit"
                  className="liquid-glass-btn px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  {t.decks.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
