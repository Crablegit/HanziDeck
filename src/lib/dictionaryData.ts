import { Card, Deck } from '@/types';
import hskVocabulary from '@/data/hsk_vocabulary.json';
import { resolveCardForWord } from './compoundAnalyzer';

export const HSK_LEVEL_INFOS = [
  { level: 0, label: 'Chưa học HSK (Người mới bắt đầu)', countDesc: 'Chưa có từ nền' },
  { level: 1, label: 'HSK 1 (Chuẩn 3.0)', countDesc: '500+ từ nền tảng' },
  { level: 2, label: 'HSK 2 (Chuẩn 3.0)', countDesc: '1200+ từ giao tiếp' },
  { level: 3, label: 'HSK 3 (Chuẩn 3.0)', countDesc: '2200+ từ trung cấp' },
  { level: 4, label: 'HSK 4 (Chuẩn 3.0)', countDesc: '3200+ từ mở rộng' },
  { level: 5, label: 'HSK 5 (Chuẩn 3.0)', countDesc: '4300+ từ cao cấp' },
  { level: 6, label: 'HSK 6 (Chuẩn 3.0)', countDesc: '5400+ từ chuyên sâu' },
];

export const COMMON_COMPOUND_WORDS: Card[] = [
  {
    id: 'compound-meitian',
    deck_id: 'deck-hsk1',
    hanzi: '每天',
    pinyin: 'měitiān',
    han_viet: 'Mỗi thiên',
    meaning_vi: 'Mỗi ngày / hàng ngày',
    radical: '母',
    hsk_level: 1,
    notes: 'Từ ghép: 每 (měi: mỗi / mọi) + 天 (tiān: ngày / trời)',
    examples: [
      {
        hanzi: '我每天都坚持学习汉语。',
        pinyin: 'Wǒ měitiān dōu jiānchí xuéxí hànyǔ.',
        meaning_vi: 'Tôi mỗi ngày đều kiên trì học tiếng Trung.',
      },
    ],
  },
  {
    id: 'compound-meinian',
    deck_id: 'deck-hsk1',
    hanzi: '每年',
    pinyin: 'měinián',
    han_viet: 'Mỗi niên',
    meaning_vi: 'Mỗi năm / hàng năm',
    radical: '母',
    hsk_level: 1,
    notes: 'Từ ghép: 每 (mỗi) + 年 (năm)',
    examples: [
      {
        hanzi: '他每年都去中国旅游一次。',
        pinyin: 'Tā měinián dōu qù Zhōngguó lǚyóu yí cì.',
        meaning_vi: 'Anh ấy mỗi năm đều đi Trung Quốc du lịch một lần.',
      },
    ],
  },
  {
    id: 'compound-meiyue',
    deck_id: 'deck-hsk1',
    hanzi: '每月',
    pinyin: 'měiyuè',
    han_viet: 'Mỗi nguyệt',
    meaning_vi: 'Mỗi tháng / hàng tháng',
    radical: '母',
    hsk_level: 1,
    notes: 'Từ ghép: 每 (mỗi) + 月 (tháng)',
    examples: [
      {
        hanzi: '我们每个月都有一次考试。',
        pinyin: 'Wǒmen měi gè yuè dōu yǒu yí cì kǎoshì.',
        meaning_vi: 'Chúng tôi mỗi tháng đều có một bài kiểm tra.',
      },
    ],
  },
  {
    id: 'compound-meizhou',
    deck_id: 'deck-hsk1',
    hanzi: '每周',
    pinyin: 'měizhōu',
    han_viet: 'Mỗi chu',
    meaning_vi: 'Mỗi tuần / hàng tuần',
    radical: '母',
    hsk_level: 1,
    notes: 'Từ ghép: 每 (mỗi) + 周 (tuần)',
    examples: [
      {
        hanzi: '他每周去打一次篮球。',
        pinyin: 'Tā měizhōu qù dǎ yí cì lánqiú.',
        meaning_vi: 'Anh ấy mỗi tuần đi chơi bóng rổ một lần.',
      },
    ],
  },
  {
    id: 'compound-meici',
    deck_id: 'deck-hsk1',
    hanzi: '每次',
    pinyin: 'měicì',
    han_viet: 'Mỗi thứ',
    meaning_vi: 'Mỗi lần',
    radical: '母',
    hsk_level: 1,
    notes: 'Từ ghép: 每 (mỗi) + 次 (lần)',
    examples: [
      {
        hanzi: '每次见面他都很热情。',
        pinyin: 'Měicì jiànmiàn tā dōu hěn rèqíng.',
        meaning_vi: 'Mỗi lần gặp mặt anh ấy đều rất niềm nở.',
      },
    ],
  },
  {
    id: 'compound-meige',
    deck_id: 'deck-hsk1',
    hanzi: '每个',
    pinyin: 'měige',
    han_viet: 'Mỗi cá',
    meaning_vi: 'Mỗi cái / mỗi người',
    radical: '母',
    hsk_level: 1,
    notes: 'Từ ghép: 每 (mỗi) + 个 (lượng từ)',
    examples: [
      {
        hanzi: '每个人都有自己的梦想。',
        pinyin: 'Měi gèrén dōu yǒu zìjǐ de mèngxiǎng.',
        meaning_vi: 'Mỗi người đều có ước mơ riêng của mình.',
      },
    ],
  },
  {
    id: 'compound-meiren',
    deck_id: 'deck-hsk1',
    hanzi: '每人',
    pinyin: 'měirén',
    han_viet: 'Mỗi nhân',
    meaning_vi: 'Mỗi người / mọi người',
    radical: '母',
    hsk_level: 1,
    notes: 'Từ ghép: 每 (mỗi) + 人 (người)',
    examples: [
      {
        hanzi: '每人发一份资料。',
        pinyin: 'Měi rén fā yí fèn zīliào.',
        meaning_vi: 'Mỗi người phát một phần tài liệu.',
      },
    ],
  },
  {
    id: 'compound-henduo',
    deck_id: 'deck-hsk1',
    hanzi: '很多',
    pinyin: 'hěnduō',
    han_viet: 'Hẩn đa',
    meaning_vi: 'Rất nhiều',
    radical: '彳',
    hsk_level: 1,
    notes: 'Từ ghép: 很 (rất) + 多 (nhiều)',
    examples: [
      {
        hanzi: '今天来了很多朋友。',
        pinyin: 'Jīntiān lái le hěnduō péngyou.',
        meaning_vi: 'Hôm nay có rất nhiều bạn bè tới.',
      },
    ],
  },
  {
    id: 'compound-henshao',
    deck_id: 'deck-hsk1',
    hanzi: '很少',
    pinyin: 'hěnshǎo',
    han_viet: 'Hẩn thiểu',
    meaning_vi: 'Rất ít / hiếm khi',
    radical: '彳',
    hsk_level: 1,
    notes: 'Từ ghép: 很 (rất) + 少 (ít)',
    examples: [
      {
        hanzi: '他平时很少说话。',
        pinyin: 'Tā píngshí hěnshǎo shuōhuà.',
        meaning_vi: 'Anh ấy bình thường rất ít khi nói chuyện.',
      },
    ],
  },
  {
    id: 'compound-xuehanyu',
    deck_id: 'deck-hsk1',
    hanzi: '学汉语',
    pinyin: 'xué hànyǔ',
    han_viet: 'Học Hán ngữ',
    meaning_vi: 'Học tiếng Trung',
    radical: '子',
    hsk_level: 1,
    notes: 'Từ ghép: 学 (học) + 汉语 (tiếng Trung)',
    examples: [
      {
        hanzi: '学汉语很有趣。',
        pinyin: 'Xué hànyǔ hěn yǒuqù.',
        meaning_vi: 'Học tiếng Trung rất thú vị.',
      },
    ],
  },
  {
    id: 'compound-haowan',
    deck_id: 'deck-hsk1',
    hanzi: '好玩',
    pinyin: 'hǎowán',
    han_viet: 'Hảo ngoạn',
    meaning_vi: 'Vui vẻ / thú vị / hấp dẫn',
    radical: '女',
    hsk_level: 1,
    notes: 'Từ ghép: 好 (tốt) + 玩 (chơi)',
    examples: [
      {
        hanzi: '这个地方真好玩。',
        pinyin: 'Zhège dìfang zhēn hǎowán.',
        meaning_vi: 'Địa điểm này thực sự rất vui.',
      },
    ],
  },
  {
    id: 'compound-haochi',
    deck_id: 'deck-hsk1',
    hanzi: '好吃',
    pinyin: 'hǎochī',
    han_viet: 'Hảo ngật',
    meaning_vi: 'Ngon miệng / ngon (đồ ăn)',
    radical: '女',
    hsk_level: 1,
    notes: 'Từ ghép: 好 (tốt) + 吃 (ăn)',
    examples: [
      {
        hanzi: '饺子真好吃！',
        pinyin: 'Jiǎozi zhēn hǎochī!',
        meaning_vi: 'Sủi cảo ngon quá!',
      },
    ],
  },
  {
    id: 'compound-haokan',
    deck_id: 'deck-hsk1',
    hanzi: '好看',
    pinyin: 'hǎokàn',
    han_viet: 'Hảo khán',
    meaning_vi: 'Đẹp mắt / hay (phim, sách)',
    radical: '女',
    hsk_level: 1,
    notes: 'Từ ghép: 好 (tốt) + 看 (xem)',
    examples: [
      {
        hanzi: '这件衣服很好看。',
        pinyin: 'Zhè jiàn yīfu hěn hǎokàn.',
        meaning_vi: 'Bộ quần áo này rất đẹp.',
      },
    ],
  },
  {
    id: 'compound-shenmeshihou',
    deck_id: 'deck-hsk1',
    hanzi: '什么时候',
    pinyin: 'shénmeshíhou',
    han_viet: 'Thập ma thời hậu',
    meaning_vi: 'Khi nào / lúc nào / bao giờ',
    radical: '亻',
    hsk_level: 1,
    notes: 'Từ ghép: 什么 (cái gì) + 时候 (lúc/thời gian)',
    examples: [
      {
        hanzi: '你什么时候回国？',
        pinyin: 'Nǐ shénmeshíhou huíguó?',
        meaning_vi: 'Khi nào bạn về nước?',
      },
    ],
  },
  {
    id: 'compound-duochangshijian',
    deck_id: 'deck-hsk2',
    hanzi: '多长时间',
    pinyin: 'duōchángshíjiān',
    han_viet: 'Đa trường thời gian',
    meaning_vi: 'Bao lâu / thời gian bao lâu',
    radical: '夕',
    hsk_level: 2,
    notes: 'Từ ghép: 多长 (dài bao nhiêu) + 时间 (thời gian)',
    examples: [
      {
        hanzi: '你学中文学了多长时间？',
        pinyin: 'Nǐ xué zhōngwén xué le duōcháng shíjiān?',
        meaning_vi: 'Bạn học tiếng Trung được bao lâu rồi?',
      },
    ],
  },
  {
    id: 'compound-gugong',
    deck_id: 'deck-hsk3',
    hanzi: '故宫',
    pinyin: 'Gùgōng',
    han_viet: 'Cố Cung',
    meaning_vi: 'Cố Cung / Tử Cấm Thành (Bắc Kinh)',
    radical: '攵',
    hsk_level: 3,
    notes: 'Địa danh: Cố Cung / Tử Cấm Thành',
    examples: [
      {
        hanzi: '我和朋友一起去故宫旅游。',
        pinyin: 'Wǒ hé péngyou yìqǐ qù Gùgōng lǚyóu.',
        meaning_vi: 'Tôi và bạn cùng nhau đi Cố Cung du lịch.',
      },
    ],
  },
  {
    id: 'compound-zhongguoren',
    deck_id: 'deck-hsk1',
    hanzi: '中国人',
    pinyin: 'Zhōngguórén',
    han_viet: 'Trung Quốc nhân',
    meaning_vi: 'Người Trung Quốc',
    radical: '丨',
    hsk_level: 1,
    notes: 'Từ ghép: 中国 (Trung Quốc) + 人 (người)',
    examples: [
      {
        hanzi: '他是中国人。',
        pinyin: 'Tā shì Zhōngguórén.',
        meaning_vi: 'Anh ấy là người Trung Quốc.',
      },
    ],
  },
  {
    id: 'compound-beijingren',
    deck_id: 'deck-hsk1',
    hanzi: '北京人',
    pinyin: 'Běijīngrén',
    han_viet: 'Bắc Kinh nhân',
    meaning_vi: 'Người Bắc Kinh',
    radical: '亠',
    hsk_level: 1,
    notes: 'Từ ghép: 北京 (Bắc Kinh) + 人 (người)',
    examples: [
      {
        hanzi: '她是地道的北京人。',
        pinyin: 'Tā shì dìdao de Běijīngrén.',
        meaning_vi: 'Cô ấy là người Bắc Kinh chính gốc.',
      },
    ],
  },
  {
    id: 'compound-buyong',
    deck_id: 'deck-hsk1',
    hanzi: '不用',
    pinyin: 'bùyòng',
    han_viet: 'Bất dụng',
    meaning_vi: 'Không cần',
    radical: '一',
    hsk_level: 1,
    notes: 'Từ ghép: 不 (không) + 用 (dùng/cần)',
    examples: [
      {
        hanzi: '不用谢，这是我应该做的。',
        pinyin: 'Búyòng xiè, zhè shì wǒ yīnggāi zuò de.',
        meaning_vi: 'Không cần cảm ơn, đây là việc tôi nên làm.',
      },
    ],
  },
  {
    id: 'compound-youshihou',
    deck_id: 'deck-hsk2',
    hanzi: '有时候',
    pinyin: 'yǒushíhou',
    han_viet: 'Hữu thời hậu',
    meaning_vi: 'Đôi khi / có lúc / thỉnh thoảng',
    radical: '月',
    hsk_level: 2,
    notes: 'Từ ghép: 有 (có) + 时候 (lúc)',
    examples: [
      {
        hanzi: '我有时候喜欢一个人看书。',
        pinyin: 'Wǒ yǒushíhou xǐhuan yí gèrén kànshū.',
        meaning_vi: 'Tôi có lúc thích đọc sách một mình.',
      },
    ],
  },
];

export const INITIAL_CARDS: Card[] = [
  ...COMMON_COMPOUND_WORDS,
  ...(hskVocabulary as Card[]),
];

export const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck-my-vocabulary',
    title: 'Sổ từ vựng cá nhân (Từ mới của tôi)',
    description: 'Nơi lưu trữ các từ vựng mới do bạn tự lưu, trích xuất từ đoạn văn hoặc thêm vào trong quá trình học tập.',
    total_cards: 0,
    color_tag: 'emerald',
    is_system: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk1',
    title: 'HSK 1 - Chữ Hán & Từ vựng Nền tảng (Chuẩn 3.0)',
    description: 'Bộ từ vựng sơ cấp chuẩn quốc tế HSK 3.0: Chào hỏi, số đếm, gia đình, thời gian, ăn uống, sinh hoạt cơ bản.',
    total_cards: 506 + COMMON_COMPOUND_WORDS.filter((c) => c.hsk_level === 1).length,
    color_tag: 'emerald',
    is_system: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk2',
    title: 'HSK 2 - Giao tiếp & Đời sống Thường nhật (Chuẩn 3.0)',
    description: 'Từ vựng giao tiếp thực tế hàng ngày: Đi lại, du lịch, mua sắm, hỏi thăm, cảm xúc và các mối quan hệ xã hội.',
    total_cards: 750 + COMMON_COMPOUND_WORDS.filter((c) => c.hsk_level === 2).length,
    color_tag: 'cyan',
    is_system: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk3',
    title: 'HSK 3 - Bứt phá & Nâng cao Trình độ (Chuẩn 3.0)',
    description: 'Các từ vựng trung cấp, cấu trúc câu biểu đạt linh hoạt, công việc, học tập, trao đổi ý kiến và lối sống.',
    total_cards: 953 + COMMON_COMPOUND_WORDS.filter((c) => c.hsk_level === 3).length,
    color_tag: 'amber',
    is_system: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk4',
    title: 'HSK 4 - Mở rộng Ngôn ngữ & Thảo luận Xã hội (Chuẩn 3.0)',
    description: 'Từ vựng trung cao cấp: Thảo luận sâu rộng về các chủ đề đời sống, công nghệ, văn hóa, kinh tế và môi trường.',
    total_cards: 972,
    color_tag: 'blue',
    is_system: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk5',
    title: 'HSK 5 - Đọc hiểu Báo chí & Thuyết trình Chuyên nghiệp (Chuẩn 3.0)',
    description: 'Từ vựng cao cấp: Đọc hiểu văn bản học thuật, tin tức báo chí, diễn thuyết lưu loát bằng tiếng Trung chuẩn mực.',
    total_cards: 1059,
    color_tag: 'rose',
    is_system: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk6',
    title: 'HSK 6 - Chuyên sâu & Tinh thông Ngôn ngữ (Chuẩn 3.0)',
    description: 'Từ vựng thượng thừa và chuyên ngành: Thành thạo toàn diện mọi lĩnh vực, tư duy và biểu đạt như người bản xứ.',
    total_cards: 1123,
    color_tag: 'indigo',
    is_system: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-chengyu',
    title: 'Thành ngữ Trung Hoa (成语 HSK 5-6)',
    description: 'Tuyển tập các câu thành ngữ 4 chữ kinh điển, nguồn gốc điển cố và ứng dụng tinh tế trong văn viết.',
    total_cards: 12,
    color_tag: 'purple',
    is_system: true,
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
 * Tìm kiếm từ vựng trong kho từ điển (kèm tự động phân tích từ ghép nếu chưa có trong danh mục)
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

  // Nếu không có kết quả khớp chính xác chữ Hán và từ tìm kiếm là từ ghép chữ Hán (>= 2 chữ)
  if (exactMatches.length === 0 && /[\u4e00-\u9fa5]{2,}/.test(query.trim())) {
    const resolvedCompound = resolveCardForWord(query.trim(), allCards);
    if (resolvedCompound && resolvedCompound.pinyin !== query.trim()) {
      exactMatches.unshift(resolvedCompound);
    }
  }

  return [...exactMatches, ...startMatches, ...otherMatches].slice(0, 50);
}
