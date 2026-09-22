import { GrammarAnalysisResult, PronunciationAnalysisResult, Language } from '@/types';

/**
 * Gọi Google Gemini API trực tiếp từ trình duyệt của người dùng với khóa API lưu trong Cookie.
 * Sử dụng mô hình gemini-3.5-flash-lite (hoặc gemini-1.5-flash làm fallback).
 */

const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODEL = 'gemini-1.5-flash';

async function callGeminiApi(apiKey: string, prompt: string, systemInstruction?: string): Promise<string> {
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const cleanKey = apiKey.trim();
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL, 'gemini-2.5-flash-lite'];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      const payload: any = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errJson = await res.json().catch(() => null);
        lastError = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      }
    } catch (e: any) {
      lastError = e?.message || 'Network error';
    }
  }

  throw new Error(lastError || 'Failed to call Gemini API');
}

/**
 * Kiểm tra tính hợp lệ của API Key
 */
export async function testGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await callGeminiApi(apiKey, 'Hello, answer with "OK".');
    return res.toLowerCase().includes('ok') || res.length > 0;
  } catch {
    return false;
  }
}

/**
 * Kiểm tra Ngữ pháp & Đưa ra gợi ý nâng cao (Enhance)
 */
export async function checkChineseGrammar(
  text: string,
  apiKey: string,
  uiLanguage: Language = 'vi'
): Promise<GrammarAnalysisResult> {
  const langPrompt =
    uiLanguage === 'vi'
      ? 'Giải thích bằng Tiếng Việt thân thiện, rõ ràng, dễ hiểu.'
      : uiLanguage === 'zh'
      ? '请使用中文进行详细清晰的解析。'
      : 'Explain in clear English.';

  const systemInstruction = `Bạn là một giáo sư ngôn ngữ học tiếng Trung cao cấp kiêm chuyên gia luyện thi HSK 6. 
Nhiệm vụ của bạn là kiểm tra ngữ pháp tiếng Trung, tìm lỗi dùng từ, trật tự câu, lượng từ, và đưa ra các phiên bản nâng cấp (enhancement) câu văn trở nên tự nhiên, chuẩn bản xứ hoặc nâng cao theo phong cách HSK 5-6 / Thành ngữ (成语).
${langPrompt}
BẮT BUỘC trả về định dạng JSON thuần túy (không bọc text ngoài JSON), cấu trúc:
{
  "isCorrect": boolean,
  "originalText": string,
  "correctedText": string,
  "pinyin": string,
  "explanation": string,
  "issues": [
    {
      "type": "Loại lỗi (Trật tự từ, Lượng từ, Giới từ, Ngữ nghĩa...)",
      "original": "phần bị sai",
      "replacement": "phần sửa lại",
      "reason": "lý do sửa chi tiết"
    }
  ],
  "enhancements": [
    {
      "sentence": "câu diễn đạt nâng cao/tự nhiên hơn",
      "pinyin": "pinyin đầy đủ thanh điệu",
      "meaning": "nghĩa của câu nâng cao",
      "style": "Phong cách (Chuẩn bản xứ khẩu ngữ / Trang trọng văn viết / Thành ngữ nâng cao)"
    }
  ]
}`;

  const prompt = `Phân tích câu hoặc đoạn văn tiếng Trung sau đây:
"${text}"`;

  const raw = await callGeminiApi(apiKey, prompt, systemInstruction);
  return parseJsonSafe<GrammarAnalysisResult>(raw, {
    isCorrect: true,
    originalText: text,
    correctedText: text,
    pinyin: '',
    explanation: 'Không có lỗi ngữ pháp nghiêm trọng.',
    issues: [],
    enhancements: [],
  });
}

/**
 * Kiểm tra & Hướng dẫn Phát âm Chuyên sâu (Pronunciation & Accent Coach)
 */
export async function analyzeChinesePronunciation(
  text: string,
  apiKey: string,
  uiLanguage: Language = 'vi',
  spokenTranscript?: string
): Promise<PronunciationAnalysisResult> {
  const langPrompt =
    uiLanguage === 'vi'
      ? 'Giải thích bằng Tiếng Việt, đặc biệt lưu ý các mẹo phát âm so sánh với ngữ âm tiếng Việt.'
      : uiLanguage === 'zh'
      ? '请用中文提供发音要领和变调指导。'
      : 'Explain in English with clear vocal positioning tips.';

  const systemInstruction = `Bạn là chuyên gia huấn luyện phát âm tiếng Trung phổ thông (Standard Mandarin Pronunciation Coach).
Nhiệm vụ của bạn là phân tích sâu về ngữ âm, phiên âm Pinyin, các quy tắc biến điệu thanh điệu (Tone Sandhi: 不, 一, 2 thanh 3 liền nhau, thanh nhẹ 轻声), và chỉ ra các âm khó (như zh/ch/sh vs z/c/s; j/q/x; âm tròn môi ü; âm uốn lưỡi er/r).
${spokenTranscript ? `Người học đã phát âm và nhận diện giọng nói được: "${spokenTranscript}". Hãy chấm điểm độ chính xác (0-100) và nhận xét lỗi lệch âm.` : ''}
${langPrompt}
BẮT BUỘC trả về định dạng JSON thuần túy (không bọc text ngoài JSON), cấu trúc:
{
  "text": string,
  "pinyinWithTones": string,
  "toneSandhiRules": [
    {
      "character": "từ biến điệu (ví dụ: 你, 不, 一)",
      "originalTone": "thanh gốc (ví dụ: thanh 3 / thanh 4)",
      "actualTone": "thanh đọc thực tế (ví dụ: đọc thành thanh 2)",
      "rule": "giải thích quy tắc biến điệu"
    }
  ],
  "difficultSounds": [
    {
      "pinyin": "âm tiết khó (ví dụ: zh, ch, ü)",
      "ipa": "ký hiệu quốc tế hoặc pinyin",
      "mouthTip": "hướng dẫn khẩu hình miệng, độ cuộn lưỡi và luồng hơi",
      "vietnameseEquivalent": "so sánh tương đồng hoặc khác biệt với âm tiếng Việt"
    }
  ],
  "practiceGuide": "Lời khuyên tổng quát để luyện câu này trôi chảy, đúng ngữ điệu",
  "accuracyScore": number,
  "userSpeechFeedback": string
}`;

  const prompt = `Phân tích phát âm cho văn bản tiếng Trung sau:
"${text}"
${spokenTranscript ? `Văn bản ghi nhận từ giọng nói của học viên: "${spokenTranscript}"` : ''}`;

  const raw = await callGeminiApi(apiKey, prompt, systemInstruction);
  return parseJsonSafe<PronunciationAnalysisResult>(raw, {
    text,
    pinyinWithTones: '',
    toneSandhiRules: [],
    difficultSounds: [],
    practiceGuide: 'Hãy lắng nghe âm thanh mẫu và phát âm rõ từng thanh điệu.',
  });
}

/**
 * Tra cứu Chữ Hán / Từ vựng / Thành ngữ nâng cao bằng AI Gemini 3.5 Flash Lite
 */
export async function lookupWordWithGemini(
  query: string,
  apiKey: string,
  uiLanguage: Language = 'vi'
): Promise<any | null> {
  const systemInstruction = `Bạn là từ điển Hán ngữ chuyên sâu và chuẩn HSK 3.0.
Khi người dùng nhập một từ/chữ Hán/thành ngữ hoặc từ tiếng Việt, hãy tra cứu đầy đủ thông tin chi tiết.
BẮT BUỘC trả về JSON thuần túy (không bọc text ngoài JSON):
{
  "hanzi": "chữ Hán chuẩn giản thể",
  "pinyin": "pinyin có dấu đầy đủ thanh điệu",
  "han_viet": "Âm Hán Việt",
  "meaning_vi": "Nghĩa tiếng Việt ngắn gọn, xúc tích",
  "meaning_en": "Nghĩa tiếng Anh",
  "radical": "Bộ thủ cấu tạo (tên bộ thủ)",
  "stroke_count": 10,
  "hsk_level": 1,
  "examples": [
    {
      "hanzi": "câu ví dụ tiếng Trung",
      "pinyin": "pinyin câu ví dụ",
      "meaning_vi": "nghĩa tiếng Việt câu ví dụ"
    }
  ]
}`;

  const prompt = `Tra cứu từ vựng tiếng Trung sau: "${query}"`;
  try {
    const raw = await callGeminiApi(apiKey, prompt, systemInstruction);
    const parsed = parseJsonSafe<any>(raw, null);
    if (parsed && parsed.hanzi) {
      return {
        ...parsed,
        id: `ai-lookup-${Date.now()}`,
        deck_id: 'deck-hsk1',
        stroke_count: Number(parsed.stroke_count) || 8,
        hsk_level: Number(parsed.hsk_level) || 1,
        examples: parsed.examples || [],
      };
    }
    return null;
  } catch (err) {
    console.error('Gemini word lookup failed:', err);
    throw err;
  }
}

function parseJsonSafe<T>(raw: string, fallback: T): T {
  try {
    let clean = raw.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean);
  } catch {
    return fallback;
  }
}

