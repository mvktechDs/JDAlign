import { describe, it, expect } from "vitest";
import { generateFallbackRecommendations } from "@/lib/recommendations/fallback-recommendations";
import { DeterministicAnalysisOutput } from "@/lib/scoring/score-engine";

describe("Fallback Recommendations Unit Tests", () => {
  const dummyDeterministic: DeterministicAnalysisOutput = {
    overallScore: 72,
    scoreLabel: "Good Match",
    confidence: "HIGH",
    breakdown: {
      requiredSkills: { score: 75, weight: 0.4, effectiveWeight: 0.4, applicable: true, explanation: "" },
      experience: { score: 60, weight: 0.25, effectiveWeight: 0.25, applicable: true, explanation: "Shortfall of 12 months" },
      preferredSkills: { score: 100, weight: 0.1, effectiveWeight: 0.1, applicable: true, explanation: "" },
      responsibilities: { score: 50, weight: 0.1, effectiveWeight: 0.1, applicable: true, explanation: "" },
      projects: { score: 85, weight: 0.1, effectiveWeight: 0.1, applicable: true, explanation: "" },
      education: { score: 100, weight: 0.05, effectiveWeight: 0.05, applicable: true, explanation: "" },
    },
    matchedSkills: [
      { name: "React", canonicalName: "React", status: "MATCHED", foundInResume: true },
    ],
    partialSkills: [
      { name: "PostgreSQL", canonicalName: "PostgreSQL", status: "PARTIAL_MATCH", foundInResume: false, notes: "MySQL experience found" },
    ],
    missingRequiredSkills: ["Docker"],
    missingPreferredSkills: [],
    experienceAnalysis: {
      jdRequirementMonths: 36,
      resumeMonths: 24,
      differenceMonths: -12,
      meetsRequirement: false,
      confidence: "HIGH",
      summary: "Slight experience shortfall (~1.0 year below requested 3 years).",
    },
    keywordAnalysis: {
      matchedKeywords: ["react"],
      missingKeywords: ["docker", "ci/cd"],
      totalJdKeywords: 3,
      coveragePercentage: 33,
    },
  };

  it("should generate missing required skill recommendation with ONLY_ADD_IF_TRUE category", () => {
    const fallback = generateFallbackRecommendations(dummyDeterministic);

    const dockerRec = fallback.recommendations.find((r) => r.title.includes("Docker"));
    expect(dockerRec).toBeDefined();
    expect(dockerRec?.category).toBe("ONLY_ADD_IF_TRUE");
    expect(dockerRec?.safeToAdd).toBe(false);
  });

  it("should generate experience shortfall recommendation advising depth without fabricated duration", () => {
    const fallback = generateFallbackRecommendations(dummyDeterministic);

    const expGap = fallback.gaps.find((g) => g.title.includes("Experience Shortfall"));
    expect(expGap).toBeDefined();

    const expRec = fallback.recommendations.find((r) => r.title.includes("Emphasize Relevant Impact"));
    expect(expRec).toBeDefined();
    expect(expRec?.category).toBe("SAFE_TO_IMPROVE");
  });

  it("should always include mandatory ethical warning with NEVER_FABRICATE category", () => {
    const fallback = generateFallbackRecommendations(dummyDeterministic);

    const ethicalRec = fallback.recommendations.find((r) => r.category === "NEVER_FABRICATE");
    expect(ethicalRec).toBeDefined();
    expect(ethicalRec?.recommendation.toLowerCase()).toContain("never claim experience");
  });
});
