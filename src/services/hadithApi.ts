import { HadithBookMetadata, HadithSectionMetadata, HadithItem, HadithTradition } from "../types";
import { AUTHENTIC_HADITHS } from "../data/hadiths";

export interface HadithListResponse {
  hadiths: HadithItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  book: HadithBookMetadata | null;
  section?: HadithSectionMetadata | null;
}

export const HadithApi = {
  /**
   * Get all books for a tradition
   */
  async getBooks(tradition?: HadithTradition): Promise<HadithBookMetadata[]> {
    try {
      const url = tradition ? `/api/hadith/books?tradition=${tradition}` : "/api/hadith/books";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load books");
      const data = await res.json();
      return data.books || [];
    } catch (err) {
      console.warn("Falling back to local books catalog:", err);
      // Fallback local list
      const fallbackBooks: HadithBookMetadata[] = [
        {
          id: "bukhari",
          tradition: "sunni",
          title: "Sahih al-Bukhari",
          arabicTitle: "صَحِيحُ الْبُخَارِيّ",
          author: "Imam Muhammad ibn Isma'il al-Bukhari (d. 256 AH)",
          totalHadiths: 7563,
          totalSections: 97,
          description: "The most authentic book in Sunni Islam after the Holy Qur'an.",
          isMajorSix: true,
        },
        {
          id: "muslim",
          tradition: "sunni",
          title: "Sahih Muslim",
          arabicTitle: "صَحِيحُ مُسْلِم",
          author: "Imam Muslim ibn al-Hajjaj an-Naysaburi (d. 261 AH)",
          totalHadiths: 7500,
          totalSections: 56,
          description: "The second pillar of the two Sahihs (as-Sahihayn).",
          isMajorSix: true,
        },
        {
          id: "nawawi",
          tradition: "sunni",
          title: "Forty Hadith of an-Nawawi",
          arabicTitle: "الأَرْبَعُونَ النَّوَوِيَّة",
          author: "Imam Yahya ibn Sharaf an-Nawawi (d. 676 AH)",
          totalHadiths: 42,
          totalSections: 1,
          description: "Classical consensus collection of foundational authentic hadiths.",
        },
        {
          id: "qudsi",
          tradition: "sunni",
          title: "Forty Hadith Qudsi",
          arabicTitle: "الأَحَادِيثُ الْقُدْسِيَّة",
          author: "Prophetic Traditions with Direct Divine Revelation in Meaning",
          totalHadiths: 40,
          totalSections: 1,
          description: "Sacred hadiths wherein the Prophet ﷺ recounts the direct Speech of Allah.",
        },
        {
          id: "kafi",
          tradition: "shia",
          title: "Kitab al-Kafi",
          arabicTitle: "كِتَابُ الْكَافِي (أصول وفروع الكافي)",
          author: "Thiqat al-Islam Shaykh Muhammad ibn Ya'qub al-Kulayni (d. 329 AH)",
          totalHadiths: 16199,
          totalSections: 34,
          description: "The paramount canonical compendium of Shia hadith literature.",
        },
        {
          id: "nahj",
          tradition: "shia",
          title: "Nahj al-Balagha (Peak of Eloquence)",
          arabicTitle: "نَهْجُ الْبَلَاغَة",
          author: "Sharif al-Radi (Compiling Imam Ali ibn Abi Talib, d. 406 AH)",
          totalHadiths: 809,
          totalSections: 3,
          description: "Masterwork preserving sermons, letters, and wisdoms of Imam Ali.",
        },
      ];
      return fallbackBooks.filter((b) => !tradition || b.tradition === tradition);
    }
  },

  /**
   * Get chapters/sections for a book
   */
  async getSections(bookId: string): Promise<HadithSectionMetadata[]> {
    try {
      const res = await fetch(`/api/hadith/sections?book=${encodeURIComponent(bookId)}`);
      if (!res.ok) throw new Error("Failed to load sections");
      const data = await res.json();
      return data.sections || [];
    } catch (err) {
      console.warn("Falling back to local sections:", err);
      return [
        { id: "1", number: 1, title: "General Collection", hadithCount: 50, firstHadithNumber: 1, lastHadithNumber: 50 },
      ];
    }
  },

  /**
   * Get hadiths with pagination, book filtering, section filtering, hadith number, and search query
   */
  async getHadiths(params: {
    bookId: string;
    sectionId?: string;
    hadithNumber?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<HadithListResponse> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set("book", params.bookId);
      if (params.sectionId) searchParams.set("section", params.sectionId);
      if (params.hadithNumber) searchParams.set("hadithNumber", params.hadithNumber.toString());
      if (params.search) searchParams.set("q", params.search);
      if (params.page) searchParams.set("page", params.page.toString());
      if (params.limit) searchParams.set("limit", params.limit.toString());

      const res = await fetch(`/api/hadith/list?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch hadiths");
      const data = await res.json();
      if (Array.isArray(data.hadiths)) {
        data.hadiths = data.hadiths.map((h: any) => ({
          ...h,
          englishTranslation: (h.englishTranslation || "")
            .replace(/<sup[^>]*>\s*azwj\s*<\/sup>/gi, " (azwj)")
            .replace(/<sup[^>]*>(.*?)<\/sup>/gi, " ($1)")
            .replace(/<[^>]*>/g, "")
            .replace(/\bAllahazwj\b/gi, "Allah (azwj)")
            .replace(/\bAllah\s*azwj\b/gi, "Allah (azwj)")
            .replace(/Allahazwj([’']s)?/gi, (_, s) => s ? "Allah (azwj)'s" : "Allah (azwj)")
            .replace(/\bAllah\s*\(azwj\)/gi, "Allah (azwj)"),
          narrator: (h.narrator || "")
            .replace(/\bAllahazwj\b/gi, "Allah (azwj)")
            .replace(/\bAllah\s*azwj\b/gi, "Allah (azwj)")
        }));
      }
      return data;
    } catch (err) {
      console.warn("Falling back to static authentic hadiths:", err);
      const isShia = params.bookId === "kafi" || params.bookId === "nahj" || params.bookId === "khisal" || params.bookId === "thawab";
      const tradition: HadithTradition = isShia ? "shia" : "sunni";
      let filtered = AUTHENTIC_HADITHS.filter((h) => h.tradition === tradition);

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (h) =>
            h.englishTranslation.toLowerCase().includes(q) ||
            h.arabicText.includes(q) ||
            h.referenceCitation.toLowerCase().includes(q) ||
            h.narrator.toLowerCase().includes(q) ||
            h.topic.toLowerCase().includes(q)
        );
      }

      const limit = params.limit || 12;
      const page = params.page || 1;
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const paginated = filtered.slice((page - 1) * limit, page * limit);

      return {
        hadiths: paginated,
        total,
        page,
        limit,
        totalPages,
        book: {
          id: params.bookId,
          tradition,
          title: isShia ? "Kitab al-Kafi" : "Sahih al-Bukhari",
          arabicTitle: isShia ? "كِتَابُ الْكَافِي" : "صَحِيحُ الْبُخَارِيّ",
          author: isShia ? "Shaykh al-Kulayni" : "Imam al-Bukhari",
          totalHadiths: isShia ? 16199 : 7563,
          description: "Classical authentic compendium",
        },
      };
    }
  },
};
