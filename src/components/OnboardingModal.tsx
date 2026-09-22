'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Layers,
  Award,
  ArrowRight,
  Shield,
  BookOpen,
} from 'lucide-react';
import {
  getStoredSettings,
  saveStoredSettings,
  hasCompletedOnboarding,
  setOnboardingCompleted,
} from '@/lib/storage';
import { HSK_LEVEL_INFOS } from '@/lib/dictionaryData';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface OnboardingModalProps {
  onFinish?: () => void;
}

export default function OnboardingModal({ onFinish }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form selections
  const [selectedGoal, setSelectedGoal] = useState(10);
  const [selectedHskBaseline, setSelectedHskBaseline] = useState(1);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authMode, setAuthMode] = useState<'guest' | 'login'>('guest');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setAuthError('Supabase chưa cấu hình URL / Key trong file môi trường. Bạn có thể chọn tiếp tục ở chế độ Khách.');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput,
      });

      if (error) {
        // Try sign up if user not found
        const { error: signUpError } = await supabase.auth.signUp({
          email: emailInput.trim(),
          password: passwordInput,
        });
        if (signUpError) {
          setAuthError(signUpError.message);
          setIsSubmitting(false);
          return;
        }
      }

      setStep(2);
    } catch (err: any) {
      setAuthError(err?.message || 'Đăng nhập thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndComplete = () => {
    saveStoredSettings({
      daily_goal: selectedGoal,
      user_hsk_baseline: selectedHskBaseline,
    });
    setOnboardingCompleted(true);
    setIsOpen(false);
    window.dispatchEvent(new Event('hanzideck_settings_changed'));
    if (onFinish) onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="w-full max-w-lg liquid-glass-card rounded-3xl p-6 sm:p-8 shadow-glass-lg border border-white/15 relative space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress step indicators */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Thiết lập học tập</span>
            <span className="text-xs text-white/40">Bước {step} / 3</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  step === i ? 'bg-sky-400 w-5' : step > i ? 'bg-emerald-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= STEP 1: ACCOUNT ================= */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Lưu trữ & Đồng bộ từ vựng
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Đăng nhập để ghi nhớ vĩnh viễn các từ mới đã học trên đám mây Supabase, hoặc tiếp tục học nhanh trên thiết bị này.
              </p>
            </div>

            {authMode === 'guest' ? (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full liquid-glass-btn py-3.5 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <span>Tiếp tục trên thiết bị này (Chế độ Khách)</span>
                  <ArrowRight className="w-4 h-4 text-sky-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition-all"
                >
                  Đăng nhập tài khoản Supabase Cloud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSupabaseAuth} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] text-white/60 block mb-1">Email:</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="email@vidu.com"
                    className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/60 block mb-1">Mật khẩu:</label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs"
                  />
                </div>

                {authError && (
                  <p className="text-xs text-rose-300 font-medium">{authError}</p>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('guest')}
                    className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-white/60 hover:text-white"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 liquid-glass-btn py-2.5 rounded-xl text-xs font-semibold disabled:opacity-40"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Xác thực & Tiếp tục'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ================= STEP 2: DAILY GOAL ================= */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Mục tiêu học mỗi ngày của bạn
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Bạn muốn tích lũy bao nhiêu từ mới mỗi ngày? (Có thể thay đổi bất cứ lúc nào trong Cài đặt).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                { goal: 5, label: '5 từ / ngày', desc: 'Thảnh thơi, dễ duy trì' },
                { goal: 10, label: '10 từ / ngày', desc: 'Khuyên dùng, hiệu quả cao' },
                { goal: 15, label: '15 từ / ngày', desc: 'Tập trung bứt phá' },
                { goal: 20, label: '20 từ / ngày', desc: 'Cường độ cao' },
              ].map((item) => (
                <button
                  key={item.goal}
                  type="button"
                  onClick={() => setSelectedGoal(item.goal)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedGoal === item.goal
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{item.label}</span>
                    {selectedGoal === item.goal && (
                      <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    )}
                  </div>
                  <span className="text-[11px] opacity-70 block mt-1">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-white/50 hover:text-white"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="liquid-glass-btn px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Tiếp theo: Chọn trình độ HSK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: HSK 3.0 BASELINE ================= */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Trình độ HSK 3.0 hiện tại của bạn
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Chọn cấp độ HSK bạn <strong>chắc chắn đã nắm vững</strong>. Hệ thống sẽ tự động coi toàn bộ các từ ở cấp độ này và cấp thấp hơn là <strong>ĐÃ BIẾT</strong> để tính năng lọc từ mới trong đoạn văn chỉ làm nổi bật từ mới thật sự!
              </p>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {HSK_LEVEL_INFOS.map((info) => (
                <button
                  key={info.level}
                  type="button"
                  onClick={() => setSelectedHskBaseline(info.level)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    selectedHskBaseline === info.level
                      ? 'bg-sky-500/20 border-sky-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-white block">{info.label}</span>
                    <span className="text-[10px] opacity-60">{info.countDesc}</span>
                  </div>
                  {selectedHskBaseline === info.level && (
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-white/50 hover:text-white"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleSaveAndComplete}
                className="liquid-glass-btn px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Hoàn tất & Bắt đầu học</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
