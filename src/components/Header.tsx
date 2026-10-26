import React, { useState, useRef, useEffect } from "react";
import { BookOpen, Bookmark, Headphones, Sparkles, ScrollText, Settings, ChevronDown, Check } from "lucide-react";
import { HadithTradition, ReciterConfig } from "../types";
import { useLanguage } from "../context/LanguageContext";

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
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E2D8] bg-[#FBF8F2]/95 backdrop-blur-md transition-all shadow-2xs">
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
                      ? "border-[#0F6B58] bg-[#0F6B58]/10 text-[#0F6B58]"
                      : "border-[#E0D9CD] bg-white text-[#4A4337] hover:border-[#0F6B58]/50 hover:bg-[#FAF8F3]"
                  }`}
                  title={t("app.selectLanguage")}
                  aria-label="Language Settings"
                  aria-expanded={isSettingsOpen}
                >
                  <Settings className={`h-3.5 w-3.5 text-[#0F6B58] transition-transform duration-300 ${isSettingsOpen ? "rotate-90" : "group-hover/settings:rotate-45"}`} />
                  <span className="text-[11px] font-bold">
                    {language === "ar"
                      ? "العربية"
                      : language === "fa"
                      ? "فارسی"
                      : language === "id"
                      ? "Indonesia"
                      : "English"}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-[#7A7265] transition-transform duration-200 ${isSettingsOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown displaying the 4 language options */}
                {isSettingsOpen && (
                  <div 
                    id="language-settings-dropdown"
                    className={`absolute top-full mt-1.5 w-56 rounded-xl border border-[#E2DDD3] bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 ${
                      isRTL ? "right-0 text-right" : "left-0 text-left"
                    }`}
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8C8375] border-b border-[#F0EBE1] mb-1 flex items-center justify-between">
                      <span>{t("app.selectLanguage")}</span>
                      <span className="font-mono text-[9px] text-[#A0988A] uppercase font-bold">{language}</span>
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
          <div className="relative flex items-center rounded-full border border-[#E2DDD3] bg-[#EFEAE1]/70 p-1 shadow-inner">
            {/* Tab 1: Qur'an */}
            <button
              id="tab-quran-btn"
              onClick={() => onTabChange("quran")}
              className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                activeTab === "quran" ? "text-white" : "text-[#5C5549] hover:text-[#2B2620]"
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
                activeTab === "explore" ? "text-white" : "text-[#5C5549] hover:text-[#2B2620]"
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
                activeTab === "hadith" ? "text-white" : "text-[#5C5549] hover:text-[#2B2620]"
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
            <div className="flex items-center gap-1 bg-[#EBE5DA] border border-[#DDD5C7] rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-medium shadow-2xs">
              <span className="text-[10px] text-[#7A7265] uppercase tracking-wider font-semibold mr-0.5 hidden xs:inline">
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
                    : "text-[#5F584C] hover:text-[#1F1C18] hover:bg-white/70"
                }`}
                title="Sunni Hadith (Sahih al-Bukhari)"
              >
                {t("nav.sunni")}
              </button>
              <span className="text-[#B5AD9F] text-[9px]">/</span>
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
                    : "text-[#5F584C] hover:text-[#1F1C18] hover:bg-white/70"
                }`}
                title="Shia Hadith (Kitab al-Kafi)"
              >
                {t("nav.shia")}
              </button>
            </div>
          </div>
        </nav>

        {/* Right Actions: Reciter Selector & Saved Verses Drawer Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          {/* Reciter Picker Button */}
          <button
            id="reciter-modal-btn"
            onClick={onOpenReciterModal}
            className="flex items-center gap-2 rounded-lg border border-[#E5DFD5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#4A4337] shadow-sm transition hover:border-[#0F6B58]/40 hover:bg-[#FAF7F0]"
            title={t("reciter.title")}
          >
            <Headphones className="h-3.5 w-3.5 text-[#0F6B58]" />
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
            className="relative flex items-center gap-1.5 rounded-lg border border-[#E5DFD5] bg-white px-3 py-1.5 text-xs font-medium text-[#4A4337] shadow-sm transition hover:border-[#C9A227] hover:bg-[#FAF7F0]"
            title={t("saved.title")}
          >
            <Bookmark className={`h-3.5 w-3.5 ${savedCount > 0 ? "text-[#C9A227] fill-[#C9A227]" : "text-[#7A7265]"}`} />
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

