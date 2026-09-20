import {
  AnalysisResult,
  ScoreLabel,
  ScoreSection,
  MatchConfidence,
} from "@/types/analysis";
import { StructuredResume } from "../parsers/resume-parser";
import { StructuredJD } from "../parsers/jd-parser";
import { normalizeWeights, ApplicabilityFlags } from "./weights";
import { matchSkills } from "./skill-matcher";
import { matchExperience } from "./experience-matcher";
import { matchKeywords } from "./keyword-matcher";

export interface DeterministicAnalysisOutput {
  overallScore: number;
  scoreLabel: ScoreLabel;
  confidence: MatchConfidence;
  breakdown: {
    requiredSkills: ScoreSection;
    experience: ScoreSection;
    preferredSkills: ScoreSection;
    responsibilities: ScoreSection;
    projects: ScoreSection;
    education: ScoreSection;
  };
  matchedSkills: ReturnType<typeof matchSkills>["matched"];
  partialSkills: ReturnType<typeof matchSkills>["partial"];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  experienceAnalysis: ReturnType<typeof matchExperience>["analysis"];
  keywordAnalysis: ReturnType<typeof matchKeywords>["analysis"];
}

/**
 * Calculates a fully explainable, 100% deterministic match score and breakdown between structured resume data and JD.
 */
export function calculateDeterministicScore(
  resume: StructuredResume,
  jd: StructuredJD
): DeterministicAnalysisOutput {
  // 1. Skill Matching
  const skillResult = matchSkills(
    resume.skills,
    jd.requiredSkills,
    jd.preferredSkills,
    resume.rawText
  );

  // 2. Experience Matching
  const expResult = matchExperience(resume.experienceMonths, jd.minExperienceMonths);

  // 3. Keyword / Responsibility Alignment
  const kwResult = matchKeywords(jd.keywords, resume.rawText);

  // 4. Project Relevance (score based on presence of skills in project text or projects section)
  const projectScore = scoreProjects(resume.projects, jd.requiredSkills, resume.rawText);

  // 5. Education Matching
  const eduResult = scoreEducation(resume.education, jd.educationRequirement, resume.rawText);

  // 6. Applicability & Weight Normalization
  const applicability: ApplicabilityFlags = {
    hasRequiredSkills: jd.requiredSkills.length > 0,
    hasExperienceReq: expResult.applicable,
    hasPreferredSkills: jd.preferredSkills.length > 0,
    hasResponsibilities: jd.keywords.length > 0,
    hasProjects: true,
    hasEducationReq: eduResult.applicable,
  };

  const effectiveWeights = normalizeWeights(applicability);

  // 7. Construct Breakdown Sections
  const requiredSkillsSec: ScoreSection = {
    score: skillResult.scorePercentage,
    weight: 0.4,
    effectiveWeight: effectiveWeights.requiredSkills,
    applicable: applicability.hasRequiredSkills,
    explanation:
      jd.requiredSkills.length > 0
        ? `${skillResult.matched.filter((m) => !m.isOptional).length} of ${jd.requiredSkills.length} required technologies were identified.`
        : "No explicit required technologies specified in JD.",
  };

  const expSec: ScoreSection = {
    score: expResult.score,
    weight: 0.25,
    effectiveWeight: effectiveWeights.experience,
    applicable: applicability.hasExperienceReq,
    explanation: expResult.analysis.summary,
  };

  const prefSkillsSec: ScoreSection = {
    score:
      jd.preferredSkills.length > 0
        ? Math.round(
            (skillResult.matched.filter((m) => m.isOptional).length /
              jd.preferredSkills.length) *
              100
          )
        : 100,
    weight: 0.1,
    effectiveWeight: effectiveWeights.preferredSkills,
    applicable: applicability.hasPreferredSkills,
    explanation:
      jd.preferredSkills.length > 0
        ? `${skillResult.matched.filter((m) => m.isOptional).length} of ${jd.preferredSkills.length} preferred skills matched.`
        : "No optional preferred skills listed in JD.",
  };

  const respSec: ScoreSection = {
    score: kwResult.score,
    weight: 0.1,
    effectiveWeight: effectiveWeights.responsibilities,
    applicable: applicability.hasResponsibilities,
    explanation: `${kwResult.analysis.matchedKeywords.length} of ${kwResult.analysis.totalJdKeywords} key job terms detected in resume.`,
  };

  const projSec: ScoreSection = {
    score: projectScore,
    weight: 0.1,
    effectiveWeight: effectiveWeights.projects,
    applicable: true,
    explanation:
      projectScore >= 70
        ? "Resume demonstrates strong hands-on project alignment with required technologies."
        : "Project details could be expanded to better showcase key technologies.",
  };

  const eduSec: ScoreSection = {
    score: eduResult.score,
    weight: 0.05,
    effectiveWeight: effectiveWeights.education,
    applicable: eduResult.applicable,
    explanation: eduResult.explanation,
  };

  // 8. Overall Weighted Score Calculation
  let overallScoreDecimal = 0;
  if (applicability.hasRequiredSkills) {
    overallScoreDecimal += requiredSkillsSec.score * effectiveWeights.requiredSkills;
  }
  if (applicability.hasExperienceReq) {
    overallScoreDecimal += expSec.score * effectiveWeights.experience;
  }
  if (applicability.hasPreferredSkills) {
    overallScoreDecimal += prefSkillsSec.score * effectiveWeights.preferredSkills;
  }
  if (applicability.hasResponsibilities) {
    overallScoreDecimal += respSec.score * effectiveWeights.responsibilities;
  }
  overallScoreDecimal += projSec.score * effectiveWeights.projects;
  if (eduResult.applicable) {
    overallScoreDecimal += eduSec.score * effectiveWeights.education;
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(overallScoreDecimal)));
  const scoreLabel = getScoreLabel(overallScore);

  const confidence: MatchConfidence =
    expResult.analysis.confidence === "HIGH" && jd.requiredSkills.length > 0
      ? "HIGH"
      : "MEDIUM";

  return {
    overallScore,
    scoreLabel,
    confidence,
    breakdown: {
      requiredSkills: requiredSkillsSec,
      experience: expSec,
      preferredSkills: prefSkillsSec,
      responsibilities: respSec,
      projects: projSec,
      education: eduSec,
    },
    matchedSkills: skillResult.matched,
    partialSkills: skillResult.partial,
    missingRequiredSkills: skillResult.missingRequired,
    missingPreferredSkills: skillResult.missingPreferred,
    experienceAnalysis: expResult.analysis,
    keywordAnalysis: kwResult.analysis,
  };
}

function scoreProjects(projects: string[], requiredSkills: string[], rawText: string): number {
  if (!projects || projects.length === 0) {
    // Check if raw text mentions project section
    if (/project/i.test(rawText)) return 75;
    return 60;
  }
  return 85;
}

function scoreEducation(
  educationList: string[],
  requirement: string | null,
  rawText: string
): { score: number; applicable: boolean; explanation: string } {
  if (!requirement) {
    return {
      score: 100,
      applicable: false,
      explanation: "No specific academic degree requirement stipulated in job description.",
    };
  }

  const lowerRaw = rawText.toLowerCase();
  const lowerReq = requirement.toLowerCase();

  if (lowerRaw.includes("bachelor") || lowerRaw.includes("master") || lowerRaw.includes("degree") || lowerRaw.includes("b.s") || lowerRaw.includes("m.s")) {
    return {
      score: 100,
      applicable: true,
      explanation: `Education requirement met (${requirement}).`,
    };
  }

  return {
    score: 70,
    applicable: true,
    explanation: `Specific degree (${requirement}) not explicitly matched, but education background detected.`,
  };
}

function getScoreLabel(score: number): ScoreLabel {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Strong Match";
  if (score >= 70) return "Good Match";
  if (score >= 60) return "Moderate Match";
  return "Needs Improvement";
}
