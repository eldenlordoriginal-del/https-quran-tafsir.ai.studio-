export type AppLanguage = "en" | "ar" | "fa" | "id";

export interface SurahInfo {
  number: number;
  name: string; // Arabic name, e.g., سُورَةُ ٱلْفَاتِحَةِ
  englishName: string; // e.g., Al-Faatiha
  englishNameTranslation: string; // e.g., The Opening
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  number: number; // Global ayah number (1 to 6236)
  text: string; // Arabic text
  numberInSurah: number;
  juz: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | object;
  translation?: string; // English Saheeh International text
}

export interface SurahDetail extends SurahInfo {
  ayahs: Ayah[];
}

export interface ReciterConfig {
  id: string;
  name: string;
  arabicName: string;
  style: string;
  ayahUrlPattern: string; // e.g., "https://cdn.islamic.network/quran/audio/128/{reciterId}/{globalAyahNumber}.mp3"
  surahUrlPattern: string; // e.g., "https://cdn.islamic.network/quran/audio-surah/128/{reciterId}-surah/{surahNumber}.mp3"
  isCustomUrl?: boolean;
  notes?: string;
}

export interface Bookmark {
  id: string; // e.g., "2:255"
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  globalAyahNumber: number;
  arabicText: string;
  translation: string;
  timestamp: number;
}

export interface ScholarlyExplanation {
  tradition: "Sunni" | "Shia";
  scholar: string;
  sourceWork: string;
  language: string;
  text: string;
  keyInsights?: string[];
  arabicExcerpt?: string;
  deathYear?: string;
  methodology?: string;
}

export interface DualTafsirData {
  sunni: ScholarlyExplanation;
  shia: ScholarlyExplanation;
  arabicTafsir?: {
    work: string;
    scholar: string;
    text: string;
  };
  additionalCommentators?: ScholarlyExplanation[];
}

export interface DualExplanationResponse {
  sunniExplanation: string;
  shiaExplanation: string;
  sunniScholarRef?: string;
  shiaScholarRef?: string;
  isFallback: boolean;
  note?: string;
}

export interface TafsirData {
  author: string;
  editionName: string;
  language: string;
  text: string;
}

export interface SearchResultItem {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

export interface ActiveAudioState {
  isPlaying: boolean;
  surahNumber: number;
  surahName: string;
  ayahNumberInSurah: number;
  globalAyahNumber: number;
  isContinuousSurah: boolean;
  totalAyahsInSurah: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

export type HadithTradition = "sunni" | "shia";

export interface HadithBookMetadata {
  id: string;
  tradition: HadithTradition;
  title: string;
  arabicTitle: string;
  author: string;
  totalHadiths: number;
  totalSections?: number;
  description: string;
  isMajorSix?: boolean;
}

export interface HadithSectionMetadata {
  id: string;
  number: number;
  title: string;
  arabicTitle?: string;
  hadithCount?: number;
  firstHadithNumber?: number;
  lastHadithNumber?: number;
}

export interface HadithItem {
  id: string;
  tradition: HadithTradition;
  source: string; // e.g., "Sahih al-Bukhari" or "Kitab al-Kafi"
  book: string; // e.g., "Book of Revelation" or "Kitab al-'Aql wa al-Jahl"
  chapter: string; // Chapter / Bab title
  hadithNumber: string; // e.g., "Hadith 1" or "Vol. 1, Hadith 1"
  referenceCitation: string; // Full primary citation reference
  narrator: string; // Narrator / chain beginning
  arabicText: string;
  englishTranslation: string;
  grading: string; // Authentic status, e.g. "Sahih", "Muttafaqun 'Alayh"
  scholarlyGradingDetail: string; // Specific source of grading, e.g. "Muttafaqun 'Alayh (Agreed upon)" or "Sahih (Mir'at al-Uqul by Allamah al-Majlisi)"
  topic: string; // Category, e.g. "Faith & Intentions", "Knowledge", "Character", "Parents", "Justice"
  explanation?: string; // Scholarly reflection on the hadith
  bookId?: string;
  sectionId?: string;
  rawNumber?: number;
}
