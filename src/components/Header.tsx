import React, { useState, useRef, useEffect } from "react";
import { BookOpen, Bookmark, Headphones, Sparkles, ScrollText, Settings, ChevronDown, Check, Sun, Moon } from "lucide-react";
import { HadithTradition, ReciterConfig } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  activeTab: "quran" | "explore" | "hadith";
  onTabChange: (tab: "quran" | "explore" | "hadith") => void;
  hadithTradition: HadithTradition;
  onHadithTraditionChange: (tradition: HadithTradition) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  currentReciter: ReciterConfig;
  onOpenReciterModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  hadithTradition,
  onHadithTraditionChange,
  savedCount,
  onOpenSavedDrawer,
  currentReciter,
  onOpenReciterModal,
}) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { isDark, setIsDark, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSettingsOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E2D8] dark:border-[#222F29] bg-[#FBF8F2]/95 dark:bg-[#0E1311]/95 backdrop-blur-md transition-all shadow-2xs">
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-3 sm:px-6 lg:px-8 py-2 sm:h-20">
        {/* Brand Logo, Settings Symbol to the left of Qur'an, & Name */}
        <div 
          className="flex items-center gap-2.5 select-none self-start sm:self-auto"
          id="app-brand"
        >
          {/* Logo icon */}
          <div 
            onClick={() => onTabChange("quran")}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-[#0F6B58] to-[#094A3C] p-1.5 shadow-[0_2px_8px_rgba(15,107,88,0.25)] transition-transform duration-200 hover:scale-105 border border-[#0F6B58]/30 shrink-0"
            title={language === "ar" ? "الصفحة الرئيسية - القرآن الكريم" : "Home - The Holy Qur'an"}
          >
            <img
              src="/favicon.svg"
              alt="Qur'an, Tafsir, &amp; Hadith"
              className="h-full w-full object-contain filter drop-shadow-xs"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {/* Settings Symbol immediately to the left of "Qur'an" */}
              <div className="relative" ref={settingsRef}>
                <button
                  id="site-settings-language-btn"
                  type="button"
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                  className={`group/settings flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold shadow-2xs transition-all ${
                    isSettingsOpen
                      ? "border-[#0F6B58] bg-[#0F6B58]/10 text-[#0F6B58] dark:bg-[#0F6B58]/20"
                      : "border-[#E0D9CD] dark:border-[#27352F] bg-white dark:bg-[#151D1A] text-[#4A4337] dark:text-[#D3CDC1] hover:border-[#0F6B58]/50 hover:bg-[#FAF8F3] dark:hover:bg-[#1C2621]"
                  }`}
                  title={t("app.selectLanguage")}
                  aria-label="Language Settings"
                  aria-expanded={isSettingsOpen}
                >
                  <Settings className={`h-3.5 w-3.5 text-[#0F6B58] dark:text-[#1E826C] transition-transform duration-300 ${isSettingsOpen ? "rotate-90" : "group-hover/settings:rotate-45"}`} />
                  <span className="text-[11px] font-bold">
                    {language === "ar"
                      ? "العربية"
                      : language === "fa"
                      ? "فارسی"
                      : language === "id"
                      ? "Indonesia"
                      : "English"}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-[#7A7265] dark:text-[#9C9486] transition-transform duration-200 ${isSettingsOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown displaying the 4 language options */}
                {isSettingsOpen && (
                  <div 
                    id="language-settings-dropdown"
                    className={`absolute top-full mt-1.5 w-56 rounded-xl border border-[#E2DDD3] dark:border-[#27352F] bg-white dark:bg-[#151D1A] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 ${
                      isRTL ? "right-0 text-right" : "left-0 text-left"
                    }`}
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8C8375] dark:text-[#9C9486] border-b border-[#F0EBE1] dark:border-[#24332C] mb-1 flex items-center justify-between">
                      <span>{t("app.selectLanguage")}</span>
                      <span className="font-mono text-[9px] text-[#A0988A] dark:text-[#7A7265] uppercase font-bold">{language}</span>
                    </div>

                    {/* Options list */}
                    {(
                      [
                        { id: "en", label: "English", native: "English", flag: "🇬🇧" },
                        { id: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦", isRtlFont: true },
                        { id: "fa", label: "Persian", native: "فارسی", flag: "🇮🇷", isRtlFont: true },
                        { id: "id", label: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" },
                      ] as const
                    ).map((langItem) => {
                      const isSelected = language === langItem.id;
                      return (
                        <button
                          key={langItem.id}
                          id={`select-lang-${langItem.id}`}
                          type="button"
                          onClick={() => {
                            setLanguage(langItem.id);
                            setIsSettingsOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-2.5 py-2 text-xs rounded-lg transition-all ${
                            isSelected
                              ? "bg-[#0F6B58]/10 text-[#0F6B58] font-bold shadow-2xs"
                              : "text-[#3D372E] hover:bg-[#FAF8F4]"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{langItem.flag}</span>
                            <span className={langItem.id === "ar" || langItem.id === "fa" ? "font-arabic text-sm" : "font-medium text-xs"}>
                              {langItem.native}
                            </span>
                            {langItem.id !== "en" && (
                              <span className="text-[10px] text-[#8C8375] font-normal">
                                ({langItem.label})
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-[#0F6B58] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Title: Qur'an, Tafsir, & Hadith */}
              <span 
                onClick={() => onTabChange("quran")}
                className="font-semibold tracking-tight text-[#1E1B18] text-base sm:text-lg font-sans cursor-pointer hover:text-[#0F6B58] transition-colors"
              >
                {t("app.title")}
              </span>
              <span className="rounded-full bg-[#C9A227]/15 px-2 py-0.5 text-[10px] font-semibold text-[#8B6E14] tracking-wide">
                {t("app.tag")}
              </span>
            </div>
            <span className="text-xs text-[#7A7265] font-normal hidden lg:inline max-w-sm truncate">
              {t("app.subtitle")}
            </span>
          </div>
        </div>

        {/* Stripe-style Tab Switcher with animated pill & Hadith Sunni/Shia sub-buttons */}
        <nav className="flex flex-col items-center" aria-label="Main Navigation">
          <div className="relative flex items-center rounded-full border border-[#E2DDD3] dark:border-[#27352F] bg-[#EFEAE1]/70 dark:bg-[#18231E]/80 p-1 shadow-inner">
            {/* Tab 1: Qur'an */}
            <button
              id="tab-quran-btn"
              onClick={() => onTabChange("quran")}
              className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                activeTab === "quran" ? "text-white" : "text-[#5C5549] dark:text-[#A7A092] hover:text-[#2B2620] dark:hover:text-[#EDE8DF]"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t("nav.quran")}</span>
              {activeTab === "quran" && (
                <div 
                  className="absolute inset-0 -z-10 rounded-full bg-[#0F6B58] shadow-[0_2px_8px_rgba(15,107,88,0.35)] transition-all duration-300 ease-out"
                />
              )}
            </button>

            {/* Tab 2: Explore a Verse */}
            <button
              id="tab-explore-btn"
              onClick={() => onTabChange("explore")}
              className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                activeTab === "explore" ? "text-white" : "text-[#5C5549] dark:text-[#A7A092] hover:text-[#2B2620] dark:hover:text-[#EDE8DF]"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{t("nav.explore")}</span>
              {activeTab === "explore" && (
                <div 
                  className="absolute inset-0 -z-10 rounded-full bg-[#0F6B58] shadow-[0_2px_8px_rgba(15,107,88,0.35)] transition-all duration-300 ease-out"
                />
              )}
            </button>

            {/* Tab 3: Hadith (to the right of Explore a Verse) */}
            <button
              id="tab-hadith-btn"
              onClick={() => onTabChange("hadith")}
              className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                activeTab === "hadith" ? "text-white" : "text-[#5C5549] dark:text-[#A7A092] hover:text-[#2B2620] dark:hover:text-[#EDE8DF]"
              }`}
            >
              <ScrollText className="h-3.5 w-3.5" />
              <span>{t("nav.hadith")}</span>
              {activeTab === "hadith" && (
                <div 
                  className="absolute inset-0 -z-10 rounded-full bg-[#0F6B58] shadow-[0_2px_8px_rgba(15,107,88,0.35)] transition-all duration-300 ease-out"
                />
              )}
            </button>
          </div>

          {/* Under the Hadith button: 2 separate buttons saying "Sunni" or "Shia" */}
          <div className="flex items-center justify-center sm:justify-end w-full mt-1">
            <div className="flex items-center gap-1 bg-[#EBE5DA] dark:bg-[#1C2822] border border-[#DDD5C7] dark:border-[#27352F] rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-medium shadow-2xs">
              <span className="text-[10px] text-[#7A7265] dark:text-[#9C9486] uppercase tracking-wider font-semibold mr-0.5 hidden xs:inline">
                {t("nav.hadithLabel")}
              </span>
              <button
                id="header-hadith-sunni-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange("hadith");
                  onHadithTraditionChange("sunni");
                }}
                className={`px-2.5 py-0.5 rounded-full transition-all duration-150 ${
                  activeTab === "hadith" && hadithTradition === "sunni"
                    ? "bg-[#0F6B58] text-white font-bold shadow-xs scale-105"
                    : "text-[#5F584C] dark:text-[#D3CDC1] hover:text-[#1F1C18] dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#27352F]"
                }`}
                title="Sunni Hadith (Sahih al-Bukhari)"
              >
                {t("nav.sunni")}
              </button>
              <span className="text-[#B5AD9F] dark:text-[#5F6B64] text-[9px]">/</span>
              <button
                id="header-hadith-shia-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange("hadith");
                  onHadithTraditionChange("shia");
                }}
                className={`px-2.5 py-0.5 rounded-full transition-all duration-150 ${
                  activeTab === "hadith" && hadithTradition === "shia"
                    ? "bg-[#8B6E14] text-white font-bold shadow-xs scale-105"
                    : "text-[#5F584C] dark:text-[#D3CDC1] hover:text-[#1F1C18] dark:hover:text-white hover:bg-white/70 dark:hover:bg-[#27352F]"
                }`}
                title="Shia Hadith (Kitab al-Kafi)"
              >
                {t("nav.shia")}
              </button>
            </div>
          </div>
        </nav>

        {/* Right Actions: Dark Mode Slider Box, Reciter Selector & Saved Verses Drawer Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto" dir="ltr">
          {/* Dark Mode Slider Box - positioned directly to the left of the reciter box */}
          <div
            id="theme-slider-box"
            className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-[#E5DFD5] dark:border-[#27352F] bg-white dark:bg-[#151D1A] px-2 sm:px-2.5 py-1.5 text-xs font-medium text-[#4A4337] dark:text-[#D3CDC1] shadow-sm transition hover:border-[#0F6B58]/40 dark:hover:border-[#1E826C]/50 select-none"
            title={isDark ? t("theme.toggleLight", "Toggle Light Mode") : t("theme.toggleDark", "Toggle Dark Mode")}
          >
            {/* Sun Icon (clickable to switch to Light mode) */}
            <button
              type="button"
              onClick={() => setIsDark(false)}
              className="flex items-center justify-center p-0.5 rounded hover:opacity-80 transition cursor-pointer"
              title={t("theme.toggleLight", "Switch to Light Mode")}
              aria-label="Switch to Light Mode"
            >
              <Sun className={`h-3.5 w-3.5 transition-colors shrink-0 ${!isDark ? "text-[#E5A00D]" : "text-[#7A7265]"}`} />
            </button>

            {/* Slider track with draggable/clickable range input and smooth sliding thumb */}
            <div className="relative flex items-center shrink-0">
              {/* Visual Slider Track */}
              <div
                className={`relative h-4.5 w-9 sm:w-10 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                  isDark ? "bg-[#0F6B58]" : "bg-[#D8D2C6]"
                }`}
                role="switch"
                aria-checked={isDark}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleTheme();
                  }
                }}
              >
                {/* Visual Sliding Knob / Thumb */}
                <span
                  className={`absolute top-0.5 left-0.5 flex h-3.5 w-3.5 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out pointer-events-none ${
                    isDark ? "translate-x-4.5 sm:translate-x-5" : "translate-x-0"
                  }`}
                >
                  {isDark ? (
                    <Moon className="h-2 w-2 text-[#0F6B58]" />
                  ) : (
                    <Sun className="h-2 w-2 text-[#E5A00D]" />
                  )}
                </span>
              </div>

              {/* Functional Range Slider overlay to drag / turn the slider smoothly */}
              <input
                type="range"
                id="theme-slider-input"
                min="0"
                max="1"
                step="1"
                value={isDark ? 1 : 0}
                onChange={(e) => setIsDark(e.target.value === "1")}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10"
                aria-label={isDark ? t("theme.toggleLight", "Dark mode active, turn slider to switch to light") : t("theme.toggleDark", "Light mode active, turn slider to switch to dark")}
              />
            </div>

            {/* Moon Icon (clickable to switch to Dark mode) */}
            <button
              type="button"
              onClick={() => setIsDark(true)}
              className="flex items-center justify-center p-0.5 rounded hover:opacity-80 transition cursor-pointer"
              title={t("theme.toggleDark", "Switch to Dark Mode")}
              aria-label="Switch to Dark Mode"
            >
              <Moon className={`h-3.5 w-3.5 transition-colors shrink-0 ${isDark ? "text-[#38BDF8]" : "text-[#8C8373]"}`} />
            </button>

            {/* Mode text indicator */}
            <span className="hidden md:inline text-[11px] font-semibold tracking-wide">
              {isDark ? t("theme.dark", "Dark") : t("theme.light", "Light")}
            </span>
          </div>

          {/* Reciter Picker Button */}
          <button
            id="reciter-modal-btn"
            onClick={onOpenReciterModal}
            className="flex items-center gap-2 rounded-lg border border-[#E5DFD5] dark:border-[#27352F] bg-white dark:bg-[#151D1A] px-2.5 py-1.5 text-xs font-medium text-[#4A4337] dark:text-[#D3CDC1] shadow-sm transition hover:border-[#0F6B58]/40 dark:hover:border-[#1E826C]/50 hover:bg-[#FAF7F0] dark:hover:bg-[#1B2520]"
            title={t("reciter.title")}
          >
            <Headphones className="h-3.5 w-3.5 text-[#0F6B58] dark:text-[#1E826C]" />
            <span className="max-w-[80px] truncate sm:max-w-[130px]">
              {isRTL && currentReciter.arabicName
                ? currentReciter.arabicName.split(" ")[0]
                : currentReciter.name.split(" ")[0]}
            </span>
          </button>

          {/* Saved Verses Bookmark Drawer */}
          <button
            id="saved-drawer-btn"
            onClick={onOpenSavedDrawer}
            className="relative flex items-center gap-1.5 rounded-lg border border-[#E5DFD5] dark:border-[#27352F] bg-white dark:bg-[#151D1A] px-3 py-1.5 text-xs font-medium text-[#4A4337] dark:text-[#D3CDC1] shadow-sm transition hover:border-[#C9A227] hover:bg-[#FAF7F0] dark:hover:bg-[#1B2520]"
            title={t("saved.title")}
          >
            <Bookmark className={`h-3.5 w-3.5 ${savedCount > 0 ? "text-[#C9A227] fill-[#C9A227]" : "text-[#7A7265] dark:text-[#9C9486]"}`} />
            <span className="hidden sm:inline">{t("nav.saved")}</span>
            {savedCount > 0 && (
              <span className="ml-1 rounded-full bg-[#C9A227] px-1.5 py-0.2 text-[10px] font-bold text-white leading-none">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

