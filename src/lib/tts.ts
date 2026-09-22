/**
 * Audio / TTS Engine cho HanziDeck
 * 1. Web Speech API (Ưu tiên số 1: 0đ, 0MB, giọng chuẩn Beijing bản xứ trên Chrome/Edge/Safari/iOS/Android)
 * 2. On-demand Dynamic TTS URL fallback (Google Translate TTS / Edge TTS stream)
 * 3. External audio URL (nếu thẻ từ có sẵn link âm thanh thu âm người thật)
 */

export interface SpeechOptions {
  rate?: number; // 0.7 - 1.2
  pitch?: number; // 0.8 - 1.2
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function playChineseAudio(
  text: string,
  externalAudioUrl?: string,
  options?: SpeechOptions
): void {
  if (typeof window === 'undefined') return;

  // Giải pháp 3: Nếu có sẵn external URL thu âm người thật
  if (externalAudioUrl && externalAudioUrl.startsWith('http')) {
    try {
      const audio = new Audio(externalAudioUrl);
      if (options?.onStart) audio.onplay = () => options.onStart?.();
      if (options?.onEnd) audio.onended = () => options.onEnd?.();
      if (options?.onError) audio.onerror = (e) => options.onError?.(e);
      audio.play().catch(() => {
        fallbackWebSpeech(text, options);
      });
      return;
    } catch {
      // Fallback
    }
  }

  // Giải pháp 1: Web Speech API chuẩn trình duyệt
  if ('speechSynthesis' in window) {
    try {
      fallbackWebSpeech(text, options);
      return;
    } catch {
      // Fallback sang giải pháp 2
    }
  }

  // Giải pháp 2: Dynamic TTS Stream URL
  playDynamicTtsFallback(text, options);
}

function fallbackWebSpeech(text: string, options?: SpeechOptions): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    playDynamicTtsFallback(text, options);
    return;
  }

  window.speechSynthesis.cancel(); // Hủy các âm thanh đang phát dở

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = options?.rate ?? 0.85; // Tốc độ hơi chậm một chút để người học nghe rõ thanh điệu
  utterance.pitch = options?.pitch ?? 1.0;

  // Tìm giọng đọc tiếng Trung chất lượng cao nếu có (ví dụ: Google 普通话, Microsoft Xiaoxiao, Tingting, v.v.)
  const voices = window.speechSynthesis.getVoices();
  const chineseVoice = voices.find(
    (v) => v.lang.startsWith('zh') || v.lang.includes('CN') || v.lang.includes('cmn')
  );
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  if (options?.onStart) utterance.onstart = () => options.onStart?.();
  if (options?.onEnd) utterance.onend = () => options.onEnd?.();
  utterance.onerror = (e) => {
    // Nếu Web Speech API bị lỗi trên thiết bị cũ, fallback sang Dynamic TTS
    playDynamicTtsFallback(text, options);
  };

  window.speechSynthesis.speak(utterance);
}

function playDynamicTtsFallback(text: string, options?: SpeechOptions): void {
  try {
    const encoded = encodeURIComponent(text);
    // Dynamic stream từ Google Translate TTS audio endpoint
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=${encoded}`;
    const audio = new Audio(url);
    if (options?.onStart) audio.onplay = () => options.onStart?.();
    if (options?.onEnd) audio.onended = () => options.onEnd?.();
    if (options?.onError) audio.onerror = (e) => options.onError?.(e);
    audio.play().catch((err) => {
      options?.onError?.(err);
    });
  } catch (err) {
    options?.onError?.(err);
  }
}
