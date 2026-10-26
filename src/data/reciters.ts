import { ReciterConfig } from "../types";

export const DEFAULT_RECITERS: ReciterConfig[] = [
  {
    id: "ar.alafasy",
    name: "Mishary Rashid Alafasy",
    arabicName: "مشاري راشد العفاسي",
    style: "Murattal (Clear & Melodic)",
    ayahUrlPattern: "https://everyayah.com/data/Alafasy_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server8.mp3quran.net/afs/{paddedSurahNumber}.mp3",
    notes: "High-definition recitation with full surah and verse-by-verse streaming."
  },
  {
    id: "ar.abdulbasitmurattal",
    name: "AbdulBaset AbdulSamad",
    arabicName: "عبد الباسط عبد الصمد",
    style: "Murattal (Traditional Reverent)",
    ayahUrlPattern: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server7.mp3quran.net/basit/{paddedSurahNumber}.mp3",
    notes: "The golden-era master of Quranic recitation."
  },
  {
    id: "ar.husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    style: "Murattal (Precise Tajweed)",
    ayahUrlPattern: "https://everyayah.com/data/Husary_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server13.mp3quran.net/husr/{paddedSurahNumber}.mp3",
    notes: "Renowned for exacting articulation and tajweed learning."
  },
  {
    id: "ar.minshawi",
    name: "Mohamed Siddiq Al-Minshawy",
    arabicName: "محمد صديق المنشاوي",
    style: "Murattal (Spiritual & Moving)",
    ayahUrlPattern: "https://everyayah.com/data/Minshawy_Murattal_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server10.mp3quran.net/minsh/{paddedSurahNumber}.mp3",
    notes: "Deeply poignant and humble recitation beloved worldwide."
  },
  {
    id: "ar.shatri",
    name: "Abu Bakr Al-Shatri",
    arabicName: "أبو بكر الشاطري",
    style: "Murattal (Calm & Modern)",
    ayahUrlPattern: "https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server11.mp3quran.net/shatri/{paddedSurahNumber}.mp3",
    notes: "Smooth, rhythmic contemporary recitation from Jeddah."
  },
  {
    id: "ar.ghamadi",
    name: "Saad Al-Ghamdi",
    arabicName: "سعد الغامدي",
    style: "Murattal (Warm & Inspiring)",
    ayahUrlPattern: "https://everyayah.com/data/Ghamadi_40kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server7.mp3quran.net/s_gmd/{paddedSurahNumber}.mp3",
    notes: "Warm, emotive recitation from Dammam, Saudi Arabia."
  },
  {
    id: "ar.dossary",
    name: "Sheikh Yasser Al-Dossary",
    arabicName: "الشيخ ياسر الدوسري",
    style: "Murattal (Imam of Masjid al-Haram, Moving & Resonant)",
    ayahUrlPattern: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server11.mp3quran.net/yasser/{paddedSurahNumber}.mp3",
    notes: "Distinguished Imam of the Grand Mosque in Makkah (Masjid al-Haram), famous for heartfelt, emotive, and resonant recitations."
  },
  {
    id: "maytham-al-tammar",
    name: "Maytham al-Tammar",
    arabicName: "ميثم التمار",
    style: "Heartfelt / Iraqi Maqam",
    ayahUrlPattern: "https://everyayah.com/data/Alafasy_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server8.mp3quran.net/afs/{paddedSurahNumber}.mp3",
    isCustomUrl: true,
    notes: "Custom audio stream configurable in settings; defaults to Alafasy audio so playback remains seamless."
  }
];

export function getAudioSurahUrl(reciter: ReciterConfig, surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, "0");
  let pattern = reciter.surahUrlPattern || "https://server8.mp3quran.net/afs/{paddedSurahNumber}.mp3";

  // Sanitize any stale pattern that was pointing to broken cdn.islamic.network/quran/audio-surah
  if (pattern.includes("cdn.islamic.network/quran/audio-surah")) {
    pattern = "https://server8.mp3quran.net/afs/{paddedSurahNumber}.mp3";
  }

  return pattern
    .replace(/\{paddedSurahNumber\}/g, padded)
    .replace(/\{paddedSurah\}/g, padded)
    .replace(/\{surahNumber\}/g, String(surahNumber));
}

export function getAudioAyahUrl(
  reciter: ReciterConfig,
  globalAyahNumber: number,
  surahNumber?: number,
  ayahNumberInSurah?: number
): string {
  const paddedSurah = surahNumber ? String(surahNumber).padStart(3, "0") : "001";
  const paddedAyah = ayahNumberInSurah ? String(ayahNumberInSurah).padStart(3, "0") : "001";
  let pattern = reciter.ayahUrlPattern || "https://everyayah.com/data/Alafasy_128kbps/{paddedSurah}{paddedAyah}.mp3";

  // Replace old Islamic Network patterns for reciters that were returning 403
  if (pattern.includes("cdn.islamic.network") && (pattern.includes("abdulbasit") || pattern.includes("husary"))) {
    if (pattern.includes("abdulbasit")) {
      pattern = "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/{paddedSurah}{paddedAyah}.mp3";
    } else {
      pattern = "https://everyayah.com/data/Husary_128kbps/{paddedSurah}{paddedAyah}.mp3";
    }
  }

  return pattern
    .replace(/\{paddedSurah\}/g, paddedSurah)
    .replace(/\{paddedAyah\}/g, paddedAyah)
    .replace(/\{globalAyahNumber\}/g, String(globalAyahNumber))
    .replace(/\{surahNumber\}/g, String(surahNumber || 1))
    .replace(/\{ayahNumber\}/g, String(ayahNumberInSurah || 1));
}
