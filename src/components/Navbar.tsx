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
} from 'lucide-react';
import { getDailyStreak, getStoredSettings, DailyStreakData } from '@/lib/storage';
import { getTranslations } from '@/lib/i18n';
import { applyThemeToDocument, getThemeById } from '@/lib/themes';
import { UserProfile } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<UserProfile>(getStoredSettings());
  const [streak, setStreak] = useState<DailyStreakData>({ count: 1, lastCompletedDate: '', todayCompletedWords: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userSettings = getStoredSettings();
    setSettings(userSettings);
    const theme = getThemeById(userSettings.theme_id);
    applyThemeToDocument(theme, userSettings.glass_blur, userSettings.glass_opacity);
    setStreak(getDailyStreak());

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
    { href: '/ai-coach', label: t.nav.aiCoach, icon: Sparkles, isAi: true },
    { href: '/settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3">
      <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-glass transition-all border border-white/10">
        {/* Clean Apple Wordmark Logo without box or PRO badge */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-semibold text-lg sm:text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors">
            HanziDeck
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold border border-white/15 shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.isAi ? 'text-sky-400' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Daily Streak & Goal pill */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/daily-stack"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white hover:border-white/20 transition-all"
            title={`${streak.todayCompletedWords}/${settings.daily_goal} từ hôm nay`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-amber-300">{streak.count} ngày</span>
            <span className="text-white/20">|</span>
            <span className="font-mono text-white/90">
              {streak.todayCompletedWords}/{settings.daily_goal} từ
            </span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/daily-stack"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">{streak.count}</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 text-white border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 liquid-glass rounded-2xl p-3 shadow-glass flex flex-col gap-1 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
