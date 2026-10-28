import React, { useState, useEffect, useCallback } from "react";
import { ALL_SURAHS } from "./data/surahs";
import { DEFAULT_RECITERS } from "./data/reciters";
import { Ayah, Bookmark, HadithTradition, ReciterConfig, SurahDetail, SurahInfo } from "./types";
import { fetchSurahDetail, fetchSurahList } from "./services/quranApi";
import { Header } from "./components/Header";
import { SurahList } from "./components/SurahList";
import { SurahReader } from "./components/SurahReader";
import { VerseExplorer } from "./components/VerseExplorer";
import { HadithExplorer } from "./components/HadithExplorer";
import { AudioPlayer } from "./components/AudioPlayer";
import { SavedDrawer } from "./components/SavedDrawer";
import { ReciterModal } from "./components/ReciterModal";
import { useLanguage } from "./context/LanguageContext";

const BOOKMARKS_STORAGE_KEY = "quran_tafsir_saved_verses";
const RECITER_STORAGE_KEY = "quran_tafsir_active_reciter";

export default function App() {
  const { language } = useLanguage();
  // Navigation State
  const [activeTab, setActiveTab] = useState<"quran" | "explore" | "hadith">("quran");
  const [hadithTradition, setHadithTradition] = useState<HadithTradition>("sunni");
  const [surahs, setSurahs] = useState<SurahInfo[]>(ALL_SURAHS);
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [currentSurahDetail, setCurrentSurahDetail] = useState<SurahDetail | null>(null);
  const [loadingSurah, setLoadingSurah] = useState<boolean>(false);

  // Tab 2 Explore Initial Reference
  const [exploreSurahNum, setExploreSurahNum] = useState<number>(2);
  const [exploreAyahNum, setExploreAyahNum] = useState<number>(255);

  // Bookmarks State (persisted to localStorage)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Reciter State
  const [reciters, setReciters] = useState<ReciterConfig[]>(DEFAULT_RECITERS);
  const [currentReciter, setCurrentReciter] = useState<ReciterConfig>(() => {
    try {
      const savedId = localStorage.getItem(RECITER_STORAGE_KEY);
      if (savedId) {
        const found = DEFAULT_RECITERS.find((r) => r.id === savedId);
        if (found) return found;
      }
    } catch {}
    return DEFAULT_RECITERS[0];
  });
  const [isReciterModalOpen, setIsReciterModalOpen] = useState(false);

  // Audio Playback State
  const [audioSurahNumber, setAudioSurahNumber] = useState<number | undefined>(undefined);
  const [audioSurahName, setAudioSurahName] = useState<string>("");
  const [audioAyahNumberInSurah, setAudioAyahNumberInSurah] = useState<number | undefined>(undefined);
  const [audioGlobalAyahNumber, setAudioGlobalAyahNumber] = useState<number | undefined>(undefined);
  const [audioTotalAyahs, setAudioTotalAyahs] = useState<number | undefined>(undefined);
  const [isContinuousSurah, setIsContinuousSurah] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Sync Surah list from API on mount
  useEffect(() => {
    fetchSurahList().then((list) => {
      if (list && list.length === 114) {
        setSurahs(list);
      }
    });
  }, []);

  // Persist Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn("Could not write bookmarks to localStorage", e);
    }
  }, [bookmarks]);

  // Persist Reciter
  useEffect(() => {
    try {
      localStorage.setItem(RECITER_STORAGE_KEY, currentReciter.id);
    } catch {}
  }, [currentReciter]);

  // Load Surah Detail when selectedSurahNumber or language changes
  useEffect(() => {
    if (!selectedSurahNumber) {
      setCurrentSurahDetail(null);
      return;
    }

    setLoadingSurah(true);
    fetchSurahDetail(selectedSurahNumber, language)
      .then((detail) => {
        setCurrentSurahDetail(detail);
      })
      .catch((err) => {
        console.error("Failed to load surah detail:", err);
      })
      .finally(() => {
        setLoadingSurah(false);
      });
  }, [selectedSurahNumber, language]);

  // Bookmark Helpers
  const isBookmarked = useCallback(
    (surahNum: number, ayahNum: number) => {
      const id = `${surahNum}:${ayahNum}`;
      return bookmarks.some((b) => b.id === id);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (ayah: Ayah, surah: { number: number; englishName: string }) => {
      const id = `${surah.number}:${ayah.numberInSurah}`;
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.id === id);
        if (exists) {
          return prev.filter((b) => b.id !== id);
        } else {
          const newBookmark: Bookmark = {
            id,
            surahNumber: surah.number,
            surahName: surah.englishName,
            ayahNumber: ayah.numberInSurah,
            globalAyahNumber: ayah.number,
            arabicText: ayah.text,
            translation: ayah.translation || "",
            timestamp: Date.now(),
          };
          return [newBookmark, ...prev];
        }
      });
    },
    []
  );

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Audio actions
  const playFullSurahAudio = (surahNum: number) => {
    const meta = surahs.find((s) => s.number === surahNum);
    setAudioSurahNumber(surahNum);
    setAudioSurahName(meta ? meta.englishName : `Surah ${surahNum}`);
    setAudioAyahNumberInSurah(1);
    setAudioTotalAyahs(meta ? meta.numberOfAyahs : 1);
    setIsContinuousSurah(true);
    setIsPlaying(true);
  };

  const playSingleAyahAudio = (ayah: Ayah, surahNum: number, surahTitle: string) => {
    const meta = surahs.find((s) => s.number === surahNum);
    setAudioSurahNumber(surahNum);
    setAudioSurahName(surahTitle);
    setAudioAyahNumberInSurah(ayah.numberInSurah);
    setAudioGlobalAyahNumber(ayah.number);
    setAudioTotalAyahs(meta ? meta.numberOfAyahs : currentSurahDetail?.numberOfAyahs || 1);
    setIsContinuousSurah(false);
    setIsPlaying(true);
  };

  const handleNextAyah = () => {
    if (!audioSurahNumber || !audioAyahNumberInSurah || !audioTotalAyahs) return;
    if (audioAyahNumberInSurah < audioTotalAyahs) {
      const nextAyahNum = audioAyahNumberInSurah + 1;
      setAudioAyahNumberInSurah(nextAyahNum);
      if (currentSurahDetail && currentSurahDetail.number === audioSurahNumber) {
        const nextAyahObj = currentSurahDetail.ayahs.find(
          (a) => a.numberInSurah === nextAyahNum
        );
        if (nextAyahObj) {
          setAudioGlobalAyahNumber(nextAyahObj.number);
        }
      } else if (audioGlobalAyahNumber) {
        setAudioGlobalAyahNumber(audioGlobalAyahNumber + 1);
      }
      setIsPlaying(true);
    }
  };

  const handlePrevAyah = () => {
    if (!audioSurahNumber || !audioAyahNumberInSurah) return;
    if (audioAyahNumberInSurah > 1) {
      const prevAyahNum = audioAyahNumberInSurah - 1;
      setAudioAyahNumberInSurah(prevAyahNum);
      if (currentSurahDetail && currentSurahDetail.number === audioSurahNumber) {
        const prevAyahObj = currentSurahDetail.ayahs.find(
          (a) => a.numberInSurah === prevAyahNum
        );
        if (prevAyahObj) {
          setAudioGlobalAyahNumber(prevAyahObj.number);
        }
      } else if (audioGlobalAyahNumber) {
        setAudioGlobalAyahNumber(audioGlobalAyahNumber - 1);
      }
      setIsPlaying(true);
    }
  };

  const handleAyahEnded = () => {
    if (isContinuousSurah) {
      // Entire surah audio track finished
      setIsPlaying(false);
    } else {
      // Advance to next ayah if available
      if (audioAyahNumberInSurah && audioTotalAyahs && audioAyahNumberInSurah < audioTotalAyahs) {
        handleNextAyah();
      } else {
        setIsPlaying(false);
      }
    }
  };

  // Switch to Tab 2 and prefill with verse
  const handleNavigateToExplore = (surahNum: number, ayahNum: number) => {
    setExploreSurahNum(surahNum);
    setExploreAyahNum(ayahNum);
    setActiveTab("explore");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Switch to Tab 1 and open specific surah
  const handleNavigateToSurahReader = (surahNum: number, ayahNum?: number) => {
    setSelectedSurahNumber(surahNum);
    setActiveTab("quran");
    if (ayahNum) {
      setAudioAyahNumberInSurah(ayahNum);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FBF8F2] dark:bg-[#0E1311] bg-islamic-pattern text-[#2B2620] dark:text-[#EDE8DF] flex flex-col selection:bg-[#0F6B58]/20 dark:selection:bg-[#1E826C]/30 selection:text-[#0F6B58] dark:selection:text-[#1E826C] transition-colors duration-200">
      {/* Persistent App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        hadithTradition={hadithTradition}
        onHadithTraditionChange={(tradition) => {
          setHadithTradition(tradition);
        }}
        savedCount={bookmarks.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        currentReciter={currentReciter}
        onOpenReciterModal={() => setIsReciterModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === "quran" ? (
          selectedSurahNumber ? (
            <SurahReader
              surah={currentSurahDetail}
              loading={loadingSurah}
              onBack={() => setSelectedSurahNumber(null)}
              activeAyahNumberInSurah={
                audioSurahNumber === selectedSurahNumber
                  ? audioAyahNumberInSurah
                  : undefined
              }
              isPlaying={isPlaying}
              onPlayAyah={(ayah) =>
                playSingleAyahAudio(
                  ayah,
                  selectedSurahNumber,
                  currentSurahDetail?.englishName || `Surah ${selectedSurahNumber}`
                )
              }
              onPlayFullSurah={() => playFullSurahAudio(selectedSurahNumber)}
              onNavigateToExplore={handleNavigateToExplore}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
            />
          ) : (
            <SurahList
              surahs={surahs}
              onSelectSurah={(num) => {
                setSelectedSurahNumber(num);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onPlaySurah={playFullSurahAudio}
              currentPlayingSurahNumber={audioSurahNumber}
              isPlaying={isPlaying}
            />
          )
        ) : activeTab === "explore" ? (
          <VerseExplorer
            initialSurahNumber={exploreSurahNum}
            initialAyahNumber={exploreAyahNum}
            onPlayAyah={(ayah, surahNum, surahTitle) =>
              playSingleAyahAudio(ayah, surahNum, surahTitle)
            }
            isPlaying={isPlaying}
            playingGlobalAyahNumber={audioGlobalAyahNumber}
            isBookmarked={isBookmarked}
            onToggleBookmark={(ayah, surah) => toggleBookmark(ayah, surah)}
          />
        ) : (
          <HadithExplorer
            selectedTradition={hadithTradition}
            onTraditionChange={(t) => setHadithTradition(t)}
          />
        )}
      </main>

      {/* Sticky Bottom Audio Player */}
      <AudioPlayer
        currentSurahNumber={audioSurahNumber}
        currentSurahName={audioSurahName}
        currentAyahNumberInSurah={audioAyahNumberInSurah}
        globalAyahNumber={audioGlobalAyahNumber}
        totalAyahsInSurah={audioTotalAyahs}
        isContinuousSurah={isContinuousSurah}
        onToggleContinuous={() => setIsContinuousSurah(!isContinuousSurah)}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        onAyahEnded={handleAyahEnded}
        currentReciter={currentReciter}
        onOpenReciterModal={() => setIsReciterModalOpen(true)}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onClosePlayer={() => {
          setIsPlaying(false);
          setAudioSurahNumber(undefined);
        }}
      />

      {/* Saved Verses Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={removeBookmark}
        onSelectVerseToExplore={handleNavigateToExplore}
        onSelectSurahToRead={handleNavigateToSurahReader}
        onPlayAyahAudio={(sNum, aNum, gNum, sTitle) => {
          setAudioSurahNumber(sNum);
          setAudioSurahName(sTitle);
          setAudioAyahNumberInSurah(aNum);
          setAudioGlobalAyahNumber(gNum);
          setIsContinuousSurah(false);
          setIsPlaying(true);
        }}
        playingGlobalAyahNumber={audioGlobalAyahNumber}
        isPlaying={isPlaying}
      />

      {/* Reciter Configuration Modal */}
      <ReciterModal
        isOpen={isReciterModalOpen}
        onClose={() => setIsReciterModalOpen(false)}
        reciters={reciters}
        selectedReciter={currentReciter}
        onSelectReciter={(r) => {
          setCurrentReciter(r);
          setIsReciterModalOpen(false);
        }}
        onUpdateReciterConfig={(updated) => {
          setReciters((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
          );
          if (currentReciter.id === updated.id) {
            setCurrentReciter(updated);
          }
        }}
      />
    </div>
  );
}
