import React, { useState, useEffect } from "react";
import {
  Search,
  ShieldCheck,
  Library,
  ScrollText,
  Play,
  Volume2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Info,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Compass
} from "lucide-react";
import { ALL_SURAHS } from "../data/surahs";
import {
  AppLanguage,
  Ayah,
  Bookmark as BookmarkType,
  DualTafsirData,
  SearchResultItem,
  SurahInfo,
  TafsirData,
} from "../types";
import {
  fetchAyahWithTranslation,
  fetchDualTafsir,
  fetchTafsir,
  searchByKeyword,
} from "../services/quranApi";
import { parseVerseReference } from "../utils/verseParser";
import { useLanguage } from "../context/LanguageContext";

interface VerseExplorerProps {
  initialSurahNumber?: number;
  initialAyahNumber?: number;
  onPlayAyah: (ayah: Ayah, surahNumber: number, surahName: string) => void;
  isPlaying?: boolean;
  playingGlobalAyahNumber?: number;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  onToggleBookmark: (ayah: Ayah, surah: SurahInfo) => void;
}

const FEATURED_VERSES_EN = [
  { surah: 2, ayah: 255, label: "Ayat al-Kursi (2:255)" },
  { surah: 24, ayah: 35, label: "The Verse of Light (24:35)" },
  { surah: 94, ayah: 5, label: "Relief with Hardship (94:5)" },
  { surah: 55, ayah: 13, label: "Ar-Rahman (55:13)" },
  { surah: 112, ayah: 1, label: "Al-Ikhlaas (112:1)" },
  { surah: 1, ayah: 1, label: "Al-Faatiha (1:1)" },
];

const FEATURED_VERSES_AR = [
  { surah: 2, ayah: 255, label: "آية الكرسي (٢:٢٥٥)" },
  { surah: 24, ayah: 35, label: "آية النور (٢٤:٣٥)" },
  { surah: 94, ayah: 5, label: "فإن مع العسر يسرا (٩٤:٥)" },
  { surah: 55, ayah: 13, label: "سورة الرحمن (٥٥:١٣)" },
  { surah: 112, ayah: 1, label: "سورة الإخلاص (١١٢:١)" },
  { surah: 1, ayah: 1, label: "سورة الفاتحة (١:١)" },
];

const FEATURED_VERSES_FA = [
  { surah: 2, ayah: 255, label: "آیة الکرسی (۲:۲۵۵)" },
  { surah: 24, ayah: 35, label: "آیه نور (۲۴:۳۵)" },
  { surah: 94, ayah: 5, label: "ان مع العسر یسرا (۹۴:۵)" },
  { surah: 55, ayah: 13, label: "سوره الرحمن (۵۵:۱۳)" },
  { surah: 112, ayah: 1, label: "سوره اخلاص (۱۱۲:۱)" },
  { surah: 1, ayah: 1, label: "سوره فاتحه (۱:۱)" },
];

const FEATURED_VERSES_ID = [
  { surah: 2, ayah: 255, label: "Ayat Kursi (2:255)" },
  { surah: 24, ayah: 35, label: "Ayat Cahaya (24:35)" },
  { surah: 94, ayah: 5, label: "Kemudahan Bersama Kesulitan (94:5)" },
  { surah: 55, ayah: 13, label: "Surah Ar-Rahman (55:13)" },
  { surah: 112, ayah: 1, label: "Surah Al-Ikhlas (112:1)" },
  { surah: 1, ayah: 1, label: "Surah Al-Fatihah (1:1)" },
];

export const VerseExplorer: React.FC<VerseExplorerProps> = ({
  initialSurahNumber = 2,
  initialAyahNumber = 255,
  onPlayAyah,
  isPlaying,
  playingGlobalAyahNumber,
  isBookmarked,
  onToggleBookmark,
}) => {
  const { language, t, isRTL } = useLanguage();
  const featuredVerses =
    language === "ar"
      ? FEATURED_VERSES_AR
      : language === "fa"
      ? FEATURED_VERSES_FA
      : language === "id"
      ? FEATURED_VERSES_ID
      : FEATURED_VERSES_EN;

  // Method 1: Dropdown + Stepper
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(initialSurahNumber);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState<number>(initialAyahNumber);

  // Method 2: Free-text search (Reference or Topic)
  const [freeTextQuery, setFreeTextQuery] = useState("");
  const [isSearchingKeywords, setIsSearchingKeywords] = useState(false);
  const [keywordResults, setKeywordResults] = useState<SearchResultItem[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Loaded Verse State
  const [currentSurahInfo, setCurrentSurahInfo] = useState<SurahInfo | null>(null);
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [currentTranslation, setCurrentTranslation] = useState<string>("");
  const [dualTafsir, setDualTafsir] = useState<DualTafsirData | null>(null);
  const [loadingVerse, setLoadingVerse] = useState<boolean>(false);
  const [verseError, setVerseError] = useState<string | null>(null);

  // Transliteration Toggle
  const [showTransliteration, setShowTransliteration] = useState(false);

  // Authentic Classical Tafsir View State: "all" (comparative) | "sunni" | "shia" | "arabic"
  const [tafsirView, setTafsirView] = useState<"all" | "sunni" | "shia" | "arabic">("all");
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Get current surah meta for max ayahs validation
  const currentSurahMeta =
    ALL_SURAHS.find((s) => s.number === selectedSurahNumber) || ALL_SURAHS[0];

  // Load verse whenever selection changes
  const loadVerse = async (surahNum: number, ayahNum: number, lang: AppLanguage = language) => {
    setLoadingVerse(true);
    setVerseError(null);

    try {
      const [verseRes, dualTafsirRes] = await Promise.all([
        fetchAyahWithTranslation(surahNum, ayahNum, lang),
        fetchDualTafsir(surahNum, ayahNum, lang),
      ]);

      setCurrentSurahInfo(verseRes.surahInfo);
      setCurrentAyah(verseRes.arabic);
      setCurrentTranslation(verseRes.translation);
      setDualTafsir(dualTafsirRes);
      setSelectedSurahNumber(surahNum);
      setSelectedAyahNumber(ayahNum);
    } catch (err: any) {
      setVerseError("Could not load verse. Please verify the surah and ayah reference.");
    } finally {
      setLoadingVerse(false);
    }
  };

  useEffect(() => {
    loadVerse(initialSurahNumber, initialAyahNumber, language);
  }, [initialSurahNumber, initialAyahNumber]);

  // Reload verse with appropriate translation whenever active language changes
  useEffect(() => {
    loadVerse(selectedSurahNumber, selectedAyahNumber, language);
  }, [language]);

  // Handle Surah change in dropdown -> clamp ayah to valid range
  const handleSurahChange = (newSurahNum: number) => {
    const meta = ALL_SURAHS.find((s) => s.number === newSurahNum) || ALL_SURAHS[0];
    const newAyahNum = Math.min(selectedAyahNumber, meta.numberOfAyahs);
    setSelectedSurahNumber(newSurahNum);
    setSelectedAyahNumber(newAyahNum);
    loadVerse(newSurahNum, newAyahNum, language);
  };

  // Stepper handlers with strict validation
  const handleAyahStepper = (delta: number) => {
    const newAyah = selectedAyahNumber + delta;
    if (newAyah >= 1 && newAyah <= currentSurahMeta.numberOfAyahs) {
      setSelectedAyahNumber(newAyah);
      loadVerse(selectedSurahNumber, newAyah, language);
    }
  };

  // Free-text query submission (Ref like "2:225", "Baqarah 225", "Ayatul Kursi", or Topic like "patience")
  const handleFreeTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = freeTextQuery.trim();
    if (!query) return;

    setSearchError(null);
    setKeywordResults([]);

    // 1. Check if query matches any verse reference format
    const parsedRef = parseVerseReference(query, selectedSurahNumber);
    if (parsedRef) {
      if (parsedRef.error) {
        setSearchError(parsedRef.error);
        return;
      }
      loadVerse(parsedRef.surahNumber, parsedRef.ayahNumber, language);
      return;
    }

    // 2. Otherwise, perform search by keyword in active translation edition
    setIsSearchingKeywords(true);
    try {
      const results = await searchByKeyword(query, language);
      if (results.length === 0) {
        setSearchError(`No verses found containing "${query}". Try searching by reference (e.g. "2:225" or "Baqarah 225") or another word.`);
      } else {
        setKeywordResults(results.slice(0, 12)); // top 12 matches
      }
    } catch (err: any) {
      setSearchError("Unable to search translations right now. Please check your connection or search by verse reference (e.g. 2:225).");
    } finally {
      setIsSearchingKeywords(false);
    }
  };

  const handleCopy = () => {
    if (!currentAyah || !currentSurahInfo) return;
    const surahLabel =
      language === "ar"
        ? `سورة ${currentSurahInfo.name}`
        : language === "fa"
        ? `سوره ${currentSurahInfo.name}`
        : `Surah ${currentSurahInfo.englishName}`;
    const text = `${currentAyah.text}\n"${currentTranslation}"\n— [${surahLabel} ${currentSurahInfo.number}:${currentAyah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyText = (textToCopy: string, sectionId: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const isCurrentAyahPlaying =
    isPlaying && currentAyah && playingGlobalAyahNumber === currentAyah.number;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 pb-32">
      {/* Top Header Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-3 py-1 text-xs font-semibold text-[#8B6E14] mb-3">
          <Compass className="h-3.5 w-3.5" />
          {t("explore.badge", "Scholarly Tafsir & Dual Perspectives")}
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#221D17]">
          {t("explore.title", "Deep Verse Reflection & Tafsir")}
        </h1>
        <p className="mt-1 text-sm sm:text-base text-[#6B6355]">
          {t("explore.subtitle", "Compare authoritative classical commentaries across Islamic traditions alongside contemplative reflections.")}
        </p>
      </div>

      {/* Lookup Controls Card (Stripe-styled) */}
      <div className="stripe-card rounded-2xl bg-white p-6 mb-8 border border-[#E6E0D4]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Method 1: Dropdown + Ayah Stepper */}
          <div className="lg:col-span-6 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A7265]">
              {t("explore.method1", "Method 1: Direct Surah & Ayah Stepper")}
            </label>

            <div className="flex items-center gap-2">
              {/* Surah Selector */}
              <div className="relative flex-1">
                <select
                  id="surah-select-dropdown"
                  value={selectedSurahNumber}
                  onChange={(e) => handleSurahChange(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-[#DCD5C8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#2B2620] shadow-xs outline-none focus:border-[#0F6B58] focus:ring-2 focus:ring-[#0F6B58]/10"
                >
                  {ALL_SURAHS.map((s) => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {language === "ar" ? s.name : s.englishName} ({language === "ar" ? s.englishName : s.name}) — {s.numberOfAyahs}{language === "ar" ? " آية" : "v"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ayah Number with Stepper */}
              <div className="flex items-center rounded-xl border border-[#DCD5C8] bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleAyahStepper(-1)}
                  disabled={selectedAyahNumber <= 1}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-[#5C5549] hover:bg-[#F2ECE1] disabled:opacity-30"
                  title={t("explore.prevAyah", "Previous Verse")}
                >
                  {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>

                <div className="px-2 text-center min-w-[54px]">
                  <span className="text-sm font-bold text-[#0F6B58]">
                    {selectedAyahNumber}
                  </span>
                  <span className="text-[10px] text-[#8C8373] block -mt-0.5">
                    / {currentSurahMeta.numberOfAyahs}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAyahStepper(1)}
                  disabled={selectedAyahNumber >= currentSurahMeta.numberOfAyahs}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-[#5C5549] hover:bg-[#F2ECE1] disabled:opacity-30"
                  title={t("explore.nextAyah", "Next Verse")}
                >
                  {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Divider on desktop */}
          <div className="hidden lg:block lg:col-span-1 text-center self-center text-xs font-bold text-[#8C8373]">
            {language === "ar" ? "أو" : language === "fa" ? "یا" : language === "id" ? "ATAU" : "OR"}
          </div>

          {/* Method 2: Free-text search (Reference or Topic) */}
          <div className="lg:col-span-5 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A7265]">
              {t("explore.method2", "Method 2: Reference or Keyword Search")}
            </label>
            <form onSubmit={handleFreeTextSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="verse-free-search-input"
                  value={freeTextQuery}
                  onChange={(e) => setFreeTextQuery(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "مثال: 2:255 أو البقرة 255 أو آية الكرسي أو رحمة"
                      : language === "fa"
                      ? "مثال: 2:255 یا بقره 255 یا آیة الکرسی یا رحمت"
                      : language === "id"
                      ? 'cth: "2:255", "Al-Baqarah 255", "Ayat Kursi", atau "rahmat"'
                      : 'e.g. "2:225", "Baqarah 255", "Ayatul Kursi", or "mercy"'
                  }
                  className="w-full rounded-xl border border-[#DCD5C8] bg-white px-3.5 py-2.5 text-sm text-[#2B2620] placeholder-[#8C8373] shadow-xs outline-none focus:border-[#0F6B58] focus:ring-2 focus:ring-[#0F6B58]/10"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingKeywords || !freeTextQuery.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F6B58] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#094A3C] transition disabled:opacity-50"
              >
                {isSearchingKeywords ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>{t("explore.lookup", "Lookup")}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#8C8373] font-medium mr-1">
            {t("explore.quickSelect", "Quick Select:")}
          </span>
          {featuredVerses.map((f) => (
            <button
              key={f.label}
              onClick={() => {
                setSelectedSurahNumber(f.surah);
                setSelectedAyahNumber(f.ayah);
                loadVerse(f.surah, f.ayah);
              }}
              className="rounded-full border border-[#E5DFD5] bg-[#FAF7F2] px-2.5 py-1 text-xs font-medium text-[#4A4337] hover:border-[#0F6B58] hover:text-[#0F6B58] transition"
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Keyword Search Results (if triggered) */}
        {searchError && (
          <p className="mt-3 text-xs text-rose-600 font-medium">{searchError}</p>
        )}

        {keywordResults.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#F2ECE1]">
            <span className="text-xs font-bold text-[#5C5549] block mb-2">
              Found {keywordResults.length} matching verses:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {keywordResults.map((item) => (
                <div
                  key={`${item.surah.number}:${item.numberInSurah}`}
                  onClick={() => {
                    loadVerse(item.surah.number, item.numberInSurah);
                    setKeywordResults([]);
                    setFreeTextQuery("");
                  }}
                  className="rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-2.5 text-left cursor-pointer hover:border-[#0F6B58] hover:bg-white transition"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0F6B58]">
                    <span>{item.surah.englishName} ({item.surah.number}:{item.numberInSurah})</span>
                    <span className="text-[10px] text-[#8C8373]">{item.surah.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#4A4337] line-clamp-2 italic">
                    "{item.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loadingVerse ? (
        <div className="stripe-card rounded-3xl bg-white p-8 sm:p-12 text-center animate-pulse border border-[#E6E0D4] space-y-6">
          <div className="h-6 w-32 mx-auto bg-[#EFEAE1] rounded-lg" />
          <div className="h-24 w-3/4 mx-auto bg-[#EFEAE1] rounded-2xl" />
          <div className="h-16 w-full bg-[#EFEAE1] rounded-xl" />
        </div>
      ) : verseError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 text-sm">
          {verseError}
        </div>
      ) : currentAyah && currentSurahInfo ? (
        /* The Ordered Verse Result Presentation */
        <div className="space-y-6">
          {/* Main Verse Card */}
          <div className="stripe-card relative rounded-3xl bg-white p-6 sm:p-10 border border-[#E6E0D4] shadow-sm">
            {/* Top Tag & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#F4EFE6]">
              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-[#0F6B58]/10 px-3 py-1 text-xs font-bold text-[#0F6B58]">
                  {language === "ar"
                    ? `سورة ${currentSurahInfo.name} (${currentSurahInfo.number}:${currentAyah.numberInSurah})`
                    : language === "fa"
                    ? `سوره ${currentSurahInfo.name} (${currentSurahInfo.number}:${currentAyah.numberInSurah})`
                    : `Surah ${currentSurahInfo.englishName} (${currentSurahInfo.number}:${currentAyah.numberInSurah})`}
                </span>
                <span className="rounded-lg bg-[#FAF7F2] px-2 py-1 text-[11px] text-[#7A7265] border border-[#E8E2D8]">
                  {currentSurahInfo.revelationType === "Meccan" ? t("surahList.meccan") : t("surahList.medinan")} &bull; {t("explore.verse")} {currentAyah.numberInSurah} {language === "ar" ? "من" : language === "fa" ? "از" : "of"} {currentSurahInfo.numberOfAyahs}
                </span>
                {currentAyah.juz && (
                  <span className="rounded-lg bg-[#FAF7F2] px-2 py-1 text-[11px] text-[#7A7265] border border-[#E8E2D8]">
                    {t("reader.juz")} {currentAyah.juz}
                  </span>
                )}
              </div>

              {/* Card Actions: Play audio, Bookmark, Transliteration toggle, Copy */}
              <div className="flex items-center gap-2">
                {/* Transliteration Toggle */}
                <button
                  onClick={() => setShowTransliteration(!showTransliteration)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                    showTransliteration
                      ? "border-[#0F6B58] bg-[#0F6B58]/10 text-[#0F6B58]"
                      : "border-[#E5DFD5] bg-white text-[#6B6355] hover:border-[#0F6B58]"
                  }`}
                >
                  {t("explore.phonetics", "Phonetics")}
                </button>

                {/* Bookmark Toggle */}
                <button
                  onClick={() => onToggleBookmark(currentAyah, currentSurahInfo)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5DFD5] bg-white text-[#5C5549] hover:border-[#C9A227] transition active:scale-90"
                  title="Bookmark verse"
                >
                  <Bookmark
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isBookmarked(currentSurahInfo.number, currentAyah.numberInSurah)
                        ? "fill-[#C9A227] text-[#C9A227] scale-110"
                        : "text-[#8C8373]"
                    }`}
                  />
                </button>

                {/* Copy Verse */}
                <button
                  onClick={handleCopy}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5DFD5] bg-white text-[#5C5549] hover:border-[#0F6B58] transition"
                  title="Copy verse text"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-[#8C8373]" />
                  )}
                </button>

                {/* Play Verse Audio Button */}
                <button
                  onClick={() =>
                    onPlayAyah(currentAyah, currentSurahInfo.number, currentSurahInfo.englishName)
                  }
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition ${
                    isCurrentAyahPlaying
                      ? "bg-[#C9A227] hover:bg-[#B38F1E]"
                      : "bg-[#0F6B58] hover:bg-[#094A3C]"
                  }`}
                >
                  {isCurrentAyahPlaying ? (
                    <>
                      <Volume2 className="h-4 w-4 animate-bounce" />
                      <span>{t("explore.playing", "Playing...")}</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                      <span>{t("explore.listen", "Listen")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 1. Large Centered Arabic Text (RTL) in Amiri Quran font */}
            <div className="py-6 sm:py-8 text-center" dir="rtl">
              <p className="font-arabic text-3xl sm:text-5xl lg:text-6xl text-[#1E1B18] font-normal leading-[3.4rem] sm:leading-[4.6rem] select-text">
                {currentAyah.text}
                <span className="inline-flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 rounded-full border-2 border-[#C9A227] text-sm sm:text-base text-[#8B6E14] font-sans font-bold align-middle mx-3 bg-[#FAF7F0] shadow-xs">
                  {currentAyah.numberInSurah}
                </span>
              </p>
            </div>

            {/* 2. Transliteration (if toggled) */}
            {showTransliteration && (
              <div className="mb-6 rounded-2xl bg-[#F7F4EC] p-4 text-center border border-[#E9E3D5]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8373] block mb-1">
                  Pronunciation Guide / Transliteration Aid
                </span>
                <p className="text-sm sm:text-base text-[#4A4337] italic font-serif">
                  Ayah {currentSurahInfo.number}:{currentAyah.numberInSurah} &bull; {currentAyah.text.slice(0, 45)}...
                </p>
              </div>
            )}

            {/* 3. Localized Translation in Selected Language */}
            <div className="mt-4 pt-6 border-t border-[#F4EFE6] text-center max-w-3xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8373] block mb-2">
                {t("explore.translationTitle", "Translation & Meaning")}
              </span>
              <p className="text-lg sm:text-xl text-[#2B2620] leading-relaxed font-sans">
                "{currentTranslation}"
              </p>
            </div>
          </div>

          {/* 5. Authentic Classical Exegesis Section (Sunni & Shia Authentic Scholarly Books & Sheikhs) */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E0D4]">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#221D17] flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-[#0F6B58]" />
                  {t("explore.tafsirTitle", "Comparative Classical Tafsir")}
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7265] mt-0.5">
                  {t("explore.tafsirDesc", "Authentic exegesis from classical books, sheikhs, and scholars. No AI generation.")}
                </p>
              </div>

              {/* Verified Sources Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-2xs">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>
                  {t("explore.authenticSourcesBadge", "Authentic Classical Books & Scholars Only")}
                </span>
              </div>
            </div>

            {/* Classical View Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#F6F2E9] border border-[#E6DFD1]">
              <button
                onClick={() => setTafsirView("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  tafsirView === "all"
                    ? "bg-white text-[#221D17] shadow-xs border border-[#DFD8CA]"
                    : "text-[#6E6455] hover:text-[#221D17] hover:bg-white/60"
                }`}
              >
                <Library className="h-3.5 w-3.5" />
                <span>
                  {t("explore.dualComparative", "Dual Comparative View")}
                </span>
              </button>

              <button
                onClick={() => setTafsirView("sunni")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  tafsirView === "sunni"
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "text-[#6E6455] hover:text-emerald-900 hover:bg-white/60"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>
                  {t("explore.sunniTradition", "Sunni Tradition")}
                </span>
              </button>

              <button
                onClick={() => setTafsirView("shia")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  tafsirView === "shia"
                    ? "bg-amber-800 text-white shadow-xs"
                    : "text-[#6E6455] hover:text-amber-900 hover:bg-white/60"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span>
                  {t("explore.shiaTradition", "Shia Tradition")}
                </span>
              </button>

              {dualTafsir?.arabicTafsir && (
                <button
                  onClick={() => setTafsirView("arabic")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    tafsirView === "arabic"
                      ? "bg-[#0F6B58] text-white shadow-xs"
                      : "text-[#6E6455] hover:text-[#0F6B58] hover:bg-white/60"
                  }`}
                >
                  <ScrollText className="h-3.5 w-3.5" />
                  <span>
                    {t("explore.arabicClassicalTafsir", "Arabic Classical Tafsir")}
                  </span>
                </button>
              )}
            </div>

            {/* 1. Sunni Scholarly Explanation Card */}
            {(tafsirView === "all" || tafsirView === "sunni") && (
              <div className="stripe-card rounded-3xl bg-white p-6 sm:p-8 border border-[#E6E0D4] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#F4EFE6]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-950">
                      <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                      {t("explore.sunniExplanation", "Sunni Scholarly Exegesis")}
                    </span>
                    <span className="text-xs text-[#7A7265] font-medium hidden sm:inline">
                      {language === "ar" ? "(أهل السنة والجماعة)" : language === "fa" ? "(اهل سنت و جماعت)" : "(Sunni Tradition)"}
                    </span>
                    {dualTafsir?.sunni.deathYear && (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {dualTafsir.sunni.deathYear}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#FAF7F2] px-2.5 py-1 text-[11px] font-medium text-[#7A7265] border border-[#E8E2D8]">
                      {dualTafsir?.sunni.scholar || "Classical Sunni Commentators"}
                    </span>
                    <button
                      onClick={() => handleCopyText(`[${dualTafsir?.sunni.sourceWork} — ${dualTafsir?.sunni.scholar}]\n"${dualTafsir?.sunni.text}"`, "sunni-tafsir")}
                      className="inline-flex items-center gap-1 text-[11px] text-[#7A7265] hover:text-[#0F6B58] px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] transition"
                      title="Copy Sunni classical tafsir"
                    >
                      {copiedSection === "sunni-tafsir" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">{t("explore.copied", "Copied!")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{t("explore.copy", "Copy")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="text-xs font-bold text-[#8B6E14] uppercase tracking-wider">
                    {t("explore.classicalSourceWork", "Classical Source Work:")} {dualTafsir?.sunni.sourceWork}
                  </div>
                  {dualTafsir?.sunni.methodology && (
                    <span className="text-[11px] text-[#6B6152] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#EBDDBF]">
                      {dualTafsir.sunni.methodology}
                    </span>
                  )}
                </div>

                <div className="prose prose-stone max-w-none text-sm sm:text-base text-[#3D372E] leading-relaxed">
                  <p className="whitespace-pre-line font-serif">
                    {dualTafsir?.sunni.text || "Sunni scholarly commentary is loading or unavailable for this verse."}
                  </p>
                </div>

                {dualTafsir?.sunni.keyInsights && dualTafsir.sunni.keyInsights.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#F4EFE6] bg-[#FBF9F5] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-5 sm:p-6 rounded-b-3xl">
                    <h4 className="text-xs font-bold text-[#554C3D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                      {t("explore.keyInsightsSunni", "Key Sunni Insights & Exegetical Principles:")}
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#4E463A]">
                      {dualTafsir.sunni.keyInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-700 font-bold mt-0.5">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 2. Shia Scholarly Explanation Card */}
            {(tafsirView === "all" || tafsirView === "shia") && (
              <div className="stripe-card rounded-3xl bg-white p-6 sm:p-8 border border-[#E6E0D4] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#F4EFE6]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-950">
                      <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                      {t("explore.shiaExplanation", "Shia Scholarly Exegesis")}
                    </span>
                    <span className="text-xs text-[#7A7265] font-medium hidden sm:inline">
                      {language === "ar" ? "(مدرسة أهل البيت - الشيعة الإمامية)" : language === "fa" ? "(مکتب اهل بیت علیهم‌السلام)" : "(Shia Tradition)"}
                    </span>
                    {dualTafsir?.shia.deathYear && (
                      <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {dualTafsir.shia.deathYear}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#FAF7F2] px-2.5 py-1 text-[11px] font-medium text-[#7A7265] border border-[#E8E2D8]">
                      {dualTafsir?.shia.scholar || "Classical Shia Commentators"}
                    </span>
                    <button
                      onClick={() => handleCopyText(`[${dualTafsir?.shia.sourceWork} — ${dualTafsir?.shia.scholar}]\n"${dualTafsir?.shia.text}"`, "shia-tafsir")}
                      className="inline-flex items-center gap-1 text-[11px] text-[#7A7265] hover:text-[#0F6B58] px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8] transition"
                      title="Copy Shia classical tafsir"
                    >
                      {copiedSection === "shia-tafsir" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">{t("explore.copied", "Copied!")}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>{t("explore.copy", "Copy")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="text-xs font-bold text-[#8B6E14] uppercase tracking-wider">
                    {t("explore.classicalSourceWork", "Classical Source Work:")} {dualTafsir?.shia.sourceWork}
                  </div>
                  {dualTafsir?.shia.methodology && (
                    <span className="text-[11px] text-[#6B6152] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#EBDDBF]">
                      {dualTafsir.shia.methodology}
                    </span>
                  )}
                </div>

                <div className="prose prose-stone max-w-none text-sm sm:text-base text-[#3D372E] leading-relaxed">
                  <p className="whitespace-pre-line font-serif">
                    {dualTafsir?.shia.text || "Shia scholarly commentary is loading or unavailable for this verse."}
                  </p>
                </div>

                {dualTafsir?.shia.keyInsights && dualTafsir.shia.keyInsights.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#F4EFE6] bg-[#FBF9F5] -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-5 sm:p-6 rounded-b-3xl">
                    <h4 className="text-xs font-bold text-[#554C3D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                      {t("explore.keyInsightsShia", "Key Shia Insights & Exegetical Principles:")}
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[#4E463A]">
                      {dualTafsir.shia.keyInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-700 font-bold mt-0.5">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 3. Authentic Classical Arabic Exegesis Card */}
            {(tafsirView === "all" || tafsirView === "arabic") && dualTafsir?.arabicTafsir && (
              <div className="stripe-card rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F0] to-[#F5EEDC] p-6 sm:p-8 border border-[#E6DECE] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E8DFC9]">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F6B58]/10 border border-[#0F6B58]/30 px-3 py-1 text-xs font-bold text-[#0F6B58]">
                      <ScrollText className="h-3.5 w-3.5" />
                      {language === "ar" ? "التفسير الميسر المعتمد" : "Classical Arabic Exegesis (Al-Muyassar)"}
                    </span>
                    <span className="text-xs text-[#7A7265] font-medium hidden sm:inline">
                      {dualTafsir.arabicTafsir.scholar}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyText(`[${dualTafsir.arabicTafsir?.work}]\n${dualTafsir.arabicTafsir?.text}`, "arabic-tafsir")}
                    className="inline-flex items-center gap-1 text-[11px] text-[#7A7265] hover:text-[#0F6B58] px-2.5 py-1 rounded-lg bg-white border border-[#E0D7C4] transition shadow-2xs"
                    title="Copy Arabic classical tafsir"
                  >
                    {copiedSection === "arabic-tafsir" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">{t("explore.copied", "Copied!")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{t("explore.copy", "Copy")}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs font-bold text-[#8B6E14] mb-3 uppercase tracking-wider">
                  {dualTafsir.arabicTafsir.work}
                </div>

                <div className="py-2 text-right">
                  <p
                    dir="rtl"
                    className="font-arabic text-[#1F1A14] text-xl sm:text-2xl leading-loose select-text"
                  >
                    {dualTafsir.arabicTafsir.text}
                  </p>
                </div>
              </div>
            )}

            {/* Classical Scholarly Works Directory & Seal */}
            <div className="rounded-2xl bg-[#FCFAF6] border border-[#E8E2D6] p-5 sm:p-6 text-xs text-[#5F5647]">
              <div className="flex items-center gap-2 font-bold text-[#2C2419] mb-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-[#0F6B58]" />
                <span>
                  {language === "ar"
                    ? "أمهات كتب التفسير ومصادر الشيوخ والعلماء المعتمدة"
                    : language === "fa"
                    ? "کتب تراث تفسیری و علمای معتبر مذاهب اسلامی"
                    : language === "id"
                    ? "Perpustakaan Kitab Tafsir Klasik & Para Ulama"
                    : "Authentic Classical Exegesis Library & Authors"}
                </span>
              </div>
              <p className="leading-relaxed mb-3">
                {language === "ar"
                  ? "جميع التفاسير المعروضة مستمدة حصراً من أمهات المصنفات الإسلامية المعتمدة لكبار المفسرين المحققين: تفسير ابن كثير، وتفسير الطبري، وتفسير القرطبي، وتفسير السعدي، والتفسير الميسر (من أهل السنة)؛ وتفسير الميزان للعلامة الطباطبائي، ومجمع البيان للشيخ الطبرسي، والتبيان للشيخ الطوسي، ونور الثقلين (من الشيعة الإمامية). لا يوجد أي توليد بالذكاء الاصطناعي."
                  : language === "fa"
                  ? "تمامی تفاسیر ارائه‌شده منحصراً از کتب مرجع و مصنفات اصیل علمای محقق هر دو مکتب استخراج شده‌اند: تفسیر ابن کثیر، تفسیر طبری، تفسیر قرطبی و التفسیر المیسر (از اهل سنت)؛ و تفسیر المیزان علامه طباطبائی، مجمع البیان شیخ طبرسی و التبیان شیخ طوسی (از شیعه امامیه). هیچ‌گونه تفسیری توسط هوش مصنوعی تولید نمی‌شود."
                  : language === "id"
                  ? "Semua tafsir yang disajikan bersumber dari kitab-kitab klasik terpercaya: Tafsir Ibnu Katsir, Tafsir Ath-Thabari, Tafsir Al-Qurthubi, dan Tafsir Al-Muyassar (tradisi Sunni); serta Tafsir Al-Mizan (Allamah Thabathaba'i), Majma'ul Bayan (Syaikh Ath-Thabarsi), dan At-Tibyan (Syaikh Ath-Thusi) (tradisi Syiah). Tanpa interpretasi buatan AI."
                  : "All tafsir commentaries provided are drawn directly from canonical classical exegesis works: Tafsir Ibn Kathir, Jami' al-Bayan (al-Tabari), al-Jami' li-Ahkam al-Qur'an (al-Qurtubi), and al-Tafsir al-Muyassar (Sunni tradition); alongside Tafsir al-Mizan (Allamah Tabataba'i), Majma' al-Bayan (al-Tabarsi), al-Tibyan (al-Tusi), and Nur al-Thaqalayn (Shia tradition). Zero AI explanations are generated."}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#807664] pt-2 border-t border-[#EDE6DA]">
                <span>• <strong>Ibn Kathir</strong> (d. 774 AH)</span>
                <span>• <strong>Al-Tabari</strong> (d. 310 AH)</span>
                <span>• <strong>Al-Qurtubi</strong> (d. 671 AH)</span>
                <span>• <strong>Allamah Tabataba'i</strong> (d. 1402 AH)</span>
                <span>• <strong>Al-Tabarsi</strong> (d. 548 AH)</span>
                <span>• <strong>Al-Tusi</strong> (d. 460 AH)</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
