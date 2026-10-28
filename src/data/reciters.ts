import { AppLanguage, ReciterConfig } from "../types";

export const DEFAULT_RECITERS: ReciterConfig[] = [
  {
    id: "ar.alafasy",
    name: "Mishary Rashid Alafasy",
    arabicName: "مشاري راشد العفاسي",
    style: "Murattal (Clear & Melodic)",
    ayahUrlPattern: "https://everyayah.com/data/Alafasy_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server8.mp3quran.net/afs/{paddedSurahNumber}.mp3",
    notes: "High-definition recitation with full surah and verse-by-verse streaming.",
    localized: {
      en: {
        name: "Mishary Rashid Alafasy",
        style: "Murattal (Clear & Melodic)",
        notes: "High-definition recitation with full surah and verse-by-verse streaming."
      },
      ar: {
        name: "مشاري راشد العفاسي",
        style: "مرتل (صوت عذب وواضح)",
        notes: "تلاوة عالية الدقة مع استماع للسور كاملة ولكل آية على حدة."
      },
      fa: {
        name: "مشاری راشد العفاسی",
        style: "مرتل (صدایی دلنشین، رسا و ملودیک)",
        notes: "تلاوت با کیفیت بالا با امکان پخش پیوسته سوره و آیه به آیه."
      },
      id: {
        name: "Mishary Rashid Alafasy",
        style: "Murattal (Jernih & Merdu)",
        notes: "Bacaan definisi tinggi dengan streaming surah lengkap dan per-ayat."
      }
    }
  },
  {
    id: "ar.abdulbasitmurattal",
    name: "AbdulBaset AbdulSamad",
    arabicName: "عبد الباسط عبد الصمد",
    style: "Murattal (Traditional Reverent)",
    ayahUrlPattern: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server7.mp3quran.net/basit/{paddedSurahNumber}.mp3",
    notes: "The golden-era master of Quranic recitation.",
    localized: {
      en: {
        name: "AbdulBaset AbdulSamad",
        style: "Murattal (Traditional Reverent)",
        notes: "The golden-era master of Quranic recitation."
      },
      ar: {
        name: "عبد الباسط عبد الصمد",
        style: "مرتل (خشوع مصري أصيل)",
        notes: "أسطورة العصر الذهبي لتلاوة القرآن الكريم."
      },
      fa: {
        name: "عبدالباسط عبدالصمد",
        style: "مرتل (سنتی و سراسر خشوع)",
        notes: "استاد بی‌بدیل دوران طلایی قرائت قرآن کریم."
      },
      id: {
        name: "AbdulBaset AbdulSamad",
        style: "Murattal (Klasik Khusyuk)",
        notes: "Master era keemasan tilawah Al-Qur'an dunia."
      }
    }
  },
  {
    id: "ar.husary",
    name: "Mahmoud Khalil Al-Husary",
    arabicName: "محمود خليل الحصري",
    style: "Murattal (Precise Tajweed)",
    ayahUrlPattern: "https://everyayah.com/data/Husary_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server13.mp3quran.net/husr/{paddedSurahNumber}.mp3",
    notes: "Renowned for exacting articulation and tajweed learning.",
    localized: {
      en: {
        name: "Mahmoud Khalil Al-Husary",
        style: "Murattal (Precise Tajweed)",
        notes: "Renowned for exacting articulation and tajweed learning."
      },
      ar: {
        name: "محمود خليل الحصري",
        style: "مرتل (أحكام التجويد المتقن)",
        notes: "المرجع الأول لضبط مخارج الحروف وأحكام التجويد والتعليم."
      },
      fa: {
        name: "محمود خلیل الحصری",
        style: "مرتل (تجوید دقیق و استاندارد)",
        notes: "نامدار در ادای دقیق حروف، احکام تجوید و آموزش تلاوت."
      },
      id: {
        name: "Mahmoud Khalil Al-Husary",
        style: "Murattal (Tajwid Sangat Presisi)",
        notes: "Terkenal dengan artikulasi huruf dan pembelajaran tajwid terbaik."
      }
    }
  },
  {
    id: "ar.minshawi",
    name: "Mohamed Siddiq Al-Minshawy",
    arabicName: "محمد صديق المنشاوي",
    style: "Murattal (Spiritual & Moving)",
    ayahUrlPattern: "https://everyayah.com/data/Minshawy_Murattal_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server10.mp3quran.net/minsh/{paddedSurahNumber}.mp3",
    notes: "Deeply poignant and humble recitation beloved worldwide.",
    localized: {
      en: {
        name: "Mohamed Siddiq Al-Minshawy",
        style: "Murattal (Spiritual & Moving)",
        notes: "Deeply poignant and humble recitation beloved worldwide."
      },
      ar: {
        name: "محمد صديق المنشاوي",
        style: "مرتل (خاشع يبكي القلوب)",
        notes: "تلاوة خاشعة تمس القلوب، محبوبة في شتى أنحاء العالم الإسلامي."
      },
      fa: {
        name: "محمد صدیق منشاوی",
        style: "مرتل (روح‌نواز، معنوی و محزون)",
        notes: "تلاوتی محزون، متواضعانه و دل‌انگیز مورد علاقه تمام جهانیان."
      },
      id: {
        name: "Mohamed Siddiq Al-Minshawy",
        style: "Murattal (Menyentuh Jiwa & Khusyuk)",
        notes: "Bacaan yang sangat menyentuh hati dan dicintai umat Islam di seluruh dunia."
      }
    }
  },
  {
    id: "ar.shatri",
    name: "Abu Bakr Al-Shatri",
    arabicName: "أبو بكر الشاطري",
    style: "Murattal (Calm & Modern)",
    ayahUrlPattern: "https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server11.mp3quran.net/shatri/{paddedSurahNumber}.mp3",
    notes: "Smooth, rhythmic contemporary recitation from Jeddah.",
    localized: {
      en: {
        name: "Abu Bakr Al-Shatri",
        style: "Murattal (Calm & Modern)",
        notes: "Smooth, rhythmic contemporary recitation from Jeddah."
      },
      ar: {
        name: "أبو بكر الشاطري",
        style: "مرتل (هادئ وإيقاعي معاصر)",
        notes: "تلاوة رقيقة وإيقاعية مميزة من جدة، المملكة العربية السعودية."
      },
      fa: {
        name: "ابوبکر الشاطری",
        style: "مرتل (آرام و ریتمیک معاصر)",
        notes: "تلاوتی روان، دلنشین و معاصر از جده عربستان سعودی."
      },
      id: {
        name: "Abu Bakr Al-Shatri",
        style: "Murattal (Tenang & Modern)",
        notes: "Bacaan mengalir dan berirama khas dari Jeddah, Arab Saudi."
      }
    }
  },
  {
    id: "ar.ghamadi",
    name: "Saad Al-Ghamdi",
    arabicName: "سعد الغامدي",
    style: "Murattal (Warm & Inspiring)",
    ayahUrlPattern: "https://everyayah.com/data/Ghamadi_40kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server7.mp3quran.net/s_gmd/{paddedSurahNumber}.mp3",
    notes: "Warm, emotive recitation from Dammam, Saudi Arabia.",
    localized: {
      en: {
        name: "Saad Al-Ghamdi",
        style: "Murattal (Warm & Inspiring)",
        notes: "Warm, emotive recitation from Dammam, Saudi Arabia."
      },
      ar: {
        name: "سعد الغامدي",
        style: "مرتل (دافئ ومؤثر)",
        notes: "تلاوة دافئة وملهمة من الدمام، المملكة العربية السعودية."
      },
      fa: {
        name: "سعد الغامدی",
        style: "مرتل (گرم، اثرگذار و پرانرژی)",
        notes: "تلاوتی دلنشین و صمیمی از دمام عربستان سعودی."
      },
      id: {
        name: "Saad Al-Ghamdi",
        style: "Murattal (Hangat & Menginspirasi)",
        notes: "Lantunan hangat dan penuh perasaan dari Dammam, Arab Saudi."
      }
    }
  },
  {
    id: "ar.dossary",
    name: "Sheikh Yasser Al-Dossary",
    arabicName: "الشيخ ياسر الدوسري",
    style: "Murattal (Imam of Masjid al-Haram, Moving & Resonant)",
    ayahUrlPattern: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server11.mp3quran.net/yasser/{paddedSurahNumber}.mp3",
    notes: "Distinguished Imam of the Grand Mosque in Makkah (Masjid al-Haram), famous for heartfelt, emotive, and resonant recitations.",
    localized: {
      en: {
        name: "Sheikh Yasser Al-Dossary",
        style: "Murattal (Imam of Masjid al-Haram, Moving & Resonant)",
        notes: "Distinguished Imam of the Grand Mosque in Makkah (Masjid al-Haram), famous for heartfelt, emotive, and resonant recitations."
      },
      ar: {
        name: "الشيخ ياسر الدوسري",
        style: "مرتل (إمام الحرم المكي، صوت مهيب شجي)",
        notes: "إمام وخطيب المسجد الحرام بمكة المكرمة، مشهور بالقراءات الخاشعة المهيبة التي تهز القلوب."
      },
      fa: {
        name: "شیخ یاسر الدوسری",
        style: "مرتل (امام مسجدالحرام، صدایی باشکوه و حزین)",
        notes: "امام و خطیب برجسته مسجدالحرام در مکه مکرمه، شهره به تلاوت‌های پرشور، عمیق و اثرگذار."
      },
      id: {
        name: "Sheikh Yasser Al-Dossary",
        style: "Murattal (Imam Masjidil Haram, Syahdu & Menggelegar)",
        notes: "Imam Masjidil Haram Makkah, terkenal dengan lantunan yang sangat menyentuh dan berwibawa."
      }
    }
  },
  {
    id: "maytham-al-tammar",
    name: "Maytham al-Tammar",
    arabicName: "ميثم التمار",
    style: "Heartfelt / Iraqi Maqam",
    ayahUrlPattern: "https://everyayah.com/data/Alafasy_128kbps/{paddedSurah}{paddedAyah}.mp3",
    surahUrlPattern: "https://server8.mp3quran.net/afs/{paddedSurahNumber}.mp3",
    isCustomUrl: true,
    notes: "Custom audio stream configurable in settings; defaults to Alafasy audio so playback remains seamless.",
    localized: {
      en: {
        name: "Maytham al-Tammar",
        style: "Heartfelt / Iraqi Maqam",
        notes: "Custom audio stream configurable in settings; defaults to Alafasy audio so playback remains seamless."
      },
      ar: {
        name: "ميثم التمار",
        style: "خاشع / مقامات عراقية أصيلة",
        notes: "بث صوتي مخصص يمكن تهيئته في الإعدادات؛ يعمل تلقائياً بصوت العفاسي لضمان استمرار التشغيل."
      },
      fa: {
        name: "میثم التمار",
        style: "محزون و معنوی / مقام عراقی اصیل",
        notes: "پخش صوتی قابل تنظیم در تنظیمات؛ برای اطمینان از پخش پیوسته به‌طور پیش‌فرض به صوت العفاسی متصل است."
      },
      id: {
        name: "Maytham al-Tammar",
        style: "Penuh Penghayatan / Maqam Irak",
        notes: "Streaming audio kustom yang dapat diatur di pengaturan; secara default tersambung agar pemutaran lancar."
      }
    }
  }
];

export function getReciterLocalized(reciter: ReciterConfig, lang: AppLanguage = "en"): { name: string; style: string; notes?: string } {
  const loc = reciter.localized?.[lang];
  if (loc) {
    return {
      name: loc.name || (lang === "ar" || lang === "fa" ? reciter.arabicName || reciter.name : reciter.name),
      style: loc.style || reciter.style,
      notes: loc.notes || reciter.notes
    };
  }
  return {
    name: lang === "ar" || lang === "fa" ? reciter.arabicName || reciter.name : reciter.name,
    style: reciter.style,
    notes: reciter.notes
  };
}

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
