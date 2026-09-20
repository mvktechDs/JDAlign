import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider } from "./ai-provider";
import { AIAnalysisInput, AIAnalysisOutput } from "@/types/ai";
import { SYSTEM_PROMPT, buildAnalysisPrompt } from "./prompts";
import { aiOutputSchema } from "./schemas";
import { env } from "../config/env";
import { logger } from "../logger/logger";

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private modelName: string;
  private timeoutMs: number;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || "";
    this.modelName = process.env.GEMINI_MODEL || env.GEMINI_MODEL || "gemini-3.6-flash";
    this.timeoutMs = Number(process.env.AI_TIMEOUT_MS) || env.AI_TIMEOUT_MS || 25000;
  }

  async analyze(input: AIAnalysisInput): Promise<AIAnalysisOutput> {
    const apiKey = process.env.GEMINI_API_KEY || this.apiKey;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY_MISSING: Gemini API key is not configured.");
    }

    const modelName = process.env.GEMINI_MODEL || this.modelName;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const basePromptText = buildAnalysisPrompt(input);
    const correctionNotice = `

CRITICAL CORRECTION INSTRUCTION (ATTEMPT 2):
Your previous response did not match the required JSON schema.
Return ONLY valid JSON.
Do not include markdown.
Do not include code fences.
Do not include commentary.
Do not omit required properties.
Follow the supplied schema exactly.`;

    let lastError: Error | null = null;
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const currentPrompt = attempt === 1 ? basePromptText : basePromptText + correctionNotice;

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`AI_TIMEOUT: Gemini request timed out after ${this.timeoutMs}ms`));
        }, this.timeoutMs);
      });

      try {
        const apiCall = model.generateContent(currentPrompt);
        const result = (await Promise.race([apiCall, timeoutPromise])) as any;

        const responseText = result.response?.text();
        if (!responseText) {
          throw new Error("EMPTY_AI_RESPONSE: Gemini returned empty content.");
        }

        let rawJson: unknown;
        try {
          rawJson = JSON.parse(responseText);
        } catch {
          throw new Error("INVALID_JSON: AI response was not valid JSON.");
        }

        const parsedOutput = aiOutputSchema.safeParse(rawJson);
        if (!parsedOutput.success) {
          logger.warn({
            event: "ai_output_schema_mismatch",
            attempt,
            error: parsedOutput.error.message,
          });
          throw new Error("INVALID_AI_SCHEMA: AI response did not match expected output schema.");
        }

        return parsedOutput.data;
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Retry structural schema errors and transient server/demand errors (e.g. 503, 429)
        const isRetryableError =
          lastError.message.includes("INVALID_JSON") ||
          lastError.message.includes("INVALID_AI_SCHEMA") ||
          lastError.message.includes("EMPTY_AI_RESPONSE") ||
          lastError.message.includes("503") ||
          lastError.message.includes("429") ||
          lastError.message.includes("high demand") ||
          lastError.message.includes("Service Unavailable") ||
          lastError.message.includes("fetch failed");

        if (!isRetryableError || attempt >= maxAttempts) {
          logger.error({
            event: "gemini_provider_failed",
            attempt,
            error: lastError.message,
          });
          throw lastError;
        }

        logger.warn({
          event: "gemini_provider_retrying",
          attempt,
          nextAttempt: attempt + 1,
          reason: lastError.message,
        });

        // Delay 1 second before retrying transient/structural errors
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw lastError || new Error("ANALYSIS_FAILED: Gemini provider execution failed.");
  }
}

