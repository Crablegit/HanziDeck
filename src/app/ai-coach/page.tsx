'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Mic,
  ArrowRight,
  ShieldCheck,
  Settings,
  FileText,
} from 'lucide-react';
import { getGeminiApiKeyFromCookie } from '@/lib/cookie';
import { checkChineseGrammar, analyzeChinesePronunciation } from '@/lib/gemini';
import { getStoredSettings } from '@/lib/storage';
import AudioPlayer from '@/components/AudioPlayer';
import SpeechRecognitionButton from '@/components/SpeechRecognition';
import { GrammarAnalysisResult, PronunciationAnalysisResult } from '@/types';

export default function AiCoachPage() {
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState<'grammar' | 'pronunciation'>('grammar');
  const [settings, setSettings] = useState(getStoredSettings());

  // Grammar state
  const [grammarInput, setGrammarInput] = useState(
    '我昨天在超市买很多苹果，虽然苹果很贵，但是我还要买。'
  );
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [grammarResult, setGrammarResult] = useState<GrammarAnalysisResult | null>(null);
  const [grammarError, setGrammarError] = useState<string | null>(null);
  const [grammarCopied, setGrammarCopied] = useState(false);

  // Pronunciation state
  const [pronunciationInput, setPronunciationInput] = useState('今天天气真好，我们一起去公园散步吧。');
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [pronunciationLoading, setPronunciationLoading] = useState(false);
  const [pronunciationResult, setPronunciationResult] =
    useState<PronunciationAnalysisResult | null>(null);
  const [pronunciationError, setPronunciationError] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(getGeminiApiKeyFromCookie());
    setSettings(getStoredSettings());
  }, []);

  const handleCheckGrammar = async () => {
    if (!grammarInput.trim()) return;
    if (!apiKey) {
      setGrammarError('Vui lòng nhập Google Gemini API Key trong phần Cài đặt.');
      return;
    }

    setGrammarLoading(true);
    setGrammarError(null);
    try {
      const res = await checkChineseGrammar(grammarInput.trim(), apiKey, settings.language || 'vi');
      setGrammarResult(res);
    } catch (err: any) {
      setGrammarError(
        err?.message || 'Có lỗi xảy ra khi gọi Gemini 3.5 Flash Lite. Vui lòng kiểm tra lại API Key.'
      );
    } finally {
      setGrammarLoading(false);
    }
  };

  const handleAnalyzePronunciation = async (speechOverride?: string) => {
    const textToAnalyze = speechOverride || pronunciationInput;
    if (!textToAnalyze.trim()) return;
    if (!apiKey) {
      setPronunciationError('Vui lòng nhập Google Gemini API Key trong phần Cài đặt.');
      return;
    }

    setPronunciationLoading(true);
    setPronunciationError(null);
    try {
      const res = await analyzeChinesePronunciation(
        textToAnalyze.trim(),
        apiKey,
        settings.language || 'vi',
        speechOverride || spokenTranscript
      );
      setPronunciationResult(res);
    } catch (err: any) {
      setPronunciationError(
        err?.message || 'Có lỗi xảy ra khi gọi Gemini 3.5 Flash Lite. Vui lòng kiểm tra lại API Key.'
      );
    } finally {
      setPronunciationLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-[11px] tracking-wider uppercase">
            Gemini 3.5 Flash Lite
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-sky-400" />
          <span>Trợ lý AI Gemini: Sửa Ngữ pháp & Luyện Phát âm</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/60">
          Ứng dụng mô hình Gemini 3.5 Flash Lite tốc độ cao, hỗ trợ phân tích cấu trúc ngữ pháp, gợi ý nâng cấp diễn đạt và hướng dẫn biến điệu thanh điệu chuẩn bản xứ.
        </p>
      </div>

      {/* API Key Warning / Status banner */}
      {!apiKey ? (
        <div className="liquid-glass rounded-2xl p-5 border border-amber-400/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-amber-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Chưa cấu hình Gemini API Key</span>
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Để sử dụng tính năng Sửa ngữ pháp & Check phát âm, vui lòng nhập API Key trong phần Cài đặt.
              (Key được lưu an toàn tuyệt đối trong Cookie của bạn).
            </p>
          </div>
          <Link
            href="/settings"
            className="liquid-glass-btn px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cài đặt API Key ngay</span>
          </Link>
        </div>
      ) : (
        <div className="px-4 py-2.5 rounded-2xl liquid-glass border border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>API Key đã kích hoạt (Được lưu an toàn trong Cookie trình duyệt)</span>
          </div>
          <Link href="/settings" className="text-white/60 hover:text-white underline text-xs">
            Quản lý Key
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'grammar'
              ? 'liquid-glass-btn text-white'
              : 'liquid-glass text-white/60 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-sky-400" />
          <span>Kiểm tra & Nâng cấp Ngữ pháp</span>
        </button>
        <button
          onClick={() => setActiveTab('pronunciation')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'pronunciation'
              ? 'liquid-glass-btn text-white'
              : 'liquid-glass text-white/60 hover:text-white'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-emerald-400" />
          <span>Luyện Phát âm & Biến điệu</span>
        </button>
      </div>

      {/* ================= TAB 1: GRAMMAR COACH ================= */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          <div className="liquid-glass rounded-3xl p-6 shadow-glass border border-white/15 space-y-4">
            <label className="text-xs font-semibold text-theme-text-muted block">
              Nhập câu hoặc đoạn văn tiếng Trung cần sửa:
            </label>
            <textarea
              rows={4}
              value={grammarInput}
              onChange={(e) => setGrammarInput(e.target.value)}
              placeholder="Nhập câu tiếng Trung của bạn tại đây (ví dụ: 我喜欢学汉语)..."
              className="w-full px-4 py-3.5 rounded-2xl liquid-glass-input text-base font-sans font-chinese leading-relaxed resize-none placeholder:text-white/30 outline-none"
            />

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs text-theme-text-muted">
                {grammarInput.length} ký tự
              </span>
              <button
                type="button"
                onClick={handleCheckGrammar}
                disabled={grammarLoading || !apiKey}
                className="liquid-glass-btn px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{grammarLoading ? 'Gemini đang phân tích...' : 'Kiểm tra & Gợi ý nâng cao'}</span>
              </button>
            </div>
          </div>

          {grammarError && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
              {grammarError}
            </div>
          )}

          {/* Grammar Result */}
          {grammarResult && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Corrected sentence */}
              <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/20 space-y-4">
                <div className="flex items-center justify-between border-b border-theme-border/50 pb-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Phiên bản tiếng Trung chuẩn xác:</span>
                  </h3>
                  <AudioPlayer text={grammarResult.correctedText} size="sm" />
                </div>

                <div className="p-5 rounded-2xl bg-black/25 border border-theme-border/40 space-y-1.5">
                  <p className="text-2xl font-chinese font-bold text-emerald-200">
                    {grammarResult.correctedText}
                  </p>
                  {grammarResult.pinyin && (
                    <p className="text-sm font-mono text-amber-300">{grammarResult.pinyin}</p>
                  )}
                </div>

                {/* Explanation */}
                <div className="text-sm text-theme-text-muted leading-relaxed">
                  <strong className="text-white block mb-1">Giải thích chi tiết:</strong>
                  <p>{grammarResult.explanation}</p>
                </div>
              </div>

              {/* Identified Issues */}
              {grammarResult.issues && grammarResult.issues.length > 0 && (
                <div className="liquid-glass rounded-3xl p-6 shadow-glass border border-white/15 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Các điểm ngữ pháp cần lưu ý ({grammarResult.issues.length} lỗi):</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {grammarResult.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-black/20 border border-theme-border/40 space-y-1 text-xs"
                      >
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          {issue.type}
                        </span>
                        <div className="flex items-center gap-2 text-sm pt-1">
                          <span className="text-rose-300 line-through">{issue.original}</span>
                          <span className="text-white/40">→</span>
                          <span className="text-emerald-300 font-bold">{issue.replacement}</span>
                        </div>
                        <p className="text-theme-text-muted pt-1">{issue.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhancements */}
              {grammarResult.enhancements && grammarResult.enhancements.length > 0 && (
                <div className="liquid-glass rounded-3xl p-6 shadow-glass border border-white/15 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-cyan-300" />
                    <span>Gợi ý cách diễn đạt nâng cao / Tự nhiên hơn (Enhance):</span>
                  </h3>

                  <div className="space-y-3">
                    {grammarResult.enhancements.map((enh, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/5 border border-theme-border/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                            {enh.style}
                          </span>
                          <AudioPlayer text={enh.sentence} size="sm" />
                        </div>
                        <p className="text-lg font-chinese font-bold text-white">{enh.sentence}</p>
                        <p className="text-xs font-mono text-amber-300">{enh.pinyin}</p>
                        <p className="text-xs text-theme-text-muted">{enh.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: PRONUNCIATION COACH ================= */}
      {activeTab === 'pronunciation' && (
        <div className="space-y-6">
          <div className="liquid-glass rounded-3xl p-6 shadow-glass border border-white/15 space-y-4">
            <label className="text-xs font-semibold text-theme-text-muted block">
              Nhập từ hoặc câu tiếng Trung cần phân tích phát âm:
            </label>
            <input
              type="text"
              value={pronunciationInput}
              onChange={(e) => setPronunciationInput(e.target.value)}
              placeholder="ví dụ: 学汉语 / 你好 / 一瓶水..."
              className="w-full px-4 py-3.5 rounded-2xl liquid-glass-input text-base font-sans font-chinese outline-none placeholder:text-white/30"
            />

            {/* Microphone test section */}
            <div className="p-4 rounded-2xl bg-black/25 border border-theme-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-amber-300" />
                  Luyện nói trực tiếp bằng Microphone:
                </span>
                <p className="text-[11px] text-theme-text-muted">
                  Bấm micro và đọc to câu tiếng Trung. Trình duyệt sẽ nhận diện và Gemini sẽ chấm điểm phát âm!
                </p>
                {spokenTranscript && (
                  <p className="text-xs text-amber-300 font-mono pt-1">
                    Đã nghe: <strong>"{spokenTranscript}"</strong>
                  </p>
                )}
              </div>

              <SpeechRecognitionButton
                onTranscript={(transcript) => {
                  setSpokenTranscript(transcript);
                  handleAnalyzePronunciation(transcript);
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <AudioPlayer text={pronunciationInput} size="md" label="Nghe giọng chuẩn" />
              </div>

              <button
                type="button"
                onClick={() => handleAnalyzePronunciation()}
                disabled={pronunciationLoading || !apiKey}
                className="liquid-glass-btn px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{pronunciationLoading ? 'Đang phân tích...' : 'Phân tích Phát âm & Biến điệu'}</span>
              </button>
            </div>
          </div>

          {pronunciationError && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
              {pronunciationError}
            </div>
          )}

          {/* Pronunciation Result */}
          {pronunciationResult && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score / Accuracy banner if microphone was used */}
              {pronunciationResult.accuracyScore !== undefined && (
                <div className="liquid-glass-card rounded-3xl p-6 border border-emerald-500/30 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Điểm phát âm của bạn:</h3>
                    {pronunciationResult.userSpeechFeedback && (
                      <p className="text-xs text-theme-text-muted mt-1">
                        {pronunciationResult.userSpeechFeedback}
                      </p>
                    )}
                  </div>
                  <div className="text-3xl font-black font-mono text-emerald-300">
                    {pronunciationResult.accuracyScore} / 100
                  </div>
                </div>
              )}

              {/* Tone Sandhi Rules */}
              {pronunciationResult.toneSandhiRules && pronunciationResult.toneSandhiRules.length > 0 && (
                <div className="liquid-glass-card rounded-3xl p-6 shadow-glass border border-white/20 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Quy tắc Biến điệu Thanh điệu trong câu này:</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pronunciationResult.toneSandhiRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-black/20 border border-theme-border/40 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-chinese font-bold text-white">
                            {rule.character}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                            {rule.originalTone} → {rule.actualTone}
                          </span>
                        </div>
                        <p className="text-theme-text-muted">{rule.rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficult Sounds Breakdown */}
              {pronunciationResult.difficultSounds && pronunciationResult.difficultSounds.length > 0 && (
                <div className="liquid-glass rounded-3xl p-6 shadow-glass border border-white/15 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-cyan-300" />
                    <span>Lưu ý âm khó & Khẩu hình miệng (Dành cho người học):</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pronunciationResult.difficultSounds.map((sound, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/5 border border-theme-border/40 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-mono font-bold text-cyan-300">
                            {sound.pinyin}
                          </span>
                          <AudioPlayer text={sound.pinyin} size="sm" />
                        </div>
                        <p className="text-white font-medium">Khẩu hình: {sound.mouthTip}</p>
                        <p className="text-theme-text-muted">
                          So sánh: {sound.vietnameseEquivalent}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Practice Guide */}
              {pronunciationResult.practiceGuide && (
                <div className="p-5 rounded-2xl liquid-glass border border-theme-border/40 text-xs text-theme-text-muted leading-relaxed">
                  <strong className="text-white block mb-1">Mẹo luyện phát âm trôi chảy:</strong>
                  <p>{pronunciationResult.practiceGuide}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
