import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, Check, Sparkles, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  audioBase64: string;
  mimeType?: string;
  title?: string;
  voiceName?: string;
  isRtl?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  mimeType = 'audio/wav',
  title = 'تیار شدہ آواز (Generated Audio)',
  voiceName,
  isRtl = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    if (!audioBase64) return;
    try {
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      setIsPlaying(false);
      setCurrentTime(0);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error('Failed to create audio blob URL:', e);
      setAudioUrl(`data:${mimeType};base64,${audioBase64}`);
    }
  }, [audioBase64, mimeType]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error('Audio play error:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const cycleSpeed = () => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const downloadWav = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `voice-${voiceName || 'audio'}-${timestamp}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-300">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header inside player */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>{title}</span>
              {voiceName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono">
                  {voiceName}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400 font-mono">
              24kHz • 16-bit Mono WAV • High Fidelity
            </p>
          </div>
        </div>

        <button
          onClick={downloadWav}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors shadow-sm"
          title="ڈاؤن لوڈ کریں (.WAV)"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>ڈاؤن لوڈ مکمل!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>ڈاؤن لوڈ کریں (WAV)</span>
            </>
          )}
        </button>
      </div>

      {/* Simulated Live Audio Waveform Bars */}
      <div className="h-16 flex items-center justify-center gap-1 bg-slate-950/60 rounded-xl p-3 mb-4 border border-slate-800">
        {[
          18, 35, 24, 48, 60, 30, 80, 50, 95, 40, 70, 85, 45, 65, 30, 90, 55, 35, 75, 45, 20, 60,
          85, 40, 65, 90, 50, 30, 70, 45, 80, 25, 60, 35, 50, 20
        ].map((height, i) => {
          const progressPercent = duration ? (currentTime / duration) * 100 : 0;
          const barPercent = (i / 36) * 100;
          const isPassed = barPercent <= progressPercent;

          return (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isPlaying
                  ? isPassed
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'bg-slate-700'
                  : isPassed
                  ? 'bg-amber-500/70'
                  : 'bg-slate-800'
              }`}
              style={{
                height: isPlaying ? `${Math.max(8, height * (0.6 + Math.random() * 0.5))}%` : `${Math.max(15, height * 0.6)}%`,
              }}
            />
          );
        })}
      </div>

      {/* Seek track bar */}
      <div className="space-y-1 mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          dir={isRtl ? 'rtl' : 'ltr'}
        />
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Play / Pause button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
            title={isPlaying ? 'روکیں' : 'چلائیں'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          {/* Restart */}
          <button
            onClick={restartAudio}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="دوبارہ شروع سے چلائیں"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed cycle button */}
          <button
            onClick={cycleSpeed}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white font-mono transition-colors cursor-pointer"
            title="رفتار تبدیل کریں"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span>{playbackRate}x</span>
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={toggleMute}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};
