import { AnalysisResult } from "@/types/analysis";
import { validateUploadFile } from "../security/upload-validator";
import { parsePDF } from "../parsers/pdf-parser";
import { parseDOCX } from "../parsers/docx-parser";
import { parseResume } from "../parsers/resume-parser";
import { parseJobDescription } from "../parsers/jd-parser";
import { calculateDeterministicScore } from "../scoring/score-engine";
import { redactPII } from "../security/pii-redactor";
import { GeminiProvider } from "../ai/gemini-provider";
import { mergeAnalysisResults } from "./result-merger";
import { logger } from "../logger/logger";
import { env } from "../config/env";
import { AIAnalysisOutput } from "@/types/ai";

export interface AnalyzeOptions {
  file: File;
  buffer: Buffer;
  jobDescription: string;
  requestId: string;
}

export async function analyzeResumeAndJD(options: AnalyzeOptions): Promise<AnalysisResult> {
  const startTime = Date.now();
  const { file, buffer, jobDescription, requestId } = options;

  // 1. File Upload Validation
  const validation = validateUploadFile(file, buffer);
  if (!validation.valid) {
    throw new Error(`${validation.errorCode}: ${validation.errorMessage}`);
  }

  // 2. Job Description Validation
  const trimmedJd = (jobDescription || "").trim();
  if (!trimmedJd || trimmedJd.length < 150) {
    throw new Error(
      "INVALID_JOB_DESCRIPTION: Job description is too short. Please provide at least 150 characters for meaningful analysis."
    );
  }
  if (trimmedJd.length > 20000) {
    throw new Error(
      "INVALID_JOB_DESCRIPTION: Job description exceeds maximum length limit of 20,000 characters."
    );
  }

  // 3. Document Text Parsing (PDF or DOCX)
  let rawResumeText = "";
  if (validation.fileType === "pdf") {
    const pdfData = await parsePDF(buffer);
    rawResumeText = pdfData.text;
  } else if (validation.fileType === "docx") {
    const docxData = await parseDOCX(buffer);
    rawResumeText = docxData.text;
  } else {
    throw new Error("UNSUPPORTED_FILE_TYPE: Only PDF and DOCX files are supported.");
  }

  if (!rawResumeText || rawResumeText.trim().length < 50) {
    throw new Error("EMPTY_RESUME: Unable to extract readable text from the resume document.");
  }

  // 4. Structured Data Extraction
  const structuredResume = parseResume(rawResumeText);
  const structuredJD = parseJobDescription(trimmedJd);

  // 5. Deterministic Matching Engine
  const deterministicOutput = calculateDeterministicScore(structuredResume, structuredJD);

  // 6. PII Redaction before AI Layer
  const { redactedText } = redactPII(rawResumeText);

  // 7. Optional AI Provider Layer (Google Gemini)
  let aiOutput: AIAnalysisOutput | null = null;
  let aiError: string | undefined = undefined;

  const apiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || "";
  const providerType = process.env.AI_PROVIDER || env.AI_PROVIDER || "gemini";
  const isAiConfigured = Boolean(apiKey && apiKey.length > 5);

  if (isAiConfigured && providerType === "gemini") {
    try {
      const provider = new GeminiProvider();
      aiOutput = await provider.analyze({
        redactedResumeText: redactedText,
        jobDescriptionText: trimmedJd,
        structuredResume: {
          skills: structuredResume.skills,
          experienceMonths: structuredResume.experienceMonths,
          education: structuredResume.education,
          projects: structuredResume.projects,
          rawText: redactedText,
        },
        structuredJD: {
          roleTitle: structuredJD.roleTitle,
          requiredSkills: structuredJD.requiredSkills,
          preferredSkills: structuredJD.preferredSkills,
          minExperienceMonths: structuredJD.minExperienceMonths,
          keywords: structuredJD.keywords,
        },
        deterministicResult: {
          overallScore: deterministicOutput.overallScore,
          matchedSkills: deterministicOutput.matchedSkills,
          missingRequiredSkills: deterministicOutput.missingRequiredSkills,
          missingPreferredSkills: deterministicOutput.missingPreferredSkills,
        },
      });
    } catch (err: any) {
      aiError = err.message || "AI enhancement unavailable. Returned core deterministic analysis.";
      logger.warn({
        requestId,
        event: "ai_enhancement_failed_fallback_triggered",
        error: aiError,
      });
    }
  }

  const durationMs = Date.now() - startTime;

  // 8. Result Merger
  const finalResult = mergeAnalysisResults({
    deterministic: deterministicOutput,
    aiOutput,
    aiError,
    processingTimeMs: durationMs,
    requestId,
  });

  // 9. Safe Logging (No PII)
  logger.info({
    requestId,
    event: "analysis_completed",
    durationMs,
    fileType: validation.fileType,
    fileSizeBytes: buffer.length,
    aiEnhanced: finalResult.metadata.aiEnhanced,
    overallScore: finalResult.overallScore,
  });

  return finalResult;
}
