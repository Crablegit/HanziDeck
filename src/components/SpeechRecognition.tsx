'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface SpeechRecognitionProps {
  onTranscript: (transcript: string) => void;
  lang?: string;
  className?: string;
}

export default function SpeechRecognitionButton({
  onTranscript,
  lang = 'zh-CN',
  className = '',
}: SpeechRecognitionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang;

        recognition.onstart = () => {
          setIsRecording(true);
          setErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onTranscript(transcript);
          }
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          setIsRecording(false);
          if (event.error !== 'no-speech') {
            setErrorMessage(`Lỗi ghi âm: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }
  }, [lang, onTranscript]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói (Web Speech Recognition). Hãy sử dụng Google Chrome hoặc Microsoft Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-xs text-amber-300 flex items-center gap-1.5 opacity-80">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Ghi âm khả dụng tốt nhất trên Chrome/Edge</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={toggleRecording}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium text-xs transition-all ${
          isRecording
            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
            : 'liquid-glass hover:bg-white/20 text-white border-theme-border'
        } ${className}`}
      >
        {isRecording ? (
          <>
            <MicOff className="w-4 h-4 text-white" />
            <span>Đang nghe bạn nói... (Bấm để dừng)</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-theme-secondary" />
            <span>Bấm Micro đọc thử tiếng Trung</span>
          </>
        )}
      </button>
      {errorMessage && (
        <span className="text-[11px] text-rose-300">{errorMessage}</span>
      )}
    </div>
  );
}
