import { ColorProfile } from '@/types';

export const COLOR_PROFILES: ColorProfile[] = [
  {
    id: 'minimalist-slate',
    name: {
      vi: 'Titan Tối giản (Minimalist Slate)',
      en: 'Minimalist Slate',
      zh: '极简岩板 (Minimalist Slate)',
    },
    primary: '#38bdf8', // Sky 400
    primaryHover: '#0284c7',
    secondary: '#818cf8', // Indigo 400
    accent: '#38bdf8',
    bgTint: '#0b0f17',
    surface: 'rgba(18, 24, 38, 0.65)',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    border: 'rgba(255, 255, 255, 0.08)',
    isDark: true,
  },
  {
    id: 'imperial-jade',
    name: {
      vi: 'Cẩm Thạch (Imperial Jade)',
      en: 'Imperial Jade',
      zh: '帝王翡翠 (Imperial Jade)',
    },
    primary: '#059669',
    primaryHover: '#047857',
    secondary: '#10b981',
    accent: '#d97706',
    bgTint: '#064e3b',
    surface: 'rgba(6, 78, 59, 0.45)',
    text: '#f0fdf4',
    textMuted: '#a7f3d0',
    border: 'rgba(16, 185, 129, 0.25)',
    isDark: true,
  },
  {
    id: 'forbidden-city',
    name: {
      vi: 'Tử Cấm Thành (Crimson Gold)',
      en: 'Forbidden City Crimson',
      zh: '紫禁朱砂 (Forbidden City)',
    },
    primary: '#dc2626',
    primaryHover: '#b91c1c',
    secondary: '#f59e0b',
    accent: '#fbbf24',
    bgTint: '#450a0a',
    surface: 'rgba(69, 10, 10, 0.5)',
    text: '#fef2f2',
    textMuted: '#fecaca',
    border: 'rgba(239, 68, 68, 0.3)',
    isDark: true,
  },
  {
    id: 'sakura-blossom',
    name: {
      vi: 'Hoa Anh Đào (Sakura Rose)',
      en: 'Sakura Blossom',
      zh: '樱花轻染 (Sakura Blossom)',
    },
    primary: '#db2777',
    primaryHover: '#be185d',
    secondary: '#f43f5e',
    accent: '#9333ea',
    bgTint: '#500724',
    surface: 'rgba(80, 7, 36, 0.45)',
    text: '#fdf2f8',
    textMuted: '#fbcfe8',
    border: 'rgba(244, 63, 94, 0.25)',
    isDark: true,
  },
  {
    id: 'cyber-shanghai',
    name: {
      vi: 'Thượng Hải Neon (Cyber Shanghai)',
      en: 'Cyber Shanghai',
      zh: '魔都赛博 (Cyber Shanghai)',
    },
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    bgTint: '#030712',
    surface: 'rgba(17, 24, 39, 0.65)',
    text: '#ecfeff',
    textMuted: '#a5f3fc',
    border: 'rgba(6, 182, 212, 0.35)',
    isDark: true,
  },
  {
    id: 'deep-ocean',
    name: {
      vi: 'Đại Dương (Deep Ocean)',
      en: 'Deep Ocean',
      zh: '沧海深蓝 (Deep Ocean)',
    },
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#0ea5e9',
    accent: '#14b8a6',
    bgTint: '#0f172a',
    surface: 'rgba(15, 23, 42, 0.55)',
    text: '#eff6ff',
    textMuted: '#bfdbfe',
    border: 'rgba(37, 99, 235, 0.3)',
    isDark: true,
  },
  {
    id: 'autumn-ginkgo',
    name: {
      vi: 'Ngân Hạnh Thu (Autumn Ginkgo)',
      en: 'Autumn Ginkgo',
      zh: '金秋银杏 (Autumn Ginkgo)',
    },
    primary: '#d97706',
    primaryHover: '#b45309',
    secondary: '#ea580c',
    accent: '#f59e0b',
    bgTint: '#451a03',
    surface: 'rgba(69, 26, 3, 0.5)',
    text: '#fffbeb',
    textMuted: '#fde68a',
    border: 'rgba(217, 119, 6, 0.3)',
    isDark: true,
  },
  {
    id: 'matcha-zen',
    name: {
      vi: 'Trà Đạo Zen (Matcha Zen)',
      en: 'Matcha Zen',
      zh: '禅意抹茶 (Matcha Zen)',
    },
    primary: '#65a30d',
    primaryHover: '#4d7c0f',
    secondary: '#84cc16',
    accent: '#eab308',
    bgTint: '#1a2e05',
    surface: 'rgba(26, 46, 5, 0.55)',
    text: '#f7fee7',
    textMuted: '#d9f99d',
    border: 'rgba(132, 204, 22, 0.28)',
    isDark: true,
  },
  {
    id: 'midnight-amethyst',
    name: {
      vi: 'Thạch Anh Đêm (Midnight Amethyst)',
      en: 'Midnight Amethyst',
      zh: '暗夜紫晶 (Midnight Amethyst)',
    },
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    secondary: '#a855f7',
    accent: '#f43f5e',
    bgTint: '#1e1b4b',
    surface: 'rgba(30, 27, 75, 0.55)',
    text: '#faf5ff',
    textMuted: '#e9d5ff',
    border: 'rgba(168, 85, 247, 0.3)',
    isDark: true,
  },
  {
    id: 'sunset-coral',
    name: {
      vi: 'Hoàng Hôn San Hô (Sunset Coral)',
      en: 'Sunset Coral',
      zh: '晚霞珊瑚 (Sunset Coral)',
    },
    primary: '#f97316',
    primaryHover: '#ea580c',
    secondary: '#fb7185',
    accent: '#facc15',
    bgTint: '#431407',
    surface: 'rgba(67, 20, 7, 0.5)',
    text: '#fff7ed',
    textMuted: '#fed7aa',
    border: 'rgba(249, 115, 22, 0.3)',
    isDark: true,
  },
];

export function getThemeById(id: string): ColorProfile {
  return COLOR_PROFILES.find((p) => p.id === id) || COLOR_PROFILES[0];
}

export function applyThemeToDocument(profile: ColorProfile, blur: number, opacity: number) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--theme-primary', profile.primary);
  root.style.setProperty('--theme-primary-hover', profile.primaryHover);
  root.style.setProperty('--theme-secondary', profile.secondary);
  root.style.setProperty('--theme-accent', profile.accent);
  root.style.setProperty('--theme-bg', profile.bgTint);
  root.style.setProperty('--theme-surface', profile.surface);
  root.style.setProperty('--theme-text', profile.text);
  root.style.setProperty('--theme-text-muted', profile.textMuted);
  root.style.setProperty('--theme-border', profile.border);

  // Liquid glass properties
  root.style.setProperty('--glass-blur', `${blur}px`);
  root.style.setProperty('--glass-opacity', `${opacity / 100}`);
}
