import { AppLanguage } from "../types";

export interface TranslationsDict {
  [key: string]: {
    en: string;
    ar: string;
    fa: string;
    id: string;
  };
}

export const translations: TranslationsDict = {
  // App Header & Branding
  "app.title": {
    en: "Qur'an, Tafsir, & Hadith",
    ar: "القرآن والتفسير والحديث",
    fa: "قرآن، تفسیر و حدیث",
    id: "Al-Qur'an, Tafsir & Hadis",
  },
  "app.tag": {
    en: "Tadabbur",
    ar: "تدبّر",
    fa: "تدبر",
    id: "Tadabbur",
  },
  "app.subtitle": {
    en: "A way to truly understand the beauty of the holy Quran and our messenger Muhammed ﷺ",
    ar: "طريق لفهم جمال القرآن الكريم ورسولنا محمد ﷺ",
    fa: "راهی برای درک حقیقی زیبایی قرآن کریم و پیامبرمان محمد ﷺ",
    id: "Jalan untuk memahami keindahan Al-Qur'an dan Rasulullah Muhammad ﷺ",
  },
  "app.language": {
    en: "Language",
    ar: "اللغة",
    fa: "زبان",
    id: "Bahasa",
  },
  "app.english": {
    en: "English",
    ar: "الإنجليزية (English)",
    fa: "انگلیسی (English)",
    id: "Inggris (English)",
  },
  "app.arabic": {
    en: "Arabic",
    ar: "العربية",
    fa: "عربی (العربية)",
    id: "Arab (العربية)",
  },
  "app.persian": {
    en: "Persian",
    ar: "الفارسية",
    fa: "فارسی",
    id: "Persia (فارسی)",
  },
  "app.indonesian": {
    en: "Indonesian",
    ar: "الإندونيسية",
    fa: "اندونزیایی",
    id: "Bahasa Indonesia",
  },
  "app.selectLanguage": {
    en: "Choose Site Language",
    ar: "اختر لغة الموقع",
    fa: "انتخاب زبان برنامه",
    id: "Pilih Bahasa Situs",
  },

  // Main Nav Tabs
  "nav.quran": {
    en: "Qur'an",
    ar: "القرآن الكريم",
    fa: "قرآن کریم",
    id: "Al-Qur'an",
  },
  "nav.explore": {
    en: "Explore a Verse",
    ar: "تدبر آية",
    fa: "تدبر آیه",
    id: "Tadabbur Ayat",
  },
  "nav.hadith": {
    en: "Hadith",
    ar: "الحديث الشريف",
    fa: "حدیث شریف",
    id: "Hadis",
  },
  "nav.hadithLabel": {
    en: "Hadith:",
    ar: "الحديث:",
    fa: "حدیث:",
    id: "Hadis:",
  },
  "nav.sunni": {
    en: "Sunni",
    ar: "السنة",
    fa: "اهل سنت",
    id: "Sunni",
  },
  "nav.shia": {
    en: "Shia",
    ar: "الشيعة",
    fa: "شیعه",
    id: "Syiah",
  },
  "nav.saved": {
    en: "Saved",
    ar: "المحفوظات",
    fa: "نشان‌شده‌ها",
    id: "Tersimpan",
  },
  "nav.reciter": {
    en: "Reciter",
    ar: "القارئ",
    fa: "قاری",
    id: "Qari",
  },

  // Surah List
  "surahList.badge": {
    en: "The Holy Qur'an • 114 Surahs • 6,236 Ayahs",
    ar: "القرآن الكريم • ١١٤ سورة • ٦,٢٣٦ آية",
    fa: "قرآن مجید • ۱۱۴ سوره • ۶٬۲۳۶ آیه",
    id: "Al-Qur'an Al-Karim • 114 Surah • 6.236 Ayat",
  },
  "surahList.title": {
    en: "Read, Listen & Reflect",
    ar: "اقرأ، استمع وتدبّر",
    fa: "بخوانید، بشنوید و تدبر کنید",
    id: "Membaca, Mendengarkan & Mentadabburi",
  },
  "surahList.subtitle": {
    en: "Immerse yourself in the beauty of the book of Allah, the final revelation that came with our messenger Muhammed ﷺ",
    ar: "انغمس في بلاغة وجمال كتاب الله، الرسالة الخاتمة التي أُنزلت على رسولنا محمد ﷺ",
    fa: "غوطه‌وری در بلاغت و زیبایی کتاب الله، وحی نهایی بر فرستاده خدا حضرت محمد ﷺ",
    id: "Selami keindahan Kitabullah, wahyu terakhir yang diturunkan kepada Nabi Muhammad ﷺ",
  },
  "surahList.frequent": {
    en: "Frequent:",
    ar: "السور الشائعة:",
    fa: "سوره‌های پرخوانش:",
    id: "Sering Dibaca:",
  },
  "surahList.searchPlaceholder": {
    en: "Search surah by name, number, meaning, or topic (e.g., 2, Baqarah, Light)...",
    ar: "ابحث برقم أو اسم السورة، المعنى، أو الموضوع (مثال: البقرة، الكهف، النور، ٢)...",
    fa: "جستجوی سوره با نام، شماره، معنی یا موضوع (مانند: بقره، کهف، نور، ۲)...",
    id: "Cari surah berdasarkan nama, nomor, arti, atau tema (cth: 2, Al-Baqarah, Cahaya)...",
  },
  "surahList.allSurahs": {
    en: "All Surahs",
    ar: "جميع السور",
    fa: "همه سوره‌ها",
    id: "Semua Surah",
  },
  "surahList.meccan": {
    en: "Meccan",
    ar: "مكية",
    fa: "مکی",
    id: "Makkiyah",
  },
  "surahList.medinan": {
    en: "Medinan",
    ar: "مدنية",
    fa: "مدنی",
    id: "Madaniyah",
  },
  "surahList.ayahs": {
    en: "ayahs",
    ar: "آية",
    fa: "آیه",
    id: "ayat",
  },
  "surahList.playSurah": {
    en: "Play Surah",
    ar: "استماع للسورة",
    fa: "پخش صوتی سوره",
    id: "Putar Surah",
  },
  "surahList.readAndListen": {
    en: "Read & Listen",
    ar: "قراءة واستماع",
    fa: "قرائت و استماع",
    id: "Baca & Dengar",
  },
  "surahList.noSurahs": {
    en: "No surahs found matching your search",
    ar: "لم يتم العثور على سور مطابقة لبحثك",
    fa: "سوره‌ای منطبق بر جستجوی شما یافت نشد",
    id: "Tidak ada surah yang cocok dengan pencarian Anda",
  },
  "surahList.resetSearch": {
    en: "Reset Search",
    ar: "إعادة ضبط البحث",
    fa: "تنظیم مجدد جستجو",
    id: "Reset Pencarian",
  },

  // Surah Reader
  "reader.allSurahs": {
    en: "All Surahs",
    ar: "جميع السور",
    fa: "همه سوره‌ها",
    id: "Semua Surah",
  },
  "reader.playFull": {
    en: "Play Surah",
    ar: "تشغيل السورة",
    fa: "پخش سوره",
    id: "Putar Surah",
  },
  "reader.pause": {
    en: "Pause",
    ar: "إيقاف مؤقت",
    fa: "توقف موقت",
    id: "Jeda",
  },
  "reader.continuous": {
    en: "Continuous Surah",
    ar: "تشغيل متواصل",
    fa: "پخش پیوسته",
    id: "Putar Berkelanjutan",
  },
  "reader.verseByVerse": {
    en: "Ayah by Ayah",
    ar: "آية بآية",
    fa: "آیه به آیه",
    id: "Ayat per Ayat",
  },
  "reader.cards": {
    en: "Card View",
    ar: "عرض البطاقات",
    fa: "نمای کارتی",
    id: "Tampilan Kartu",
  },
  "reader.mushaf": {
    en: "Mushaf View",
    ar: "عرض المصحف",
    fa: "نمای مصحف",
    id: "Tampilan Mushaf",
  },
  "reader.translation": {
    en: "Translation",
    ar: "الترجمة",
    fa: "ترجمه",
    id: "Terjemahan",
  },
  "reader.fontSize": {
    en: "Font Size",
    ar: "حجم الخط",
    fa: "اندازه قلم",
    id: "Ukuran Huruf",
  },
  "reader.exploreTafsir": {
    en: "Explore Tafsir & Reflections",
    ar: "تفسير وتدبر الآية",
    fa: "تفسیر و تدبر آیه",
    id: "Tafsir & Tadabbur Ayat",
  },
  "reader.save": {
    en: "Save",
    ar: "حفظ",
    fa: "نشان کردن",
    id: "Simpan",
  },
  "reader.saved": {
    en: "Saved",
    ar: "محفوظ",
    fa: "نشان شد",
    id: "Tersimpan",
  },
  "reader.copy": {
    en: "Copy",
    ar: "نسخ",
    fa: "کپی",
    id: "Salin",
  },
  "reader.copied": {
    en: "Copied!",
    ar: "تم النسخ!",
    fa: "کپی شد!",
    id: "Disalin!",
  },
  "reader.ayah": {
    en: "Ayah",
    ar: "آية",
    fa: "آیه",
    id: "Ayat",
  },
  "reader.playAyah": {
    en: "Play Ayah",
    ar: "استماع للآية",
    fa: "پخش آیه",
    id: "Putar Ayat",
  },
  "reader.surahNumber": {
    en: "Surah",
    ar: "سورة رقم",
    fa: "سوره شماره",
    id: "Surah No.",
  },

  // Verse Explorer
  "explore.badge": {
    en: "Scholarly Tafsir & Dual Perspectives",
    ar: "التفاسير المعتمدة ورؤى العلماء",
    fa: "تفاسیر معتبر و دیدگاه‌های تطبیقی",
    id: "Tafsir Ulama & Perspektif Komparatif",
  },
  "explorer.badge": {
    en: "Scholarly Tafsir & Dual Perspectives",
    ar: "التفاسير المعتمدة ورؤى العلماء",
    fa: "تفاسیر معتبر و دیدگاه‌های تطبیقی",
    id: "Tafsir Ulama & Perspektif Komparatif",
  },
  "explore.title": {
    en: "Deep Verse Reflection & Tafsir",
    ar: "تدبر عميق وتفاسير معتمدة",
    fa: "تدبر عمیق در آیات و تفاسیر",
    id: "Tadabbur Ayat & Tafsir Mendalam",
  },
  "explorer.title": {
    en: "Deep Verse Reflection & Tafsir",
    ar: "تدبر عميق وتفاسير معتمدة",
    fa: "تدبر عمیق در آیات و تفاسیر",
    id: "Tadabbur Ayat & Tafsir Mendalam",
  },
  "explore.subtitle": {
    en: "Compare authoritative classical commentaries across Islamic traditions alongside contemplative reflections.",
    ar: "قارن بين أمهات كتب التفسير المعتمدة للمسلمين مع تدبر هادف وإضاءات إيمانية عميقة.",
    fa: "مقایسه تفاسیر معتبر اهل سنت و شیعه در کنار تدبرهای ایمانی و اشارات معرفتی.",
    id: "Bandingkan tafsir-tafsir klasik otoritatif dari tradisi Islam disertai perenungan kontemplatif.",
  },
  "explorer.subtitle": {
    en: "Compare authoritative classical commentaries across Islamic traditions alongside contemplative reflections.",
    ar: "قارن بين أمهات كتب التفسير المعتمدة للمسلمين مع تدبر هادف وإضاءات إيمانية عميقة.",
    fa: "مقایسه تفاسیر معتبر اهل سنت و شیعه در کنار تدبرهای ایمانی و اشارات معرفتی.",
    id: "Bandingkan tafsir-tafsir klasik otoritatif dari tradisi Islam disertai perenungan kontemplatif.",
  },
  "explore.method1": {
    en: "Method 1: Direct Surah & Ayah Stepper",
    ar: "الطريقة الأولى: اختيار السورة والآية مباشرة",
    fa: "روش ۱: انتخاب مستقیم سوره و آیه",
    id: "Metode 1: Pemilihan Langsung Surah & Ayat",
  },
  "explorer.method1": {
    en: "Method 1: Direct Surah & Ayah Stepper",
    ar: "الطريقة الأولى: اختيار السورة والآية مباشرة",
    fa: "روش ۱: انتخاب مستقیم سوره و آیه",
    id: "Metode 1: Pemilihan Langsung Surah & Ayat",
  },
  "explore.surahLabel": {
    en: "Surah:",
    ar: "السورة:",
    fa: "سوره:",
    id: "Surah:",
  },
  "explorer.surahLabel": {
    en: "Surah:",
    ar: "السورة:",
    fa: "سوره:",
    id: "Surah:",
  },
  "explore.ayahLabel": {
    en: "Ayah:",
    ar: "الآية:",
    fa: "آیه:",
    id: "Ayat:",
  },
  "explorer.ayahLabel": {
    en: "Ayah:",
    ar: "الآية:",
    fa: "آیه:",
    id: "Ayat:",
  },
  "explore.prevAyah": {
    en: "Prev Ayah",
    ar: "الآية السابقة",
    fa: "آیه قبلی",
    id: "Ayat Sebelumnya",
  },
  "explorer.prevAyah": {
    en: "Prev Ayah",
    ar: "الآية السابقة",
    fa: "آیه قبلی",
    id: "Ayat Sebelumnya",
  },
  "explore.nextAyah": {
    en: "Next Ayah",
    ar: "الآية التالية",
    fa: "آیه بعدی",
    id: "Ayat Selanjutnya",
  },
  "explorer.nextAyah": {
    en: "Next Ayah",
    ar: "الآية التالية",
    fa: "آیه بعدی",
    id: "Ayat Selanjutnya",
  },
  "explore.method2": {
    en: "Method 2: Search by Theme or Reference",
    ar: "الطريقة الثانية: البحث بالموضوع أو المرجع",
    fa: "روش ۲: جستجو با موضوع یا ارجاع",
    id: "Metode 2: Cari berdasarkan Tema atau Referensi",
  },
  "explorer.method2": {
    en: "Method 2: Search by Theme or Reference",
    ar: "الطريقة الثانية: البحث بالموضوع أو المرجع",
    fa: "روش ۲: جستجو با موضوع یا ارجاع",
    id: "Metode 2: Cari berdasarkan Tema atau Referensi",
  },
  "explore.searchPlaceholder": {
    en: "Search by theme or reference (e.g., patience, mercy, 2:255)...",
    ar: "ابحث بموضوع أو آية (مثال: الصبر، الرحمة، ٢:٢٥٥)...",
    fa: "جستجو بر اساس موضوع یا نشانی (مانند: صبر، رحمت، ۲:۲۵۵)...",
    id: "Cari berdasarkan tema atau rujukan (cth: sabar, rahmat, 2:255)...",
  },
  "explorer.searchPlaceholder": {
    en: "Search by theme or reference (e.g., patience, mercy, 2:255)...",
    ar: "ابحث بموضوع أو آية (مثال: الصبر، الرحمة، ٢:٢٥٥)...",
    fa: "جستجو بر اساس موضوع یا نشانی (مانند: صبر، رحمت، ۲:۲۵۵)...",
    id: "Cari berdasarkan tema atau rujukan (cth: sabar, rahmat, 2:255)...",
  },
  "explore.featured": {
    en: "Featured Verses for Reflection:",
    ar: "آيات مختارة للتدبر:",
    fa: "آیات برگزیده برای تدبر:",
    id: "Ayat Pilihan untuk Tadabbur:",
  },
  "explorer.featured": {
    en: "Featured Verses for Reflection:",
    ar: "آيات مختارة للتدبر:",
    fa: "آیات برگزیده برای تدبر:",
    id: "Ayat Pilihan untuk Tadabbur:",
  },
  "explore.lookup": {
    en: "Lookup",
    ar: "بحث",
    fa: "جستجو",
    id: "Cari",
  },
  "explore.quickSelect": {
    en: "Quick Select:",
    ar: "اختيارات سريعة:",
    fa: "انتخاب سریع:",
    id: "Pilihan Cepat:",
  },
  "explore.translationTitle": {
    en: "Translation & Meaning",
    ar: "ترجمة معاني الآية الكريمة",
    fa: "ترجمه و مفهوم آیه شریفه",
    id: "Terjemahan & Makna Ayat",
  },
  "explore.tafsirTitle": {
    en: "Comparative Classical Tafsir",
    ar: "التفاسير التراثية المعتمدة",
    fa: "تفاسیر معتبر تطبیقی",
    id: "Tafsir Klasik Komparatif",
  },
  "explorer.tafsirTitle": {
    en: "Comparative Classical Tafsir",
    ar: "التفاسير التراثية المعتمدة",
    fa: "تفاسیر معتبر تطبیقی",
    id: "Tafsir Klasik Komparatif",
  },
  "explore.tafsirDesc": {
    en: "Authentic exegesis from classical books, sheikhs, and scholars across traditions. No AI generation.",
    ar: "تفاسير موثقة من أمهات كتب التفسير ومصنفات كبار العلماء المحققين — دون أي توليد آلي.",
    fa: "تفاسیر اصیل از کتب و علمای معتبر هر دو مکتب — بدون تولید هوش مصنوعی.",
    id: "Tafsir otoritatif dari kitab-kitab klasik ulama terkemuka — tanpa interpretasi AI.",
  },
  "explorer.tafsirDesc": {
    en: "Authentic exegesis from classical books, sheikhs, and scholars across traditions. No AI generation.",
    ar: "تفاسير موثقة من أمهات كتب التفسير ومصنفات كبار العلماء المحققين — دون أي توليد آلي.",
    fa: "تفاسیر اصیل از کتب و علمای معتبر هر دو مکتب — بدون تولید هوش مصنوعی.",
    id: "Tafsir otoritatif dari kitab-kitab klasik ulama terkemuka — tanpa interpretasi AI.",
  },
  "explore.sunniExplanation": {
    en: "Sunni Scholarly Exegesis",
    ar: "تفسير أهل السنة والجماعة",
    fa: "تفسیر اهل سنت و جماعت",
    id: "Tafsir Ahlussunnah Wal Jama'ah",
  },
  "explorer.sunniExplanation": {
    en: "Sunni Scholarly Exegesis",
    ar: "تفسير أهل السنة والجماعة",
    fa: "تفسیر اهل سنت و جماعت",
    id: "Tafsir Ahlussunnah Wal Jama'ah",
  },
  "explore.shiaExplanation": {
    en: "Shia Scholarly Exegesis",
    ar: "تفسير مدرسة أهل البيت (الشيعة)",
    fa: "تفسیر مکتب اهل بیت (ع)",
    id: "Tafsir Ahlulbait (Syiah)",
  },
  "explorer.shiaExplanation": {
    en: "Shia Scholarly Exegesis",
    ar: "تفسير مدرسة أهل البيت (الشيعة)",
    fa: "تفسیر مکتب اهل بیت (ع)",
    id: "Tafsir Ahlulbait (Syiah)",
  },
  "explore.tadabburTitle": {
    en: "Contemplative Reflection & Wisdom",
    ar: "تدبر الآية والدروس المستفادة",
    fa: "تدبر و اشارات معرفتی",
    id: "Renungan & Tadabbur Ayat",
  },
  "explorer.tadabburTitle": {
    en: "Contemplative Reflection & Wisdom",
    ar: "تدبر الآية والدروس المستفادة",
    fa: "تدبر و اشارات معرفتی",
    id: "Renungan & Tadabbur Ayat",
  },
  "explore.explainBoth": {
    en: "Explain from Both Traditions",
    ar: "شرح من المنظورين",
    fa: "شرح از هر دو مکتب",
    id: "Jelaskan dari Kedua Tradisi",
  },
  "explorer.explainBoth": {
    en: "Explain from Both Traditions",
    ar: "شرح من المنظورين",
    fa: "شرح از هر دو مکتب",
    id: "Jelaskan dari Kedua Tradisi",
  },
  "explorer.dualTafsirTab": {
    en: "Dual Comparative Tafsir",
    ar: "مقارنة التفاسير (السنة والشيعة)",
    fa: "تفسیر تطبیقی (تشیع و تسنن)",
    id: "Tafsir Komparatif (Sunni & Syiah)",
  },
  "explorer.sunniTafsirsTab": {
    en: "Sunni Tafsirs",
    ar: "تفاسير أهل السنة",
    fa: "تفاسیر اهل سنت",
    id: "Tafsir Ahlussunnah",
  },
  "explorer.shiaTafsirsTab": {
    en: "Shia Tafsirs",
    ar: "تفاسير مدرسة أهل البيت",
    fa: "تفاسیر اهل بیت (ع)",
    id: "Tafsir Ahlulbait",
  },
  "explorer.aiReflectionTab": {
    en: "Contemplative Reflection",
    ar: "إضاءات وتدبر إيماني",
    fa: "تدبر و اشارات معرفتی",
    id: "Renungan & Tadabbur",
  },
  "explorer.playAyah": {
    en: "Listen to Ayah",
    ar: "استمع للآية",
    fa: "شنیدن صوت آیه",
    id: "Dengarkan Ayat",
  },
  "explorer.copyVerse": {
    en: "Copy Ayah",
    ar: "نسخ الآية",
    fa: "کپی آیه",
    id: "Salin Ayat",
  },
  "explorer.saveAyah": {
    en: "Save",
    ar: "حفظ",
    fa: "نشان کردن",
    id: "Simpan",
  },

  // Hadith Explorer
  "hadith.badge": {
    en: "Authentic Hadith Collections",
    ar: "مجموعات الأحاديث المعتمدة",
    fa: "مجموعه‌های حدیثی معتبر",
    id: "Koleksi Hadis Sahih & Autentik",
  },
  "hadith.title": {
    en: "Complete Authentic Hadith Library",
    ar: "موسوعة الأحاديث النبوية المعتمدة",
    fa: "کتابخانه کامل احادیث معتبر",
    id: "Perpustakaan Hadis Sahih Lengkap",
  },
  "hadith.subtitle": {
    en: "Explore complete authentic hadith books from Sunni and Shia traditions with Arabic text, English translations, primary citations, and classical scholarly gradings.",
    ar: "تصفح أمهات كتب الحديث الشريف المعتمدة من المدرستين السنية والشيعية بنصوصها العربية، وتخريجها، وتراجمها، وأحكام كبار المحدثين.",
    fa: "بررسی کتب جامع و معتبر حدیثی از هر دو مکتب اهل سنت و تشیع همراه با متن عربی، ترجمه، سند دقیق و اعتبارسنجی رجالی.",
    id: "Telusuri kitab-kitab hadis autentik dari tradisi Sunni dan Syiah lengkap dengan teks Arab, terjemahan, rujukan sanad, dan derajat kesahihan.",
  },
  "hadith.selectTradition": {
    en: "Select Tradition:",
    ar: "اختر المدرسة الحديثية:",
    fa: "انتخاب مکتب حدیثی:",
    id: "Pilih Mazhab/Tradisi:",
  },
  "hadith.sunniTradition": {
    en: "Sunni",
    ar: "أهل السنة والجماعة",
    fa: "اهل سنت و جماعت",
    id: "Ahlussunnah Wal Jama'ah",
  },
  "hadith.shiaTradition": {
    en: "Shia",
    ar: "الشيعة الإمامية",
    fa: "شیعه امامیه (اهل بیت)",
    id: "Syi'ah Imamiyyah",
  },
  "hadith.sunniDesc": {
    en: "Sahih al-Bukhari (7,563), Sahih Muslim (7,500), 40 Nawawi, 40 Qudsi, Tirmidhi, Abu Dawud, and Muwatta.",
    ar: "صحيح البخاري (٧,٥٦٣)، صحيح مسلم (٧,٥٠٠)، الأربعون النووية، الأربعون القدسية، والسنن المعتمدة.",
    fa: "صحیح بخاری (۷٬۵۶۳)، صحیح مسلم (۷٬۵۰۰)، اربعین نووی، ۴۰ حدیث قدسی و سنن معتبر.",
    id: "Sahih Bukhari (7.563), Sahih Muslim (7.500), Arbain Nawawi, 40 Hadis Qudsi, dan kitab sunan.",
  },
  "hadith.shiaDesc": {
    en: "Kitab al-Kafi (16,199 hadiths), Nahj al-Balagha, Al-Khisal, Thawab al-A'mal, and authenticated Shia compendiums.",
    ar: "الكافي للكليني (١٦,١٩٩ حديثاً)، نهج البلاغة، الخصال، ثواب الأعمال، والمصادر المعتمدة.",
    fa: "الکافی کلینی (۱۶٬۱۹۹ حدیث)، نهج‌البلاغه، الخصال، ثواب‌الأعمال و جوامع روایی اصیل.",
    id: "Kitab Al-Kafi (16.199 hadis), Nahjul Balaghah, Al-Khisal, Tsawab Al-A'mal, dan himpunan mu'tabar.",
  },
  "hadith.selectBook": {
    en: "Select Authentic Book:",
    ar: "اختر الكتاب المعتمد:",
    fa: "انتخاب کتاب معتبر:",
    id: "Pilih Kitab Autentik:",
  },
  "hadith.chapter": {
    en: "Chapter / Section:",
    ar: "الباب / الفصل:",
    fa: "باب / فصل:",
    id: "Bab / Bagian:",
  },
  "hadith.goToHadith": {
    en: "Go to Hadith #:",
    ar: "الانتقال إلى رقم الحديث:",
    fa: "شماره حدیث:",
    id: "Ke Hadis No:",
  },
  "hadith.jump": {
    en: "Jump",
    ar: "انتقال",
    fa: "برو",
    id: "Buka",
  },
  "hadith.searchPlaceholder": {
    en: "Search in hadiths by keyword, narrator, English or Arabic text...",
    ar: "ابحث في الأحاديث بالكلمة أو الراوي أو النص العربي أو الإنجليزي...",
    fa: "جستجو در احادیث با کلیدواژه، راوی، متن عربی یا ترجمه...",
    id: "Cari hadis berdasarkan kata kunci, perawi, teks Arab, atau terjemahan...",
  },
  "hadith.arabicFont": {
    en: "Arabic Font:",
    ar: "حجم الخط:",
    fa: "اندازه قلم عربی:",
    id: "Ukuran Font Arab:",
  },
  "hadith.showing": {
    en: "Showing",
    ar: "عرض",
    fa: "نمایش",
    id: "Menampilkan",
  },
  "hadith.of": {
    en: "of",
    ar: "من",
    fa: "از",
    id: "dari",
  },
  "hadith.hadiths": {
    en: "Hadiths",
    ar: "حديثاً",
    fa: "حدیث",
    id: "Hadis",
  },
  "hadith.resetFilters": {
    en: "Reset filters",
    ar: "إعادة ضبط البحث",
    fa: "تنظیم مجدد فیلترها",
    id: "Reset filter",
  },
  "hadith.translation": {
    en: "Translation",
    ar: "الترجمة والمعنى",
    fa: "ترجمه و مفهوم",
    id: "Terjemahan & Makna",
  },
  "hadith.scholarlyContext": {
    en: "Scholarly Context & Wisdom:",
    ar: "الفوائد والشروح والدروس المستفادة:",
    fa: "شرح، حکمت‌ها و نکات حدیثی:",
    id: "Konteks & Hikmah Pelajaran:",
  },
  "hadith.exactCitation": {
    en: "Exact Citation:",
    ar: "التخريج والإسناد:",
    fa: "منبع و استناد دقیق:",
    id: "Takhrij & Rujukan:",
  },
  "hadith.gradingAuthority": {
    en: "Grading Authority:",
    ar: "درجة الحديث وحكم العلماء:",
    fa: "ارزیابی و درجه اعتبار رجالی:",
    id: "Derajat Hadis & Pentahqiq:",
  },
  "hadith.copy": {
    en: "Copy",
    ar: "نسخ",
    fa: "کپی",
    id: "Salin",
  },
  "hadith.copied": {
    en: "Copied!",
    ar: "تم النسخ!",
    fa: "کپی شد!",
    id: "Disalin!",
  },
  "hadith.previous": {
    en: "Previous",
    ar: "السابق",
    fa: "قبلی",
    id: "Sebelumnya",
  },
  "hadith.next": {
    en: "Next",
    ar: "التالي",
    fa: "بعدی",
    id: "Berikutnya",
  },
  "hadith.page": {
    en: "Page",
    ar: "صفحة",
    fa: "صفحه",
    id: "Halaman",
  },
  "hadith.noResults": {
    en: "No Hadiths Found",
    ar: "لم يتم العثور على أحاديث",
    fa: "حدیثی یافت نشد",
    id: "Tidak ada hadis yang ditemukan",
  },

  // Audio Player
  "player.surah": {
    en: "Surah",
    ar: "سورة",
    fa: "سوره",
    id: "Surah",
  },
  "player.ayah": {
    en: "Ayah",
    ar: "الآية",
    fa: "آیه",
    id: "Ayat",
  },
  "player.fullSurah": {
    en: "Full Surah",
    ar: "سورة كاملة",
    fa: "سوره کامل",
    id: "Surah Lengkap",
  },
  "player.continuous": {
    en: "Continuous",
    ar: "تلاوة متواصلة",
    fa: "تلاوت پیوسته",
    id: "Berkelanjutan",
  },
  "player.verseByVerse": {
    en: "Ayah by Ayah",
    ar: "آية بآية",
    fa: "آیه به آیه",
    id: "Ayat per Ayat",
  },
  "player.reciter": {
    en: "Reciter",
    ar: "القارئ",
    fa: "قاری",
    id: "Qari",
  },
  "player.close": {
    en: "Close Player",
    ar: "إغلاق المشغل",
    fa: "بستن پخش‌کننده",
    id: "Tutup Pemutar",
  },
  "player.speed": {
    en: "Playback Speed",
    ar: "سرعة التلاوة",
    fa: "سرعت پخش",
    id: "Kecepatan Putar",
  },
  "player.play": {
    en: "Play",
    ar: "تشغيل",
    fa: "پخش",
    id: "Putar",
  },
  "player.pause": {
    en: "Pause",
    ar: "إيقاف مؤقت",
    fa: "توقف موقت",
    id: "Jeda",
  },
  "player.prevAyah": {
    en: "Previous Ayah",
    ar: "الآية السابقة",
    fa: "آیه قبلی",
    id: "Ayat Sebelumnya",
  },
  "player.nextAyah": {
    en: "Next Ayah",
    ar: "الآية التالية",
    fa: "آیه بعدی",
    id: "Ayat Berikutnya",
  },

  // Saved Drawer
  "saved.title": {
    en: "Saved Verses",
    ar: "الآيات المحفوظة",
    fa: "آیات نشان‌شده",
    id: "Ayat Tersimpan",
  },
  "saved.empty": {
    en: "No saved verses yet",
    ar: "لا توجد آيات محفوظة بعد",
    fa: "هنوز آیه‌ای نشان نشده است",
    id: "Belum ada ayat tersimpan",
  },
  "saved.emptyDesc": {
    en: "Tap the bookmark icon on any verse while reading or exploring to save it here for reflection.",
    ar: "اضغط على أيقونة الإشارة المرجعية بجانب أي آية أثناء القراءة لحفظها هنا والرجوع إليها لاحقاً.",
    fa: "با زدن دکمه نشان روی هر آیه در هنگام مطالعه یا تدبر، آن را برای بازخوانی و تدبر مجدد ذخیره کنید.",
    id: "Ketuk ikon penanda pada ayat saat membaca atau mentadabburi untuk menyimpannya di sini.",
  },
  "saved.filter": {
    en: "Search saved reflections...",
    ar: "ابحث في الآيات المحفوظة...",
    fa: "جستجو در آیات نشان‌شده...",
    id: "Cari renungan yang tersimpan...",
  },
  "saved.noMatches": {
    en: "No saved verses matching",
    ar: "لا توجد نتائج مطابقة لـ",
    fa: "آیه نشان‌شده‌ای منطبق بر این جستجو نیست",
    id: "Tidak ada ayat tersimpan yang cocok",
  },
  "saved.explore": {
    en: "Explore Tafsir",
    ar: "استكشاف التفسير",
    fa: "مشاهده تفسیر",
    id: "Buka Tafsir",
  },
  "saved.readSurah": {
    en: "Read Surah",
    ar: "قراءة السورة",
    fa: "خواندن در سوره",
    id: "Baca Surah",
  },
  "saved.remove": {
    en: "Remove from saved",
    ar: "حذف من المحفوظات",
    fa: "حذف از نشان‌شده‌ها",
    id: "Hapus dari tersimpan",
  },
  "saved.play": {
    en: "Play recitation",
    ar: "استمع للتلاوة",
    fa: "شنیدن قرائت",
    id: "Putar lantunan",
  },

  // Reciter Modal
  "reciter.title": {
    en: "Select Reciter (Qāriʾ)",
    ar: "اختيار القارئ",
    fa: "انتخاب قاری قرآن",
    id: "Pilih Qari",
  },
  "reciter.desc": {
    en: "Choose your preferred recitation voice & audio streams",
    ar: "اختر قارئك المفضل للاستماع إلى تلاوة آيات وسور القرآن الكريم",
    fa: "قاری مورد نظر خود را برای استماع آیات و سوره‌های قرآن انتخاب کنید",
    id: "Pilih qari favorit Anda untuk lantunan murottal ayat dan surah",
  },
  "reciter.active": {
    en: "Active",
    ar: "محدد حالياً",
    fa: "فعال",
    id: "Aktif",
  },
  "reciter.configure": {
    en: "Configure audio stream URLs",
    ar: "تعديل روابط الصوت",
    fa: "تنظیم آدرس صوتی",
    id: "Konfigurasi URL audio",
  },
  "reciter.cancel": {
    en: "Cancel",
    ar: "إلغاء",
    fa: "انصراف",
    id: "Batal",
  },
  "reciter.saveConfig": {
    en: "Save Configuration",
    ar: "حفظ التعديلات",
    fa: "ذخیره تنظیمات",
    id: "Simpan Konfigurasi",
  },
  "reciter.info": {
    en: "Sheikh Mishary Alafasy and Sheikh Yasser Al-Dossary are primary high-quality audio streams. You can customize audio stream URLs for any reciter.",
    ar: "الشيخ مشاري راشد العفاسي والشيخ ياسر الدوسري متوفران عبر شبكات البث السحابية المباشرة بجودة عالية.",
    fa: "شیخ مشاری راشد العفاسی و شیخ یاسر الدوسری با کیفیت صوتی عالی در دسترس هستند. امکان تغییر آدرس پخش صوتی نیز وجود دارد.",
    id: "Syaikh Misyari Rasyid Al-Afasy dan Syaikh Yasser Al-Dossary tersedia dengan kualitas audio tinggi. Anda juga dapat menyesuaikan URL siaran audio.",
  },
  "reader.on": {
    en: "On",
    ar: "مفعلة",
    fa: "روشن",
    id: "Aktif",
  },
  "reader.off": {
    en: "Off",
    ar: "معطلة",
    fa: "خاموش",
    id: "Nonaktif",
  },
  "reader.juz": {
    en: "Juz",
    ar: "الجزء",
    fa: "جزء",
    id: "Juz",
  },
  "reader.verses": {
    en: "Verses",
    ar: "آيات",
    fa: "آیه",
    id: "Ayat",
  },
  "reader.audioPlaying": {
    en: "Audio Playing",
    ar: "الصوت يعمل",
    fa: "صدا در حال پخش است",
    id: "Audio Sedang Diputar",
  },
  "explore.verse": {
    en: "Verse",
    ar: "آية",
    fa: "آیه",
    id: "Ayat",
  },
  "explore.phonetics": {
    en: "Phonetics",
    ar: "النطق الصوتي",
    fa: "تلفظ و آواشناسی",
    id: "Fonetik",
  },
  "explore.listen": {
    en: "Listen",
    ar: "استماع",
    fa: "شنیدن",
    id: "Dengarkan",
  },
  "explore.playing": {
    en: "Playing...",
    ar: "جارٍ الاستماع...",
    fa: "در حال پخش...",
    id: "Memutar...",
  },
  "explore.or": {
    en: "OR",
    ar: "أو",
    fa: "یا",
    id: "ATAU",
  },
  "explore.sunniTradition": {
    en: "Sunni Tradition",
    ar: "أهل السنة والجماعة",
    fa: "اهل سنت و جماعت",
    id: "Tradisi Ahlussunnah",
  },
  "explore.shiaTradition": {
    en: "Shia Tradition",
    ar: "مدرسة أهل البيت (الشيعة)",
    fa: "مکتب اهل بیت (ع)",
    id: "Tradisi Ahlulbait",
  },
  "explore.dualComparative": {
    en: "Dual Comparative View",
    ar: "المقارنة بين المدرستين",
    fa: "دیدگاه تطبیقی دو مکتب",
    id: "Tampilan Komparatif",
  },
  "explore.arabicClassicalTafsir": {
    en: "Arabic Classical Tafsir",
    ar: "التفسير الميسر (عربي)",
    fa: "تفسیر المیسر (عربی)",
    id: "Tafsir Klasik Arab",
  },
  "explore.authenticSourcesBadge": {
    en: "Authentic Classical Books & Scholars Only",
    ar: "تفاسير معتمدة من أمهات كتب التراث",
    fa: "تفاسیر اصیل از کتب و علمای معتبر تراث",
    id: "Hanya Kitab & Ulama Klasik Otoritatif",
  },
  "explore.classicalSourceWork": {
    en: "Classical Source Work:",
    ar: "المصدر التراثي المعتمد:",
    fa: "منبع معتبر تراثی:",
    id: "Kitab Rujukan Klasik:",
  },
  "explore.keyInsightsSunni": {
    en: "Key Sunni Insights & Exegetical Principles:",
    ar: "أهم الدلالات التفسيرية (أهل السنة والجماعة):",
    fa: "محورهای تفسیری (اهل سنت و جماعت):",
    id: "Intisari & Prinsip Tafsir Ahlussunnah:",
  },
  "explore.keyInsightsShia": {
    en: "Key Shia Insights & Exegetical Principles:",
    ar: "أهم الدلالات التفسيرية (الشيعة الإمامية):",
    fa: "محورهای تفسیری (مکتب اهل بیت علیهم‌السلام):",
    id: "Intisari & Prinsip Tafsir Ahlulbait:",
  },
  "explore.copied": {
    en: "Copied!",
    ar: "تم النسخ!",
    fa: "کپی شد!",
    id: "Disalin!",
  },
  "explore.copy": {
    en: "Copy",
    ar: "نسخ",
    fa: "کپی",
    id: "Salin",
  },
  "hadith.selectTraditionLabel": {
    en: "Select Tradition:",
    ar: "المدرسة والرواية:",
    fa: "انتخاب مکتب حدیثی:",
    id: "Pilih Tradisi / Mazhab:",
  },
  "hadith.bukhariMuslimTag": {
    en: "Sahih al-Bukhari & Sahih Muslim",
    ar: "صحيح البخاري ومسلم",
    fa: "صحیح بخاری و مسلم",
    id: "Sahih Bukhari & Muslim",
  },
  "hadith.kafiNahjTag": {
    en: "Kitab al-Kafi & Nahj al-Balagha",
    ar: "الكافي ونهج البلاغة",
    fa: "الکافی و نهج‌البلاغه",
    id: "Al-Kafi & Nahjul Balaghah",
  },
  "common.clear": {
    en: "Clear",
    ar: "مسح",
    fa: "پاک کردن",
    id: "Hapus",
  },
  "common.retry": {
    en: "Retry",
    ar: "إعادة المحاولة",
    fa: "تلاش دوباره",
    id: "Coba Lagi",
  },
};

export function getTranslation(key: string, lang: AppLanguage, fallback?: string): string {
  let item = translations[key];
  if (!item) {
    if (key.startsWith("explore.")) {
      item = translations[key.replace("explore.", "explorer.")];
    } else if (key.startsWith("explorer.")) {
      item = translations[key.replace("explorer.", "explore.")];
    }
  }
  if (!item) return fallback || key;
  return item[lang] || item["en"] || fallback || key;
}
