import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'HanziDeck - Học từ mới tiếng Trung thông minh',
  description: 'Nền tảng học từ vựng tiếng Trung chuẩn HSK 3.0 với Flashcard 3D, từ điển phân tích bộ thủ, bóc tách từ tự động và Trợ lý AI Gemini.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-sky-500/30 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
          {children}
        </main>
        <footer className="py-6 px-4 text-xs text-theme-text-muted opacity-80 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <span className="text-white/60">HanziDeck © 2026</span>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
              <span className="text-white/80">hanzideck.brianthecrab.id.vn</span>
              <span className="text-white/20">|</span>
              <a
                href="mailto:quangminhle2101@gmail.com"
                className="text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-2"
                title="Gửi email liên hệ"
              >
                quangminhle2101@gmail.com
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
