import React, { useState } from "react";
import { X, Check, Headphones, Info, Settings2, ExternalLink } from "lucide-react";
import { ReciterConfig } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface ReciterModalProps {
  isOpen: boolean;
  onClose: () => void;
  reciters: ReciterConfig[];
  selectedReciter: ReciterConfig;
  onSelectReciter: (reciter: ReciterConfig) => void;
  onUpdateReciterConfig: (updated: ReciterConfig) => void;
}

export const ReciterModal: React.FC<ReciterModalProps> = ({
  isOpen,
  onClose,
  reciters,
  selectedReciter,
  onSelectReciter,
  onUpdateReciterConfig,
}) => {
  const { language, isRTL, t } = useLanguage();
  const [editingReciterId, setEditingReciterId] = useState<string | null>(null);
  const [customAyahPattern, setCustomAyahPattern] = useState("");
  const [customSurahPattern, setCustomSurahPattern] = useState("");

  if (!isOpen) return null;

  const handleStartEdit = (reciter: ReciterConfig) => {
    setEditingReciterId(reciter.id);
    setCustomAyahPattern(reciter.ayahUrlPattern);
    setCustomSurahPattern(reciter.surahUrlPattern);
  };

  const handleSaveConfig = (reciter: ReciterConfig) => {
    onUpdateReciterConfig({
      ...reciter,
      ayahUrlPattern: customAyahPattern,
      surahUrlPattern: customSurahPattern,
    });
    setEditingReciterId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-[#FBF8F2] p-6 shadow-2xl border border-[#E6E0D4] space-y-5" dir={isRTL ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F6B58]/10 text-[#0F6B58]">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2B2620]">
                {t("reciter.title")}
              </h3>
              <p className="text-xs text-[#7A7265]">
                {t("reciter.desc")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8C8373] hover:bg-[#F2ECE1] hover:text-[#2B2620]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Reciters List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {reciters.map((reciter) => {
            const isSelected = selectedReciter.id === reciter.id;
            const isEditing = editingReciterId === reciter.id;

            return (
              <div
                key={reciter.id}
                className={`stripe-card rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? "border-[#0F6B58] bg-white ring-2 ring-[#0F6B58]/20 shadow-xs"
                    : "border-[#E5DFD5] bg-white hover:border-[#0F6B58]/40"
                }`}
              >
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => onSelectReciter(reciter)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#1F1B16]">
                        {isRTL ? reciter.arabicName || reciter.name : reciter.name}
                      </h4>
                      {isSelected && (
                        <span className="flex items-center gap-1 rounded-full bg-[#0F6B58] px-2 py-0.5 text-[10px] font-semibold text-white">
                          <Check className="h-2.5 w-2.5" />
                          {t("reciter.active")}
                        </span>
                      )}
                    </div>
                    <span className="font-arabic text-sm text-[#8B6E14] block mt-0.5" dir="rtl">
                      {isRTL ? reciter.name : reciter.arabicName}
                    </span>
                    <p className="text-xs text-[#6B6355] mt-1 font-sans">
                      {reciter.style}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(reciter);
                      }}
                      className="p-1.5 rounded-lg border border-[#E5DFD5] text-[#7A7265] hover:text-[#0F6B58] hover:border-[#0F6B58] transition"
                      title={t("reciter.configure")}
                    >
                      <Settings2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Reciter Notes */}
                {reciter.notes && (
                  <p className="mt-2 text-[11px] text-[#7A7265] bg-[#FAF7F0] p-2 rounded-lg border border-[#EFE9DF]">
                    {reciter.notes}
                  </p>
                )}

                {/* Direct URL Pattern Config Form */}
                {isEditing && (
                  <div className="mt-3 pt-3 border-t border-[#F2ECE1] space-y-2">
                    <label className="text-[11px] font-bold text-[#5C5549] block">
                      {isRTL
                        ? `نمط رابط تلاوة الآيات ({paddedSurah}{paddedAyah} أو {globalAyahNumber}):`
                        : `Custom Ayah MP3 Pattern ({paddedSurah}{paddedAyah} or {globalAyahNumber}):`}
                    </label>
                    <input
                      type="text"
                      value={customAyahPattern}
                      onChange={(e) => setCustomAyahPattern(e.target.value)}
                      className="w-full rounded-lg border border-[#DCD5C8] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#2B2620] font-mono outline-none focus:border-[#0F6B58]"
                    />

                    <label className="text-[11px] font-bold text-[#5C5549] block">
                      {isRTL
                        ? `نمط رابط تلاوة السورة ({paddedSurahNumber} أو {surahNumber}):`
                        : `Custom Surah MP3 Pattern ({paddedSurahNumber} or {surahNumber}):`}
                    </label>
                    <input
                      type="text"
                      value={customSurahPattern}
                      onChange={(e) => setCustomSurahPattern(e.target.value)}
                      className="w-full rounded-lg border border-[#DCD5C8] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#2B2620] font-mono outline-none focus:border-[#0F6B58]"
                    />

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingReciterId(null)}
                        className="rounded-lg px-2.5 py-1 text-xs text-[#7A7265] hover:bg-[#F2ECE1]"
                      >
                        {t("reciter.cancel")}
                      </button>
                      <button
                        onClick={() => handleSaveConfig(reciter)}
                        className="rounded-lg bg-[#0F6B58] px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-[#094A3C]"
                      >
                        {t("reciter.saveConfig")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 rounded-2xl bg-[#0F6B58]/8 p-3 text-xs text-[#0F6B58] border border-[#0F6B58]/20">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            {t("reciter.info")}
          </p>
        </div>
      </div>
    </div>
  );
};
