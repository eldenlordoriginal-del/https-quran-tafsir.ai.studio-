import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Search,
  Check,
  Copy,
  ShieldCheck,
  Info,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Library,
  BookMarked,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { HadithApi } from "../services/hadithApi";
import { HadithItem, HadithTradition, HadithBookMetadata, HadithSectionMetadata } from "../types";
import { useLanguage } from "../context/LanguageContext";

/**
 * Normalizes Hadith divine names:
 * Converts "Allahazwj", "Allah azwj", etc. to "Allah (azwj)" as requested.
 * Cleans superscript abbreviations and ensures consistent parentheses.
 */
export function formatHadithDivineNames(text: string): string {
  if (!text) return "";
  let clean = text;

  // Convert any <sup> tags if still present
  clean = clean.replace(/<sup[^>]*>\s*azwj\s*<\/sup>/gi, " (azwj)");
  clean = clean.replace(/<sup[^>]*>\s*asws\s*<\/sup>/gi, " (asws)");
  clean = clean.replace(/<sup[^>]*>\s*saww\s*<\/sup>/gi, " (saww)");
  clean = clean.replace(/<sup[^>]*>\s*as\s*<\/sup>/gi, " (as)");
  clean = clean.replace(/<sup[^>]*>\s*swt\s*<\/sup>/gi, " (swt)");
  clean = clean.replace(/<sup[^>]*>\s*ra\s*<\/sup>/gi, " (ra)");
  clean = clean.replace(/<sup[^>]*>(.*?)<\/sup>/gi, " ($1)");
  clean = clean.replace(/<[^>]*>/g, "");

  // Format Allahazwj -> Allah (azwj)
  clean = clean.replace(/\bAllahazwj\b/gi, "Allah (azwj)");
  clean = clean.replace(/\bAllah\s*azwj\b/gi, "Allah (azwj)");
  clean = clean.replace(/Allahazwj([’']s)?/gi, (_, s) => `Allah (azwj)${s || ""}`);
  clean = clean.replace(/\bAllah\s*\(azwj\)/gi, "Allah (azwj)");
  clean = clean.replace(/Allah\s*\[azwj\]/gi, "Allah (azwj)");
  clean = clean.replace(/Allah\s*\{azwj\}/gi, "Allah (azwj)");
  clean = clean.replace(/\b(Allah)\s*\(?\s*azwj\s*\)?/gi, "Allah (azwj)");

  // Clean Shia abbreviations merged without spaces
  clean = clean.replace(/\b(Imam\s+[A-Za-z]+)asws\b/gi, "$1 (asws)");
  clean = clean.replace(/\b(Imam\s+[A-Za-z]+)as\b/gi, "$1 (as)");
  clean = clean.replace(/\bAliasws\b/gi, "Ali (asws)");
  clean = clean.replace(/\bAli\s*asws\b/gi, "Ali (asws)");
  clean = clean.replace(/\bRasool-Allahsaww\b/gi, "Rasool-Allah (saww)");
  clean = clean.replace(/\bRasool\s+Allahsaww\b/gi, "Rasool Allah (saww)");

  // Standardize double parentheses or multiple spaces
  clean = clean.replace(/\(\s*\(([^)]+)\)\s*\)/g, "($1)");
  clean = clean.replace(/[ \t]{2,}/g, " ");
  return clean.trim();
}

interface HadithExplorerProps {
  selectedTradition: HadithTradition;
  onTraditionChange: (tradition: HadithTradition) => void;
}

export const HadithExplorer: React.FC<HadithExplorerProps> = ({
  selectedTradition,
  onTraditionChange,
}) => {
  const { language, t, isRTL } = useLanguage();

  // Books & Sections State
  const [books, setBooks] = useState<HadithBookMetadata[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>("bukhari");
  const [sections, setSections] = useState<HadithSectionMetadata[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("1");

  // Query & Pagination State
  const [hadithNumberInput, setHadithNumberInput] = useState<string>("");
  const [activeHadithNumber, setActiveHadithNumber] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Data & UI State
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [arabicFontSize, setArabicFontSize] = useState<"md" | "lg" | "xl">("lg");

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load books whenever tradition changes
  useEffect(() => {
    let isMounted = true;
    async function loadBooks() {
      setIsLoading(true);
      try {
        const list = await HadithApi.getBooks(selectedTradition);
        if (!isMounted) return;
        setBooks(list);
        if (list.length > 0) {
          const defaultBook = selectedTradition === "shia" ? "kafi" : "bukhari";
          const match = list.find((b) => b.id === defaultBook) || list[0];
          setSelectedBookId(match.id);
        }
      } catch (err) {
        console.error("Error loading books:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadBooks();
    return () => {
      isMounted = false;
    };
  }, [selectedTradition]);

  // Load sections whenever selected book changes
  useEffect(() => {
    let isMounted = true;
    async function loadSections() {
      if (!selectedBookId) return;
      try {
        const secs = await HadithApi.getSections(selectedBookId);
        if (!isMounted) return;
        setSections(secs);
        if (secs.length > 0) {
          setSelectedSectionId(secs[0].id);
        }
        setCurrentPage(1);
        setActiveHadithNumber(undefined);
        setHadithNumberInput("");
      } catch (err) {
        console.error("Error loading sections:", err);
      }
    }
    loadSections();
    return () => {
      isMounted = false;
    };
  }, [selectedBookId]);

  // Fetch Hadiths
  const fetchHadiths = useCallback(async () => {
    if (!selectedBookId) return;
    setIsLoading(true);
    try {
      const res = await HadithApi.getHadiths({
        bookId: selectedBookId,
        sectionId: selectedSectionId,
        hadithNumber: activeHadithNumber,
        search: debouncedSearch,
        page: currentPage,
        limit: 12,
      });

      setHadiths(res.hadiths);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error fetching hadiths:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBookId, selectedSectionId, activeHadithNumber, debouncedSearch, currentPage]);

  useEffect(() => {
    fetchHadiths();
  }, [fetchHadiths]);

  // Handle direct hadith number search
  const handleJumpToHadith = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(hadithNumberInput.trim(), 10);
    if (!isNaN(num) && num > 0) {
      setActiveHadithNumber(num);
      setCurrentPage(1);
    } else {
      setActiveHadithNumber(undefined);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setHadithNumberInput("");
    setActiveHadithNumber(undefined);
    setCurrentPage(1);
  };

  const handleCopyHadith = (hadith: HadithItem) => {
    const cleanTranslation = formatHadithDivineNames(hadith.englishTranslation);
    const cleanNarrator = formatHadithDivineNames(hadith.narrator);
    const textToCopy = `"${cleanTranslation}"\n\n${hadith.arabicText}\n\n— ${cleanNarrator}\nSource: ${hadith.source} (${hadith.book})\nCitation: ${hadith.referenceCitation}\nGrading: ${hadith.grading} (${hadith.scholarlyGradingDetail})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const activeBook = books.find((b) => b.id === selectedBookId) || books[0];
  const activeSection = sections.find((s) => s.id === selectedSectionId);

  const getFontSizeClass = () => {
    switch (arabicFontSize) {
      case "md":
        return "text-xl sm:text-2xl leading-relaxed";
      case "xl":
        return "text-3xl sm:text-4xl leading-loose";
      case "lg":
      default:
        return "text-2xl sm:text-3xl leading-loose";
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0F6B58]/20 bg-[#0F6B58]/10 px-3.5 py-1 text-xs font-semibold text-[#0F6B58] mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{t("hadith.badge")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1B18] tracking-tight">
          {t("hadith.title")}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#6B6355] max-w-2xl mx-auto">
          {t("hadith.subtitle")}
        </p>
      </div>

      {/* 2. Prominent Tradition Buttons: "Sunni" and "Shia" */}
      <div className="mb-8 flex flex-col items-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#7A7265] mb-2.5 flex items-center gap-1.5">
          <span>{t("hadith.selectTraditionLabel", "Select Tradition:")}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl">
          {/* Sunni Button */}
          <button
            id="hadith-tradition-sunni-btn"
            onClick={() => {
              onTraditionChange("sunni");
              handleResetSearch();
            }}
            className={`group relative flex flex-col items-start p-4 sm:p-5 rounded-2xl border transition-all text-left ${
              selectedTradition === "sunni"
                ? "bg-gradient-to-br from-[#0F6B58] to-[#0A4D3F] border-[#0F6B58] text-white shadow-md shadow-[#0F6B58]/20 scale-[1.01]"
                : "bg-white border-[#E4DED3] text-[#3D372E] hover:border-[#0F6B58]/50 hover:bg-[#FAF8F3]"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    selectedTradition === "sunni" ? "bg-emerald-300" : "bg-[#0F6B58]"
                  }`}
                />
                <span className="text-base sm:text-lg font-bold">
                  {t("hadith.sunniTradition", "Sunni")}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  selectedTradition === "sunni"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                {t("hadith.bukhariMuslimTag", "Sahih al-Bukhari & Sahih Muslim")}
              </span>
            </div>
            <p
              className={`text-xs ${
                selectedTradition === "sunni" ? "text-emerald-100" : "text-[#7A7265]"
              }`}
            >
              {t("hadith.sunniDesc")}
            </p>
          </button>

          {/* Shia Button */}
          <button
            id="hadith-tradition-shia-btn"
            onClick={() => {
              onTraditionChange("shia");
              handleResetSearch();
            }}
            className={`group relative flex flex-col items-start p-4 sm:p-5 rounded-2xl border transition-all text-left ${
              selectedTradition === "shia"
                ? "bg-gradient-to-br from-[#A06E1B] to-[#7D5310] border-[#8B6E14] text-white shadow-md shadow-[#8B6E14]/20 scale-[1.01]"
                : "bg-white border-[#E4DED3] text-[#3D372E] hover:border-[#8B6E14]/50 hover:bg-[#FAF8F3]"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    selectedTradition === "shia" ? "bg-amber-300" : "bg-[#A06E1B]"
                  }`}
                />
                <span className="text-base sm:text-lg font-bold">
                  {t("hadith.shiaTradition", "Shia")}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  selectedTradition === "shia"
                    ? "bg-white/20 text-white"
                    : "bg-amber-50 text-amber-900 border border-amber-200"
                }`}
              >
                {t("hadith.kafiNahjTag", "Kitab al-Kafi & Nahj al-Balagha")}
              </span>
            </div>
            <p
              className={`text-xs ${
                selectedTradition === "shia" ? "text-amber-100" : "text-[#7A7265]"
              }`}
            >
              {t("hadith.shiaDesc")}
            </p>
          </button>
        </div>
      </div>

      {/* 3. Book Selector & Catalog Bar */}
      <div className="stripe-card rounded-2xl bg-white p-4 sm:p-5 border border-[#E6E0D4] shadow-xs mb-6">
        <div className="flex flex-col gap-4">
          {/* Book Dropdown & Quick Badges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="hadith-book-select" className="text-xs font-bold uppercase tracking-wider text-[#7A7265] flex items-center gap-1.5">
                <Library className="h-3.5 w-3.5 text-[#0F6B58]" />
                <span>{t("hadith.selectBook", "Select Authentic Book:")}</span>
              </label>
              {activeBook && (
                <span className="text-xs text-[#7A7265] font-medium font-mono">
                  {activeBook.totalHadiths.toLocaleString()} {t("hadith.hadiths", "Hadiths")}
                </span>
              )}
            </div>

            {/* Quick Book Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {books.map((b) => (
                <button
                  key={b.id}
                  id={`hadith-book-pill-${b.id}`}
                  onClick={() => {
                    setSelectedBookId(b.id);
                    handleResetSearch();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border flex items-center gap-1.5 ${
                    selectedBookId === b.id
                      ? selectedTradition === "sunni"
                        ? "bg-[#0F6B58] text-white border-[#0F6B58] shadow-xs font-semibold"
                        : "bg-[#8B6E14] text-white border-[#8B6E14] shadow-xs font-semibold"
                      : "bg-[#FAF8F5] text-[#4A4337] border-[#E0D9CD] hover:bg-white hover:border-[#0F6B58]/40"
                  }`}
                >
                  <BookOpen className="h-3 w-3 shrink-0" />
                  <span>{language === "ar" || language === "fa" ? b.arabicTitle || b.title : b.title}</span>
                </button>
              ))}
            </div>

            {/* Book Info Summary */}
            {activeBook && (
              <div className="rounded-xl bg-[#FBF9F5] p-3.5 border border-[#ECE5D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1E1B18]">
                      {language === "ar" || language === "fa" ? activeBook.arabicTitle : activeBook.title}
                    </span>
                    <span className="font-arabic text-[#8B6E14] font-medium text-sm">
                      {language === "ar" || language === "fa" ? activeBook.title : activeBook.arabicTitle}
                    </span>
                  </div>
                  <p className="text-[#6B6355] leading-relaxed">{activeBook.description}</p>
                </div>
                <div className="shrink-0 text-[#7A7265] text-right sm:border-l sm:border-[#ECE5D8] sm:pl-4">
                  <div className="font-bold text-[#2A241C]">{activeBook.author}</div>
                  <div className="text-[11px]">
                    {language === "ar"
                      ? "مرجع ومصدر أصيل"
                      : language === "fa"
                      ? "منبع و مرجع اصیل"
                      : "Classical Authentic Authority"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chapter / Section & Jump by Number Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-[#F0EBE1]">
            {/* Section Dropdown (7 cols) */}
            <div className="md:col-span-7">
              <label htmlFor="hadith-section-select" className="text-xs font-semibold text-[#7A7265] mb-1 block">
                {t("hadith.chapter", "Chapter / Section:")}
              </label>
              <select
                id="hadith-section-select"
                value={selectedSectionId}
                onChange={(e) => {
                  setSelectedSectionId(e.target.value);
                  setCurrentPage(1);
                  setActiveHadithNumber(undefined);
                  setHadithNumberInput("");
                }}
                className="w-full rounded-xl border border-[#D9D2C5] bg-[#FAF8F5] px-3 py-2 text-xs sm:text-sm text-[#2B2620] focus:border-[#0F6B58] focus:bg-white focus:outline-none transition"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} {s.hadithCount ? `(${s.hadithCount} ${t("hadith.hadiths")})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Jump to Hadith # Input (5 cols) */}
            <div className="md:col-span-5">
              <label htmlFor="hadith-jump-input" className="text-xs font-semibold text-[#7A7265] mb-1 block">
                {t("hadith.goToHadith", "Go to Hadith #:")}
              </label>
              <form onSubmit={handleJumpToHadith} className="flex gap-1.5">
                <input
                  id="hadith-jump-input"
                  type="number"
                  min="1"
                  max={activeBook?.totalHadiths || 10000}
                  value={hadithNumberInput}
                  onChange={(e) => setHadithNumberInput(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? `مثال: ١ إلى ${activeBook?.totalHadiths || 7563}`
                      : language === "fa"
                      ? `مانند: ۱ تا ${activeBook?.totalHadiths || 7563}`
                      : `e.g. 1 to ${activeBook?.totalHadiths || 7563}`
                  }
                  className="w-full rounded-xl border border-[#D9D2C5] bg-[#FAF8F5] px-3 py-2 text-xs sm:text-sm text-[#2B2620] focus:border-[#0F6B58] focus:bg-white focus:outline-none transition"
                />
                <button
                  id="hadith-jump-btn"
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-[#0F6B58] text-white text-xs font-semibold hover:bg-[#0A4D3F] transition shrink-0"
                >
                  {t("hadith.jump", "Jump")}
                </button>
              </form>
            </div>
          </div>

          {/* Search Input and Font Sizing */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-[#F0EBE1]">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C8375]" />
              <input
                id="hadith-keyword-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("hadith.searchPlaceholder")}
                className="w-full rounded-xl border border-[#D9D2C5] bg-[#FAF8F5] pl-10 pr-10 py-2 text-xs sm:text-sm text-[#2B2620] placeholder-[#8C8375] focus:border-[#0F6B58] focus:bg-white focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C8375] hover:text-[#2B2620] bg-stone-200/60 hover:bg-stone-200 rounded-full h-5 w-5 flex items-center justify-center"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Arabic Font Size Control */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
              <span className="text-xs text-[#7A7265] font-medium mr-1 hidden sm:inline">
                {t("hadith.arabicFont", "Arabic Font:")}
              </span>
              {(["md", "lg", "xl"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setArabicFontSize(size)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
                    arabicFontSize === size
                      ? "bg-[#0F6B58] text-white border-[#0F6B58]"
                      : "bg-[#FAF8F5] text-[#5A5245] border-[#E0D9CD] hover:bg-white"
                  }`}
                >
                  {size === "md" ? "A" : size === "lg" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Results Banner & Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
              selectedTradition === "sunni"
                ? "bg-emerald-100 text-emerald-950 border border-emerald-300"
                : "bg-amber-100 text-amber-950 border border-amber-300"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              {activeBook?.title}: {activeSection?.title || "All Chapters"}
            </span>
          </span>

          {activeHadithNumber && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-200 text-stone-800">
              <span>Hadith #{activeHadithNumber}</span>
              <button
                onClick={() => {
                  setActiveHadithNumber(undefined);
                  setHadithNumberInput("");
                }}
                className="ml-1 hover:text-stone-900"
              >
                ×
              </button>
            </span>
          )}

          <span className="text-xs text-[#7A7265]">
            {t("hadith.showing", "Showing")} {hadiths.length} {t("hadith.of", "of")} {totalCount.toLocaleString()} {t("hadith.hadiths", "Hadiths")}
          </span>
        </div>

        {/* Reset Filters Button */}
        {(debouncedSearch || activeHadithNumber) && (
          <button
            onClick={handleResetSearch}
            className="inline-flex items-center gap-1 text-xs text-[#0F6B58] hover:text-[#0A4D3F] font-semibold"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t("hadith.resetFilters", "Reset filters")}</span>
          </button>
        )}
      </div>

      {/* 5. Hadith Cards List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#E6E0D4] p-8 text-center">
          <Loader2 className="h-8 w-8 text-[#0F6B58] animate-spin mb-3" />
          <p className="text-sm font-semibold text-[#2B2620]">
            Fetching authentic traditions from {activeBook?.title || "canonical sources"}...
          </p>
          <p className="text-xs text-[#7A7265] mt-1">
            Loading Arabic text, English translation, isnad chain, and scholarly gradings.
          </p>
        </div>
      ) : hadiths.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E6E0D4] p-8">
          <BookOpen className="h-10 w-10 text-[#A0988A] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#2B2620]">{t("hadith.noResults", "No Hadiths Found")}</h3>
          <p className="text-xs sm:text-sm text-[#7A7265] mt-1 max-w-md mx-auto">
            No authentic hadiths matched your criteria in {activeBook?.title || "the selected book"}.
          </p>
          <button
            onClick={handleResetSearch}
            className="mt-4 px-4 py-1.5 rounded-xl bg-[#0F6B58] text-white text-xs font-medium hover:bg-[#0A4D3F] transition"
          >
            {t("hadith.resetFilters", "Reset Filters")}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {hadiths.map((hadith) => {
            const isSunni = hadith.tradition === "sunni";
            return (
              <div
                key={hadith.id}
                id={`hadith-card-${hadith.id}`}
                className="stripe-card rounded-3xl bg-white border border-[#E6E0D4] shadow-xs overflow-hidden transition-all duration-200 hover:border-[#0F6B58]/30"
              >
                {/* Card Header: Source, Chapter, Topic & Grading */}
                <div className="p-5 sm:p-6 pb-4 border-b border-[#F4EFE6] bg-[#FCFAF6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Primary Source Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        isSunni
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isSunni ? "bg-emerald-600" : "bg-amber-600"
                        }`}
                      />
                      {hadith.source}
                    </span>

                    {/* Book / Chapter */}
                    <span className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-[#4A4337] border border-[#E8E2D8]">
                      {hadith.book}
                    </span>

                    {/* Number */}
                    <span className="rounded-md bg-[#FAF7F2] px-2 py-0.5 text-[11px] font-semibold text-[#8B6E14] border border-[#EBDDBF]">
                      {hadith.hadithNumber}
                    </span>
                  </div>

                  {/* Grading Badge & Copy Button */}
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900 border border-emerald-300"
                      title={hadith.scholarlyGradingDetail}
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{hadith.grading}</span>
                    </span>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyHadith(hadith)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#5C5549] hover:text-[#0F6B58] px-3 py-1 rounded-lg bg-white border border-[#E2DDD3] transition shadow-2xs hover:bg-[#FAF8F5]"
                      title="Copy hadith and citation"
                    >
                      {copiedId === hadith.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">
                            {t("hadith.copied", "Copied!")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-[#7A7265]" />
                          <span>{t("hadith.copy", "Copy")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Chapter Section Title & Narrator */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[#7A7265] pb-2 border-b border-[#F5EFE6]">
                    <span className="font-medium text-[#5A5245]">
                      <strong>{t("hadith.chapter", "Chapter:")}</strong> {formatHadithDivineNames(hadith.chapter)}
                    </span>
                    <span className="italic font-serif text-[#8B6E14]">
                      {formatHadithDivineNames(hadith.narrator)}
                    </span>
                  </div>

                  {/* Arabic Text */}
                  {hadith.arabicText && (
                    <div className="py-2 text-right">
                      <p
                        dir="rtl"
                        className={`font-arabic text-[#1A1612] ${getFontSizeClass()} select-text`}
                      >
                        {hadith.arabicText}
                      </p>
                    </div>
                  )}

                  {/* Translation */}
                  <div className="border-t border-[#F5EFE6] pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8375] mb-2">
                      {t("hadith.translation", "Translation")}
                    </h4>
                    <p className="text-sm sm:text-base text-[#2E281F] leading-relaxed font-sans font-medium whitespace-pre-line">
                      "{formatHadithDivineNames(hadith.englishTranslation)}"
                    </p>
                  </div>

                  {/* Scholarly Explanation / Context */}
                  {hadith.explanation && (
                    <div className="rounded-2xl bg-[#FBF9F5] p-4 sm:p-5 border border-[#EFE9DF] text-xs sm:text-sm text-[#4E463A]">
                      <div className="flex items-center gap-1.5 font-bold text-[#3B342A] mb-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#C9A227]" />
                        <span>{t("hadith.scholarlyContext", "Scholarly Context & Wisdom:")}</span>
                      </div>
                      <p className="leading-relaxed text-[#5A5245]">
                        {formatHadithDivineNames(hadith.explanation)}
                      </p>
                    </div>
                  )}

                  {/* Exact Citation Reference Box */}
                  <div className="rounded-xl bg-[#F8F5EE] px-4 py-3 border border-[#E8E2D6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#0F6B58] shrink-0" />
                      <div className="text-[#3D372E]">
                        <span className="font-bold text-[#1E1B18]">
                          {t("hadith.exactCitation", "Exact Citation: ")}
                        </span>
                        <span className="font-mono text-[#5A5245] text-[11px] sm:text-xs">
                          {hadith.referenceCitation}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#7A7265] sm:text-right">
                      <strong>{t("hadith.gradingAuthority", "Grading Authority: ")}</strong>
                      <span>{hadith.scholarlyGradingDetail}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || isLoading}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[#D9D2C5] text-xs font-semibold text-[#4A4337] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span>{t("hadith.previous", "Previous")}</span>
          </button>

          <span className="text-xs font-medium text-[#6B6355]">
            {t("hadith.page", "Page")} <strong>{currentPage}</strong> {t("hadith.of", "of")} <strong>{totalPages}</strong>
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || isLoading}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[#D9D2C5] text-xs font-semibold text-[#4A4337] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <span>{t("hadith.next", "Next")}</span>
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* 7. Scholarly Authenticity Footer Note */}
      <div className="mt-12 rounded-2xl bg-white border border-[#E6E0D4] p-5 sm:p-6 text-xs text-[#6B6355] shadow-2xs">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-[#0F6B58] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#2A241C] text-sm">
              Authentic Hadith Methodology Across Both Traditions
            </h4>
            <p className="leading-relaxed">
              <strong>Sunni Tradition:</strong> Features complete canonical collections starting with the Two Sahihs (<em>Sahih al-Bukhari</em> and <em>Sahih Muslim</em>), <em>Forty Hadith of an-Nawawi</em>, <em>Forty Hadith Qudsi</em>, followed by the authentic/reliable sections of the Sunan collections (Tirmidhi, Abu Dawud, an-Nasa'i, Ibn Majah, and Muwatta Malik).
            </p>
            <p className="leading-relaxed">
              <strong>Shia Tradition:</strong> Features the canonical Four Books (<em>Al-Kutub Al-Arba'a</em>) led by <em>Kitab al-Kafi</em> by Shaykh al-Kulayni, the sublime discourses of <em>Nahj al-Balagha</em>, <em>Al-Khisal</em> and <em>Thawab al-A'mal</em> by Shaykh as-Saduq, and modern authenticated compendia (<em>Mu'jam al-Ahadith al-Mu'tabara</em> by Ayatollah Asif al-Muhsini), highlighting narrations graded <em>Sahih</em> or <em>Muwaththaq</em> in classical authorities like <em>Mir'at al-Uqul</em>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
