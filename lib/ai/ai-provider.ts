import { AIAnalysisInput, AIAnalysisOutput } from "@/types/ai";

export interface AIProvider {
  analyze(input: AIAnalysisInput): Promise<AIAnalysisOutput>;
}
