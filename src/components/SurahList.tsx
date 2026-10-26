import React, { useState, useMemo } from "react";
import { Search, Play, Volume2, Sparkles } from "lucide-react";
import { SurahInfo } from "../types";
import { normalizeSurahName } from "../utils/verseParser";
import { useLanguage } from "../context/LanguageContext";

interface SurahListProps {
  surahs: SurahInfo[];
  onSelectSurah: (surahNumber: number) => void;
  onPlaySurah: (surahNumber: number) => void;
  currentPlayingSurahNumber?: number;
  isPlaying?: boolean;
}

const POPULAR_SURAHS_EN = [
  { number: 1, name: "Al-Faatiha" },
  { number: 18, name: "Al-Kahf" },
  { number: 36, name: "Yaseen" },
  { number: 55, name: "Ar-Rahmaan" },
  { number: 67, name: "Al-Mulk" },
  { number: 112, name: "Al-Ikhlaas" },
];

const POPULAR_SURAHS_AR = [
  { number: 1, name: "الفاتحة" },
  { number: 18, name: "الكهف" },
  { number: 36, name: "يس" },
  { number: 55, name: "الرحمن" },
  { number: 67, name: "الملك" },
  { number: 112, name: "الإخلاص" },
];

const POPULAR_SURAHS_FA = [
  { number: 1, name: "فاتحه" },
  { number: 18, name: "کهف" },
  { number: 36, name: "یس" },
  { number: 55, name: "الرحمن" },
  { number: 67, name: "ملک" },
  { number: 112, name: "اخلاص" },
];

const POPULAR_SURAHS_ID = [
  { number: 1, name: "Al-Fatihah" },
  { number: 18, name: "Al-Kahfi" },
  { number: 36, name: "Yasin" },
  { number: 55, name: "Ar-Rahman" },
  { number: 67, name: "Al-Mulk" },
  { number: 112, name: "Al-Ikhlas" },
];

export const SurahList: React.FC<SurahListProps> = ({
  surahs,
  onSelectSurah,
  onPlaySurah,
  currentPlayingSurahNumber,
  isPlaying,
}) => {
  const { language, t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Meccan" | "Medinan">("All");

  const popularSurahs =
    language === "ar"
      ? POPULAR_SURAHS_AR
      : language === "fa"
      ? POPULAR_SURAHS_FA
      : language === "id"
      ? POPULAR_SURAHS_ID
      : POPULAR_SURAHS_EN;

  const filteredSurahs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q && filterType === "All") return surahs;

    const normQ = normalizeSurahName(q);

    return surahs.filter((surah) => {
      const matchesFilter =
        filterType === "All" || surah.revelationType === filterType;

      if (!matchesFilter) return false;
      if (!q) return true;

      const normEng = normalizeSurahName(surah.englishName);
      const normTrans = normalizeSurahName(surah.englishNameTranslation);

      return (
        surah.number.toString() === q ||
        surah.englishName.toLowerCase().includes(q) ||
        surah.englishNameTranslation.toLowerCase().includes(q) ||
        surah.name.includes(q) ||
        (normQ.length >= 2 && (normEng.includes(normQ) || normTrans.includes(normQ) || normQ.includes(normEng)))
      );
    });
  }, [surahs, searchQuery, filterType]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Stripe-style Hero & Overview */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0F6B58]/20 bg-[#0F6B58]/8 px-3 py-1 text-xs font-semibold text-[#0F6B58] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            {t("surahList.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#221D17]">
            {t("surahList.title")}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#6B6355] max-w-2xl">
            {t("surahList.subtitle")}
          </p>
        </div>

        {/* Popular Surah Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          <span className="text-xs font-medium text-[#7A7265] mr-1">{t("surahList.frequent")}</span>
          {popularSurahs.map((s) => (
            <button
              key={s.number}
              onClick={() => onSelectSurah(s.number)}
              className="rounded-full border border-[#E5DFD5] bg-white px-2.5 py-1 text-xs font-medium text-[#4A4337] shadow-2xs hover:border-[#0F6B58] hover:text-[#0F6B58] transition"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stripe-style Search & Filter Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input with keyboard feel */}
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8373] ${isRTL ? "right-3.5" : "left-3.5"}`} />
          <input
            type="text"
            id="surah-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("surahList.searchPlaceholder")}
            className={`w-full rounded-xl border border-[#E2DDD3] bg-white py-2.5 text-sm text-[#2B2620] placeholder-[#8C8373] shadow-xs outline-none transition focus:border-[#0F6B58] focus:ring-2 focus:ring-[#0F6B58]/10 ${
              isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute top-1/2 -translate-y-1/2 text-xs text-[#8C8373] hover:text-[#2B2620] px-1.5 py-0.5 rounded bg-[#F2EDE4] ${
                isRTL ? "left-3" : "right-3"
              }`}
            >
              {t("common.clear", "Clear")}
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto border border-[#E2DDD3] rounded-xl p-1 bg-[#F5F0E6]/60">
          {(["All", "Meccan", "Medinan"] as const).map((type) => {
            const count =
              type === "All"
                ? surahs.length
                : surahs.filter((s) => s.revelationType === type).length;
            const active = filterType === type;
            const label =
              type === "All"
                ? t("surahList.allSurahs")
                : type === "Meccan"
                ? t("surahList.meccan")
                : t("surahList.medinan");

            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-white text-[#0F6B58] shadow-xs font-semibold"
                    : "text-[#6B6355] hover:text-[#2B2620]"
                }`}
              >
                {label} <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Surah Cards Grid */}
      {filteredSurahs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCD5C8] p-12 text-center">
          <p className="text-[#6B6355] font-medium text-base">
            {t("surahList.noSurahs")} {searchQuery ? `"${searchQuery}"` : ""}.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("All");
            }}
            className="mt-3 text-xs font-semibold text-[#0F6B58] underline underline-offset-2"
          >
            {t("surahList.resetSearch")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => {
            const isThisPlaying =
              currentPlayingSurahNumber === surah.number && isPlaying;

            const revTypeLabel =
              surah.revelationType === "Meccan"
                ? t("surahList.meccan")
                : t("surahList.medinan");

            const mainSurahTitle =
              language === "ar" || language === "fa" ? surah.name : surah.englishName;
            const secondarySurahTitle =
              language === "ar" || language === "fa" ? surah.englishName : surah.name;
            const subTitle =
              language === "ar"
                ? `سورة رقم ${surah.number}`
                : language === "fa"
                ? `سوره شماره ${surah.number}`
                : surah.englishNameTranslation;

            return (
              <div
                key={surah.number}
                id={`surah-card-${surah.number}`}
                onClick={() => onSelectSurah(surah.number)}
                className="group stripe-card relative flex flex-col justify-between rounded-2xl p-5 cursor-pointer select-none"
              >
                {/* Top row: Number badge & Arabic/English title */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EFE6] text-xs font-bold text-[#0F6B58] border border-[#E5DFD5] group-hover:bg-[#0F6B58] group-hover:text-white group-hover:border-[#0F6B58] transition-colors">
                      {surah.number}
                    </div>
                    <div>
                      <h2 className="font-semibold text-[#1F1B16] text-base group-hover:text-[#0F6B58] transition-colors">
                        {mainSurahTitle}
                      </h2>
                      <p className="text-xs text-[#7A7265] truncate max-w-[150px]">
                        {subTitle}
                      </p>
                    </div>
                  </div>

                  {/* Secondary name */}
                  <div className={isRTL ? "text-left" : "text-right"}>
                    <span className="font-arabic text-2xl font-bold text-[#1E1B18] leading-none group-hover:text-[#0F6B58] transition-colors">
                      {secondarySurahTitle}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Metadata badges & Quick Audio Play button */}
                <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#F2ECE1]">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#F2EDE4] px-2 py-0.5 text-[11px] font-medium text-[#6B6355]">
                      {surah.numberOfAyahs} {t("surahList.ayahs")}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        surah.revelationType === "Meccan"
                          ? "bg-amber-50 text-amber-800 border border-amber-200/50"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200/50"
                      }`}
                    >
                      {revTypeLabel}
                    </span>
                  </div>

                  {/* Quick Play Surah Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlaySurah(surah.number);
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                      isThisPlaying
                        ? "bg-[#0F6B58] text-white border-[#0F6B58] shadow-sm animate-pulse"
                        : "border-[#E5DFD5] bg-white text-[#5C5549] hover:bg-[#0F6B58] hover:text-white hover:border-[#0F6B58]"
                    }`}
                    title={isThisPlaying ? (language === "ar" ? "الصوت يعمل" : "Audio Playing") : t("surahList.playSurah")}
                  >
                    {isThisPlaying ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    )}
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

