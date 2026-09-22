import { Card, ExampleSentence } from '@/types';

// Regex nhận diện ký tự Chữ Hán
const CJK_REGEX = /[\u4e00-\u9fa5]/;

export interface ConstituentPart {
  char: string;
  pinyin: string;
  han_viet: string;
  meaning_vi: string;
  radical?: string;
  isKnown?: boolean;
}

export interface CompoundAnalysis {
  hanzi: string;
  pinyin: string;
  han_viet: string;
  meaning_vi: string;
  constituents: ConstituentPart[];
  isCompound: boolean;
  notes: string;
  suggestedExample?: ExampleSentence;
}

// Từ điển mẫu một số cặp từ ghép đặc thù để sinh nghĩa tự nhiên nhất
const SPECIAL_COMPOUND_MAP: Record<string, { pinyin: string; han_viet: string; meaning_vi: string; example?: ExampleSentence }> = {
  '每天': {
    pinyin: 'měitiān',
    han_viet: 'Mỗi thiên',
    meaning_vi: 'Mỗi ngày / hàng ngày',
    example: {
      hanzi: '我每天都坚持学习汉语。',
      pinyin: 'Wǒ měitiān dōu jiānchí xuéxí hànyǔ.',
      meaning_vi: 'Tôi mỗi ngày đều kiên trì học tiếng Trung.',
    },
  },
  '每年': {
    pinyin: 'měinián',
    han_viet: 'Mỗi niên',
    meaning_vi: 'Mỗi năm / hàng năm',
    example: {
      hanzi: '他每年都去中国旅游一次。',
      pinyin: 'Tā měinián dōu qù Zhōngguó lǚyóu yí cì.',
      meaning_vi: 'Anh ấy mỗi năm đều đi Trung Quốc du lịch một lần.',
    },
  },
  '每月': {
    pinyin: 'měiyuè',
    han_viet: 'Mỗi nguyệt',
    meaning_vi: 'Mỗi tháng / hàng tháng',
    example: {
      hanzi: '我们每个月都有一次考试。',
      pinyin: 'Wǒmen měi gè yuè dōu yǒu yí cì kǎoshì.',
      meaning_vi: 'Chúng tôi mỗi tháng đều có một lần thi.',
    },
  },
  '每周': {
    pinyin: 'měizhōu',
    han_viet: 'Mỗi chu',
    meaning_vi: 'Mỗi tuần / hàng tuần',
    example: {
      hanzi: '他每周去打一次篮球。',
      pinyin: 'Tā měizhōu qù dǎ yí cì lánqiú.',
      meaning_vi: 'Anh ấy mỗi tuần đi chơi bóng rổ một lần.',
    },
  },
  '每次': {
    pinyin: 'měicì',
    han_viet: 'Mỗi thứ',
    meaning_vi: 'Mỗi lần',
    example: {
      hanzi: '每次见面他都很热情。',
      pinyin: 'Měicì jiànmiàn tā dōu hěn rèqíng.',
      meaning_vi: 'Mỗi lần gặp mặt anh ấy đều rất nhiệt tình.',
    },
  },
  '每个': {
    pinyin: 'měige',
    han_viet: 'Mỗi cá',
    meaning_vi: 'Mỗi cái / mỗi người',
    example: {
      hanzi: '每个人都有自己的梦想。',
      pinyin: 'Měi gèrén dōu yǒu zìjǐ de mèngxiǎng.',
      meaning_vi: 'Mỗi người đều có ước mơ của riêng mình.',
    },
  },
  '每人': {
    pinyin: 'měirén',
    han_viet: 'Mỗi nhân',
    meaning_vi: 'Mỗi người / mọi người',
    example: {
      hanzi: '每人发一本练习册。',
      pinyin: 'Měi rén fā yì běn liànxícè.',
      meaning_vi: 'Mỗi người phát một cuốn vở bài tập.',
    },
  },
  '很多': {
    pinyin: 'hěnduō',
    han_viet: 'Hẩn đa',
    meaning_vi: 'Rất nhiều',
    example: {
      hanzi: '这里有很多漂亮的花。',
      pinyin: 'Zhèlǐ yǒu hěnduō piàoliang de huā.',
      meaning_vi: 'Ở đây có rất nhiều hoa đẹp.',
    },
  },
  '很少': {
    pinyin: 'hěnshǎo',
    han_viet: 'Hẩn thiểu',
    meaning_vi: 'Rất ít / hiếm khi',
    example: {
      hanzi: '他平时很少看电视。',
      pinyin: 'Tā píngshí hěnshǎo kàn diànshì.',
      meaning_vi: 'Anh ấy bình thường rất ít khi xem tivi.',
    },
  },
  '学汉语': {
    pinyin: 'xué hànyǔ',
    han_viet: 'Học Hán ngữ',
    meaning_vi: 'Học tiếng Trung',
    example: {
      hanzi: '学汉语很有趣，但也需要坚持。',
      pinyin: 'Xué hànyǔ hěn yǒuqù, dàn yě xūyào jiānchí.',
      meaning_vi: 'Học tiếng Trung rất thú vị, nhưng cũng cần sự kiên trì.',
    },
  },
  '好玩': {
    pinyin: 'hǎowán',
    han_viet: 'Hảo ngoạn',
    meaning_vi: 'Vui vẻ / thú vị / hấp dẫn',
    example: {
      hanzi: '这个公园特别好玩。',
      pinyin: 'Zhège gōngyuán tèbié hǎowán.',
      meaning_vi: 'Công viên này đặc biệt vui.',
    },
  },
  '好吃': {
    pinyin: 'hǎochī',
    han_viet: 'Hảo ngật',
    meaning_vi: 'Ngon miệng / ngon (món ăn)',
    example: {
      hanzi: '中国菜真的很好吃！',
      pinyin: 'Zhōngguócài zhēnde hěn hǎochī!',
      meaning_vi: 'Món ăn Trung Quốc thực sự rất ngon!',
    },
  },
  '好看': {
    pinyin: 'hǎokàn',
    han_viet: 'Hảo khán',
    meaning_vi: 'Đẹp mắt / hay (phim ảnh, sách)',
    example: {
      hanzi: '这部电影太好看了。',
      pinyin: 'Zhè bù diànyǐng tài hǎokàn le.',
      meaning_vi: 'Bộ phim này quá là hay luôn.',
    },
  },
  '好听': {
    pinyin: 'hǎotīng',
    han_viet: 'Hảo thính',
    meaning_vi: 'Hay (âm thanh, giọng hát, bài hát)',
    example: {
      hanzi: '这首中文歌真好听。',
      pinyin: 'Zhè shǒu zhōngwén gē zhēn hǎotīng.',
      meaning_vi: 'Bài hát tiếng Trung này thật là hay.',
    },
  },
  '什么时候': {
    pinyin: 'shénmeshíhou',
    han_viet: 'Thập ma thời hậu',
    meaning_vi: 'Khi nào / lúc nào / bao giờ',
    example: {
      hanzi: '你什么时候去北京？',
      pinyin: 'Nǐ shénmeshíhou qù Běijīng?',
      meaning_vi: 'Khi nào bạn đi Bắc Kinh?',
    },
  },
  '多长时间': {
    pinyin: 'duōchángshíjiān',
    han_viet: 'Đa trường thời gian',
    meaning_vi: 'Bao lâu / trong bao lâu',
    example: {
      hanzi: '你学中文学了多长时间？',
      pinyin: 'Nǐ xué zhōngwén xué le duōcháng shíjiān?',
      meaning_vi: 'Bạn học tiếng Trung được bao lâu rồi?',
    },
  },
  '多少钱': {
    pinyin: 'duōshaoqián',
    han_viet: 'Đa thiểu tiền',
    meaning_vi: 'Bao nhiêu tiền',
    example: {
      hanzi: '请问这件衣服多少钱？',
      pinyin: 'Qǐngwèn zhè jiàn yīfu duōshao qián?',
      meaning_vi: 'Xin hỏi bộ quần áo này giá bao nhiêu tiền?',
    },
  },
  '故宫': {
    pinyin: 'Gùgōng',
    han_viet: 'Cố Cung',
    meaning_vi: 'Cố Cung / Tử Cấm Thành (Bắc Kinh)',
    example: {
      hanzi: '我和朋友一起去故宫旅游。',
      pinyin: 'Wǒ hé péngyou yìqǐ qù Gùgōng lǚyóu.',
      meaning_vi: 'Tôi cùng bạn đi du lịch Cố Cung.',
    },
  },
  '中国人': {
    pinyin: 'Zhōngguórén',
    han_viet: 'Trung Quốc nhân',
    meaning_vi: 'Người Trung Quốc',
    example: {
      hanzi: '我的汉语老师是中国人。',
      pinyin: 'Wǒ de hànyǔ lǎoshī shì Zhōngguórén.',
      meaning_vi: 'Thầy giáo tiếng Trung của tôi là người Trung Quốc.',
    },
  },
  '北京人': {
    pinyin: 'Běijīngrén',
    han_viet: 'Bắc Kinh nhân',
    meaning_vi: 'Người Bắc Kinh',
    example: {
      hanzi: '他是土生土长的北京人。',
      pinyin: 'Tā shì tǔshēngtǔzhǎng de Běijīngrén.',
      meaning_vi: 'Anh ấy là người Bắc Kinh chính gốc.',
    },
  },
  '有时候': {
    pinyin: 'yǒushíhou',
    han_viet: 'Hữu thời hậu',
    meaning_vi: 'Có lúc / đôi khi / thỉnh thoảng',
    example: {
      hanzi: '周末我有时候看电影，有时候散步。',
      pinyin: 'Zhōumò wǒ yǒushíhou kàn diànyǐng, yǒushíhou sànbù.',
      meaning_vi: 'Cuối tuần tôi có lúc xem phim, có lúc đi dạo.',
    },
  },
  '不用': {
    pinyin: 'bùyòng',
    han_viet: 'Bất dụng',
    meaning_vi: 'Không cần / đừng',
    example: {
      hanzi: '不用客气，这是我应该做的。',
      pinyin: 'Bùyòng kèqi, zhè shì wǒ yīnggāi zuò de.',
      meaning_vi: 'Không cần khách sáo, đây là việc tôi nên làm.',
    },
  },
};

/**
 * Phân tích cấu trúc từ ghép dựa trên kho từ điển có sẵn
 */
export function decomposeCompoundWord(
  word: string,
  cardsByHanzi: Map<string, Card>,
  knownWordsSet?: Set<string>
): CompoundAnalysis {
  // 1. Kiểm tra từ điển từ ghép đặc thù trước
  if (SPECIAL_COMPOUND_MAP[word]) {
    const spec = SPECIAL_COMPOUND_MAP[word];
    const constituents: ConstituentPart[] = [];

    for (const char of word) {
      if (CJK_REGEX.test(char)) {
        const charCard = cardsByHanzi.get(char);
        constituents.push({
          char,
          pinyin: charCard ? charCard.pinyin : '',
          han_viet: charCard?.han_viet || '',
          meaning_vi: charCard ? charCard.meaning_vi.split('/')[0].trim() : '',
          radical: charCard?.radical,
          isKnown: knownWordsSet ? knownWordsSet.has(char) : false,
        });
      }
    }

    const notes = `Từ ghép cấu tạo từ: ${constituents
      .map((c) => `${c.char} (${c.pinyin ? c.pinyin + ' - ' : ''}${c.meaning_vi})`)
      .join(' + ')}`;

    return {
      hanzi: word,
      pinyin: spec.pinyin,
      han_viet: spec.han_viet,
      meaning_vi: spec.meaning_vi,
      constituents,
      isCompound: true,
      notes,
      suggestedExample: spec.example,
    };
  }

  // 2. Phân tích từng chữ cấu thành (Morpheme decomposition)
  const chars = Array.from(word).filter((c) => CJK_REGEX.test(c));
  const constituents: ConstituentPart[] = [];
  const pinyins: string[] = [];
  const hanViets: string[] = [];
  const meaningSnippets: string[] = [];

  for (const char of chars) {
    const charCard = cardsByHanzi.get(char);
    const p = charCard ? charCard.pinyin.replace(/\s+/g, '') : '';
    const hv = charCard?.han_viet || '';
    const m = charCard ? charCard.meaning_vi.split('/')[0].trim() : '';

    if (p) pinyins.push(p);
    if (hv) hanViets.push(hv.charAt(0).toUpperCase() + hv.slice(1).toLowerCase());
    if (m) meaningSnippets.push(m);

    constituents.push({
      char,
      pinyin: p,
      han_viet: hv,
      meaning_vi: m,
      radical: charCard?.radical,
      isKnown: knownWordsSet ? knownWordsSet.has(char) : false,
    });
  }

  const synthesizedPinyin = pinyins.join('');
  const synthesizedHanViet = hanViets.join(' ');

  // Quy tắc tổng hợp ý nghĩa dựa trên chữ đầu/cuối
  let synthesizedMeaning = '';
  if (word.startsWith('每') && chars.length === 2) {
    const secondM = meaningSnippets[1] || 'thời gian/đối tượng';
    synthesizedMeaning = `Mỗi ${secondM} / hàng ${secondM}`;
  } else if (word.startsWith('很') && chars.length === 2) {
    const secondM = meaningSnippets[1] || 'tính từ';
    synthesizedMeaning = `Rất ${secondM}`;
  } else if (word.startsWith('好') && chars.length === 2) {
    const secondM = meaningSnippets[1] || '';
    synthesizedMeaning = `Ngon / đẹp / hay (${secondM})`;
  } else if (word.startsWith('不') && chars.length >= 2) {
    const restM = meaningSnippets.slice(1).join(' ');
    synthesizedMeaning = `Không ${restM}`;
  } else if (word.endsWith('人') && chars.length >= 2) {
    const place = meaningSnippets.slice(0, -1).join(' ');
    synthesizedMeaning = `Người ${place || word.slice(0, -1)}`;
  } else if (meaningSnippets.length > 0) {
    synthesizedMeaning = meaningSnippets.join(' + ') + ` (ghép từ ${word})`;
  } else {
    synthesizedMeaning = 'Từ ghép cấu tạo từ các chữ Hán thành phần';
  }

  const notes = `Phân tích từ ghép: ${constituents
    .map((c) => `${c.char}${c.pinyin ? ` [${c.pinyin}]` : ''}${c.meaning_vi ? `: ${c.meaning_vi}` : ''}`)
    .join(' + ')}`;

  return {
    hanzi: word,
    pinyin: synthesizedPinyin || word,
    han_viet: synthesizedHanViet,
    meaning_vi: synthesizedMeaning,
    constituents,
    isCompound: chars.length >= 2,
    notes,
  };
}

/**
 * Tìm hoặc tự động tổng hợp đầy đủ thông tin của một từ (thay thế hoàn toàn dummy card 'tra cứu pinyin...')
 */
export function resolveCardForWord(
  word: string,
  allCards: Card[],
  knownWordsSet?: Set<string>,
  contextSentence?: string
): Card {
  // 1. Nếu có thẻ bài trùng khớp chính xác trong kho từ
  const existing = allCards.find((c) => c.hanzi === word);
  if (existing) {
    return existing;
  }

  // 2. Tạo Map tra cứu chữ Hán đơn lẻ
  const cardsByHanzi = new Map<string, Card>();
  for (const c of allCards) {
    if (!cardsByHanzi.has(c.hanzi)) {
      cardsByHanzi.set(c.hanzi, c);
    }
  }

  // 3. Phân tích từ ghép
  const analysis = decomposeCompoundWord(word, cardsByHanzi, knownWordsSet);

  const examples: ExampleSentence[] = [];
  if (analysis.suggestedExample) {
    examples.push(analysis.suggestedExample);
  } else if (contextSentence) {
    examples.push({
      hanzi: contextSentence.slice(0, 50),
      pinyin: '',
      meaning_vi: 'Ngữ cảnh trong đoạn văn trích xuất',
    });
  }

  return {
    id: `card-compound-${encodeURIComponent(word)}-${Date.now()}`,
    deck_id: 'deck-hsk1',
    hanzi: word,
    pinyin: analysis.pinyin,
    han_viet: analysis.han_viet,
    meaning_vi: analysis.meaning_vi,
    examples,
    radical: analysis.constituents[0]?.radical || '',
    notes: analysis.notes,
    hsk_level: 1,
    created_at: new Date().toISOString(),
  };
}
