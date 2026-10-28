import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Bookmark,
  Sparkles,
  Copy,
  Check,
  Volume2,
  BookOpen,
  Sliders,
  Share2,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Ayah, SurahDetail } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface SurahReaderProps {
  surah: SurahDetail | null;
  loading: boolean;
  onBack: () => void;
  activeAyahNumberInSurah?: number;
  isPlaying?: boolean;
  onPlayAyah: (ayah: Ayah) => void;
  onPlayFullSurah: () => void;
  onNavigateToExplore: (surahNumber: number, ayahNumber: number) => void;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  onToggleBookmark: (ayah: Ayah, surahDetail: SurahDetail) => void;
}

export const SurahReader: React.FC<SurahReaderProps> = ({
  surah,
  loading,
  onBack,
  activeAyahNumberInSurah,
  isPlaying,
  onPlayAyah,
  onPlayFullSurah,
  onNavigateToExplore,
  isBookmarked,
  onToggleBookmark,
}) => {
  const { language, t, isRTL } = useLanguage();
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSizeClass, setFontSizeClass] = useState<"sm" | "md" | "lg">("md");
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "mushaf">("card");

  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Smoothly scroll active ayah into view without jarring flashes
  useEffect(() => {
    if (activeAyahNumberInSurah && ayahRefs.current.has(activeAyahNumberInSurah)) {
      const el = ayahRefs.current.get(activeAyahNumberInSurah);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeAyahNumberInSurah]);

  const handleCopy = (ayah: Ayah) => {
    if (!surah) return;
    const surahLabel =
      language === "ar"
        ? `سورة ${surah.name}`
        : language === "fa"
        ? `سوره ${surah.name}`
        : `Surah ${surah.englishName}`;
    const textToCopy = `${ayah.text}\n"${ayah.translation || ""}"\n— [${surahLabel} ${surah.number}:${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  if (loading || !surah) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        {/* Skeleton loader */}
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 mx-auto bg-[#EFEAE1] rounded-lg" />
          <div className="h-4 w-72 mx-auto bg-[#EFEAE1] rounded-lg" />
          <div className="mt-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-white border border-[#E8E2D8] p-6" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Bismillah is shown for all surahs except Surah 9 (At-Tawba).
  // For Surah 1 (Al-Faatiha), verse 1 IS the Bismillah in the Uthmani text.
  const showBismillahBanner = surah.number !== 9 && surah.number !== 1;

  const fontSizes = {
    sm: "text-2xl leading-[2.2rem]",
    md: "text-3xl sm:text-4xl leading-[2.8rem] sm:leading-[3.5rem]",
    lg: "text-4xl sm:text-5xl leading-[3.6rem] sm:leading-[4.2rem]",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 pb-32">
      {/* Top Back & Header Bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-[#E5DFD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#4A4337] shadow-xs hover:border-[#0F6B58] hover:text-[#0F6B58] transition"
        >
          {isRTL ? <ChevronRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{t("reader.allSurahs")}</span>
        </button>

        {/* View & Font Controls */}
        <div className="flex items-center gap-2">
          {/* Mushaf vs Card View Toggle */}
          <div className="hidden sm:flex items-center rounded-lg border border-[#E2DDD3] bg-white p-0.5 text-xs">
            <button
              onClick={() => setViewMode("card")}
              className={`px-2.5 py-1 rounded-md transition ${
                viewMode === "card" ? "bg-[#0F6B58] text-white font-medium shadow-xs" : "text-[#6B6355] hover:text-[#2B2620]"
              }`}
            >
              {t("reader.cards")}
            </button>
            <button
              onClick={() => setViewMode("mushaf")}
              className={`px-2.5 py-1 rounded-md transition ${
                viewMode === "mushaf" ? "bg-[#0F6B58] text-white font-medium shadow-xs" : "text-[#6B6355] hover:text-[#2B2620]"
              }`}
            >
              {t("reader.mushaf")}
            </button>
          </div>

          {/* Translation Toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              showTranslation
                ? "border-[#0F6B58]/30 bg-[#0F6B58]/10 text-[#0F6B58]"
                : "border-[#E5DFD5] bg-white text-[#6B6355]"
            }`}
          >
            {t("reader.translation")}: {showTranslation ? t("reader.on") : t("reader.off")}
          </button>

          {/* Font Size Selector */}
          <div className="flex items-center rounded-lg border border-[#E2DDD3] bg-white p-0.5 text-xs">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSizeClass(s)}
                className={`px-2 py-1 rounded-md uppercase font-medium transition ${
                  fontSizeClass === s ? "bg-[#2B2620] dark:bg-[#0F6B58] text-white shadow-xs" : "text-[#7A7265] dark:text-[#D6CEC1] hover:text-[#2B2620] dark:hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Surah Title Banner */}
      <div className="stripe-card relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#FCFAF6] to-[#F7F2E8] dark:from-[#17211C] dark:via-[#141C19] dark:to-[#121815] p-6 sm:p-8 text-center mb-8 border border-[#E6E0D4] dark:border-[#27352F]">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#0F6B58]/10 px-3 py-1 text-xs font-semibold text-[#0F6B58] mb-3">
          {language === "ar"
            ? `سورة رقم ${surah.number} • ${surah.revelationType === "Meccan" ? "مكية" : "مدنية"} • ${surah.numberOfAyahs} آيات`
            : language === "fa"
            ? `سوره شماره ${surah.number} • ${surah.revelationType === "Meccan" ? "مکی" : "مدنی"} • ${surah.numberOfAyahs} آیه`
            : language === "id"
            ? `Surah ${surah.number} • ${surah.revelationType === "Meccan" ? "Makkiyah" : "Madaniyah"} • ${surah.numberOfAyahs} Ayat`
            : `Surah ${surah.number} • ${surah.revelationType} • ${surah.numberOfAyahs} Verses`}
        </div>

        <h1 className="font-arabic text-4xl sm:text-5xl font-bold text-[#1F1B16] my-2" dir="rtl">
          {surah.name}
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-[#2B2620]">
          {language === "ar" || language === "fa" ? `سورة ${surah.name}` : surah.englishName}
        </h2>
        <p className="text-sm text-[#7A7265] mt-0.5 italic">
          "{surah.englishNameTranslation}"
        </p>

        {/* Listen Full Surah CTA */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={onPlayFullSurah}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F6B58] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#0A5344] transition-colors"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>{t("reader.playFull")}</span>
          </button>
        </div>

        {/* Decorative corner flourishes */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#0F6B58]/5 blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 h-24 w-24 rounded-full bg-[#C9A227]/10 blur-xl pointer-events-none" />
      </div>

      {/* Bismillah Header */}
      {showBismillahBanner && (
        <div className="my-8 text-center select-none">
          <div className="inline-block relative">
            <span className="font-arabic text-3xl sm:text-4xl text-[#1E1B18] font-semibold" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </span>
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C9A227]" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[#C9A227]" />
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C9A227]" />
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: MUSHAF CONTINUOUS FLOW */}
      {viewMode === "mushaf" ? (
        <div className="stripe-card rounded-3xl p-6 sm:p-10 bg-white border border-[#E6E0D4] shadow-sm">
          <div
            className={`font-arabic text-right leading-[3.2rem] sm:leading-[3.8rem] text-[#221D17] ${fontSizes[fontSizeClass]}`}
            dir="rtl"
          >
            {surah.ayahs.map((ayah) => {
              const isActive = activeAyahNumberInSurah === ayah.numberInSurah;
              return (
                <span
                  key={ayah.numberInSurah}
                  ref={(el) => {
                    if (el) ayahRefs.current.set(ayah.numberInSurah, el);
                  }}
                  onClick={() => onPlayAyah(ayah)}
                  className={`inline cursor-pointer px-1 py-0.5 rounded-lg transition-colors duration-300 ${
                    isActive
                      ? "bg-[#C9A227]/25 text-[#0F6B58] ring-2 ring-[#C9A227]/50"
                      : "hover:bg-[#F4EFE6]"
                  }`}
                  title={`Ayah ${ayah.numberInSurah} (Click to play)`}
                >
                  {ayah.text}{" "}
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-[#C9A227]/70 text-xs text-[#8B6E14] font-sans font-bold align-middle mx-1.5 bg-[#FAF7F0]">
                    {ayah.numberInSurah}
                  </span>{" "}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW MODE: AYAH CARDS (Study Mode) */
        <div className="space-y-4">
          {surah.ayahs.map((ayah) => {
            const isActive = activeAyahNumberInSurah === ayah.numberInSurah;
            const bookmarked = isBookmarked(surah.number, ayah.numberInSurah);

            return (
              <div
                key={ayah.numberInSurah}
                id={`ayah-card-${ayah.numberInSurah}`}
                ref={(el) => {
                  if (el) ayahRefs.current.set(ayah.numberInSurah, el);
                }}
                className={`stripe-card relative rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
                  isActive
                    ? "border-[#C9A227] bg-[#FCFBF8] shadow-[0_4px_16px_rgba(201,162,39,0.15)] ring-2 ring-[#C9A227]/40"
                    : "bg-white border-[#E8E2D8] hover:border-[#0F6B58]/30"
                }`}
              >
                {/* Header: Ayah reference tag + Action controls */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F4EFE6]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F2EDE4] text-xs font-bold text-[#0F6B58]">
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-xs text-[#8C8373] font-medium">
                      {surah.number}:{ayah.numberInSurah}
                    </span>
                    {ayah.juz && (
                      <span className="rounded bg-[#F7F4EE] px-1.5 py-0.5 text-[10px] text-[#7A7265]">
                        {t("reader.juz")} {ayah.juz}
                      </span>
                    )}
                  </div>

                  {/* Micro-actions */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Play Ayah Audio */}
                    <button
                      onClick={() => onPlayAyah(ayah)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                        isActive && isPlaying
                          ? "bg-[#0F6B58] text-white border-[#0F6B58]"
                          : "border-[#E5DFD5] bg-white text-[#5C5549] hover:border-[#0F6B58] hover:text-[#0F6B58]"
                      }`}
                      title={language === "ar" ? "استماع للآية" : language === "fa" ? "شنیدن صوت آیه" : t("reader.playAyah")}
                    >
                      {isActive && isPlaying ? (
                        <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Bookmark Button with tactile bounce */}
                    <button
                      onClick={() => onToggleBookmark(ayah, surah)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5DFD5] bg-white text-[#5C5549] hover:border-[#C9A227] transition active:scale-90"
                      title={bookmarked ? (language === "ar" ? "إزالة الحفظ" : language === "fa" ? "حذف نشان" : "Remove Bookmark") : (language === "ar" ? "حفظ الآية" : language === "fa" ? "نشان کردن آیه" : "Save Bookmark")}
                    >
                      <Bookmark
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          bookmarked
                            ? "fill-[#C9A227] text-[#C9A227] scale-110"
                            : "text-[#8C8373]"
                        }`}
                      />
                    </button>

                    {/* Copy Text */}
                    <button
                      onClick={() => handleCopy(ayah)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5DFD5] bg-white text-[#5C5549] hover:border-[#0F6B58] transition"
                      title={language === "ar" ? "نسخ الآية والترجمة" : language === "fa" ? "کپی آیه و ترجمه" : "Copy Arabic & Translation"}
                    >
                      {copiedAyah === ayah.numberInSurah ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[#8C8373]" />
                      )}
                    </button>

                    {/* Explain this verse link -> jumps to Tab 2 pre-filled */}
                    <button
                      onClick={() => onNavigateToExplore(surah.number, ayah.numberInSurah)}
                      className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#0F6B58]/25 bg-[#0F6B58]/6 px-2.5 py-1.5 text-xs font-semibold text-[#0F6B58] hover:bg-[#0F6B58] hover:text-white transition"
                    >
                      <span>{t("reader.exploreTafsir")}</span>
                      {isRTL ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                {/* Arabic Text (RTL) in Amiri Quran font */}
                <div
                  className={`font-arabic text-right text-[#1F1B16] font-normal my-3 select-text ${fontSizes[fontSizeClass]}`}
                  dir="rtl"
                >
                  {ayah.text}{" "}
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-[#C9A227] text-xs text-[#8B6E14] font-sans font-bold align-middle mx-1 bg-[#FAF7F0]">
                    {ayah.numberInSurah}
                  </span>
                </div>

                {/* English Saheeh International Translation */}
                {showTranslation && ayah.translation && (
                  <div className="mt-4 pt-3 border-t border-[#F5F0E6]">
                    <p className="text-sm sm:text-base text-[#3A342B] leading-relaxed font-sans">
                      {ayah.translation}
                    </p>
                  </div>
                )}

                {/* Mobile 'Explain this verse' button */}
                <div className="mt-3 flex sm:hidden justify-end">
                  <button
                    onClick={() => onNavigateToExplore(surah.number, ayah.numberInSurah)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F6B58]"
                  >
                    <span>{t("reader.exploreTafsir")}</span>
                    {isRTL ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
