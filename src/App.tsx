/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Mic,
  Volume2,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  Languages,
  Wand2,
  History,
  Trash2,
  FileText,
  Users,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Globe,
  Gauge,
  Heart,
  Smile,
  Shield,
  Zap,
  User,
  GraduationCap,
  Mail,
  Phone,
  MessageCircle,
  X,
  Info,
  Music,
} from 'lucide-react';
import { AudioPlayer } from './components/AudioPlayer.tsx';
import { VoiceSelector } from './components/VoiceSelector.tsx';
import { DualSpeakerStudio } from './components/DualSpeakerStudio.tsx';
import { LanguageAccentSelector } from './components/LanguageAccentSelector.tsx';
import { SAMPLE_TEMPLATES, VOCAL_BURSTS } from './data/templates.ts';
import { base64WavToMp3Blob } from './utils/audioConverter.ts';
import {
  SUPPORTED_LANGUAGES,
  LanguageOption,
  AccentOption,
  VOICE_CHARACTERS,
  EMOTION_TONES,
  SPEECH_PACING,
} from './data/languages.ts';
import { Voice, GenerationHistoryItem } from './types.ts';

const VOICES_LIST: Voice[] = VOICE_CHARACTERS.map((v) => ({
  id: v.id,
  nameUrdu: v.nameUrdu,
  descUrdu: v.roleUrdu,
  nameEn: v.nameEn,
  gender: v.gender,
  tone: v.tone,
}));

export default function App() {
  const [isUrdu, setIsUrdu] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'single' | 'dual' | 'templates' | 'history'>('single');
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState<boolean>(false);

  // Language & Accent State
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]); // Urdu
  const [selectedAccent, setSelectedAccent] = useState<AccentOption>(SUPPORTED_LANGUAGES[0].accents[0]); // Literary
  const [selectedEmotionTone, setSelectedEmotionTone] = useState<string>('emotional');
  const [selectedPacing, setSelectedPacing] = useState<string>('normal');

  // Single speaker form state
  const [text, setText] = useState<string>(
    'ستاروں سے آگے جہاں اور بھی ہیں،\nابھی عشق کے امتحان اور بھی ہیں۔\nاسی روز و شب میں الجھ کر نہ رہ جا،\nکہ تیرے زمان و مکاں اور بھی ہیں۔'
  );
  const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
  const [customStyle, setCustomStyle] = useState<string>('');
  const [modelType, setModelType] = useState<'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts'>('gemini-3.8-flash-lite-tts');
  const [useNastaliqFont, setUseNastaliqFont] = useState<boolean>(true);

  // Audio generation state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<{
    audioBase64: string;
    voiceName: string;
    model: string;
    text: string;
    details?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI translation and enhancement state
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('sawt_voice_history_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sawt_voice_history_v2', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Handle single speaker voice generation
  const handleGenerateSingle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      setErrorMsg(isUrdu ? 'براہ کرم آڈیو جنریٹ کرنے کے لیے کچھ متن درج کریں۔' : 'Please enter text to generate speech.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const activeEmotion = EMOTION_TONES.find((t) => t.id === selectedEmotionTone)?.prompt || '';
    const activePace = SPEECH_PACING.find((p) => p.id === selectedPacing)?.prompt || '';

    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voiceName: selectedVoice,
          language: `${selectedLanguage.nameEn} (${selectedLanguage.code})`,
          accentDescription: selectedAccent ? `${selectedAccent.nameEn} - ${selectedAccent.promptDescription}` : '',
          emotionTone: activeEmotion,
          pacing: activePace,
          style: customStyle,
          modelType,
          isMultiSpeaker: false,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate voice audio');
      }

      const detailsSummary = `${selectedLanguage.flag} ${isUrdu ? selectedLanguage.nameUrdu : selectedLanguage.nameEn} • ${selectedAccent ? (isUrdu ? selectedAccent.nameUrdu : selectedAccent.nameEn) : ''}`;

      const newAudioItem = {
        audioBase64: data.audioBase64,
        voiceName: selectedVoice,
        model: data.model || modelType,
        text: text.trim(),
        details: detailsSummary,
      };

      setCurrentAudio(newAudioItem);

      // Add to history
      const historyItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        text: text.trim(),
        audioBase64: data.audioBase64,
        voiceName: selectedVoice,
        model: data.model || modelType,
        language: `${selectedLanguage.flag} ${selectedLanguage.nameEn}`,
        accent: selectedAccent?.nameUrdu || selectedAccent?.nameEn,
        emotionTone: selectedEmotionTone,
        style: customStyle,
        createdAt: new Date().toLocaleTimeString(isUrdu ? 'ur-PK' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
    } catch (err: any) {
      console.error('Error generating audio:', err);
      setErrorMsg(err?.message || (isUrdu ? 'آواز تیار کرنے میں خرابی پیش آگئی، دوبارہ کوشش کریں۔' : 'Error generating audio. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dual-speaker podcast generation
  const handleGenerateDual = async (speakersData: any) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isMultiSpeaker: true,
          speakers: speakersData,
          modelType: 'gemini-3.8-flash-tts',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate dual-speaker audio');
      }

      const combinedText = `${speakersData[0].name}: ${speakersData[0].text}\n${speakersData[1].name}: ${speakersData[1].text}`;
      const newAudioItem = {
        audioBase64: data.audioBase64,
        voiceName: `${speakersData[0].voice} & ${speakersData[1].voice}`,
        model: 'gemini-3.8-flash-tts',
        text: combinedText,
        details: '👥 Dual Speaker Podcast',
      };

      setCurrentAudio(newAudioItem);

      const historyItem: GenerationHistoryItem = {
        id: Date.now().toString(),
        text: combinedText,
        audioBase64: data.audioBase64,
        voiceName: `${speakersData[0].voice} + ${speakersData[1].voice}`,
        model: 'gemini-3.8-flash-tts',
        isMultiSpeaker: true,
        speaker1: speakersData[0].name,
        speaker2: speakersData[1].name,
        createdAt: new Date().toLocaleTimeString(isUrdu ? 'ur-PK' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
    } catch (err: any) {
      console.error('Dual generation error:', err);
      setErrorMsg(err?.message || (isUrdu ? 'مکالمہ تیار کرنے میں خرابی پیش آگئی۔' : 'Failed to generate dialogue audio.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Translate and adapt text into selected language and accent
  const handleTranslateAndAdapt = async (langName: string, accentName: string) => {
    if (!text.trim()) return;
    setIsTranslating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          mode: 'translate_and_adapt',
          targetLanguage: langName,
          targetAccent: accentName,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setText(data.result);
      }
    } catch (e: any) {
      console.error('Translation error:', e);
      setErrorMsg(isUrdu ? 'ترجمہ کرنے میں خرابی پیش آگئی۔' : 'Translation failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  // AI Script Enhancement
  const handleEnhanceScript = async (mode: string) => {
    if (!text.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          mode,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setText(data.result);
      }
    } catch (e) {
      console.error('Failed to enhance script:', e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const insertBurstTag = (tag: string) => {
    setText((prev) => prev + ' ' + tag + ' ');
  };

  const applyTemplate = (tmpl: any) => {
    setText(tmpl.text);
    setSelectedVoice(tmpl.suggestedVoice);
    setCustomStyle(tmpl.suggestedStyle);
    setActiveTab('single');
  };

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadHistoryWav = (item: GenerationHistoryItem) => {
    try {
      const byteCharacters = atob(item.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-${item.voiceName || 'audio'}-${item.id}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error('Download WAV error:', e);
    }
  };

  const handleDownloadHistoryMp3 = (item: GenerationHistoryItem) => {
    try {
      const mp3Blob = base64WavToMp3Blob(item.audioBase64);
      const url = URL.createObjectURL(mp3Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-${item.voiceName || 'audio'}-${item.id}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error('Download MP3 error:', e);
      handleDownloadHistoryWav(item);
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${
        isUrdu ? 'font-urdu-clean' : 'font-sans'
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>صوت AI</span>
                  <span className="text-xs text-amber-400 font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    Voice & Accent Studio
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {isUrdu
                  ? 'مختلف آوازیں، علاقائی لہجے اور کثیر لسانی صوتی جنریشن (Gemini 3.8 TTS)'
                  : 'Multilingual Voice, Accent & Speech Generation powered by Gemini TTS'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Nastaliq toggle (only in Urdu) */}
            {isUrdu && (
              <button
                type="button"
                onClick={() => setUseNastaliqFont(!useNastaliqFont)}
                className={`text-xs px-2.5 py-1.5 rounded-xl border transition-colors ${
                  useNastaliqFont
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-urdu'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
                title="خط نستعلیق آن یا آف کریں"
              >
                نستعلیق
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={() => setIsUrdu(!isUrdu)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* About Creator Button */}
            <button
              type="button"
              onClick={() => setIsCreatorModalOpen(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-400/10 hover:from-amber-500/25 hover:to-amber-400/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer shadow-sm font-medium"
              title={isUrdu ? 'ایپ بنانے والے کا تعارف' : 'About the Creator'}
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUrdu ? 'تعارف سازندہ' : 'Developer'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Subheader */}
      <div className="bg-gradient-to-b from-amber-500/5 via-transparent to-transparent border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-1.5">
                <Globe className="w-3 h-3" />
                <span>
                  {isUrdu
                    ? `${selectedLanguage.flag} ${selectedLanguage.nameUrdu} • ${selectedAccent ? selectedAccent.nameUrdu : ''}`
                    : `${selectedLanguage.flag} ${selectedLanguage.nameEn} • ${selectedAccent ? selectedAccent.nameEn : ''}`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isUrdu
                  ? 'مختلف آوازوں، لہجوں اور زبانوں میں آڈیو جنریٹ کریں'
                  : 'Customize Voice, Accent, Tone & Language'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {isUrdu
                  ? 'اردو، عربی، انگریزی، پنجابی، پشتو اور دیگر زبانوں میں شستہ، ریڈیو، عام بول چال یا علاقائی لہجوں کے ساتھ حقیقی آواز بنائیں۔'
                  : 'Synthesize speech across Urdu, Arabic, English, Punjabi, Pashto and more with authentic regional dialects, emotional tones and voice characters.'}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center p-1 bg-slate-900/80 border border-slate-800 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('single')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'single'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'آواز و لہجہ اسٹوڈیو' : 'Voice & Accent'}</span>
              </button>

              <button
                onClick={() => setActiveTab('dual')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'dual'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'پوڈکاسٹ مکالمہ' : 'Dual Podcast'}</span>
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'templates'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'نمونہ اسکرپٹس' : 'Sample Scripts'}</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>{isUrdu ? `تاریخچہ (${history.length})` : `History (${history.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Error Alert if any */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/40 rounded-2xl p-4 flex items-center gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <div className="flex-1">{errorMsg}</div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 cursor-pointer"
            >
              ٹھیک ہے
            </button>
          </div>
        )}

        {/* Current Active Audio Player Card */}
        {currentAudio && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <AudioPlayer
              audioBase64={currentAudio.audioBase64}
              title={
                isUrdu
                  ? `تیار شدہ آواز (${currentAudio.voiceName})`
                  : `Generated Voice Audio (${currentAudio.voiceName})`
              }
              voiceName={currentAudio.voiceName}
              isRtl={isUrdu}
            />
          </div>
        )}

        {/* TAB 1: Single Speaker Voice & Accent Studio */}
        {activeTab === 'single' && (
          <div className="space-y-6">
            {/* 1. Language & Regional Accent Selector */}
            <LanguageAccentSelector
              selectedLanguageCode={selectedLanguage.code}
              onSelectLanguage={(lang) => setSelectedLanguage(lang)}
              selectedAccentId={selectedAccent?.id || ''}
              onSelectAccent={(accent) => setSelectedAccent(accent)}
              onTranslateCurrentText={handleTranslateAndAdapt}
              onLoadSampleText={(sample) => setText(sample)}
              isTranslating={isTranslating}
              isUrdu={isUrdu}
            />

            {/* 2. Text Editor & Voice Personas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 Cols: Text Editor & Vocal Bursts */}
              <div className="lg:col-span-8 space-y-5">
                {/* Text Area Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl relative backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100">
                        {isUrdu ? 'تحریر / اسکرپٹ درج کریں:' : 'Enter Script / Text:'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({text.length} {isUrdu ? 'حروف' : 'chars'} • {text.trim() ? text.trim().split(/\s+/).length : 0} {isUrdu ? 'الفاظ' : 'words'})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Copy text */}
                      <button
                        type="button"
                        onClick={copyTextToClipboard}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={isUrdu ? 'متن کاپی کریں' : 'Copy script'}
                      >
                        {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {/* Clear text */}
                      <button
                        type="button"
                        onClick={() => setText('')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                        title={isUrdu ? 'صاف کریں' : 'Clear text'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={
                      isUrdu
                        ? 'یہاں تحریر لکھیں جس کی آپ آواز اور لہجہ منتخب کر کے آڈیو بنانا چاہتے ہیں...'
                        : 'Type or paste the text you want to synthesize...'
                    }
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all resize-y ${
                      useNastaliqFont && isUrdu && selectedLanguage.code === 'ur'
                        ? 'font-urdu text-base'
                        : 'font-urdu-clean text-sm'
                    }`}
                  />

                  {/* Vocal Bursts Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">
                      {isUrdu ? 'جذباتی تاثرات شامل کریں:' : 'Insert Vocal Bursts:'}
                    </span>
                    {VOCAL_BURSTS.map((b) => (
                      <button
                        key={b.tag}
                        type="button"
                        onClick={() => insertBurstTag(b.tag)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 hover:border-amber-500/50 text-xs text-slate-200 transition-all cursor-pointer font-mono"
                        title={isUrdu ? b.labelUrdu : b.labelEn}
                      >
                        <span>{b.icon}</span>
                        <span>{b.tag}</span>
                      </button>
                    ))}
                  </div>

                  {/* AI Assistant Helpers */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <Wand2 className="w-3 h-3" />
                        <span>{isUrdu ? 'AI اسکرپٹ مددگار:' : 'AI Script Helper:'}</span>
                      </span>
                      <button
                        type="button"
                        disabled={isEnhancing || !text.trim()}
                        onClick={() => handleEnhanceScript('urdu_poetic')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isUrdu ? 'شاعرانہ انداز' : 'Poetic'}
                      </button>
                      <button
                        type="button"
                        disabled={isEnhancing || !text.trim()}
                        onClick={() => handleEnhanceScript('urdu_news')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isUrdu ? 'خبرنامہ' : 'News'}
                      </button>
                      <button
                        type="button"
                        disabled={isEnhancing || !text.trim()}
                        onClick={() => handleEnhanceScript('urdu_story')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isUrdu ? 'داستان' : 'Story'}
                      </button>
                      <button
                        type="button"
                        disabled={isEnhancing || !text.trim()}
                        onClick={() => handleEnhanceScript('vocal_bursts')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isUrdu ? 'خودکار تاثرات لگائیں' : 'Add Auto Bursts'}
                      </button>
                    </div>

                    {isEnhancing && (
                      <span className="text-xs text-amber-400 animate-pulse flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        <span>{isUrdu ? 'بہتر بنایا جا رہا ہے...' : 'Refining script...'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Voice Character Cards */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-amber-400" />
                        <span>{isUrdu ? '3. صوتی کردار منتخب کریں (Voice Character):' : '3. Select Voice Character:'}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isUrdu
                          ? 'اپنی پسند کی صوتی شخصیت، پچ اور صوتی خصلت منتخب کریں'
                          : 'Select prebuilt voice character with pitch and tone profile'}
                      </p>
                    </div>
                  </div>

                  <VoiceSelector
                    selectedVoice={selectedVoice}
                    onSelectVoice={(vId) => setSelectedVoice(vId)}
                    isUrdu={isUrdu}
                  />
                </div>
              </div>

              {/* Right 4 Cols: Tone, Pacing, Blueprint & Generate Action */}
              <div className="lg:col-span-4 space-y-5">
                {/* Voice Blueprint Summary Card */}
                <div className="bg-gradient-to-br from-amber-500/15 via-slate-900/90 to-purple-500/10 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUrdu ? 'صوتی پروفائل (Voice Blueprint)' : 'Voice Blueprint'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                      Active
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">{isUrdu ? 'زبان:' : 'Language:'}</span>
                      <span className="text-slate-200 font-medium">
                        {selectedLanguage.flag} {isUrdu ? selectedLanguage.nameUrdu : selectedLanguage.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">{isUrdu ? 'لہجہ و تلفظ:' : 'Accent:'}</span>
                      <span className="text-amber-300 font-medium text-right max-w-[180px] truncate">
                        {selectedAccent ? (isUrdu ? selectedAccent.nameUrdu : selectedAccent.nameEn) : 'معیاری'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">{isUrdu ? 'صوتی کردار:' : 'Voice:'}</span>
                      <span className="text-slate-200 font-medium">{selectedVoice}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">{isUrdu ? 'جذباتی موڈ:' : 'Emotion:'}</span>
                      <span className="text-slate-200 font-medium">
                        {EMOTION_TONES.find((t) => t.id === selectedEmotionTone)?.[isUrdu ? 'labelUrdu' : 'labelEn']}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-400">{isUrdu ? 'رفتار:' : 'Pacing:'}</span>
                      <span className="text-slate-200 font-medium">
                        {SPEECH_PACING.find((p) => p.id === selectedPacing)?.[isUrdu ? 'labelUrdu' : 'labelEn']}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emotion & Tone Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-slate-100">
                      {isUrdu ? '4. جذباتی انداز اور کیفیت (Emotion & Mood):' : '4. Emotion & Tone:'}
                    </h3>
                  </div>

                  {/* Emotion Tones grid */}
                  <div className="grid grid-cols-1 gap-2">
                    {EMOTION_TONES.map((t) => {
                      const isSel = selectedEmotionTone === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedEmotionTone(t.id)}
                          className={`text-right px-3 py-2 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-between ${
                            isSel
                              ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-semibold'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span>{isUrdu ? t.labelUrdu : t.labelEn}</span>
                          {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pacing Speed */}
                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isUrdu ? 'گفتگو کی رفتار (Speech Pacing):' : 'Speech Pacing:'}</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SPEECH_PACING.map((p) => {
                        const isSel = selectedPacing === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedPacing(p.id)}
                            className={`p-2 rounded-xl text-xs border transition-all cursor-pointer text-center ${
                              isSel
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className="block truncate">{isUrdu ? p.labelUrdu.split(' ')[0] : p.labelEn.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom style instruction */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      {isUrdu ? 'اضافی صوتی ہدایت (اختیاری):' : 'Additional Nuance (Optional):'}
                    </label>
                    <input
                      type="text"
                      value={customStyle}
                      onChange={(e) => setCustomStyle(e.target.value)}
                      placeholder="e.g. Add subtle smile, heartfelt warmth"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Model Engine Selector */}
                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs text-slate-400 mb-2">
                      {isUrdu ? 'اے آئی صوتی انجن (Model Engine):' : 'Gemini Model Engine:'}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setModelType('gemini-3.8-flash-lite-tts')}
                        className={`text-right p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          modelType === 'gemini-3.8-flash-lite-tts'
                            ? 'bg-amber-500/15 border-amber-500 text-slate-100 ring-1 ring-amber-500/30'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>Gemini 3.8 Flash-Lite TTS</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                            تجویز کردہ
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {isUrdu ? 'انتہائی تیز رفتار، کرسٹل کلیئر آواز' : 'High speed, standard ultra-clear speech'}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModelType('gemini-3.8-flash-tts')}
                        className={`text-right p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          modelType === 'gemini-3.8-flash-tts'
                            ? 'bg-purple-500/15 border-purple-500 text-slate-100 ring-1 ring-purple-500/30'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>Gemini 3.8 Flash TTS</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                            اعلیٰ ترین
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {isUrdu ? 'اعلیٰ تاثراتی اور فلیگ شپ وائس ڈیزائن' : 'Expressive flagship model for voice design'}
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Primary Generate Button */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleGenerateSingle}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>{isUrdu ? 'آواز تیار کی جا رہی ہے...' : 'Synthesizing Audio Voice...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 fill-slate-950" />
                        <span className="text-base">{isUrdu ? 'منتخب آواز و لہجے میں آڈیو جنریٹ کریں' : 'Generate Voice & Speech'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Dual Speaker Studio */}
        {activeTab === 'dual' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <DualSpeakerStudio
              voices={VOICES_LIST}
              onGenerate={handleGenerateDual}
              isLoading={isLoading}
              isUrdu={isUrdu}
            />
          </div>
        )}

        {/* TAB 3: Templates */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {isUrdu ? 'تیار شدہ اردو صوتی نمونے (Sample Urdu Scripts):' : 'Pre-written Urdu & Multilingual Scripts:'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isUrdu ? 'ایک کلک سے کسی بھی نمونے کو منتخب کر کے فوراً آواز بنائیں' : 'Click to load and generate instantly'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                        {tmpl.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {tmpl.suggestedVoice}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-100 text-sm mb-2">
                      {isUrdu ? tmpl.titleUrdu : tmpl.titleEn}
                    </h4>

                    <p className="text-xs text-slate-300 font-urdu leading-loose line-clamp-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {tmpl.text}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isUrdu ? 'تجویز کردہ انداز' : 'Suggested Style'}
                    </span>
                    <button
                      type="button"
                      onClick={() => applyTemplate(tmpl)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {isUrdu ? 'استعمال کریں' : 'Load Script'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: History */}
        {activeTab === 'history' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <span>{isUrdu ? 'تیار کردہ آوازوں کا ذخیرہ (Audio Library)' : 'Generated Audio Library'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isUrdu ? 'آپ کی تیار کردہ سابقہ آوازیں، زبان اور لہجہ یہاں محفوظ ہیں' : 'Your saved audio voice clips in this session'}
                </p>
              </div>

              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(isUrdu ? 'کیا آپ تمام تاریخچہ حذف کرنا چاہتے ہیں؟' : 'Clear all history?')) {
                      setHistory([]);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'تمام حذف کریں' : 'Clear All'}</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Volume2 className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
                <p className="text-sm">
                  {isUrdu ? 'ابھی تک کوئی آواز تیار نہیں کی گئی۔' : 'No generated voice clips yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('single')}
                  className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-pointer"
                >
                  {isUrdu ? 'پہلی آواز تیار کریں' : 'Generate First Audio'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-medium border border-amber-500/30">
                          {item.voiceName}
                        </span>
                        {item.language && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {item.language}
                          </span>
                        )}
                        {item.accent && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-amber-400/90 border border-slate-700 font-medium">
                            {item.accent}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-mono">{item.createdAt}</span>
                        {item.isMultiSpeaker && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            پوڈکاسٹ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-urdu line-clamp-2 leading-relaxed">
                        {item.text}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentAudio({
                            audioBase64: item.audioBase64,
                            voiceName: item.voiceName,
                            model: item.model,
                            text: item.text,
                            details: `${item.language || ''} • ${item.accent || ''}`,
                          });
                          window.scrollTo({ top: 120, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                        title={isUrdu ? 'سنیں' : 'Play'}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isUrdu ? 'چلائیں' : 'Play'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadHistoryMp3(item)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs border border-amber-500/30 transition-colors cursor-pointer font-medium"
                        title="MP3 فارمیٹ میں ڈاؤن لوڈ کریں"
                      >
                        <Music className="w-3 h-3 text-amber-400" />
                        <span>MP3</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadHistoryWav(item)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs border border-emerald-500/30 transition-colors cursor-pointer font-medium"
                        title="WAV فارمیٹ میں ڈاؤن لوڈ کریں"
                      >
                        <Download className="w-3 h-3 text-emerald-400" />
                        <span>WAV</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setText(item.text);
                          if (item.voiceName && !item.isMultiSpeaker) {
                            setSelectedVoice(item.voiceName);
                          }
                          setActiveTab('single');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors cursor-pointer"
                        title={isUrdu ? 'ایڈیٹر میں لوڈ کریں' : 'Edit Script'}
                      >
                        {isUrdu ? 'اسکرپٹ' : 'Edit'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Developer / Creator Card */}
      <section className="border-t border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 py-10 px-4 sm:px-6 mt-8">
        <div className="max-w-5xl mx-auto bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
              {/* Avatar Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 flex-shrink-0">
                <User className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isUrdu ? 'ایپ بنانے والے کا تعارف' : 'About the Creator & Developer'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  محمد یاسر نعمانی
                </h3>

                <p className="text-sm font-semibold text-amber-300 flex items-center justify-center sm:justify-start gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>جامعہ دارالعلوم حقانیہ اکوڑہ خٹک</span>
                </p>

                <p className="text-xs text-slate-400 max-w-xl leading-relaxed pt-1">
                  {isUrdu
                    ? 'یہ جدید آڈیو وائس جنریشن اسٹوڈیو اردو، عربی اور دیگر علاقائی و عالمی زبانوں میں اعلیٰ معیار کی قدرتی صوتی خدمات فراہم کرنے کے لیے تیار کیا گیا ہے۔'
                    : 'Crafted for high-fidelity Urdu, Arabic and multilingual neural voice generation powered by Gemini TTS.'}
                </p>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full sm:w-auto flex-shrink-0">
              {/* Email */}
              <a
                href="mailto:abuzaki786@gmail.com"
                className="flex items-center justify-center sm:justify-start gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-amber-500/40 text-xs font-mono transition-all group"
              >
                <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>abuzaki786@gmail.com</span>
              </a>

              {/* Phone / Call */}
              <div className="flex items-center gap-2">
                <a
                  href="tel:+923349430131"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-amber-500/40 text-xs font-mono transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span dir="ltr">+92-3349430131</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/923349430131"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-all"
                  title="واٹس ایپ پر رابطہ کریں"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Profile Modal Dialog */}
      {isCreatorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-right"
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            <button
              type="button"
              onClick={() => setIsCreatorModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black flex-shrink-0">
                <User className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  {isUrdu ? 'ایپ بنانے والے کا تعارف' : 'Developer Information'}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">محمد یاسر نعمانی</h3>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-sm">
              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">{isUrdu ? 'ادارہ / جامعہ:' : 'Institution:'}</div>
                  <div className="font-semibold text-white">جامعہ دارالعلوم حقانیہ اکوڑہ خٹک</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">{isUrdu ? 'ای میل پتہ:' : 'Email Address:'}</div>
                  <a href="mailto:abuzaki786@gmail.com" className="font-mono text-amber-300 hover:underline">
                    abuzaki786@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">{isUrdu ? 'فون نمبر و رابطہ:' : 'Contact & Phone:'}</div>
                  <a href="tel:+923349430131" className="font-mono text-emerald-300 hover:underline" dir="ltr">
                    +92-3349430131
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <a
                href="https://wa.me/923349430131"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isUrdu ? 'واٹس ایپ پر رابطہ' : 'WhatsApp'}</span>
              </a>
              <button
                type="button"
                onClick={() => setIsCreatorModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                {isUrdu ? 'بند کریں' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>صوت AI • محمد یاسر نعمانی</span>
            <span>•</span>
            <span>جامعہ دارالعلوم حقانیہ اکوڑہ خٹک</span>
          </div>
          <div>
            <span>WAV 24kHz & MP3 128kbps Audio Output • Gemini 3.8 TTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
