import { KeywordAnalysis } from "@/types/analysis";

export function matchKeywords(
  jdKeywords: string[],
  resumeText: string
): { score: number; analysis: KeywordAnalysis } {
  if (!jdKeywords || jdKeywords.length === 0) {
    return {
      score: 100,
      analysis: {
        matchedKeywords: [],
        missingKeywords: [],
        totalJdKeywords: 0,
        coveragePercentage: 100,
      },
    };
  }

  const lowerResume = (resumeText || "").toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of jdKeywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#])${escaped}(?:$|[^a-zA-Z0-9+#])`, "i");
    if (regex.test(lowerResume)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const total = jdKeywords.length;
  const coveragePercentage = Math.round((matched.length / total) * 100);

  return {
    score: coveragePercentage,
    analysis: {
      matchedKeywords: matched,
      missingKeywords: missing,
      totalJdKeywords: total,
      coveragePercentage,
    },
  };
}
