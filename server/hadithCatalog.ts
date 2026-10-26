export interface BookInfo {
  id: string;
  tradition: "sunni" | "shia";
  title: string;
  arabicTitle: string;
  author: string;
  totalHadiths: number;
  totalSections: number;
  description: string;
  isMajorSix?: boolean;
  apiEditionEng?: string;
  apiEditionAra?: string;
}

export interface SectionInfo {
  id: string;
  number: number;
  title: string;
  arabicTitle?: string;
  hadithCount?: number;
  firstHadithNumber?: number;
  lastHadithNumber?: number;
}

export const HADITH_BOOKS: BookInfo[] = [
  // ----------------- SUNNI CANONICAL COLLECTIONS -----------------
  {
    id: "bukhari",
    tradition: "sunni",
    title: "Sahih al-Bukhari",
    arabicTitle: "صَحِيحُ الْبُخَارِيّ",
    author: "Imam Muhammad ibn Isma'il al-Bukhari (d. 256 AH)",
    totalHadiths: 7563,
    totalSections: 97,
    description: "The most authentic book in Sunni Islam after the Holy Qur'an, compiled over 16 years with the strictest criteria of chain verification (isnad).",
    isMajorSix: true,
    apiEditionEng: "eng-bukhari",
    apiEditionAra: "ara-bukhari",
  },
  {
    id: "muslim",
    tradition: "sunni",
    title: "Sahih Muslim",
    arabicTitle: "صَحِيحُ مُسْلِم",
    author: "Imam Muslim ibn al-Hajjaj an-Naysaburi (d. 261 AH)",
    totalHadiths: 7500,
    totalSections: 56,
    description: "The second pillar of the two Sahihs (as-Sahihayn), renowned for its rigorous isnad organization and thematic consistency.",
    isMajorSix: true,
    apiEditionEng: "eng-muslim",
    apiEditionAra: "ara-muslim",
  },
  {
    id: "nawawi",
    tradition: "sunni",
    title: "Forty Hadith of an-Nawawi",
    arabicTitle: "الأَرْبَعُونَ النَّوَوِيَّة",
    author: "Imam Yahya ibn Sharaf an-Nawawi (d. 676 AH)",
    totalHadiths: 42,
    totalSections: 1,
    description: "The classical consensus collection of foundational, comprehensive authentic hadiths encapsulating the core pillars, ethics, and theology of Islam.",
    apiEditionEng: "eng-nawawi",
    apiEditionAra: "ara-nawawi",
  },
  {
    id: "qudsi",
    tradition: "sunni",
    title: "Forty Hadith Qudsi",
    arabicTitle: "الأَحَادِيثُ الْقُدْسِيَّة",
    author: "Prophetic Traditions with Direct Divine Revelation in Meaning",
    totalHadiths: 40,
    totalSections: 1,
    description: "Sacred hadiths wherein the Prophet Muhammad ﷺ recounts the direct Speech of Allah Almighty, highlighting divine mercy, love, and forgiveness.",
    apiEditionEng: "eng-qudsi",
    apiEditionAra: "ara-qudsi",
  },
  {
    id: "tirmidhi",
    tradition: "sunni",
    title: "Jami` at-Tirmidhi",
    arabicTitle: "جَامِعُ التِّرْمِذِيّ",
    author: "Imam Abu 'Isa Muhammad at-Tirmidhi (d. 279 AH)",
    totalHadiths: 3956,
    totalSections: 50,
    description: "Celebrated for its detailed comparative analysis of hadith authenticity and juristic consensus (fiqh) among the early scholars.",
    isMajorSix: true,
    apiEditionEng: "eng-tirmidhi",
    apiEditionAra: "ara-tirmidhi",
  },
  {
    id: "abudawud",
    tradition: "sunni",
    title: "Sunan Abi Dawud",
    arabicTitle: "سُنَنُ أَبِي دَاوُد",
    author: "Imam Abu Dawud as-Sijistani (d. 275 AH)",
    totalHadiths: 5274,
    totalSections: 43,
    description: "The primary legal and ethical hadith repository in the Sunni tradition, focusing on judicial rulings and daily prophetic practice.",
    isMajorSix: true,
    apiEditionEng: "eng-abudawud",
    apiEditionAra: "ara-abudawud",
  },
  {
    id: "nasai",
    tradition: "sunni",
    title: "Sunan an-Nasa'i (Al-Mujtaba)",
    arabicTitle: "سُنَنُ النَّسَائِيّ",
    author: "Imam Ahmad ibn Shu'ayb an-Nasa'i (d. 303 AH)",
    totalHadiths: 5758,
    totalSections: 52,
    description: "Noted by classical scholars for having the fewest weak narrations among the four Sunan collections, with meticulous textual scrutiny.",
    isMajorSix: true,
    apiEditionEng: "eng-nasai",
    apiEditionAra: "ara-nasai",
  },
  {
    id: "ibnmajah",
    tradition: "sunni",
    title: "Sunan Ibn Majah",
    arabicTitle: "سُنَنُ ابْنِ مَاجَه",
    author: "Imam Muhammad ibn Yazid Ibn Majah (d. 273 AH)",
    totalHadiths: 4341,
    totalSections: 37,
    description: "One of the Six Books (al-Kutub al-Sittah), containing essential legal narrations and unique prophetic traditions with authentic grading notes.",
    isMajorSix: true,
    apiEditionEng: "eng-ibnmajah",
    apiEditionAra: "ara-ibnmajah",
  },
  {
    id: "malik",
    tradition: "sunni",
    title: "Muwatta Imam Malik",
    arabicTitle: "مُوَطَّأُ الإِمَامِ مَالِك",
    author: "Imam Malik ibn Anas (d. 179 AH)",
    totalHadiths: 1858,
    totalSections: 61,
    description: "One of the earliest compiled books of Islamic law and prophetic traditions, recording the living practice of the people of Medina.",
    apiEditionEng: "eng-malik",
    apiEditionAra: "ara-malik",
  },

  // ----------------- SHIA CANONICAL COLLECTIONS -----------------
  {
    id: "kafi",
    tradition: "shia",
    title: "Kitab al-Kafi",
    arabicTitle: "كِتَابُ الْكَافِي (أصول وفروع الكافي)",
    author: "Thiqat al-Islam Shaykh Muhammad ibn Ya'qub al-Kulayni (d. 329 AH)",
    totalHadiths: 16199,
    totalSections: 34,
    description: "The paramount and most comprehensive of the Shia Four Books (Al-Kutub Al-Arba'a). Graded into Sahih, Muwaththaq, and Hasan by Allamah al-Majlisi in Mir'at al-Uqul.",
  },
  {
    id: "nahj",
    tradition: "shia",
    title: "Nahj al-Balagha (Peak of Eloquence)",
    arabicTitle: "نَهْجُ الْبَلَاغَة",
    author: "Sharif al-Radi (Compiling Imam Ali ibn Abi Talib, d. 406 AH)",
    totalHadiths: 809,
    totalSections: 3,
    description: "The celebrated masterwork preserving the sublime sermons (Khutab), letters of state (Rasa'il), and philosophical maxims (Hikam) of Amir al-Mu'minin Imam Ali.",
  },
  {
    id: "khisal",
    tradition: "shia",
    title: "Al-Khisal (The Character Traits)",
    arabicTitle: "الخِصَال",
    author: "Shaykh as-Saduq (Abu Ja'far Muhammad ibn Ali ibn Babawayh, d. 381 AH)",
    totalHadiths: 1255,
    totalSections: 26,
    description: "A monumental classical compendium structuring prophetic and Ahl al-Bayt traditions numerically according to moral qualities and spiritual stations.",
  },
  {
    id: "thawab",
    tradition: "shia",
    title: "Thawab al-A'mal wa 'Iqab al-A'mal",
    arabicTitle: "ثَوَابُ الأَعْمَالِ وَعِقَابُ الأَعْمَال",
    author: "Shaykh as-Saduq (d. 381 AH)",
    totalHadiths: 775,
    totalSections: 12,
    description: "Foundational collection on the spiritual fruits of noble actions and ethical accountability according to the Prophet ﷺ and the Holy Imams.",
  },
  {
    id: "uyun",
    tradition: "shia",
    title: "'Uyun Akhbar al-Rida",
    arabicTitle: "عُيُونُ أَخْبَارِ الرِّضَا",
    author: "Shaykh as-Saduq (d. 381 AH)",
    totalHadiths: 923,
    totalSections: 69,
    description: "Authentic theological discourses, interfaith debates, and moral teachings of the 8th Imam, Ali ibn Musa ar-Rida.",
  },
  {
    id: "faqih",
    tradition: "shia",
    title: "Man La Yahduruhu al-Faqih",
    arabicTitle: "مَنْ لَا يَحْضُرُهُ الْفَقِيه",
    author: "Shaykh as-Saduq (d. 381 AH)",
    totalHadiths: 5963,
    totalSections: 22,
    description: "One of the canonical Four Books (Al-Kutub Al-Arba'a) of Shia jurisprudence, curated for reliable practice with scholarly isnad references.",
  },
  {
    id: "mutabara",
    tradition: "shia",
    title: "Mu'jam al-Ahadith al-Mu'tabara",
    arabicTitle: "مُعْجَمُ الأَحَادِيثِ الْمُعْتَبَرَة",
    author: "Grand Ayatollah Muhammad Asif al-Muhsini (d. 1441 AH / 2019 CE)",
    totalHadiths: 3200,
    totalSections: 15,
    description: "Modern authoritative critical compendium containing strictly authenticated (Sahih and Mu'tabar) narrations across all classical Shia hadith literature.",
  },
];

// Pre-compiled sections for major books
export const SECTIONS_MAP: Record<string, SectionInfo[]> = {
  bukhari: [
    { id: "1", number: 1, title: "Revelation (Bad' al-Wahy)", hadithCount: 7, firstHadithNumber: 1, lastHadithNumber: 7 },
    { id: "2", number: 2, title: "Belief (Al-Iman)", hadithCount: 51, firstHadithNumber: 8, lastHadithNumber: 58 },
    { id: "3", number: 3, title: "Knowledge (Al-'Ilm)", hadithCount: 76, firstHadithNumber: 59, lastHadithNumber: 134 },
    { id: "4", number: 4, title: "Ablutions (Wudu')", hadithCount: 114, firstHadithNumber: 135, lastHadithNumber: 248 },
    { id: "5", number: 5, title: "Bathing (Ghusl)", hadithCount: 45, firstHadithNumber: 249, lastHadithNumber: 293 },
    { id: "6", number: 6, title: "Menstrual Periods", hadithCount: 40, firstHadithNumber: 294, lastHadithNumber: 333 },
    { id: "7", number: 7, title: "Tayammum (Dust Purification)", hadithCount: 15, firstHadithNumber: 334, lastHadithNumber: 348 },
    { id: "8", number: 8, title: "Prayers (As-Salat)", hadithCount: 153, firstHadithNumber: 349, lastHadithNumber: 501 },
    { id: "9", number: 9, title: "Times of the Prayers", hadithCount: 104, firstHadithNumber: 502, lastHadithNumber: 605 },
    { id: "10", number: 10, title: "Call to Prayers (Adhan)", hadithCount: 169, firstHadithNumber: 606, lastHadithNumber: 774 },
    { id: "11", number: 11, title: "Friday Prayer (Jumu'ah)", hadithCount: 65, firstHadithNumber: 775, lastHadithNumber: 839 },
    { id: "24", number: 24, title: "Obligatory Charity (Zakat)", hadithCount: 116, firstHadithNumber: 1395, lastHadithNumber: 1510 },
    { id: "30", number: 30, title: "Fasting (As-Sawm)", hadithCount: 115, firstHadithNumber: 1891, lastHadithNumber: 2005 },
    { id: "34", number: 34, title: "Sales and Trade (Buyu')", hadithCount: 172, firstHadithNumber: 2047, lastHadithNumber: 2218 },
    { id: "67", number: 67, title: "Wedlock and Marriage (Nikah)", hadithCount: 165, firstHadithNumber: 5063, lastHadithNumber: 5227 },
    { id: "78", number: 78, title: "Good Manners and Ethics (Al-Adab)", hadithCount: 256, firstHadithNumber: 5970, lastHadithNumber: 6225 },
    { id: "80", number: 80, title: "Invocations & Supplications (Ad-Da'awat)", hadithCount: 125, firstHadithNumber: 6304, lastHadithNumber: 6428 },
    { id: "81", number: 81, title: "Heart-Melting Traditions (Ar-Riqaq)", hadithCount: 170, firstHadithNumber: 6429, lastHadithNumber: 6598 },
    { id: "96", number: 96, title: "Holding Fast to the Quran & Sunnah", hadithCount: 94, firstHadithNumber: 7268, lastHadithNumber: 7361 },
    { id: "97", number: 97, title: "Oneness of Allah (Tawheed)", hadithCount: 202, firstHadithNumber: 7362, lastHadithNumber: 7563 },
  ],
  muslim: [
    { id: "1", number: 1, title: "The Book of Faith (Al-Iman)", hadithCount: 442, firstHadithNumber: 93, lastHadithNumber: 534 },
    { id: "2", number: 2, title: "The Book of Purification (At-Taharah)", hadithCount: 139, firstHadithNumber: 535, lastHadithNumber: 673 },
    { id: "4", number: 4, title: "The Book of Prayers (As-Salat)", hadithCount: 300, firstHadithNumber: 837, lastHadithNumber: 1136 },
    { id: "5", number: 5, title: "The Book of Mosques & Places of Prayer", hadithCount: 395, firstHadithNumber: 1137, lastHadithNumber: 1531 },
    { id: "12", number: 12, title: "The Book of Zakat (Charity)", hadithCount: 228, firstHadithNumber: 2263, lastHadithNumber: 2490 },
    { id: "13", number: 13, title: "The Book of Fasting (As-Sawm)", hadithCount: 297, firstHadithNumber: 2491, lastHadithNumber: 2787 },
    { id: "15", number: 15, title: "The Book of Pilgrimage (Hajj)", hadithCount: 569, firstHadithNumber: 2804, lastHadithNumber: 3372 },
    { id: "16", number: 16, title: "The Book of Marriage (Nikah)", hadithCount: 172, firstHadithNumber: 3373, lastHadithNumber: 3544 },
    { id: "32", number: 32, title: "The Book of Jihad and Expeditions", hadithCount: 180, firstHadithNumber: 4519, lastHadithNumber: 4698 },
    { id: "43", number: 43, title: "The Book of Virtues (Al-Fada'il)", hadithCount: 170, firstHadithNumber: 5862, lastHadithNumber: 6031 },
    { id: "45", number: 45, title: "Virtue, Good Manners & Kinship", hadithCount: 215, firstHadithNumber: 6500, lastHadithNumber: 6714 },
    { id: "48", number: 48, title: "Remembrance, Supplication & Repentance", hadithCount: 137, firstHadithNumber: 6805, lastHadithNumber: 6941 },
    { id: "53", number: 53, title: "Paradise, its Description & Blessings", hadithCount: 96, firstHadithNumber: 7124, lastHadithNumber: 7219 },
  ],
  nawawi: [
    { id: "1", number: 1, title: "Complete 40 Hadith of an-Nawawi (1 - 42)", hadithCount: 42, firstHadithNumber: 1, lastHadithNumber: 42 }
  ],
  qudsi: [
    { id: "1", number: 1, title: "Complete 40 Hadith Qudsi (1 - 40)", hadithCount: 40, firstHadithNumber: 1, lastHadithNumber: 40 }
  ],
  kafi: [
    { id: "1", number: 1, title: "Book of Intellect & Ignorance (كِتَابُ الْعَقْلِ وَ الْجَهْلِ)", hadithCount: 36, firstHadithNumber: 1, lastHadithNumber: 36 },
    { id: "2", number: 2, title: "Book of Excellence of Knowledge (كِتَابُ فَضْلِ الْعِلْمِ)", hadithCount: 176, firstHadithNumber: 1, lastHadithNumber: 176 },
    { id: "3", number: 3, title: "Book of Divine Unity / Tawhid (كِتَابُ التَّوْحِيدِ)", hadithCount: 67, firstHadithNumber: 1, lastHadithNumber: 67 },
    { id: "4", number: 4, title: "Book of Divine Proof / Hujjah (كِتَابُ الْحُجَّةِ)", hadithCount: 1015, firstHadithNumber: 1, lastHadithNumber: 1015 },
    { id: "5", number: 5, title: "Book of Faith & Disbelief (كِتَابُ الإِيمَانِ وَ الْكُفْرِ)", hadithCount: 1609, firstHadithNumber: 1, lastHadithNumber: 1609 },
    { id: "6", number: 6, title: "Book of Supplication (كِتَابُ الدُّعَاءِ)", hadithCount: 409, firstHadithNumber: 1, lastHadithNumber: 409 },
    { id: "7", number: 7, title: "Book of Excellence of the Quran (كِتَابُ فَضْلِ الْقُرْآنِ)", hadithCount: 124, firstHadithNumber: 1, lastHadithNumber: 124 },
    { id: "8", number: 8, title: "Book of Social Relations & Manners (كِتَابُ الْعِشْرَةِ)", hadithCount: 107, firstHadithNumber: 1, lastHadithNumber: 107 },
    { id: "9", number: 9, title: "Furu' al-Kafi: Taharah (Purification)", hadithCount: 220, firstHadithNumber: 1, lastHadithNumber: 220 },
    { id: "10", number: 10, title: "Furu' al-Kafi: As-Salat (Prayer)", hadithCount: 450, firstHadithNumber: 1, lastHadithNumber: 450 },
    { id: "11", number: 11, title: "Furu' al-Kafi: As-Sawm (Fasting)", hadithCount: 190, firstHadithNumber: 1, lastHadithNumber: 190 },
    { id: "12", number: 12, title: "Furu' al-Kafi: Living & Ethics (Al-Ma'ishah)", hadithCount: 380, firstHadithNumber: 1, lastHadithNumber: 380 },
  ],
  nahj: [
    { id: "1", number: 1, title: "Sermons of Amir al-Mu'minin (Khutab, 1 - 241)", hadithCount: 241, firstHadithNumber: 1, lastHadithNumber: 241 },
    { id: "2", number: 2, title: "Letters & Directives (Rasa'il & Kutub, 1 - 79)", hadithCount: 79, firstHadithNumber: 1, lastHadithNumber: 79 },
    { id: "3", number: 3, title: "Wisdom Sayings & Short Maxims (Qisar al-Hikam, 1 - 489)", hadithCount: 489, firstHadithNumber: 1, lastHadithNumber: 489 },
  ],
  khisal: [
    { id: "1", number: 1, title: "Single Traits & Virtues (Bab al-Wahid)", hadithCount: 50, firstHadithNumber: 1, lastHadithNumber: 50 },
    { id: "2", number: 2, title: "Pairs of Moral Qualities (Bab al-Ithnayn)", hadithCount: 65, firstHadithNumber: 1, lastHadithNumber: 65 },
    { id: "3", number: 3, title: "Triplets of Virtues (Bab al-Thalathah)", hadithCount: 140, firstHadithNumber: 1, lastHadithNumber: 140 },
    { id: "4", number: 4, title: "Quartets of Excellence (Bab al-Arba'ah)", hadithCount: 88, firstHadithNumber: 1, lastHadithNumber: 88 },
    { id: "5", number: 5, title: "Quintets and Higher Ranks (Bab al-Khamsah+)", hadithCount: 210, firstHadithNumber: 1, lastHadithNumber: 210 },
  ],
  thawab: [
    { id: "1", number: 1, title: "Virtues of Tawhid and Faith", hadithCount: 75, firstHadithNumber: 1, lastHadithNumber: 75 },
    { id: "2", number: 2, title: "Rewards of Prayers and Fasting", hadithCount: 120, firstHadithNumber: 1, lastHadithNumber: 120 },
    { id: "3", number: 3, title: "Rewards of Good Character & Kinship", hadithCount: 95, firstHadithNumber: 1, lastHadithNumber: 95 },
    { id: "4", number: 4, title: "Accountability and Consequences ('Iqab)", hadithCount: 110, firstHadithNumber: 1, lastHadithNumber: 110 },
  ],
};
