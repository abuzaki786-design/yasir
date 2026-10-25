import React from 'react';
import { VOICE_CHARACTERS, VoiceCharacterOption } from '../data/languages.ts';
import { Volume2, Check, Sparkles, User } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  isUrdu: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  isUrdu,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {VOICE_CHARACTERS.map((v) => {
        const isSelected = selectedVoice === v.id;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelectVoice(v.id)}
            className={`relative p-3.5 rounded-xl border text-right transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/60'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-slate-300'
            }`}
          >
            {/* Top row: Gender badge & select indicator */}
            <div className="flex items-center justify-between w-full mb-2">
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  v.gender === 'Female'
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                }`}
              >
                {isUrdu ? (v.gender === 'Female' ? 'خاتون' : 'مرد') : v.gender}
              </span>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-transparent'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Voice Name & Role */}
            <div className="w-full">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5 justify-start">
                <Volume2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{isUrdu ? v.nameUrdu : v.nameEn}</span>
              </h4>
              <p className="text-[11px] text-amber-300/80 mt-1 line-clamp-1 font-medium">
                {isUrdu ? v.roleUrdu : v.roleEn}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                <span className="text-slate-500">{isUrdu ? 'بہترین برائے: ' : 'Best: '}</span>
                {isUrdu ? v.bestForUrdu : v.tone}
              </p>
            </div>

            {/* Bottom accent tag with Pitch info */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{v.pitch}</span>
              {isSelected && <span className="text-amber-400 font-bold">منتخب</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
};
