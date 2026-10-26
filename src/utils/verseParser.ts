import { ALL_SURAHS } from "../data/surahs";
import { SurahInfo } from "../types";

export interface ParsedVerseRef {
  surahNumber: number;
  ayahNumber: number;
  surahName?: string;
  error?: string;
}

// Famous verse nicknames
const FAMOUS_VERSES: Record<string, { surah: number; ayah: number }> = {
  "ayatul kursi": { surah: 2, ayah: 255 },
  "ayat al kursi": { surah: 2, ayah: 255 },
  "ayat al-kursi": { surah: 2, ayah: 255 },
  "ayatulkursi": { surah: 2, ayah: 255 },
  "kursi": { surah: 2, ayah: 255 },
  "verse of the throne": { surah: 2, ayah: 255 },
  "verse of light": { surah: 24, ayah: 35 },
  "ayat an nur": { surah: 24, ayah: 35 },
  "ayat an-nur": { surah: 24, ayah: 35 },
  "ayatun nur": { surah: 24, ayah: 35 },
  "noor": { surah: 24, ayah: 35 },
  "fatiha": { surah: 1, ayah: 1 },
  "al fatiha": { surah: 1, ayah: 1 },
  "al-fatiha": { surah: 1, ayah: 1 },
  "the opening": { surah: 1, ayah: 1 },
};

/**
 * Normalizes text to facilitate loose matching across varied Arabic transliterations.
 */
export function normalizeSurahName(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[\u064B-\u065F\u0670]/g, "") // remove Arabic tashkeel
    .replace(/^سورة\s+/, "")
    .replace(/^(?:surah|sura|surat|chapter)\s+/i, "")
    .replace(/^(?:al-|an-|at-|as-|ash-|adh-|az-|ar-|aal-i-|aal-|ad-|ath-)/i, "")
    .replace(/^(?:al|an|at|as|ash|adh|az|ar|aal)\s+/i, "")
    .replace(/^(?:the)\s+/i, "")
    .replace(/['’`\-]/g, "")
    .replace(/aa/g, "a")
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")
    .replace(/ou/g, "u")
    .replace(/ah\b/g, "a")
    .replace(/h\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Finds a Surah by text (English name, translation, Arabic name, or partial match).
 */
export function findSurahByName(text: string): SurahInfo | null {
  const clean = text.trim();
  if (!clean) return null;

  const normalized = normalizeSurahName(clean);
  if (!normalized) return null;

  // 1. Direct match on normalized names
  for (const s of ALL_SURAHS) {
    const sNormEnglish = normalizeSurahName(s.englishName);
    const sNormTrans = normalizeSurahName(s.englishNameTranslation);
    const sArabicClean = s.name.replace(/[\u064B-\u065F\u0670]/g, "").replace(/^سورة\s+/, "").trim();

    if (
      sNormEnglish === normalized ||
      sNormTrans === normalized ||
      sArabicClean === clean ||
      s.englishName.toLowerCase() === clean.toLowerCase()
    ) {
      return s;
    }
  }

  // 2. Starts-with or includes match if string is sufficiently long (>= 3 chars)
  if (normalized.length >= 3) {
    for (const s of ALL_SURAHS) {
      const sNormEnglish = normalizeSurahName(s.englishName);
      const sNormTrans = normalizeSurahName(s.englishNameTranslation);

      if (
        sNormEnglish.startsWith(normalized) ||
        normalized.startsWith(sNormEnglish) ||
        sNormTrans.startsWith(normalized)
      ) {
        return s;
      }
    }
  }

  return null;
}

/**
 * Parses user input for Quran verse references in all common formats:
 * - "2:225" or "2:255"
 * - "2: 225" or "2 : 225"
 * - "2.225", "2, 225", "2-225", "2 225"
 * - "2:225 for surah Baqarah"
 * - "surah 2:225" or "surah 2 ayah 225"
 * - "Baqarah 225" or "Surah Baqarah 225"
 * - "Al-Baqarah:225" or "Al Baqarah 225"
 * - "225 Baqarah" or "225 in Baqarah"
 * - "Ayatul Kursi"
 * - "Baqarah" (defaults to ayah 1)
 */
export function parseVerseReference(
  rawInput: string,
  currentSurahNumber: number = 2
): ParsedVerseRef | null {
  const query = rawInput.trim();
  if (!query) return null;

  const lower = query.toLowerCase();

  // 1. Check famous verses alias table
  for (const [alias, target] of Object.entries(FAMOUS_VERSES)) {
    if (lower === alias || lower.includes(alias)) {
      const s = ALL_SURAHS.find((item) => item.number === target.surah);
      return {
        surahNumber: target.surah,
        ayahNumber: target.ayah,
        surahName: s?.englishName || `Surah ${target.surah}`,
      };
    }
  }

  // 2. Look for two explicit numbers (e.g. "2:225", "2: 225", "surah 2 ayah 225", "2:225 for surah Baqarah")
  // Regex looks for: [optional words] [num1] [separator/words] [num2]
  const twoNumbersMatch = query.match(
    /(?:surah\s*|sura\s*|chapter\s*)?(\d{1,3})[\s:,\.\-\/#]+(?:ayah\s*|verse\s*|aya\s*)?(\d{1,3})/i
  );

  if (twoNumbersMatch) {
    let num1 = parseInt(twoNumbersMatch[1], 10);
    let num2 = parseInt(twoNumbersMatch[2], 10);

    // Standard order: surah:ayah
    if (num1 >= 1 && num1 <= 114) {
      const surahObj = ALL_SURAHS.find((s) => s.number === num1);
      if (surahObj) {
        if (num2 < 1 || num2 > surahObj.numberOfAyahs) {
          return {
            surahNumber: num1,
            ayahNumber: num2,
            surahName: surahObj.englishName,
            error: `Surah ${surahObj.englishName} has ${surahObj.numberOfAyahs} ayahs. You entered ${num2}.`,
          };
        }
        return {
          surahNumber: num1,
          ayahNumber: num2,
          surahName: surahObj.englishName,
        };
      }
    }

    // If num1 > 114, check if the query was explicitly written as ayah:surah (e.g. "ayah 225 surah 2")
    const isExplicitlyReversed = /^(?:ayah|verse|aya)\b/i.test(query) || /\b(?:surah|sura|chapter)\s*\d+$/i.test(query);
    if (isExplicitlyReversed && num1 > 114 && num2 >= 1 && num2 <= 114) {
      const surahObj = ALL_SURAHS.find((s) => s.number === num2);
      if (surahObj) {
        if (num1 >= 1 && num1 <= surahObj.numberOfAyahs) {
          return {
            surahNumber: num2,
            ayahNumber: num1,
            surahName: surahObj.englishName,
          };
        }
        return {
          surahNumber: num2,
          ayahNumber: num1,
          surahName: surahObj.englishName,
          error: `Surah ${surahObj.englishName} has ${surahObj.numberOfAyahs} ayahs. You entered ${num1}.`,
        };
      }
    }

    if (num1 > 114) {
      return {
        surahNumber: num1,
        ayahNumber: num2,
        error: `Surah number must be between 1 and 114. You entered ${num1}.`,
      };
    }
  }

  // 3. Reversed text pattern: "verse 225 of surah 2" or "ayah 225 surah 2"
  const reversedMatch = query.match(
    /(?:ayah|verse|aya)\s*(\d{1,3})\s*(?:of|in|,|-)?\s*(?:surah|sura|chapter)?\s*(\d{1,3})/i
  );
  if (reversedMatch) {
    const ayahNum = parseInt(reversedMatch[1], 10);
    const surahNum = parseInt(reversedMatch[2], 10);
    if (surahNum >= 1 && surahNum <= 114) {
      const surahObj = ALL_SURAHS.find((s) => s.number === surahNum);
      if (surahObj) {
        if (ayahNum >= 1 && ayahNum <= surahObj.numberOfAyahs) {
          return {
            surahNumber: surahNum,
            ayahNumber: ayahNum,
            surahName: surahObj.englishName,
          };
        }
        return {
          surahNumber: surahNum,
          ayahNumber: ayahNum,
          surahName: surahObj.englishName,
          error: `Surah ${surahObj.englishName} has ${surahObj.numberOfAyahs} ayahs. You entered ${ayahNum}.`,
        };
      }
    }
  }

  // 4. Surah name + single number (e.g. "Baqarah 225", "Al-Baqarah: 225", "Surah Baqarah 225", "225 Baqarah")
  const singleNumMatch = query.match(/(\d{1,3})/);
  if (singleNumMatch) {
    const parsedNum = parseInt(singleNumMatch[1], 10);
    // Remove the number and common connector words to isolate the name part
    const textPart = query
      .replace(singleNumMatch[0], "")
      .replace(/[:,\.\-\/#]/g, " ")
      .replace(/\b(?:surah|sura|surat|ayah|verse|in|of|for|chapter)\b/gi, " ")
      .trim();

    if (textPart) {
      const foundSurah = findSurahByName(textPart);
      if (foundSurah) {
        if (parsedNum >= 1 && parsedNum <= foundSurah.numberOfAyahs) {
          return {
            surahNumber: foundSurah.number,
            ayahNumber: parsedNum,
            surahName: foundSurah.englishName,
          };
        }
        return {
          surahNumber: foundSurah.number,
          ayahNumber: parsedNum,
          surahName: foundSurah.englishName,
          error: `Surah ${foundSurah.englishName} has ${foundSurah.numberOfAyahs} ayahs. You entered ${parsedNum}.`,
        };
      }
    } else {
      // User only typed a single number (e.g. "2" or "255")
      if (parsedNum >= 1 && parsedNum <= 114) {
        const surahObj = ALL_SURAHS.find((s) => s.number === parsedNum);
        return {
          surahNumber: parsedNum,
          ayahNumber: 1,
          surahName: surahObj?.englishName,
        };
      }
      // If number is > 114, check if it's a valid ayah in the currently selected surah
      const currentSurah = ALL_SURAHS.find((s) => s.number === currentSurahNumber);
      if (currentSurah && parsedNum <= currentSurah.numberOfAyahs) {
        return {
          surahNumber: currentSurahNumber,
          ayahNumber: parsedNum,
          surahName: currentSurah.englishName,
        };
      }
    }
  }

  // 5. Surah name alone without numbers (e.g. "Baqarah", "Surah Yasin", "Kahf")
  const foundSurahOnly = findSurahByName(query);
  if (foundSurahOnly) {
    return {
      surahNumber: foundSurahOnly.number,
      ayahNumber: 1,
      surahName: foundSurahOnly.englishName,
    };
  }

  // Not recognized as a reference -> treated as a general keyword search
  return null;
}
