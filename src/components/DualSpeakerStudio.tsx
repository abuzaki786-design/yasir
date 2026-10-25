import React, { useState } from 'react';
import { Voice } from '../types.ts';
import { VOCAL_BURSTS } from '../data/templates.ts';
import { Users, Sparkles, MessageSquare, Plus, Volume2 } from 'lucide-react';

interface DualSpeakerStudioProps {
  voices: Voice[];
  onGenerate: (speakersData: any) => void;
  isLoading: boolean;
  isUrdu: boolean;
}

export const DualSpeakerStudio: React.FC<DualSpeakerStudioProps> = ({
  voices,
  onGenerate,
  isLoading,
  isUrdu,
}) => {
  const [speaker1, setSpeaker1] = useState({
    name: 'احمد (میزبان)',
    voice: 'Puck',
    style: 'پُرجوش اور دوستانہ انداز (Enthusiastic & friendly)',
    text: 'السلام علیکم ناظرین! <breath> آج کے اس خاص پروگرام میں ہمارے ساتھ موجود ہیں ایک خاص مہمان۔',
  });

  const [speaker2, setSpeaker2] = useState({
    name: 'سارہ (مہمان)',
    voice: 'Kore',
    style: 'شائستہ، مسکراتی اور مدلل گفتگو (Polite and expressive)',
    text: 'وعلیکم السلام احمد! |yeah| مجھے یہاں آ کر بے حد خوشی ہوئی۔ <laugh> آج ہم بہت سے نئے موضوعات پر بات کریں گے۔',
  });

  const [activeSpeakerFocus, setActiveSpeakerFocus] = useState<1 | 2>(1);

  const insertBurstTag = (tag: string) => {
    if (activeSpeakerFocus === 1) {
      setSpeaker1((prev) => ({ ...prev, text: prev.text + ' ' + tag + ' ' }));
    } else {
      setSpeaker2((prev) => ({ ...prev, text: prev.text + ' ' + tag + ' ' }));
    }
  };

  const handleStartGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!speaker1.text.trim() || !speaker2.text.trim()) {
      alert(isUrdu ? 'براہ کرم دونوں مقررین کی گفتگو درج کریں۔' : 'Please provide speech for both speakers.');
      return;
    }
    onGenerate([speaker1, speaker2]);
  };

  const loadSamplePodcast = () => {
    setSpeaker1({
      name: 'احمد (میزبان)',
      voice: 'Fenrir',
      style: 'Confident, deep host voice',
      text: 'دوستو! مصنوعی ذہانت انسان کی زندگی کو کیسے آسان بنا رہی ہے؟ <breath> آئیے سارہ سے جانتے ہیں۔',
    });
    setSpeaker2({
      name: 'سارہ (ماہر)',
      voice: 'Zephyr',
      style: 'Calm, articulate tech expert',
      text: 'احمد، |yeah| اب آڈیو اور آواز تیار کرنا اتنا آسان ہو چکا ہے کہ چند سیکنڈ میں کوئی بھی قدرتی لہجے میں پوڈکاسٹ بنا سکتا ہے۔ <laugh>',
    });
  };

  return (
    <form onSubmit={handleStartGenerate} className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">
              {isUrdu ? 'دو مقررین کا پوڈکاسٹ اور مکالمہ (Gemini 3.8 Flash TTS)' : 'Dual Speaker Dialogue & Podcast Studio'}
            </h3>
            <p className="text-xs text-slate-400">
              {isUrdu
                ? 'دو الگ الگ آوازیں، انسانی تاثرات (ہنسی، سانس، ہاں/ہوں) اور قدرتی مکالمہ'
                : 'Natural backchanneling (|yeah|, |mhm|) and vocal bursts (<laugh>, <breath>)'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadSamplePodcast}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer"
        >
          {isUrdu ? 'نمونہ مکالمہ لوڈ کریں' : 'Load Sample Dialogue'}
        </button>
      </div>

      {/* Vocal burst insert bar */}
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium ml-2">
          {isUrdu ? 'تاثرات شامل کریں (مقرر ' + (activeSpeakerFocus === 1 ? '1' : '2') + '):' : `Insert Expression into Speaker ${activeSpeakerFocus}:`}
        </span>
        {VOCAL_BURSTS.map((b) => (
          <button
            key={b.tag}
            type="button"
            onClick={() => insertBurstTag(b.tag)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-xs text-slate-200 transition-all cursor-pointer font-mono"
            title={isUrdu ? b.labelUrdu : b.labelEn}
          >
            <span>{b.icon}</span>
            <span>{b.tag}</span>
            <span className="text-[10px] text-slate-400">({isUrdu ? b.labelUrdu : b.labelEn})</span>
          </button>
        ))}
      </div>

      {/* Grid of Two Speakers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speaker 1 */}
        <div
          className={`bg-slate-900/80 rounded-2xl p-4 border transition-all ${
            activeSpeakerFocus === 1 ? 'border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg' : 'border-slate-800'
          }`}
          onClick={() => setActiveSpeakerFocus(1)}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
              {isUrdu ? 'پہلا مقرر (Speaker 1)' : 'Speaker 1'}
            </span>

            {/* Voice Dropdown */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <select
                value={speaker1.voice}
                onChange={(e) => setSpeaker1({ ...speaker1, voice: e.target.value })}
                className="bg-slate-950 border border-slate-700 rounded-lg text-xs px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id} ({isUrdu ? (v.gender === 'Female' ? 'خاتون' : 'مرد') : v.gender})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{isUrdu ? 'نام / کردار:' : 'Speaker Name / Role:'}</label>
              <input
                type="text"
                value={speaker1.name}
                onChange={(e) => setSpeaker1({ ...speaker1, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{isUrdu ? 'گفتگو / اسکرپٹ:' : 'Script Dialogue:'}</label>
              <textarea
                rows={5}
                value={speaker1.text}
                onChange={(e) => setSpeaker1({ ...speaker1, text: e.target.value })}
                onFocus={() => setActiveSpeakerFocus(1)}
                placeholder={isUrdu ? 'پہلے مقرر کا مکالمہ یہاں لکھیں...' : 'Enter Speaker 1 dialogue...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-amber-500 focus:outline-none font-urdu leading-loose resize-none"
              />
            </div>
          </div>
        </div>

        {/* Speaker 2 */}
        <div
          className={`bg-slate-900/80 rounded-2xl p-4 border transition-all ${
            activeSpeakerFocus === 2 ? 'border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg' : 'border-slate-800'
          }`}
          onClick={() => setActiveSpeakerFocus(2)}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40">
              {isUrdu ? 'دوسرا مقرر (Speaker 2)' : 'Speaker 2'}
            </span>

            {/* Voice Dropdown */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <select
                value={speaker2.voice}
                onChange={(e) => setSpeaker2({ ...speaker2, voice: e.target.value })}
                className="bg-slate-950 border border-slate-700 rounded-lg text-xs px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id} ({isUrdu ? (v.gender === 'Female' ? 'خاتون' : 'مرد') : v.gender})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{isUrdu ? 'نام / کردار:' : 'Speaker Name / Role:'}</label>
              <input
                type="text"
                value={speaker2.name}
                onChange={(e) => setSpeaker2({ ...speaker2, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{isUrdu ? 'گفتگو / اسکرپٹ:' : 'Script Dialogue:'}</label>
              <textarea
                rows={5}
                value={speaker2.text}
                onChange={(e) => setSpeaker2({ ...speaker2, text: e.target.value })}
                onFocus={() => setActiveSpeakerFocus(2)}
                placeholder={isUrdu ? 'دوسرے مقرر کا مکالمہ یہاں لکھیں...' : 'Enter Speaker 2 dialogue...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:border-amber-500 focus:outline-none font-urdu leading-loose resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{isUrdu ? 'پوڈکاسٹ مکالمہ تیار ہو رہا ہے...' : 'Generating Dual Voice Podcast...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isUrdu ? 'پوڈکاسٹ آڈیو تیار کریں' : 'Generate Dual Speaker Audio'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
