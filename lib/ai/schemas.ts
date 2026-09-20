import { z } from "zod";

export const aiInsightSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  evidence: z.string().optional(),
  severity: z.enum(["low", "medium", "high"]).optional(),
});

export const aiRecommendationSchema = z.object({
  id: z.string().default(() => `rec_${Math.random().toString(36).substring(2, 9)}`),
  type: z.enum(["rewrite", "highlight", "learn", "clarify", "quantify"]),
  title: z.string(),
  recommendation: z.string(),
  reason: z.string(),
  safeToAdd: z.boolean().default(true),
  category: z.enum(["SAFE_TO_IMPROVE", "ONLY_ADD_IF_TRUE", "NEVER_FABRICATE"]),
  originalBullet: z.string().optional(),
  suggestedRewrite: z.string().optional(),
});

export const aiOutputSchema = z.object({
  strengths: z.array(aiInsightSchema).default([]),
  gaps: z.array(aiInsightSchema).default([]),
  recommendations: z.array(aiRecommendationSchema).default([]),
});

export type AIOutputValidated = z.infer<typeof aiOutputSchema>;
