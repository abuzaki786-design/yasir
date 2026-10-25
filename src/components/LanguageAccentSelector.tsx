import React from 'react';
import { SUPPORTED_LANGUAGES, LanguageOption, AccentOption } from '../data/languages.ts';
import { Globe, Sparkles, Check, ChevronDown, Wand2, RefreshCw } from 'lucide-react';

interface LanguageAccentSelectorProps {
  selectedLanguageCode: string;
  onSelectLanguage: (lang: LanguageOption) => void;
  selectedAccentId: string;
  onSelectAccent: (accent: AccentOption) => void;
  onTranslateCurrentText: (langName: string, accentName: string) => void;
  onLoadSampleText: (text: string) => void;
  isTranslating: boolean;
  isUrdu: boolean;
}

export const LanguageAccentSelector: React.FC<LanguageAccentSelectorProps> = ({
  selectedLanguageCode,
  onSelectLanguage,
  selectedAccentId,
  onSelectAccent,
  onTranslateCurrentText,
  onLoadSampleText,
  isTranslating,
  isUrdu,
}) => {
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguageCode) ||
    SUPPORTED_LANGUAGES[0];

  const currentAccent =
    currentLang.accents.find((a) => a.id === selectedAccentId) ||
    currentLang.accents[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>{isUrdu ? 'زبان اور لہجے کا انتخاب (Language & Accent)' : 'Select Language & Regional Accent'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                {SUPPORTED_LANGUAGES.length}+ زبانیں
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isUrdu
                ? 'اپنی پسند کی زبان اور علاقائی تلفظ منتخب کریں'
                : 'Choose target speech language and native regional dialect'}
            </p>
          </div>
        </div>

        {/* Quick action buttons for the selected language */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onLoadSampleText(currentLang.sampleText)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            title={isUrdu ? 'اس زبان کا نمونہ متن درج کریں' : 'Load sample script in this language'}
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span>{isUrdu ? 'نمونہ متن' : 'Sample Text'}</span>
          </button>

          <button
            type="button"
            disabled={isTranslating}
            onClick={() =>
              onTranslateCurrentText(
                currentLang.nameEn,
                currentAccent?.nameEn || currentLang.nameEn
              )
            }
            className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
            title={
              isUrdu
                ? 'موجودہ تحریر کو اس زبان اور لہجے میں خودکار ترجمہ کریں'
                : 'Translate and adapt script into this language & dialect'
            }
          >
            {isTranslating ? (
              <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-3 h-3 text-amber-400" />
            )}
            <span>{isUrdu ? 'اس زبان میں ترجمہ کریں' : 'AI Translate to Lang'}</span>
          </button>
        </div>
      </div>

      {/* Language Pills Bar */}
      <div>
        <label className="block text-xs text-slate-400 mb-2">
          {isUrdu ? '1. زبان منتخب کریں (Language):' : '1. Choose Language:'}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguageCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelectLanguage(lang);
                  if (lang.accents.length > 0) {
                    onSelectAccent(lang.accents[0]);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span>{isUrdu ? lang.nameUrdu : lang.nameEn}</span>
                {isSelected && <Check className="w-3 h-3 text-amber-400 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accents & Dialects for the selected language */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs text-slate-400">
            {isUrdu
              ? `2. ${currentLang.nameUrdu} کا مخصوص لہجہ اور تلفظ (Accent / Dialect):`
              : `2. Regional Accent & Dialect for ${currentLang.nameEn}:`}
          </label>
          <span className="text-[11px] text-amber-400 font-mono">
            {currentLang.accents.length} {isUrdu ? 'دستیاب لہجے' : 'Dialects available'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {currentLang.accents.map((accent) => {
            const isSelected = selectedAccentId === accent.id;
            return (
              <button
                key={accent.id}
                type="button"
                onClick={() => onSelectAccent(accent)}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-amber-200 ring-1 ring-amber-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-xs text-slate-100">
                    {isUrdu ? accent.nameUrdu : accent.nameEn}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-transparent'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {accent.promptDescription}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
