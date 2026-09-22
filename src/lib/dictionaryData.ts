import { Card, Deck } from '@/types';

export const HSK_LEVEL_INFOS = [
  { level: 0, label: 'Chưa học HSK (Người mới bắt đầu)', countDesc: 'Chưa có từ nền' },
  { level: 1, label: 'HSK 1 (Chuẩn 3.0)', countDesc: '~500 từ nền tảng' },
  { level: 2, label: 'HSK 2 (Chuẩn 3.0)', countDesc: '~1272 từ giao tiếp' },
  { level: 3, label: 'HSK 3 (Chuẩn 3.0)', countDesc: '~2245 từ trung cấp' },
  { level: 4, label: 'HSK 4 (Chuẩn 3.0)', countDesc: '~3245 từ mở rộng' },
  { level: 5, label: 'HSK 5 (Chuẩn 3.0)', countDesc: '~4316 từ cao cấp' },
  { level: 6, label: 'HSK 6 (Chuẩn 3.0)', countDesc: '~5456 từ chuyên sâu' },
];

export const INITIAL_CARDS: Card[] = [
  // ================= HSK 1 =================
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
      },
    ],
  },
  {
    id: 'card-hsk1-9',
    deck_id: 'deck-hsk1',
    hanzi: '天气',
    pinyin: 'tiānqì',
    han_viet: 'Thiên Khí',
    meaning_vi: 'Thời tiết',
    radical: '大 (Đại) / 气 (Khí)',
    stroke_count: 8,
    hsk_level: 1,
    examples: [{ hanzi: '今天天气很好。', pinyin: 'Jīntiān tiānqì hěn hǎo.', meaning_vi: 'Hôm nay thời tiết rất đẹp.' }],
  },
  {
    id: 'card-hsk1-10',
    deck_id: 'deck-hsk1',
    hanzi: '吃饭',
    pinyin: 'chīfàn',
    han_viet: 'Ngật Phạn',
    meaning_vi: 'Ăn cơm / Dùng bữa',
    radical: '口 (Khẩu) / 饣 (Thực)',
    stroke_count: 13,
    hsk_level: 1,
    examples: [{ hanzi: '你吃饭了吗？', pinyin: 'Nǐ chīfàn le ma?', meaning_vi: 'Bạn đã ăn cơm chưa?' }],
  },
  {
    id: 'card-hsk1-11',
    deck_id: 'deck-hsk1',
    hanzi: '老师',
    pinyin: 'lǎoshī',
    han_viet: 'Lão Sư',
    meaning_vi: 'Thầy cô giáo',
    radical: '老 (Lão) / 巾 (Cân)',
    stroke_count: 12,
    hsk_level: 1,
    examples: [{ hanzi: '王老师教我们中文。', pinyin: 'Wáng lǎoshī jiāo wǒmen zhōngwén.', meaning_vi: 'Thầy Vương dạy chúng tôi tiếng Trung.' }],
  },
  {
    id: 'card-hsk1-12',
    deck_id: 'deck-hsk1',
    hanzi: '学生',
    pinyin: 'xuésheng',
    han_viet: 'Học Sinh',
    meaning_vi: 'Học sinh / Sinh viên',
    radical: '子 (Tử) / 生 (Sinh)',
    stroke_count: 13,
    hsk_level: 1,
    examples: [{ hanzi: '他们都是大学生。', pinyin: 'Tāmen dōu shì dàxuéshēng.', meaning_vi: 'Họ đều là sinh viên đại học.' }],
  },

  // ================= HSK 2 =================
  {
    id: 'card-hsk2-1',
    deck_id: 'deck-hsk2',
    hanzi: '准备',
    pinyin: 'zhǔnbèi',
    han_viet: 'Chuẩn Bị',
    meaning_vi: 'Chuẩn bị / Sẵn sàng',
    radical: '冫 (Băng) / 亻 (Nhân)',
    stroke_count: 17,
    hsk_level: 2,
    examples: [{ hanzi: '你准备好了吗？', pinyin: 'Nǐ zhǔnbèi hǎo le ma?', meaning_vi: 'Bạn đã chuẩn bị xong chưa?' }],
  },
  {
    id: 'card-hsk2-2',
    deck_id: 'deck-hsk2',
    hanzi: '旅游',
    pinyin: 'lǚyóu',
    han_viet: 'Lữ Du',
    meaning_vi: 'Du lịch',
    radical: '方 (Phương) / 氵 (Thủy)',
    stroke_count: 22,
    hsk_level: 2,
    examples: [{ hanzi: '下个月我们去北京旅游。', pinyin: 'Xià gè yuè wǒmen qù Běijīng lǚyóu.', meaning_vi: 'Tháng sau chúng tôi đi du lịch Bắc Kinh.' }],
  },
  {
    id: 'card-hsk2-3',
    deck_id: 'deck-hsk2',
    hanzi: '帮助',
    pinyin: 'bāngzhù',
    han_viet: 'Bang Trợ',
    meaning_vi: 'Giúp đỡ / Hỗ trợ',
    radical: '巾 (Cân) / 力 (Lực)',
    stroke_count: 16,
    hsk_level: 2,
    examples: [{ hanzi: '互相帮助很重要。', pinyin: 'Hùxiāng bāngzhù hěn zhòngyào.', meaning_vi: 'Giúp đỡ lẫn nhau rất quan trọng.' }],
  },
  {
    id: 'card-hsk2-4',
    deck_id: 'deck-hsk2',
    hanzi: '运动',
    pinyin: 'yùndòng',
    han_viet: 'Vận Động',
    meaning_vi: 'Vận động / Tập thể thao',
    radical: '辶 (Xước) / 力 (Lực)',
    stroke_count: 13,
    hsk_level: 2,
    examples: [{ hanzi: '每天运动对身体有好处。', pinyin: 'Měitiān yùndòng duì shēntǐ yǒu hǎochu.', meaning_vi: 'Vận động mỗi ngày có lợi cho sức khỏe.' }],
  },
  {
    id: 'card-hsk2-5',
    deck_id: 'deck-hsk2',
    hanzi: '机场',
    pinyin: 'jīchǎng',
    han_viet: 'Cơ Trường',
    meaning_vi: 'Sân bay',
    radical: '木 (Mộc) / 土 (Thổ)',
    stroke_count: 10,
    hsk_level: 2,
    examples: [{ hanzi: '我正在去机场的路上。', pinyin: 'Wǒ zhèngzài qù jīchǎng de lùshang.', meaning_vi: 'Tôi đang trên đường tới sân bay.' }],
  },

  // ================= HSK 3 =================
  {
    id: 'card-hsk3-1',
    deck_id: 'deck-hsk3',
    hanzi: '提高',
    pinyin: 'tígāo',
    han_viet: 'Đề Cao',
    meaning_vi: 'Nâng cao / Cải thiện',
    radical: '扌 (Thủ) / 高 (Cao)',
    stroke_count: 22,
    hsk_level: 3,
    examples: [{ hanzi: '每天练习能提高汉语水平。', pinyin: 'Měitiān liànxí néng tígāo hànyǔ shuǐpíng.', meaning_vi: 'Luyện tập mỗi ngày có thể nâng cao trình độ tiếng Trung.' }],
  },
  {
    id: 'card-hsk3-2',
    deck_id: 'deck-hsk3',
    hanzi: '坚持',
    pinyin: 'jiānchí',
    han_viet: 'Kiên Trì',
    meaning_vi: 'Kiên trì / Bền bỉ',
    radical: '土 (Thổ) / 扌 (Thủ)',
    stroke_count: 18,
    hsk_level: 3,
    examples: [{ hanzi: '只要坚持，就能成功。', pinyin: 'Zhǐyào jiānchí, jiù néng chénggōng.', meaning_vi: 'Chỉ cần kiên trì, ắt sẽ thành công.' }],
  },
  {
    id: 'card-hsk3-3',
    deck_id: 'deck-hsk3',
    hanzi: '环境',
    pinyin: 'huánjìng',
    han_viet: 'Hoàn Cảnh',
    meaning_vi: 'Môi trường',
    radical: '王 (Ngọc) / 土 (Thổ)',
    stroke_count: 19,
    hsk_level: 3,
    examples: [{ hanzi: '我们要保护生态环境。', pinyin: 'Wǒmen yào bǎohù shēngtài huánjìng.', meaning_vi: 'Chúng ta cần bảo vệ môi trường sinh thái.' }],
  },
  {
    id: 'card-hsk3-4',
    deck_id: 'deck-hsk3',
    hanzi: '解决',
    pinyin: 'jiějué',
    han_viet: 'Giải Quyết',
    meaning_vi: 'Giải quyết (vấn đề)',
    radical: '角 (Giác) / 冫 (Băng)',
    stroke_count: 19,
    hsk_level: 3,
    examples: [{ hanzi: '这个问题很难解决。', pinyin: 'Zhè ge wèntí hěn nán jiějué.', meaning_vi: 'Vấn đề này rất khó giải quyết.' }],
  },

  // ================= HSK 4 =================
  {
    id: 'card-hsk4-1',
    deck_id: 'deck-hsk4',
    hanzi: '积累',
    pinyin: 'jīlěi',
    han_viet: 'Tích Lũy',
    meaning_vi: 'Tích lũy / Gom góp',
    radical: '禾 (Hòa) / 糸 (Mịch)',
    stroke_count: 21,
    hsk_level: 4,
    examples: [{ hanzi: '学习需要不断积累经验。', pinyin: 'Xuéxí xūyào bùduàn jīlěi jīngyàn.', meaning_vi: 'Học tập cần không ngừng tích lũy kinh nghiệm.' }],
  },
  {
    id: 'card-hsk4-2',
    deck_id: 'deck-hsk4',
    hanzi: '交流',
    pinyin: 'jiāoliú',
    han_viet: 'Giao Lưu',
    meaning_vi: 'Giao lưu / Trao đổi',
    radical: '亠 (Đầu) / 氵 (Thủy)',
    stroke_count: 16,
    hsk_level: 4,
    examples: [{ hanzi: '多跟中国人交流能提高口语。', pinyin: 'Duō gēn Zhōngguórén jiāoliú néng tígāo kǒuyǔ.', meaning_vi: 'Giao lưu nhiều với người Trung Quốc sẽ nâng cao khẩu ngữ.' }],
  },
  {
    id: 'card-hsk4-3',
    deck_id: 'deck-hsk4',
    hanzi: '适应',
    pinyin: 'shìyìng',
    han_viet: 'Thích Ứng',
    meaning_vi: 'Thích nghi / Thích ứng',
    radical: '辶 (Xước) / 广 (Quảng)',
    stroke_count: 16,
    hsk_level: 4,
    examples: [{ hanzi: '他很快适应了新环境。', pinyin: 'Tā hěn kuài shìyìng le xīn huánjìng.', meaning_vi: 'Anh ấy rất nhanh chóng thích nghi với môi trường mới.' }],
  },

  // ================= HSK 5 =================
  {
    id: 'card-hsk5-1',
    deck_id: 'deck-hsk5',
    hanzi: '面临',
    pinyin: 'miànlín',
    han_viet: 'Diện Lâm',
    meaning_vi: 'Đối mặt / Đứng trước (thử thách)',
    radical: '面 (Diện) / 卜 (Bặc)',
    stroke_count: 18,
    hsk_level: 5,
    examples: [{ hanzi: '我们面临着新的机遇和挑战。', pinyin: 'Wǒmen miànlín zhe xīn de jīyù hé tiǎozhàn.', meaning_vi: 'Chúng ta đang đối mặt với những cơ hội và thách thức mới.' }],
  },
  {
    id: 'card-hsk5-2',
    deck_id: 'deck-hsk5',
    hanzi: '独特',
    pinyin: 'dútè',
    han_viet: 'Độc Đặc',
    meaning_vi: 'Độc đáo / Riêng biệt',
    radical: '犭 (Khuyển) / 牛 (Ngưu)',
    stroke_count: 19,
    hsk_level: 5,
    examples: [{ hanzi: '这座建筑有着独特的风格。', pinyin: 'Zhè zuò jiànzhù yǒuzhe dútè de fēnggé.', meaning_vi: 'Tòa nhà này mang một phong cách độc đáo.' }],
  },

  // ================= HSK 6 & CHENGYU (THÀNH NGỮ) =================
  {
    id: 'card-hsk6-1',
    deck_id: 'deck-chengyu',
    hanzi: '马到成功',
    pinyin: 'mǎ dào chéng gōng',
    han_viet: 'Mã Đáo Thành Công',
    meaning_vi: 'Mã đáo thành công / Đạt thắng lợi tức thì',
    radical: '马 / 刂 / 戈 / 力',
    stroke_count: 19,
    hsk_level: 6,
    examples: [{ hanzi: '祝你考试顺利，马到成功！', pinyin: 'Zhù nǐ kǎoshì shùnlì, mǎ dào chéng gōng!', meaning_vi: 'Chúc bạn thi cử thuận lợi, mã đáo thành công!' }],
  },
  {
    id: 'card-hsk6-2',
    deck_id: 'deck-chengyu',
    hanzi: '半途而废',
    pinyin: 'bàn tú ér fèi',
    han_viet: 'Bán Đồ Nhi Phế',
    meaning_vi: 'Bỏ dở nửa chừng / Không kiên trì',
    radical: '十 / 辶 / 而 / 广',
    stroke_count: 28,
    hsk_level: 6,
    examples: [{ hanzi: '做事情绝不能半途而废。', pinyin: 'Zuò shìqing jué bù néng bàn tú ér fèi.', meaning_vi: 'Làm việc tuyệt đối không được bỏ dở nửa chừng.' }],
  },
  {
    id: 'card-hsk6-3',
    deck_id: 'deck-chengyu',
    hanzi: '一心一意',
    pinyin: 'yī xīn yī yì',
    han_viet: 'Nhất Tâm Nhất Ý',
    meaning_vi: 'Toàn tâm toàn ý / Một lòng một dạ',
    radical: '一 / 心 / 立',
    stroke_count: 22,
    hsk_level: 5,
    examples: [{ hanzi: '他一心一意投入到工作中。', pinyin: 'Tā yī xīn yī yì tóurù dào gōngzuò zhōng.', meaning_vi: 'Anh ấy toàn tâm toàn ý dồn vào công việc.' }],
  },
  {
    id: 'card-hsk6-4',
    deck_id: 'deck-chengyu',
    hanzi: '莫名其妙',
    pinyin: 'mò míng qí miào',
    han_viet: 'Mạc Danh Kỳ Diệu',
    meaning_vi: 'Khó hiểu / Kỳ quặc không rõ lý do',
    radical: '艹 / 口 / 八 / 女',
    stroke_count: 32,
    hsk_level: 5,
    examples: [{ hanzi: '听到这个消息，我觉得莫名其妙。', pinyin: 'Tīngdào zhè ge xiāoxi, wǒ juéde mò míng qí miào.', meaning_vi: 'Nghe tin tức này, tôi cảm thấy thật khó hiểu kỳ quặc.' }],
  },
  {
    id: 'card-hsk6-5',
    deck_id: 'deck-chengyu',
    hanzi: '卧薪尝胆',
    pinyin: 'wò xīn cháng dǎn',
    han_viet: 'Ngọa Tân Thường Đảm',
    meaning_vi: 'Nếm mật nằm gai / Kiên nhẫn chịu khổ để phục thù',
    radical: '臣 / 艹 / 口 / 月',
    stroke_count: 36,
    hsk_level: 6,
    examples: [{ hanzi: '经过多年的卧薪尝胆，他终于东山再起。', pinyin: 'Jīngguò duō nián de wò xīn cháng dǎn, tā zhōngyú dōngshānzàiqǐ.', meaning_vi: 'Trải qua nhiều năm nếm mật nằm gai, anh ấy cuối cùng đã gầy dựng lại sự nghiệp.' }],
  },
];

export const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck-hsk1',
    title: 'HSK 1 - Chữ Hán & Từ vựng Nền tảng',
    description: 'Bộ từ vựng cơ bản nhất cho người mới bắt đầu học tiếng Trung: Chào hỏi, cảm ơn, bạn bè, ngôn ngữ.',
    total_cards: 12,
    color_tag: 'emerald',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk2',
    title: 'HSK 2 - Giao tiếp & Đời sống thường nhật',
    description: 'Từ vựng giao tiếp thực tế hàng ngày: Đi lại, du lịch, chuẩn bị, hỏi thăm.',
    total_cards: 5,
    color_tag: 'cyan',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-hsk3',
    title: 'HSK 3 - Bứt phá & Nâng cao trình độ',
    description: 'Các từ vựng trừu tượng, nâng cao phản xạ câu và diễn đạt tự nhiên hơn.',
    total_cards: 4,
    color_tag: 'amber',
    created_at: new Date().toISOString(),
  },
  {
    id: 'deck-chengyu',
    title: 'Thành ngữ Trung Hoa (成语 HSK 5-6)',
    description: 'Tuyển tập các câu thành ngữ 4 chữ kinh điển và thông dụng nhất.',
    total_cards: 5,
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
