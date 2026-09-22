/**
 * Bộ bóc tách và phân tích từ vựng tiếng Trung (Chinese Tokenizer & Extractor)
 * Sử dụng Intl.Segmenter chuẩn ECMAScript hiện đại, không cần tải model NLP nặng
 */

export interface TokenizedWord {
  word: string;
  isChinese: boolean;
  isKnown: boolean;
  frequency: number;
}

// Regex nhận diện ký tự Chữ Hán (CJK Unified Ideographs)
const CJK_REGEX = /[\u4e00-\u9fa5]/;

export function isChineseCharacter(char: string): boolean {
  return CJK_REGEX.test(char);
}

export function containsChinese(text: string): boolean {
  return CJK_REGEX.test(text);
}

/**
 * Tách đoạn văn thành các từ vựng tiếng Trung và phân loại từ đã biết / từ mới
 * @param text Đoạn văn bản đầu vào
 * @param knownWordsSet Tập hợp các từ người dùng đã học
 */
export function segmentChineseText(
  text: string,
  knownWordsSet: Set<string>
): {
  segments: Array<{ text: string; isWord: boolean; isKnown: boolean }>;
  newWords: TokenizedWord[];
  knownWords: TokenizedWord[];
} {
  const segments: Array<{ text: string; isWord: boolean; isKnown: boolean }> = [];
  const wordFreqMap = new Map<string, number>();

  // Sử dụng Intl.Segmenter nếu môi trường hỗ trợ (Chrome, Edge, Safari, Firefox 125+, Node 16+)
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    // @ts-ignore
    const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
    // @ts-ignore
    const words = segmenter.segment(text);

    for (const { segment, isWordLike } of words) {
      const isCn = containsChinese(segment);
      const isWord = Boolean(isWordLike && isCn);
      const isKnown = isWord ? knownWordsSet.has(segment) : false;

      segments.push({
        text: segment,
        isWord,
        isKnown,
      });

      if (isWord) {
        wordFreqMap.set(segment, (wordFreqMap.get(segment) || 0) + 1);
      }
    }
  } else {
    // Fallback regex segmentation cho các trình duyệt rất cũ
    const tokens = text.match(/[\u4e00-\u9fa5]{1,4}|[^\u4e00-\u9fa5]+/g) || [text];
    for (const token of tokens) {
      const isCn = containsChinese(token);
      const isKnown = isCn ? knownWordsSet.has(token) : false;

      segments.push({
        text: token,
        isWord: isCn,
        isKnown,
      });

      if (isCn) {
        wordFreqMap.set(token, (wordFreqMap.get(token) || 0) + 1);
      }
    }
  }

  const newWords: TokenizedWord[] = [];
  const knownWords: TokenizedWord[] = [];

  for (const [word, frequency] of wordFreqMap.entries()) {
    const isKnown = knownWordsSet.has(word);
    const item: TokenizedWord = {
      word,
      isChinese: true,
      isKnown,
      frequency,
    };
    if (isKnown) {
      knownWords.push(item);
    } else {
      newWords.push(item);
    }
  }

  // Sắp xếp từ mới theo tần suất xuất hiện giảm dần
  newWords.sort((a, b) => b.frequency - a.frequency);
  knownWords.sort((a, b) => b.frequency - a.frequency);

  return {
    segments,
    newWords,
    knownWords,
  };
}
