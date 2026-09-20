import { z } from "zod";

export type MatchStatus = "MATCHED" | "PARTIAL_MATCH" | "MISSING";
export type MatchConfidence = "HIGH" | "MEDIUM" | "LOW";
export type ScoreLabel =
  | "Excellent Match"
  | "Strong Match"
  | "Good Match"
  | "Moderate Match"
  | "Needs Improvement";

export interface SkillMatch {
  name: string;
  canonicalName: string;
  status: MatchStatus;
  foundInResume: boolean;
  resumeContext?: string;
  notes?: string;
  isOptional?: boolean;
}

export interface ScoreSection {
  score: number; // 0 - 100
  weight: number; // decimal e.g. 0.4
  effectiveWeight: number; // after dynamic weight normalization
  applicable: boolean;
  explanation: string;
}

export interface Insight {
  title: string;
  explanation: string;
  evidence?: string;
  severity?: "low" | "medium" | "high";
}

export type RecommendationType =
  | "rewrite"
  | "highlight"
  | "learn"
  | "clarify"
  | "quantify";

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  recommendation: string;
  reason: string;
  safeToAdd: boolean;
  category: "SAFE_TO_IMPROVE" | "ONLY_ADD_IF_TRUE" | "NEVER_FABRICATE";
  originalBullet?: string;
  suggestedRewrite?: string;
}

export interface ExperienceAnalysis {
  jdRequirementMonths: number | null;
  resumeMonths: number | null;
  differenceMonths: number | null;
  meetsRequirement: boolean | null;
  confidence: MatchConfidence;
  summary: string;
}

export interface KeywordAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  totalJdKeywords: number;
  coveragePercentage: number;
}

export const scoreSectionSchema = z.object({
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  effectiveWeight: z.number().min(0).max(1),
  applicable: z.boolean(),
  explanation: z.string(),
});

export const skillMatchSchema = z.object({
  name: z.string(),
  canonicalName: z.string(),
  status: z.enum(["MATCHED", "PARTIAL_MATCH", "MISSING"]),
  foundInResume: z.boolean(),
  resumeContext: z.string().optional(),
  notes: z.string().optional(),
  isOptional: z.boolean().optional(),
});

export const insightSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  evidence: z.string().optional(),
  severity: z.enum(["low", "medium", "high"]).optional(),
});

export const recommendationSchema = z.object({
  id: z.string(),
  type: z.enum(["rewrite", "highlight", "learn", "clarify", "quantify"]),
  title: z.string(),
  recommendation: z.string(),
  reason: z.string(),
  safeToAdd: z.boolean(),
  category: z.enum(["SAFE_TO_IMPROVE", "ONLY_ADD_IF_TRUE", "NEVER_FABRICATE"]),
  originalBullet: z.string().optional(),
  suggestedRewrite: z.string().optional(),
});

export const experienceAnalysisSchema = z.object({
  jdRequirementMonths: z.number().nullable(),
  resumeMonths: z.number().nullable(),
  differenceMonths: z.number().nullable(),
  meetsRequirement: z.boolean().nullable(),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  summary: z.string(),
});

export const keywordAnalysisSchema = z.object({
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  totalJdKeywords: z.number(),
  coveragePercentage: z.number(),
});

export const analysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  scoreLabel: z.enum([
    "Excellent Match",
    "Strong Match",
    "Good Match",
    "Moderate Match",
    "Needs Improvement",
  ]),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  breakdown: z.object({
    requiredSkills: scoreSectionSchema,
    experience: scoreSectionSchema,
    preferredSkills: scoreSectionSchema,
    responsibilities: scoreSectionSchema,
    projects: scoreSectionSchema,
    education: scoreSectionSchema,
  }),
  matchedSkills: z.array(skillMatchSchema),
  partialSkills: z.array(skillMatchSchema),
  missingRequiredSkills: z.array(z.string()),
  missingPreferredSkills: z.array(z.string()),
  strengths: z.array(insightSchema),
  gaps: z.array(insightSchema),
  recommendations: z.array(recommendationSchema),
  experienceAnalysis: experienceAnalysisSchema,
  keywordAnalysis: keywordAnalysisSchema,
  honestGuidance: z.object({
    safeToImprove: z.array(z.string()),
    onlyAddIfTrue: z.array(z.string()),
    neverFabricate: z.array(z.string()),
  }),
  metadata: z.object({
    aiEnhanced: z.boolean(),
    processingTimeMs: z.number(),
    analyzedAt: z.string(),
    requestId: z.string(),
    aiError: z.string().optional(),
  }),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
