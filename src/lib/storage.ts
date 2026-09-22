import { Card, Deck, UserProfile, CardProgress } from '@/types';
import { INITIAL_CARDS, INITIAL_DECKS, getHskBaselineWords } from './dictionaryData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  DECKS: 'hanzideck_decks',
  CARDS: 'hanzideck_cards',
  DAILY_QUEUE: 'hanzideck_daily_queue',
  PROGRESS: 'hanzideck_progress',
  SETTINGS: 'hanzideck_settings',
  STREAK: 'hanzideck_streak',
  ONBOARDING: 'hanzideck_onboarding_done',
};

export interface DailyStreakData {
  count: number;
  lastCompletedDate: string; // YYYY-MM-DD
  todayCompletedWords: number;
}

export const DEFAULT_PROFILE: UserProfile = {
  daily_goal: 10,
  user_hsk_baseline: 0,
  theme_id: 'minimalist-slate',
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
    const parsed: Deck[] = JSON.parse(raw);
    const existingIds = new Set(parsed.map((d) => d.id));
    const missingDecks = INITIAL_DECKS.filter((d) => !existingIds.has(d.id));

    if (missingDecks.length > 0 || parsed.length < INITIAL_DECKS.length) {
      const merged = INITIAL_DECKS.map((initDeck) => {
        const found = parsed.find((p) => p.id === initDeck.id);
        return found
          ? {
              ...initDeck,
              ...found,
              is_system: initDeck.is_system,
              total_cards: Math.max(initDeck.total_cards, found.total_cards),
            }
          : initDeck;
      });
      const customDecks = parsed.filter(
        (p) => !INITIAL_DECKS.some((init) => init.id === p.id)
      );
      const finalDecks = [...merged, ...customDecks];
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(finalDecks));
      return finalDecks;
    }
    return parsed;
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
      return INITIAL_CARDS;
    }
    let parsed: Card[] = JSON.parse(raw);

    // Di chuyển các thẻ do người dùng tự lưu/trích xuất ra khỏi các bộ chuẩn HSK vào Sổ từ vựng cá nhân
    let hasMigrated = false;
    parsed = parsed.map((c) => {
      if (
        (c.id.startsWith('card-ext-') || c.id.startsWith('card-compound-') || c.id.startsWith('card-custom-')) &&
        (c.deck_id.startsWith('deck-hsk') || c.deck_id === 'deck-chengyu')
      ) {
        hasMigrated = true;
        return { ...c, deck_id: 'deck-my-vocabulary' };
      }
      return c;
    });

    const parsedHanziMap = new Map<string, Card>(parsed.map((c) => [c.hanzi, c]));
    const missingInitial = INITIAL_CARDS.filter((c) => !parsedHanziMap.has(c.hanzi));
    if (missingInitial.length > 0 || hasMigrated) {
      const merged = [...parsed, ...missingInitial];
      try {
        localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(merged));
      } catch (e) {
        console.warn('LocalStorage quota warning', e);
      }
      return merged;
    }
    return parsed;
  } catch {
    return INITIAL_CARDS;
  }
}

export function saveCard(card: Card): Card[] {
  const cards = getStoredCards();
  const index = cards.findIndex((c) => c.id === card.id || c.hanzi === card.hanzi);
  let updated: Card[];
  if (index >= 0) {
    updated = [...cards];
    updated[index] = card;
  } else {
    updated = [card, ...cards];
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
  }

  // Cập nhật lại số lượng thẻ trong Deck
  updateDeckCardCount(card.deck_id);
  return updated;
}

export function saveMultipleCards(newCards: Card[]): Card[] {
  const existing = getStoredCards();
  const existingIds = new Set(existing.map((c) => c.id));
  const existingHanzis = new Set(existing.map((c) => c.hanzi));
  const toAdd = newCards.filter((c) => !existingIds.has(c.id) && !existingHanzis.has(c.hanzi));
  const updated = [...toAdd, ...existing];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
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
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
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
    try {
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
    } catch (e) {
      console.warn('Storage quota warning', e);
    }
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

// ================= KNOWN WORDS SET (AUTO HSK 3.0 BASELINE) =================
export function getKnownWordsSet(): Set<string> {
  const settings = getStoredSettings();
  const baselineWords = getHskBaselineWords(settings.user_hsk_baseline || 0);
  const cards = getStoredCards();
  const words = new Set<string>(baselineWords);
  for (const card of cards) {
    words.add(card.hanzi);
    for (const char of card.hanzi) {
      words.add(char);
    }
  }
  return words;
}

// ================= ONBOARDING =================
export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
}

export function setOnboardingCompleted(completed: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, completed ? 'true' : 'false');
}

