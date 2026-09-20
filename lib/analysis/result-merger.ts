import { AnalysisResult } from "@/types/analysis";
import { DeterministicAnalysisOutput } from "../scoring/score-engine";
import { AIAnalysisOutput } from "@/types/ai";
import { generateFallbackRecommendations } from "../recommendations/fallback-recommendations";

export interface MergeParams {
  deterministic: DeterministicAnalysisOutput;
  aiOutput: AIAnalysisOutput | null;
  aiError?: string;
  processingTimeMs: number;
  requestId: string;
}

/**
 * Combines deterministic scoring engine outputs with AI recommendations (or rule-based fallbacks).
 */
export function mergeAnalysisResults(params: MergeParams): AnalysisResult {
  const { deterministic, aiOutput, aiError, processingTimeMs, requestId } = params;

  const isAiEnhanced = Boolean(aiOutput && !aiError);

  // Fallback generation if AI output is null/failed
  const fallback = generateFallbackRecommendations(deterministic);

  const strengths = isAiEnhanced && aiOutput?.strengths?.length
    ? deduplicateInsights([...aiOutput.strengths, ...fallback.strengths])
    : fallback.strengths;

  const gaps = isAiEnhanced && aiOutput?.gaps?.length
    ? deduplicateInsights([...aiOutput.gaps, ...fallback.gaps])
    : fallback.gaps;

  const recommendations = isAiEnhanced && aiOutput?.recommendations?.length
    ? [...aiOutput.recommendations, ...fallback.recommendations.filter((r) => r.category === "NEVER_FABRICATE")]
    : fallback.recommendations;

  // Deduplicate recommendations by id/title
  const uniqueRecommendations = deduplicateRecommendations(recommendations);

  // Categorized Honest Guidance bullets
  const safeToImprove = uniqueRecommendations
    .filter((r) => r.category === "SAFE_TO_IMPROVE")
    .map((r) => r.recommendation);

  const onlyAddIfTrue = uniqueRecommendations
    .filter((r) => r.category === "ONLY_ADD_IF_TRUE")
    .map((r) => r.recommendation);

  const neverFabricate = [
    "Never fabricate years of experience, employment dates, or job titles.",
    "Never add technologies or tools you have never worked with.",
    "Never invent project metrics or team sizes.",
    "Never claim certifications or degrees you have not earned.",
  ];

  return {
    overallScore: deterministic.overallScore,
    scoreLabel: deterministic.scoreLabel,
    confidence: deterministic.confidence,
    breakdown: deterministic.breakdown,
    matchedSkills: deterministic.matchedSkills,
    partialSkills: deterministic.partialSkills,
    missingRequiredSkills: deterministic.missingRequiredSkills,
    missingPreferredSkills: deterministic.missingPreferredSkills,
    strengths,
    gaps,
    recommendations: uniqueRecommendations,
    experienceAnalysis: deterministic.experienceAnalysis,
    keywordAnalysis: deterministic.keywordAnalysis,
    honestGuidance: {
      safeToImprove: safeToImprove.length > 0 ? safeToImprove : ["Reword existing experience to highlight JD keywords naturally."],
      onlyAddIfTrue: onlyAddIfTrue.length > 0 ? onlyAddIfTrue : ["Only list skills if you have genuine hands-on experience."],
      neverFabricate,
    },
    metadata: {
      aiEnhanced: isAiEnhanced,
      processingTimeMs,
      analyzedAt: new Date().toISOString(),
      requestId,
      ...(aiError ? { aiError } : {}),
    },
  };
}

function deduplicateInsights<T extends { title: string }>(insights: T[]): T[] {
  const seen = new Set<string>();
  return insights.filter((item) => {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deduplicateRecommendations<T extends { title: string }>(recs: T[]): T[] {
  const seen = new Set<string>();
  return recs.filter((item) => {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
