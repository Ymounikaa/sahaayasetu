import React from 'react';
import { Globe, Check } from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES } from '../data';
import AudioSpeaker from './AudioSpeaker';

interface LanguageSelectionViewProps {
  onLanguageSelect: (lang: Language) => void;
  selectedLanguage: Language | null;
}

export default function LanguageSelectionView({
  onLanguageSelect,
  selectedLanguage,
}: LanguageSelectionViewProps) {
  return (
    <div className="max-w-xl mx-auto my-6 px-4" id="language-selection-container">
      {/* Intro Header */}
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-blue-50 text-blue-600 mb-3 border border-blue-100">
          <Globe size={28} className="animate-spin-slow" />
        </div>
        <h2 className="font-sans font-extrabold text-slate-800 text-2xl tracking-tight" id="lang-title">
          Select Your Language / भाषा चुनें
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Choose the language you read and speak most comfortably.
        </p>
      </div>

      {/* Accessible language tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="languages-grid">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage?.code === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => onLanguageSelect(lang)}
              className={`group relative p-4 rounded-xl border-2 text-left cursor-pointer transition-all flex items-center justify-between gap-4 select-none ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs active:scale-98'
              }`}
              id={`lang-card-${lang.code}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onLanguageSelect(lang);
                }
              }}
            >
              {/* Language Name Description */}
              <div className="flex-1 min-w-0">
                <span className="block font-sans font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                  {lang.nativeName}
                </span>
                <span className="block text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                  {lang.englishName}
                </span>
              </div>

              {/* Speaker icon & checkbox indicators */}
              <div className="flex items-center gap-2">
                <AudioSpeaker text={lang.audioPrompt} size={15} className="bg-slate-50 text-slate-600 rounded-full" />
                
                {isSelected && (
                  <div className="bg-blue-600 text-white p-1 rounded-full border border-blue-700">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper accessibility banner */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
        <span className="text-lg">💡</span>
        <div className="text-xs text-amber-800 leading-relaxed font-medium">
          <p className="font-bold mb-0.5">Need help understanding?</p>
          Press the <span className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-semibold text-slate-700">🔊 Speaker</span> icon next to any language to hear it spoken aloud.
        </div>
      </div>
    </div>
  );
}
