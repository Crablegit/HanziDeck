'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Palette,
  Eye,
  Key,
  ShieldCheck,
  Languages,
  UserCheck,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Trash2,
  BookOpen,
  Target,
} from 'lucide-react';
import { COLOR_PROFILES, applyThemeToDocument, getThemeById } from '@/lib/themes';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredDecks,
  getStoredCards,
  getDailyStackQueue,
  getDailyStreak,
} from '@/lib/storage';
import { HSK_LEVEL_INFOS } from '@/lib/dictionaryData';
import {
  getGeminiApiKeyFromCookie,
  saveGeminiApiKeyToCookie,
  removeGeminiApiKeyFromCookie,
  maskApiKey,
} from '@/lib/cookie';
import { testGeminiApiKey } from '@/lib/gemini';
import { getTranslations } from '@/lib/i18n';
import { Language, UserProfile } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserProfile>(getStoredSettings());

  // Gemini API Key state
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [currentMaskedKey, setCurrentMaskedKey] = useState('');
  const [keySavedMessage, setKeySavedMessage] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');

  // Supabase auth state
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const s = getStoredSettings();
    setSettings(s);

    const savedKey = getGeminiApiKeyFromCookie();
    if (savedKey) {
      setCurrentMaskedKey(maskApiKey(savedKey));
    }

    // Check Supabase session if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user?.email) {
          setUserEmail(data.session.user.email);
        }
      });
    }
  }, []);

  const t = getTranslations(settings.language || 'vi');

  // ================= THEME & GLASS CONTROLS =================
  const handleSelectTheme = (themeId: string) => {
    const updated = saveStoredSettings({ theme_id: themeId });
    setSettings(updated);
    const theme = getThemeById(themeId);
    applyThemeToDocument(theme, updated.glass_blur, updated.glass_opacity);
    window.dispatchEvent(new Event('hanzideck_settings_changed'));
  };

  const handleBlurChange = (blur: number) => {
    const updated = saveStoredSettings({ glass_blur: blur });
    setSettings(updated);
    const theme = getThemeById(updated.theme_id);
    applyThemeToDocument(theme, blur, updated.glass_opacity);
    window.dispatchEvent(new Event('hanzideck_settings_changed'));
  };

  const handleOpacityChange = (opacity: number) => {
    const updated = saveStoredSettings({ glass_opacity: opacity });
    setSettings(updated);
    const theme = getThemeById(updated.theme_id);
    applyThemeToDocument(theme, updated.glass_blur, opacity);
    window.dispatchEvent(new Event('hanzideck_settings_changed'));
  };

  const handleLanguageChange = (lang: Language) => {
    const updated = saveStoredSettings({ language: lang });
    setSettings(updated);
    window.dispatchEvent(new Event('hanzideck_settings_changed'));
  };

  // ================= GEMINI API KEY CONTROLS =================
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    saveGeminiApiKeyToCookie(apiKeyInput.trim());
    setCurrentMaskedKey(maskApiKey(apiKeyInput.trim()));
    setApiKeyInput('');
    setKeySavedMessage(true);
    setTestStatus('idle');
    setTimeout(() => setKeySavedMessage(false), 3000);
  };

  const handleRemoveApiKey = () => {
    removeGeminiApiKeyFromCookie();
    setCurrentMaskedKey('');
    setApiKeyInput('');
    setTestStatus('idle');
  };

  const handleTestKey = async () => {
    const key = apiKeyInput.trim() || getGeminiApiKeyFromCookie();
    if (!key) return;

    setTestStatus('testing');
    const ok = await testGeminiApiKey(key);
    setTestStatus(ok ? 'success' : 'fail');
  };

  // ================= EXPORT & IMPORT =================
  const handleExportData = () => {
    const data = {
      decks: getStoredDecks(),
      cards: getStoredCards(),
      dailyQueue: getDailyStackQueue(),
      streak: getDailyStreak(),
      settings: getStoredSettings(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HanziDeck-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2 border-b border-theme-border/40 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-theme-secondary" />
          <span>{t.settings.title}</span>
        </h1>
        <p className="text-sm text-theme-text-muted">{t.settings.subtitle}</p>
      </div>

      {/* ================= 0. HSK BASELINE & DAILY GOAL ================= */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-500/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">
              Mục tiêu bài học & Trình độ HSK 3.0
            </h2>
            <p className="text-xs text-theme-text-muted">
              Cấu hình số từ cần học mỗi ngày và trình độ HSK nền tảng để tự động lọc từ mới trong đoạn văn
            </p>
          </div>
        </div>

        {/* Daily Goal Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-white/80 block">
            Mục tiêu từ vựng mỗi ngày:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[5, 10, 15, 20, 30].map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => {
                  const updated = saveStoredSettings({ daily_goal: goal });
                  setSettings(updated);
                  window.dispatchEvent(new Event('hanzideck_settings_changed'));
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  settings.daily_goal === goal
                    ? 'liquid-glass-btn text-white'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {goal} từ / ngày
              </button>
            ))}
          </div>
        </div>

        {/* HSK Baseline Selection */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <label className="text-xs font-semibold text-white/80 block">
            Trình độ HSK 3.0 đã nắm vững (Baseline):
          </label>
          <p className="text-[11px] text-theme-text-muted">
            Khi bạn chọn cấp HSK nào, hệ thống sẽ tự động coi tất cả từ vựng ở cấp đó và các cấp dưới là <strong>ĐÃ BIẾT</strong>. Nhờ đó, công cụ lọc từ mới trong đoạn văn sẽ chỉ highlight các từ chưa biết thuộc cấp cao hơn!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {HSK_LEVEL_INFOS.map((info) => {
              const isSelected = (settings.user_hsk_baseline || 0) === info.level;
              return (
                <button
                  key={info.level}
                  type="button"
                  onClick={() => {
                    const updated = saveStoredSettings({ user_hsk_baseline: info.level });
                    setSettings(updated);
                    window.dispatchEvent(new Event('hanzideck_settings_changed'));
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <span className="font-semibold block text-white">{info.label}</span>
                    <span className="text-[10px] opacity-60">{info.countDesc}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 1. GEMINI API KEY SECTION ================= */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base sm:text-lg">
                {t.settings.geminiSection}
              </h2>
              <span className="text-xs text-amber-300 font-medium">
                Dùng cho tính năng Sửa ngữ pháp & Check phát âm
              </span>
            </div>
          </div>
        </div>

        {/* Security Notice Box */}
        <div className="p-4 rounded-2xl bg-black/30 border border-theme-border/50 text-xs text-theme-text-muted space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Chính sách Bảo mật & Lưu trữ Cookie an toàn:</span>
          </div>
          <p className="leading-relaxed">{t.settings.geminiNotice}</p>
        </div>

        {/* Current Key Status */}
        {currentMaskedKey ? (
          <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-theme-text-muted font-medium">Khóa API đang sử dụng:</p>
                <p className="font-mono text-sm font-bold text-white tracking-wider">
                  {currentMaskedKey}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testStatus === 'testing'}
                className="px-3.5 py-1.5 rounded-xl liquid-glass hover:bg-white/20 text-xs font-semibold text-white border border-theme-border flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{testStatus === 'testing' ? 'Đang test...' : t.settings.testKey}</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveApiKey}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
                title="Xóa Key khỏi Cookie"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200">
            {t.settings.keyStatusEmpty}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSaveApiKey} className="space-y-3">
          <label className="text-xs font-semibold text-theme-text-muted block">
            {currentMaskedKey ? 'Cập nhật API Key mới:' : 'Nhập Google Gemini API Key:'}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={t.settings.apiKeyPlaceholder}
              className="flex-1 px-4 py-2.5 rounded-xl liquid-glass-input text-sm font-mono"
            />
            <button
              type="submit"
              disabled={!apiKeyInput.trim()}
              className="liquid-glass-btn px-5 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-40"
            >
              {t.settings.saveKey}
            </button>
          </div>
        </form>

        {keySavedMessage && (
          <p className="text-xs text-emerald-300 font-semibold animate-in fade-in">
            ✓ {t.settings.keyStatusSaved}
          </p>
        )}

        {testStatus === 'success' && (
          <p className="text-xs text-emerald-300 font-semibold animate-in fade-in">
            ✓ {t.settings.testKeySuccess}
          </p>
        )}

        {testStatus === 'fail' && (
          <p className="text-xs text-rose-300 font-semibold animate-in fade-in">
            ✕ {t.settings.testKeyFail}
          </p>
        )}
      </div>

      {/* ================= 2. LIQUID GLASS CONTROLS ================= */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">{t.settings.glassSection}</h2>
            <p className="text-xs text-theme-text-muted">
              Tùy chỉnh độ mờ nhạt và trong suốt hiệu ứng kính Apple (Apple Frosted Glass)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Sliders */}
          <div className="space-y-5">
            {/* Blur Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{t.settings.glassBlur}</span>
                <span className="font-mono text-emerald-300">{settings.glass_blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={settings.glass_blur}
                onChange={(e) => handleBlurChange(Number(e.target.value))}
                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-theme-primary"
              />
              <div className="flex justify-between text-[10px] text-theme-text-muted opacity-70">
                <span>0px (Trong suốt phẳng)</span>
                <span>16px (Chuẩn Apple)</span>
                <span>32px (Mờ đục sâu)</span>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{t.settings.glassOpacity}</span>
                <span className="font-mono text-cyan-300">{settings.glass_opacity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="5"
                value={settings.glass_opacity}
                onChange={(e) => handleOpacityChange(Number(e.target.value))}
                className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-theme-secondary"
              />
              <div className="flex justify-between text-[10px] text-theme-text-muted opacity-70">
                <span>30% (Nhạt mỏng)</span>
                <span>80% (Chuẩn tinh tế)</span>
                <span>95% (Đậm nét)</span>
              </div>
            </div>
          </div>

          {/* Live Glass Preview Card */}
          <div className="liquid-glass-card rounded-2xl p-6 border border-white/20 shadow-glass-lg space-y-3">
            <div className="flex items-center justify-between text-xs text-theme-text-muted">
              <span>Thẻ thử nghiệm kính mờ</span>
              <span className="font-mono">Preview</span>
            </div>
            <p className="text-lg font-bold text-white font-serif">汉字卡片 · Liquid Glass</p>
            <p className="text-xs text-theme-text-muted leading-relaxed">
              Đây là hiệu ứng phản chiếu ánh sáng và độ mờ thực tế mà bạn sẽ nhìn thấy trên toàn bộ ứng dụng HanziDeck.
            </p>
            <div className="pt-2">
              <button type="button" className="liquid-glass-btn px-3 py-1.5 rounded-xl text-xs font-semibold">
                Nút bấm Satin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. 10 THEME PROFILES ================= */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">{t.settings.themeSection}</h2>
            <p className="text-xs text-theme-text-muted">
              Mỗi bộ màu gồm 4 màu chuẩn (Chủ đạo, Thứ cấp, Điểm nhấn, Nền khí quyển)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {COLOR_PROFILES.map((profile) => {
            const isSelected = settings.theme_id === profile.id;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleSelectTheme(profile.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'liquid-glass border-emerald-400 shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {profile.name[settings.language || 'vi']}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>

                {/* 4 Semantic Colors preview bars */}
                <div className="grid grid-cols-4 gap-1.5 w-full h-4 rounded-lg overflow-hidden p-0.5 bg-black/40 border border-white/10">
                  <div
                    className="h-full rounded"
                    style={{ backgroundColor: profile.primary }}
                    title={`Primary: ${profile.primary}`}
                  />
                  <div
                    className="h-full rounded"
                    style={{ backgroundColor: profile.secondary }}
                    title={`Secondary: ${profile.secondary}`}
                  />
                  <div
                    className="h-full rounded"
                    style={{ backgroundColor: profile.accent }}
                    title={`Accent: ${profile.accent}`}
                  />
                  <div
                    className="h-full rounded"
                    style={{ backgroundColor: profile.bgTint }}
                    title={`Background: ${profile.bgTint}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 4. LANGUAGE SELECTOR ================= */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">
              {t.settings.languageSection}
            </h2>
            <p className="text-xs text-theme-text-muted">
              Chuyển đổi ngôn ngữ hiển thị giao diện ngay tức thì
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { id: 'vi' as Language, label: '🇻🇳 Tiếng Việt', desc: 'Mặc định' },
            { id: 'en' as Language, label: '🇺🇸 English', desc: 'Standard' },
            { id: 'zh' as Language, label: '🇨🇳 中文', desc: '简体中文' },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => handleLanguageChange(lang.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                settings.language === lang.id
                  ? 'liquid-glass-btn font-bold text-white border-white/30'
                  : 'liquid-glass hover:bg-white/15 text-theme-text-muted border-theme-border'
              }`}
            >
              <span className="block text-sm font-semibold">{lang.label}</span>
              <span className="text-[10px] opacity-70 block mt-0.5">{lang.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= 5. ACCOUNT & DATA BACKUP ================= */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-glass border border-white/15 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">
              {t.settings.accountSection}
            </h2>
            <p className="text-xs text-theme-text-muted">
              Quản lý đồng bộ Supabase Cloud và sao lưu dữ liệu cục bộ
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/30 border border-theme-border/40 text-xs text-theme-text-muted space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Trạng thái:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {userEmail ? `Đăng nhập (${userEmail})` : 'Chế độ Khách (Offline & LocalStorage)'}
            </span>
          </div>
          <p>{t.settings.supabaseNotice}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl liquid-glass hover:bg-white/20 text-xs font-semibold text-white border border-theme-border flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-theme-secondary" />
            <span>{t.settings.exportData}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
