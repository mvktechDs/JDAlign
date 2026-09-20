import { describe, it, expect } from "vitest";
import { calculateDeterministicScore } from "@/lib/scoring/score-engine";
import { parseResume } from "@/lib/parsers/resume-parser";
import { parseJobDescription } from "@/lib/parsers/jd-parser";
import { normalizeWeights } from "@/lib/scoring/weights";

describe("Deterministic Scoring Engine & Dynamic Weight Normalization", () => {
  it("calculates high match for well-aligned candidate resume", () => {
    const resumeText = `
John Candidate
Skills: ReactJS, NodeJS, PostgreSQL, REST APIs, TypeScript, Docker
Work Experience:
Software Engineer (3 years)
Developed scalable full-stack applications using React, NextJS, Node.js, and PostgreSQL. Built RESTful APIs.
Education:
Bachelor of Science in Computer Science
    `;

    const jdText = `
Senior Full Stack Engineer
Required Skills:
Must have 2+ years experience with React, Node.js, PostgreSQL, REST API.
Preferred Skills:
Docker, AWS
Education:
Bachelor's degree in Computer Science required.
    `;

    const resume = parseResume(resumeText);
    const jd = parseJobDescription(jdText);
    const result = calculateDeterministicScore(resume, jd);

    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(result.scoreLabel).toBe("Strong Match");
    expect(result.matchedSkills.some((m) => m.canonicalName === "React")).toBe(true);
    expect(result.matchedSkills.some((m) => m.canonicalName === "Node.js")).toBe(true);
    expect(result.matchedSkills.some((m) => m.canonicalName === "PostgreSQL")).toBe(true);
    expect(result.missingRequiredSkills.length).toBe(0);
  });

  it("handles skill aliases canonicalization (ReactJS -> React, Postgres -> PostgreSQL, NodeJS -> Node.js)", () => {
    const resumeText = "Skills: ReactJS, Postgres, NodeJS, TS";
    const jdText = "Required skills: React, PostgreSQL, Node.js, TypeScript";

    const resume = parseResume(resumeText);
    const jd = parseJobDescription(jdText);
    const result = calculateDeterministicScore(resume, jd);

    expect(result.breakdown.requiredSkills.score).toBe(100);
    expect(result.missingRequiredSkills.length).toBe(0);
  });

  it("dynamically normalizes weights when education and experience requirements are omitted in JD", () => {
    const weights = normalizeWeights({
      hasRequiredSkills: true,
      hasExperienceReq: false, // Omitted in JD
      hasPreferredSkills: false, // Omitted in JD
      hasResponsibilities: true,
      hasProjects: true,
      hasEducationReq: false, // Omitted in JD
    });

    const sum =
      weights.requiredSkills +
      weights.experience +
      weights.preferredSkills +
      weights.responsibilities +
      weights.projects +
      weights.education;

    expect(Math.round(sum * 100) / 100).toBe(1);
    expect(weights.experience).toBe(0);
    expect(weights.education).toBe(0);
    expect(weights.requiredSkills).toBeGreaterThan(0.4);
  });

  it("guarantees final score is always between 0 and 100", () => {
    const resume = parseResume("Random unmatched content with no technical skills");
    const jd = parseJobDescription("Required: React, Docker, Kubernetes, AWS, Go, Rust");
    const result = calculateDeterministicScore(resume, jd);

    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });
});
