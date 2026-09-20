import { Insight, Recommendation, SkillMatch } from "./analysis";

export interface AIAnalysisInput {
  redactedResumeText: string;
  jobDescriptionText: string;
  structuredResume: {
    skills: string[];
    experienceMonths: number | null;
    education: string[];
    projects: string[];
    rawText: string;
  };
  structuredJD: {
    roleTitle: string;
    requiredSkills: string[];
    preferredSkills: string[];
    minExperienceMonths: number | null;
    keywords: string[];
  };
  deterministicResult: {
    overallScore: number;
    matchedSkills: SkillMatch[];
    missingRequiredSkills: string[];
    missingPreferredSkills: string[];
  };
}

export interface AIAnalysisOutput {
  strengths: Insight[];
  gaps: Insight[];
  recommendations: Recommendation[];
  semanticSkillInsights?: {
    skillName: string;
    context: string;
  }[];
}

export interface AIProvider {
  analyze(input: AIAnalysisInput): Promise<AIAnalysisOutput>;
}
