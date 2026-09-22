import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'HanziDeck - Học từ mới tiếng Trung thông minh chuẩn Hanzii & Quizlet',
  description: 'Nền tảng học từ vựng tiếng Trung toàn diện: Flashcard 3D, từ điển phân tích bộ thủ Hanzii, bóc tách từ vựng thông minh, Liquid Glass UI và trợ lý AI Gemini 3.5 Flash Lite.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen flex flex-col selection:bg-theme-secondary/30 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
          {children}
        </main>
        <footer className="py-6 px-4 text-center text-xs text-theme-text-muted opacity-70 border-t border-theme-border/30">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>HanziDeck © 2026 · Hanzii & Quizlet Fusion for Chinese Learners</span>
            <span className="font-mono">hanzideck.brianthecrab.id.vn</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
