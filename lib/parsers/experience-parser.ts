import { MatchConfidence } from "@/types/analysis";

export interface ParsedExperience {
  rawValue: string | null;
  normalizedMonths: number | null;
  confidence: MatchConfidence;
  details?: string;
}

/**
 * Extracts and normalizes experience expressions from raw text into months.
 * Examples:
 * - "2 years" -> 24 months (HIGH confidence)
 * - "2+ years" -> 24 months (HIGH confidence)
 * - "2.5 years" -> 30 months (HIGH confidence)
 * - "24 months" -> 24 months (HIGH confidence)
 * - "3-5 years" -> 36 months (HIGH confidence, takes min)
 * - "at least 3 yrs" -> 36 months (HIGH confidence)
 */
export function parseExperience(text: string): ParsedExperience {
  if (!text || typeof text !== "string") {
    return { rawValue: null, normalizedMonths: null, confidence: "LOW" };
  }

  const normalized = text.toLowerCase();

  // Pattern 1: Months explicit (e.g. "24 months", "36 mo")
  const monthsRegex = /(?:at\s+least|min(?:imum)?|over|\+)?\s*(\d+(?:\.\d+)?)\s*(?:months?|mos?)\b/i;
  const monthMatch = normalized.match(monthsRegex);
  if (monthMatch && monthMatch[1]) {
    const months = Math.round(parseFloat(monthMatch[1]));
    return {
      rawValue: monthMatch[0],
      normalizedMonths: months,
      confidence: "HIGH",
      details: `${months} months explicit`,
    };
  }

  // Pattern 2: Year range (e.g. "2-4 years", "3 to 5 yrs")
  const rangeRegex = /(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?|yr)\b/i;
  const rangeMatch = normalized.match(rangeRegex);
  if (rangeMatch && rangeMatch[1]) {
    const minYears = parseFloat(rangeMatch[1]);
    const months = Math.round(minYears * 12);
    return {
      rawValue: rangeMatch[0],
      normalizedMonths: months,
      confidence: "HIGH",
      details: `Min ${minYears} years from range`,
    };
  }

  // Pattern 3: Years single value (e.g. "2+ years", "2.5 years", "minimum 3 yrs", "at least 5 years")
  const yearsRegex = /(?:at\s+least|min(?:imum)?|over|more\s+than|\+)?\s*(\d+(?:\.\d+)?)\s*(?:\+\s*)?(?:years?|yrs?|yr)\b/i;
  const yearMatch = normalized.match(yearsRegex);
  if (yearMatch && yearMatch[1]) {
    const years = parseFloat(yearMatch[1]);
    const months = Math.round(years * 12);
    return {
      rawValue: yearMatch[0],
      normalizedMonths: months,
      confidence: "HIGH",
      details: `${years} years`,
    };
  }

  // Fallback heuristic: search for isolated number preceding "years" in general context
  const genericMatch = normalized.match(/(\d+)\s*\+?\s*y/i);
  if (genericMatch && genericMatch[1]) {
    const years = parseInt(genericMatch[1], 10);
    return {
      rawValue: genericMatch[0],
      normalizedMonths: years * 12,
      confidence: "MEDIUM",
      details: `Inferred ${years} years`,
    };
  }

  return {
    rawValue: null,
    normalizedMonths: null,
    confidence: "LOW",
    details: "No explicit experience expression detected",
  };
}
