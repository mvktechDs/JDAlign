import { ExperienceAnalysis, MatchConfidence } from "@/types/analysis";

export interface ExperienceMatchingResult {
  score: number; // 0 - 100
  analysis: ExperienceAnalysis;
  applicable: boolean;
}

/**
 * Evaluates candidate experience against JD experience requirements.
 */
export function matchExperience(
  resumeMonths: number | null,
  jdReqMonths: number | null
): ExperienceMatchingResult {
  if (jdReqMonths === null || jdReqMonths <= 0) {
    return {
      score: 100,
      applicable: false,
      analysis: {
        jdRequirementMonths: null,
        resumeMonths,
        differenceMonths: null,
        meetsRequirement: true,
        confidence: "MEDIUM",
        summary: "No explicit minimum experience duration requested in job description.",
      },
    };
  }

  if (resumeMonths === null || resumeMonths <= 0) {
    return {
      score: 50, // neutral assumption if extraction low confidence
      applicable: true,
      analysis: {
        jdRequirementMonths: jdReqMonths,
        resumeMonths: null,
        differenceMonths: null,
        meetsRequirement: null,
        confidence: "LOW",
        summary: `Experience alignment could not be determined confidently. Role requests at least ${formatMonths(jdReqMonths)}.`,
      },
    };
  }

  const diffMonths = resumeMonths - jdReqMonths;
  const meets = diffMonths >= 0;

  let score = 100;
  let summary = "";

  if (meets) {
    score = 100;
    summary = `Meets experience requirement (${formatMonths(resumeMonths)} demonstrated vs ${formatMonths(jdReqMonths)} required).`;
  } else {
    // Partial score proportional to shortfall
    const ratio = resumeMonths / jdReqMonths;
    score = Math.round(ratio * 100);
    score = Math.max(30, Math.min(95, score));
    const shortfall = Math.abs(diffMonths);
    summary = `Slight experience shortfall (~${formatMonths(shortfall)} below requested ${formatMonths(jdReqMonths)}).`;
  }

  return {
    score,
    applicable: true,
    analysis: {
      jdRequirementMonths: jdReqMonths,
      resumeMonths,
      differenceMonths: diffMonths,
      meetsRequirement: meets,
      confidence: "HIGH",
      summary,
    },
  };
}

function formatMonths(months: number): string {
  if (months < 12) return `${months} months`;
  const yrs = (months / 12).toFixed(1).replace(/\.0$/, "");
  return `${yrs} ${parseFloat(yrs) === 1 ? "year" : "years"}`;
}
