'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Layers,
  Search,
  FileText,
  Sparkles,
  Settings,
  Flame,
  CheckCircle2,
  Menu,
  X,
  Volume2,
} from 'lucide-react';
import { getDailyStreak, getStoredSettings, DailyStreakData } from '@/lib/storage';
import { getTranslations } from '@/lib/i18n';
import { applyThemeToDocument, getThemeById } from '@/lib/themes';
import { Language, UserProfile } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<UserProfile>(getStoredSettings());
  const [streak, setStreak] = useState<DailyStreakData>({ count: 1, lastCompletedDate: '', todayCompletedWords: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initial theme load
    const userSettings = getStoredSettings();
    setSettings(userSettings);
    const theme = getThemeById(userSettings.theme_id);
    applyThemeToDocument(theme, userSettings.glass_blur, userSettings.glass_opacity);
    setStreak(getDailyStreak());

    // Listen to custom storage updates
    const handleStorage = () => {
      const s = getStoredSettings();
      setSettings(s);
      setStreak(getDailyStreak());
      const t = getThemeById(s.theme_id);
      applyThemeToDocument(t, s.glass_blur, s.glass_opacity);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('hanzideck_settings_changed', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('hanzideck_settings_changed', handleStorage);
    };
  }, []);

  const t = getTranslations(settings.language || 'vi');

  const navItems = [
    { href: '/', label: t.nav.home, icon: BookOpen },
    { href: '/decks', label: t.nav.decks, icon: Layers },
    { href: '/dictionary', label: t.nav.dictionary, icon: Search },
    { href: '/text-parser', label: t.nav.textParser, icon: FileText },
    { href: '/daily-stack', label: t.nav.dailyStack, icon: CheckCircle2 },
    { href: '/ai-coach', label: t.nav.aiCoach, icon: Sparkles, badge: 'Gemini' },
    { href: '/settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3">
      <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-glass transition-all">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl liquid-glass-btn flex items-center justify-center font-bold text-xl tracking-wider shadow-md group-hover:scale-105 transition-transform">
            汉
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight flex items-center gap-1.5 text-white">
              HanziDeck
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-theme-secondary/20 text-theme-text-muted border border-theme-border font-medium">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-theme-text-muted opacity-80 hidden sm:inline-block">
              Hanzii & Quizlet Fusion
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/20 text-white shadow-sm border border-white/20'
                    : 'text-theme-text-muted hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-400 to-rose-400 text-slate-900 leading-tight">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Daily Streak & Quick Stats */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/daily-stack"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/20 border border-theme-border text-xs text-theme-text-muted hover:border-theme-secondary transition-colors"
            title={`${streak.todayCompletedWords}/${settings.daily_goal} từ hôm nay`}
          >
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-semibold text-amber-300">{streak.count}</span>
            <span className="opacity-70 text-[11px]">{t.home.days}</span>
            <span className="mx-1 text-white/30">|</span>
            <span className="font-medium text-emerald-300">
              {streak.todayCompletedWords}/{settings.daily_goal}
            </span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/daily-stack"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/20 border border-theme-border text-xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">{streak.count}</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 text-white border border-theme-border"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 liquid-glass rounded-2xl p-3 shadow-glass flex flex-col gap-1 border border-theme-border animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-theme-text-muted hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-900">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
