import { Card, Deck, UserProfile, CardProgress } from '@/types';
import { INITIAL_CARDS, INITIAL_DECKS } from './dictionaryData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  DECKS: 'hanzideck_decks',
  CARDS: 'hanzideck_cards',
  DAILY_QUEUE: 'hanzideck_daily_queue',
  PROGRESS: 'hanzideck_progress',
  SETTINGS: 'hanzideck_settings',
  STREAK: 'hanzideck_streak',
};

export interface DailyStreakData {
  count: number;
  lastCompletedDate: string; // YYYY-MM-DD
  todayCompletedWords: number;
}

export const DEFAULT_PROFILE: UserProfile = {
  daily_goal: 10,
  theme_id: 'imperial-jade',
  glass_blur: 16,
  glass_opacity: 80,
  language: 'vi',
};

// ================= DECKS =================
export function getStoredDecks(): Deck[] {
  if (typeof window === 'undefined') return INITIAL_DECKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DECKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(INITIAL_DECKS));
      return INITIAL_DECKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DECKS;
  }
}

export function saveDeck(deck: Deck): Deck[] {
  const decks = getStoredDecks();
  const index = decks.findIndex((d) => d.id === deck.id);
  let updated: Deck[];
  if (index >= 0) {
    updated = [...decks];
    updated[index] = deck;
  } else {
    updated = [deck, ...decks];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(updated));
  }
  return updated;
}

export function deleteDeck(deckId: string): Deck[] {
  const decks = getStoredDecks().filter((d) => d.id !== deckId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  }
  return decks;
}

// ================= CARDS =================
export function getStoredCards(): Card[] {
  if (typeof window === 'undefined') return INITIAL_CARDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(INITIAL_CARDS));
      return INITIAL_CARDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CARDS;
  }
}

export function saveCard(card: Card): Card[] {
  const cards = getStoredCards();
  const index = cards.findIndex((c) => c.id === card.id);
  let updated: Card[];
  if (index >= 0) {
    updated = [...cards];
    updated[index] = card;
  } else {
    updated = [card, ...cards];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updated));
  }

  // Cập nhật lại số lượng thẻ trong Deck
  updateDeckCardCount(card.deck_id);
  return updated;
}

export function saveMultipleCards(newCards: Card[]): Card[] {
  const existing = getStoredCards();
  const existingIds = new Set(existing.map((c) => c.id));
  const toAdd = newCards.filter((c) => !existingIds.has(c.id));
  const updated = [...toAdd, ...existing];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updated));
  }

  // Update counts for affected decks
  const affectedDecks = new Set(newCards.map((c) => c.deck_id));
  affectedDecks.forEach((deckId) => updateDeckCardCount(deckId));

  return updated;
}

export function deleteCard(cardId: string): Card[] {
  const cards = getStoredCards();
  const target = cards.find((c) => c.id === cardId);
  const updated = cards.filter((c) => c.id !== cardId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updated));
  }
  if (target) {
    updateDeckCardCount(target.deck_id);
  }
  return updated;
}

function updateDeckCardCount(deckId: string) {
  const allCards = getStoredCards();
  const count = allCards.filter((c) => c.deck_id === deckId).length;
  const decks = getStoredDecks();
  const idx = decks.findIndex((d) => d.id === deckId);
  if (idx >= 0) {
    decks[idx].total_cards = count;
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  }
}

// ================= DAILY STACK QUEUE =================
export function getDailyStackQueue(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_QUEUE);
    if (!raw) {
      // Mặc định nạp 4 từ mẫu vào stack nếu queue rỗng
      const initialQueue = ['card-1', 'card-2', 'card-3', 'card-4'];
      localStorage.setItem(STORAGE_KEYS.DAILY_QUEUE, JSON.stringify(initialQueue));
      return initialQueue;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function pushToDailyStack(cardId: string): string[] {
  const queue = getDailyStackQueue();
  if (!queue.includes(cardId)) {
    const updated = [...queue, cardId];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DAILY_QUEUE, JSON.stringify(updated));
    }
    return updated;
  }
  return queue;
}

export function pushMultipleToDailyStack(cardIds: string[]): string[] {
  const queue = getDailyStackQueue();
  const queueSet = new Set(queue);
  const toAdd = cardIds.filter((id) => !queueSet.has(id));
  const updated = [...queue, ...toAdd];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.DAILY_QUEUE, JSON.stringify(updated));
  }
  return updated;
}

export function removeFromDailyStack(cardId: string): string[] {
  const queue = getDailyStackQueue().filter((id) => id !== cardId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.DAILY_QUEUE, JSON.stringify(queue));
  }
  return queue;
}

// ================= DAILY STREAK & GOAL PROGRESS =================
export function getDailyStreak(): DailyStreakData {
  const defaultStreak: DailyStreakData = {
    count: 1,
    lastCompletedDate: new Date().toISOString().split('T')[0],
    todayCompletedWords: 3,
  };
  if (typeof window === 'undefined') return defaultStreak;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!raw) return defaultStreak;
    const data: DailyStreakData = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];

    if (data.lastCompletedDate !== today) {
      // Nếu qua ngày mới, reset số từ đã học hôm nay
      return {
        count: data.count,
        lastCompletedDate: today,
        todayCompletedWords: 0,
      };
    }
    return data;
  } catch {
    return defaultStreak;
  }
}

export function recordCompletedWord(): DailyStreakData {
  const current = getDailyStreak();
  const today = new Date().toISOString().split('T')[0];
  const updatedWords = current.todayCompletedWords + 1;

  const updated: DailyStreakData = {
    count: current.count,
    lastCompletedDate: today,
    todayCompletedWords: updatedWords,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
  }
  return updated;
}

// ================= USER SETTINGS =================
export function getStoredSettings(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredSettings(profile: Partial<UserProfile>): UserProfile {
  const current = getStoredSettings();
  const updated = { ...current, ...profile };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  }
  return updated;
}

// ================= KNOWN WORDS SET =================
export function getKnownWordsSet(): Set<string> {
  const cards = getStoredCards();
  const words = new Set<string>();
  for (const card of cards) {
    words.add(card.hanzi);
  }
  return words;
}
