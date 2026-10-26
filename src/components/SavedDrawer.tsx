import React, { useState } from "react";
import {
  X,
  Bookmark,
  Trash2,
  Play,
  Volume2,
  ExternalLink,
  BookOpen,
  Search
} from "lucide-react";
import { Bookmark as BookmarkType } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onRemoveBookmark: (id: string) => void;
  onSelectVerseToExplore: (surahNumber: number, ayahNumber: number) => void;
  onSelectSurahToRead: (surahNumber: number, ayahNumber: number) => void;
  onPlayAyahAudio: (surahNumber: number, ayahNumber: number, globalAyahNumber: number, surahName: string) => void;
  playingGlobalAyahNumber?: number;
  isPlaying?: boolean;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onSelectVerseToExplore,
  onSelectSurahToRead,
  onPlayAyahAudio,
  playingGlobalAyahNumber,
  isPlaying,
}) => {
  const { language, t, isRTL } = useLanguage();
  const [filterQuery, setFilterQuery] = useState("");

  if (!isOpen) return null;

  const filteredBookmarks = bookmarks.filter((b) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      b.surahName.toLowerCase().includes(q) ||
      b.id.includes(q) ||
      b.translation.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`fixed inset-0 z-50 flex ${isRTL ? "justify-start" : "justify-end"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className={`relative z-10 flex h-full w-full max-w-md flex-col bg-[#FBF8F2] shadow-2xl ${isRTL ? "border-r" : "border-l"} border-[#E6E0D4]`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D8] px-6 py-4 bg-white">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
            <h2 className="text-base font-bold text-[#2B2620]">
              {t("saved.title")} ({bookmarks.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8C8373] hover:bg-[#F2ECE1] hover:text-[#2B2620]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Input */}
        {bookmarks.length > 0 && (
          <div className="p-4 border-b border-[#E8E2D8] bg-[#F7F3EB]">
            <div className="relative">
              <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8C8373]`} />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={t("saved.filter")}
                className={`w-full rounded-lg border border-[#DCD5C8] bg-white ${isRTL ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"} py-1.5 text-xs text-[#2B2620] outline-none focus:border-[#0F6B58]`}
              />
            </div>
          </div>
        )}

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="py-16 text-center text-[#7A7265]">
              <Bookmark className="h-10 w-10 text-[#C9A227]/40 mx-auto mb-3" />
              <p className="font-semibold text-sm text-[#2B2620]">
                {t("saved.empty")}
              </p>
              <p className="text-xs text-[#7A7265] mt-1 max-w-xs mx-auto">
                {t("saved.emptyDesc")}
              </p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <p className="text-center text-xs text-[#7A7265] py-8">
              {t("saved.noMatches")} "{filterQuery}".
            </p>
          ) : (
            filteredBookmarks.map((b) => {
              const isThisPlaying =
                isPlaying && playingGlobalAyahNumber === b.globalAyahNumber;

              return (
                <div
                  key={b.id}
                  className="stripe-card rounded-xl bg-white p-4 border border-[#E6E0D4] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#0F6B58]/10 px-2 py-0.5 text-xs font-bold text-[#0F6B58]">
                        {t("reader.surahNumber")} {b.surahName} ({b.id})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Play Audio */}
                      <button
                        onClick={() =>
                          onPlayAyahAudio(
                            b.surahNumber,
                            b.ayahNumber,
                            b.globalAyahNumber,
                            b.surahName
                          )
                        }
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                          isThisPlaying
                            ? "bg-[#0F6B58] text-white border-[#0F6B58]"
                            : "border-[#E5DFD5] text-[#5C5549] hover:border-[#0F6B58]"
                        }`}
                        title={t("saved.play")}
                      >
                        {isThisPlaying ? (
                          <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                        ) : (
                          <Play className="h-3 w-3 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Remove Bookmark */}
                      <button
                        onClick={() => onRemoveBookmark(b.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5DFD5] text-[#8C8373] hover:text-rose-600 hover:border-rose-300"
                        title={t("saved.remove")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic snippet */}
                  <p
                    className="font-arabic text-right text-base text-[#1F1B16] line-clamp-2 leading-relaxed"
                    dir="rtl"
                  >
                    {b.arabicText}
                  </p>

                  {/* Translation snippet */}
                  <p className="text-xs text-[#4A4337] italic line-clamp-2">
                    "{b.translation}"
                  </p>

                  {/* Navigation Links */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4EFE6] text-xs">
                    <button
                      onClick={() => {
                        onSelectSurahToRead(b.surahNumber, b.ayahNumber);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[#6B6355] hover:text-[#0F6B58]"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>{t("saved.readSurah")}</span>
                    </button>
                    <span className="text-[#DCD5C8]">&bull;</span>
                    <button
                      onClick={() => {
                        onSelectVerseToExplore(b.surahNumber, b.ayahNumber);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-[#0F6B58] hover:underline"
                    >
                      <span>{t("saved.explore")}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
