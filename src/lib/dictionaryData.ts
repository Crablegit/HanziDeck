import { Card, Deck } from '@/types';

export const INITIAL_CARDS: Card[] = [
  {
    id: 'card-1',
    deck_id: 'deck-hsk1',
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    han_viet: 'Nhĩ Hảo',
    meaning_vi: 'Xin chào',
    meaning_en: 'Hello / Hi',
    radical: '亻 (Nhân đứng) / 女 (Nữ)',
    stroke_count: 13,
    hsk_level: 1,
    examples: [
      {
        hanzi: '你好，很高兴认识你！',
        pinyin: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ!',
        meaning_vi: 'Xin chào, rất vui được làm quen với bạn!',
        meaning_en: 'Hello, nice to meet you!',
      },
    ],
  },
  {
    id: 'card-2',
    deck_id: 'deck-hsk1',
    hanzi: '谢谢',
    pinyin: 'xièxie',
    han_viet: 'Tạ Tạ',
    meaning_vi: 'Cảm ơn',
    meaning_en: 'Thank you / Thanks',
    radical: '讠 (Ngôn)',
    stroke_count: 12,
    hsk_level: 1,
    examples: [
      {
        hanzi: '谢谢你的帮助。',
        pinyin: 'Xièxie nǐ de bāngzhù.',
        meaning_vi: 'Cảm ơn sự giúp đỡ của bạn.',
        meaning_en: 'Thank you for your help.',
      },
    ],
  },
  {
    id: 'card-3',
    deck_id: 'deck-hsk1',
    hanzi: '不客气',
    pinyin: 'bù kèqi',
    han_viet: 'Bất Khách Khí',
    meaning_vi: 'Đừng khách sáo / Không có gì',
    meaning_en: "You're welcome",
    radical: '一 (Nhất) / 宀 (Miên) / 气 (Khí)',
    stroke_count: 17,
    hsk_level: 1,
    examples: [
      {
        hanzi: '不用谢，不客气！',
        pinyin: 'Bú yòng xiè, bù kèqi!',
        meaning_vi: 'Không cần cảm ơn, đừng khách sáo!',
        meaning_en: "No need to thank, you're welcome!",
      },
    ],
  },
  {
    id: 'card-4',
    deck_id: 'deck-hsk1',
    hanzi: '再见',
    pinyin: 'zàijiàn',
    han_viet: 'Tái Kiến',
    meaning_vi: 'Tạm biệt / Hẹn gặp lại',
    meaning_en: 'Goodbye / See you again',
    radical: '冂 (Quynh) / 见 (Kiến)',
    stroke_count: 10,
    hsk_level: 1,
    examples: [
      {
        hanzi: '明天见，再见！',
        pinyin: 'Míngtiān jiàn, zàijiàn!',
        meaning_vi: 'Ngày mai gặp lại, tạm biệt nhé!',
        meaning_en: 'See you tomorrow, goodbye!',
      },
    ],
  },
  {
    id: 'card-5',
    deck_id: 'deck-hsk1',
    hanzi: '中国',
    pinyin: 'Zhōngguó',
    han_viet: 'Trung Quốc',
    meaning_vi: 'Trung Quốc',
    meaning_en: 'China',
    radical: '丨 (Cổn) / 囗 (Vi)',
    stroke_count: 12,
    hsk_level: 1,
    examples: [
      {
        hanzi: '我想去中国旅游。',
        pinyin: 'Wǒ xiǎng qù Zhōngguó lǚyóu.',
        meaning_vi: 'Tôi muốn đi du lịch Trung Quốc.',
        meaning_en: 'I want to travel to China.',
      },
    ],
  },
  {
    id: 'card-6',
    deck_id: 'deck-hsk1',
    hanzi: '汉语',
    pinyin: 'hànyǔ',
    han_viet: 'Hán Ngữ',
    meaning_vi: 'Tiếng Trung / Tiếng Hán',
    meaning_en: 'Chinese language',
    radical: '氵 (Ba chấm thủy) / 讠 (Ngôn)',
    stroke_count: 14,
    hsk_level: 1,
    examples: [
      {
        hanzi: '学汉语很有趣。',
        pinyin: 'Xué hànyǔ hěn yǒuqù.',
        meaning_vi: 'Học tiếng Trung rất thú vị.',
        meaning_en: 'Learning Chinese is very interesting.',
      },
    ],
  },
  {
    id: 'card-7',
    deck_id: 'deck-hsk1',
    hanzi: '朋友',
    pinyin: 'péngyou',
    han_viet: 'Bằng Hữu',
    meaning_vi: 'Bạn bè',
    meaning_en: 'Friend',
    radical: '月 (Nguyệt) / 又 (Hựu)',
    stroke_count: 12,
    hsk_level: 1,
    examples: [
      {
        hanzi: '他是我的好朋友。',
        pinyin: 'Tā shì wǒ de hǎo péngyou.',
        meaning_vi: 'Anh ấy là bạn tốt của tôi.',
        meaning_en: 'He is my good friend.',
      },
    ],
  },
  {
    id: 'card-8',
    deck_id: 'deck-hsk1',
    hanzi: '喜欢',
    pinyin: 'xǐhuan',
    han_viet: 'Hỉ Hoan',
    meaning_vi: 'Thích / Yêu thích',
    meaning_en: 'To like',
    radical: '口 (Khẩu) / 欠 (Khiếm)',
    stroke_count: 18,
    hsk_level: 1,
    examples: [
      {
        hanzi: '我很喜欢喝中国茶。',
        pinyin: 'Wǒ hěn xǐhuan hē Zhōngguó chá.',
        meaning_vi: 'Tôi rất thích uống trà Trung Quốc.',
        meaning_en: 'I like drinking Chinese tea very much.',
      },
    ],
  },
  {
    id: 'card-9',
    deck_id: 'deck-hsk2',
    hanzi: '准备',
    pinyin: 'zhǔnbèi',
    han_viet: 'Chuẩn Bị',
    meaning_vi: 'Chuẩn bị / Sẵn sàng',
    meaning_en: 'To prepare / Ready',
    radical: '冫 (Băng) / 亻 (Nhân)',
    stroke_count: 17,
    hsk_level: 2,
    examples: [
      {
        hanzi: '你准备好了吗？',
        pinyin: 'Nǐ zhǔnbèi hǎo le ma?',
        meaning_vi: 'Bạn đã chuẩn bị xong chưa?',
        meaning_en: 'Are you ready?',
      },
    ],
  },
  {
    id: 'card-10',
    deck_id: 'deck-hsk2',
    hanzi: '旅游',
    pinyin: 'lǚyóu',
    han_viet: 'Lữ Du',
    meaning_vi: 'Du lịch',
    meaning_en: 'Travel / Tour',
    radical: '方 (Phương) / 氵 (Thủy)',
    stroke_count: 22,
    hsk_level: 2,
    examples: [
      {
        hanzi: '下个月我们去北京旅游。',
        pinyin: 'Xià gè yuè wǒmen qù Běijīng lǚyóu.',
        meaning_vi: 'Tháng sau chúng tôi đi du lịch Bắc Kinh.',
        meaning_en: 'Next month we will travel to Beijing.',
      },
    ],
  },
  {
    id: 'card-11',
    deck_id: 'deck-hsk3',
    hanzi: '提高',
    pinyin: 'tígāo',
    han_viet: 'Đề Cao',
    meaning_vi: 'Nâng cao / Cải thiện',
    meaning_en: 'To improve / To raise',
    radical: '扌 (Thủ) / 高 (Cao)',
    stroke_count: 22,
    hsk_level: 3,
    examples: [
      {
        hanzi: '每天练习能提高汉语水平。',
        pinyin: 'Měitiān liànxí néng tígāo hànyǔ shuǐpíng.',
        meaning_vi: 'Luyện tập mỗi ngày có thể nâng cao trình độ tiếng Trung.',
        meaning_en: 'Daily practice can improve Chinese proficiency.',
      },
    ],
  },
  {
    id: 'card-12',
    deck_id: 'deck-hsk3',
    hanzi: '坚持',
    pinyin: 'jiānchí',
    han_viet: 'Kiên Trì',
    meaning_vi: 'Kiên trì / Bền bỉ',
    meaning_en: 'To persist / To persevere',
    radical: '土 (Thổ) / 扌 (Thủ)',
    stroke_count: 18,
    hsk_level: 3,
    examples: [
      {
        hanzi: '只要坚持，就能成功。',
        pinyin: 'Zhǐyào jiānchí, jiù néng chénggōng.',
        meaning_vi: 'Chỉ cần kiên trì, ắt sẽ thành công.',
        meaning_en: 'As long as you persist, you can succeed.',
      },
    ],
  },
];

export const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck-hsk1',
    title: 'HSK 1 - Chữ Hán & Từ vựng Nền tảng',
    description: 'Bộ từ vựng cơ bản nhất cho người mới bắt đầu học tiếng Trung: Chào hỏi, cảm ơn, bạn bè, ngôn ngữ.',
    total_cards: 8,
    color_tag: 'emerald',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk2',
    title: 'HSK 2 - Giao tiếp & Đời sống thường nhật',
    description: 'Từ vựng giao tiếp thực tế hàng ngày: Đi lại, du lịch, chuẩn bị, hỏi thăm.',
    total_cards: 2,
    color_tag: 'cyan',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk3',
    title: 'HSK 3 - Bứt phá & Nâng cao trình độ',
    description: 'Các từ vựng trừu tượng, nâng cao phản xạ câu và diễn đạt tự nhiên hơn.',
    total_cards: 2,
    color_tag: 'amber',
    created_at: new Date().toISOString(),
  },
];

/**
 * Tìm kiếm từ vựng trong kho từ điển
 */
export function searchDictionary(query: string, allCards: Card[] = INITIAL_CARDS): Card[] {
  const q = query.trim().toLowerCase();
  if (!q) return allCards.slice(0, 20);

  return allCards.filter((card) => {
    return (
      card.hanzi.includes(q) ||
      card.pinyin.toLowerCase().includes(q) ||
      (card.han_viet && card.han_viet.toLowerCase().includes(q)) ||
      card.meaning_vi.toLowerCase().includes(q) ||
      (card.meaning_en && card.meaning_en.toLowerCase().includes(q))
    );
  });
}
