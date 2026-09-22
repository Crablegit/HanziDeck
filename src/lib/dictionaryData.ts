import { Card, Deck } from '@/types';
import hskVocabulary from '@/data/hsk_vocabulary.json';

export const HSK_LEVEL_INFOS = [
  { level: 0, label: 'Chưa học HSK (Người mới bắt đầu)', countDesc: 'Chưa có từ nền' },
  { level: 1, label: 'HSK 1 (Chuẩn 3.0)', countDesc: '500+ từ nền tảng' },
  { level: 2, label: 'HSK 2 (Chuẩn 3.0)', countDesc: '1200+ từ giao tiếp' },
  { level: 3, label: 'HSK 3 (Chuẩn 3.0)', countDesc: '2200+ từ trung cấp' },
  { level: 4, label: 'HSK 4 (Chuẩn 3.0)', countDesc: '3200+ từ mở rộng' },
  { level: 5, label: 'HSK 5 (Chuẩn 3.0)', countDesc: '4300+ từ cao cấp' },
  { level: 6, label: 'HSK 6 (Chuẩn 3.0)', countDesc: '5400+ từ chuyên sâu' },
];

export const INITIAL_CARDS: Card[] = hskVocabulary as Card[];

export const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck-hsk1',
    title: 'HSK 1 - Chữ Hán & Từ vựng Nền tảng (Chuẩn 3.0)',
    description: 'Bộ từ vựng sơ cấp chuẩn quốc tế HSK 3.0: Chào hỏi, số đếm, gia đình, thời gian, ăn uống, sinh hoạt cơ bản.',
    total_cards: 506,
    color_tag: 'emerald',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk2',
    title: 'HSK 2 - Giao tiếp & Đời sống Thường nhật (Chuẩn 3.0)',
    description: 'Từ vựng giao tiếp thực tế hàng ngày: Đi lại, du lịch, mua sắm, hỏi thăm, cảm xúc và các mối quan hệ xã hội.',
    total_cards: 750,
    color_tag: 'cyan',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk3',
    title: 'HSK 3 - Bứt phá & Nâng cao Trình độ (Chuẩn 3.0)',
    description: 'Các từ vựng trung cấp, cấu trúc câu biểu đạt linh hoạt, công việc, học tập, trao đổi ý kiến và lối sống.',
    total_cards: 953,
    color_tag: 'amber',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk4',
    title: 'HSK 4 - Mở rộng Ngôn ngữ & Thảo luận Xã hội (Chuẩn 3.0)',
    description: 'Từ vựng trung cao cấp: Thảo luận sâu rộng về các chủ đề đời sống, công nghệ, văn hóa, kinh tế và môi trường.',
    total_cards: 972,
    color_tag: 'blue',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk5',
    title: 'HSK 5 - Đọc hiểu Báo chí & Thuyết trình Chuyên nghiệp (Chuẩn 3.0)',
    description: 'Từ vựng cao cấp: Đọc hiểu văn bản học thuật, tin tức báo chí, diễn thuyết lưu loát bằng tiếng Trung chuẩn mực.',
    total_cards: 1059,
    color_tag: 'rose',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk6',
    title: 'HSK 6 - Chuyên sâu & Tinh thông Ngôn ngữ (Chuẩn 3.0)',
    description: 'Từ vựng thượng thừa và chuyên ngành: Thành thạo toàn diện mọi lĩnh vực, tư duy và biểu đạt như người bản xứ.',
    total_cards: 1123,
    color_tag: 'indigo',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-chengyu',
    title: 'Thành ngữ Trung Hoa (成语 HSK 5-6)',
    description: 'Tuyển tập các câu thành ngữ 4 chữ kinh điển, nguồn gốc điển cố và ứng dụng tinh tế trong văn viết.',
    total_cards: 12,
    color_tag: 'purple',
    created_at: new Date().toISOString(),
  },
];

/**
 * Tập hợp từ vựng thuộc các cấp HSK (phục vụ Baseline tự động mark đã biết)
 */
export function getHskBaselineWords(baselineLevel: number): Set<string> {
  const words = new Set<string>();
  if (baselineLevel <= 0) return words;

  INITIAL_CARDS.forEach((card) => {
    if (card.hsk_level && card.hsk_level <= baselineLevel) {
      words.add(card.hanzi);
      // Add individual characters if multi-character word
      for (const char of card.hanzi) {
        words.add(char);
      }
    }
  });

  return words;
}

/**
 * Tìm kiếm từ vựng trong kho từ điển
 */
export function searchDictionary(query: string, allCards: Card[] = INITIAL_CARDS): Card[] {
  const q = query.trim().toLowerCase();
  if (!q) return allCards.slice(0, 30);

  // Prioritize exact hanzi match first, then prefix, then general substring
  const exactMatches: Card[] = [];
  const startMatches: Card[] = [];
  const otherMatches: Card[] = [];

  for (const card of allCards) {
    const hanzi = card.hanzi.toLowerCase();
    const pinyin = card.pinyin.toLowerCase();
    const hanViet = card.han_viet ? card.han_viet.toLowerCase() : '';
    const meaningVi = card.meaning_vi ? card.meaning_vi.toLowerCase() : '';
    const meaningEn = card.meaning_en ? card.meaning_en.toLowerCase() : '';

    if (hanzi === q) {
      exactMatches.push(card);
    } else if (hanzi.startsWith(q) || pinyin.startsWith(q) || (hanViet && hanViet.startsWith(q))) {
      startMatches.push(card);
    } else if (
      hanzi.includes(q) ||
      pinyin.includes(q) ||
      hanViet.includes(q) ||
      meaningVi.includes(q) ||
      meaningEn.includes(q)
    ) {
      otherMatches.push(card);
    }

    if (exactMatches.length + startMatches.length + otherMatches.length >= 100) {
      break;
    }
  }

  return [...exactMatches, ...startMatches, ...otherMatches].slice(0, 50);
}
