import { AppLanguage, HadithBookMetadata, ReciterConfig } from "../types";

export interface LocalizedBook {
  title: string;
  author: string;
  description: string;
}

export const BOOK_LOCALIZATIONS: Record<string, Record<AppLanguage, LocalizedBook>> = {
  bukhari: {
    en: {
      title: "Sahih al-Bukhari",
      author: "Imam Muhammad ibn Isma'il al-Bukhari (d. 256 AH)",
      description: "The most authentic book in Sunni Islam after the Holy Qur'an, compiled over 16 years with the strictest criteria of chain verification (isnad)."
    },
    ar: {
      title: "صحيح البخاري",
      author: "الإمام محمد بن إسماعيل البخاري (ت ٢٥٦ هـ)",
      description: "أصح كتاب بعد كتاب الله عز وجل عند أهل السنة والجماعة، جمعه الإمام البخاري على مدار ١٦ عاماً بأعلى معايير التوثيق."
    },
    fa: {
      title: "صحیح بخاری",
      author: "امام محمد بن اسماعیل بخاری (متوفای ۲۵۶ ق)",
      description: "معتبرترین کتاب حدیثی نزد اهل سنت پس از قرآن کریم، گردآوری شده در طول ۱۶ سال با دقیق‌ترین معیارهای بررسی اسناد."
    },
    id: {
      title: "Shahih Bukhari",
      author: "Imam Muhammad bin Isma'il al-Bukhari (w. 256 H)",
      description: "Kitab hadis paling sahih dalam tradisi Islam Sunni setelah Al-Qur'an, dihimpun selama 16 tahun dengan kriteria sanad paling ketat."
    }
  },
  muslim: {
    en: {
      title: "Sahih Muslim",
      author: "Imam Muslim ibn al-Hajjaj an-Naysaburi (d. 261 AH)",
      description: "The second pillar of the two Sahihs (as-Sahihayn), renowned for its rigorous isnad organization and thematic consistency."
    },
    ar: {
      title: "صحيح مسلم",
      author: "الإمام مسلم بن الحجاج النيسابوري (ت ٢٦١ هـ)",
      description: "الركن الثاني من الصحيحين، تميز بحسن الترتيب وسياق طرق الأحاديث في موضع واحد دون تقطيع."
    },
    fa: {
      title: "صحیح مسلم",
      author: "امام مسلم بن حجاج نیشابوری (متوفای ۲۶۱ ق)",
      description: "دومین ستون از صحیحین، مشهور به نظم دقیق در بیان اسناد و پیوستگی موضوعی روایات."
    },
    id: {
      title: "Shahih Muslim",
      author: "Imam Muslim bin al-Hajjaj an-Naisaburi (w. 261 H)",
      description: "Pilar kedua dari dua kitab Sahih (Shahihain), terkenal dengan keakuratan susunan sanad dan konsistensi tematik."
    }
  },
  nawawi: {
    en: {
      title: "Forty Hadith of an-Nawawi",
      author: "Imam Yahya ibn Sharaf an-Nawawi (d. 676 AH)",
      description: "The classical consensus collection of foundational authentic hadiths encapsulating the core pillars, ethics, and theology of Islam."
    },
    ar: {
      title: "الأربعون النووية",
      author: "الإمام يحيى بن شرف النووي (ت ٦٧٦ هـ)",
      description: "مجموعة جامعة لأصول الدين وقواعد الشريعة، متفق على قبولها واعتمادها عبر القرون."
    },
    fa: {
      title: "چهل حدیث نبوی (اربعین نووی)",
      author: "امام یحیی بن شرف نووی (متوفای ۶۷۶ ق)",
      description: "مجموعه‌ای جامع و مورد اجماع از احادیث اصیل دربرگیرنده اصول دین، اخلاق و معارف اسلامی."
    },
    id: {
      title: "Hadis Arbain An-Nawawi",
      author: "Imam Yahya bin Syaraf an-Nawawi (w. 676 H)",
      description: "Koleksi hadis pilihan yang merangkum pokok-pokok pilar, etika, dan keimanan dalam Islam."
    }
  },
  qudsi: {
    en: {
      title: "Forty Hadith Qudsi",
      author: "Prophetic Traditions with Direct Divine Revelation in Meaning",
      description: "Sacred hadiths wherein the Prophet Muhammad ﷺ recounts the direct Speech of Allah Almighty, highlighting divine mercy, love, and forgiveness."
    },
    ar: {
      title: "الأحاديث القدسية",
      author: "أحاديث نبوية وحي المعنى من الله جل وعلا",
      description: "أحاديث شريفة يرويها النبي ﷺ عن رب العزة جل وعلا، مفعمة بمعاني الرحمة الإلهية والمغفرة والرجاء."
    },
    fa: {
      title: "احادیث قدسی",
      author: "روایات نبوی با وحی مستقیم الهی در معانی",
      description: "احادیث قدسی که در آن پیامبر اکرم ﷺ کلام مستقیم خداوند متعال را پیرامون رحمت، گذشت و بخشش الهی نقل می‌فرمایند."
    },
    id: {
      title: "Hadis Qudsi",
      author: "Hadis Nabi dengan Makna Wahyu Langsung dari Allah",
      description: "Hadis suci di mana Nabi Muhammad ﷺ menyampaikan firman Allah mengenai rahmat, cinta, dan pengampunan ilahi."
    }
  },
  tirmidhi: {
    en: {
      title: "Jami` at-Tirmidhi",
      author: "Imam Abu 'Isa Muhammad at-Tirmidhi (d. 279 AH)",
      description: "Celebrated for its detailed comparative analysis of hadith authenticity and juristic consensus (fiqh) among the early scholars."
    },
    ar: {
      title: "جامع الترمذي",
      author: "الإمام أبو عيسى محمد الترمذي (ت ٢٧٩ هـ)",
      description: "جامع السنن المتميز ببيان درجات الحديث الفقهية ومذاهب الصحابة والتابعين."
    },
    fa: {
      title: "جامع ترمذی",
      author: "امام ابوعیسی محمد ترمذی (متوفای ۲۷۹ ق)",
      description: "مشهور به نقد و بررسی دقیق درجات صحت احادیث و آرای فقهی علمای سلف."
    },
    id: {
      title: "Jami' at-Tirmidzi",
      author: "Imam Abu 'Isa Muhammad at-Tirmidzi (w. 279 H)",
      description: "Terkenal dengan analisis komparatif autentisitas hadis dan konsensus fikih para ulama salaf."
    }
  },
  abudawud: {
    en: {
      title: "Sunan Abi Dawud",
      author: "Imam Abu Dawud as-Sijistani (d. 275 AH)",
      description: "The primary legal and ethical hadith repository in the Sunni tradition, focusing on judicial rulings and daily prophetic practice."
    },
    ar: {
      title: "سنن أبي داود",
      author: "الإمام أبو داود السجستاني (ت ٢٧٥ هـ)",
      description: "عمدة أحاديث الأحكام والسنن العملية الفقهية في التراث الإسلامي الأصيل."
    },
    fa: {
      title: "سنن ابوداود",
      author: "امام ابوداود سجستانی (متوفای ۲۷۵ ق)",
      description: "منبع اصلی احادیث فقهی و احکام عملی و سیره روزمره نبوی در سنت اسلامی."
    },
    id: {
      title: "Sunan Abu Dawud",
      author: "Imam Abu Dawud as-Sijistani (w. 275 H)",
      description: "Rujukan utama hadis hukum dan etika Islam yang berfokus pada ketetapan syariat dan amalan harian."
    }
  },
  kafi: {
    en: {
      title: "Kitab al-Kafi",
      author: "Thiqat al-Islam Shaykh Muhammad ibn Ya'qub al-Kulayni (d. 329 AH)",
      description: "The paramount canonical compendium of Shia hadith literature across all 8 volumes (Usul, Furu', and Rawda), compiled by Shaykh al-Kulayni."
    },
    ar: {
      title: "كتاب الكافي",
      author: "ثقة الإسلام الشيخ محمد بن يعقوب الكليني (ت ٣٢٩ هـ)",
      description: "أعظم الكتب الأربعة ومصدر الفقه والعقائد في تراث أهل البيت (ع)، جمعه الشيخ الكليني في ثمانية أجزاء (الأصول والفروع والروضة)."
    },
    fa: {
      title: "کتاب الکافی",
      author: "ثقة‌الاسلام شیخ محمد بن یعقوب کلینی (متوفای ۳۲۹ ق)",
      description: "جامع‌ترین و برجسته‌ترین کتاب از کتب اربعه شیعه در ۸ جلد (اصول، فروع و روضه)، اثر جاودان شیخ کلینی."
    },
    id: {
      title: "Kitab al-Kafi",
      author: "Tsiqah al-Islam Syaikh Muhammad bin Ya'qub al-Kulaini (w. 329 H)",
      description: "Kompilasi hadis kanonik paling utama dalam tradisi Syiah mencakup 8 jilid (Ushul, Furu', dan Raudhah) karya Syaikh Al-Kulaini."
    }
  },
  nahj: {
    en: {
      title: "Nahj al-Balagha",
      author: "Amir al-Mu'minin Ali ibn Abi Talib (asws), compiled by Sharif al-Radi (d. 406 AH)",
      description: "Peak of Eloquence: Sermons, letters, and profound wisdom of Amir al-Mu'minin Ali ibn Abi Talib (asws), compiled by Sharif al-Radi."
    },
    ar: {
      title: "نهج البلاغة",
      author: "أمير المؤمنين علي بن أبي طالب (ع)، جمعه الشريف الرضي (ت ٤٠٦ هـ)",
      description: "نهج البلاغة: قمة الفصاحة والحكمة، يضم خطب ورسائل ومواعظ الإمام علي بن أبي طالب (ع)."
    },
    fa: {
      title: "نهج‌البلاغه",
      author: "امیرالمؤمنین علی بن ابی‌طالب (ع)، گردآوری شریف رضی (متوفای ۴۰۶ ق)",
      description: "اوج فصاحت و بلاغت: خطبه‌ها، نامه‌ها و کلمات قصار نورانی حضرت امیرالمؤمنین علی بن ابی‌طالب (ع)."
    },
    id: {
      title: "Nahjul Balaghah",
      author: "Amirul Mukminin Ali bin Abi Thalib (as), dihimpun Syarif ar-Radhi (w. 406 H)",
      description: "Puncak Balaghah: Khotbah, surat-surat kenegaraan, dan mutiara hikmah agung Imam Ali bin Abi Thalib (as)."
    }
  },
  khisal: {
    en: {
      title: "Al-Khisal",
      author: "Shaykh al-Saduq Abu Ja'far Muhammad ibn Ali ibn Babawayh (d. 381 AH)",
      description: "Numbered virtues, moral qualities, and spiritual habits taught by the Prophet ﷺ and Ahl al-Bayt, compiled by Shaykh al-Saduq."
    },
    ar: {
      title: "الخصال",
      author: "الشيخ الصدوق أبو جعفر محمد بن علي بن بابويه القمي (ت ٣٨١ هـ)",
      description: "الخصال: كتاب جامع في الأخلاق والآداب والخصال المحمودة مرتبة على الأعداد، تأليف الشيخ الصدوق."
    },
    fa: {
      title: "الخصال",
      author: "شیخ صدوق ابو جعفر محمد بن علی بن بابویه قمی (متوفای ۳۸۱ ق)",
      description: "کتابی ارزشمند در بیان خصلت‌های پسندیده، فضایل اخلاقی و آداب زندگی بر اساس شمارش اعداد، اثر شیخ صدوق."
    },
    id: {
      title: "Al-Khisal",
      author: "Syaikh ash-Shaduq Abu Ja'far Muhammad bin Ali bin Babawayh (w. 381 H)",
      description: "Kitab himpunan etika luhur dan sifat terpuji yang dikelompokkan berdasarkan hitungan angka oleh Syaikh ash-Shaduq."
    }
  },
  thawab: {
    en: {
      title: "Thawab al-A'mal",
      author: "Shaykh al-Saduq Abu Ja'far Muhammad ibn Babawayh (d. 381 AH)",
      description: "The Rewards of Righteous Deeds and Warnings of Spiritual Accountability, compiled by Shaykh al-Saduq."
    },
    ar: {
      title: "ثواب الأعمال وعقاب الأعمال",
      author: "الشيخ الصدوق ابن بابويه القمي (ت ٣٨١ هـ)",
      description: "بيان ثواب الطاعات والأذكار وجزاء الأعمال الصالحة وعواقب السيئات، تأليف الشيخ الصدوق."
    },
    fa: {
      title: "ثواب‌الأعمال و عقاب‌الأعمال",
      author: "شیخ صدوق ابن بابویه قمی (متوفای ۳۸۱ ق)",
      description: "تبیین پاداش عبادات، اذکار و کردارهای نیک و پیامدهای معنوی نافرمانی‌ها، اثر شیخ صدوق."
    },
    id: {
      title: "Tsawabul A'mal",
      author: "Syaikh ash-Shaduq Ibnu Babawayh (w. 381 H)",
      description: "Pahala Amal Kebaikan dan Peringatan Pertanggungjawaban Ruhani atas Perbuatan oleh Syaikh ash-Shaduq."
    }
  },
  uyun: {
    en: {
      title: "'Uyun Akhbar al-Rida",
      author: "Shaykh al-Saduq Abu Ja'far Muhammad ibn Babawayh (d. 381 AH)",
      description: "Traditions, debates, and spiritual wisdom of Imam Ali ibn Musa al-Rida (asws), compiled by Shaykh al-Saduq."
    },
    ar: {
      title: "عيون أخبار الرضا",
      author: "الشيخ الصدوق ابن بابويه القمي (ت ٣٨١ هـ)",
      description: "مناظرات وروايات وسيرة الإمام علي بن موسى الرضا (ع) في العقائد والعلوم والأخلاق، تأليف الشيخ الصدوق."
    },
    fa: {
      title: "عیون اخبار الرضا",
      author: "شیخ صدوق ابن بابویه قمی (متوفای ۳۸۱ ق)",
      description: "روایات نورانی، مناظرات کلامی و حکمت‌های آموزنده امام علی بن موسی الرضا (ع)، اثر شیخ صدوق."
    },
    id: {
      title: "'Uyun Akhbar ar-Ridha",
      author: "Syaikh ash-Shaduq Ibnu Babawayh (w. 381 H)",
      description: "Tradisi, debat teologis, dan mutiara hikmah Imam Ali bin Musa ar-Ridha (as) karya Syaikh ash-Shaduq."
    }
  },
  "la-yahduruhu": {
    en: {
      title: "Man La Yahduruhu al-Faqih",
      author: "Shaykh al-Saduq Abu Ja'far Muhammad ibn Babawayh (d. 381 AH)",
      description: "For Him Who is Not in the Presence of a Jurist: Canonical reference of Shia jurisprudence and daily prophetic practice, by Shaykh al-Saduq."
    },
    ar: {
      title: "من لا يحضره الفقيه",
      author: "الشيخ الصدوق ابن بابويه القمي (ت ٣٨١ هـ)",
      description: "ثاني الكتب الأربعة المعتمدة في الفقه والأحكام والسنن النبوية المباركة، تأليف الشيخ الصدوق."
    },
    fa: {
      title: "من لا یحضره الفقیه",
      author: "شیخ صدوق ابن بابویه قمی (متوفای ۳۸۱ ق)",
      description: "دومین کتاب از کتب اربعه فقهی شیعه در احکام شرعی و سنن روزمره پیامبر و اهل‌بیت، اثر شیخ صدوق."
    },
    id: {
      title: "Man La Yahdhuruhul Faqih",
      author: "Syaikh ash-Shaduq Ibnu Babawayh (w. 381 H)",
      description: "Kitab rujukan fikih kanonik kedua mazhab Syiah sebagai panduan ibadah dan amalan praktis oleh Syaikh ash-Shaduq."
    }
  },
  mutabara: {
    en: {
      title: "Mu'jam al-Ahadith al-Mu'tabara",
      author: "Ayatollah Sheikh Muhammad Baqir al-Behbudi (d. 2015 CE)",
      description: "Compendium of Rigorously Authenticated Hadiths across Shia sources, verified by Ayatollah Sheikh Muhammad Baqir al-Behbudi."
    },
    ar: {
      title: "معجم الأحاديث المعتبرة",
      author: "المحقق آية الله الشيخ محمد باقر البهبودي (ت ٢٠١٥ م)",
      description: "استقصاء وتوثيق الروايات الصحيحة والمعتبرة سنداً في مصادر الحديث الشريف، للشيخ محمد باقر البهبودي."
    },
    fa: {
      title: "معجم الاحادیث المعتبره",
      author: "محقق و استاد شیخ محمدباقر بهبودی (متوفای ۱۳۹۳ ش)",
      description: "پژوهش و استخراج احادیث معتبر و صحیح‌السند از کتب کهن روایی، اثر ارزنده شیخ محمدباقر بهبودی."
    },
    id: {
      title: "Mu'jam al-Ahadits al-Mu'tabarah",
      author: "Ayatullah Syaikh Muhammad Baqir al-Behbudi (w. 2015 M)",
      description: "Kompilasi hadis dengan sanad terotentikasi paling ketat dari sumber-sumber primer Syiah oleh Syaikh Al-Behbudi."
    }
  }
};

export function getBookLocalized(book: HadithBookMetadata | null, lang: AppLanguage = "en"): LocalizedBook {
  if (!book) {
    return {
      title: "Hadith Collection",
      author: "Islamic Scholarship",
      description: "Authentic Prophetic Traditions"
    };
  }
  const loc = BOOK_LOCALIZATIONS[book.id]?.[lang];
  if (loc) return loc;

  return {
    title: lang === "ar" || lang === "fa" ? book.arabicTitle || book.title : book.title,
    author: book.author,
    description: book.description
  };
}

export function getQuickTopicLocalized(topic: string, lang: AppLanguage = "en"): string {
  const map: Record<string, Record<AppLanguage, string>> = {
    "Patience": { en: "Patience", ar: "الصبر", fa: "صبر و بردباری", id: "Sabar" },
    "Prayer": { en: "Prayer", ar: "الصلاة", fa: "نماز و عبادت", id: "Salat" },
    "Knowledge": { en: "Knowledge", ar: "طلب العلم", fa: "علم و دانش", id: "Menuntut Ilmu" },
    "Charity": { en: "Charity", ar: "الصدقة والإنفاق", fa: "صدقه و انفاق", id: "Sedekah" },
    "Parents": { en: "Parents", ar: "بر الوالدين", fa: "نیکی به والدین", id: "Berbakti Orang Tua" },
    "Repentance": { en: "Repentance", ar: "التوبة والاستغفار", fa: "توبه و استغفار", id: "Taubat" },
    "Justice": { en: "Justice", ar: "العدل والإنصاف", fa: "عدالت و انصاف", id: "Keadilan" },
    "Wisdom": { en: "Wisdom", ar: "الحكمة والموعظة", fa: "حکمت و دانایی", id: "Hikmah" },
    "Truth": { en: "Truthfulness", ar: "الصدق والأمانة", fa: "صداقت و راستی", id: "Kejujuran" }
  };
  return map[topic]?.[lang] || topic;
}
