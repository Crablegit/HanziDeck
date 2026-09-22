export type Language = 'vi' | 'en' | 'zh';

export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface ExampleSentence {
  hanzi: string;
  pinyin: string;
  meaning_vi: string;
  meaning_en?: string;
}

export interface Card {
  id: string;
  deck_id: string;
  hanzi: string;
  pinyin: string;
  han_viet?: string;
  meaning_vi: string;
  meaning_en?: string;
  examples: ExampleSentence[];
  hsk_level?: HskLevel;
  radical?: string;
  stroke_count?: number;
  audio_url?: string;
  notes?: string;
  created_at?: string;
}

export interface Deck {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  is_public?: boolean;
  color_tag?: string;
  total_cards: number;
  is_system?: boolean;
  created_at: string;
  updated_at?: string;
}

export type CardProgressStatus = 'queued' | 'learning' | 'reviewing' | 'mastered';

export interface CardProgress {
  card_id: string;
  status: CardProgressStatus;
  repetitions: number;
  last_studied_at?: string;
  next_review_at: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  display_name?: string;
  daily_goal: number;
  user_hsk_baseline?: number; // 0 (beginner) to 6
  theme_id: string;
  glass_blur: number; // in px: 0 to 30
  glass_opacity: number; // in percent: 40 to 95
  language: Language;
}

export interface ColorProfile {
  id: string;
  name: {
    vi: string;
    en: string;
    zh: string;
  };
  primary: string; // Main brand & interactive elements
  primaryHover: string;
  secondary: string; // Supporting color / badges / highlights
  accent: string; // Contrast / vibrant call-to-actions
  bgTint: string; // Background atmosphere tint
  surface: string; // Glass surface base
  text: string;
  textMuted: string;
  border: string;
  isDark: boolean;
}

export interface QuizQuestion {
  id: string;
  card: Card;
  type: 'hanzi_to_meaning' | 'meaning_to_hanzi' | 'audio_to_hanzi';
  prompt: string;
  correctAnswer: string;
  options: string[];
}

export interface GrammarAnalysisResult {
  isCorrect: boolean;
  originalText: string;
  correctedText: string;
  pinyin: string;
  explanation: string;
  issues: Array<{
    type: string;
    original: string;
    replacement: string;
    reason: string;
  }>;
  enhancements: Array<{
    sentence: string;
    pinyin: string;
    meaning: string;
    style: string;
  }>;
}

export interface PronunciationAnalysisResult {
  text: string;
  pinyinWithTones: string;
  toneSandhiRules: Array<{
    character: string;
    originalTone: string;
    actualTone: string;
    rule: string;
  }>;
  difficultSounds: Array<{
    pinyin: string;
    ipa: string;
    mouthTip: string;
    vietnameseEquivalent: string;
  }>;
  practiceGuide: string;
  accuracyScore?: number;
  userSpeechFeedback?: string;
}
