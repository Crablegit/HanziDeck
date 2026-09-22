'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playChineseAudio } from '@/lib/tts';

interface AudioPlayerProps {
  text: string;
  audioUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export default function AudioPlayer({
  text,
  audioUrl,
  size = 'md',
  className = '',
  label,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isPlaying) return;

    setIsPlaying(true);
    playChineseAudio(text, audioUrl, {
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });

    // Safety timeout in case speech synth doesn't fire onEnd
    setTimeout(() => {
      setIsPlaying(false);
    }, 4000);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={`Phát âm ${text}`}
      title={`Nghe phát âm "${text}" (Web Speech API)`}
      className={`inline-flex items-center gap-1.5 rounded-xl border border-theme-border bg-white/10 hover:bg-white/20 text-theme-text hover:text-white transition-all active:scale-95 ${sizeClasses[size]} ${className}`}
    >
      <Volume2 className={`${iconSizes[size]} ${isPlaying ? 'text-amber-300 animate-bounce' : 'text-theme-secondary'}`} />
      {label && <span>{label}</span>}
      {isPlaying && (
        <span className="flex items-center gap-0.5 ml-0.5">
          <span className="w-1 h-2.5 bg-amber-400 rounded-full animate-pulse" />
          <span className="w-1 h-3.5 bg-amber-300 rounded-full animate-pulse delay-75" />
          <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
        </span>
      )}
    </button>
  );
}
