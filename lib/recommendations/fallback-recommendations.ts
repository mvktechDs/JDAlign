import { Insight, Recommendation } from "@/types/analysis";
import { DeterministicAnalysisOutput } from "../scoring/score-engine";

export interface FallbackOutput {
  strengths: Insight[];
  gaps: Insight[];
  recommendations: Recommendation[];
}

/**
 * Generates rule-based strengths, gaps, and recommendations when AI enhancement is unavailable or fails.
 * Guarantees that core analysis remains 100% functional.
 */
export function generateFallbackRecommendations(
  deterministic: DeterministicAnalysisOutput
): FallbackOutput {
  const strengths: Insight[] = [];
  const gaps: Insight[] = [];
  const recommendations: Recommendation[] = [];

  let recIdCounter = 1;

  // 1. Evaluate Matched Skills Strengths
  const matchedRequired = deterministic.matchedSkills.filter((m) => !m.isOptional);
  if (matchedRequired.length > 0) {
    const topSkills = matchedRequired.slice(0, 4).map((m) => m.name).join(", ");
    strengths.push({
      title: "Strong Core Technology Alignment",
      explanation: `Your resume directly demonstrates experience with key requested technologies: ${topSkills}.`,
      evidence: `Identified in resume skills/experience text.`,
    });
  }

  // 2. Evaluate Experience Strength or Gap
  if (deterministic.experienceAnalysis.meetsRequirement === true) {
    strengths.push({
      title: "Sufficient Total Experience",
      explanation: deterministic.experienceAnalysis.summary,
    });
  } else if (deterministic.experienceAnalysis.meetsRequirement === false) {
    gaps.push({
      title: "Experience Shortfall",
      severity: "medium",
      explanation: deterministic.experienceAnalysis.summary,
    });

    recommendations.push({
      id: `rec-fallback-${recIdCounter++}`,
      type: "highlight",
      title: "Emphasize Relevant Impact",
      recommendation:
        "Since your total years of experience is slightly lower than requested, emphasize high-impact projects and direct technology ownership to demonstrate readiness.",
      reason: "Compensates for experience duration gaps by demonstrating depth.",
      safeToAdd: true,
      category: "SAFE_TO_IMPROVE",
    });
  }

  // 3. Evaluate Missing Required Skills
  if (deterministic.missingRequiredSkills.length > 0) {
    const topMissing = deterministic.missingRequiredSkills.slice(0, 3);
    gaps.push({
      title: `Missing Required Technologies (${topMissing.length})`,
      severity: "high",
      explanation: `The job description explicitly lists ${topMissing.join(", ")} as required, but these were not detected in your resume.`,
    });

    for (const missingSkill of topMissing) {
      recommendations.push({
        id: `rec-fallback-${recIdCounter++}`,
        type: "learn",
        title: `Address Missing Skill: ${missingSkill}`,
        recommendation: `If you have worked with ${missingSkill} in academic, personal, or side projects, ensure it is explicitly listed. Otherwise, consider completing a project or course.`,
        reason: `Required by job description.`,
        safeToAdd: false,
        category: "ONLY_ADD_IF_TRUE",
      });
    }
  }

  // 4. Evaluate Partial Skill Matches
  if (deterministic.partialSkills.length > 0) {
    for (const partial of deterministic.partialSkills) {
      recommendations.push({
        id: `rec-fallback-${recIdCounter++}`,
        type: "clarify",
        title: `Clarify ${partial.name} Context`,
        recommendation: partial.notes || `Clarify any hands-on exposure to ${partial.name}.`,
        reason: "Related experience detected.",
        safeToAdd: true,
        category: "SAFE_TO_IMPROVE",
      });
    }
  }

  // 5. Keyword Alignment Recommendation
  if (deterministic.keywordAnalysis.coveragePercentage < 60) {
    recommendations.push({
      id: `rec-fallback-${recIdCounter++}`,
      type: "rewrite",
      title: "Incorporate Industry Terminology Naturally",
      recommendation:
        "Consider using job-description terms naturally where they accurately describe your existing work.",
      reason: `Current keyword alignment is ${deterministic.keywordAnalysis.coveragePercentage}%.`,
      safeToAdd: true,
      category: "SAFE_TO_IMPROVE",
    });
  }

  // 6. Mandatory Ethical Warning Recommendation
  recommendations.push({
    id: `rec-fallback-${recIdCounter++}`,
    type: "clarify",
    title: "Honest Credential Integrity",
    recommendation:
      "Never claim experience, tools, or employment dates you do not have. Focus on highlighting genuine achievements.",
    reason: "JDAlign core principle.",

    safeToAdd: true,
    category: "NEVER_FABRICATE",
  });

  return {
    strengths,
    gaps,
    recommendations,
  };
}
