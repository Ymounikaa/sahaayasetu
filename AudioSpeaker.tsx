import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioSpeakerProps {
  text: string;
  size?: number;
  className?: string;
}

export default function AudioSpeaker({ text, size = 18, className = '' }: AudioSpeakerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering parent clicks
    
    // Toggle play simulation
    setIsPlaying(true);
    
    // Check if SpeechSynthesis is available in browser for high-fidelity demonstration
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to guess language or just read
      if (text.match(/[\u0c00-\u0c7f]/)) {
        utterance.lang = 'te-IN'; // Telugu
      } else if (text.match(/[\u0900-\u097f]/)) {
        utterance.lang = 'hi-IN'; // Hindi
      } else if (text.match(/[\u0b80-\u0bff]/)) {
        utterance.lang = 'ta-IN'; // Tamil
      } else if (text.match(/[\u0a00-\u0a7f]/)) {
        utterance.lang = 'pa-IN'; // Punjabi
      } else if (text.match(/[\u0980-\u09ff]/)) {
        utterance.lang = 'bn-IN'; // Bengali
      } else if (text.match(/[\u0d00-\u0d7f]/)) {
        utterance.lang = 'ml-IN'; // Malayalam
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer simulation
      setTimeout(() => {
        setIsPlaying(false);
      }, 2500);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        onClick={handlePlay}
        className={`p-2 rounded-full transition-all duration-300 ${
          isPlaying 
            ? 'bg-sky-100 text-sky-600 scale-110 shadow-sm animate-pulse' 
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 active:scale-95'
        }`}
        title="Listen to instruction"
        aria-label="Listen to instruction"
        id={`audio-btn-${text.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`}
      >
        {isPlaying ? <Volume2 size={size} className="animate-bounce" /> : <Volume2 size={size} />}
      </button>

      {isPlaying && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg z-50 text-center font-sans tracking-wide leading-relaxed animate-fade-in">
          🔊 "{text}"
        </span>
      )}
    </div>
  );
}
