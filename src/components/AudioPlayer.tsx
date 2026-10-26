import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Headphones,
  X,
  RotateCcw
} from "lucide-react";
import { ReciterConfig } from "../types";
import { getAudioAyahUrl, getAudioSurahUrl } from "../data/reciters";
import { useLanguage } from "../context/LanguageContext";

interface AudioPlayerProps {
  currentSurahNumber?: number;
  currentSurahName?: string;
  currentAyahNumberInSurah?: number;
  globalAyahNumber?: number;
  totalAyahsInSurah?: number;
  isContinuousSurah: boolean;
  onToggleContinuous: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onAyahEnded?: () => void;
  currentReciter: ReciterConfig;
  onOpenReciterModal: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClosePlayer: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSurahNumber,
  currentSurahName,
  currentAyahNumberInSurah,
  globalAyahNumber,
  totalAyahsInSurah,
  isContinuousSurah,
  onToggleContinuous,
  onNextAyah,
  onPrevAyah,
  onAyahEnded,
  currentReciter,
  onOpenReciterModal,
  isPlaying,
  onPlayPause,
  onClosePlayer,
}) => {
  const { language, isRTL, t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [activeAudioSrc, setActiveAudioSrc] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  // Compute primary audio URL
  const primaryAudioUrl = React.useMemo(() => {
    if (!currentSurahNumber) return null;
    if (isContinuousSurah) {
      return getAudioSurahUrl(currentReciter, currentSurahNumber);
    }
    if (globalAyahNumber || (currentSurahNumber && currentAyahNumberInSurah)) {
      return getAudioAyahUrl(
        currentReciter,
        globalAyahNumber || 1,
        currentSurahNumber,
        currentAyahNumberInSurah || 1
      );
    }
    return null;
  }, [currentSurahNumber, globalAyahNumber, isContinuousSurah, currentReciter, currentAyahNumberInSurah]);

  // Sync active source when primary URL changes
  useEffect(() => {
    setActiveAudioSrc(primaryAudioUrl);
    setUsedFallback(false);
    setAudioError(null);
  }, [primaryAudioUrl]);

  // Load and play when activeAudioSrc changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeAudioSrc) {
      setAudioError(null);
      audio.src = activeAudioSrc;
      audio.playbackRate = playbackRate;
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (err.name === "AbortError") {
              // Ignore abort error caused by quick track switching
              return;
            }
            if (err.name === "NotAllowedError") {
              setAudioError("Tap play to begin audio (browser permission required)");
              return;
            }
            console.warn("Audio autoplay blocked or failed:", err);
            handleAudioSourceError();
          });
        }
      }
    } else {
      audio.pause();
    }
  }, [activeAudioSrc]);

  // Sync play/pause state from prop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name === "AbortError") return;
          if (err.name === "NotAllowedError") {
            setAudioError("Tap play to start recitation");
            return;
          }
          console.warn("Audio play prevented:", err);
          handleAudioSourceError();
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleAudioSourceError = useCallback(() => {
    if (!usedFallback && currentSurahNumber) {
      // Attempt fallback stream
      setUsedFallback(true);
      if (isContinuousSurah) {
        const padded = String(currentSurahNumber).padStart(3, "0");
        const fallback = `https://server8.mp3quran.net/afs/${padded}.mp3`;
        if (fallback !== activeAudioSrc) {
          setActiveAudioSrc(fallback);
          return;
        }
      } else {
        const fallback = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber || 1}.mp3`;
        if (fallback !== activeAudioSrc) {
          setActiveAudioSrc(fallback);
          return;
        }
      }
    }
    setAudioError("Audio playback paused or unavailable.");
  }, [usedFallback, currentSurahNumber, isContinuousSurah, activeAudioSrc, globalAyahNumber]);

  const handleRetry = () => {
    setAudioError(null);
    setUsedFallback(false);
    setActiveAudioSrc(primaryAudioUrl);
    const audio = audioRef.current;
    if (audio && primaryAudioUrl) {
      audio.src = primaryAudioUrl;
      audio.load();
      audio.play().catch((err) => {
        console.warn("Retry play error:", err);
        handleAudioSourceError();
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
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

  const handleAudioEnded = () => {
    if (onAyahEnded) {
      onAyahEnded();
    } else if (isContinuousSurah) {
      // Surah finished
    } else {
      onNextAyah();
    }
  };

  const toggleRate = () => {
    const rates = [0.75, 1, 1.25, 1.5];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!currentSurahNumber) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 py-3 sm:px-6 sm:py-4">
      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onError={handleAudioSourceError}
      />

      <div className="mx-auto max-w-4xl rounded-2xl border border-[#E6E0D4] bg-[#FBF8F2]/95 backdrop-blur-xl p-3 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="flex flex-col gap-2">
          {/* Main Controls Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Track info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F6B58] text-white shadow-xs">
                <Volume2 className={`h-5 w-5 ${isPlaying ? "animate-pulse" : ""}`} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1F1B16] truncate">
                    {currentSurahName || `Surah ${currentSurahNumber}`}
                  </h4>
                  {!isContinuousSurah && currentAyahNumberInSurah && (
                    <span className="rounded bg-[#0F6B58]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#0F6B58]">
                      {t("player.ayah")} {currentAyahNumberInSurah}
                    </span>
                  )}
                  {isContinuousSurah && (
                    <span className="rounded bg-[#C9A227]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#8B6E14]">
                      {t("player.fullSurah")}
                    </span>
                  )}
                </div>

                {/* Reciter display with modal trigger */}
                <button
                  onClick={onOpenReciterModal}
                  className="flex items-center gap-1 text-[11px] text-[#7A7265] hover:text-[#0F6B58] transition truncate"
                >
                  <Headphones className="h-3 w-3 text-[#0F6B58]" />
                  <span className="truncate">
                    {isRTL ? currentReciter.arabicName || currentReciter.name : currentReciter.name}
                  </span>
                </button>
              </div>
            </div>

            {/* Middle: Player Buttons */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Prev Button */}
              <button
                onClick={isRTL ? onNextAyah : onPrevAyah}
                disabled={isContinuousSurah || (currentAyahNumberInSurah || 1) <= 1}
                className="h-8 w-8 flex items-center justify-center rounded-full text-[#5C5549] hover:bg-[#EFEAE1] disabled:opacity-30"
                title={t("player.prevAyah")}
              >
                {isRTL ? <SkipForward className="h-4 w-4" /> : <SkipBack className="h-4 w-4" />}
              </button>

              {/* Play/Pause Main Button */}
              <button
                onClick={onPlayPause}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F6B58] text-white shadow-sm hover:bg-[#0A5344] transition-transform active:scale-95"
                title={isPlaying ? t("player.pause") : t("player.play")}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-white" />
                ) : (
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={isRTL ? onPrevAyah : onNextAyah}
                disabled={
                  isContinuousSurah ||
                  (currentAyahNumberInSurah || 1) >= (totalAyahsInSurah || 1)
                }
                className="h-8 w-8 flex items-center justify-center rounded-full text-[#5C5549] hover:bg-[#EFEAE1] disabled:opacity-30"
                title={t("player.nextAyah")}
              >
                {isRTL ? <SkipBack className="h-4 w-4" /> : <SkipForward className="h-4 w-4" />}
              </button>
            </div>

            {/* Right: Secondary Options (Speed, Continuous, Close) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Playback speed */}
              <button
                onClick={toggleRate}
                className="rounded-lg border border-[#E2DDD3] bg-white px-2 py-1 text-[11px] font-bold text-[#5C5549] hover:border-[#0F6B58] transition"
                title={t("player.speed")}
              >
                {playbackRate}x
              </button>

              {/* Continuous Play toggle */}
              <button
                onClick={onToggleContinuous}
                className={`hidden sm:flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition ${
                  isContinuousSurah
                    ? "border-[#0F6B58] bg-[#0F6B58]/10 text-[#0F6B58]"
                    : "border-[#E2DDD3] bg-white text-[#7A7265]"
                }`}
                title={t("player.continuous")}
              >
                <Repeat className="h-3 w-3" />
                <span>{t("player.continuous")}</span>
              </button>

              {/* Close Player */}
              <button
                onClick={onClosePlayer}
                className="h-7 w-7 flex items-center justify-center rounded-full text-[#8C8373] hover:bg-[#EFEAE1] hover:text-[#2B2620]"
                title={t("player.close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar & Time */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] text-[#8C8373] font-mono min-w-[32px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#E2DDD3] accent-[#0F6B58]"
            />
            <span className="text-[10px] text-[#8C8373] font-mono min-w-[32px] text-right">
              {formatTime(duration)}
            </span>
          </div>

          {audioError && (
            <div className="flex items-center justify-center gap-2 text-[11px] text-amber-800 bg-amber-50 py-1 px-2.5 rounded-lg border border-amber-200">
              <span>{audioError}</span>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1 underline font-semibold hover:text-[#0F6B58]"
              >
                <RotateCcw className="h-3 w-3" />
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
