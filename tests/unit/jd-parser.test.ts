import { describe, it, expect } from "vitest";
import { parseJobDescription } from "@/lib/parsers/jd-parser";

describe("Job Description Parser Unit Tests", () => {
  it("should extract role title from top header line", () => {
    const jdText = `Senior Full Stack Engineer\nWe are hiring a Senior Full Stack Engineer...`;
    const parsed = parseJobDescription(jdText);
    expect(parsed.roleTitle).toBe("Senior Full Stack Engineer");
  });

  it("should classify required vs preferred skills based on section headers", () => {
    const jdText = `
Senior Software Engineer

Required Skills:
- React
- Node.js
- PostgreSQL

Preferred Skills / Nice to Have:
- Docker
- AWS
- Tailwind CSS
`;

    const parsed = parseJobDescription(jdText);
    expect(parsed.requiredSkills).toContain("React");
    expect(parsed.requiredSkills).toContain("Node.js");
    expect(parsed.requiredSkills).toContain("PostgreSQL");

    expect(parsed.preferredSkills).toContain("Docker");
    expect(parsed.preferredSkills).toContain("AWS");
    expect(parsed.preferredSkills).toContain("Tailwind CSS");

    // Optional/preferred skills MUST NOT be in required list
    expect(parsed.requiredSkills).not.toContain("Docker");
    expect(parsed.requiredSkills).not.toContain("AWS");
  });

  it("should parse minimum experience durations from various expressions", () => {
    expect(parseJobDescription("Requires 2+ years of experience in web dev.").minExperienceMonths).toBe(24);
    expect(parseJobDescription("3-5 years software engineering background.").minExperienceMonths).toBe(36);
    expect(parseJobDescription("Minimum 4 years working with Node.js.").minExperienceMonths).toBe(48);
    expect(parseJobDescription("At least 18 months of React experience.").minExperienceMonths).toBe(18);
  });

  it("should extract academic education requirements when stipulated", () => {
    const jdWithEdu = "Bachelor's degree in Computer Science or related field required.";
    const parsedWithEdu = parseJobDescription(jdWithEdu);
    expect(parsedWithEdu.educationRequirement).not.toBeNull();
    expect(parsedWithEdu.educationRequirement?.toLowerCase()).toContain("bachelor");

    const jdNoEdu = "We focus purely on practical skills and open source contributions.";
    const parsedNoEdu = parseJobDescription(jdNoEdu);
    expect(parsedNoEdu.educationRequirement).toBeNull();
  });
});
