import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeminiProvider } from "@/lib/ai/gemini-provider";
import { AIAnalysisInput } from "@/types/ai";

// Mock @google/generative-ai
const mockGenerateContent = vi.fn();
vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent,
      })),
    })),
  };
});

// Mock env
vi.mock("@/lib/config/env", () => ({
  env: {
    GEMINI_API_KEY: "test_key_12345",
    GEMINI_MODEL: "gemini-2.5-flash",
    AI_TIMEOUT_MS: 500,
  },
}));

describe("GeminiProvider Unit Tests", () => {
  const dummyInput: AIAnalysisInput = {
    redactedResumeText: "Experienced Software Engineer with Node.js and React.",
    jobDescriptionText: "Seeking Full Stack Developer with React and Node.js.",
    structuredResume: {
      skills: ["React", "Node.js"],
      experienceMonths: 36,
      education: ["B.S. CS"],
      projects: ["Built web app"],
      rawText: "Experienced Software Engineer with Node.js and React.",
    },
    structuredJD: {
      roleTitle: "Full Stack Developer",
      requiredSkills: ["React", "Node.js"],
      preferredSkills: [],
      minExperienceMonths: 24,
      keywords: ["react", "node"],
    },
    deterministicResult: {
      overallScore: 90,
      matchedSkills: [
        { name: "React", canonicalName: "React", status: "MATCHED", foundInResume: true },
      ],
      missingRequiredSkills: [],
      missingPreferredSkills: [],
    },
  };

  const validResponsePayload = JSON.stringify({
    strengths: [{ title: "Strong React skills", explanation: "Verified in resume" }],
    gaps: [],
    recommendations: [
      {
        id: "rec-1",
        type: "highlight",
        title: "Emphasize React",
        recommendation: "Move React to top",
        reason: "Matches JD",
        safeToAdd: true,
        category: "SAFE_TO_IMPROVE",
      },
    ],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw GEMINI_API_KEY_MISSING if API key is unpopulated", async () => {
    const provider = new GeminiProvider();
    // Override key for test
    (provider as any).apiKey = "";
    await expect(provider.analyze(dummyInput)).rejects.toThrow("GEMINI_API_KEY_MISSING");
  });

  it("should return parsed Zod output on first successful attempt", async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: {
        text: () => validResponsePayload,
      },
    });

    const provider = new GeminiProvider();
    const result = await provider.analyze(dummyInput);

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(result.strengths.length).toBe(1);
    expect(result.recommendations.length).toBe(1);
  });

  it("should retry once on invalid JSON and succeed if second attempt returns valid output", async () => {
    mockGenerateContent
      .mockResolvedValueOnce({
        response: {
          text: () => "invalid json {{",
        },
      })
      .mockResolvedValueOnce({
        response: {
          text: () => validResponsePayload,
        },
      });

    const provider = new GeminiProvider();
    const result = await provider.analyze(dummyInput);

    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(result.strengths.length).toBe(1);
  });

  it("should fail after 2 unsuccessful attempts when JSON is consistently invalid", async () => {
    mockGenerateContent
      .mockResolvedValueOnce({
        response: { text: () => "not json 1" },
      })
      .mockResolvedValueOnce({
        response: { text: () => "not json 2" },
      });

    const provider = new GeminiProvider();
    await expect(provider.analyze(dummyInput)).rejects.toThrow("INVALID_JSON");
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it("should handle timeout correctly", async () => {
    mockGenerateContent.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    const provider = new GeminiProvider();
    await expect(provider.analyze(dummyInput)).rejects.toThrow("AI_TIMEOUT");
  });
});
