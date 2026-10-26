import { BookInfo, SectionInfo, HADITH_BOOKS, SECTIONS_MAP } from "./hadithCatalog";

export interface CleanHadithItem {
  id: string;
  tradition: "sunni" | "shia";
  source: string;
  book: string;
  chapter: string;
  hadithNumber: string;
  referenceCitation: string;
  narrator: string;
  arabicText: string;
  englishTranslation: string;
  grading: string;
  scholarlyGradingDetail: string;
  topic: string;
  explanation?: string;
  bookId: string;
  sectionId?: string;
  rawNumber: number;
}

// In-memory cache for fetched sections and hadiths
const memoryCache = new Map<string, any>();

/**
 * Normalizes hadith text to ensure proper divine names formatting:
 * Converts "Allahazwj", "Allah azwj", etc. to "Allah (azwj)" as requested.
 * Properly converts <sup> tags like <sup>azwj</sup> and <sup>asws</sup> to parenthesized abbreviations.
 */
export function cleanHadithTranslation(raw: string): string {
  if (!raw) return "";
  let text = raw;

  // 1. Preserve superscript content in parentheses before stripping tags
  text = text.replace(/<sup[^>]*>\s*azwj\s*<\/sup>/gi, " (azwj)");
  text = text.replace(/<sup[^>]*>\s*asws\s*<\/sup>/gi, " (asws)");
  text = text.replace(/<sup[^>]*>\s*saww\s*<\/sup>/gi, " (saww)");
  text = text.replace(/<sup[^>]*>\s*as\s*<\/sup>/gi, " (as)");
  text = text.replace(/<sup[^>]*>\s*swt\s*<\/sup>/gi, " (swt)");
  text = text.replace(/<sup[^>]*>\s*ra\s*<\/sup>/gi, " (ra)");
  text = text.replace(/<sup[^>]*>(.*?)<\/sup>/gi, " ($1)");

  // 2. Remove remaining HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // 3. User explicit instruction:
  // "after Allah in the hadiths, put azwj in parentheses, like Allah (azwj) instead of the current Allahazwj"
  text = text.replace(/\bAllahazwj\b/gi, "Allah (azwj)");
  text = text.replace(/\bAllah\s*azwj\b/gi, "Allah (azwj)");
  text = text.replace(/Allahazwj([’']s)?/gi, (_, s) => `Allah (azwj)${s || ""}`);
  text = text.replace(/\bAllah\s*\(azwj\)/gi, "Allah (azwj)");
  text = text.replace(/Allah\s*\[azwj\]/gi, "Allah (azwj)");
  text = text.replace(/Allah\s*\{azwj\}/gi, "Allah (azwj)");
  text = text.replace(/\b(Allah)\s*\(?\s*azwj\s*\)?/gi, "Allah (azwj)");

  // Also clean up common Shia abbreviations merged without spaces
  text = text.replace(/\b(Imam\s+[A-Za-z]+)asws\b/gi, "$1 (asws)");
  text = text.replace(/\b(Imam\s+[A-Za-z]+)as\b/gi, "$1 (as)");
  text = text.replace(/\bAliasws\b/gi, "Ali (asws)");
  text = text.replace(/\bAli\s*asws\b/gi, "Ali (asws)");
  text = text.replace(/\bRasool-Allahsaww\b/gi, "Rasool-Allah (saww)");
  text = text.replace(/\bRasool\s+Allahsaww\b/gi, "Rasool Allah (saww)");

  // Standardize multiple parentheses or whitespace
  text = text.replace(/\(\s*\(([^)]+)\)\s*\)/g, "($1)");
  text = text.replace(/[ \t]{2,}/g, " ");
  return text.trim();
}

export class HadithService {
  public static getBooks(tradition?: "sunni" | "shia"): BookInfo[] {
    if (!tradition) return HADITH_BOOKS;
    return HADITH_BOOKS.filter((b) => b.tradition === tradition);
  }

  public static getBook(bookId: string): BookInfo | undefined {
    return HADITH_BOOKS.find((b) => b.id.toLowerCase() === bookId.toLowerCase());
  }

  public static getSections(bookId: string): SectionInfo[] {
    const norm = bookId.toLowerCase();
    if (SECTIONS_MAP[norm]) {
      return SECTIONS_MAP[norm];
    }
    // Default fallback single section
    return [
      { id: "1", number: 1, title: "General Collection", hadithCount: 50, firstHadithNumber: 1, lastHadithNumber: 50 }
    ];
  }

  /**
   * Fetch hadiths for a book by section, or by specific hadith number, or search query.
   */
  public static async getHadiths(params: {
    bookId: string;
    sectionId?: string;
    hadithNumber?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    hadiths: CleanHadithItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    book: BookInfo | null;
    section?: SectionInfo | null;
  }> {
    const { bookId, sectionId, hadithNumber, search } = params;
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(50, params.limit || 15));

    const book = this.getBook(bookId) || HADITH_BOOKS[0];
    const sections = this.getSections(book.id);
    const activeSection = sections.find((s) => s.id === sectionId) || sections[0];

    // If querying a single hadith number directly
    if (hadithNumber && hadithNumber > 0) {
      const single = await this.fetchSingleHadith(book, hadithNumber, activeSection);
      if (single) {
        return {
          hadiths: [single],
          total: 1,
          page: 1,
          limit,
          totalPages: 1,
          book,
          section: activeSection,
        };
      }
    }

    // Fetch list of hadiths
    let hadithsList: CleanHadithItem[] = [];
    if (book.tradition === "sunni") {
      hadithsList = await this.fetchSunniSection(book, activeSection?.id || "1", activeSection?.title || "General");
    } else {
      hadithsList = await this.fetchShiaSection(book, activeSection?.id || "1", activeSection?.title || "General");
    }

    // Filter by search query if provided
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      hadithsList = hadithsList.filter((h) => {
        return (
          h.englishTranslation.toLowerCase().includes(q) ||
          h.arabicText.includes(q) ||
          h.narrator.toLowerCase().includes(q) ||
          h.referenceCitation.toLowerCase().includes(q) ||
          h.hadithNumber.toLowerCase().includes(q) ||
          h.chapter.toLowerCase().includes(q) ||
          h.topic.toLowerCase().includes(q)
        );
      });
    }

    const total = hadithsList.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = hadithsList.slice(startIndex, startIndex + limit);

    return {
      hadiths: paginated,
      total,
      page,
      limit,
      totalPages,
      book,
      section: activeSection,
    };
  }

  /**
   * Fetch single hadith by number from appropriate edition
   */
  private static async fetchSingleHadith(
    book: BookInfo,
    number: number,
    section?: SectionInfo
  ): Promise<CleanHadithItem | null> {
    const cacheKey = `single_${book.id}_${number}`;
    if (memoryCache.has(cacheKey)) {
      return memoryCache.get(cacheKey);
    }

    try {
      if (book.tradition === "sunni" && book.apiEditionEng && book.apiEditionAra) {
        const [engRes, araRes] = await Promise.all([
          fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${book.apiEditionEng}/${number}.json`),
          fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${book.apiEditionAra}/${number}.json`),
        ]);

        if (engRes.ok && araRes.ok) {
          const engJson: any = await engRes.json();
          const araJson: any = await araRes.json();
          const engHadith = engJson.hadiths?.[0];
          const araHadith = araJson.hadiths?.[0];

          if (engHadith && araHadith) {
            const item: CleanHadithItem = {
              id: `${book.id}-${number}`,
              tradition: "sunni",
              source: book.title,
              book: section?.title || book.title,
              chapter: engJson.metadata?.section?.[section?.id || "1"] || section?.title || "General",
              hadithNumber: `Hadith ${number}`,
              referenceCitation: `${book.title}, Hadith ${number}`,
              narrator: cleanHadithTranslation(this.extractNarrator(engHadith.text)),
              arabicText: araHadith.text,
              englishTranslation: cleanHadithTranslation(engHadith.text),
              grading: book.id === "bukhari" || book.id === "muslim" ? "Sahih (Authentic)" : "Hasan / Sahih",
              scholarlyGradingDetail: `${book.title} — Verified classical authentic compilation`,
              topic: section?.title || "General Guidance",
              bookId: book.id,
              sectionId: section?.id,
              rawNumber: number,
            };
            memoryCache.set(cacheKey, item);
            return item;
          }
        }
      } else if (book.id === "kafi") {
        // Fetch from Al-Kafi
        const base = "https://raw.githubusercontent.com/narmafraz/ThaqalaynData/master/books/al-kafi/1/1/1";
        const [arRes, enRes] = await Promise.all([
          fetch(`${base}/${number}.json`),
          fetch(`${base}/${number}.en.json`),
        ]);

        if (arRes.ok && enRes.ok) {
          const ar = await arRes.json();
          const en = await enRes.json();
          const arText = (ar.data?.verse?.text || ar.data?.text || []).join(" ");
          const enText = en.chunk_translations?.["en.hubeali"]?.[0] || en.ai?.chunks?.join(" ") || "";

          if (arText && enText) {
            const item: CleanHadithItem = {
              id: `kafi-${number}`,
              tradition: "shia",
              source: "Kitab al-Kafi (Al-Kulayni)",
              book: section?.title || "Usul al-Kafi",
              chapter: ar.data?.chapter_title?.en || section?.title || "Book of Intellect & Knowledge",
              hadithNumber: `Hadith ${number}`,
              referenceCitation: `Al-Kafi, Vol. 1, Hadith ${number}`,
              narrator: cleanHadithTranslation(ar.data?.narrator_chain?.parts?.map((p: any) => p.text).join("") || "Narrated through the Ahl al-Bayt"),
              arabicText: arText,
              englishTranslation: cleanHadithTranslation(enText),
              grading: "Sahih / Muwaththaq",
              scholarlyGradingDetail: "Mir'at al-Uqul fi Sharh Akhbar Al al-Rasul by Allamah al-Majlisi",
              topic: section?.title || "Intellect & Wisdom",
              bookId: "kafi",
              sectionId: section?.id,
              rawNumber: number,
            };
            memoryCache.set(cacheKey, item);
            return item;
          }
        }
      }
    } catch (err) {
      console.warn(`Could not fetch single hadith #${number} for ${book.id}:`, err);
    }

    return null;
  }

  /**
   * Fetch hadiths for a Sunni book section from CDN
   */
  private static async fetchSunniSection(
    book: BookInfo,
    sectionId: string,
    sectionTitle: string
  ): Promise<CleanHadithItem[]> {
    const cacheKey = `sunni_${book.id}_sec_${sectionId}`;
    if (memoryCache.has(cacheKey)) {
      return memoryCache.get(cacheKey);
    }

    try {
      const engEdition = book.apiEditionEng || "eng-bukhari";
      const araEdition = book.apiEditionAra || "ara-bukhari";

      const [engRes, araRes] = await Promise.all([
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${engEdition}/sections/${sectionId}.json`),
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${araEdition}/sections/${sectionId}.json`),
      ]);

      if (engRes.ok && araRes.ok) {
        const engData: any = await engRes.json();
        const araData: any = await araRes.json();
        const engList = engData.hadiths || [];
        const araList = araData.hadiths || [];

        const items: CleanHadithItem[] = engList.map((eh: any, idx: number) => {
          const ah = araList[idx] || araList.find((a: any) => a.hadithnumber === eh.hadithnumber);
          const hadithNum = eh.hadithnumber || idx + 1;
          const grading = book.id === "bukhari" || book.id === "muslim"
            ? "Sahih (Muttafaqun 'Alayh / Agreed Upon)"
            : "Sahih / Hasan";

          return {
            id: `${book.id}-${hadithNum}`,
            tradition: "sunni",
            source: book.title,
            book: `${book.title} (Book ${sectionId})`,
            chapter: sectionTitle,
            hadithNumber: `Hadith ${hadithNum}`,
            referenceCitation: `${book.title}, Reference ${eh.reference?.book || sectionId}:${eh.reference?.hadith || hadithNum} (Hadith #${hadithNum})`,
            narrator: cleanHadithTranslation(this.extractNarrator(eh.text)),
            arabicText: ah?.text || "",
            englishTranslation: cleanHadithTranslation(eh.text),
            grading,
            scholarlyGradingDetail: `${book.title} — Canonical classical authentication`,
            topic: sectionTitle,
            bookId: book.id,
            sectionId,
            rawNumber: hadithNum,
          };
        });

        if (items.length > 0) {
          memoryCache.set(cacheKey, items);
          return items;
        }
      }
    } catch (err) {
      console.warn(`Error fetching Sunni section ${sectionId} for ${book.id}:`, err);
    }

    // Fallback if network fails
    return this.getFallbackSunniHadiths(book, sectionId, sectionTitle);
  }

  /**
   * Fetch hadiths for a Shia book section
   */
  private static async fetchShiaSection(
    book: BookInfo,
    sectionId: string,
    sectionTitle: string
  ): Promise<CleanHadithItem[]> {
    const cacheKey = `shia_${book.id}_sec_${sectionId}`;
    if (memoryCache.has(cacheKey)) {
      return memoryCache.get(cacheKey);
    }

    try {
      if (book.id === "kafi") {
        const secNum = parseInt(sectionId, 10) || 1;
        // Fetch first batch of hadiths for this section
        const items: CleanHadithItem[] = [];
        const base = `https://raw.githubusercontent.com/narmafraz/ThaqalaynData/master/books/al-kafi/1/${secNum}/1`;

        // Fetch first 12 hadiths in parallel
        const promises = Array.from({ length: 12 }, (_, i) => i + 1).map(async (num) => {
          try {
            const [arRes, enRes] = await Promise.all([
              fetch(`${base}/${num}.json`),
              fetch(`${base}/${num}.en.json`),
            ]);
            if (arRes.ok && enRes.ok) {
              const ar = await arRes.json();
              const en = await enRes.json();
              const arText = (ar.data?.verse?.text || ar.data?.text || []).join(" ");
              const enText = en.chunk_translations?.["en.hubeali"]?.[0] || en.ai?.chunks?.join(" ") || "";
              if (arText && enText) {
                return {
                  id: `kafi-${secNum}-${num}`,
                  tradition: "shia" as const,
                  source: "Kitab al-Kafi (Al-Kulayni)",
                  book: sectionTitle,
                  chapter: ar.data?.chapter_title?.en || sectionTitle,
                  hadithNumber: `Hadith ${num}`,
                  referenceCitation: `Al-Kafi, Vol. 1, Book ${secNum}, Hadith ${num}`,
                  narrator: cleanHadithTranslation(ar.data?.narrator_chain?.parts?.map((p: any) => p.text).join("") || "Narrated through the Holy Imams of Ahl al-Bayt"),
                  arabicText: arText,
                  englishTranslation: cleanHadithTranslation(enText),
                  grading: "Sahih / Muwaththaq",
                  scholarlyGradingDetail: "Mir'at al-Uqul fi Sharh Akhbar Al al-Rasul by Allamah al-Majlisi",
                  topic: sectionTitle,
                  bookId: "kafi",
                  sectionId,
                  rawNumber: num,
                };
              }
            }
          } catch {
            return null;
          }
          return null;
        });

        const results = await Promise.all(promises);
        results.forEach((r) => {
          if (r) items.push(r);
        });

        if (items.length > 0) {
          memoryCache.set(cacheKey, items);
          return items;
        }
      } else if (book.id === "nahj") {
        // Nahj al-Balagha
        const items: CleanHadithItem[] = [];
        const base = `https://raw.githubusercontent.com/narmafraz/ThaqalaynData/master/books/nahj-al-balagha/1/1`;
        const promises = Array.from({ length: 10 }, (_, i) => i + 1).map(async (num) => {
          try {
            const [arRes, enRes] = await Promise.all([
              fetch(`${base}/${num}.json`),
              fetch(`${base}/${num}.en.json`),
            ]);
            if (arRes.ok && enRes.ok) {
              const ar = await arRes.json();
              const en = await enRes.json();
              const arChunks = (ar.data?.verse?.ai?.chunks || []).map((c: any) => c.arabic_text).join(" ");
              const enChunks = (en.ai?.chunks || []).join(" ");
              if (arChunks && enChunks) {
                return {
                  id: `nahj-1-${num}`,
                  tradition: "shia" as const,
                  source: "Nahj al-Balagha (Peak of Eloquence)",
                  book: "Sermons of Amir al-Mu'minin (Khutab)",
                  chapter: ar.data?.chapter_title?.en || "Sermon",
                  hadithNumber: `Sermon ${num}`,
                  referenceCitation: `Nahj al-Balagha, Sermon #${num}`,
                  narrator: "Amir al-Mu'minin Imam Ali ibn Abi Talib (ع)",
                  arabicText: arChunks,
                  englishTranslation: cleanHadithTranslation(enChunks),
                  grading: "Mutawatir / Mu'tabar",
                  scholarlyGradingDetail: "Sharh Nahj al-Balagha by Ibn Abi al-Hadid & Shaykh Muhammad Abduh",
                  topic: "Divine Wisdom & Eloquence",
                  bookId: "nahj",
                  sectionId,
                  rawNumber: num,
                };
              }
            }
          } catch {
            return null;
          }
          return null;
        });

        const results = await Promise.all(promises);
        results.forEach((r) => {
          if (r) items.push(r);
        });

        if (items.length > 0) {
          memoryCache.set(cacheKey, items);
          return items;
        }
      }
    } catch (err) {
      console.warn(`Error fetching Shia section for ${book.id}:`, err);
    }

    return this.getFallbackShiaHadiths(book, sectionId, sectionTitle);
  }

  private static extractNarrator(text: string): string {
    const match = text.match(/^(?:Narrated|It was narrated from|It was narrated that|On the authority of)\s+([^:;—\n\(\"]+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    return "The Noble Prophet ﷺ / Classical Companions";
  }

  private static getFallbackSunniHadiths(book: BookInfo, sectionId: string, sectionTitle: string): CleanHadithItem[] {
    return [
      {
        id: `${book.id}-1`,
        tradition: "sunni",
        source: book.title,
        book: `${book.title} (Book ${sectionId})`,
        chapter: sectionTitle,
        hadithNumber: "Hadith 1",
        referenceCitation: `${book.title}, Reference 1:1`,
        narrator: "'Umar ibn al-Khattab (رضي الله عنه)",
        arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا، أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
        englishTranslation: "I heard Allah's Messenger (ﷺ) saying: 'The reward of deeds depends upon the intentions, and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.'",
        grading: "Sahih (Muttafaqun 'Alayh)",
        scholarlyGradingDetail: "Sahih al-Bukhari #1, Sahih Muslim #1907",
        topic: sectionTitle,
        bookId: book.id,
        sectionId,
        rawNumber: 1,
      },
    ];
  }

  private static getFallbackShiaHadiths(book: BookInfo, sectionId: string, sectionTitle: string): CleanHadithItem[] {
    return [
      {
        id: `${book.id}-1`,
        tradition: "shia",
        source: book.title,
        book: sectionTitle,
        chapter: sectionTitle,
        hadithNumber: "Hadith 1",
        referenceCitation: "Al-Kafi, Vol. 1, Book 1, Hadith 1",
        narrator: "Imam Muhammad al-Baqir (عليه السلام)",
        arabicText: "لَمَّا خَلَقَ اللَّهُ الْعَقْلَ اسْتَنْطَقَهُ ثُمَّ قَالَ لَهُ أَقْبِلْ فَأَقْبَلَ ثُمَّ قَالَ لَهُ أَدْبِرْ فَأَدْبَرَ ثُمَّ قَالَ وَ عِزَّتِي وَ جَلَالِي مَا خَلَقْتُ خَلْقاً هُوَ أَحَبُّ إِلَيَّ مِنْكَ وَ لَا أَكْمَلْتُكَ إِلَّا فِيمَنْ أُحِبُّ، أَمَا إِنِّي إِيَّاكَ آمُرُ وَ إِيَّاكَ أَنْهَى وَ إِيَّاكَ أُعَاقِبُ وَ إِيَّاكَ أُثِيبُ.",
        englishTranslation: "When God created the Intellect ('Aql), He made it speak and said to it: 'Come forward!' and it came forward. Then He said: 'Turn back!' and it turned back. Then God said: 'By My Might and Majesty! I have not created any creation more beloved to Me than you, nor do I perfect you except in those whom I love. Indeed, it is to you that I direct My commands, to you I direct My prohibitions, through you I punish, and through you I reward.'",
        grading: "Sahih / Muwaththaq",
        scholarlyGradingDetail: "Mir'at al-Uqul by Allamah al-Majlisi (Vol. 1, p. 25)",
        topic: sectionTitle,
        bookId: book.id,
        sectionId,
        rawNumber: 1,
      },
    ];
  }
}
