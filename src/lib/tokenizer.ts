/**
 * Bộ bóc tách và phân tích từ vựng tiếng Trung (Chinese Tokenizer & Extractor)
 * Sử dụng Intl.Segmenter chuẩn ECMAScript kết hợp thuật toán Phân rã từ ghép (Compound Decomposition)
 */

export interface TokenizedWord {
  word: string;
  isChinese: boolean;
  isKnown: boolean;
  isCompound?: boolean;
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
 * Kiểm tra xem một từ có thể phân rã hoàn toàn thành các chữ/từ Hán đã biết hay không.
 * Ví dụ: "每天" gồm "每" và "天". Nếu người dùng đã biết "每" và "天", thì "每天" là từ ghép đã biết!
 */
export function canDecomposeIntoKnown(word: string, knownWordsSet: Set<string>): boolean {
  if (knownWordsSet.has(word)) return true;
  const n = word.length;
  if (n <= 1) return false;

  // dp[i] = true nếu tiền tố word[0...i-1] có thể chia thành các từ/ký tự có trong knownWordsSet
  const dp: boolean[] = new Array(n + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j]) {
        const sub = word.slice(j, i);
        if (knownWordsSet.has(sub)) {
          dp[i] = true;
          break;
        }
      }
    }
  }

  return dp[n];
}

/**
 * Kiểm tra trạng thái đã biết của từ vựng (bao gồm kiểm tra trực tiếp và phân rã từ ghép)
 */
export function checkWordKnowledge(
  word: string,
  knownWordsSet: Set<string>
): { isKnown: boolean; isCompound: boolean } {
  if (knownWordsSet.has(word)) {
    return { isKnown: true, isCompound: false };
  }
  if (word.length >= 2 && canDecomposeIntoKnown(word, knownWordsSet)) {
    return { isKnown: true, isCompound: true };
  }
  return { isKnown: false, isCompound: false };
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
  segments: Array<{ text: string; isWord: boolean; isKnown: boolean; isCompound?: boolean }>;
  newWords: TokenizedWord[];
  knownWords: TokenizedWord[];
} {
  const segments: Array<{ text: string; isWord: boolean; isKnown: boolean; isCompound?: boolean }> = [];
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
      const knowledge = isWord
        ? checkWordKnowledge(segment, knownWordsSet)
        : { isKnown: false, isCompound: false };

      segments.push({
        text: segment,
        isWord,
        isKnown: knowledge.isKnown,
        isCompound: knowledge.isCompound,
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
      const knowledge = isCn
        ? checkWordKnowledge(token, knownWordsSet)
        : { isKnown: false, isCompound: false };

      segments.push({
        text: token,
        isWord: isCn,
        isKnown: knowledge.isKnown,
        isCompound: knowledge.isCompound,
      });

      if (isCn) {
        wordFreqMap.set(token, (wordFreqMap.get(token) || 0) + 1);
      }
    }
  }

  const newWords: TokenizedWord[] = [];
  const knownWords: TokenizedWord[] = [];

  for (const [word, frequency] of wordFreqMap.entries()) {
    const knowledge = checkWordKnowledge(word, knownWordsSet);
    const item: TokenizedWord = {
      word,
      isChinese: true,
      isKnown: knowledge.isKnown,
      isCompound: knowledge.isCompound,
      frequency,
    };
    if (knowledge.isKnown) {
      knownWords.push(item);
    } else {
      newWords.push(item);
    }
  }

  // Sắp xếp từ mới & từ đã biết theo tần suất xuất hiện giảm dần
  newWords.sort((a, b) => b.frequency - a.frequency);
  knownWords.sort((a, b) => b.frequency - a.frequency);

  return {
    segments,
    newWords,
    knownWords,
  };
}
